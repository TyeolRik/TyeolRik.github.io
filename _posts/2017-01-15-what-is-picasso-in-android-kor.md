---
layout: post
title: Android - Picasso란? [KOR]
section-type: post
category: Android
tags: [ 'korean', 'android', 'butterknife', 'gradle', 'library' ]
---
### If you want to read this post in English,
Please click **[HERE]({{ site.baseurl }}{% link _posts/2017-01-15-what-is-picasso-in-android-eng.md %})**. But I am unsure as to weather it is grammatically correct. **LUL**

## Picasso?

Picasso는 Square Inc.가 개발한 오픈 소스 라이브러리입니다. Method Chain 방식이라서 매우 직관적입니다. 다음의 코드를 보면 누구라도 이해할 수 있을겁니다.


~~~ java
Picasso.with(this) // Input
       .load(imageURL) // Operators
       .into(imageView); // Output
~~~

거의 이건 프로그래밍 언어가 아니라 자연어(영어) 수준입니다. Picasso는 Reactive Programming(반응형 프로그래밍)으로 된 라이브러리입니다. 상당히 직관적이고 딱 한 줄로 이미지를 로드할 수 있습니다.

## 장점

### 1. 직관적이다.

반응형 프로그래밍은 3가지 부분으로 나뉘어져 있습니다. Input → Operator → Output 딱히 복잡하게 생각하지 않아도 코드를 봤을 때, 이해할 수 있습니다.

### 2. 네트워크에서 이미지를 불러오기 간편하다.

HTTP 요청을 자동으로 만들어줍니다. 페이지가 어떤 종류인지 어떤 식으로 불러들여야 할지도 생각할 필요가 없습니다. 네트워킹을 하면서 발생하는 예외도 걱정할 필요가 없습니다. 메인 스레드에서 다운로드하지 않기 때문입니다. 이미지 캐싱도 해주기 때문에 재요청한다고 해서 많은 비용이 발생하는 것도 아닙니다.

### 3. 이미지를 편집하기 쉽다.

자르거나 중심을 맞추거나, 크기를 조정하는 등의 작업은 매우 간편하게 할 수 있습니다. 구체적인 사용법은 다음 포스팅에서 다뤄보겠습니다.
