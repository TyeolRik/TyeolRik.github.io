---
layout: post
title: "[인공지능] Informed(Heuristic) Search Strategies"
section-type: post
category: Artificial_Intelligence
tags:
  - artificial
  - intelligence
  - ai
  - search
---

본 글은 **「Artificial Intelligence : A modern Approach (3rd ed.)」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

> Informed Search Strategy란 문제를 정의하는데에 필요한 정보 외에 추가적인 정보를 활용해서 탐색을 수행하는 것을 의미한다.

일반적으로 고려하는 접근법을 우리는 Best-first search 라고 한다. 평가 함수 $f(n)$에 따라서 어떤 노드를 선택해서 Expand 할지를 고려하는 Tree-Search나 Graph-Search의 한 예이다. 이 평가함수는 비용 평가로 해석된다. 그러므로 가장 낮은 값을 가진 노드가 먼저 Expand 된다. 이전의 한 알고리즘 중 [Uniform-cost search]({{ site.baseurl }}{% link _posts/2018-05-04-AI-2-Uninformed-Search-Strategies.md %})에 사용되기에 이상적이다.

$f$를 선택하는 것이 Search Strategy를 결정짓는다. 대부분의 Best-first 알고리즘은 $f$의 요소로 $h(n)$으로 표현되는 휴리스틱 함수를 포함한다. 휴리스틱 함수, $h(n)$은 $n$ 노드에서 Goal state로 가는 최소 비용의 경로의 추정 값을 의미한다. 서울에서 부산으로 가는 경로를 예로 들어본다면, 지도 상의 서울과 부산의 직선 거리를 통해서 최소 비용의 추정치를 예측할 수 있다.

휴리스틱 함수는 Search 알고리즘에 문제에 대한 추가적인 지식이 전해졌을 때 사용되는 가장 일반적인 형태이다. 만약 $n$이 Goal node라면, $h(n) = 0$이다.

## Greedy Best-first Search

> Greedy Best-first Search는 Goal과 가장 가까운 노드로 확장하려고 한다. 왜냐하면, 그것이 Solution으로 가장 빨리 이끌어 줄 것 같기 때문이다.

이 알고리즘에서는 노드를 단순히 휴리스틱 함수로만 평가한다. 고로, $f(n) = h(n)$이다. 작동 방식은 매우 단순한데, 매 순간마다 **가장 비용이 적게 드는 노드**를 선택하는 방향으로 진행된다. 이 알고리즘은 최적의 경로를 찾아주는 알고리즘이 될 수 없다. 또한, 심지어 유한한 State space에서 작동된다고 할지라도 Incomplete하다. 왜냐하면, 최소 비용을 따라서 어떤 노드에 갔을 때, 이것이 Goal node가 아닌 Dead end (Frontier) 라면 무한 루프를 돌 것이기 때문이다. ~~뒤로 돌아와서 다시 최소 비용인 그 노드로 가겠지~

### 알고리즘의 가치 판단

최악의 상황을 가정한 Time and Space complexity는 $O(b^m)$이다. (트리 구조에서) 여기서 $m$은 Search space에서의 Depth의 최대값이다. 그러나, 좋은 휴리스틱 함수를 이용하면 Complexity는 상당히 줄어들 수 있다.

## A\* Search : Solution까지의 전체 추정 비용의 최소화

> A\* Search 알고리즘은 노드 $n$에 도달하기 위한 비용 $g(n)$과 노드 $n$에서 Goal 가는데 필요한 비용 $h(n)$의 합으로 표현된다. 즉, 평가함수 $f(n) = g(n) + h(n)$이다. 다시말하면, 평가함수 $f(n)$은 노드 $n$을 거쳐서 Goal node로 가는 경로 중에서 가장 비용이 저렴하다고 추정되는 비용의 추정치이다.

이 알고리즘은 Complete 하고 최적의 경로를 알려주는데 적합하다.

### 최적화의 조건 : 허용과 일관성

최적화를 위한 첫 번째 조건은 $h(n)$이 **Admissible Heuristic** (납득할만한 휴리스틱 함수)라는 것이다. Admissible Heuristic이란 Goal node에 도달하는데 드는 비용을 절대로 최대평가 하지 않는 것이다. Admissible Heuristic은 본래 낙관적이다. 왜냐하면 문제를 해결하는데 드는 비용이 실제로 해결하는데 드는 비용보다 작기 때문이다. ~~휴리스틱 함수의 값은 실제 비용보다 작다.~~ 예를 들어 서울에서 부산으로 가는 경로는 엄청 많으나 휴리스틱 함수인 서울-부산의 지도상 직선거리를 이용해서 최단경로를 검색한다고 했을 때, 서울-부산의 직선거리(휴리스틱 함수)보다 짧은 실제 경로(실제로 드는 비용)는 없을 것이기 때문이다.

