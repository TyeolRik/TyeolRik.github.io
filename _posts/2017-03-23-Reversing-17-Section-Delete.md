---
layout: post
title: "실행 파일에서 .reloc Section 제거하기"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - pe
  - header
  - section
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## .reloc Section

EXE File에서 Base Relocation Table 항목은 실행에 영향을 크게 끼치지 않는다. 실제로 제거 후 실행을 해보면 정상적으로 실행이 된다. ~~그런데, DLL이나 SYS에서는 Base Relocation Table은 필수이다.~~ VC++에서 생성된 PE File의 Relocation Section의 이름은 .reloc이다. .reloc 부분을 제거하면 PE File의 크기가 줄어들게 되는데 ~~당연히 바이트 수가 줄어드는데 크기가 줄어드는건 당연한거 아니냐..~~ 이런 현상을 응용해서 PE File의 용량을 줄이는 유틸리티도 있다. **.reloc Section은 보통 마지막에 위치** 하기 때문에, 마지막에 위치하는 Section을 제거하는 것은 어렵지 않다.

## notepad.exe의 .reloc Section 제거

.reloc Section을 제거하기 위해서는 네 단계의 작업을 거쳐야한다.

1. .reloc Sectioin Header 정리
2. .reloc Section 제거
3. IMAGE_FILE_HEADER 수정
4. IMAGE_OPTIONAL_HEADER 수정

이제 실습을 시작해보도록 하자!

### 1\. Section Header 정리

![Imgur](http://i.imgur.com/gri1Wsr.png)

.reloc Section Header는 File Offset이 248부터 26F 까지이다. (섹션헤더크기는 0x27) 이 부분을 다음과 같이 Hex Editor를 이용해서 0으로 덮어쓰도록 한다. ~~PEView와 Hex Editor를 같이 켜서 보는 것이 좋지만, 한 파일을 동시에 사용하면 다른 프로세스에서 파일을 사용 중이므로 파일 수정이 불가능하다는 에러가 뜨니 파일을 복사해서 하길 바란다.~~

![Imgur](http://i.imgur.com/820WHXA.png)

### 2\. Section 제거

PEView에서 보면 파일에서 .reloc Section의 시작 Offset은 0x0002AE00(Pointer to Raw Data)이다. Hex Editor로 0002AE00 부분을 모두 삭제하자. (단축키: Del)

![Imgur](http://i.imgur.com/kXyG17p.png)

이렇게 해서 .reloc Section은 물리적으로 바이트코드 상에서 제거되었다.

### 3\. IMAGE_FILE_HEADER 수정

Section을 하나 제거했기 때문에 PE Header에서 Section Number를 수정해줘야 한다. 초기에는 4개였으나, 1개를 제거했으니 3으로 바꿔주도록 하자.

![Imgur](http://i.imgur.com/Zoh11lr.png)

### 4\. IMAGE_OPTIONAL_HEADER 수정

.reloc Section이 제거되면서 Section의 크기만큼 전체 이미지의 크기가 줄어들게 된다. 이미지 크기는 IMAGE_OPTIONAL_HEADER \\ Size of Image 값에 명시되어 있다.

![Imgur](http://i.imgur.com/STwkPRs.png)

PEView에서 알 수 있듯이 Size of Image 값은 0x00030000으로 저장되어 있다.

![Imgur](http://i.imgur.com/aXWGLnh.png)

.reloc Section Header에서 Size of Raw Data 값이 0x00001000이라고 했기 때문에 Size of Image - Size of Raw Data 해서 0x0002F000을 0x00030000에 대신해서 값을 수정하였다.

![Imgur](http://i.imgur.com/CpN1DU5.png)

![Imgur](http://i.imgur.com/WMogwVA.png)

정상적으로 실행이 된다.

Size of Image 값을 0x0002F000이 아닌 다른 값으로 설정하면 어떻게 될까? 아까 그대로 있던 0x00030000을 다시 넣어봤다.

![Imgur](http://i.imgur.com/DT39Reg.png)

문제가 있댄다. 즉, Size of Image 값이 정확해야 PE File이 실행되는 것 같다.
