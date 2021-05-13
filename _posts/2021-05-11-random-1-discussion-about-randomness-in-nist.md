---
layout: post
title: "[Random] NIST SP800-22에서의 랜덤에 대한 고찰"
section-type: post
category: random
published: true
tags:
  - random
  - nist_sp800-22
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

RNG의 출력값들은 그 자체로 랜덤값으로 사용되거나, PRNG(Pseudorandom Number Generator)에 반영될 수도 있다. 바로 랜덤값으로 사용되기 위해서, 출력값은 철저한 Randomness 표준을 만족해야하는데 이 표준은 RNG 인풋값의 물리적인 인풋들이 랜덤하게 보이는지를 결정하는 통계학적인 테스트와 유사하다. 예를 들어, 전기적인 노이즈와 같은 물리적인 출처(Physical source)가 어떤 파장이나 주기적인 현상과 같은 규칙적인 구조의 중첩[^6]을 포함할 수 있지만, 통계적인 테스트를 통해서 랜덤하지 않다고 판단될 때도 있다.

암호학적인 목적으로, RNG의 출력은 예측불가능해야한다. 하지만, 몇몇 물리적인 출처(예를 들면, 날짜/시간 벡터)는 꽤 예측가능하다. RNG의 입력값을 다양한 타입의 출처로부터 출력을 조합한 것으로 이용함으로써 이러한 위험성은 완화될 수 있다.[^7] 하지만, RNG의 출력값은 통계학적 테스트로 평가할 때 부족할 수 있다. 게다가, 높은 품질의 난수를 만드는 것은 시간이 너무 많이 걸릴 수 있고, 많은 난수가 필요로 하는 상황에서 그러한 생성과정은 별로(undesirable)일 수 있다. 많은 양의 난수를 만들기 위해서 Pseudorandom Number Generator가 더 나을 수 있다.

### Pseudorandom Number Generators (PRNGs)

두 번째 타입의 생성기는 Pseudorandom Number Generators (PRNG)이다. 한 개 또는 그 이상의 입력값을 사용하고 여러 개의 의사난수(Pseudorandom number)를 만들다. 이러한 입력값을 _**Seeds**_ 라고 부른다. 예측불가능(Unpredictability)이 필요한 상황에서 시드값 그 자체로서 랜덤하고 예측불가능 해야한다. 그런 이유로, 자연스럽게, PRNG는 RNG의 출력값으로부터 시드를 얻을 수 있다. (즉, PRNG는 RNG가 필요하다.)

PRNG의 출력값은 전형적으로 시드값의 결정론적 함수(Deterministic functions)이다. 즉, 모든 진짜 랜덤함은 시드 생성에 달려있다.[^8] 처리과정의 결정론적인 성질[^9]은 "의사난수(Pseudorandom)" 이라는 용어로 귀결된다. 의사난수 배열의 각각의 원소는 시드로부터 다시 만들어낼 수 있기 때문에, 만약 의사난수배열의 재생성이나, 검증과정이 필요하다면 시드값만 저장해놓으면 된다.

재밌게도, 의사난수가 종종 물리현상에서 추출된 진짜 난수보다 훨씬 랜덤하게 보이는 경우도 있다. 만약 의사난수배열이 잘 구성되었다면, 배열 속의 각각의 값들은 변형을 통한 이전값들로부터 생성되어 추가적인 난수성을 내놓게 된다.[^10] 그러한 변형의 연속은 입출력 사이의 통계학적 자기 상관(Statistical auto-correlations)을 없애준다. 그러므로, PRNGs의 출력갑승ㄴ 더 나은 통계학적 특성을 가지고 있고, RNG보다 더 빨리 만들어질 수 있다.

###  Testing

다양한 통계학적 테스트들이 진짜 난수 배열과의 비교와 평가를 함으로써 적용될 수 있다. **난수성(Randomness)이란 확률적 특성이다.** 즉, 난수배열의 특성은 확률이라는 면에서 특징지어지고, 설명될 수 있다. 진짜 난수 배열에 적용한 그럴듯한 통계학적 테스트의 결과도 선험적으로 인식될 수 있고[^11], 확률적인 표현으로 설명될 수 있다. 통계학적 테스트라는 것은 어떤 \"**패턴**\"이 존재하는지, 또는 없는지, 만약 패턴이 있다면 그 배열 자체는 랜덤하지 않다고 접근하는 것인데 이러한 류의 가능한 테스트들은 무한히 많다. 왜냐하면 어느 배열이 랜덤한지 아닌지를 평가하는 테스트는 너무나도 많고, \"**완벽하다**\"라고 보이는 테스트의 유한한 집합도 없기 때문이다. 게다가 통계학적 테스트의 결과는 일정 수준의 주의를 가지고 해석되어야하며, 특정한 Generator에 대한 틀린 결론을 회피하는 것에 대해서 조심해야한다.[^12]