두번째로 **일관성** (때때로는 단조로움) 이라 불리는 A\* Search 만에 적용되는 ~~약간 강력한~~ 조건이 필요하다. 휴리스틱 함수 $h(n)$이 일관성이 있다는 말은, 모든 $n$노드와 그의 어떤 행위를 통해서 생성된 자식노드(Successor) $n'$에 대해서, 노드 $n$에서 Goal에 도달하는 추정 비용은 노드 $n$에서 노드 $n'$ 까지 가는 실제 비용과 노드 $n'$에서 Goal에 도달하는 추정 비용을 합한 것보다 작다와 같다. 이 어려운(?) 말을 수식으로 표현하면 아래와 같은 식으로 표현된다.

$$
\LARGE h(n) \le c(n, a, n') + h(n') \qquad \text{(단, $c(n, a, n')$은 $n$노드에서 $n'$노드까지 드는 실제 경로 비용)}
$$

![Imgur](https://i.imgur.com/mvu1nLP.png)

위의 형태를 일반적인 삼각 부등식의 형태라고 할 수 있다. 왜냐하면 삼각형에서 양변의 합은 나머지 한 변의 합보다 항상 크기 때문이다. 사실 모든 Admissible Heuristic 에서 위 부등식은 성립한다. 왜냐하면, $n$에서 Goal Node로 가는 추측비용 $h(n)$보다 $n$에서 $n'$을 거쳐서 Goal Node로 가게 되는 실제 비용이 더 저렴하다면 Admissible의 특성을 배반하기 때문이다. (Admissible : 실제로 해결하는 비용보다 추정 비용이 항상 더 작음.)

또한 모든 Consistent Heuristic 또한 Admissible 하기 때문에 Consistency가 Admissible 보다 좀더 엄격한 요구조건이 따른 다는 것을 알 수 있다. ~~그러나 사실 Admissible 하지만 Consistent 하지 않는 휴리스틱 함수를 만드는 것은 어렵다.~~



### A\*의 최적화

A\* 알고리즘은 2가지 특성이 있었다.

> Tree-search Version의 A\*는 $h(n)$이 Admissible 할 때 최적하고 <br />
> Graph-search Version의 A\*는 $h(n)$이 Consistent 할 때 최적하다.

위의 두 특성은 Uniform-cost Search의 최적화에 대한 주장을 반영하는 특성이다. **만약, $h(n)$이 Consistent 하면, 함수 $f(n)$은 증가함수**이다. 이의 증명은 Consistent 에서 바로 도출할 수 있다. 아래의 수식에서 $n'$은 $g(n')=g(n) + c(n, a, n')$을 만족하는 $n$의 자식노드(Successor)이다.

$$
\LARGE f(n') = g(n') + h(n') = g(n) + c(n,a,n') + h(n') \ge g(n) + h(n) = f(n)
$$

다음은 **A\* 알고리즘으로 다음 노드 $n$을 선택했다면, $n$으로 가는 최적 경로를 이미 찾았다**는 사실을 증명할 수 있다. 만약 이것이 사실이 아니라면, 시작노드에서 $n$까지 가는 최적 경로상의 다른 Frontier 노드인 $n'$이 있을 수 있다. 왜냐하면 $f$는 어떤 경로에 대해서도 항상 증가함수 이기 때문에 $n'$은 $n$보다 낮은 $f$값을 가지고 있을 것이고, 보다 먼저 선택되었을 것이기 때문이다. ~~말은 어려운데 사실 수학의 [롤의 정리][96e2e7ff], [평균값 정리][131c61fb] 정도로 이해하면 될 듯하다.~~

위 두 사실을 통해서 Graph-search를 이용한 A* 알고리즘으로 확장된 Node 들의 순서는 $f(n)$의 순서라는 사실을 알 수 있다. 그러므로, 확장을 통해서 처음 선택된 Goal 노드가 최적 경로일 수 밖에 없다는 사실을 도출해낼 수 있다. 왜냐하면, $f$는 Goal 노드로 가는 실제 비용인데 그 다음에 선택될 Goal 노드는 $f$가 증가함수이므로 적어도 앞의 노드보다 값이 클 것이기 때문이다.

$f$라는 함수, 실제 비용이 어떤 경로에 대해서도 증가함수를 취한다는 사실은 State space에서 **등고선 (Contour)**을 그릴 수 있게 한다. Uniform-cost Search ($h(n) = 0$) 에서 이 등고선은 중앙 노드를 중심으로 한 원의 형태로 그려질 것이다. 만약 좀더 정확하고 좋은 휴리스틱 함수가 있다면, 이 등고선은 최적 경로랑 최대한 비슷한 타원형태 (좁은 원)로 그려질 것이다. 만약 $C^{*}$이 최적 경로를 수행할 때 따르는 비용이라 할 때, 다음 두 가지 사실이 참이라고 할 수 있다.

- A*는 $f(n) < C^{*}$의 모든 노드를 확장한다.
- A*는 Goal 노드를 선택하기 전에 $f(n) = C^{*}$인 Goal Contour 옆에 있는 몇몇 노드를 선택할 수도 있다.

Completeness (완전성) 는 $C^{*}$보다 작거나 같은 유한히 많은 노드들에서만 가능하다.

A\* 알고리즘은 $f(n) > C^{*}$인 노드로는 확장하지 않는데, 이것을 **Pruned**(가지치기) 됐다고 표현한다. AI의 많은 분야에서 매우 중요한 Pruning의 개념은 가능성들을 시험해보기도 전에 고려사항에서 제거하는 것을 의미한다.

루트에서 시작해서 경로를 탐색하고 확장하고, 같은 휴리스틱 정보를 사용하는 이러한 타입의 최적 알고리즘에서 A\*이 어떤 주어진 휴리스틱 알고리즘 중에서도 가장 **Optimally Efficient** (최적 효율)하다. 다시 말해서, **A\* 알고리즘 보다 적게 노드를 확장하면서 완전성을 보장할 수 있는 알고리즘은 존재하지 않는다.** 왜냐하면, 어떤 알고리즘이든 $f(n) < C^{*}$의 모든 노드를 확장하지 않으면 최적의 해결책을 놓칠 위험성을 가지고 있기 때문이다.

A\* Search는 많은 만족스러울 결과를 낼 수 있는 알고리즘들 중에서도 Complete(완전) 하고 최적하며, 최적 효율적이다. 그러나, State(상태)의 개수가 지수적이기 때문에 모든 탐색의 상황에서 A\* 알고리즘이 답이라는 것은 아니다. 왜냐하면, 대부분의 문제에서 Goal Contour 안에 있는 상태의 개수는 여전히 지수적 증가량을 보이고 있기 때문이다. (복잡도 함수 $f(n)$가 지수함수라는 의미) 일반적으로 어떤 상수 $n$ 번째에 드는 비용은 휴리스틱의 **절대오차**(Absolute Error)와 **상대오차**(Relative Error)로 표현된다.

- 절대오차 : $\Delta \equiv h^{*} - h$ (단, $h^{*}$은 Root에서 Goal까지 가는데의 실제 비용)
- 상대오차 : $\epsilon \equiv (h^{*} - h)/h^{*}$

### 시간 복잡도

A\* 알고리즘의 시간 복잡도는 **어떻게 State Space (상태 공간)을 가정하냐**에 따라서 매우 달라진다. 가장 간단한 모델인 Goal이 한 개이고, 역으로 행동할 수 있는 (Reversible Action) 트리구조로 시간 복잡도를 알아보자. 이 상황에서 A\*의 시간복잡도는 최대 절대오차 (Maximum Absolute Error)가 지수형이며, $O(b^{\Delta})$로 표현될 수 있다. 어떤 상수 번째의 비용은 $O(b^{\epsilon d})$로 표현될 수 있다. (단, $d$는 Solution의 깊이 depth) 좀더 정확히 표현하자면 $\epsilon$은 상수이고 지수형 증가함수를 띄며, $d$에서의 시간 복잡도가 지수함수이기 때문에, $O((b^{\epsilon})^d)$로 표현하는 것이 좀더 바람직하다.

그러나, 연산 시간부분에서 A\*은 문제가 되지 않지만, 제한 시간 안에 필요한 메모리 공간이 바닥나 버리기 때문에 **큰 스케일의 문제에서는 실용적이지 않다.** 왜냐하면, ~~모든 Graph-search 알고리즘이 그렇듯~~ 생산한 모든 노드를 메모리 안에 보관해놓기 때문이다.

## Memory-bounded Heuristic Search

위의 A\* 알고리즘은 완벽한 것 같지만, 메모리적인 측면에서 비효율적인 모습을 보이기 때문에 스케일이 큰 문제에서는 사용되기 어려움을 설명하였다. 이제 후술할 내용은 메모리적인 측면을 극복하고 Optimality와 Completeness를 유지하면서 실행 시간이 적게 드는 알고리즘에 대해서이다.

### IDA\* :: Iterative-deepening A\*

A\*의 메모리 필요량을 줄이는 가장 간단한 방법은 휴리스틱 탐색 부분에서 [Iterative Deepening]({{ site.baseurl }}{% link _posts/2018-05-04-AI-2-Uninformed-Search-Strategies.md %})의 개념을 적용하는 것이다. 그 결과가 바로 Iterative-deepening A\* 이다. IDA\*과 기본 Iterative-deepening 알고리즘의 주요한 차이점은 바로 Cutoff 부분이다. 기존의 Iterative-deepening은 특정 Depth 값에서 알고리즘을 중지하는 한편, IDA\*은 $f$-cost ($g + h$)에서 중지한다. 각각의 Iteration에서 Cutoff 값은 이전 Iteration의 Cutoff 값을 넘는 어떤 노드의 $f$-cost 값 중에서는 가장 작다는 특징이 있다.

### RBFS :: Recursive Best-First Search

RBFS란 오로지 Linear Space 만을 이용해서 Best-First Search를 수행하려고 만든 모조품(Mimic)이다. 







<br/>
<br/>
<br/>


[131c61fb]: https://namu.wiki/w/%ED%8F%89%EA%B7%A0%EA%B0%92%20%EC%A0%95%EB%A6%AC "평균값 정리 - 나무위키"
[96e2e7ff]: https://namu.wiki/w/%EB%A1%A4%EC%9D%98%20%EC%A0%95%EB%A6%AC "롤의 정리 - 나무위키"