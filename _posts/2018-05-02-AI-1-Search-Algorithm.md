---
layout: post
title: "[인공지능] Solving Problems by Searching :: Search로 문제 해결하기"
section-type: post
category: Artificial_Intelligence
tags:
  - artificial
  - intelligence
  - ai
  - search
  - tree
  - queue
---

본 글은 **「Artificial Intelligence : A modern Approach (3rd ed.)」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## Introduction :: 개요

인공지능의 목표는 어떤 형태의 문제를 찾으면 우리는 그것을 해결해야 한다는 것이다. **어떤 해결책**이란 행동의 연속이기 때문에, 탐색 알고리즘(Search Algorithm) 역시 다양한 행동의 연속으로 여길 수 있다. ~~탐색 알고리즘 == 해결책 모형~~

### 예제 설명

![Imgur](https://i.imgur.com/fFfPC3l.png)

위와 같은 지도가 있다고 해보자. ~~책에서는 Romania 라고 하던데..~~ 우리는 현재 좌측 끝에 있는 Arad에서 시작해서, 중앙 하단부 근처에 있는 Bucharest로 여행을 하려고 한다. 이 문제를 트리 구조로 표현해보자. 각각의 상태에 해당하는 것을 노드라고 할 때, Arad에서 Bucharest까지 트리가 점점 성장해나가는 과정을 보이고자 한다.

**Root node(루트 노드)** 는 최초 상태에 대응된다. 현재 예제에서는 우리가 Arad에 있기 때문에 Arad가 Root node가 된다. 우리가 이제 어떠한 여러가지 행동을 취한다고 생각하자. 그렇다면 우리는 현재 상태를 **Expanding(확장)** 함으로써 행동을 취할 수 있다. 즉, 현재 상태에서 할 수 있는 행동들을 새롭게 **Generating(만들어낸다)** 는 것이다. 여기 예시에서는 **Parent Node(부모노드)** 인 Arad에 3개의 **Child Node(자식노드)** 인 Sibiu, Timisoara, Zerind를 추가한다는 것이다.

![Imgur](https://i.imgur.com/I45CIX7.png)

위의 사진처럼 Arad 아래에 3개의 자식노드를 확장했다. 우리가 Sibiu를 선택했다고 가정해보자. 그렇다면, Sibiu를 선택한 것이 목표를 달성한 것인지를 확인한다. 그렇지 않다는 사실을 알게 되고, 우리는 Sibiu 아래에 또 4개의 자식노드를 구성한다. Arad, Fagaras, Oradea, RimnicuVilcea.

![Imgur](https://i.imgur.com/mxvRzty.png)

그럼 이제 총 6개의 선택지가 생겼다. Sibiu에서 Arad, Fagaras, Oradea, RimnicuVilcea로 갈건지, 아니면 돌아가서 Timisoara나 Zerind를 선택할 것이지 말이다. 이 6개의 노드를 **Leaf Node(잎새노드)** 라고 한다. Leaf node의 정의 자체는 "트리 구조상에서 더 이상 자식 노드가 존재하지 않는 노드, 말단 노드"를 의미한다. 또한, 이 예제에서는 언제든지 이 빨간 Leaf node 들이 확장할 수 있다. "언제든지 확장 가능한 노드를 **Frontier** 라고 한다." 이와 같이, 해결법이 나올 때까지 또는 더 이상 Expanding 할 수 없을 때까지 Frontier에서 계속 Expanding 한다. Search Algorithm은 이러한 기본적인 구조를 바탕으로 어떻게 노드를 선택하고 확장할 지를 다양화 한 것이 바로 **Search Strategy** 라고 한다.

여기서 이상한 부분을 볼 수 있는데, Arad에서 시작해서 Sibiu로 갔다가 다시 Arad로 돌아오는 것이다. 이러한 것을 "Arad는 Search tree에서 **Repeated State** 이다."라고 말한다. 이런 경로를 **Loopy Path** 라고한다. Loopy Path 란 **Redundant Path** 의 특수한 경우이다. Redundant Path란 같은 시작점에서 같은 종점으로 가는 경로가 여러 개일 때를 말한다. 위의 예시에서 Arad에서 Sibiu를 간다고 하자.

1. Arad - Sibiu (Cost: 140)
2. Arad - Zerind - Oradea - Sibiu (Cost: 297)

위와 같이 2개의 경로가 나올 수 있는데 일반적으로 2번째 경로를 Redundant 하다고 한다. (같은 상태로 가는데 더 나은 방법) Redundant Path 를 피하는 방법은 어떤 경로를 이용했는 지를 항상 기억하는 것이다. 이것을 하기 위해서 자료구조의 **Explored Set** 을 사용해야한다. Explored Set이란 모든 확장된 노드를 기억하는 것이다.

## Search Algorithm의 구조

Search Algorithm은 만들어진 Search Tree의 진행과정을 추적하기 위해서 다음과 같은 데이터 구조가 필요하다. 트리에 $n$개의 노드가 존재한다면 각 노드에 4개의 필드가 존재하는 데이터 구조가 필요하다.

- $n$\.STATE: 각 노드에 대응하는 현재 상태.
- $n$\.PARENT: 각 노드의 Parent Node. (어떤 노드가 이 노드를 만들었는가?)
- $n$\.ACTION: 이 노드를 만들기 위해서 Parent Node가 취한 행동.
- $n$\.PATH-COST: 초기상태에서 노드로 가는데 필요한 비용, 이것은 Parent Pointer에 적혀있다. 일반적으로 $g(n)$으로 표시한다.

이제 위와 같은 속성을 가진 노드들을 가질 수 있게 되었다. 컴퓨터적으로 노드를 어떤 메모리에 저장해야한다. 왜냐하면, **Search Algorithm이**, 각자의 Strategy에 따라서 노드들을 확장해갈 때, **쉽게 다음 노드를 선택하기 위해서** Frontier가 그러한 방법으로 저장될 필요가 있다. (Frontier가 다음 노드를 쉽게 선택할 수 있게 하는 알고리즘적인 저장방식이 필요하다.) 그러한 저장방식으로는 **큐(Queue)**가 적절하다.

### 큐 :: Queue

큐는 다음과 같은 3가지의 작업을 할 수 있다.

- EMPTY?($queue$): 큐에 더 이상의 원소(데이터)가 존재하지 않을 때 true값을 return 한다.
- POP($queue$): 큐의 첫 번째 원소를 없애고 그것을 return 한다.
- INSERT($element$, $queue$): 원소를 삽입하고 결과 큐를 return 한다.

큐는 어디에(몇 번째에) 노드를 저장했는 지를 의미하는 **순서** 에 따라서 서로 구별이 된다. ~~이 책에서는 스택도 노드로 취급한다.~~ First-in, First-out을 의미하는 **FIFO Queue**, Last-in, First-out을 의미하는 **LIFO queue (Stack)**, 그리고 특정한 정렬 알고리즘에 따라서 가장 높은 우선순위를 갖는 원소를 POP 하는 **Priority Queue** 가 있다.

## 문제 해결의 속도 측정

우리가 어떤 Search Algorithm을 선택하기 이전에, 우리는 여러 알고리즘 중에서 어떤 알고리즘을 선택할 것인가를 정할 수 있는 기준이 필요하다. 우리는 다음과 같은 4가지의 방법으로 알고리즘의 성능을 평가할 수 있다.

- **Completeness**: 해답이 한 개 존재할 때, 해답을 찾을 수 있다고 보장할 수 있는가? (확실히 답을 찾을 수 있는가?)
- **Optimality**: 그 Strategy가 최선의 해답을 찾을 수 있는가? (the Lowest Path Cost among all solutions)
- **Time complexity**: 해답을 찾는데 얼마나 시간이 걸리는가?
- **Space complexity**: 해당 Search를 수행함에 있어 얼마나 많은 메모리가 필요한가?

Time complexity와 Space complexity를 묶어서 일반적으로 **Problem difficulty** 라고 한다. 컴퓨터 과학 이론에서는 위의 Romania 예시와 같은 그래프의 크기를 $|V| + |E|$로 표현한다. $V$는 그래프에서의 노드의 집합, $E$는 엣지(Edge)의 집합[^1]을 의미한다. 이러한 방법으로 Performance를 측정하는 것은 Input data가 명확할 때만 가능하다. 위의 Romania 예시에서는 Input data가 명확하게 모두다 주어져 있기 때문에 사용가능한 것처럼 말이다. 그러나, 실제 A.I 분야에서는 그래프가 빈번하게 불명확하게 주어져있다. 왜냐하면, 초기 상태, 행동, 변화 등의 경우의 수가 무한하기 때문이다.

그런 의미에서 **Complexity는 3개 성분의 크기로 표현된다.** $b$는 Branching Factor(분기 계수, 어떤 노드의 최대 자식 노드 개수), $d$는 Depth, 해결법으로 가는 경로 중에서 가장 얕은 것. (행동의 개수가 제일 작은 것), 그리고 $m$은 Maximum length of any path in state space, 모든 경로 중에서 가장 긴 경로의 길이를 의미한다.

### Search cost

Search Algorithm의 효율을 알기 위해서 우리는 **Search cost** 또는 **Total cost**를 도입한다. Search cost란 일반적으로 Time complexity에 의존하는 경향이 있다. 그러나, 메모리 사용량을 포함할 수도 있다. Total cost는 Search cost와 Path cost of solution을 합친 것이다. 위의 Romaina 예시를 들어보자면 Arad에서 Bucharest로 가는 경로를 찾는다고 할 때, Search cost는 Search를 함으로써 걸리는 시간을 의미하고, Solution cost는 경로의 길이를 의미한다. 만약, Solution이 Arad - Sibiu - Rimnicu Vilcea - Pitesti - Bucharest 라고 한다면, Solution cost는 $140 + 80 + 97 + 101 = 318$이 된다.

<br/>
<br/>
<br/>


[^1]: 그래프 이론에서 엣지란, 노드와 노드 사이의 관계 정보를 의미한다. 굳이 위의 Romania 예시에서 엣지를 표현하자면, 각 도시간의 Cost를 의미한다. (ex. 140(Arad - Sibiu))
