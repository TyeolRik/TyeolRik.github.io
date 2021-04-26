---
layout: post
title: "[암호학] 계산적으로 안전한 암호 시스템 (Computationally Secure)"
section-type: post
category: Cryptology
tags:
  - cryptology
  - intro
  - computation
  - secure
---

## 계산 불능 보안 :: Computationally Secure

절대적 보안 암호 시스템의 반대되는 개념으로 어떤 암호 시스템을 깨뜨리는 알고리즘을 실행하는데 수많은 자원과 시간이 필요한 암호 시스템을 의미한다. 즉, 이론적으로 수많-은 시간과 자원을 투자하면 암호를 깰 수는 있다. 그러나, 암호화한 정보의 가치가 수많-은 시간과 자원보다 작기 때문에 현실적으로 안전한 암호이다. 일반적으로 많이 사용되는 암호 알고리즘 중에 하나인 RSA-1024의 경우, 무차별 대입공격(Brute force) ~~노가다~~ \\(5.95 \times 10^{211} \\)년이 걸린다고 한다.[^1] 암호화 알고리즘이 진화하는 만큼, 암호 해독 알고리즘 또한 발전하고 있기 때문에 위의 결과가 항상 옳다고는 말할 수 없지만, 우리가 살아있는 동안은 못 해결한다는 것은 사실이다. (몇 년만 지나도 그 정보가 무의미해질텐데, 현실적으로 수많은 시간을 들여서 암호를 해독하는 것이 의미가 없다는 의미가 된다.)

<br /><br /><br />
[^1]: http://crypto.stackexchange.com/questions/3043/how-much-computing-resource-is-required-to-brute-force-rsa
