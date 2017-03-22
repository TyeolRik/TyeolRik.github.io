---
layout: post
title: "PE Header :: PE 헤더"
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

## PE header

PE header는 많은 구조체로 이루어져있다. 실행 파일을 실행하기 위한 여러가지 정보가 기록이 되어 있으며, PE의 내용을 가지고 DLL를 로드하거나 여러가지 리소스를 할당하는 등 상당히 많은 정보가 PE 헤더에 저장되어 있습니다.

### DOS header

Microsoft는 처음 PE File Format을 만들 때, DOS 파일에 대한 하위 호환성을 고려해서 만들었다. 고로, PE header의 제일 앞부분에는 기존 DOS EXE Header를 확장시킨 **IMAGE_DOS_HEADER** 구조체가 존재한다.

```c
typedef struct _IMAGE_DOS_HEADER { // DOS .EXE header
    WORD e_magic;   // Magic number 일반적인 Signature : 4D5A (ASCII -> "MZ")
    WORD e_cblp;    // Bytes on last page of file
    WORD e_cp;  // Pages in file
    WORD e_crlc;    // Relocations
    WORD e_cparhdr; // Size of header in paragraphs
    WORD e_minalloc;// Minimum extra paragraphs needed
    WORD e_maxalloc;// Maximum extra paragraphs needed
    WORD e_ss;  // Initial (relative) SS value
    WORD e_sp;  // Initial SP value
    WORD e_csum;    // Checksum
    WORD e_ip;  // Initial IP value
    WORD e_cs;  // Initial (relative) CS value
    WORD e_lfarlc;  // File address of relocation table
    WORD e_ovno;    // Overlay number
    WORD e_res[4];  // Reserved words
    WORD e_oemid;   // OEM identifier (for e_oeminfo)
    WORD e_oeminfo; // OEM information; e_oemid specific
    WORD e_res2[10];// Reserved words
    LONG e_lfanew;  // File address of new exe header (NT헤더의 시작 위치)
} IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
```

IMAGE_DOS_HEADER 구조체의 크기는 40H ~~10진수로 64bytes~~ 이다. 이 구조체에서 꼭 알아두어야할 멤버는 **e_magic**과 **e_lfanew**이다.

> e_magic : DOS signature (4D5A => ASCII code "MZ")
> e_lfanew : NT header의 offset을 표시 (파일에 따라 가변적인 값을 가짐)

모든 PE 파일은 시작부분에(e_magic) DOS signature ("MZ")가 존재하고 e_lfanew 값이 가리키는 위치에 NT Header 구조체가 존재해야 한다. 만약 이 PE header 값이 변형된다면 더 이상 PE format이 아니게 되므로 정상적으로 실행되지 않는다.

**참고** e_magic이라는 멤버는 [Magic Number][fc414a11]를 위해서 만들어졌다. 하필 MZ인 이유는 DOS executable file format을 설계한 사람이름이 Mark Zbikowski라서라고 한다. ~~모든 파일에 자신의 이름이 들어간다니.. 이동식 씨보다 더 뛰어난 해커임이 틀림없다.~~

notepad.exe를 Hex Editor로 열어서 IMAGE_DOS_HEADER를 확인해 보았다.

