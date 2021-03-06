---
layout: post
title: 2. 자료구조의 이해
section-type: post
category: Data_Structure
tags:
  - korean
  - theory
  - data_structure
---

## 자료구조에 대한 기본적인 이해

읽고 있는 책에 의하면, 다음의 C언어 수준은 되야지 이 책을 읽을 수 있다고 한다. 필자는 C언어를 배운지가 어언 1년이 지났고, 그 이후로는 한번도 C언어를 써본적이 없기 때문에 ~~내사랑 JAVA~~ 기억나는게 하나도 없다. ~~printf("HelloWorld"); 정도?~~

### 읽고있는 책에서 가정하는 C언어 기본

- 구조체를 정의할 줄 알고 구조체 대상의 typedef 선언을 할 줄 안다. ~~구조체는 기억난다 시험 망한 기억~~
- malloc 함수와 free 함수를 사용할 줄 알고, 이는 메모리의 동적 할당과 관련 있음을 이해한다. ~~메모리 동적할당? args[] 어쩌고 하는거 망한 기억이 난다.~~
- 포인터 변수의 선언과 포인터 연산에 부담이 없다. ~~포인터는 죄악이다~~
- 헤더파일이 필요한 이유를 이해한다. ~~라이브러리 써먹을라고?~~
- 헤더파일을 정의할 줄 알고 헤더파일에 들어가야 할 것들이 무엇인지 알고 있다. ~~학교에서 배운 적 없다.~~
- 헤더파일의 정의에 사용되는 매크로 #ifndef ~ #endif 의 의미를 알고 있다. ~~전혀 들어본 적도 없다~~
- 하나의 프로그램을 둘 이상의 소스파일과 헤더파일에 나누어 담을 줄 안다. ~~여럿이서 하는 C언어 과제는 해본 적이 없다~~
- 재귀함수의 동작방식을 안다. 그리고 재귀함수와 관련된 아주 간단한 예제는 분석할 수 있다. ~~드디어 아는거 나왔다. 하노이탑 정도는 만들 수 있지~~

### 자료구조란?

자료구조에서는 데이터를 표현하고 저장하는 방법에 대해서 설명한다. int나 구조체, 배열 등도 자료구조의 일종인데, 이 책에서 공부할 자료구조는 그렇게 간단한 것이 아니란다. ~~망했다. 배열도 잘 못 다루는데~~

- **선형 자료구조 (Linear Data Structure)** 데이터를 선의 형태로, 또는 일렬로 저장하는 방식이다. 예를 들면 리스트, 스택, 큐 등이 있다.

- **비선형 자료구조 (Non-Linear Data Structure)** 데이터를 나란히 저장하지 않는 구조. 예를 들면 트리, 그래프 등이 있다.

### 알고리즘이란?

자료구조(표현 및 저장된 데이터)를 대상으로 하는 '문제의 해결 방법'을 의미한다.

```c
int arr[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}; // 자료구조적 측면
```

```c
for(i = 0; i < 10; i++) { // 알고리즘적 측면
    sum += arr[i];
}
```

자료구조와 알고리즘은 이처럼 밀접한 관계를 갖는다. 자료구조가 배열이 아니라 다른 식으로 구성되어있었다면, 다른 방식의 알고리즘을 적용했을 것이다. 즉, 자료구조가 결정되어야 효율적인 알고리즘을 결정할 수 있다.

> 자료구조에 따라 알고리즘은 달라진다.
