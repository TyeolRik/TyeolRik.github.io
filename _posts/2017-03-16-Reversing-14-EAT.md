---
layout: post
title: "EAT :: Export Address Table"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - theory
  - windows
  - eat
  - dll
---

본 글은 이승원이 집필한 **「리버싱 핵심원리」** 를 읽고 공부(정리)한 내용을 바탕으로 쓰여졌습니다.

## EAT :: Export Address Table

> 라이브러리 자신이 가지고 있는 함수를 다른 PE File에 제공하는 것

Windows에서 라이브러리란 함수를 묶어놓은 파일(DLL/SYS)을 의미한다. 그 중에서도 kernel32.dll 파일이 가장 핵심적인 라이브러리 파일이라고 할 수 있다.

EAT는 라이브러리 파일에서 제공하는 함수를 다른 프로그램에서 가져다 사용할 수 있도록 해주는 핵심 메커니즘이다. EAT를 통해서만 **해당 라이브러리에서 Export 하는 함수의 시작 주소를 정확히 구할 수 있다.** IAT와 마찬가지로 PE File 내의 특정 구조체(IMAGE_EXPORT_DIRECTORY)에 Export 정보를 저장하고 있다. IAT는 IMAGE_IMPORT_DESCRIPTOR 구조체가 여러 개의 멤버를 가진 배열의 형태로 존재한다. 반면 EAT의 IMAGE_EXPORT_DIRECTORY 구조체는 PE File에 하나만 존재한다.

PE File에서 IMAGE_EXPORT_DIRECTORY 구조체는 PE header에 있다. IMAGE_OPTIONAL_HEADER32.DataDirectory[0].VirtualAddress 값이 실제 IMAGE_EXPORT_DIRECTORY 구조체 배열의 시작 주소이다.