통게학적인 테스트는 특정한 귀무가설(_**null hypothesis**_) \\((\mathrm{H}\_0)\\)[^13] 을 테스트하기 위해서 만들어진 것이다. 이 문서의 목적을 위해서 테스트에 대한 귀무가설은 "_**지금 테스트되고 있는 수열이 랜덤이다.**_"라는 것이다. 이 귀무가설과 연관된 것이 바로 대립가설(_**Alternative hypothesis**_) \\((\mathrm{H}\_a)\\) 인데, 본 문서에서는 "_**지금 테스트되고 있는 수열이 랜덤이 아니다.**_"가 된다. 즉, 생성된 수열에 근거하여 Generator가 난수를 생성하는가 아닌가에 따라서 귀무가설을 받아들이는지 아닌지가 결정되고 각각의 테스트에 대한 결과는 이러한 결과를 따른다.[^14]

각각의 테스트에 대해서 적절한 난수성 통계(a Relevant randomness statistic)는 귀무가설의 기각여부를 결정짓기 위해서 반드시 선택되어 사용되어야한다. 통계학과 같은, 난수성에 대한 추정에 따라 가능한 값들의 분포를 따를 것이다. 이 귀무가설에 대한 통계학적 이론적인 기준이 되는 분포(A theoretical reference distribution)은 수학적인 방법으로 결정된다.[^15] [^16] 이 기준이 되는 분포로부터 _**임계치 (Critical value)**_ 가 결정된다. (통상적으로 분포곡선의 꼬리부분에서 _**far out**_ 됐다고 표현하는데, 99% 지점에서 벗어났다는 말이다.) 테스트 동안, 검정통계량(Test statistic value)[^17]이 데이터에 의해서 산출된다. (테스트되는 수열에 대해서) 이 검정통계량은 임계치와 비교된다. 만약 검정통계량이 임계치를 넘었다면, 난수성에 대한 귀무가설은 기각된다. 그렇지 않으면, 귀무가설(난수성 가설)은 받아들여진다.

실제로, 가설검정(Statistical hypothesis testing)이 제 역할을 하는 이유는 기준이 되는 분포와 임계치가 난수성의 잠정적 추정에 의존하고 생성되기 때문이다.[^18] 만약 난수성 추정이 지금 가지고 있는 데이터에 대해서 참이라면, 그 데이터에 대한 검정통계량의 "임계치를 넘을 확률"이 0.1% 와 같은 수준으로 매우 낮을 것이다. 반면에, 검정통계량이 임계치를 넘는다면 (정말 낮은 확률로 그런 사건이 발생한다고 한다면), 가설검정의 관점으로 봤을 때, 자연적으로 그런 낮은 확률의 사건은 발생하지 말았어야한다. 그러므로, 검정통계량이 임계치를 넘을 때, 처음에 했던 난수성에 대한 추정(귀무가설, "이 수열은 랜덤이다.")이 의심스럽거나 문제가 있다고 결론지어질 수 있다. 이런 경우에, 가설검증은 다음과 같은 결론을 산출한다. \\((\mathrm{H}\_0)\\) (난수이다)를 기각하고 \\((\mathrm{H}\_a)\\) (난수가 아니다)를 채택한다.

가설검증은 \\((\mathrm{H}\_0)\\) 를 채택할 것이냐, \\((\mathrm{H}\_a)\\) 를 채택할 것이냐의 두 가지의 가능한 결과를 가진 결론 생성 과정이다. 다음의 2x2 표는 지금 가지고 있는 데이터의 진짜 (미지의) 난수인지의 여부와 테스트 과정으로 도출한 결론에 대한 표이다.

