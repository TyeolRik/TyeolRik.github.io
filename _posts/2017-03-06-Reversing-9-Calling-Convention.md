---
layout: post
title: "함수 호출 규약 (Calling Convention)"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - theory
  - calling_convention
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## 함수 호출 규약 ::  Calling Convention

> 함수 호출 규약 (Calling Convention) 함수(subroutine, callee)가 어떻게 인자를 전달받고 결과값을 반환하는지에 대한 로우레벨에서의 규칙이다.

함수를 호출하기 전에 스택을 통해서 필요한 Parameter를 전달한다. 예를 들면 아래와 같은 소스코드에서 볼 수 있다.

```asm
00403327   .  52            PUSH EDX
00403328   .  50            PUSH EAX
00403329   .  FF15 58104000 CALL [<&MSVBVM60.__vbaVarTstEq>]         ;  MSVBVM60.__vbaVarTstEq
```

vbaVarTstEq 라는 함수는 2개의 Parameter를 전달받는데 EDX 안에 있는 값과 EAX 안에 있는 값을 전달받기 위해서 Stack에 Push 하기로 한다.

스택 메모리는 프로세스에서 정의된 메모리 공간이다. 그 크기는 PE 헤더에 명시되어 있기 때문에, 프로세스가 실행될 때 스택 메모리의 크기가 결정된다. 즉, 스택 메모리의 크기는 고정되어 있다. ESP로 스택의 현재 위치를 가리키는데, ESP가 스택 메모리의 끝을 가리킨다면, 그 이상 스택을 사용할 수 없다. (Push가 안된다.) 고로, ESP가 스택 메모리의 끝을 가리키지 않도록 잘 관리해야하는데 그것에 대한 약속을 함수 호출 규약이라고 한다.

#### 참고사항

스택은 아랫방향(주소가 감소하는 방향)으로 자란다. 메모리 상으로 볼 때, PUSH 된다면 ESP의 주소값이 증가하는 것이 아닌 감소하게 된다. 고로, 스택을 정리하려면 ESP 값에 숫자를 더하면 된다. (스택의 특성상, 위에 덮어쓰기 할테니깐 더하기만 하면 스택 포인터가 앞으로 간다.)

### 호출규약 1. cdecl

cdecl은 C declaration를 의미한다. 단어에서 알 수 있듯이, 주로 C언어에서 사용되는 방식이며 대부분의 일반 어플리케이션과 [정적 라이브러리][8a976efc]에서 사용되는 방식이다. **Caller(함수를 호출한 쪽)에서 스택을 정리하는 특징**이 있다.

다음은 위키피디아에서 예시로 든 소스코드[^1]이다. 참고사항으로 알아봐두면 좋다. 이 소스코드에서 표현하고 싶은 것은 Caller 쪽에서 함수의 호출이 끝난 이후에 (리턴을 받고) ESP의 주소값을 증가함으로써 스택을 정리한다는 것이다.

```c
int callee(int, int, int);

int caller(void)
{
	int ret;

	ret = callee(1, 2, 3);
	ret += 5;
	return ret;
}
```

위의 소스코드를 컴파일하면 아래의 어셈블리 코드가 나온다. 아래의 어셈블리 코드에서 서브루틴[^2]이라는 단어가 나오는데, 이것은 (리턴값이 없는) 함수라는 의미이다. 그러나, C나 Perl 같은 상위언어(?)는 함수와 서브루틴을 따로 구별하지 않는다.

```asm
caller:
	; 새로운 스택 프레임을 만든다.
	push    ebp
	mov     ebp, esp
	; 매개변수(Parameter)를 스택에 푸시한다. (매개변수 전달)
	push    3
	push    2
	push    1
	; 서브루틴인 callee 함수를 Call 한다.
	call    callee
	; 매개변수를 스택에서 제거하자. (int == 4(byte) * 3(개))
	add     esp, 12
	; 서브루틴(Callee)의 리턴값을 사용하자. 리턴값은 EAX 안에.
	add     eax, 5
	; 스택 프레임 기법으로 함수 호출이 끝났으니 원래 위치로 돌아오자
	pop     ebp
	; 리턴 명령어
	ret
```

### 호출규약 2. stdcall

stdcall 호출 규약은 마이크로소프트 Win32 API 및 오픈 왓콤 C++의 표준 호출 규약이다. 스택은 Callee(피호출자) 쪽에서 정리된다. 매개변수는 오른쪽에서 왼쪽 순으로 스택 위로 푸시된다. 레지스터 EAX, ECX, EDX는 함수 내에 사용되도록 규정된다. 반환값은 EAX 레지스터에 저장된다.