![Imgur](http://i.imgur.com/CeWN3k1.png)

위의 사진은 kernel32.dll 파일의 IMAGE_OPTIONAL_HEADER32.DataDirectory[0] 부분을 블럭처리 하였다. (Little Endian에 의해서 값은 000B5924가 된다.)

RAW = RVA - VA + PointerToRawData

위의 공식에 의해서 RAW = 000B5924 - 00001000 + 00001000 = 000B5924 이다. 고로, RVA와 RAW(File Offset) 모두 B5924 이다.

### IMAGE_EXPORT_DIRECTORY

```c
typedef struct _IMAGE_EXPORT_DIRECTORY {
    DWORD Characteristics;
    DWORD TimeDateStamp;                // creation time date stamp
    WORD MajorVersion;
    WORD MinorVersion;
    DWORD Name;                         // address of library file name
    DWORD Base;                         // ordinal base
    DWORD NumberOfFunctions;            // number of functions
    DWORD NumberOfNames;                // number of names
    DWORD AddressOfFunctions;           // address of function start address array
    DWORD AddressOfNames;               // address of function name string array
    DWORD AddressOfNameOrdinals;        // address of ordinal array
} IMAGE_EXPORT_DIRECTORY, *PIMAGE_EXPORT_DIRECTORY;
```

위의 코드는 IMAGE_EXPORT_DIRECTORY 구조체이다. 아래의 표에서 이 구조체의 중요한 멤버들을 알아보자. (모든 주소는 RVA 이다.)

![Imgur](http://i.imgur.com/00j2u3d.png)

라이브러리에서 함수 주소를 얻는 API는 GetProcAddress() 이다. 이 API가 EAT를 참조해서 원하는 API의 주소를 구한다.

**GetProcAddress() 동작원리**<br />
1\. AddressOfNames 멤버를 이용해 '함수 이름 배열'로 간다.
2\. '함수 이름 배열'은 문자열 주소가 저장되어 있다. 문자열 비교(strcmp)를 이용해 원하는 함수 이름을 찾는다. (이 배열의 인덱스를 name_index라고 하겠다.)
3\. AddressOfNameOrdinals 멤버를 이용해 'ordinal 배열'로 간다.
4\. 'ordinal 배열'에서 name_index로 해당 ordinal 값을 찾는다.
5\. AddressOfFunctions 멤버를 이용해 '함수 주소 배열(EAT)'로 간다.
6\. '함수 주소 배열(EAT)'에서 아까 구한 ordinal을 배열 인덱스로 하여 원하는 함수의 시작 주소를 얻는다.

### kernel32.dll 을 이용한 실습

kernel32.dll은 Export 하는 모든 함수에 이름이 존재하며, AddressOfNameOrdinals 배열의 값이 index = ordinal 형태로 되어 있다. 그러나, 모든 DLL 파일이 이와 같지는 않다. Export 하는 함수 중에 이름이 존재하지 않을 수도 있고 ~~Ordinal로만 Export 한다.~~, AddressOfNameOrdinals 배열의 값이 index != ordinal인 경우도 있다. 고로, 위 순서를 지켜야만 정확한 함수 주소를 얻을 수 있다.

kernel32.dll 파일의 EAT에서 AddAtomW 함수 주소를 찾아보자.

![Imgur](http://i.imgur.com/CeWN3k1.png)

블럭된 부분이 DataDirectory\[0\]이고 고로 IMAGE_EXPORT_DIRECTORY의 RVA는 000B5924 이다. 공식에 의해서 RAW = B5924 - 1000 + 1000 = B5924 이다.

![Imgur](http://i.imgur.com/w8AfEF4.png)

B5924를 따라가보면 위의 값들이 나온다. IMAGE_EXPORT_DIRECTORY는 40bytes 이므로 저만큼을 블럭할 수 있다. 값들을 분석하면 아래의 표가 된다.

![Imgur](http://i.imgur.com/qLB6BpG.png)

이제 준비는 완료 되었으니, GetProcAddress() 동작 원리 순으로 진행해보자.

#### 1\. 함수 이름 배열

AddressOfNames 멤버의 값은 RVA = B6EA0이고, 이는 RAW = B6EA0이다. (VA = PointerToRawData = 1000 이므로 상쇄됨) 이 주소를 Hew Editor에서 보면 아래와 같다.

![Imgur](http://i.imgur.com/uxu8QDE.png)

B6EA0부터 4bytes의 RVA 배열이 쭈욱 이어져있다. 배열 원소의 개수는 555h개 (10진수로 ) 1365개인데, 실제로 PEView로 보면 1363개이다. ~~왜 2개가 없는지는 모르겠다.~~ 각각의 RVA 값을 RAW로 변환한 다음에 따라가보면 함수 이름 문자열이 나타난다.

예를들어서 제일 처음에 있는 000B8EAB를 RAW로 변환하면 그대로 000B8EAB이다. (VA = PointerToRawData = 1000) 고로, 000B8EAB를 열어보면 아래와 같다.

![Imgur](http://i.imgur.com/xmTIb5K.png)

이렇게 000B8EAB가 함수 이름 문자열 시작 주소값이다. 즉, B6EA0에 있는 함수의 이름은 AcquireSRWLockExclusive가 된다.

#### 2\. 원하는 함수의 이름을 찾자.

우리는 'CreateFileW'라는 이름의 함수를 찾을 것이다. 무식하게 하나하나 RVA 배열을 따라가면 언젠가는 CreateFileW가 나올 것이다. 일단, 'CreateFileW'는 B70E0를 따라가면 있다. B70E0 자리에는 000B9A74 라는 값이 적혀있다. 즉, RVA = B9A74이다. RAW = B9A74이므로 따라가면 아래와 같이 'CreateFileW'라는 함수 이름 문자열을 만날 수 있다.

![Imgur](http://i.imgur.com/2O4g6uq.png)

이 때 'CreateFileW'는 배열의 145(0x91)번째 원소이다. Index 값은 0x90 이다. 배열의 Index 값은 다음과 같이"도" 구할 수 있다. (B70E0 - B6EA0) / 4 = 0x90 왜냐하면, B6EA0은 AddressOfNames 배열의 첫 위치이고, B70E0는 'CreateFileW'이기 때문이다.

#### 3\. Ordinal 배열

이제 'CreateFileW' 함수의 Ordinal 값을 알아내보자. AddressOfNameOrdinals 멤버의 값인 RVA는 B83F4이므로 RAW = B83F4 이다. Ordinal 배열은 2bytes로 이루어진 배열이다.

#### 4\. Ordinal

![Imgur](http://i.imgur.com/gxaEj0t.png)

'CreateFileW'는 AddressOfNames에서 145번째 원소라는 사실을 알게되었다. 고로, 여기 Ordinal배열에서 145번째 값을 찾아보자. 찾아보니 값이 0x0091이다.

#### 5\. 함수 주소 배열 :: EAT

이제 'CreateFileW'의 실제 함수 주소를 찾을 수 있다. AddressOfFunctions 멤버의 값은 RVA = B594C 이므로 RAW = B594C이다. B594C의 주소로 찾아가면, 4bytes의 RVA 배열이 나타난다. 이것들이 바로 Export 함수 주소들이다.

#### 6\. 'CreateFileW' 함수의 주소

![Imgur](http://i.imgur.com/fNEFGzF.png)

위의 배열들에서 Ordinal 값이 0x0091이다. Ordinal 값을 또 한번 배열로 생각하면 index = 0x0091 즉, 146번째 배열의 원소가 우리가 찾는 'CreateFileW'이다. 146번째 배열의 값을 찾아보면 RVA = 0004EA55이 나온다.

kernel32.dll의 ImageBase는 0x77DE0000이다. 왜냐하면, IMAGE_OPTIONAL_HEADER 부분에서 Image Base 라는 멤버가 있는데 이 멤버의 값이 77DE0000 이기 때문이다.

그러므로 'CreateFileW'의 실제주소(VA) = ImageBase + RVA = 77DE0000 + 4EA55 = 77E2EA55이다. 이제 이 사실을 OllyDbg에서 확인해보자.

#### OllyDbg로 해당 주소로 이동해보자! (Ctrl + G)

![Imgur](http://i.imgur.com/egf9Fcf.png)

그런 주소가 없다고 한다. 왜 그럴까? 바로 ASLR기법으로 인해서 ImageBase가 NT Header에 적힌 0x77DE0000이 아닌 다른 곳으로 정해졌기 때문이다. ASLR이란 PE 파일이 loading 될 때 시작 주소 값을 랜덤하기 바꾸는 것이다. 보안 강화를 위해서 Vista 부터 적용했으며, 필자의 컴퓨터가 Windows 7이니 때문에 ASLR 기능이 적용되어 ImageBase 값이 달라졌다.

그래서 OllyDbg에서 kernel32.dll을 열고 현재의 ImageBase 값을 검색해보았다. Memory Map(Alt + M)을 열고 Owner가 kernel32.dll 인 것을 찾아 PE Header 부분을 더블클릭 하였다.

![Imgur](http://i.imgur.com/VzCIfK7.png)

![Imgur](http://i.imgur.com/3vQIyOP.png)

우리가 익히 본 DOS Signature 값인 MZ (4D 5A)가 75FB0000에 로드 되었다. 즉, 75FB0000이 kernel32.dll의 시작 주소 값(ImageBase)라는 의미이다.

그래서 우리는 위의 실제 주소를 다시 계산해보면 VA = ImageBase + RVA = 75FB0000 + 4EA55 = 75FFEA55 이다. 이제 이 주소를 OllyDbg에서 따라가보자. (Code Window에서 Ctrl + G)

![Imgur](http://i.imgur.com/TTG1Y7K.png)

원하는 CreateFileW 함수의 시작 주소값이 나왔다.
