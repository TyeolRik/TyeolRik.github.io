---
layout: post
title: "RVA to RAW"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - theory
  - windows
  - pe
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## RVA to RAW

> RVA to RAW란 PE File이 메모리에 로딩되었을 때,
> 각 Section에서 Memory의 주소(RVA)와 File Offset을 매핑(Mapping)하는 것.

여기서 RAW는 File Offset을 의미한다.

방법은 매우 간단하다.

1\. RVA가 속해 있는 섹션을 찾는다.<br />
2\. 다음의 비례식을 이용해서 RAW(File Offset)을 계산한다. <br />

\\[
\large \mathrm R \mathrm A \mathrm W = \mathrm R \mathrm V \mathrm A -  \mathrm V \mathrm i \mathrm r \mathrm t \mathrm u \mathrm a \mathrm l \mathrm A \mathrm d \mathrm d \mathrm r \mathrm e \mathrm s \mathrm s + \mathrm P \mathrm o \mathrm i \mathrm n \mathrm t \mathrm e \mathrm r \mathrm T \mathrm o \mathrm R \mathrm a \mathrm w \mathrm D \mathrm a \mathrm t \mathrm a
\\]

<br /><br />

![Imgur](http://i.imgur.com/JSRBVVg.png)

위의 그림과 ~~책에서 제시한~~ 다음의 문제 3개를 보고 계산법을 이해해보자. 참고로 RVA는 16진수의 메모리 주소이다.

### **Q1. RVA = 5000일 때 File Offset = ?**

RVA = 5000 이므로 ImageBase(01000000)을 고려해보면 첫 번째 Section (.text)에 존재함을 알 수 있다. 왜냐하면, RVA가 5000이고 ImageBase가 01000000이므로 VA = RVA + ImageBase = 01005000이 되기 때문에 그 address는 첫 번째 Section에 있음을 알 수 있다.

고로, 위의 식을 사용하면 **RAW = 5000(RVA) - 1000(VirtualAddress) + 400(PointerToRawData) = 4400** 이다. VirtualAddress가 1000인 이유는 Memory에서 첫 번째 Section이 01001000에서 시작하므로 1000이다. (ImageBase 값을 빼면) PointerToRawData 값이 400인 이유는 File에서 첫 번째 Section이 00000400에서 시작하기 때문이다.

### **Q2. RVA = 13314일 때 File Offset = ?**

RVA = 13314 이므로 Q1에서처럼 계산해보면 해당 Address는 세 번째 Section (.rsrc)에 존재함을 알 수 있다. 고로 위의 식에 값들을 대입해보면 다음과 같다. **RAW = 13314(RVA) - B000(VirtualAddress) + 8400(PointerToRawData) = 10174** 이다.

### **Q3. RVA = ABA8일 때 File Offset = ?**

RVA = ABA8 이므로 해당 Address는 두 번째 Section (.data)에 존재함을 알 수 있다. 위의 식에 값을 대입해보면 **RAW = ABA8(RVA) - 9000(VirtualAddress) + 7C00(PointerToRawData) = 97A8** 이다. RAW의 결과는 97A8인데 이는 File Offset에서 볼 때 세 번째 Section에 속해있다. RVA는 두 번째 Section 인데 RAW는 세 번째 Section 이라는 것은 말이 안되므로 **\"해당 RVA(ABA8)에 대한 RAW 값은 정의할 수 없다.\"** 라고 해야한다. 이런 결과가 나온 이유는 두 번째 Section의 VirtualSize의 값이 SizeOfRawData 값보다 크기 때문이다.
