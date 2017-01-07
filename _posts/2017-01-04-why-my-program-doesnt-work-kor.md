---
layout: post
title: 오버플로우 - "왜 내 소스가 제대로 작동하지 않는걸까?" [KOR]
section-type: post
category: theory
tags: [ 'theory', 'overflow' ]
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

### 오버플로우(Overflow)

> 정의: 프로그래밍에서, 메모리 용량을 넘어선 값이 들어가 생기는 오류

모든 변수는 메모리에 일정부분을 할당한다.  예를 들어 4비트짜리 변수 A가 있다고 해보자. 그렇다면 A는 16가지의 숫자를 저장할 수 있다. 즉, -8 ~ +7까지의 숫자를 저장할 수 있다.

``` {.java}

```
