---
layout: post
title: "[Random] 랜덤이란 무엇일까?"
section-type: post
category: random
tags:
  - random
  - rng
  - algorithm
---

본 글은 [Lecture 3: Randomness in Computation](http://resources.mpi-inf.mpg.de/departments/d1/teaching/ss13/gitcs/lecture3.pdf) 을 번역한 것과 제 생각을 일부 덧붙여서 작성되었습니다.

참 어려운 문제이다. 랜덤이란 무엇인가? 앞선 [포스트]({% post_url 2021-04-27-rng-1-why-do-we-need-random-number-generator %})에서 프로그래밍에서 **랜덤**이라는 개념을 많이 사용한다고 말한 적이 있다. 그러나, "랜덤이란 무엇인가?"라는 랜덤의 정의를 정확히 내리지 못하는 문제가 존재한다. 많이들 예로 드는 동전을 던지는 것은 랜덤한가? 엄청난 감각의 소유자가 적당한 힘으로 동전을 항상 앞면만 나오도록 튕길 수 있지 않을까? 카드를 섞는 것은 어떤가? "손은 눈보다 빠르다." 라는 명대사도 있지 않는가?

어디까지나 본 글은 컴퓨터과학이라는 관점에서의 랜덤, Randomness에 대해서 말하고자 한다.

## 랜덤의 사전적 정의

> In common parlance, randomness is the apparent or actual lack of pattern or predictability in events.
> \- [Randomness](https://en.wikipedia.org/wiki/Randomness) From Wikipedia, the free encyclopedia

위키피디아에서는 어떠한 패턴이 없는 것을 랜덤이라고 (사전적으로) 정의한다고 한다. 그러나 뭔가, 이것으로는 너무 명확하지 않은, 추상적인 개념임을 알 수 있다. 단순히 패턴이 없는 것은 랜덤한가? 그렇다면, "패턴이 없다는 것은 어떻게 증명할 수 있는가?" 라는 어려운 반문이 생기기 때문이다.

이와 관련하여 잘 정리된 글[^1]이 있어서 가져와봤다(번역). Randomness에 대한 연구는 20세기부터 3가지의 이론 분야에 걸쳐서 연구되어 왔다. 3가지의 이론 분야를 가볍게 설명하고자 한다.

## Theory 1. Shannon's Entropy

첫 번째 이론 분야는 [Shannon](https://en.wikipedia.org/wiki/Claude_Shannon)에 의해서 창안된 이론인 정보이론(Information theory)이다. 이 정보 이론 분야는 완벽히 랜덤하지 않은 분포[^2]에 대해서 집중하였고 완벽한 랜덤성은 극단적인 경우로 간주했다. 여기서 말하는 극단적인 경우란 Entropy가 최대화된 분포[^3]를 의미한다.

### Definition 1 (Entropy)

\\(X\\)를 랜덤 변수라고 하자. 그 때, \\(X\\)의 엔트로피 \\(H(X)\\)는 다음과 같이 정의된다.

\\[
  \mathsf{H}(X) \  \triangleq \  \mathsf{E}_{x \sim X}[-\mathrm{log}(\mathsf{Pr}[X = x])]
\\]

<sub>단, \\(x \sim X\\) 는 \\(X\\)에 의해서 샘플링(추출)된 \\(x\\) 를 의미한다.</sub>

### Definition 2 (min-Entropy)

\\(X\\)를 랜덤 변수라고 하자. 그 때, \\(X\\)의 _min-Entropy_ \\(\mathsf{H}_{\infty}(X)\\) 는 다음과 같이 정의된다.

\\[
  \mathsf{H}_{\infty} (X) \  \triangleq \  \min\_{x \sim X} \\{ -\log{(\mathsf{Pr}[X = x])} \\}
\\]

<sub>여기서 만약, \\(\mathsf{H}\_{\infty} (X) > k\\) 일 때, \\(X\\)를 _k\-source_ 라고 부르도록 한다.</sub>

## Theory 2. Kolmogorov theory

두 번째 이론은 [Kolmogorov](https://en.wikipedia.org/wiki/Andrey_Kolmogorov) 라는 소련의 수학자에 의해서 탄생하였다. Kolmogorov 이론은 "객체를 생성하는 가장 짧은 프로그램"이라는 측면에서 어떤 객체의 복잡성[^4]을 측정한다. 이 관점에서 완벽한 무작위성(Randomness)이란 극단적인 경우로 간주될 수 있다. 이 극단적인 케이스란, 완벽한 랜덤 스트링(Random string)을 만들 수 있는 세상에서 가장 짧은 프로그램을 의미한다. 위에서 언급한 Shannon의 정보이론(Information Theory)은 분포에 대해서 Randomness를 측정하는 것과는 대조적으로 Kolmogorov Theroy에서의 Randomness는 하나의 string 에 대해서만 Randomness를 논할 수 있다.[^5]

## Theory 3. Blum and Yao

세 번째 이론은 1980년대에 [Blum](https://en.wikipedia.org/wiki/Manuel_Blum)[^6]과 [Yao](https://en.wikipedia.org/wiki/Andrew_Yao)에 의해서 탄생하였다. 이 연구팀은 Randomness를 관측자 (컴퓨터 모델) 와 관련하여 정의하였으며, 만약 효율적인 관측자들에 의해서 구별될 수 없으면 분포를 동일한 것으로 간주하였다. ~~말이 많이 어려운데 다음 문단에서 다시 설명하겠다.~~

------------

예를 들어서, Alice와 Bob이 동전던지기 게임을 한다고 치자. 이 동전던지기 게임을 하는데에는 4가지의 방법이 있는데 하나하나 뜯어서 보도록 하자. 모든 4가지 방법은 Alice가 동전을 던지고, Bob이 동전이 땅에 닿기전에 예측하는 식으로 진행된다고 치자.

### 1\. Alice가 동전을 던지기 전에 Bob이 미리 결과를 예측하는 방법

이 경우에는 명백하게 Bob이 \\(1/2\\)의 확률로 이길 것임을 예측할 수 있다.

### 2\. 동전이 공중에서 돌고 있을 때 결과를 예측하는 방법

이 경우에는 Bob이 공중에서 동전이 회전하고 있는 상황과 그 운동의 공식을 알고있다고 할지라도 정확한 정보를 얻을 수 없고, 그러므로 우리는 이 경우에도 Bob이 \\(1/2\\)의 확률로 이길 것이라고 믿어 의심치 않는다. ~~물론, 폰노이만 같은 사람이라면 예외겠지만 일반적으론..~~

### 3\. Bob이 좀 더 많은 정보를 제공받을 수 있는 기계 장치가 존재

2번 과정에서 추가하여 Bob이 동전의 **운동 방정식에 대한 정밀한 정보** 뿐만 아니라 결과에 영향을 미칠 수 있는 **환경적인 영향 데이터**(공기저항, 바닥의 곡면 등)까지도 얻을 수 있다고 치자. 그렇지만, 이 경우에도 Bob이라는 사람은 동전이 떨어지기 까지의 그 짧은 시간 동안 엄청난 연산을 처리할 능력이 없기 때문에 \\(1/2\\)의 확률보다 승률이 높아지진 않을 것이라 믿는다. ~~물론, 이 경우에도 폰노이만은..~~

### 4\. Bob이 이제 슈퍼 컴퓨터와 카메라가 있다면?

동전을 던지는 순간 카메라가 해당 동전의 날아가는 장면을 촬영하고 이를 분석할 수 있는 (세상에서 가장 빠른) 슈퍼컴퓨터, 그리고 컴퓨터가 이미 계산까지 전부 다 마쳐서 Bob에게 정답을 0.0001초만에 보낼 수 있다면? 이 경우에는 Bob이 정답을 맞출 승률을 훨씬 많이 올릴 수 있을 것임은 자명하다. ~~고로, 이 경우는 Random하지 않다고 할 수 있다.~~

------------

위의 예시가 시사하는 바는, (동일 사건임에도 불구하고) 관측자의 역량에 따라서 Randomness의 적절한 정의가 변동될 수 있다는 점이다. 한 관측자가 "이 string data는 random하다." 라고 생각해도 또 다른, 능력이 좋은 관측자는 아니라고 생각할 수 있다는 것이다. 컴퓨터과학에서는, 이러한 관측자라는 것이 다른 시간적/공간적(메모리적) 제약사항 (예를 들어, Polynomial-time) 에 기반하는 알고리즘과 연관되어 있다. 이러한 직관을 파악하기 위해서, 연구진(Blum and Yao)은 _Computational indistinguishable_ 이라는 단어를 효율적인 과정으로는 구별할 수 없는 쌍분포(Pairs of distributions) 정의한다. (예를 들면, Polynomial-time Algorithms)

### Definition 3 (Probability ensembles)

_Probability ensemble_ \\(\mathcal{X}\\) 은 \\(\mathcal{X} = \\{X_n\\}_{n \ge 1}\\) 의 집합족(family)[^7] 인데, 여기서 \\(X\_{n}\\) 이란, 어떤 유한한 영역의 확률 분포이다.

### Definition 4 (Computational Indistinguishability)

\\(\mathcal{D}\\)와 \\(\mathcal{E}\\)가 _Probability ensemble_ 이라고 하자. 이 때, \\(\mathcal{D}\\)와 \\(\mathcal{E}\\)를 구별하기 위한 확률적 알고리즘[^8] \\(A\\)의 성공확률(success probability)은 다음과 같다.

\\[
  sp_{n}(A) = |\mathsf{Pr}[A(X) = 1] - \mathsf{Pr}[A(Y) = 1]|
\\]

<sub>여기서 \\(X\\)는 분포 \\(\mathcal{D}\\) 를 갖고있고, \\(Y\\)는 분포 \\(\mathcal{E}\\)를 갖는다고 하자. 분포 \\(\mathcal{D}\\) 와 \\(\mathcal{E}\\)는 만약, 어떠한 확률적 Polynomial-time algorithm \\(A\\)에 대해서, 어떠한 양의 Polynomial \\(p(\cdot)\\), 어떠한 충분히 큰 \\(n\\)에 대해서 \\(sp_n(A) < 1/p(n)\\)을 충족한다면 _Computational indistinguishable_ 하다고 할 수 있다.</sub>

여기서 우리는 \\(\mathcal{D}\\) 와 \\(\mathcal{E}\\) 가 _Computational indistinguishable_ 하다고 할 때, \\(\mathcal{D} \sim^c \mathcal{E}\\) 로 표현하겠다.

## 정리

위에서 우리는 여러 개념에 대해서 배웠다. 단순히 "무작위"라고 생각했던 Randomness를 컴퓨터 과학적으로 어떻게 정의할 수 있는지에 대해서, Shannon의 Information theory, Kolmogorov theory 그리고 Blum and Yao's theory 등에 대해서 간략히 알아보았다. Random을 정의하는 것은 무척이나 어려운 일임을 알 수 있다. 

여기서 필자가 깨달은 바는, **동일한 사건이나 현상을 어떻게 정의하느냐에 따라서 문제 풀이의 방법이 달라진다**는 것이었다. Information theory와 Kolmogorov theory에서는 분석하는 대상에 하나인가? 집단인가의 차이가 될 수 있고, Blum and Yao's theory 에서는 분석하는 주체가 관찰자라는 관점에서 봤을 때 서로 다른 정의가 내려지고, 당연히 문제가 달라지기 때문에 풀이방법도 달라진다는 것이다.

결론적으로, 누군가가 "무작위란 무엇인가?" 라고 나에게 물어봤을 때, 어떻게 대답해야할지 더욱 몰라지고 있는 중이다. 지금 이 글을 쓰는 시점에서는 "무작위란, 어떻게 정의하느냐에 따라 달라질 수 있는데..." 라는 문장으로 답변을 시작하지 않을까 싶다.






<br><br><br>

----------------

[^1]: Great Ideas in Theoretical Computer Science - Lecture 3: Randomness in Computation, Kurt Mehlhorn & He Sun, Max Planck Institute for Informatics, Summer 2013, [LINK](http://resources.mpi-inf.mpg.de/departments/d1/teaching/ss13/gitcs/lecture3.pdf)

[^2]: 원문 -  Distributions that are not perfect random.

[^3]: 원문 - the Distribution with the maximum entropy.

[^4]: 원문 - Kolmogorov theory measures the complexity of objects in terms of the shortest program (for a fixed universal program)

[^5]: 필자 주 - Information Theory는 통계적인 분포를 기준으로 Randomness를 논한 것이고, Kolmogorov Theory는 하나의 (generated 된) 결과값을 기준으로 Randomness를 논하는 것이라 이해된다.

[^6]: Random 관련한 연구로 유명하신 분들이 공교롭게도 동명이인이다. 한 분은 [Lenore Blum](https://en.wikipedia.org/wiki/Lenore_Blum), 한 분은 [Manuel Blum](https://en.wikipedia.org/wiki/Manuel_Blum) 이다. 위에서 Manuel Blum 으로 링크한 이유는 참조한 글의 뒷 부분에 [Blum–Micali algorithm](https://en.wikipedia.org/wiki/Blum%E2%80%93Micali_algorithm) 에 대한 이야기가 나오는데 여기서의 Blum 이 Manuel Blum 을 지칭하기 때문에 여기서의 Blum도 Manuel Blum을 지칭한다고 생각한다.

[^7]: [집합족](https://ko.wikipedia.org/wiki/%EC%A7%91%ED%95%A9%EC%A1%B1)의 정의 - 집합 \\(X\\) 속의 집합족은 \\(X\\)의 (일부 또는 전체) 부분 집합들로 이루어진 집합을 뜻한다.

[^8]: [Randomized algorithm](https://en.wikipedia.org/wiki/Randomized_algorithm) - 알고리즘의 과정 중에 난수를 발생하여 결정하는 알고리즘.