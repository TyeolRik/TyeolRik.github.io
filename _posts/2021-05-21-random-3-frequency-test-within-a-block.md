---
layout: post
title: "[Random] Frequency Test within a Block"
section-type: post
category: Random
published: false
tags:
  - random
  - nist_sp800-22
  - test
---

본 글은 [NIST SP800-22 Revision 1a](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-22r1a.pdf) 를 번역한 것과 제 생각을 일부 덧붙여서 작성되었습니다.

## 테스트의 목적

> 길이 \\(\mathrm{M}\\)인 특정 블록에서 1의 비율은 \\(\mathrm{M}/2\\)인가?

이 테스트에서 주목해야할 점은 M bits 개의 블록에서 1의 비율이 얼마냐 되느냐이다. 이 테스트의 목적은 난수성의 가정에서 기대되는 대로, M bits 블록에서의 1의 비율이 거의 \\(\mathrm{M}/2\\) 인지를 판단하는 것이다. 블록의 크기 \\(M=1\\)에서, 이 테스트는 첫번째 테스트인, [the Frequency (Monobit) test]({% post_url 2021-05-17-random-2-frequency-test %}) 로 격하된다.