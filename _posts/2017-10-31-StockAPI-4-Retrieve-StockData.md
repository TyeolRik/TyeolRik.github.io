---
layout: post
title: "[키움API with C++] 주식 정보 가져오기"
section-type: post
category: "Stock_API"
tags:
  - c++
  - stock
  - API
  - kiwoom
---

지난 포스트에서는 Login을 한 뒤 서버에서 return 하는 정보를 받아오고, 정상적으로 작동이 되었는지를 확인하기 위해서 ListBox 에 출력을 하는 것까지 해보았다. 이번에는 주식 정보를 가져와보고자 한다. 오늘 **가져올 주식 정보는 일봉** 이다.

## 디자인개요 :: 어떻게 구동될 것인가?

지금까지의 AutoStock Project에서 사용했던 MFC 프로그래밍을 생각해보면 ~~사실 잘 알지도 못하지만~~ Dialog를 구성하고, Dialog과 연결된 각각의 컴포넌트에 변수를 추가(연결[^1])하고 해당 변수의 값을 컴포넌트 Update 함으로써 사용자의 눈에 데이터를 도출할 수 있다. 고로, 우리가 원하는 것은 주식정보 이기 때문에 주식정보를 어떻게 표현할지에 대한 Dialog를 그려보도록 하자.

![Imgur](https://i.imgur.com/yXAOMN4.png)

대충 그려보았다. 위의 사진처럼 종목코드를 이용해서 우측 ListBox에 필요한 정보를 나열하는 것으로 데이터를 출력하도록 하겠다.

## 새로운 Dialog 생성하기

필자는 새로운 Dialog를 생성 (리소스뷰 - Dialog 우클릭 - Dialog 삽입) 했기 때문에 해당 Dialog에 해당하는 header 파일이랑 cpp 파일(소스파일)을 만들어야한다. 필자는 Dialog의 ID를 ```IDD_DailyStockInfo``` 라고 명명했다.

먼저 클래스 추가를 해야한다. Dialog를 선택한 후, 우클릭을 하면 **클래스 추가** 가 있다.

![Imgur](https://i.imgur.com/Dg28UXG.png)

그리고 아래 그림과 같이 설정하면 된다.

![Imgur](https://i.imgur.com/H07O8Dq.png)

필자는 Dialog와 클래스 이름을 같게 했다. 그냥 개인의 취향이다. 독자가 뭐 ```Happy```라고 클래스 이름을 지어도 상관없다. 마침 버튼을 누르면 헤더파일과 소스파일이 생성된다. 우리의 프로그램은 로그인 이후에 자동으로 우리가 생성한 Dialog 창이 뜨는 것을 목표로 한다. 고로, Login 이후에 실행되는 함수인 ```OnEventConnectKhopenapictrl1(long nErrCode)``` 함수를 다음과 같이 수정해야 한다.

<code>AutoStockDlg.cpp</code>

```cpp
#include "DailyStockInfo.h" // Include 를 하지 않으면, DailyStockInfo 라는 클래스가 무엇인지 모른다.

// 중간에 생략된 여러가지 함수들

void CAutoStockDlg::OnEventConnectKhopenapictrl1(long nErrCode)
{
    // 지난번에 했던 코드의 제일 마지막에
    DailyStockInfo DailyStockInfoDialog; // Dialog 객체 생성
    DailyStockInfoDialog.DoModal(); // Dialog 창을 띄움
}
```

절대로 ```DailyStockInfo.h``` Include 하는 것을 까먹으면 안된다. 그렇다면, DailyStockInfo 클래스를 객체로 만드는 것에 식별자를 알 수 없다면서 빨간 줄로 에러 표시가 나올 것이니 꼭 주의하기 바란다.

## 변수 생성하기

이제 생성된 클래스에 변수를 생성해보자. 우리의 Dialog를 살펴보면 2개의 EditControl과 한개의 버튼, ListBox가 있다. 이전에 로그인 정보를 불러왔을 때처럼 변수를 추가하자.

![Imgur](https://i.imgur.com/0hCsKQd.png)

멤버변수를 추가할 때, 종목코드에 있는 EditControl과 기준일자에 있는 EditControl은 최대 글자수가 6자(종목코드는 6자리), 8자(YYYYMMDD)이므로 설정할 때 괜한 에러가 발생하지 않도록 DDV로 설정해주자. 필자는 각각의 변수를 ```SearchButton```, ```StockCode```, ```BaseDate```, ```StockInfoListBox``` 라고 설정해줬다.

## 버튼 이벤트를 생성하자

우리는 위에서 만든 Dialog에 검색 버튼을 만들었다. 검색 버튼을 누르면 사용자가 입력한 종목코드와 기준일자를 불러오고, 키움 API에서 일봉에 대한 정보를 불러온 다음, 우측 ListBox에 정보가 출력되어야한다.

먼저, 버튼에 대한 이벤트를 만들어보자. Dialog의 검색 버튼을 우클릭 - 속성 - 우측 상단 번개모양(컨트롤 이벤트) - BN_CLICKED 클릭 - (우측 화살표에서) <Add> OnBnClickedSearchbutton 클릭.

그렇다면 자동으로 화면이 이동되고 ```OnBnClickedSearchbutton()``` 함수가 코드에 적힌다. 이제 이벤트를 생성했으니 이 이벤트가 어떤 일을 할 것인가에 대한 코딩을 해보자.

## 종목을 검색하자

종목을 검색하기 위해서는 ```SetInputValue()```와 ```CommRqData()``` 함수가 필요하다. 이제 이 함수를 이용해서 코드를 짜면 다음과 같다.

<code> DailyStockInfo.cpp </code>

```cpp
void DailyStockInfo::OnBnClickedSearchbutton()
{
    // TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.
    
    UpdateData(false); // DDX로 변수에 데이터 저장하기

    // 어떤 값을 요청할지를 세팅
    theApp.stock.SetInputValue(_T("종목코드"), StockCode);
    theApp.stock.SetInputValue(_T("기준일자"), StockCode);

    // 실제로 요청
    long requestCode = theApp.stock.CommRqData(_T("주식일봉조회"), _T("opt10081"), 0,  _T("2000"));
}
```

요청을 하면, 서버에서 정보를 보낼 것이다. 서버에서 정보를 받으면 발생하는 이벤트는 ```OnReceiveTrData()```이다. 고로, 로그인 함수에서 이벤트를 설정했던 것처럼 ActiveX를 설정해주자. 다시 이전의 Dialog 였던(ActiveX를 불러왔던 첫번째 Dialog) ```AutoStock.rc```에서 OpenAPI 우클릭 - 속성 - 컨트롤이벤트(번개모양) - OnReceiveTrData - \<Add\> OnReceiveTrDataKhopenapictrl1 을 클릭하자. 그러면, 소스파일에 자동적으로 해당 함수가 작성되고 내용을 채우면 될 것이다.










-----------------------

[^1]: DDX Control
