---
layout: post
title: "[C언어] 포인터 왜 쓰는거지?"
section-type: post
category: C
tags:
  - korean
  - c
  - coding
  - pointer
---

## 포인터가 필요한 이유

### 함수간 변수 사용

```c
#include <stdio.h>

void assign(); // 함수 선언

int main(void) {
    int hello = 0;

    assign(); // 함수 호출
    printf("함수 호출 이후에 hello에 저장된 값: %d \n", hello);
    return 0;
}

void assign() { // 함수의 정의
    hello = 500;
}
```

알겠지만 요러면 assign() 함수에 있는 hello가 정의되지 않은 변수라며 컴파일 에러가 난다. C언어에서 함수 안에 있는 변수는 지역변수(Local Variable)이기 때문에 main 안에 있는 hello 변수와 assign 안의 hello 변수는 서로 다르게 취급한다. 그런 이유에서 assign 함수에서 main 함수에 있는 변수에 접근하고싶다면 (반대도 같다.) 포인터를 이용해서 접근하면 된다. 왜냐하면, 메모리는 하나밖에 없기 때문에 주소값(포인터) 또한 유일한 것이기 때문이다.

### 그렇다면 포인터로 다른 함수의 기억공간을 사용해보자.

위의 코드를 수정해서 assign 함수에서 main 함수의 hello 변수를 참조해보도록 하겠다. 방법은 간단하다. assgin 함수의 매개변수(Parameter)로 포인터를 전달하면 된다.

```c
#include <stdio.h>

void assign(int *); // 함수 선언, 선언에서 매개변수 명은 생략 가능하다.

int main(void) {
    int hello = 0;

    assign(&hello); // 함수 호출, 포인터를 매개변수로 넘겨준다.
    printf("함수 호출 이후에 hello에 저장된 값: %d \n", hello);
    return 0;
}

void assign(int *helloPointer) { // 함수의 정의
    *helloPointer = 500;
}
```

사실 위의 예제는 포인터 없이, assign 함수가 500 이라는 상수를 return 하게 함으로써 해결할 수 있는 문제이다. 아래의 코드처럼 말이다.

```c
int assign() {
    return 500;
}
```

하지만, 포인터를 사용하면 여러 변수를 동시에~~정확히 동시는 아니다. 왼쪽의 인자부터 접근하기는 한다.~~ 접근할 수 있다는 장점이 있다.
