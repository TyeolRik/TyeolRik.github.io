---
layout: post
title: "[논문리뷰] The First collision for full SHA-1"
section-type: post
category: Journal
tags:
  - sha-1
  - hash
  - collision
  - cryptoanalysis
---

## Author

<p style="text-align: center;">Marc Stevens, Elie Bursztein, Pierre Karpman, Ange Albertini, Yarik Markov</p>

<p style="text-align: center;">in <i>CWI Amsterdam and Google Research</i></p>
<br><br>
Original Link: [Where did I find](https://shattered.io/static/shattered.pdf)<br>
Archived Link: [Download in Google Drive](https://drive.google.com/file/d/1WCMZa4-euSdefw2b86ATLaibTKz-ERur/view?usp=sharing)

## Abstract
1995년 NIST의 해시함수 기준으로 널리 사용된 SHA-1은 다양한 분석이나 이론적인 공격법에 대해서 구조적인 보안 취약점이 밝혀짐에 따라 2011년에 NIST에 의해 Deprecate 되었다.
Deprecate에도 불구하고, SHA-1은 2017년까지 문서나 TLS 인증서 등에 널리 사용되었을 뿐만 아니라 GIT 버전 컨트롤과 같은 많은 소프트웨어에서 무결성 검사나 백업의 목적으로 많이들 사용되었다.
많은 산업의 실 사용자들이 SHA-1보다 더 안전한 대안책(해시함수)으로 넘어가지 않는 핵심적인 이유는 지난 11년간 공격에 대한 높은 복잡도(Complexity)와 계산비용(Computational Cost)이 비현실적으로 보였기 때문이다. (엄청 어려운 연산이므로 현실적으로 공격이 불가능할 것으로 알려져있기 때문이다.) 이 논문에서 우리는 SHA-1 공격이 이제는 충돌 사례를 제공함으로써 현실이 되었음을 보일 것이다. 더군다나, 충돌하는 메세지의 앞부분은 매우 주의깊게 선택되어야하는데 왜냐하면, 그 앞부분이 공격자로 하여금 두개의 PDF 문서들을 같은 SHA-1 해시값으로 위조하도록 하기 때문이다.
우리는 많은 특별한 암호학적인 기술들을 복잡한 방법으로, 지난 연구성과를 발전시키는 방향에서 조합함으로써 충돌을 찾을 수 있었다. 결국 계산 비용(Computational Cost)은 $2^{63.1}$ 정도가 되고, 이것은 CPU로 6500년, GPU로는 100년 정도의 시간이 걸릴 것으로 보입니다. 그 결과, 다른 알려진 암호 해독과 관련한 계산보다 더 많은 시간이 걸리지만, 여전히 브루트포스보다는 100000배 더 빠릅니다.

## 1. Introduction
암호학적 해시함수는 임의의 길이를 가진 메세지 $M$을 $n$ bits의 고정된 길이의 해시값으로 계산되는 함수이다. 이것은 전자 서명 제도나 메세지 인증 코드, 비밀번호 해싱, 내용 어드레스 기억 장치(CAS, Content-Addressable Storage.)[^1]등의 많은 응용분야에서 사용되는 다목적의 암호학적 **근본**이다. 많은 이 응용분야들의 적절한 작동이나 보안과 관련해서는 해시 함수라는 것이 현실적으로 충돌값을 찾기가 불가능하다는 것에 근거한다. 두개의 구분되는 메세지 $x$, $y$ 의 해시값이 같은 값 $H(x) = H(y)$ 이 될 때 충돌이라고 한다. Birthday Paradox(Birthday 역설)에 근거하여 충돌을 찾는 브루트포스(Brute-Force) 탐색은 ${\sqrt{\pi/2} \cdot 2^{n/2}}$ 회의 해시 함수 호출이 필요하다는 것으로 잘 알려져 있다.

해시 함수의 MD-SHA 계열은 가장 잘 알려진 해시 함수 계열로 지금 널리 사용되고 있는 MD5, SHA-1, SHA-2를 포함한다. 이 계열은 원래 1990년 MD4로 시작하였는데, 1992년 빠르게 심각한 보안 결함의 이유로 MD5로 대체되었다. Compression Function에 내재된 초기에 알려진 약점에도 불구하고 MD5는 거의 10년 동안 소프트웨어 업계 전반에서 널리 사용되었다. 브루트포스로 Collision을 찾겠다는 시도를 한 '프로젝트 MD5CRK'는 2004년 초, Xiaoyun Wang 이 지휘하는 연구팀이 새로이 개척한 획기적인 암호학적 공격 기술을 이용하여 MD5 Collision을 선보임으로써 중단되었다. 주요 개발로는 Chosen-prefix collision attack이라고 알려진 더욱 효과적인 공격법이 MD5에 사용될 수 있다고 Stevens 의 논문에 알려져있다. 이것은 결국 2008년에 이론적으로 완전히 HTTPS 보안이 뚫린 Rogue Certification Authority[^2]의 위조를 일으켰다. 그럼에도 불구하고 2017년에도 여전히 서명과 관련하여 MD5 지원종료에 대한 논쟁이 있다. ~~사람들이 사용하고 있다.~~

지금 업계는 1995년 NIST 표준인 SHA-1의 지원종료와 관련하여 비슷한 상황에 놓여있다. SHA-1은 오늘날의 주요한 해시 함수 중의 하나인데, 2005년부터 의미있는 공격을 받아왔었다. 이전의 SHA-0에 대한 성공적인 암호 해독 작업에 기반하여 MD5를 뚫은 Wang이 이끄는 팀이 또다시 2005년 SHA-1에 대한 이론적인 Collision 공격을 선보인 바 있는데 이것은 브루트포스보다 빨랐다. 이 공격은 획기적이었음에도 불구하고 순전히 이론적인 공격이었는데, SHA-1을 $2^{69}$ 회나 연산해야했고 이는 현실에는 불가능한 수준이었다.

그러므로, 개념증명(Proof of concept) 차원에서, 많은 팀들은 SHA-1의 축소판에 대한 충돌을 찾는 것에 대한 연구를 해왔다. (대규모 GPU 사용)

- 64 step : $2^{35}$
- 70 step : $2^{44}$
- 73 step : $2^{50.7}$
- 75 step : $2^{57.7}$

2013년 SHA-1을 분석한 것에 대한 이러한 성과들이나 새로운 철저한 프레임워크들에 기반하여 현존하는 최고의 Collision Attack은 Stevens의 $2^{61}$ 회 연산으로 SHA-1 Compression Function을 호출한 것이다. 그럼에도 불구하고, 대중적으로 알려진 Collision은 미지의 영역에 있었다. 이 사실은 Schneier가 강조해었는데 2015년에는 SHA-1 Collision attack의 비용이 미국달러로 700,000 달러 정도가 될 것이라고 했는데 Walker의 $2^{61}$ 공격과 Amazon EC2 가격, 무어의 법칙을 고려하여 2018년에는 173,000 달러로 예측했는데 이 비용 정도면 범죄 수익 내라고 간주되었다.[^3]

더욱 최근에는 매우 최적화된 GPU 프레임워크와 Start-from-the-middle 접근법을 이용하여 Stevens가 SHA-1 기반의 Full Compression Function의 Collision을 얻어냈다. 이것은 약 64개의 GPU를 10일정도 사용해야하는 정도의 연산량으로 GPU로 SHA-1을 $2^{57.5}$ 회 정도 호출한 것과 비슷한 수준으로 합리적인 수준의 GPU 연산량이다. 이 공격법에 의하여, Stevens 팀은 Schneier가 2012년에 예측한 비용보다 훨씬 낮은, EC2의 spot-instances를 이용하여 GPU를 대여하면 75,000 ~ 120,000 달러 사이 정도의 비용으로 SHA-1 Collision Attack이 가능하게 계획하였다. 이 새로운 예측은 거의 즉각적으로 영향을 끼쳤는데 'CABForum Ballot 152'에서 HTTPS 인증서에 기반을 둔 SHA-1의 가용기간 연장을 폐기하고 IETF의 TLS 프로토콜에서 1.3 버전부터 전자 서명 부분에서 사용만료되게 하였다.

이러한 가치있는 주목은 해시함수를 뚫는다는 학술적인 노력만 한 것이 아니다. 단일민족국가에서 고도로 발전된 스파이 멀웨어 Flame과 연결시켰는데, 2012년 5월에 중동을 목표로한 것으로 발견됐다. Flame 멀웨어가 발견됨에 따라 이것은 Windows 업데이트의 중간자 공격(Man in the middle Attack)을 통한 위조 서명에 사용되었다. 충돌된 메세지 쌍으로부터 주어진 하나의 메세지로 암호분석적 측면에서의 Collision 공격을 드러낸다는 반-암호해독적인 신기술을 사용함으로써, MD5에 대한 선정 접두어 충돌 공격(Secret Chosen-Prefix Attack)으로 위조 서명이 만들어지는 것이 가능하다는 것이 증명되었다.[^4]

## 2. Our contributions

![Imgur](https://i.imgur.com/ckU9bdV.png)

우리는 먼저 위의 표에 나와있는 첫 번째 예시 Collision을 선보임으로써 SHA-1에 대한 이론적이기만 했던 공격이 현실이 되었다는 사실을 증명하고자 한다. 우리의 연구성과는 가장 잘 알려진, SHA-1을 $2^{61}$ 정도 호출하는 이론적 Collision attack을 기반으로 하였다. 이것은 Identical-prefix collision Attack 이라고 하는데, 주어진 접두어 P가 두개의 다른 Near-collision block 쌍으로 확장되면서 다른 접미어 S와 충돌할 때, 다음과 같은 수식으로 표현할 수 있다.

$$
\mathrm{SHA-1}(P||M_1^{(1)}||M_2^{(1)}||S) = \mathrm{SHA-1}(P||M_1^{(2)}||M_2^{(2)}||S)
$$

이 공격에 사용되는 계산적인 비용은 $2^{63.1}$ 정도의 SHA-1 호출과 비슷하다고 알려져있다. 앞서 우리가 기반했다고 하는 현실적인 공격과 이론적 공격에는 분명한 차이가 있다.[^5] 확실히 이론적 공격의 예상복잡도는 GPU들을 사용할 때 효율성에서 비롯된 상대적인 손실과 여러개의 데이터 센터들에서 대규모 분산 컴퓨팅을 하면서 직면하는 비효율 모두 포함되지 않았다. 더군다나, 두번째 Near-collision attack[^6]의 구성은 문헌에서 기대하는 것보다 훨씬 더 복잡했다.

![Imgur](https://i.imgur.com/wHNbecC.png)

첫번째 Near-collision block 쌍 $M_1^{(1)}, M_1^{(2)}$ 을 찾기 위해서 우리는 오픈소스 코드를 사용하였는데 이 코드는 Table 2에서 주어진 Prefix $P$ 와 잘 작동하게 하고, 여러 데이터센터에서 대규모 분산 컴퓨팅이 가능할 수 있게 수정한 것이다. Collision을 끝내는 두번째 Near-collision block 쌍 $M_2^{(1)}, M_2^{(2)}$ 을 찾는 것은 분명히 어려웠는데, 공격 비용이 더욱 훨씬 높은 것으로 알려져있을 뿐만 아니라 추가적인 장애물들이 있었기 때문이다.

Section 5에서 우리는 두번째 Near-collision attack을 만드는 특별한 과정에 대해서 논할 것이다. 기본적으로 우리는 첫번째 Near-coolision attack을 수행했던 것과 같은 과정을 따를 것인데, 많은 현존하는 암호해독적 기술들을 섞었다. 그러나 우리는 더욱 비용적으로 효율을 얻기 위해서 과거 Karpman 연구에서의 SHA-1 Collision search를 하는 GPU 프레임워크를 도입했다.

우리는 또한, 두번째 Near-collision attack을 구성하는 2가지의 새로운 부수적 테크닉을 표현하였다. 첫번째 테크닉은 우리가 약 23회 언저리로 Differential path 들을 사용할 수 있게 하여 성공확률을 높이고, Early-stop 테크닉의 사용을 하지 않음으로써 자유도를 높였다. 두번째 테크닉은 이 프로젝트를 끝낼 가능성을 위험하는 SHA-1의 Compression function의 초기 몇 스텝에 대한 풀 수 없는 시스템의 심각한 문제들을 극복하는데 필수적이다.[^7]

우리의 예시 충돌파일은 우리의 공격으로 만들어진 두 개의 연속적인, 난수처럼 보이는 메세지 블록에 대해서만 다르다. 우리는 이 제한된 차이점을 임의의 구별되는 이미지를 포함하는 2개의 충돌 PDF 파일을 만들어서 공격하였다. 예시파일은 [https://shattered.io](https://shattered.io) 에서 다운 받아볼 수 있다. 다른 작은 예시는 본 논문 Section B.1 에 기재하였다. 같은 MD5 해시값을 갖는 PDF들은 Gebhardt 연구팀에 의해, Indexed Color Tables, Color Trasformation Functions 등으로 알려진 공격법에 의해서 만들어졌었다. 그러나 이 방법은 대부분의 PDF 뷰어에서 효과적이지 못했는데 그 이유는 그러한 기능들을 지원하지 않기 때문이다. 우리의 PDF파일들은 Gebhardt의 TIFF 기술, Albertini의 JPEG 기술들과 유사한 JPEG 이미지들의 구별된 분석에 의거한다. 그러나, 우리는 이 기본적인 기술들을 로우-레벨의 "wizard" JPEG 기능들을 이용하여 발전시켰는데, 그렇게 함으로써 이 이미지들은 대부분의 상용 PDF 뷰어에서 사용가능해지고, 심지어는 매우 큰 사이즈의 JPEG 파일들도 여러 페이지의 PDF 파일로 만들어짐으로써 사용할 수 있게 된다.

우리 작업의 몇몇 디테일들은 추가적인 보안조치들이 수행된 이후에 대중에 공개될 것이다. 이 디테일에는 우리의 향상된 JPEG 기술을 포함하고 공격법과 암호해독 도구들에 대한 소스코드를 포함할 것이다.

본고의 나머지는 다음과 같이 구성되어있다. Section 3에서 SHA-1에 대한 간략한 설명을 드리고 Section 4에서 우리 공격법의 하이-레벨에서의 간략한 설명을, 이후의 Section 5에서 전체 과정의 디테일과 우리가 발전시켰다고 강조한 과거에 발표된 암호해독 테크닉이 설명될 것이다. 마지막으로 우리는 Section 6에서 2개의 Near-collision block pair를 찾기 위해서 요구되는 대규모 분산 컴퓨팅에 대해서 논할 것이다. Section A에 우리가 두번째 충돌블록을 찾는 파라미터(변수)가 제공될 것이다.

## 3. The SHA-1 Hash Function

NIST가 정의한 SHA-1의 간략한 설명은 다음과 같다. SHA-1은 임의 길이를 갖는 메세지를 160bits의 해시값으로 연산한다. 이것은 Padding 된 평문을 $k$ 길이의 512bits Block $M_{1}, \cdots , M_{k}$ 로 나눈다. Chaining value 라고 불리는 SHA-1의 160bits의 내부 상태 $CV_j$ 는 미리 정의된 초기값으로 초기화된다. $CV_0 = IV$ 각각의 블록 $M_j$ 은 Compression function $h$에 들어가고 이 function은 chaining value를 업데이트한다. 예를 들어 $CV_{j+1} = h(CV_j, M_{j+1})$, 단 마지막 $CV_k$는 해시값(Output)이다.

160bits의 Chaining value $CV_j$ 와 512bits 메세지 블록을 인풋으로 갖는 Compression function $h$ 는 새로운 160bits Chaining value $CV_{j+1}$을 출력할 것이다. 이 Compression function은 메세지 블록을 Chaining value에 다음과 같이 섞는데, 워드 단위로 연산되며, 동시에 32bits의 String 값들과 $\mathbb{Z} / 2^{32} \mathbb{Z}$로 보일 것이다. Input chaining value는 5개의 워드 $a, b, c, d, e$로 나뉘며, 메세지 블록은 16 워드 $m_0, \cdots , m_{15}$로 나뉜다. 후자(메세지 블록)는 다음의 재귀 선형 방정식에 의하여 80 워드로 확장된다.

$$
m_i = (m_{i-3} \oplus m_{i-8} \oplus m_{i-14} \oplus m_{i-16})^{\circlearrowleft 1},\quad \mathrm{for} \: 16 \leq i < 80.
$$

$(A_{-4}, A_{-3}, A_{-2}, A_{-1}, A_{0}) := (e^{\circlearrowleft 2}, d^{\circlearrowleft 2}, c^{\circlearrowleft 2}, b, a)$ 에서 시작해서 각각의 $m_i$는 $i = 0, \cdots , 79$ 의 80회 연산에 의해 섞인다.

$$
A_{i+1} = A_{i}^{\circlearrowleft 5} + \varphi_{i} (A_{i-1}, A_{i-2}^{\circlearrowleft 2}, A_{i-3}^{\circlearrowleft 2}) + A_{i-4}^{\circlearrowleft 2} + K_i + m_i,
$$

단, $\varphi_{i}$ 와 $K_{i}$는 다음의 미리 정의된 부울대수 함수와 상수이다.

![Imgur](https://i.imgur.com/Pjvd1vD.png)

80회 연산이 끝나면, 새로운 Chaining value는 입력 chaining value의 합으로 계산되며, 최종 중간식은 다음과 같다.

$$
 CV_{j+1} = (a + A_{80}, b + A_{79}, c + A_{78}^{\circlearrowleft 2}, d + A_{77}^{\circlearrowleft 2}, e + A_{76}^{\circlearrowleft 2}). 
$$












<br>
<br>
<br>
<hr/>

[^1]: 아마 해시테이블을 의미하는 듯 하다.
[^2]: HTTPS 인증서를 의미하는 듯 하다.
[^3]: 한글로 쓰기가 참 어려운데, 범죄수익이 SHA-1 Collision에 사용되는 비용보다 높기 때문에 범죄할만하다는 의미이다.
[^4]: 요약) 충돌 공격으로 위조 서명을 만들 수 있다.
[^5]: 이론적 공격: $2^{61}$ / 현실: $2^{63.1}$
[^6]: [What is a pseudo-collision attack?](https://crypto.stackexchange.com/questions/42680/what-is-a-pseudo-collision-attack)
[^7]: 다시 말해서, SHA-1의 Compression function 때문에 SHA-1 Collision 찾는 것 자체가 불가능할 수 있는데, 불가능한 문제를 해결하려면 이 두번째 테크닉이 반드시 필요하다.