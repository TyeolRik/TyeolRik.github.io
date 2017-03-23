---
layout: post
title: "PE 재배치 :: Base Relocation"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - relocation
  - pe
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## PE 재배치 :: Relocation

> PE File이 ImageBase에 로딩되지 못하고 다른 주소에 로딩될 때 수행되는 작업

PE File이 프로세스의 가상 메모리에 loading 될 때, NT header의 ImageBase에 loading 된다. 그런데 NT header에 있는 ImageBase 주소값에 다른 파일(DLL/SYS)이 loading 되어 있다면 다른 공간에 loading 된다. 이 과정을 PE File Relocation 이라고 한다.

### ASLR :: Address Space Layout Randomization

보안 강화를 위해서 Windows Vista 이후부터 생긴 기능. ~~사실 기능이라고는 하지만 이 기능을 Off하는 방법은 딱히 없는거같다. 말만 기능이지 강제~~ EXE File이나 DLL File 등의 PE File을 실행할 때, ImageBase를 랜덤한 주소에 Loading 하는 것이다.

### Relocation 동작 원리

1. 프로그램에서 하드코딩된 주소 위치를 찾는다.
2. 값을 읽은 후 ImageBase 만큼 뺀다. (VA → RVA)
3. 실제 로딩 주소를 더한다. (RVA → VA)

PE File 내부에는 Relocation Table 이라하는 하드코딩 주소들의 Offset을 모아놓은 목록이 있다. Relocation Table로 찾아가는 방법은 NT header(PE header)의 Base Relocation Table 항목을 따라가는 것이다.

#### Base Relocation Table

Base Relocation Table의 주소는 PE Header에서 DataDirectory 배열의 여섯 번째 항목에 있다. (index number = 5) (IMAGE_NT_HEADERS \\ IMAGE_OPTIONAL_HEADER \\ IMAGE_DATA_DIRECTORY\[5\])

다음은 PEView에서 notepad.exe (Win7 32bits) 의 Base Relocation Table의 주소를 보았다. RVA = 2F000 이라고 저장되어있다.

![Imgur](http://i.imgur.com/xKh4u4P.png)

RVA 2F000을 찾아가보았다. 실제주소는 Section 4 (.reloc)에 존재한다.

![Imgur](http://i.imgur.com/OCYduZL.png)

#### IMAGE_BASE_RELOCATION 구조체

위의 사진에서 볼 수 있듯이 Base Relocation Table 에는 하드코딩된 주소들의 Offset들이 나열되어 있다. 이걸 자세하게 파헤쳐보자. 어떻게 하드코딩 되어있는 것일까? 먼저 IMAGE_BASE_RELOCATION 구조체 배열을 살펴보자. Base Relocation Table은 이 구조체의 배열이다.

```c
/*
 * Based relocation format.
 */

typedef struct _IMAGE_BASE_RELOCATION {
    DWORD        VirtualAddress;
    DWORD        SizeOfBlock;
//  WORD        TypeOffset[1];
} IMAGE_BASE_RELOCATION;
typedef IMAGE_BASE_RELOCATION UNALIGNED * PIMAGE_BASE_RELOCATION;

/*
 * Based relocation types.
 */
#define IMAGE_REL_BASED_ABSOLUTE             0
#define IMAGE_REL_BASED_HIGH                 1
#define IMAGE_REL_BASED_LOW                  2
#define IMAGE_REL_BASED_HIGHLOW              3
#define IMAGE_REL_BASED_HIGHADJ              4
#define IMAGE_REL_BASED_MIPS_JMPADDR         5
#define IMAGE_REL_BASED_MIPS_JMPADDR16       9
#define IMAGE_REL_BASED_IA64_IMM64           9
#define IMAGE_REL_BASED_DIR64               10
```

구조체의 첫 번째 멤버는 DWORD(4bytes)의 VirtualAddress로 기준 주소(Base Address)이며, 실제로는 RVA 값이다. 두 번째 멤버는 SizeOfBlock으로 각 단위 블록의 크기를 의미한다. 주석으로 표시된 TypeOffset 배열의 의미는 이 구조체 밑으로 2bytes 짜리 배열이 따라온다는 의미가 된다. 위의 사진에 보이는 Type RVA라고 적힌 것들이 바로 하드코딩된 주소들의 Offset이다.

#### Base Relocation Table의 해석 방법

![Imgur](http://i.imgur.com/48vtngV.png)

IMAGE_BASE_RELOCATION 구조체의 정의에 따라 VirtualAddress 멤버의 값은 1000이고, SizeOfBlock 멤버의 값은 118이다. TypeOffset 배열의 기준 주소(시작 주소)는 RVA 1000이며 블록의 전체 크기는 118이라는 의미이다. Hex Code에서 Base Relocation Table을 보면 끝은 0으로 끝남을 알 수 있다. (2bytes 짜리 배열이므로 0x0000으로 끝난다.)

![Imgur](http://i.imgur.com/ylgPyz5.png)

TypeOffset 값은 2bytes 크기를 가지며, Type(4bits)와 Offset(12bits)가 합쳐진 형태이다. 예를들어 TypeOffset 값이 3424라면 Type는 3, Offset은 424가 된다. Type는 일반적으로 PE File에서 3(IMAGE_REL_BASED_HIGHLOW)이고 64bits용 PE+ File에는 A(IMAGE_REL_BASED_DIR64)를 갖는다.

TypeOffset에서 하위 12bits가 진짜 Offset을 의미하는데, 다음과 같이 계산된다.

VirtualAddress(1000) + Offset(424) = RVA(1424)

RVA = 1424 자리에 PE Relocation이 필요한 하드코딩된 주소가 있는지 실습해보자.

![Imgur](http://i.imgur.com/K8Da7jp.png)

이 notepad.exe는 00A10000가 ImageBase로 loading 되었고, RVA는 위에서 구한대로 1424이므로 VA = 00A11424가 된다. 그리고  그 자리에는 A110C8이라는 IAT 주소가 저장되어 있다. 즉, 제대로 위치를 찾은 것이다.
