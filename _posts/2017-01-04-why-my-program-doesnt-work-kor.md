---
layout: post
title: 오버플로우 - "왜 내 코드가 제대로 작동하지 않는걸까?" [KOR]
section-type: post
category: theory
tags: [ 'korean', 'theory', 'overflow' ]
---
### If you want to read this post in English,
Please click **[HERE]({{ site.baseurl }}{% link _posts/2017-01-04-why-my-program-doesnt-work-eng.md %})**. But I am unsure as to weather it is grammatically correct. **LUL**

## 오버플로우에 대해서  

### 공부하게 된 동기  

Android의 GridView에 대해서 공부하고 있었다. ~~사실 공부라기 보다는 실습에 가깝다.~~ Selection Widget(선택위젯) 중의 하나인 GridView를 이용해서 달력을 만들어보는 실습이었는데, Java에서 Calendar를 하루 전으로 옮기는 방법을 모르겠더라. ~~사실 Calendar의 add method를 사용하면 되는데 GridView에서 Logic error가 나더라.~~  
그래서 좀 구식의 ~~구식인지는 잘 모르겠지만 정상적인 방법은 아님에 분명하다.~~ 방법을 사용하기로 마음먹었고, 선택한 방법은 Calendar Class의 getTimeinMillis(), setTimeinMillis(long millis) 함수를 사용하는 것이었다.
{% highlight java %}
// Grid의 첫번째 날짜를 구할 수 있다.
Calendar calendar = new GregorianCalendar(); // 현재 날짜로 초기화된다.
calendar.set(Calendar.DATE, 1) // 현재 날짜에 해당하는 달의 1일로 초기화.
// 빼고싶은 날짜를 설정한다.
int wantDateToReduce = calendar.get(Calendar.DAY_OF_WEEK) - 1 // 일요일이 상수값으로 1이다. 그렇다면, 달력에서 첫 날짜를 알 수 있다.
long millisCalc = getTimeinMillis() - (wantDateToReduce * 24 * 60 * 60 * 1000) // 1일 = 24시간 * 60분 * 60초 * 1000 밀리초
calendar.setTimeinMillis(millisCalc);

// Grid에서 position에 해당하는 날짜를 Calendar로 Return하는 method.
public Calendar getCalendarOnPosition(int position) {
    Calendar resultCalendar;
    resultCalendar = calendar; // Grid의 position 0, 즉 첫번째 칸의 날짜로 설정
    
    long resultMillis = position * (24 * 60 * 60 * 1000); // 24 * 60 * 60 * 1000 == 1일
    resultCalendar.setTimeinMillis(resultMillis);
}
Calendar[] calendarArray; // 배열의 형식으로 저장하겠다.
calendarArray = new Calendar[42];
for(int i = 0; i < 42; i++) { // 42인 이유는 달력이 총 42칸이기 때문. 6줄이다.
    calendar[i] = getCalendarOnPosition(i); // i 값이 25부터 비정상적인 값이 출력.
}
{% endhighlight java %}

다른건 다 잘 되면서 왜 position = 25부터 안되는지 한참을 고민했다. ~~한참을 고민해봤는데,~~ 이유는 바로 (long) resultMillis를 계산하는 부분이 잘못된 것이다.

``` {.java}
long resultMillis = position * (24 * 60 * 60 * 1000); // 24 * 60 * 60 * 1000 == 1일
```

Java의 자동 형변환 때문에 resultMillis 값이 long 형이니깐 뒤의 계산식도 모두 long으로 변환되서 계산되는 줄 알았는데 position값이 int형이니깐 좌변(position * 1일 밀리초)이 모두 int로 계산된 뒤에 long 형으로 저장되는 것이었다. 망할..

> 그렇다. 오버플로우가 발생한 것이다.

### 오버플로우(Overflow)의 의미

> 정의: 프로그래밍에서, 메모리 용량을 넘어선 값이 들어가 생기는 오류

