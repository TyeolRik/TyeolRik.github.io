---
layout: post
title: "[Random] Random Number Generator는 왜 중요한가?"
section-type: post
category: random
tags:
  - random
  - rng
---

일반적으로 우리는 보이는 곳에서, 보이지 않는 곳에서 난수라는 개념을 많이 사용한다. 우리가 자주하는 컴퓨터 게임에서, 추첨을 하거나 뽑기를 하는 등의 상황에서도 난수는 많이 사용된다. 난수를 사용하는 이유는 개인적으로 결정적(Deterministic) 구조를 가진 컴퓨터에서 줄 수 있는 User Experience가 제한적이기 때문에 보다 다양한 경험과 상황을 만들기 위함이 아닐까 싶다. 만약, 컴퓨터 게임이 항상 똑같이 정해져있는 스테이지에 똑같은 몬스터와 똑같은 패턴을 반복한다면 아무리 어렵더라도 우리는 쉽게 클리어할 것이고 금방 지루함을 느끼게 될 것이다. 그래서 우리는 난수라는 랜덤의 개념을 이용할 수 밖에 없고 **얼마나 좋은 난수**를 만드느냐에 따라 User Experience의 질도 달라질 것임을 쉽게 유추해볼 수 있다.

## 결정적 구조

컴퓨터가 결정적이라는 표현을 좀 더 명확히 말하자면 컴퓨터는 \"Deterministic System\" 이다. 라고 할 수 있다.

> In mathematics, computer science and physics, a deterministic system is a system in which no randomness is involved in the development of future states of the system. A deterministic model will thus always produce the same output from a given starting condition or initial state.
> \- [Deterministic system in Wikipedia](https://en.wikipedia.org/wiki/Deterministic_system)

쉽게 표현하자면, 하나의 Input에 정해진 Output만 출력하는 장치라는 것이다. 예를 들어서 다음과 같은 함수를 생각해보자.

\\[
f(x) = 2x + 3
\\]

\\(x\\) 값이 정해지면 자연스럽게 함수값 \\(f(x)\\)도 정해질 것이다. 이러한 함수들의 총집합을 우리는 Deterministic Function, Algorithm. 더 크게는 Determinisitc System 이라고 한다.

## Pseudo Random Generator에 대하여

결정적 구조를 가진 컴퓨터에서 어떻게 랜덤한 값을 낼 수 있는가가 이제 의문일 것이다. 사실 컴퓨터가 만드는 난수값을 정확히 **의사난수**, 다시 말해 **가짜**난수 라고 한다. 즉, 난수처럼 보이는 값을 도출한다는 것이다. 왜냐하면, 계속 반복해서 말하지만 컴퓨터는 결정적 구조를 가지고 있기 때문에 주어진 Input에 대해서 정해진 Output만 낼 수 있기 때문이다. 예를 들어서 설명해보자.

```c
#include <stdio.h>
#include <stdlib.h> // random 함수

int main() {
    int random;   // 난수 생성
    for(int i = 0; i < 10; i++) {
        random = rand() % 9;    // 0 ~ 9 사이 값
        printf("%d ", random); // 출력
    }
}
// 출력 : 1 7 0 7 5 7 1 3 6 1
```

위와 같은 코드를 여러번 반복실행시키면 항상 똑같은 값이 나오는 것을 알 수 있는데, 그 이유는 ```rand()``` 함수가 항상 같은 input을 받았기 때문이다. Random 함수의 input을 컴퓨터과학에서는 **Seed**라고 한다. rand() 함수를 좀 더 자세히 알아보자.

- c language stdlib rand() function

위 글을 읽으면 좀 더 명확히 알 수 있을 것이다. 결론만 간단히 말하자면, ```rand()``` 함수와 같이 Pseudo Random Function의 Seed 값이 정해짐에 따라 특정 연산을 수행하고 특정 결과를 return 한다는 사실을 알면, Pseudo random 의 정의를 잘 이해했다고 볼 수 있다. 위의 알고리즘 이외에도 많은 의사난수 알고리즘이 존재한다.