stdcall은 가변인자(printf 같은 것)를 지원하지 않는다. 왜냐하면 stdcall은 Callee 쪽에서 스택을 정리하기 때문이다. Callee 쪽에서는 가변 인자의 스택크기를 모르기 때문이다.

Win32 API 함수에서 주로 사용하는 호출 규약이다. WINAPI 라는 단어를 코드에서 봤다면 stdcall을 사용한다고 생각해도 좋을 정도이다. DLL 파일을 만들 때, stdcall로 선언해야한다. 왜냐하면 다른 언어에서 API를 호출할 때 호환성을 좋게하기 위함이다. C언어에서는 stdcall을 사용하려면 아래처럼 함수를 선언하기 전에 호출규약을 명시해야한다.

```c
int __stdcall sumExample (int a, int b);
```

stdcall은 cdecl보다 빠르다는 장점이 있다. 왜냐하면 스택을 정리하는 코드가 없어지기 때문에 명령어 한줄이 작아지니깐 실행크기도 작아지고 속도도 빨라지는 장점이 생긴다. 그러나 Caller에서 하든 Callee에서 하든 **둘다 똑같이 스택을 해제하는데 왜 Callee에서 스택을 해제하는 것이 더 빠르냐**는 의구심이 들 수 있다. 바로 RETN 이라는 새로운 8086(Intel x86 CPU)의 명령어 때문이다. 다음의 소스코드에서 확인해보자. (아까 cdecl에서 언급한 소스코드이다.)

```asm
; 호출규약 :: cdecl
; 매개변수를 스택에서 제거하자. (int == 4(byte) * 3(개))
add     esp, 12
; 서브루틴(Callee)의 리턴값을 사용하자. 리턴값은 EAX 안에.
add     eax, 5
; 스택 프레임 기법으로 함수 호출이 끝났으니 원래 위치로 돌아오자
pop     ebp
; 리턴 명령어
ret
```

위의 소스코드에서 보면 ret 라는 명령어로 함수를 탈출했다. 그리고 탈출하기 전에 ADD ESP, 12 라는 명령어를 통해서 스택을 정리하기도 해야했다. 하지만, stdcall에서는 RETN 이라는 명령어를 이용해서 RETN 12 라는 명령어를 사용하면 RET + POP 12 가 되기 때문에 명령어의 라인 수도 줄고 바이트 수(용량)도 줄어든다.

### 호출규약 3. fastcall

기본적으로 스택을 정리하는 부분에 있어서 stdcall이랑 같다. 그러나, 함수에 전달하는 Parameter의 일부(2개까지)를 스택 메모리가 아닌 레지스터를 이용해서 전달한다. 어떤 함수의 Parameter가 5개라면 2개는 ECX, EDX를 이용해서 전달하고, 나머지 3개는 스택 메모리로 전달하게 된다.

fastcall은 이름 그대로 빠른 함수 호출이 가능하다. 스택메모리는 아무래도 RAM에 존재하고 ECX와 EDX와 같은 레지스터는 CPU 차원의 메모리다보니 레지스터에 접근하는 것이 훨씬 빠르다. (그러나 ECX, EDX 레지스터를 관리하는 추가적인 오버헤드가 필요할 수도 있다.)

단점은 아무래도 ECX, EDX라는 레지스터를 이용하다보니 ECX와 EDX에 중요한 값이 저장되어 있다면 백업을 해놓아야한다. 함수내용이 복잡해서 ECX와 EDX를 다른 용도로 사용할 필요가 있을 때에도 Parameter 값을 따로 저장해야한다.

<br /><br /><br />

[^1]: 출처: https://en.wikipedia.org/wiki/X86_calling_conventions#cdecl

[^2]: 일부 프로그래밍 언어에서는 함수와 서브루틴을 구분하기도 한다. 파스칼이나 포트란과 같은 언어는 반환값이 없는 경우를 서브루틴, 반환값이 있는 경우를 함수로 부른다. 반면 C 등의 언어에서는 함수와 서브루틴이 동의어이다. 출처: [위키피디아][c273ae07]

  [8a976efc]: https://ko.wikipedia.org/wiki/%EC%A0%95%EC%A0%81_%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC "KOR-wiki"
  [c273ae07]: https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98_(%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D) "KOR-wiki"
