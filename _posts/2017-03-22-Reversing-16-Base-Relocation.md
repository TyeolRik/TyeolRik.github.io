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

> 1. 프로그램에서 하드코딩된 주소 위치를 찾는다.
> 2. 값을 읽은 후 ImageBase 만큼 뺀다. (VA → RVA)
> 3. 실제 로딩 주소를 더한다. (RVA → VA)

PE File 내부에는 Relocation Table 이라하는 하드코딩 주소들의 Offset을 모아놓은 목록이 있다. Relocation Table로 찾아가는 방법은 NT header(PE header)의 Base Relocation Table 항목을 따라가는 것이다.
