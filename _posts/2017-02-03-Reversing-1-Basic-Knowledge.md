---
layout: post
title: "CPU의 기본 지식"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - cpu
  - x86
  - register
---

## 기초 지식 :: IA-32(x86-32)

IA-32는 Intel Architecture, 32bits의 준말이다.
CPU - 레지스터 - 주기억장치(RAM) - 보조기억장치(HDD, SSD) 순으로 정보를 사용.

### CPU (중앙연산처리장치)

CPU 내부에서 각종 정보를 저장하기 위해 임시 기억 장치인 레지스터를 사용한다. 레지스터는 사이즈가 작으니깐, 주기억 장치인 메모리(RAM)를 사용한다. RAM은 사이즈도 작고, 휘발성 메모리 ~~컴퓨터 끄면 다 날아감~~이라서, 비휘발성메모리인 하드디스크~~요즘은 SSD~~를 사용한다.

### 레지스터

IA-32에서는 다음과 같은 레지스터 구성을 갖는다.

1. **8개의 32bits 범용 레지스터(General Register)**
    EAX(Extended Accumulator Register): 함수의 리턴값을 저장 또는 산술 연산에 사용
    EBX(Extended Base Register): 특정 주소를 지정하기 위해 사용
    ECX(Extended Counter Register): 반복적인 명령어 수행 시 횟수 저장에 사용
    EDX(Extended Data Register): 큰 수의 곱셈, 나눗셈 등의 연산 시 EAX 레지스터와 함께 사용
    ESI(Extended Source Index): 문자열 복사, 비교 시 소스 문자열 주소 저장에 사용
    EDI(Extended Destination Index): 문자열 복사, 비교 시 목적지 문자열 주소 저장에 사용
    ESP(Extended Stack Pointer): 명령어 수행 시 스택의 위치 저장에 사용
    EBP(Extended Base Pointer): 함수 인자, 스택 변수에 접근하기 위해 사용

2. **6개의 16bits 세그먼트 레지스터(Segment Register)**
    CS(Code Segment): 컴퓨터가 수행할 수 있는 명령어들이 저장. 명령어의 위치 저장
    SS(Stack Segment): 지역 변수와 함수 호출 인자를 저장. 메모리 상 스택의 구현을 실현
    DS(Data Segment): 전역 변수와 힙(Heap)을 저장하는 메모리 영역. 시작 주소값이 저장.
    ES(Extra Segment): 추가로 사용된 DS의 주소를 저장. 딱히 저장되어있진 않고, 프로그래머에 의해 결정.
    FS: ES와 비슷한 용도. 여분의 세그먼트 레지스터.
    GS: ES와 비슷한 용도. 여분의 세그먼트 레지스터.

3. **32Bits EFLAGS 플래그 레지스터(Program status and control Register)**
    컴퓨터의 다양한 상태를 나타내는 비트 포함. 상태 플래그, 제어 플래그, 시스템 플래그로 구성

4. **32Bits EIP 명령포인터 레지스터**
    다음에 실행될 명령의 주소가 저장되어 있다.
