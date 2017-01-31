---
layout: post
title: "[C언어] 동적 메모리 할당의 응용"
section-type: post
category: C
tags:
  - korean
  - c
  - coding
  - malloc
  - memory_allocation
---

## 동적 메모리 할당의 활용

### Array로 사용해보자!

동적할당은 많은 기억공간을 한꺼번에 할당 받아서 배열로 사용하는 것이 효율적이다. 할당 받은 기억공간의 시작 위치만 포인터변수로 가리키게 하면 포인터변수를 배열명으로 사용하여 **배열과 같이** 활용할 수 있다. 아래의 예제 코드를 참고하자!

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int *ip;
  int i = 0;

  ip = (int *) malloc(5 * sizeof(int));

  for(i=0; i<5; i++) {
    printf("%d 번째 int값 : ", i+1);
    scanf_s("%d", ip+i);
    printf("\n");
  }

  for(i=0; i<5; i++) {
    printf("%d ", ip[i]);
  }
}
```

위의 코드에서 주목해야할 점은 두 가지이다.

- ip가 int형 포인터변수임에도 불구하고 마치 int형 배열로 사용되었다는 점
- ip[i]를 이용해서 printf 함수를 사용했다는 점
