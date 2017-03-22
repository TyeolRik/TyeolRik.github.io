---
layout: post
title: "[암호학] 대칭 키 암호(Symmetric Key Algorithm)"
section-type: post
category: Cryptology
tags:
  - cryptology
  - intro
  - symmetric-key
---

## 대칭 키 암호 :: Symmetric Key Algorithm

> 암호화와 복호화에 동일한 키를 쓰는 알고리즘을 의미한다.

암호화하는 측(송신자)과 복호화하는 측(수신자)이 같은 암호 키를 공유해야 한다. 이와 반대되는 개념으로 공개 키 암호라는 것이 있다. 대칭 키 암호의 경우 공개 키 암호보다 계산 속도가 빠르다는 장점이 있어서 많은 암호화 통신에서 대칭 키 암호 방식을 사용한다. 대칭 키 암호 방식은 크게 블록 암호 방식과 스트림 암호 방식으로 나뉜다.

### 블록 암호 :: Block Cipher

> 정보를 정해진 블록 단위로 암호화 하는 대칭키 암호 시스템.

블록 암호는 고정 크기(64bits 또는 128bits)의 블록 단위로 작업을 수행한다. 동일한 키를 사용했을 경우 한 평문 블록이 항상 같은 암호 블록으로 암호화된다. 혼동(Confusion)과 확산(Diffusion)의 개념을 구현한 암호화 방식으로 평문과 암호문 만으로 키를 유추해내기가 쉽지않다. 유명한 블록 암호 방식 알고리즘으로는 DES, Blowfish, AES(Rijndael) 등이 있다.

블록암호를 예를 들어 64 Bits 블록으로 암호화를 한다고 하자. 그런데, 만약 평문의 길이가 60 Bits라면 나머지 4 Bits는 블록을 만들기 위해서 패딩(Padding) 기법을 사용해야한다. 블록 암호의 사용 방식에는 4가지가 있다. ECB, CBC, CFB, OFB. 각각 알아보도록 하자.

### ECB :: Electronic CodeBook

![Imgur](http://i.imgur.com/6WyrRI1.png)

<font align="center"> ▲ ECB 작동 원리[^1] </font>

긴 평문을 암호화하는 가장 간단한 방법이다. 암호화 키를 이용해서 한 블록씩 암호화한다. 블록간의 상관관계가 없기 때문에 블록(평문)이 같은 값을 가진다면 암호문도 같아서 반복공격에 취약한 특징을 갖는다.

### CBC :: Cipher-Block Chaining

![Imgur](http://i.imgur.com/y69V0Uz.png)

<font align="center"> ▲ CBC 작동 원리[^2] </font>

긴 평


[^1]: 사진 출처
        https://ko.wikipedia.org/wiki/%EB%B8%94%EB%A1%9D_%EC%95%94%ED%98%B8_%EC%9A%B4%EC%9A%A9_%EB%B0%A9%EC%8B%9D

[^2]: 사진 출처 Ibid