모든 변수는 메모리에 일정부분에 할당된다.  예를 들어 8비트짜리 변수 A가 있다고 해보자. 그렇다면 A는 2^8 = 256가지의 숫자를 저장할 수 있다. 즉, -128 ~ +127까지의 숫자를 저장할 수 있다.

``` {.java}
byte A = 127;
A = A+1;
System.out.println(String.valueOf(A)); // -128이 출력된다.
```

위와 같은 코드를 작성하면 A는 -128이 된다. byte 자료형은 +127이 최대이므로 그다음 숫자는 -128이 되는 것이다. ~~(숫자가 256칸짜리 원형 큐라고 생각하면 이해하기 쉽다.)~~  

### 오버플로우의 사례

> 스택 오버플로우 (Stack Overflow)

스택 오버플로우는 메모리가 부족할 때 생기는 오류이다. 함수는 변수 등을 저장하기 위해서 스택을 만드는데 함수가 재귀적으로 계속 실행되면 스택이 점점 늘어나고 한계에 다다르면 Stack Overflow가 발생한다. ~~필자의 추측이지만 개발자 사이트 <a href="http://stackoverflow.com/"><font color="#2d2d2d">StackOverflow</font></a>의 이름도 아마 코딩을 재귀적으로 계속 하다보면 오류가 늘어나고 그때 검색해보라는 의미에서 지은 것이 아닐까 하고 생각한다.~~

> 하트블리드 사태 (버퍼 오버플로우)

필자가 오버플로우에 대해서 공부하다가 알게된 **하트블리드 사태**가 충격적이었다. 2014년에 핀란드의 보안 회사에서 OpenSSL의 보안결함을 발표하면서 널리 알려진 사태이다. OpenSSL이란 컴퓨터와 서버가 정보를 교환할 때 사용되는 소프트웨어인데, 많은 IT 서비스나 카드, 금융 쪽의 암호 시스템은 OpenSSL에 의존하고 있다. OpenSSL은 연결을 계속 유지시키기 위해서 하트비트(HeartBeat)라는 신호를 사용한다.

>> 사용자: "Apple", 5글자  
>> 서버: 5글자를 충족하는 메세지를 보내야겠다. "Apple"  
>> 사용자: "Banana", 6글자  
>> 서버: 6글자를 충족하는 메세지를 보내야겠다. "Banana"  
>> 사용자: "Computer", 5000글자  
>> 서버: 5000글자를 충족하는 메세지를 보내야겠다. "Computer Banana Apple Pizza Hambuger McDonald John Mike ~~"

 사용자는 서버의 존재여부를 판단하기 위해서 일정 주기마다 무작위 데이터가 담긴 패킷을 전송하고 서버는 정확히 같은 양의 데이터를 돌려줌으로써 존재를 알린다. 그런데, 사용자가 얼마만큼의 데이터를 보냈는지를 거짓으로 명시하면, 서버는 그만큼의 데이터를 보내주어야하기 때문에 메모리에 있는 다른 정보를 끌어와서 데이터를 돌려준다. 이런 방법을 수없이 많이 반복하면 서버의 데이터를 사용자가 축적할 수 있다. 즉, 서버의 데이터가 유출된다는 것이다.

> 아리안 5 로켓 공중분해 사건

학교에서 교수님이 오버플로우에 대해서 소개할 때, 우주선이 오버플로우 때문에 폭발했다는 이야기를 하신 적이 있다. 그 우주선이 바로 "아리안 5호(Ariane 5)"이다. 1996년 6월 4일, 아리안 5호가 발사 후 37초만에 공중분해 되었다. 이유는 바로, 64비트짜리 데이터를 16비트짜리 데이터로 변환하는 과정에서 생긴 오버플로우였다. 당시 학자들은 아리안 4호의 속도가 16비트 정수형의 최댓값(32,767)을 넘지못할 것이라고 예측하고 코드를 작성했는데 아리안 5호에도 똑같은 코드를 복붙해버려서 오류가 생겼다. ~~아리안 5호가 아리안 4호보다 훨씬 빠르기 때문~~
