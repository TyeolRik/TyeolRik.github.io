---
layout: post
title: "abex 2st crackme 분석/해결"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - crackme
  - abex
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## abex' 2st crackme 분석

일단 밑도끝도 없이 실행을 해봤다.

![Imgur](http://i.imgur.com/Q56LZNe.png)

Name과 Serial 부분에 아무 값이나 적어서 Check 버튼을 눌러보았다. (어떤 에러 메세지가 출력되는지, 어떤 결과값이 도출되는지를 알아보기 위함이다.)

![Imgur](http://i.imgur.com/gW5l3KZ.png)

에러메세지는 "Nope, this serial is worng!" 이다. 이 에러메세지는 나중에 디버거에서 유용하게 쓰일 수 있을 것 같다. (왜냐하면, 에러메세지를 출력하는 주소(또는 함수) 근처에 비밀번호가 맞는지 아닌지를 검사하거나 체크하는 명령문이 존재할 수 있기 때문이다.)

여기까지가 우리가 단순히 실행을 통해서 알아낼 수 있는 정보의 모든 것이다. 이제 OllyDbg로 이 실행파일을 열어보자. 이 파일은 버튼을 통해서 다음 함수 ~~어떤 함수가 있는지는 모르겠지만, 최소한 Name과 Serial 값을 전달하고 암호를 검사하는 함수 정도는 있겠지~~가 실행될 것이기 때문에 OllyDbg 또한 특정 명령어 이후는 수행되지 않는다. 그러므로 우리는 OllyDbg로 한줄 단위로 디버깅을 해서 알아보는 방법보다는 바로 목표 값을 찾아보도록 하자.

마우스 우클릭 - Search for - All referenced text strings 를 이용해서 일단 저 에러메세지를 찾아보자. 다른 DLL 파일이나 함수 안에 저 문장을 숨겨놓으면 찾기가 힘들어질 수 있겠지만, 다행히 이 프로그램에서는 손쉽게 찾을 수 있었다.

![Imgur](http://i.imgur.com/rZhEIhW.png)

회색 음영된 곳이 "Nope, this serial is wrong!"이 저장된 주소이다. 그런데, 운이 좋게도(? 제작자가 의도한 것인지 아닌지는 모르겠지만) 성공했을 때 출력되는 메세지도 알아볼 수 있었다. 바로 "Yep, this key is right!" 이다.

매우 간단한 기초적인 분석이 끝났다. 이 분석을 통해서 알 수 있는 것은 다음과 같다.

> 실패: Nope, This serial is wrong!
> 성공: Yep, this key is right!

### 목표설정

> 목표: "Yep, this key is right!"을 출력

### 방법을 생각 / 해결

운이 좋게도 아까 분석할 때 보았던 text strings 에서 "Yep, this key is right!"이라는 문자열과 그것이 저장된 주소를 알 수 있었다. 일단, 그 주소로 가보자.

![Imgur](http://i.imgur.com/BqfDekH.png)

코드가 좀 길다. 음영표시된 부분이 성공했을 때 실행되는 부분이라고 짐작할 수 있다. 왜냐하면, 우리가 목표로 설정한 문자열이 음영 표시된 부분 안에 존재하기 때문이고, 음영표시된 첫번째 라인인 00403332에서 JE 명령어로 실행할지 안할지를 판단하고, 만약 실행을 하지 않는다면 00403408 주소로 분기하기 때문이다. JE 명령어의 특성상 ZF(Zero Flag)를 바꾸는 부분은 바로 위에줄인 0040332F이다. 한번 0040332F 주소를 다시 한번 잘 곱씹어보자.

```asm
00403321   .  8D55 BC       LEA EDX,[EBP-44]
00403324   .  8D45 CC       LEA EAX,[EBP-34]
00403327   .  52            PUSH EDX
00403328   .  50            PUSH EAX
00403329   .  FF15 58104000 CALL [<&MSVBVM60.__vbaVarTstEq>]         ;  MSVBVM60.__vbaVarTstEq
0040332F   .  66:85C0       TEST AX,AX
00403332 > . /0F84 D0000000 JE 00403408                              ;  Check password
```

AX는 EAX의 16비트 부분이다. EAX 레지스터는 일반적으로 함수의 리턴값을 저장하는 레지스터이다. 그렇다면 바로 그 위에서 실행된 00403329 주소에 있는 MSVBVM60.DLL의 vbaVarTstEq 함수의 리턴값을 AX에 저장했다는 사실을 알 수 있다. 다시 TEST AX, AX 를 살펴보자.

```asm
00403329   .  FF15 58104000 CALL [<&MSVBVM60.__vbaVarTstEq>]         ;  MSVBVM60.__vbaVarTstEq
0040332F   .  66:85C0       TEST AX,AX
00403332 > . /0F84 D0000000 JE 00403408                              ;  Check password
```

TEST 명령어의 특성상 AX == 0 이면 연산결과는 0이므로 ZF == 1을 만들어낸다. 아래의 JE 명령어의 특성상 ZF == 1이면 점프하고, ZF == 0이면 점프하지 않는다. **우리의 목표는 점프를 하지 않은 것**이기 때문에, ZF == 0이 되어야하는데, 점프를 했으므로 ZF == 1이고, 당시의 AX == 0 임을 알 수 있다. 그렇다면, **00403329 주소에서 실행된 vbaVarTstEq 함수의 리턴값은 0**임을 알 수 있다.

잘 생각해보면 ~~감각적인 부분도 있겠지만~~, **vbaVarTstEq 함수가 Name과 Serial을 검사하는 함수라는 것을 짐작**할 수 있을 것이다. 왜냐하면, JE 명령어가 성공과 실패를 결정짓기 때문이고 이것을 TEST 명령어가 결정짓고(ZF값을 결정지음), TEST 명령어의 Operand인 AX는 00403329 주소의 vbaVarTstEq 함수가 결정짓기 때문이다. 그러므로 vbaVarTstEq 함수가 Name과 Serial을 검사하는 함수라고 짐작할 수 있다.

다시 한번 어셈블리 코드를 잘 살펴보자.

```asm
00403321   .  8D55 BC       LEA EDX,[EBP-44]
00403324   .  8D45 CC       LEA EAX,[EBP-34]
00403327   .  52            PUSH EDX
00403328   .  50            PUSH EAX
00403329   .  FF15 58104000 CALL [<&MSVBVM60.__vbaVarTstEq>]         ;  MSVBVM60.__vbaVarTstEq
```

vbaVarTstEq 함수의 매개변수로 EDX와 EAX를 받았음을 알 수 있다. 왜냐하면 스택이라는 것이 그렇게 사용되기 때문이다. 그렇다면, EDX와 EAX는 각각 Name과 Serial 이라는 것을 추측해볼 수 있다. (왜냐하면 vbaVarTstEq 함수는 암호를 검사하는 함수니깐! Input 값으로 Name과 Serial을 전달받겠지.) EDX와 EAX에는 각각 \[EBP-44\]와 \[EBP-34\] 값이 들어갔음을 알 수 있다. 이를 확인해보자.

Stack Window 에서 \[EBP-44\]를 검색(Ctrl+G)해보자. ~~Stack Window에서 검색하는 이유는, EBP-44 값을 vbaVarTstEq 함수에서 사용할 것이고 이것을 전달받는 방법은 스택을 이용하는 방법 밖에 없기 때문이다.~~ 그러면 다음과 같은 Dump(ASCII) 값을 볼 수 있다.

![Abex' 2nd Crackme #4](http://i.imgur.com/ODL0cz8.png)

분명 우리는 "Idontknow"라는 값을 Serial 값으로 Input 했는데, \[EBP-34\] 근처에 어떤 값이 있고, \[EBP-44\] 근처에는 우리가 모르는 어떤 값인 "ACC9D0D0"이라는 값이 존재한다. 혹시나 해서 "ACC9D0D0"를 Serial에 적허보니 결과는 성공했다.

![Abex' 2nd Crackme #6](http://i.imgur.com/N4AZebT.png)

### 정확한 분석

결론적으로 말하자면, 우리는 이것을 확신이 아닌 추측으로, 행운으로 문제를 풀었다. 결정적으로는 "ACC9D0D0"가 진짜 Serial Key 인지도 몰랐을 뿐만 아니라 Name 값에 대한 단서는 아예 찾지도 못했다. ~~소 뒷걸음질 치다 쥐 잡기~~ 정확한 분석을 위해서 Check 버튼을 누르면 어떤 함수가 실행되는 지 부터 분석해봐야 한다. 이 부분은 필자의 디버깅 실력이 더 향상되면 추가하도록 하겠다.
