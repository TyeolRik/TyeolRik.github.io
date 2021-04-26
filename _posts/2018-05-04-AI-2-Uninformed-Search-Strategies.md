---
layout: post
title: "[인공지능] Uninformed Search Strategies"
section-type: post
category: Artificial_Intelligence
tags:
  - artificial
  - intelligence
  - ai
  - search
  - bfs
  - dfs
  - ids
---

본 글은 **「Artificial Intelligence : A modern Approach (3rd ed.)」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

> Uninformed Search (Blind Search) 란 문제에서 정의한 것 이외의 추가적인 정보가 없을 때 사용하는 Search Strategy 이다.

이 전략이 할 수 있는 행위는 자식 노드(Successor)를 생성하거나 목표 도달 여부를 구별하는 것 밖에 없다. Search Strategy 들은 어디에 노드가 확장 되었는 지의 순서로 구별된다. 어떤 상태(목표에 도달하기 전)가 좀더 괜찮을지를 판단하는 Strategy를 Informed Search 또는 Heuristic Search(휴리스틱) 라고 부른다.

## Breadth-first Search

![Imgur](https://i.imgur.com/RPDc90P.png)

가장 단순한 알고리즘이다. 루트 노드가 처음 확장되면, 루트 노드의 자식들을 확장하고, 그 자식들을 확장하고 계속 반복하는 알고리즘이다. 이 알고리즘은 FIFO Queue로 매우 쉽게 사용가능하다. 즉, 새 노드는 항상 큐의 뒤로 가고 오래된 노드는 새 노드보다 깊이가 얕기(Shallow) 때문에 먼저 확장된다.

### 알고리즘의 가치 판단

[알고리즘의 판단 기준]({{ site.baseurl }}{% link _posts/2018-05-02-AI-1-Search-Algorithm.md %})[^1]을 살펴보자. 일단 이 알고리즘은 Complete하다. 만약, Shallowest goal node[^2]를 적절한 Depth를 나타내는 $d$라고 해보자. 그리고 이 Tree 구조의 Branch Factor를 $b$라고 해보자. Depth = 1에서 $b$개의 자식노드가 생길거고 그 아래에서는 $b^2$개, 그 아래에서는 $b^3$개 ... 이렇게 계속 이어져가나서 결국에는 Shallowest goal node인 Depth = $d$까지 내려갈 것이다. 그 때의 모든 노드의 갯수는 다음과 같다.

$$
b + b^{2} + b^{3} + \cdots + b^{d} = O(b^{d})
$$

정확히는 $O(b^{d+1})$이다. 왜냐하면, 최악의 상황을 가정하기 때문인데, 진짜 최악의 상황에서 트리의 제--일 오른쪽 끝의 노드가 Shallowest goal node 라고 할 때, 그 이전의 좌측 노드들은 Frontier가 되므로 또 $b$개의 Child node를 계속 생성해나갈 것이다. 고로, 사실 실제로 트리구조의 Depth는 $d+1$까지이다.

Space complexity 로 생각해볼 때의 값도 $O(b^{d})$이다. 결국 전체 메모리 크기는 $2b^{d}$보다 작기 때문에 그냥 $O(b^{d})$라고 할 수 있다.

그런데 사실 $O(b^{d})$와 같은 **Exponential complexity** (지수적인 복잡도) 는 상당히 무시무시하다. 지수적으로 증가하기 때문에 데이터의 양이 많아질 수록 걸리는 시간이나 메모리의 양은 천문학적으로 증가한다. 예를 들어서 어떤 트리가 존재한다고 치자. 이 트리의 $b = 10$, 1노드당 1KB의 메모리가 필요하며, 1초에 100만 노드를 검색할 수 있다고 해보자. 만약에 Shallowest goal node가 Depth $d = 12$에 존재한다고 한다면, 노드의 갯수는 $10 + 10^{2} + \cdots + 10^{12} \approx 10^{12}$이고, 시간은 $10^{12}\text{nodes} \div 10^{6} \text{nodes/sec} = 10^{6} \text{sec} = 11.57 \text{days}$가 된다. 즉, 깊이가 12밖에 안 되는데도 불구하고 11.57일 동안 연산을 해야한다. 메모리의 갯수는 위와 비슷하게 연산해보면, 1PB가 된다고 한다. 일반적으로 1PB의 용량을 가진 PC가 없을 뿐만 아니라 연산 하나에 12일이나 걸린다는 것을 고려해보면, 완전 **쓸모없는 알고리즘** 이라는 사실을 알 수 있다. 결론을 내자면, **Exponential-complexity를 가진 문제는 uninformed method로는 해결할 수 없다.** ~~노드 수가 극히 작다는 것을 제외하면~~

## Uniform-cost Search

만약 모든 과정의 Cost가 동일하다면, Breath-First search가 이상적이다. 왜냐하면 Shallowest goal node 까지만 Expand 하고 끝나기 때문이다. 그러나, 많은 문제에서 모든 과정의 Cost가 동일할 수 없다. Uniform-cost Search는 lowest path cost $g(n)$까지의 노드 $n$까지 Expand한다. 이 알고리즘은 $g$라는 정렬 알고리즘에 의해서 Priority가 정해지는 Priority Queue에 Frontier들을 저장함으로써 수행된다.

위의 Breath-first search와 다른 점이 2가지가 있는데, 첫 번째는 node에 대해서 goal test를 하고나서 Expand 된다는 것이다. 왜냐하면, 생성된 첫 번째 Goal node가 최적 경로가 아닐 수 있기 때문이다. 두 번째 다른 점은 더 나은 경로를 찾을 경우를 대비해서 Frontier 노드에 test를 추가하는 것이다.

### 알고리즘의 가치 판단

Uniform-cost search는 경로의 갯수가 아니라 총 Cost의 크기에만 관심이 있기 때문에 무한 루프에 걸리기 쉽다. 예를 들어서, Assembly에는 NOP[^3]라는 명령어가 존재하는데 무한 NOP를 실행할 수도 있기 때문이다. 고로, 모든 경로에 매우 작은 양수값 $\epsilon$을 넣음으로써 무한 루프 문제를 해결할 수 있고, 이 알고리즘의 Completeness를 보장할 수 있다.

이 알고리즘은 Depth가 아니라 Cost로 결정짓기 때문에 $b$나 $d$로는 Complexity를 계산하기가 어렵다. 고로, 최적의 경로의 Cost를 $C^{*}$라고 해보자. 또한 위에서 무한 루프 문제를 해결하기 위해서 매우 작은 양수값인 $\epsilon$을 더하기로 했다. 고로, 이 알고리즘의 Complexity는 $O(b^{1+\lfloor{C^{*} / \epsilon}\rfloor})$[^4] 이라고 할 수 있다. 이 값은 $b^{d}$, Breath-first search보다 훨씬 클 수 있다. 왜냐하면, 어떤 경로를 찾았다고 하더라도 최적인지 아닌지를 확인하기 위해서 다른, 여러, 많은 경로를 탐색해봐야 하기 때문이다. 만약, 모든 경로의 Cost가 동일할 경우에 Uniform-cost search의 Complexity는 $O(b^{1+\lfloor{C^{*} / \epsilon}\rfloor}) = b^{d+1}$이다. 왜냐하면, Breath-first search는 Goal node를 찾음과 동시에 종료되기 때문에 나머지를 안해도 된다. 그러나, Uniform-cost search의 경우에는 Goal node를 찾았음에도 불구하고 이게 최적의 경로인지를 확인하기 위해서 동일 Depth의 모든 노드를 방문해봐야 하기 때문에 해당 Depth를 한번 더 돌아야하므로 $b^{d+1}$이다.

## Depth-first Search

Search tree에서 가장 깊은 곳을 먼저 탐색하는 방식이다. 더 이상의 자식 노드(Successor)가 없을 때 까지 아래로 탐색한 다음, 자식 노드가 없다면 그 다음 노드로 넘어가는 방식이다. Depth-first Search는 위에서 언급한 Breadth-first Search와는 다르게 **Stack** 구조를 활용한다. (LIFO queue) 그림으로 살펴보는 작동방식은 다음과 같다.

![Imgur](https://i.imgur.com/QPpGPdM.png)

Depth-first Search는 어떤 Version을 사용하는가에 따라서 특성이 서로 다르다. **Graph-search version** 에서는 반복된 상태나 중복 경로가 제외되기 때문에 유한한 상태에서는 Complete 하다. 왜냐하면, 모든 노드로 Expand 될 것이기 때문이다. 그러나 **Tree-search version** 의 경우에는 특정 루프가 반복될 가능성이 있기 때문에 Complete 하지 않다. 무한한 State space는 중복 경로의 생성을 막을 수가 없는 단점이 있다. 그러한 이유로, Graph-search든, Tree-search든 둘 다 최적의 방식은 아니다. Depth-first Search는 일단 끝까지 탐색해서 Goal-node가 나오면 중단하는 알고리즘인데, 그 옆의 노드(더 얕은 노드)에서 답이 나올 수 있지만, 그것을 확인하지 않기 때문에 최적의 노드라고 할 수는 없다.

### 알고리즘의 가치 판단

~~당연히 유한한 State space에서~~ Time-complexity는 State space의 갯수에 영향을 받는다. Search Tree에서 모든 $O(b^{m})$의 노드를 생성할 수 있다. ($m$은 현 트리구조에서 최대 깊이) 즉, 실제 State space 의 크기보다 더 큰 트리를 생성할 수 있다는 의미이다. 결론은 Time-complexity에서는 Breath-first Search와 비교해서 장점은 없다. 그러나, **Space-complexity에 Depth-first Search를 사용해야하는 이유가 있다.** Depth-first Search의 경우에는 루트노드에서 말단까지의 데이터만 저장하면 된다. 한번 노드가 루트부터 말단까지 Expand 된 이후에는 더 이상의 자식 노드가 존재하지 않는다면 메모리에서 그냥 지워버리면 된다. 즉, State space에서 자식노드가 $b$개 있고, 최대 깊이가 $m$이라고 한다면 노드의 개수가 오직 $O(bm)$개만 필요하다는 의미이다.

Depth-first Search의 변종으로 **Backtracking Search**라는 것이 있는데, 이것은 훨씬 더 적은 메모리를 사용한다. 이 알고리즘에서는 모든 자식노드(Successor)를 생성하는 것이 아니라 단 하나의 자식노드만 생성한다. 이 각각의 생성된 노드는 \"다음에 어떤 노드를 만들어야할까?\" 를 기억하기 때문이다. 그러므로 이 알고리즘에서는 오직 $O(m)$의 메모리만 사용하게 된다. 이 알고리즘은 자식노드를 복사하기 이전에 현재 상태에 대한 정보 만을 수정한 자식노드를 생성해내기 때문에 단 한개의 상태 정보만을 저장하게 되고, 메모리 상으로는 한 개의 상태 정보 + $O(m)$의 형태를 갖게 된다.

## Depth-limited Search

무한한 State space에서의 Depth-first Search는 실패를 일으킬 수 있는데, 미리 설정해놓은 깊이 값인 $l$을 이용함으로써 이 실패를 줄일 수 있다. 즉, 깊이 $l$까지 도달하면 **더 이상의 자식노드는 존재하지 않는다고 간주**하는 알고리즘이다. 만약 우리가 $l$값을 가장 얕은 Goal-node의 깊이인 $d$보다 작게 잡았을 때, Complete 하지 않게 된다. 또한, 우리가 $l > d$로 잡았을 때, 이 알고리즘은 최적 알고리즘이 아니게 된다. 이 알고리즘의 Time-complexity는 $O(b^l)$이 되며, Space-complexity는 $O(bl)$이 된다.

## Iterative Deepening Depth-first Search

이 알고리즘은 Depth-first tree Search랑 조합하여 사용되는 일반적인 Strategy이다. 이것은 점차적으로 limit을 증가해서 최적의 Depth limit 값을 찾을 때 까지 진행된다. 이 알고리즘 상 Depth limit 값이 Shallowest goal node의 Depth 값인 $d$에 도달할 때까지이다. 이 알고리즘은 Depth-first와 Breadth-first Search의 장점을 조합한 알고리즘인데, Depth-first Search 알고리즘처럼 메모리가 $O(bd)$만큼 필요하고, Breath-first Search 알고리즘처럼 Branching factor가 유한할 때 Complete 하며, 노드의 깊이에 따라서 Cost가 감소하지 않을 때 최적한 알고리즘이다.

![Imgur](https://i.imgur.com/H7HmcEO.png)

눈으로 보기에는 ```Limit++``` 될 때마다 계속적으로 중복된 State를 생성하기 때문에 비효율적인 알고리즘으로 생각하기 쉽다. 그러나, 이 알고리즘에서 사용된, 중복된 상위 노드를 생성해내는 것은 생각보다 비용이 크지 않다. 왜냐하면, 대부분의 노드는 하위에 존재하기 때문이다. 이 Iterative deepening search의 경우에는 가장 말단 노드인 Depth $d$의 위치에서는 딱 한번만 생성되고 $d-1$의 위치에서는 2번 생성되고 이렇게 올라가서 최 상위 루트 노드에서는 $d$번 생성된다. 최악의 경우를 상정했을 때는 노드의 수가 다음과 같은 공식을 갖게 된다.

$$
N(\text{IDS}) = (d)b + (d-1)b^2 + \dots + (1)b^d
$$

사실 이것도 Time-complexity로는 $O(b^d)$이다. 왜냐하면, 앞에 곱해지는 상수의 값이 그렇게 크지 않아서 무시할 수 있기 때문이다. 그러므로 일반적으로 **Iterative deepening search가 Search space가 넓고 Solution의 Depth를 모를 때 가장 선호되는 Uninformed Search Method이다.** 그러나, 만약에 진짜로 반복 작업에 대해서 고려해야할 수준이라면, 약간 섞어서 사용할 수 있는 메모리 상에서는 Breath-first Search를 사용하고, 다 써버리면 그 상태의 Frontier에서 Iterative deepening search를 사용하는 알고리즘을 짤 수는 있다. ~~알고리즘이 복잡해질 뿐이다.~~









<br/>
<br/>
<br/>

[^1]: Completeness, Optimality, Time complexity, Space complexity
[^2]: 가장 얕은 골 노드, 그래프에서 루트 노드에서 목표 지점이 되는 노드까지의 경로 중에서 가장 Depth가 작은 것. 가장 거쳐가는 과정의 수가 작은 경로의 종점
[^3]: 또는 NOOP, No Operation의 약자로 CPU를 쉬게 한다. CPU의 구조상 NOP가 존재해야만 레지스터 값이 업데이트 된다고 한다. ~~정확한 내용은 아니므로 그냥 참조~~
[^4]: 바닥함수, $\lfloor x \rfloor = \text{max}\{n \in Z: n\le x\}$, 실수 $x$의 바닥 함수 값은 $x$와 같거나 그보다 작은 정수 가운데 가장 큰 하나
