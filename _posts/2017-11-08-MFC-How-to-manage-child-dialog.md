---
layout: post
title: "[MFC] 다이얼로그가 서로를 참조하는 방법"
section-type: post
category: "MFC"
tags:
  - c++
  - mfc
  - dialog
---

MFC 기반 프로그램에서는 Dialog를 기반으로 프로그래밍된다. 한번에 여러창을 띄우지 않기 때문에 Dialog 에는 당연히 상속의 개념이 적용이 된다. A Dialog에서 B Dialog를 호출하였다면, A Dialog를 **Parent Dialog** (부모 다이얼로그), B Dialog는 **Child Dialog** (자식 다이얼로그) 라고 한다. 부모 다이얼로그와 자식 다이얼로그는 서로를 참조할 수 있다. ~~아마, 둘다 메모리에 존재하고 있기 때문이지 않을까?~~
