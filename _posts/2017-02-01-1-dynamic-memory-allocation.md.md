---
layout: post
title: "[C언어] 동적 메모리 할당이란?!"
section-type: post
category: C
tags:
  - korean
  - c
  - coding
  - malloc
  - memory_allocation
---

## 동적 메모리 할당 (Dynamic Memory Allocation)

> **입력되는 데이터에 맞게 기억공간을 확보** 하는 것을 동적 메모리 할당이라고 한다.

### 정적 메모리 할당 (Static Memory Allocation)

> 프로그램을 작성하는 단계에서 필요한 기억공간의 크기를 결정하는 것

우리가 일반적으로 배열을 선언할 때 정적 메모리 할당을 사용한다. 예시 코드로 살펴보자.

```c
char examples[10];
```

이렇게 프로그램을 하면, char 자료형 10개가 나란히 선언되고, examples 배열에는 10개의 자료형 밖에 못들어간다.

### 왜 동적 메모리 할당을 해야하는가?

정적 메모리 할당을 하게 되면, 기억공간이 낭비될 경우가 많다. 예를들어, 위의 선언한 char형 배열 examples에 10글자(Bytes)를 넣을 수 있는데, 만약 "Hello" 만 넣는다면, 5바이트가 또 낭비되는 셈이다. 고로, 메모리의 낭비를 최소화하기 위해서는 프로그램의 실행 중에 입력되는 데이터에 맞게 기억공간을 할당할 필요가 있다.

### 어떻게 하는가?

메모리를 동적으로 할당해 주는 함수는 용도에 따라 다양하지만, 기본적으로 malloc이 있다. (이 함수를 사용하기 위해서는 <stdlib.h> 헤더파일이 include 되어야한다.) 아래의 코드는 malloc 함수의 원형이다.

```c
void *malloc(unsigned int);
```

이것을 이용하려면 간단하게 형변환만 해주면 된다!

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int *ip;
  ip = (int *) malloc(5 * sizeof(int));
  *ip = 200;

  printf("malloc 함수를 사용해보자. \n\n");
  printf("ip의 값 : %d \n\n", *ip);
}
```

### 메모리 반납

![Storage-Class](http://i.imgur.com/d2w3qaA.png)

프로그램은 실행될 때 메모리의 일정 영역을 사용한다. 동적 메모리가 할당되는 기억공간은 힙(Heap)에 있는데, 힙에도 쓰레기값이 존재한다. 힙 메모리의 생존기간은 프로그램이 종료될 때까지 이므로 특정 함수에 구속 받지 않고 어디서나 참조하여 사용될 수 있다. (자동변수는 함수가 리턴될 때 자동으로 메모리가 회수된다.) 즉, 힙 메모리를 회수하지 않으면 프로그램이 실행이 되는 동안은 무한정 쌓이게 되고 이는 상당한 메모리의 낭비를 불러일으킬 수 있다. 고로, free 함수를 이용한 다음의 코드를 실행하여 메모리를 회수해야한다.

```c
void free(void *);
```

free 함수는 반드시 해당하는 메모리를 더 이상 사용할 일이 없을 때 호출 해야한다. free 함수를 호출하면 메모리가 반환되기 때문에 그 안의 값은 null 값으로 변하게 된다. 고로, 다음번에는 해당 메모리를 불러올 수 없게 된다. 다음 코드로 확인해보자.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int *ip;
  ip = (int *) malloc(5 * sizeof(int));
  *ip = 200;

  printf("malloc 함수를 사용해보자. \n\n");
  printf("ip의 값 : %d \n\n", *ip);

  free(ip);
  printf("free 함수를 수행하였다. \n\n");
  printf("ip의 값 : %d \n\n", *ip);
}
```

##### 실행결과

![Imgur](http://i.imgur.com/a2Vxv2Y.png)

메모리가 반환되면서 이상한 값이 나오는 것으로 알 수 있는데, 메모리가 반환되면서 null이 됐기 때문이다.

### 주의점: Null Pointer Return

메모리를 할당할 때, 힙(Heap)에 원하는 크기의 메모리가 존재하지 않으면 Null Pointer(0번지 포인터)를 리턴한다. 이는 참조될 수 없는 포인터 이기 때문에 프로그램이 실행 중에 에러를 출력하면 중단될 것이다. 이 문제는 메모리가 부족해서 Null Pointer를 리턴했을 수도 있지만 메모리가 넉넉할 때에도 원하는 크기의 메모리가 없으면 Null Pointer를 리턴할 수도 있다. 고로, 다음의 코드를 이용해서 Null Check를 해줘야한다.

```c
ip = (int *) malloc(9 * sizeof(int)); // 메모리 할당
if(ip == 0) { // Null Check: 만약 리턴된 포인터가 널 포인터라면
    printf("Out of Memory!! \n");
} else {
    *ip = 200;
    printf("%d \n", *ip);
}
```
