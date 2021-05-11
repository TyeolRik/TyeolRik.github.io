---
layout: post
title: "[Random] NIST SP800-22에서의 랜덤에 대한 고찰"
section-type: post
category: random
published: false
tags:
  - random
  - nist-sp800-22
---

본 글은 [NIST SP800-22 Revision 1a](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-22r1a.pdf) 를 번역한 것과 제 생각을 일부 덧붙여서 작성되었습니다.

## General Discussion

난수 배열을 만드는데에 Random Number Generators와 Pesudorandom Number Generators 이렇게 2가지 기본 타입의 생성기가 있다. 암호학적인 응용 프로그램에서 이 두 타입의 생성기는 0과 1의 연속된 수열(Stream)을 만드는데, 이 연속된 수열은 부분(Substream)이나 난수의 블록들로 나뉠 수 있다.

### Randomness

Random bit 배열은 각각의 면이 0과 1로 표시된 편파적이지 않은(Unbiased) "**공정한**", 각각의 면이 나올 확률이 정확히 0도 \\(1/2\\)이고 1도 \\(1/2\\)인, 동전의 던짐의 결과(result of the flips)로 해석될 수 있다. 그리고 이 동전 던지기는 서로 독립시행이어야 한다. 즉, 이전의 던졌던 것에 대한 결과는 다음이나 앞으로 던지는 동전의 결과에 영향을 줘서는 안된다. 그러므로 편파적이지 않은 공정한 동전은 완벽한 Random bit stream generator 라고 할 수 있다. 왜냐하면, 0과 1의 값은 무작위하게 분포될 것이기 때문이다. (그리고 \\([0,1]\\) [균등분포(Uniformly distributed)](https://en.wikipedia.org/wiki/Continuous_uniform_distribution)) 얼마나 많은 원소들이 생성되었는지에 관계없이, 배열에서의 모든 원소들은 서로 독립적으로 생성되며 배열의 다음번 원소의 값을 예측할 수 없다.[^1]

명백히, 동전을 암호학적인 용도로 사용하는 것은 효율적이지 못하다. 그렇지만, 이러한 이상적인 True random 배열 생성기의 가상의 결과는 random, pseudorandom number number generator의 평가를 위한 벤치마크로서의 역할을 한다.

### Unpredictability

암호학적 응용 프로그램를 위해 만들어진 Random, Pseudorandom number 는 예측불가능해야한다. PRNG[^2]의 경우, 만약 시드값(seed, 초기값)이 알려져있지 않다면, 수열의 이전 난수 값들을 알고 있다고 할지라도 다음에 나올 결과값을 예측할 수 없어야한다. 이 특성을 _Forward unpredictability_ 라고 한다. 이 특성은 또한 어떠한 생성된 난수를 알고 있다고 쳐도 그것으로부터 시드값을 알 수 없어야한다. (_Backward unpredictability_ 역시 충족해야한다.) 시드 값과 이 시드에서 발생한 어떠한 값도 서로 연관성이 없어야하며 그 사실이 명백해야한다. 즉, 각각의 수열의 원소들은 \\(1/2\\) 확률의 독립 시행 사건의 결과인 것 같아 보여야한다.[^3]

_Forward unpredictability_ 를 보장하기 위해서, seed 값을 얻는 과정에 주의가 필요하다. 만약 시드값과 생성 알고리즘이 알려져있다면, PRNG로 생성된 값은 완전히 예측가능하다. 생성 알고리즘이 공공연하게 알려져있기 때문에, 시드값은 반드시 비밀로 보장되어야하고, pseudorandom 수열로부터 추론가능하지 않아야한다. 게다가, 시드 그 스스로도 예측불가능 해야한다.

### Random Number Generators (RNGs)

수열 생성기의 첫번째 타입은 Random Number Generator (RNG)이다. RNG는 [비결정적(non-deterministic)]({%post_url 2021-04-27-rng-1-why-do-we-need-random-number-generator%}) 재료(Source)를 가지고 (즉, [entropy source](https://en.wikipedia.org/wiki/Entropy_(computing)))[^4] 적절한 가공함수를 거쳐 (즉, Entropy Distillation Process[^5]) 사용한다. 이 가공과정은 Entropy Source가 무작위하지 않은 숫자를 만들 수 있는 어떠한(미지의) 취약점을 극복하는데 필요하다. (에를 들어서, 우연하게 긴 0이나 1의 긴 배열을 만드는 것) 이 Entropy source는 대게, 전자회로의 노이즈, 유저의 처리타이밍(마우스 움직임이나 키보드 이용 등), 반도체에서의 양자 효과 등과 같은, 약간의 물리적인 값을 포함하고 있다. 이러한 입력값의 다양한 조합들이 사용될 수 있다.











<br><br><br>

--------

[^1]: 필자 주 - 요약하자면, 0과 1로 이루어진 bit stream에서 0과 1이 나올 확률은 균등하게 \\(1/2\\) 여야하며, 생성되는 경우는 서로 독립시행이어야 한다.

[^2]: Pseudo-Random Number Generator (가상 난수 발생기)

[^3]: 원문 - Each element of the sequence should appear to be the outcome of an independent random event whose probability is 1/2.

[^4]: 컴퓨터 과학에서 Entropy란 OS나 어떤 응용 프로그램에서 암호학적이나 난수 데이터가 필요한 어떤 용도를 위해서 수집되는 무작위성(Randomness)을 의미한다. 이 무작위성은 대게는 하드웨어에서 수집되는데, 마우스의 움직임과 같이 이미 존재하는 값이나 특별히 고안된 난수 발생기 등에서 수집된다. - [Entropy(Computing) - Wikipedia](https://en.wikipedia.org/wiki/Entropy_(computing))

[^5]: 필자 주 - 정확한 정의가 없다. [어느 논문](https://www.mdpi.com/1424-8220/19/9/2033/pdf)을 참조해보면, 하드웨어에서 얻어온 Raw data 그 자체를 바로 Seed나 난수로 사용하지 않고 어떤 전처리 과정을 거쳐서 RNG를 돌리는데, 이 전처리 과정을 Distillation 이라고 표현하는 듯하다. (참조 : Carmen Camara et al., Design and Analysis of a True Random Number Generator Based on GSR Signals for Body Sensor Networks, 2019)