![NIST SP800-22 page 15/131](https://i.imgur.com/GhA2uTi.png)

만약, 데이터가 진짜로 랜덤하다면, 귀무가설을 기각하는 결정은 적게 일어날 것이다. 이러한 결정을 _**1종 오류 (Type 1 error)**_ 라고 한다. 만약, 데이터가 진짜로 랜덤하지 않다면, 귀무가설을 채택하는 결정을 _**2종 오류 (Type 2 error)**_ 라고 한다. 만약 데이터가 진짜로 랜덤할 때 \\((\mathrm{H}\_0)\\) 를 채택하는 결정과 데이터가 랜덤하지 않을 때 \\((\mathrm{H}\_0)\\) 를 기각하는 결정은 옳다(correct, no error).

1종 오류의 확률을 대게 테스트의 _**유의수준 (level of significance)**_ 이라고 한다. 이 확률은 테스트하기 이전에 설정될 수 있고 \\(\alpha\\) 로 표현된다. 테스트에서 \\(\alpha\\) 는 어떤 수열이 진짜 랜덤일 때 그 수열은 랜덤하지 않다고 알려준다. 즉, 좋은 Generator가 수열을 생성했다고 할지라도 난수가 아닌 것 같아 보인다는 의미이다. 암호학에서의 \\(\alpha\\) 는 약 0.01이다.[^19]

2종 오류의 확률을 \\(\beta\\) 로 표현한다. 테스트에서 \\(\beta\\) 는 어떤 수열이 랜덤이 아닌데도 랜덤이라고 알려주는 장치이다. 즉, "나쁜" Generator가 랜덤한 특성을 갖는 것처럼 보이는 수열을 만들었을 때를 의미한다. \\(\alpha\\) 은 다르게, \\(\beta\\) 는 고정된 값이 아니다. \\(\beta\\) 는 많은 서로 다른 값을 가질 수 있는데, 왜냐하면 데이터들이 랜덤이 아니라 할 수 있는 무한한 방법들이 존재하고, 그 무한한 서로 다른 방법들이 서로 다른 \\(\beta\\) 값을 산출하기 때문이다. 2종 오류 \\(\beta\\) 를 계산하는 것은 \\(\alpha\\) 를 계산하는 것보다 훨씬 어려운데, 왜냐하면 엄청나게 많은 종류의 랜덤이 아닌 경우가 있기 때문이다.

다음의 테스트들의 주 목적 중의 하나는 2종 오류의 확률을 줄이는 것이다. 즉, 실제로 어떤 Generator가 나쁘더라도 '좋은 Generator에 의해서 어떤 수열이 만들어졌다.'라고 판단할 확률을 최소화한다는 의미이다. 확률 \\(\alpha\\)와 \\(\beta\\), \\(n\\) 개의 테스트 수열은 서로 관련이 있는데, 두 개의 값은 이미 정해져있고 세 번째 값은 자동적으로 결정되는 그런 식으로 관련이 있다. 현역들은 일반적으로 샘플의 사이즈 \\(n\\) 과 \\(\alpha\\) 값을 선택한다. 그때 주어진 임계치(Critical point)가 선택되고, 이 임계치는 최소의 \\(\beta\\)를 도출한다. 즉, 적절한 샘플 사이즈는 "진짜 랜덤인데, 나쁜 Generator로 이 수열을 만들었다."라고 결정하는 것의 허용가능한 확률(임계치)[^20]에 따라 선택된다. 그때, 용인 가능한 수준에 대한 한계치(Cutoff point)는 \["어떤 수열이 랜덤이다."라는 사실이 거짓일 확률\]이 낮은 공역을 가질 때에 결정된다.[^21]





















<br><br><br>

--------

[^1]: 필자 주 - 요약하자면, 0과 1로 이루어진 bit stream에서 0과 1이 나올 확률은 균등하게 \\(1/2\\) 여야하며, 생성되는 경우는 서로 독립시행이어야 한다.

[^2]: Pseudo-Random Number Generator (가상 난수 발생기)

[^3]: 원문 - Each element of the sequence should appear to be the outcome of an independent random event whose probability is 1/2.

[^4]: 컴퓨터 과학에서 Entropy란 OS나 어떤 응용 프로그램에서 암호학적이나 난수 데이터가 필요한 어떤 용도를 위해서 수집되는 무작위성(Randomness)을 의미한다. 이 무작위성은 대게는 하드웨어에서 수집되는데, 마우스의 움직임과 같이 이미 존재하는 값이나 특별히 고안된 난수 발생기 등에서 수집된다. - [Entropy(Computing) - Wikipedia](https://en.wikipedia.org/wiki/Entropy_(computing))

[^5]: 필자 주 - 정확한 정의가 없다. [어느 논문](https://www.mdpi.com/1424-8220/19/9/2033/pdf)을 참조해보면, 하드웨어에서 얻어온 Raw data 그 자체를 바로 Seed나 난수로 사용하지 않고 어떤 전처리 과정을 거쳐서 RNG를 돌리는데, 이 전처리 과정을 Distillation 이라고 표현하는 듯하다. (참조 : Carmen Camara et al., Design and Analysis of a True Random Number Generator Based on GSR Signals for Body Sensor Networks, 2019)

[^6]: 원문 - a physical source such as electronic noise may contain a superposition of regular structures, such as waves or other periodic phenomena, which may appear to be random.

[^7]: 필자 주 - 번역이 매끄럽지 못하다. 좀더 쉽게 설명하자면, \\(\mathrm{Crpyto}(input_1)\\) 보다 \\(\mathrm{Crypto}(input_1+input_2+input_3+...+input_x)\\) 가 더 안전하다는 의미다.

[^8]: 원문 - All true randomness is confined to seed generation.

[^9]: 필자 주 - 앞서 컴퓨터는 결정론적 구조를 띄고 있기 때문에 모든 Function \\(f(x)\\) 는 일대일 함수라는 이 사실 자체가 결정론적이라는 의미이다. 자세한 것은 [이전 포스트]({% post_url 2021-04-27-rng-1-why-do-we-need-random-number-generator %}) 참조.

[^10]: 원문 - If a pseudorandom sequence is properly constructed, each value in the sequence is produced from the previous value via transformations that appear to introduce additional randomness.

[^11]: 원문 - The likely outcome of statistical tests, when applied to a truly random sequence, is **known a priori** and can be described in probabilistic terms.

[^12]: 필자 주 - 번역이 모호한데, 테스트 결과에 대해서 넓은 범위에 대해서 해석해야하고, 특이한 케이스에 대해서 집착하거나 오역하지 말라는 뜻이다.

[^13]: [귀무 가설 또는 영 가설](https://ko.wikipedia.org/wiki/%EA%B7%80%EB%AC%B4_%EA%B0%80%EC%84%A4)은 통계학에서 처음부터 버릴 것을 예상하는 가설이다. 차이가 없거나 의미있는 차이가 없는 경우의 가설이며, 이것이 맞거나 맞지 않다는 통계학적 증거를 통해 증명하려는 가설이다. 예를 들어, 범죄 사건에서 용의자가 있을 때 형사는 이 용의자가 범죄를 저질렀다는 추정인 대립가설을 세우게 된다. 이때 귀무가설은 용의자는 무죄라는 가설이다.

[^14]: 필자 주 - 깔끔하게 문장을 정리하지 못했지만, 귀무가설/대립가설의 논리로 테스트의 결과를 낸다는 의미이다.

[^15]: Reference distribution 이라는 말이 생소한데, Reference는 문맥에 따라 "Example"의 의미로도 쓰일 수 있다고 한다.<br>원글: The word "reference" is used to mean "example" in this context. - [stackoverflow/@David](https://stackoverflow.com/q/47838085/7105963)

[^16]: A theoretical reference distribution 은 또 다른 의미를 가지고 있는 것 같은데, Uniform distribution, Binomial distribution, Poisson distribution, Normal distribution 중의 하나인, "대표적으로 잘 알려진 기본 분포?" 정도로 해석되면 될 듯하다. [Lecture: Geographic Data Analysis, Spring 2020, Nominal Class, Online Document - “Theoretical” Reference Distributions - Patrick J. Bartlein (Univ. of Oregon)](https://pjbartlein.github.io/GeogDataAnalysis/topics/theoretical.pdf)

[^17]: [검정 통계량 (Test Statistic)](http://www.ktword.co.kr/abbr_view.php?m_temp1=2424) 이란 통계적 가설을 검정할 목적으로 사용되는 표본 통계량 (통계의 결론을 내릴 때 근거가 되는 통계량) 이다. ([통계량](http://www.ktword.co.kr/abbr_view.php?nav=&m_temp1=1639&id=591)이란 어떤 확률 모델을 잘 설명할 수 있는 값이나 변수, 특성량을 의미한다.)

[^18]: 필자 주 - 명확한 해석이 아니다. 좀더 직관적으로 말하자면, "가설검증 과정은 \[분포곡선과 임계치가 서로 상관있어서\] 잘 작동한다." 로 이해하면 되는 것같다.

[^19]: Common value 의 정의가 없어서 "같은 값" 정도로 해석되었다. [math.stackexchange](https://math.stackexchange.com/a/2140130/677413)에 따르면 수학에서 사용하는 용어는 아니고 영어적인 표현이라고 한다.

[^20]: 원문 - Acceptable probability.

[^21]: 필자 주 - Possible values 를 공역이라고 해석하였다. 추가로, 공역을 Allowable values 라고 하기도 하며, 반면 치역은 Actual values 라고 한다. [어느 블로그](https://blog.naver.com/ldj1725/220223787428)