---
layout: post
title: "[C++ MFC] DDX / DDV (계산기 예제로 알아보자)"
section-type: post
category: "MFC"
tags:
  - c++
  - MFC
  - DDX
  - DDV
---

MFC 기반으로 프로그램을 짤 때, DDX와 DDV라는 것을 자주 보게 된다. DDX와 DDV가 무엇인지 알아보자.

## DDX

> Dialog Data eXchange의 약자로 Dialog(화면) 와 Data(코드속 변수) 간의 데이터 교환을 의미한다.

DDX는 여러종류의 대화 상자(Dialog)와 코드 속에 있는 변수(Data)의 정보를 교환한다. 어찌보면, Android의 ```findViewByID(int ID)``` 라고 하는 Boilerplate 구문과 매우 흡사해 보이기도 한다. 화면에서 보이는 Button이나 ListBox같은 것들을 만들어놓고, Button을 눌렀을 때 발생하는 이벤트와 함수를 연결해준다던가, 코드 상의 변수와 ListBox와 연결해주는 등의 역할이다.

이런 역할은 코드의 ```DoDataExchange```라는 함수 안에서 일어나게 되는데, \'DDX\_\'로 시작하는 계열의 함수를 이용해서 Dialog와 Data를 링크할 수 있다. 예제를 통해서 DDX에 대해서 자세히 알아보도록 하겠다.

### 예제 :: 더하기 계산기

예를 들어 더하기 계산을 해주는 DDXTest 라는 프로젝트가 있다고 해보자. 허접하지만 본 프로젝트는 다음과 같이 생겼다.

