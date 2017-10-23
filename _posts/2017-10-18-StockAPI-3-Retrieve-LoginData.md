---
layout: post
title: "[키움API with C++] 로그인 정보 얻어오기"
section-type: post
category: "Stock_API"
tags:
  - c++
  - stock
  - API
  - kiwoom
---

지난 포스트에서는 프로젝트를 생성하고 API로 로그인 창을 불러오는 것까지 해보았다. 이번에는 Login을 한 뒤 서버에서 return 하는 정보를 받아서 출력해보겠다.

## Dialog Design 수정하기

Login에 대한 return 값을 서버에서 받았다면, 그 결과값을 사용자의 눈에 표현해야할 것이다. (그래야 개발자가 제대로 실행되고 있는지 확인할 수 있지 않는가) 고로, 결과값을 저장할 Control[^1]을 의미한다.

![Imgur](https://i.imgur.com/9dTPeo6.png)

그래서 위 사진처럼 Static Text와 List Box를 추가했다. Static Text는 처음 추가하면 Static 이라고 적혀있는데, 속성의 Caption값을 User Information으로 바꾸면 된다.

![Imgur](https://i.imgur.com/ETHZVuc.png)

다음과 같이 List Box의 변수도 추가해줬다. 변수 이름은 ```loginInformationBox```로 정했다. ~~내가 생각해도 좀 길긴하다~~ 범주를 Control로 정하면 (default값) 변수 형식도 CListBox로 자동설정된다.

## KOA Studio 사용하기

> KOA Studio는 키움증권API의 개발자도구로 개발가이드가 있기 때문에 사용하기 편리하다.

Login 버튼을 누르면 키움증권 API에 접속하기 위해서 로그인 창이 뜬다. 이는 우리가 설정했던 ```CommConnect()```함수에 의해서 실행된 것이라는 사실은 알고있다. **우리의 목표** 는 Login 버튼을 누르고 로그인에 성공하면 아까 만들었던 ```loginInformationBox```에 로그인 정보가 업데이트 되게 하는 것이다. 이를 위해서는 ```CommConnect()```가 실행되고 난 이후에 어떤 이벤트가 발생하는 지에 대해서 알아봐야할 필요가 있다. 그러므로 **우리는 KOA Studio의 개발가이드를 읽어봐야한다.**

KOA Studio에서 (좌측 하단) 개발가이드 - 로그인 버전처리 - 기본설명을 읽어보자. 로그인개요 부분에 다음과 같이 적혀있다.

> 로그인과 관련한 이벤트 함수는 OnEventConnect()이며 ...

그러므로 로그인 버전처리 - 관련함수 - ```void OnEventConnect(long nErrCode)```에 들어가보면 다음과 같이 적혀있다.

> 로그인 처리 이벤트 함수입니다. 성공이면 인자값 nErrCode가 0이며 에러는 다음과 같은 값이 전달됩니다.

즉, 우리는 이 개발가이드에서 ```CommConnect()``` 이후에 ```void OnEventConnect()```가 실행된 다는 것을 알 수 있다.

## 이벤트 함수 수정하기

이벤트 함수인 ```void OnEventConnect(long nErrCode)```을 수정해보도록 하겠다.

![Imgur](https://i.imgur.com/uAGUroh.png)

위 사진처럼 Dialog에서 OpenAPI (ActiveX)를 우클릭하고 속성 - (상단) 컨트롤 이벤트에 들어가면 OnEventConnect 라는 부분이 있다. 이것을 클릭하면 ```<Add> OnEventConnectKhopenapi1```이 있으니 이것을 클릭해서 추가한다. 이것이 아까 KOA Studio 에서 봤던  ```void OnEventConnect()``` 함수이다. 그리고 ```AutoStockDlg.cpp``` 파일이 열리고 다음과 같은 코드가 추가된다.

<code>AutoStockDlg.cpp</code>

```cpp
void CAutoStockDlg::OnEventConnectKhopenapictrl1(long nErrCode) {
    // TODO: 여기에 메시지 처리기 코드를 추가합니다.
}
```

이 코드를 수정하여 다음과 같이 만들자.

```cpp
void CAutoStockDlg::OnEventConnectKhopenapictrl1(long nErrCode)
{
	// TODO: 여기에 메시지 처리기 코드를 추가합니다.
	// nErrCode == 0   : 로그인 성공
	// nErrCode == 100 : 사용자 정보교환 실패
	// nErrCode == 101 : 서버접속 실패
	// nErrCode == 102 : 버전처리 실패
	if(nErrCode == 0) {
		loginInformationBox.ResetContent(); // ListBox 초기화. 모두 하얗게 만듭니다.

		CString Account_Count = theApp.stock.GetLoginInfo(_T("ACCOUNT_CNT")).Trim();  // 전체 계좌 개수
		CString Account_Number = theApp.stock.GetLoginInfo(_T("ACCNO")).Trim();  // 전체 계좌 반환 : 계좌별 구분은 ';'
		CString User_ID = theApp.stock.GetLoginInfo(_T("USER_ID")).Trim();  // 사용자 ID를 반환
		CString User_Name = theApp.stock.GetLoginInfo(_T("USER_NAME")).Trim();  // 사용자명 반환
		CString KeyBoard_Security = theApp.stock.GetLoginInfo(_T("KEY_BSECGB")).Trim();  // 키보드 보안 여부 0:정상 1:해지
		CString Firewall_Security = theApp.stock.GetLoginInfo(_T("FIREW_SECGB")).Trim();  // 방화벽 설정 여부 0:미설정 1:설정 2:해지

		// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.
		loginInformationBox.AddString(_T("총 ") + Account_Count + _T("개의 계좌가 검색되었습니다."));
		loginInformationBox.AddString(_T("사용자 ID : ") + User_ID);
		loginInformationBox.AddString(_T("사용자명 : ") + User_Name);

		switch (_ttoi(KeyBoard_Security))
		{
		case 0:
			loginInformationBox.AddString(_T("키보드 보안 : 정상"));
			break;
		case 1:
			loginInformationBox.AddString(_T("키보드 보안 : 해지"));
			break;
		default:
			loginInformationBox.AddString(_T("키보드 보안 : ERROR ") + KeyBoard_Security);
			break;
		}

		switch (_ttoi(Firewall_Security))
		{
		case 0:
			loginInformationBox.AddString(_T("방화벽 설정 : 미설정"));
			break;
		case 1:
			loginInformationBox.AddString(_T("방화벽 설정 : 설정"));
			break;
		case 2:
			loginInformationBox.AddString(_T("방화벽 설정 : 해지"));
			break;
		default:
			loginInformationBox.AddString(_T("방화벽 설정 : ERROR ") + Firewall_Security);
			break;
		}
	}
}
```

위의 코드에서 ```theApp.stock.GetLoginInfo(_T("ACCOUNT_CNT")).Trim();```에 ```Trim()```이 왜 있는지 궁금한 사람이 있을 것이다. 정확한 이유는 모르겠지만 ```GetLoginInfo()```로 정보를 받아오면 whitespace가 앞뒤로 많이 붙어 있다. 그러므로 ```Trim()```함수를 이용해서 whitespace를 비롯한 여러 쓰잘데기 없는 것들을 지우고 우리가 필요한 정보만을 얻어왔다.

그리고 실행하면 쨔쟌! 로그인 이후에 다음과 같이 **자동적으로** ListBox가 수정되는 것을 볼 수 있다.

![Imgur](https://i.imgur.com/Ilxj8BC.png)

### 엥? ListBox 안의 순서가 뒤엉켜 있어요!

![Imgur](https://i.imgur.com/VldmIdT.png)

위와 같이 순서가 엉켜있는 사람이 있을 것이다. 그럴 땐, ListBox의 속성값 중에 동작 - Sort 값을 False로 바꿔주면 깔끔하게 해결된다.

--------

[^1]: Button, Static Text, List Box 같은 것을 의미한다.
