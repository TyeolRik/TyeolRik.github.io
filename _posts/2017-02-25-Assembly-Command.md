---
layout: post
title: "어셈블리 명령어 정리"
section-type: post
category: Assembly
tags:
  - reversing
  - assembly
  - debug
  - command
  - helloworld
---

<font align="center"> Reversing을 공부하면서 체득한(?) 어셈블리 명령어를 정리하는 공간입니다. <br /> 완전한 문서가 아니며, 지속적인 업데이트를 하고 있습니다. </font>

## A

### ARPL :: Adjust RPL Field of Segment Selector

이용예시: ARPL \[Dest\] \[Src\] <br />
Dest의 RPL[^1] 필드와 Src의 RPL 필드를 서로 비교한다. Dest의 RPL 값이 Src보다 작으면, ZF(Zero Flag)의 값은 1이 되고, Dest의 RPL 값은 Src의 RPL 값으로 동일하게 된다. ~~권한 하락이 된다는 의미인것 같다.~~ 이것을 코드로 표현하면 아래와 같다.

```java
if(Destination.RPL < Source.RPL) {
	ZF = 1;
	Destination.RPL = Source.RPL;
} else
    ZF = 0;
```

## C

### CALL

이용예시: CALL \[함수주소\] <br />
위와 같이 사용하면, 다음 명령은 함수주소에 있는 명령어를 실행한다. JMP(Jump) 명령어와 다른 점은 콜백(Callback) 주소를 스택에 저장한다는 점이다. CALL 명령어를 사용하면, CALL 명령어 다음의 명령어 주소를 스택에 저장하고 피연산자인 함수주소로 넘어간다.

### CMP

이용예시: CMP \[Dest\] \[Src\] <br />
위의 명령어는 \[Dest\] - \[Src\] 과 같다. 이 연산의 결과는 ZF(Zero Flag)에만 영향을 미칠 뿐, Operand 자체에는 영향을 미치지 않는다. 이 명령어를 통해서 Dest와 Src가 완전히 같은지를 알 수 있으며, Dest - Src = 0 (완전히 같다)라면 ZF = 1 이 된다. 보통 JE 명령어와 함께 쓰인다.

## D

### DEC

이용예시: DEC EAX <br />
위의 명령어 의미는, EAX의 값을 1빼서 EAX에 저장하라는 의미이다.

## I

### INC

이용예시: INC EAX <br />
위의 명령어 의미는, EAX의 값을 1더해서 EAX에 저장하라는 의미이다.

## M

### MOV

이용예시: MOV \[Dest\] \[Src\] <br />
위의 명령어 의미는, Src의 값을 Dest 값으로 복사해서 붙여넣으라는 의미이다. 그렇다면 \[Dest\] == \[Src\] 가 되겠지? MOV에는 아주 흥미로운 부분이 있는데 MOV EDI, EDI 라는 의미없는 명령어를 항상 Windows DLL 파일이 시작될 때 실행된다. [Hot patch point][8420f58e] 라는 이유 때문이다. 왜 MOV EDI, EDI를 사용했는지는 [링크][f0b868f0]에 자세하게 나와있다. 추후에 이에 대해서 포스팅하기로 하겠다.

## P

### POP

이용예시: POP EBP <br />
스택에서 하나를 POP 해서 EBP에 저장하라는 의미이다. 스택은 LIFO 구조이기 때문에 스택의 가장 마지막에 넣은 값이 POP 된다.


### PTR

### PUSH

이용예시: PUSH EBP <br />
EBP에 있는 값을 스택에 집어넣는다는 의미이다. 스택은 LIFO 구조라는 것을 명심하자.

## T

### TEST

이용예시: TEST \[Operand 1\] \[Operand 2\]<br />
위의 명령어 의미는, \[Operand 1\]과 \[Operand 2\]를 AND 연산 하라는 것이다. 이 연산의 결과는 ZF에만 영향을 미치고 Operand 자체에는 영향을 미치지 않는다. 보통 TEST EAX, EAX의 식으로 많이 사용하는데, EAX의 값이 0인지 확인할 때 사용된다. (0일 때만 결과값이 0이 나올테니깐 말이다.) 만약 TEST의 연산결과가 0이라면 ZF는 1로, 연산결과가 1이라면 ZF는 0으로 세트된다.




<br /><br /><br />

[^1]: RPL이란 Request Privilege Level의 준말로 디스크립터를 통한 요청시의 권한이라고 번역할 수 있다. 세그먼트 레지스터 안에 있는 값이며 요구 특권 레벨 값이라고 할 수 있다. $00_{(2)}$ ~ $11_{(2)}$까지 해서 0은 최대권한, 3은 최소권한 이다.

  [8420f58e]: http://blog.naver.com/iwillhackyou/110066358544

  [f0b868f0]: https://blogs.msdn.microsoft.com/oldnewthing/20110921-00/?p=9583 "MSDN"