![Imgur](https://i.imgur.com/V05qQWM.png)

첫 번째 EditControl의 ID를 ```IDC_PlusFirst```, 두 번째 EditControl의 ID를 ```IDC_PlusSecond``` 라고 했다. 옆 덧셈 실행이라 적힌 Button의 ID를 ```IDC_Execute```, 그 아래 EditControl(Read Only : True)의 ID를 ```IDC_Result``` 라고 했다. 클래스 마법사를 이용해서 변수를 추가해보자.

![Imgur](https://i.imgur.com/VP7kXTA.png)

각각의 구성요소(Dialog, Window)에 Control ID가 있고, 아까 우리는 ID를 각각 설정했었는데 그것이 멤버변수 탭에 존재한다. 그리고, 변수추가를 눌러서 다음과 같이 설정하면 된다.

![Imgur](https://i.imgur.com/ntjK0mt.png)

변수이름은 원하는대로 설정하면 되는데, 필자는 Android에서 했던 버릇대로(?) ID값과 변수 이름을 최대한 같게 만들었다. 그리고 범주는 Control과 Value가 있는데 Value를 선택했다.(Value를 선택하면 변수형식은 자동으로 ```CEdit```에서 ```CString```으로 변환된다.) 이 부분에 대해서는 후술하겠다. 마침을 누르면 자동으로 여러 소스코드와 헤더파일에서 수정이 이루어진다. (역시 마법사다.) 어떤 부분에서 수정이 이루어졌는지 확인해보자.

확인하러 가기전에, Button(덧셈실행)의 속성 - 컨트롤 이벤트(번개마크) - BN_CLICKED 클릭 - 우측 화살표 클릭 - \<Add\> OnBnClickedExecute 를 눌러놓자. (그러면 자동으로 함수 코드를 보여준다.)

<code> DDXTestDlg.h </code>

```cpp
class CDDXTestDlg : public CDialogEx
{
////////// 윗부분 생략 //////////
public:
    CButton executeButton;
    CString plusFirst;
    CString plusSecond;
    CString result;
}
```

이부분이 헤더파일에 추가되었다. 그렇다는 말은 당연히 소스코드(cpp)에도 위 부분이 선언되었단 말로 유추할 수 있다.

<code> DDXTestDlg.cpp </code>

```cpp
CDDXTestDlg::CDDXTestDlg(CWnd* pParent /*=NULL*/)
	: CDialogEx(CDDXTestDlg::IDD, pParent)
	, plusFirst(_T(""))
	, plusSecond(_T(""))
	, result(_T(""))
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CDDXTestDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_Execute, executeButton);
	DDX_Text(pDX, IDC_PlusFirst, plusFirst);
	DDX_Text(pDX, IDC_PlusSecond, plusSecond);
	DDX_Text(pDX, IDC_Result, result);
}
```

CDDXTestDlg라는 함수 안에 하나, ```DoDataExchange```라는 함수 안에 ```DDX_Control``` 과 ```DDX_Text``` 함수 라인이 하나씩 생성되었다.

이제, DDX Control 을 이용해서 각각의 Dialog와 변수를 연결해줬다. 이제 버튼의 이벤트 함수를 작성해보자.

<code> DDXTestDlg.cpp </code>

```cpp
void CDDXTestDlg::OnBnClickedExecute()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.
	result.Format(_T("%d"), _ttoi(plusFirst) + _ttoi(plusSecond));
        // _ttoi(CString variable) 는 CString 형을 int로 변환하는 함수
}
```

```result.Format()```에 의해서 result라는 변수에 ```plusFirst + plusSecond``` 값이 들어온다. 생각해보면, 이렇게 코드를 짜서 버튼을 누르면 ```OnBnClickedExecute```함수가 실행되고, ```IDC_Execute``` 버튼과 ```DDX_Control```로 이어진 변수 ```result```의 값이 변하기 때문에 결과값이 우리가 계획했던 대로 변할 것이다.

#### 그러나

![Imgur](https://i.imgur.com/kw8NtMB.png)

다음과 같이 ```IDC_Execute```는 변하지 않았다. 왜냐하면, 값의 교환이 일어나지 않았기 때문이다. 예시로 설명해보면, 우리가 메모장에 어떤 글을 쓰고 ```A.txt```로 저장했다고 치자. 분명히 열려있는 메모장 프로그램(notepad.exe)과 ```A.txt```는 연결되어 있다.(DDX Control) 그리고, 안의 내용을 수정했다고 하자. 그런데 아직 저장버튼을 누르지 않았기 때문에, 실제로 ```A.txt``` 파일의 내용은 변하지 않았고, 만약 이 파일의 내용을 불러오는 프로그램을 작성한다면 아마, 수정되기 전의 내용으로 프로그램이 실행될 것이다. 그러니깐, 여기서 하고 싶은 이야기는 **저장을 하지 않았다**는 것이다.

계산기 예시로 다시 돌아와보자. ```IDC_PlusFirst```랑 연결된 변수 ```plusFirst```와 ```IDC_PlusSecond```랑 연결된 변수 ```plusSecond```을 더해서 변수 ```result```에 넣었다. 그러나, ```result```에서 ```IDC_Result```로 **저장을 하지 않았기 때문**에 아무 값도 들어가지 않았다. 그러므로, 다음과 같이 ```OnBnClickedExecute()``` 함수를 수정해야한다.

```cpp
void CDDXTestDlg::OnBnClickedExecute()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.

	result.Format(_T("%d"), _ttoi(plusFirst) + _ttoi(plusSecond)); 	// _ttoi()는 CString 형을 int로 변환하는 함수
	SetDlgItemText(IDC_Result, result);
}
```

위의 코드처럼 ```SetDlgItemText(int ID, LPCTSTR 변수);``` 라는 함수를 이용해서 변수 ```result```에서 컨트롤 ```IDC_Result```로 DDX 해줘야한다. 즉, 저장을 해야한다는 의미이다. 위와 같이 소스를 수정해서 컴파일을 해보면 다음과 같은 문제가 발생한다.

![Imgur](https://i.imgur.com/XdaJLDR.png)

분명 초등교육과정에 의하면, $2 + 3 = 5$인데, 무슨 이유로 결과값이 0이라 출력된 것일까? 이 또한 **저장** 문제에 있다. 우리가 입력한 Input값을 2와 3으로 적었지만, 실제로 변수인 ```plusFirst```와 ```plusSecond```에는 어떤 값도 입력되지 않았다. 그러므로 초기화된 값이 결과값에 들어가게 되어, $0 + 0 = 0$이라는 결과를 출력하게 된 것이다. 고로, 이 또한 ```GetDlgItemText(int ID, LPCTSTR 변수);``` 함수를 이용해서 Dialog에 적은 Input 값을 변수에 넣는 **저장** 작업을 해줘야한다.

```cpp
void CDDXTestDlg::OnBnClickedExecute()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.

	// 대화상자에 입력한 값과 변수를 이어줍니다.
	GetDlgItemText(IDC_PlusFirst, plusFirst);	// plusFirst라는 변수에 IDC_PlusFirst의 ID를 가진 대화상자의 값을 넣는다.
	GetDlgItemText(IDC_PlusSecond, plusSecond);	// plusSecond라는 변수에 IDC_PlusSecond의 ID를 가진 대화상자의 값을 넣는다.
    
	result.Format(_T("%d"), _ttoi(plusFirst) + _ttoi(plusSecond)); 	// _ttoi()는 CString 형을 int로 변환하는 함수
	SetDlgItemText(IDC_Result, result);
}
```

![Imgur](https://i.imgur.com/gMwGke9.png)

우리가 원하는 결과가 출력되었다. 그런데, 본 프로그램에는 Dialog가 총 3개 밖에 없지만, 수많은 Input과 Output이 있는 프로그램이라면 매번 ```GetDlgItemText```과 ```SetDlgItemText```을 작성하려면 얼마나 노동이겠는가? 그래서 우리는 DDX Control을 사용해야한다.

### UpdateData(BOOL bSaveAndValidate)

이런 수고로움을 덜기 위해서는 DDX Control에는 ```UpdateData(BOOL bSaveAndValidate)``` 함수가 있다. DDX Control로 위의 코드를 수정하면 다음과 같다.

```cpp
void CDDXTestDlg::OnBnClickedExecute()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.

        UpdateData(TRUE);       // 컨트롤 -> 변수로 데이터 이동
	result.Format(_T("%d"), _ttoi(plusFirst) + _ttoi(plusSecond)); 	// _ttoi()는 CString 형을 int로 변환하는 함수
	UpdateData(FALSE);     // 변수 -> 컨트롤로 데이터 이동
}
```

코드가 조금 줄었다. ```UpdateData()```라는 함수를 이용하면, 수많은 ```GetDlgItemText```과 ```SetDlgItemText```을 안 쓰고 한 번에 처리할 수 있다. 그런데 여기서 의문이 생긴다. 왜 앞에는 TRUE, 뒤에는 FALSE 일까? MSDN에서 제공한 ```CWnd::UpdateData``` [문서](https://msdn.microsoft.com/en-us/library/aa250355(v=vs.60).aspx)에 Parameter 부분에는 다음과 같이 적혀있다.

> bSaveAndValidate <br>
> Flag that indicates whether dialog box is being initialized (FALSE) or data is being retrieved (TRUE).

해석해보면 다음과 같다. 대화상자가 초기화 중인지 (FALSE) 또는 데이터를 검색하는 중인지(TRUE)를 알아보는 플래그이다. 대화상자를 초기화 중이라면 FALSE를 사용하면, 데이터를 검색하는 중이라면 TRUE를 사용하라는 의미같지만, 의미가 확 와닿지 않는다. 좀더, 직관적으로 이해할 수 있도록 요약하면 다음과 같다.

> True는 Dialog(컨트롤) -> 변수로 이동할 때 사용. <br>
> False는 변수 -> Dialog로 이동할 때 사용.

## DDV

> Dialog Data Validation의 약자로 DDX에서 Validation(데이터 검증) 부분을 추가한 것이다.

사실 DDV는 별 것 없는 것 같다. DDX에서 Vaildation 기능을 추가한 것인데, 그것의 함수로 ```DDV_MaxChars()``` 함수가 있다. 

![Imgur](https://i.imgur.com/aWq4W3w.png)

변수를 추가할 때, 최대 문자 수를 설정하면 코드에서는 다음과 같은 변화가 생긴다.

<code>DDXTestDlg.cpp</code>

```cpp
void CDDXTestDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_Execute, executeButton);
	DDX_Text(pDX, IDC_PlusFirst, plusFirst);
	DDX_Text(pDX, IDC_PlusSecond, plusSecond);
	DDX_Text(pDX, IDC_Result, result);
	DDV_MaxChars(pDX, plusFirst, 17);      // 추가된 부분
}
```

다음과 같이 ```DDV_MaxChars(pDX, plusFirst, 17);``` 코드가 한줄 더 생성되었다. 그 외에도 ```DDV_MinMaxInt()``` 함수로 최소 최대 정수값을 조정해서 좀더 편리하게(?) 코드를 작성할 수 있다. ~~물론, 나같은 초보는 Input을 받아오고 나서 예외처리를 내겠지만..~~
