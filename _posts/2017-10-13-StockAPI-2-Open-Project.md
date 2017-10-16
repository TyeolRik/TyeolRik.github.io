---
layout: post
title: "[키움API with C++] 프로젝트 새로 만들기"
section-type: post
category: "Stock_API"
tags:
  - c++
  - stock
  - API
  - kiwoom
---

필자는 C\+\+에 딱히 재능이 없다. 그냥 얕게얕게 필요한 정보만 알아보는 식으로 공부한지라 C\+\+을 따로 막 파서 공부하고 하진 않아서, 일단 최대한 타 블로그나 개발가이드에서 소개한 방식과 개발 중에 나타나는 에러를 처리하는 과정을 블로그에 소개하고자 한다.

## 새로만들기 :: 프로젝트

일단 새로만들기 \- 프로젝트를 하자. 아래 사진을 참조하여 새로 만들기를 하면 된다.

![Imgur](https://i.imgur.com/VZ95Vpx.png)

![Imgur](https://i.imgur.com/UErJkvB.png)

처음 C\+\+을 배워서 \"printf\(\"HelloWorld\"\)\"하는 것처럼 콘솔창으로 주가를 볼 것이 아니기 때문에 MFC 응용프로그램으로 설정해야한다. 필자는 프로젝트 이름을 AutoStock으로 지었다.

### API 함수 넣기

**가장 중요한 파트이다.** 키움증권의 API를 불러와야한다. [이전 포스트]({{ site.baseurl }}{% link _posts/2017-10-13-StockAPI-1-Start.md %})에서 언급한 자료실의 샘플파일(khopenapictrl1.h, khopenapictrl1.cpp)을 가져와야한다.

![Imgur](https://i.imgur.com/1wGxjsZ.png)

본 2개의 파일을 프로젝트 폴더에 넣어주자.

![Imgur](https://i.imgur.com/YtDoD5G.png)

폴더가 어딘지 모르겠다면 다음과 같은 방법으로 찾을 수 있다. 솔루션 제목을 오른쪽 마우스 \(클릭\) \- \(하단\) 파일 탐색기에서 폴더 열기\(X\)
 
![Imgur](https://i.imgur.com/XlDqHZA.png)
 
위 사진 처럼 \(솔루션이름\) AutoStock.h나 cpp 파일과 함께 있으면 include 할 수 있다.

그리고 가장 중요한 것은 프로젝트에 추가를 해야한다. 안하면 LNK2001, LNK1120 오류(외부참조 오류)가 뜰 수 있다.

![Imgur](https://i.imgur.com/4S32uUV.png)

다음과 같이 소스파일과 헤더파일 각각에 오른쪽 마우스를 누르고 추가를 눌러서 아까 프로젝트 폴더에 넣었던 소스파일과 헤더파일(khopenapictrl1.h, khopenapictrl1.cpp)을 추가해주자. 위의 사진처럼 소스파일 밑에 khopenapictrl1.cpp 파일이 있고,  헤더파일 밑에 khopenapictrl1.h 파일이 있으면 성공적으로 완료된 것이다.
 
### 헤더파일 include 하기

![Imgur](https://i.imgur.com/wZmBwtg.png)

위 사진과 같이 stdafx.h 파일에 다음의 코드를 추가하자. 

```cpp
#include "khopenapictrl1.h"
```

### Active X 추가하기

Active X[^1]를 추가해보겠다. 리소스 탐색기에서 IDD_AUTOSTOCK_DIALOG ~~제목을 따로 수정하지 않았다는 전제하에~~ 을 열면 다음과 같은 대화상자가 나온다. (처음 프로젝트 생성했을 때 뜨는 창)

![Imgur](https://i.imgur.com/tMdKLey.png)

위 사진처럼 오른쪽 마우스 - ActiveX 컨트롤 삽입 - KHOpenAPI Control 을 선택하고 확인을 누르면 된다.

![Imgur](https://i.imgur.com/skBMZX5.png)

빨간색으로 강조했다. OpenAPI 라는 글자와 함께 하얀 바탕의 그림이 하나 올라온다.

API를 추가했으니, 이에 대응되는 API의 객체를 추가하여야 한다.

![Imgur](https://i.imgur.com/OQHPf8K.png)

위 사진처럼 프로젝트의 헤더파일(AutoStock.h)에 CKhopenapictrl1 클래스의 객체를 선언하자. 필자는 stock 이라는 이름의 객체를 선언하였다. 모르겠으면 아래의 소스코드를 참조.

```cpp
class CAutoStockApp : public CWinApp
{
public:
	CAutoStockApp();
	CKhopenapictrl1 stock;		// 키움증권 API 객체

// 재정의입니다.
public:
	virtual BOOL InitInstance();

// 구현입니다.

	DECLARE_MESSAGE_MAP()
};
```

### 로그인 창 구현

API를 프로그램에 내장하는 것까지 완성했다. 이제, 로그인 창을 구현해보자. 로그인 이라는 버튼을 만들고, 이벤트함수를 처리해보겠다.

일단 보기싫으니깐 TODO\: 여기에 대화 상자 컨트롤을 배치합니다. 라는 문구는 제거하겠다. 우리에게 불필요한 \"확인\", \"취소\"버튼을 삭제하고 새로 버튼을 만들어서, 진행해보겠다.

![Imgur](https://i.imgur.com/HtxIHrb.png)

메인 Dialog(여기서는 IDD_AUTOSTOCK_DIALOG)를 열고, 왼편에 도구상자(없으면 Ctrl + Alt + X)를 열고, Button 이라고 적힌 것을 드래그 한다.

![Imgur](https://i.imgur.com/WjBHa6t.png)

버튼을 오른쪽 마우스 \- 속성을 클릭하고 Caption 값을 Login 으로 바꾸면 Button1이라고 적힌 버튼이 Login으로 바뀐다.

이제, 이벤트 처리를 해보겠다. 버튼을 오른쪽 마우스로 클릭 \- 속성에 들어가서 상단에 컨트롤 이벤트(번개모양) 를 클릭한다. 그리고 BN_CLICKED의 값을 클릭하면 우측에 화살표가 생기는데, 화살표를 클릭하면 <Add> OnBnClickedButton1 이 있다. 클릭하면 AutoStockDlg.cpp 파일로 이동하게 되는데, 이곳이 버튼을 클릭했을 때 실행되는 함수(이벤트함수)다. 로그인을 할 수 있도록 API를 불러오도록 하겠다.

![Imgur](https://i.imgur.com/NFOKREO.png)

위의 사진처럼 (자동으로 열린) AutoStockDlg.cpp 파일의 OnBnClickedButton1 함수에 다음과 같은 코드를 작성한다. login_flag는 CommConnect() 함수의 return 값을 저장하기 위해서 선언했다.

```cpp
void CAutoStockDlg::OnBnClickedButton1()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.
	int login_flag;
	login_flag = theApp.stock.CommConnect();		// 로그인 창을 여는 함수. 0이면 성공, 아니면 에러.
}
```

위의 소스코드가 OnBnClickendButton1()의 전문이므로 참조하자.

-------

### theApp.stock.CommConnect() 분석

공부하는 차원이니만큼 login_flag = theApp.stock.CommConnect(); 라인을 분석해보도록 하겠다. theApp 안의 객체 stock안에 있는 CommConnect 함수를 실행해서 그 return 값을 login_flag라는 변수에 넣겠다는 의미이다. 그렇다면, stock 값은 제일 처음에 API를 설정하고, 헤더파일(AutoStock.h)에 넣는 과정에서 CAutoStockApp 이라는 클래스에 변수를 할당했다.

```cpp
CKhopenapictrl1 stock;		// 키움증권 API 객체
```

이런 식으로 말이다. 그러므로 CKhopenapictrl1 안에 CommConnect 함수가 존재한다는 사실을 유추할 수 있다. 그런데, 궁금한 것은 theApp은 무엇이냐는 의문이 생긴다. 알아보니, theApp 은 MFC 기반에서 고정된 어플리케이션 이름이라고 한다. 다시 AutoStock.h 헤더파일을 보면, 아래와 같이 extern CAutoStockApp theApp 이라는 코드가 마지막에 있다.

```cpp
extern CAutoStockApp theApp;
```

extern 이라는 키워드는 전역을 나타낸다고 한다. 고로, 외부 모듈 어딘가에 CAutoStockApp 이라는 클래스형으로 theApp이라는 변수가 존재한다는 의미가 된다. 하지만, 헤더파일에서의 선언이기 때문에 실제로 메모리를 할당받는 것이 아니다. 고로, cpp 파일(AutoStock.cpp)에서 변수를 실제로 선언하게 된다. 다음과 같이 말이다.

```cpp
// 유일한 CAutoStockApp 개체입니다.
CAutoStockApp theApp;
```

그러므로, theApp 이라는 함수가 헤더파일에서 선언한 stock 이라는 변수를 가지게 되는 것이다.

--------

여기까지 구현하고 컴파일해서 실행해보았다.

![Imgur](https://i.imgur.com/pn8bWOR.png)

Login 버튼을 누르면 에러가 뜬다. 그 이유는 MFC의 [DDX Control]({{ site.baseurl }}{% link _posts/2017-04-01-what-is-DDX-Control.md %})[^2]과 관련되어 있다. DDX Control은 내용이 약간 복잡하고, 본 게시글의 주제와 약간 벗어나기 때문에 따로 작성하도록 하겠다. [링크]({{ site.baseurl }}{% link _posts/2017-04-01-what-is-DDX-Control.md %})참조!

그러므로, ActiveX와 DDX Control을 연결해보자. AutoStockDlg.cpp 파일에 DoDataExchange() 함수에서 둘을 연결하면 된다.

![Imgur](https://i.imgur.com/YJNibqH.png)

위의 사진 처럼 코드를 추가해주자.

```cpp
void CAutoStockDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_KHOPENAPICTRL1, theApp.stock);
}
```

DDX_Control 함수는 3개의 인자를 가지고 있는데, 첫 번째 인수는 CDataExchange 객체의 포인터 없으로 그냥 pDX라고 하면 된다. 두 번째 인수는 리소스에 있는 ID값(구성요소에 할당된 ID)이다. Dialog에 들어가서 OpenAPI 의 속성에 들어가보면 IDC_KHOPENAPICTRL1 라고 적혀있음을 알 수 있다. 세 번째 인수는 구성요소의 cpp 상에서의 객체이다. 헤더파일에 우리가 CKhopenapictrl1 stock 이라고 선언했었는데, 이것이 코드 상에서의 객체가 된다. 즉, 이 코드에서 DDX_Control 함수가 가지는 의미는 IDC_KHOPENAPICTRL1 이라는 Dialog 상의 구성요소와 stock 이라는 객체가 서로 데이터를 교환한다(할 수 있다)는 의미를 갖게된다.

이제 컴파일을 하고, Login 버튼을 눌러보자.

![Imgur](https://i.imgur.com/Bp5HTtb.png)

다음과 같이 로그인 창이 뜬다. 그렇다면, 이번 글에서 목표했던 프로젝트 생성 및 API 불러오기를 성공한 것이다.

혹시나 로그인 창이 안 뜨고 LNK2001이나 LNK1120 에러가 뜬다면 헤더파일 추가하는 부분을 처음부터 다시 읽어보기 바란다. 헤더파일을 제대로 추가하지 않았거나 소스파일을 추가하지 않았다면 뜨는 에러이다.




-------------------------


[^1]: ActiveX의 의미에 대해서는 [나무위키](https://namu.wiki/w/ActiveX)를 참조

[^2]: DDX Control이란 Dialog Data eXchange의 약자로, 화면(Dialog)과 변수(cpp 내의 데이터)간의 데이터 교환을 돕는 역할을 한다. 자세한 내용은 [MSDN 문서](https://docs.microsoft.com/ko-kr/cpp/mfc/dialog-data-exchange)를 참조.
