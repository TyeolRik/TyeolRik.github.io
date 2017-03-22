---
layout: post
title: "IAT :: Import Address Table"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - theory
  - windows
  - iat
  - dll
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## IAT :: Import Address Table

IAT에는 Windows OS의 핵심 개념인 Process, Memory, DLL Structure 등에 대한 내용이 함축되어 있다. IAT란 쉽게 말해서 **프로그램이 어떤 라이브러리에서 어떤 함수를 사용하고 있는지**를 기술한 테이블이다.

-----------------------

### DLL :: Dynamic Linked Library

> Microsoft Windows OS 에서 구현된 '동적 연결 라이브러리'이다.

#### 생성배경

16bit DOS 시절에는 DLL 개념이 없는 대신에 그냥 'Library'만 존재하였다. 예를 들어 C언어의 printf() 함수를 사용할 때, 컴파일러에서 C 라이브러리에 있는 printf 함수의 Binary 코드를 프로그램에 복사/붙여넣기 했다. 즉, 실행 파일에는 해당 함수의 Binary 코드가 존재해야만 했다. Windows OS 에서 Multi-Tasking 기능이 지원됨에 따라 이러한 방식은 비효율적이 되었다. 왜냐하면, 32bit Windows 환경을 지원하기 위해서는 수많은 라이브러리 함수가 필요한데 여러 프로그램이 동시에 실행될 때, 동일한 라이브러리를 계속 포함하고 로드한다면 심각한 메모리 낭비를 초래한다. (물론, 프로그램의 용량 자체도 엄청 커져서 용량의 낭비 문제도 있을 것이다.) 그래서 Windows OS 설계자들이 다음의 DLL 개념을 고안해냈다.

- 프로그램에 라이브러리를 포함시키지 말고, 별도의 파일(DLL)로 구성하여 필요할 때마다 로드하자.
- 일단 한 번 로딩된 DLL의 코드와 리소스는 Memory Mapping 기술을 이용, 여러 Process에서 공유해서 쓰자.
- 라이브러리가 업데이트 되었을 때 해당 DLL 파일만 교체하면 되므로 쉽고 편하다.

#### DLL loading 방식

> Explicit Linking: 프로그램에서 사용되는 순간에 로딩하고 사용이 끝나면 메모리에서 해제되는 방법
> Implicit Linking: 프로그램 시작할 때 같이 로딩되고 프로그램이 종료하면 같이 메모리에서 해제되는 방법

-----------------------

IAT는 Implicit Linking에 대한 메커니즘을 제공하는 역할을 한다. IAT의 확인을 위해서 OllyDbg로 notepad.exe를 열어보자.

![Imgur](http://i.imgur.com/cZ8kJZT.png)

우리가 주목하는 것은 DLL 파일의 함수(API)를 어떻게 호출하는가? 이다. 위의 사진을 보면 알 수 있겠지만, 어떤 API를 호출하기 위해서는 어떤 메모리 주소(여기서는 005D1100)에 해당 함수의 주소값인 77BE1E10을 넣어두고, 메모리 주소를 불러옴으로서 간접적으로(?) CALL 하는 방식을 사용하고 있다. 컴파일러가 바로 CALL 77BE1E10 이라고 했으면 직관적이고 좋겠지만, 이 방법이 바로 DLL Relocation 이다. 메모리 주소를 직접 하드코딩 한다면, 다른 DLL 파일이 그 메모리를 사용하고 있을 때는 메모리를 덮어쓰게 되므로 정상적으로 load 되지 않을 수 있으며(안정성 차원) 프로그램이 어떤 환경에서 실행되는지, DLL 파일 (여기서는 kernel32.dll)이 어떤 버전인지 모르기 때문에 함부로 하드코딩할 수 없다. 그래서 PE loader를 이용, 파일이 실행될 때, 특정 메모리에 함수의 시작 주소값을 쓰도록 한 다음에 특정 메모리를 로드하는 방식을 이용하는 것이다.

위의 방법을 쉽게 이용하면 다음과 같다. 책장을 하나 만들어서 각 칸에 ㄱ, ㄴ, ㄷ 의 이름표를 붙여놓는다. 왜냐하면 어디에 어떤 책이 올지 모르기 때문이다. 그래서 일단은 책이 들어갈 공간과 이름표를 붙여놓고, 책이 오면 ㄱ, ㄴ, ㄷ 순으로 책을 꽂는 것이다. 이 예시에서 우리는 책장을 만드는 작업을 프로그램 코딩(이 예시에서 사진을 보면 005D1100 밑에도 수많은 API들이 줄지어 붙어있음을 알 수 있다.), 이름표를 붙이는 것을 특정 메모리를 할당(이 예시에서 005D1100)하는 것, 책을 넣는 것을 실제 함수의 시작 주소값(이 예시에서 77BE1E10)을 할당하는 것이라고 할 수 있다.

### IID :: IMAGE_IMPORT_DESCRIPTOR

PE File은 자신이 어떤 라이브러리를 Import 하고 있는지를 IMAGE_IMPORT_DESCRIPTOR 구조체에 명시하고 있다.

```c
typedef struct _IMAGE_IMPORT_DESCRIPTOR {
    union {
        DWORD   Characteristics;            // 0 for terminating null import descriptor
        DWORD   OriginalFirstThunk;         // RVA to original unbound IAT (PIMAGE_THUNK_DATA)
    };
    DWORD   TimeDateStamp;                  // 0 if not bound,
                                            // -1 if bound, and real date\time stamp
                                            //     in IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT (new BIND)
                                            // O.W. date/time stamp of DLL bound to (Old BIND)
    DWORD   ForwarderChain;                 // -1 if no forwarders
    DWORD   Name;
    DWORD   FirstThunk;                     // RVA to IAT (if bound this IAT has actual addresses)
} IMAGE_IMPORT_DESCRIPTOR;

typedef struct _IMAGE_IMPORT_BY_NAME {
    WORD Hint;                              // ordinal
    BYTE Name[1];                           // function name string
} IMAGE_IMPORT_BY_NAME, *PIMAGE_IMPORT_BY_NAME;
```

일반적으로 여러 개의 라이브러리를 Import 하기 때문에 라이브러리의 개수만큼 위의 구조체의 배열 형식으로 존재하며, 구조체 배열의 마지막은 NULL 구조체로 끝난다. 아래의 표는 위 구조체에서 중요한 것들만 모았다.

![Imgur](http://i.imgur.com/AptC3Pm.png)

INT와 IAT는 long type (4byte) 배열이고 NULL로 끝난다. INT와 IAT는 크기가 같아야하며 INT에서 각 원소의 값은 IMAGE_IMPORT_BY_NAME 구조체의 포인터이다.
