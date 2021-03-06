---
layout: post
title: "[C언어] 포인터란?!"
section-type: post
category: C
tags:
  - korean
  - c
  - coding
  - pointer
---

## Pointer에 대해서 공부해보자.

이 글은 다음 책을 읽으면서 정리한 내용을 바탕으로 작성된 글입니다. 혹시나 저작권이나 뭐 기타 등등의 법적 문제가 있지 않길 바라겠습니다. ~~문제가 있으면 메일로 연락바랍니다.~~

![C Language Book](/img/assets/c-lang/book-about-c-lang.png)

<font align="center">제목: 뇌를 자극하는 C 프로그래밍<br>
저자: 서현우<br>
출판사: 한빛미디어<br>
구입배경: 대학강의 교재였음</font>

### 갑자기 왜 Pointer에 대해서 공부하기 시작했을까

Data Structure를 공부하던 도중에, 실습 예제가 있었다. **배열을 이용한 리스트를 구현하는 과제** 에서, 포인터를 마구잡이로 사용해야하는 때가 왔고, 솔직히 이해가 잘 가지 않아 공부해야겠다고 다짐했다.

### 포인터의 의미

> 메모리의 실제 주소값을 포인터라고 한다.

프로그램에서 기억공간을 가리킬 때에는 2가지 방법이 있다.

1. 변수명을 사용하는 방법
2. 변수가 할당된 메모리의 실제 주소를 사용

여기에서 언급한 두 번째 방법에서 사용되는 것이 바로 포인터이다. 포인터는 **할당된 변수의 시작 주소값** 을 의미한다. 예를 들어서 설명해보자. int형 변수 a를 선언했다면, int형 변수이므로 메모리에는 총 4바이트가 할당된다. 이 할당된 공간이 메모리의 500번 째 byte부터 503번 째 byte 까지라면 500번 째 byte의 주소값이 포인터가 된다.

-------------------------------------------

### 주소연산자(&)

> 특정 변수의 포인터를 구하기 위해서는 **주소연산자(&)** 를 사용한다.

변수명 앞에 주소연산자(&)를 사용하면 변수가 할당된 메모리의 시작 주소값을 구해준다.

```c
#include <stdio.h>

int main(void) {
  char ch = 1;
  int in = 100;
  double db = 2.5986;
  printf("ch의 포인터: %d \n", &ch);
  printf("in의 포인터: %d \n", &in);
  printf("db의 포인터: %d \n", &db);
}
```

<font align="center">출력결과</font>

![pointer-printf](/img/assets/c-lang/pointer-printf.PNG)

출력결과는 컴파일 할 때마다 다르게 나옵니다. (항상 랜덤하게 할당하는 듯) 포인터가 그냥 숫자값인거 같지만, 실제로는 아닙니다. 포인터에는 다른 정보가 숨어있습니다.

> 포인터는 자신이 어떤 자료형으로부터 만들어졌는지에 대한 정보를 담고있다.

즉, &ch는 3340855를 의미하고, 이 안에는 char형 기억공간의 주소값이라는 의미가 담겨있다.
&in, &db도 마찬가지로 int형, double형 주소값을 담고있다는 의미를 담고있다.

---------------------------------------

### 참조연산자(\*)

포인터를 통해서 기억공간을 사용하기 위해서는 **참조연산자(\*)** 를 사용한다. 참조연산자를 포인터 앞에 붙이면, 포인터가 가리키는 기억공간을 사용할 수 있다. 말로하기 어려우니, 예제 코드로 보자.

```c
#include <stdio.h>

int main(void) {
  char ch;
  int in;
  double db;
	
  *&ch = 'k';
  *&in = 589;
  *&db = 1.7892465;

  printf("변수 ch에 저장된 문자: %c \n", ch);
  printf("변수 in에 저장된 값: %d \n", in);
  printf("변수 db에 저장된 값: %lf \n", db);
}
```

이렇게 하면, 

```c
ch = 'k';
in = 589;
db = 1.7892465;
```

한거랑 같은 결과가 나온다. 이렇게 참조연산자는 각 포인터값의 주소로 가서 적절한 기억 공간을 확보하고, 대입연산에 의해서 값을 저장하게 된다. 그러니깐, 순서로 해보자.

- *&in = 589; 라인을 컴파일한다.
    1. &in을 실행한다. (단항연산자 수행순서) : 포인터의 주소값을 찾는다.
    2. *(&in)을 수행한다. : 포인터값이 int형이라서 4바이트를 할당하는군! 기억공간(4바이트)을 확보한다.
    3. *&in = 589를 실행한다. : 확보된 기억공간에 589값을 집어넣는다.

참조연산자로 포인터를 사용하는 방법은 두 가지이다.

1. 포인터가 가리키는 기억공간을 사용한다.
2. 포인터가 가리키는 기억공간의 값을 사용한다.

크게 의미는 없지만 다음의 코드를 한 번 잘 살펴보자.

```c
int a = 10, b = 20;
*&a = *&b  // 변수 b에 저장된 값을 변수 a에 저장한다.
printf("a의 값 : %d \n", a); // a = 20이 출력된다.
```

여기서 2번 째 줄을 잘 보면 좌항(왼쪽)은 첫 번째 의미(기억공간을 사용한다.)로 사용된 것이고, 우항(오른쪽)은 두 번째 의미(기억공간의 값을 사용한다.)로 사용된 것이다. 크게 의미는 없다. 단지 중요한 것은, 기억공간을 참조할 수 있다는 것이다.

-----------------------------

### 포인터변수

포인터를 저장하기 위해서는 **포인터변수**를 사용해야한다. 언뜻 보기에는 포인터가 정수값이기 때문에 int형 변수를 사용해도 될 것 같지만 안된다. 왜냐하면 포인터는 자료형에 대한 정보를 포함하고 있기 때문이다.

선언하는 방법은 매우 간단하다.

```c
int *ap; // 포인터 변수 생성
```

라고 선언하면, ap라는 변수명을 가진 포인터 변수가 생긴다.

```c
int a;
*ap = &a;
```

라고 하면, a의 포인터를 구해서 ap에 저장한다. 왜냐하면 주소연산자(&)는 포인터를 구하는 것이기 때문이다.

#### 하나의 기억공간을 가리키는 두 개 이상의 포인터가 존재할 수 있나?

가능하다. 다음의 코드를 살펴보자

```c
#include <stdio.h>

int main(void) {
  int in;
  int *ap, *bp;

  in = 589;
  ap = &in;
  bp = &in;

  printf("변수 in의 주소값 : %d \n", ap);
  printf("변수 in의 주소값 : %d \n", bp);
  printf("변수 in의 실제값 : %d \n", *ap);
  printf("변수 in의 실제값 : %d \n", *bp);
  printf("포인터 ap의 주소값 : %d \n", &ap);
  printf("포인터 ap의 주소값 : %d \n", &bp);
}
```

![pointer-quiz](/img/assets/c-lang/pointer-quiz.PNG)

주목해서 봐야할 부분은 포인터의 주소값은 다른데, 같은 값을 참조했다는 사실이다. 즉, 하나의 기억공간을 참조하는 2가지의 포인터는 존재가능하다는 것이다.