![Imgur](http://i.imgur.com/jLUiqk4.png)

파일 시작은 PE 스펙에 맞게 2바이트(4D 5A :: "MZ")이고 e_lfanew 값은 000000D8이다. ~~리틀 엔디언에 의해서 D8000000이 아니라 000000D8이다.~~

### DOS Stub

DOS Header 밑에는 DOS Stub이 존재한다. DOS Stub은 있어도 되고 없어도 실행하는데 문제가 없다. 또한 그 크기도 일정하지 않다. DOS Stub은 코드와 데이터의 혼합으로 이루어져있다.

DOS 환경은 16bit인데, DOS Stub은 16bit의 코드로 이루어져있다. 고로 Windows는 32bit 이므로 실행이 되지 않는다. 그러므로 DOS의 16bit 코드와 Windows 32bit를 모두 같이 넣어주면 16bit 환경에서는 16bit 코드만 실행되고, 32bit 환경에서는 32bit 코드만 실행되므로 DOS와 Windows 모두에서 실행가능한 파일을 만들 수도 있다.

DOS Stub은 옵션이므로 개발 도구에서 지원해줘야하는데 대부분 기본 지원한다. (VB나 VC++...)

### NT Header

```c
typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;                  // PE Signature : 50450000 ("PE"00)
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```

위에서 보다시피, IMAGE_NT_HEADERS 구조체는 3개의 멤버로 되어있다. 첫 멤버는 Signature로 ASCII값 "PE"를 가지고 있다. IMAGE_NT_HEADERS는 크기가 F8(248bytes)로 상당히 큰 구조체이다.

notepad.exe를 Hex Editor로 열어보았다.

![Imgur](http://i.imgur.com/Sdbhry9.png)

음영처리 된 부분이 IMAGE_NT_HEADERS 부분이다. 역시 첫 시작은 50 45 00 00 (ASCII "PE"00)로 시작한다.

#### NT Header - File Header

구조가 IMAGE_FILE_HEADER 이므로 해당하는 구조체를 살펴보자.

```c
typedef struct _IMAGE_FILE_HEADER {
    WORD    Machine;
    WORD    NumberOfSections;
    DWORD   TimeDateStamp;
    DWORD   PointerToSymbolTable;
    DWORD   NumberOfSymbols;
    WORD    SizeOfOptionalHeader;
    WORD    Characteristics;
} IMAGE_FILE_HEADER, *PIMAGE_FILE_HEADER;
```

중요한 멤버 4가지만 알아보도록 하겠다.

**1\. Machine**<br />
Machine 넘버는 CPU 별로 고유한 값이다. 대표적으로 IA-32는 0x014C 값을 갖는다.

```c
#define IMAGE_FILE_MACHINE_UNKNOWN           0
#define IMAGE_FILE_MACHINE_I386              0x014c  // Intel 386.
#define IMAGE_FILE_MACHINE_R3000             0x0162  // MIPS little-endian, 0x160 big-endian
#define IMAGE_FILE_MACHINE_R4000             0x0166  // MIPS little-endian
#define IMAGE_FILE_MACHINE_R10000            0x0168  // MIPS little-endian
#define IMAGE_FILE_MACHINE_WCEMIPSV2         0x0169  // MIPS little-endian WCE v2
#define IMAGE_FILE_MACHINE_ALPHA             0x0184  // Alpha_AXP
#define IMAGE_FILE_MACHINE_SH3               0x01a2  // SH3 little-endian
#define IMAGE_FILE_MACHINE_SH3DSP            0x01a3
#define IMAGE_FILE_MACHINE_SH3E              0x01a4  // SH3E little-endian
#define IMAGE_FILE_MACHINE_SH4               0x01a6  // SH4 little-endian
#define IMAGE_FILE_MACHINE_SH5               0x01a8  // SH5
#define IMAGE_FILE_MACHINE_ARM               0x01c0  // ARM Little-Endian
#define IMAGE_FILE_MACHINE_THUMB             0x01c2
#define IMAGE_FILE_MACHINE_AM33              0x01d3
#define IMAGE_FILE_MACHINE_POWERPC           0x01F0  // IBM PowerPC Little-Endian
#define IMAGE_FILE_MACHINE_POWERPCFP         0x01f1
#define IMAGE_FILE_MACHINE_IA64              0x0200  // Intel 64
#define IMAGE_FILE_MACHINE_MIPS16            0x0266  // MIPS
#define IMAGE_FILE_MACHINE_ALPHA64           0x0284  // ALPHA64
#define IMAGE_FILE_MACHINE_MIPSFPU           0x0366  // MIPS
#define IMAGE_FILE_MACHINE_MIPSFPU16         0x0466  // MIPS
#define IMAGE_FILE_MACHINE_AXP64             IMAGE_FILE_MACHINE_ALPHA64
#define IMAGE_FILE_MACHINE_TRICORE           0x0520  // Infineon
#define IMAGE_FILE_MACHINE_CEF               0x0CEF
#define IMAGE_FILE_MACHINE_EBC               0x0EBC  // EFI Byte Code
#define IMAGE_FILE_MACHINE_AMD64             0x8664  // AMD64 (K8)
#define IMAGE_FILE_MACHINE_M32R              0x9041  // M32R little-endian
#define IMAGE_FILE_MACHINE_CEE               0xC0EE
```
<br />
**2\. NumberOfSections**<br />
위의 PE 파일 구조에서 볼 수 있듯이 섹션에 나뉘어서 저장된다. 이름 그대로 섹션의 개수를 나타낸다. 이 값은 반드시 0보다 커야한다. 정의된 섹션 개수와 실제 섹션이 다르면 에러가 발생한다.
<br />

**3\. SizeOfOptionalHeader**<br />
SizeOfOptionalHeader는 IMAGE_NT_HEADERS 구조체의 마지막 멤버인 IMAGE_OPTIONAL_HEADER32의 크기를 나타낸다. IMAGE_OPTIONAL_HEADER32는 C언어 구조체라서 이미 그 크기가 결정되어있지만 PE loader는 SizeOfOptionalHeader를 보고 크기를 인식한다.

PE32+는 IMAGE_OPTIONAL_HEADER64를 사용하므로 두 구조체의 크기가 다르기 때문에 SizeOfOptionalHeader에 구조체의 크기를 명시한다.
<br />

**4\. Characteristics**<br />
파일의 속성을 나타내는 값. 실행이 가능한 형태(Executable or not)인지,  DLL 파일인지 등의 정보들이 bit OR 형식으로 조합된다.

```c
#define IMAGE_FILE_RELOCS_STRIPPED           0x0001  // Relocation info stripped from file.
#define IMAGE_FILE_EXECUTABLE_IMAGE          0x0002  // File is executable
                                                     // (i.e. no unresolved externel references).
#define IMAGE_FILE_LINE_NUMS_STRIPPED        0x0004  // Line nunbers stripped from file.
#define IMAGE_FILE_LOCAL_SYMS_STRIPPED       0x0008  // Local symbols stripped from file.
#define IMAGE_FILE_AGGRESIVE_WS_TRIM         0x0010  // Agressively trim working set
#define IMAGE_FILE_LARGE_ADDRESS_AWARE       0x0020  // App can handle >2gb addresses
#define IMAGE_FILE_BYTES_REVERSED_LO         0x0080  // Bytes of machine word are reversed.
#define IMAGE_FILE_32BIT_MACHINE             0x0100  // 32 bit word machine.
#define IMAGE_FILE_DEBUG_STRIPPED            0x0200  // Debugging info stripped from
                                                     // file in .DBG file
#define IMAGE_FILE_REMOVABLE_RUN_FROM_SWAP   0x0400  // If Image is on removable media,
                                                     // copy and run from the swap file.
#define IMAGE_FILE_NET_RUN_FROM_SWAP         0x0800  // If Image is on Net,
                                                     // copy and run from the swap file.
#define IMAGE_FILE_SYSTEM                    0x1000  // System File.
#define IMAGE_FILE_DLL                       0x2000  // File is a DLL.
#define IMAGE_FILE_UP_SYSTEM_ONLY            0x4000  // File should only be run on a UP machine
#define IMAGE_FILE_BYTES_REVERSED_HI         0x8000  // Bytes of machine word are reversed.
```

여기서 2h와 2000h 값이 중요하다. 2h는 실행이 가능한지, 2000h는 DLL 파일인지를 의미한다.
<br />

**5\. TimeDateStamp**<br />
IMAGE_FILE_HEADER의 멤버중에는 TimeDateStamp 멤버가 있다. 이 값은 파일의 실행에 영향을 미치지 않는 값으로, 해당 파일의 빌드 시간을 나타낸다. 개발 도구에 따라 이 값을 세팅할 수도 있고, 세팅을 못할 수도 있다. (옵션에 따라 달라질 수도 있다.)

#### NT Header - Optional Header

PE header 구조체 중에서 가장 크기가 큰 IMAGE_OPTIONAL_HEADER32에 대해서 알아보자.

```c
typedef struct _IMAGE_DATA_DIRECTORY {
  DWORD VirtualAddress;
  DWORD Size;
} IMAGE_DATA_DIRECTORY, *PIMAGE_DATA_DIRECTORY;

#define IMAGE_NUMBEROF_DIRECTORY_ENTRIES    16

typedef struct _IMAGE_OPTIONAL_HEADER {
  WORD                 Magic;
  BYTE                 MajorLinkerVersion;
  BYTE                 MinorLinkerVersion;
  DWORD                SizeOfCode;
  DWORD                SizeOfInitializedData;
  DWORD                SizeOfUninitializedData;
  DWORD                AddressOfEntryPoint;
  DWORD                BaseOfCode;
  DWORD                BaseOfData;
  DWORD                ImageBase;
  DWORD                SectionAlignment;
  DWORD                FileAlignment;
  WORD                 MajorOperatingSystemVersion;
  WORD                 MinorOperatingSystemVersion;
  WORD                 MajorImageVersion;
  WORD                 MinorImageVersion;
  WORD                 MajorSubsystemVersion;
  WORD                 MinorSubsystemVersion;
  DWORD                Win32VersionValue;
  DWORD                SizeOfImage;
  DWORD                SizeOfHeaders;
  DWORD                CheckSum;
  WORD                 Subsystem;
  WORD                 DllCharacteristics;
  DWORD                SizeOfStackReserve;
  DWORD                SizeOfStackCommit;
  DWORD                SizeOfHeapReserve;
  DWORD                SizeOfHeapCommit;
  DWORD                LoaderFlags;
  DWORD                NumberOfRvaAndSizes;
  IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER, *PIMAGE_OPTIONAL_HEADER;
```

**1\. Magic**<br />
Magic Number는
IMAGE_OPTIONAL_HEADER32 구조체인 경우 10B,
IMAGE_OPTIONAL_HEADER64 구조체의 경우에는 20B를 가진다.
<br />

**2\. AddressOfEntryPoint**<br />
AddressOfEntryPoint는 EP(Entry Point)의 RVA(Relative Virtual Address) 값을 가지고 있다. 이 값은 프로그램에서 **최초로 실행되는 코드의 시작 주소**로, 매우 중요한 값이다.
<br />

**3\. ImageBase**<br />
가상 메모리는 32bit를 기준으로 00000000 ~ FFFFFFFF 범위이다. ImageBase는 이 범위 중에서 PE 파일이 로딩되는 시작 주소를 나타낸다.

EXE, DLL File은 User Memory 영역인 00000000 ~ 7FFFFFFF 범위에 로딩되고, SYS File은 Kernel Memory 영역인 80000000 ~ FFFFFFFF 범위에 로딩된다. 일반적으로 EXE File의 ImageBase 값은 00400000이고, DLL File의 ImageBase 값은 10000000이다. (물론, 다른 값도 지정할 수 있다.) PE loader는 PE File을 실행하기 위해 프로세스를 생성하고 파일을 메모리에 로딩한 후 EIP 레지스터 값을 ImageBase + AddressOfEntryPoint 값으로 세팅한다.
<br />

**4\. SectionAlignment, FileAlignment**<br />
PE File의 Body 부분은 Section으로 나뉘어져있다. ~~코드(.text), 데이터(.data), 리소스(.rsrc)~~ 섹션의 최소단위를 나타내는 것이 FileAlignment이고, 메모리에서 섹션의 최소단위를 나타낸 것이 SectionAlignment이다. 파일/메모리의 섹션 크기는 반드시 각각 FileAlignment/SectionAlignment의 배수가 되어야 한다.
<br />

**5\. SizeOfImage**<br />
SizeOfImage는 PE File이 메모리에 로딩되었을 때 가상 메모리에서 PE Image가 차지하는 크기를 나타낸다. 파일의 크기와 메모리에 로딩된 크기는 다르다.
<br />

**6\. SizeOfHeaders**<br />
PE header의 전체 크기를 나타낸다. 이 값 역시 FileAlignment의 배수여야 한다. 파일 시작에서 SizeOfHeaders의 Offset 만큼 떨어진 위치에 첫 번째 섹션이 위치한다.
<br />

**7\. Subsystem**<br />
이 값을 보고 드라이버 파일(\*.sys)인지, 일반 실행 파일(\*.exe, \*.dll)인지 구분할 수 있다. 다음의 표에 나타난 값을 가질 수 있다.

![Imgur](http://i.imgur.com/4TPVeqi.png)

<br />

**8\. NumberOfRvaAndSizes**<br />
IMAGE_OPTIONAL_HEADER32 구조체의 DataDirectory 배열의 개수를 나타낸다. 구조체의 정의상으로는 배열의 개수가 IMAGE_NUMBEROF_DIRECTORY_ENTRIES 16이라고 명시되어 있지만 16이 아닐 수도 있기 때문에 PE loader는 NumberOfRvaAndSizes 값을 보고 배열의 크기를 인식한다.
<br />

**9\. DataDirectory**<br />
IMAGE_DATA_DIRECTORY 구조체의 배열로, 배열의 각 항목마다 정의된 값을 갖는다.

```c
Data Directory[0] =Export Directory
Data Directory[1] =Import Directory
Data Directory[2] = RESOURCE Directory
Data Directory[3] = EXCEPTION Directory
Data Directory[4] = SECURITY Directory
Data Directory[5] = BASERELOC Directory
Data Directory[6] = DEBUG Directory
Data Directory[7] = COPYRIGHT Directory
Data Directory[8] = GLOBALPTR Directory
Data Directory[9] = TLS Directory
Data Directory[A] = LOAD_CONFIG Directory
Data Directory[B] = BOUND_IMPORT Directory
Data Directory[C] = IAT Directory
Data Directory[D] = DELAY_IMPORT Directory
Data Directory[E] = COM_DESCRIPTOR Directory
Data Directory[F] = Reserved Directory
```

EXPORT(0), IMPORT(1), RESOURCE(2), TLS Directory(9)이 중요하다.

<br />

### Section Header

각 섹션의 속성(Property)을 정의한 것이 Section Header이다. PE File은 코드(.text), 데이터(.data), 리소스(.rsrc) 등을 각각의 섹션에 나눠서 저장한다고 했다. 이렇게 만든 이유는 **프로그램의 안정성** 때문이다. 코드와 데이터가 섞여 있다고 하면 만약 오버플로우가 발생했을 때, 코드에 데이터를 덮어쓰게 되므로 프로그램 사용이 불가능해진다. 그러므로 비슷한 성격을 가지고 있는 것들을 섹션이라고 묶어 놓기로 하고 Section Header를 두어 이 속성을 기록하기로 했다.

![Imgur](http://i.imgur.com/yVslu5i.png)

#### IMAGE_SECTION_HEADER

이것도 역시 마찬가지로 구조체로 되어있다.

```c
#define IMAGE_SIZEOF_SHORT_NAME         8

typedef struct _IMAGE_SECTION_HEADER {
  BYTE  Name[IMAGE_SIZEOF_SHORT_NAME];
  union {
    DWORD PhysicalAddress;
    DWORD VirtualSize;
  } Misc;
  DWORD VirtualAddress;
  DWORD SizeOfRawData;
  DWORD PointerToRawData;
  DWORD PointerToRelocations;
  DWORD PointerToLinenumbers;
  WORD  NumberOfRelocations;
  WORD  NumberOfLinenumbers;
  DWORD Characteristics;
} IMAGE_SECTION_HEADER, *PIMAGE_SECTION_HEADER;
```

이 구조체의 크기는 40bytes이다. (왜냐하면, union의 정의상 가장 큰 자료형이 union의 크기가 되니깐 DWORD가 4bytes이므로 8bytes가 아니라 4bytes가 된다.) 중요한 멤버만 추려서 알아보자.

![Imgur](http://i.imgur.com/lsy993J.png)

VirtualAddress와 PointerToRawData는 아무 값이나 가질 수 없고, 각각 SectionAlignment와 FileAlignment에 맞게 결정된다. VirtualSize와 SizeOfRawData는 일반적으로 서로 다른데, 그 의미는 파일에서의 섹션 크기와 메모리에 로딩되는 섹션 크기가 서로 다르다는 의미가 된다. Characteristics은 다음 코드에 표시된 값들의 bit OR 연산으로 이루어진다.

```c
#define IMAGE_SCN_CNT_CODE                   0x00000020  // Section contains code.
#define IMAGE_SCN_CNT_INITIALIZED_DATA       0x00000040  // Section contains initialized data.
#define IMAGE_SCN_CNT_UNINITIALIZED_DATA     0x00000080  // Section contains uninitialized data.
#define IMAGE_SCN_MEM_DISCARDABLE            0x02000000  // Section can be discarded.
#define IMAGE_SCN_MEM_SHARED                 0x10000000  // Section is shareable.
#define IMAGE_SCN_MEM_EXECUTE                0x20000000  // Section is executable.
#define IMAGE_SCN_MEM_READ                   0x40000000  // Section is readable.
#define IMAGE_SCN_MEM_WRITE                  0x80000000  // Section is writeable.
```

Characteristics은 엄청 길기 때문에 중요한 플래그만 모아서 위의 코드로 엮었다. 이름에서 알 수 있듯이 데이터 섹션의 경우에는 IMAGE_SCN_MEM_READ 또는 WRITE 속성을 가지고 있다는 것을 유추할 수 있고, 코드 섹션의 경우에는  IMAGE_SCN_MEM_EXECUTE 속성이 있다는 것을 유추할 수 있다.

Name 배열에는 C 언어의 문자열처럼 NULL로 끝나지 않는다. ASCII 값만 와야한다는 제한도 없다. PE 스펙상 Name에는 명시적 규칙이 없기 때문에 아무거나 다 넣어도 된다. Name은 그저 참고용일 뿐 어떤 정보로써 활용할 수는 없다. 또한, 파일의 크기를 줄이는 릴리즈 옵션이라던가를 사용하면 여러 섹션들이 하나의 섹션으로 존재할 수 있기 때문에 섹션 이름으로 무언가를 판단하면 안된다.
