---
layout: post
title: "4. 이진 탐색 알고리즘"
section-type: post
category: Data_Structure
tags:
  - korean
  - theory
  - data_structure
---

## 이진 탐색 알고리즘 (Binary Search Algorithm)

### 소개

이진 탐색 알고리즘은 이전 글에서 소개한 순차 탐색 알고리즘보다 훨씬 빠르다. 단, 다음의 조건을 만족해야만 본 알고리즘을 사용할 수 있다.

> 배열에 저장된 데이터가 정렬된 상태이어야 한다.

이진 탐색 알고리즘은 정렬된 데이터가 아니라면 적용이 불가능하다. 본 알고리즘을 의사코드로 표현하면 다음과 같다.

```
가정: 배열이 정렬되어있다.
1. 배열의 정가운데를 목표와 비교한다.
2.  (1) 비교한 값과 일치하면 index 값을 반환한다.
   (2) 가운데 값이 목표값보다 크면, 탐색의 범위를 조정한다. (시작점부터 가운데까지)
   (3) 가운데 값이 목표값보다 작으면, 탐색의 범위를 조정한다. (가운데부터 끝까지)
3. 2번을 결과값을 찾을 때까지 반복하고, 결과값을 찾지 못하면 -1을 반환한다.
```

### C언어로 구현

이진 탐색 알고리즘을 C언어로 구현해보자.

```C
int BinarySearch(int inputArray[], int arrayLength, int target) {
    int first = 0; // 탐색 범위의 시작 index
    int last = arrayLength - 1; // 탐색 범위의 끝 index
    int mid;

    while(first <= last) {
        mid = (first + last) / 2; // 탐색 대상의 중앙을 찾는다. int 이므로 소수점내림

        if(target == inputArray[mid]) { // 중앙에 목표 값이 있으면
            return mid; // 탐색완료
        } else { // 목표값이 아니면 탐색 범위를 조정한다.
            if(target < inputArray[mid]) {
                last = mid - 1;
            } else {
                first = mid + 1;
            }
        }
    }
    return -1; // 결과값을 못 찾았을 경우 -1 반환
}
```

위의 코드에서 다음의 코드가 매우 중요하다.

```C
if(target < inputArray[mid]) {
    last = mid - 1;
} else {
    first = mid + 1;
}
```

mid - 1, mid + 1을 한 이유는 다음과 같다.

- mid 값을 한 번 더 연산에 넣을 필요가 없다. ±1을 함으로써 경우의 수를 줄인다.
- **이렇게 하지않으면 무한루프를 형성하여 프로그램이 종료되지 않는다.**

2번째 이유가 매우 중요하다. 무한루프를 형성하는 이유는 다음과 같다. 위의 이진 탐색 알고리즘 코드에서 while 문을 탈출하기 위해서는 first > last 이어야지만 탈출할 수 있다. 만약,

```C
if(target < inputArray[mid]) {
    last = mid;
} else {
    first = mid;
}
```

±1이 없다면, 결국 first, last, mid는 같은 값으로 수렴할 것이고, while문을 탈출할 수 없다. 고로 ±1을 함으로써 while문을 탈출할 수 있는 길을 열어주는 것이다.

### 시간 복잡도(Time Complexity)는 어떻게 될까?

잘 생각해보자.

- 데이터 수가 $n$개일 때, 1회 연산
- 데이터 수가 $n \over 2$개일 때, 1회 연산
- 데이터 수가 $n \over 4$개일 때, 1회 연산
- 데이터 수가 $n \over 8$개일 때, 1회 연산
- 무한 반복.....
- 데이터가 1개 남았을 때, 1회 연산

이런 식으로 계속 반복할 것이다. 그렇다면 이를 일반화 하면

> 데이터 수가 $n$개일 때, 2로 최대한 나눈 횟수 k회 + 마지막 1개에 대한 1회

$$T(n) = k + 1$$라고 할 수 있다. 여기서 $k$를 구해보자.
$$n \times ({1\over2})^k = 1$$왜냐하면, 의미가 n이 1이 될때까지 2로 k번 나누는 것이기 때문에 위의 식이 나올 수 밖에 없다.
고로, $k$를 구하면 다음과 같다.
$$k = \log_2 n$$그러므로 $T(n) = \log_2 n + 1$이어야 하지만, 시간 복잡도의 의미가 데이터 수의 증가에 따른 연산횟수의 **변화 정도** 를 판단하는 것이므로 $T(n)$은 다음과 같다.

$$
T(n) = \log_2 n
$$