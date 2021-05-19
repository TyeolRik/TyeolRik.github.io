---
layout: post
title: "[C] K&R / old-style 함수 호출"
section-type: post
category: C
tags:
  - c
  - syntax
  - k&r
---

우연하게 C언어의 이상한 문법을 보게 되었고, 알게된 바를 상세히 서술하고자 한다.

## K&R syntax

```c
// K&R syntax
double foo( a, b )
double a, b;    // <- 이게 뭐야!?
{
  // 내용
}
```

위와 같은 이상한 함수 호출을 보게 되었다. 도대체 저건 뭐지? 저, 함수 옆에는 왜 세미콜론이 없으며, 왜 함수 밑에 또 변수를 정의하지? 이건 return 값을 선언한걸까? 아니, 애초에 C언어에서 return 값을 2개 이상 줄 수 있나? 하는 수많은 말도 안되는 망상과 내가 알고 있던 C언어가 무너지고 있는 이상한 느낌이 들었다. 이에 대해서 알아보니 이러한 문법을 [K&R-Style Declaration](https://stackoverflow.com/questions/3092006/function-declaration-kr-vs-ansi) 라고 하는 **옛날 스타일의 문법**이었다는 사실을 알게되었다. 위의 함수를 아래로 바꾸면 매우 보기 쉬운(?) 함수가 된다.

```c
// ANSI syntax
double foo(double a, double b)
{
  // 내용
}
```

이러한 스타일을 ANSI 스타일이라고 하고, 현재 우리가 가장 흔하게 쓰고 있는 코딩 스타일이다. K&R 스타일은 현재는 거의 사용하지 않고, 엄청 오래된 책이나, 엄청 오래된 함수에서 간간히 볼 수 있다고 하니, "**이렇게 있구나**" 정도로만 알아두면 될 듯하다.

<br><br><br>