---
layout: post
title: "왜 내 소스가 제대로 작동하지 않는걸까? [KOR]"
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
Calendar calendar = new GregorianCalendar(); // 현재 날짜로 초기화된다.
calendar.set(2017, 0, 1) // 2017년 1월 1일로 초기화. Calendar는 1월이 0월이다.
calendar.add(Calendar.DATE, -1);
{% endhighlight java %}
