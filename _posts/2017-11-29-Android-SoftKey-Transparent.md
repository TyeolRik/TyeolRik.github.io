---
layout: post
title: "[Android] softkey 투명하게 하기"
section-type: post
category: "Android"
tags:
  - android
  - softkey
  - design
---

일부 스마트폰의 경우에는 하드웨어에 홈키와 백버튼 등이 없는 경우가 있다. 그런 경우에는 화면 가장 하단에 터치가 가능한 홈키와 백버튼이 존재하는데 그런 키를 SoftKey(소프트키) 라고 한다. Android의 개발의 상황에서는 그 키들을 Navigation Bar 라고 부른다. ~~Navigation Bar에 대해서는 아직 부정확하다.~~

디자인적인 시각에서 볼 때, [Cold start](https://developer.android.com/topic/performance/launch-time.html#cold) 시에 [Splash Image](https://www.bignerdranch.com/blog/splash-screens-the-right-way/)를 이용해서 로딩화면을 구현할 때, 로딩화면과 실질적으로 처음 Activity의 백그라운드가 같을 수 있다. 그 때, 로딩화면은 상단바(Status Bar)와 네비게이션바(SoftKey)가 나오지 않는 전체화면이지만, 로딩이후 첫 Activity는 (따로 설정하지 않는 이상) 둘다 존재하기 때문에 이미지의 중심이 이동되는 현상이 생길 수 있다. 즉, UI적인 측면에서 순간적으로 이미지가 잠깐 움직이기 때문에 아름답지 못하다는 것이다.

![Imgur](https://i.imgur.com/1DL8adz.png)

위의 그림에서 빨간 점은 화면의 중심이다. 왼쪽의 Splash Image에서 오른쪽의 첫 Activity로 로딩이 끝나면 화면이 약간 올라온다. 위에서 설명한 현상이 다음과 같은 현상이라고 할 수 있다.

### 해결방안 :: SoftKey를 투명하게 만들자!

SoftKey를 없애버려서 전체화면 모드로 앱을 구현하게 할 수 있지만, 그의 단점은 화면의 위를 살짝 눌러야 앱의 뒤로가기가 구현된다는.. UX적으로 상당히 불편한 ~~나만 불편할수도 있고..~~ 상황이 나온다. 고로, SoftKey를 투명하게 만들어서 로딩화면(Splash Image)와 ImageView의 크기를 같게 만드는 것이다. (좀더 정확히는 ImageView의 크기를 화면의 크기만큼 맞춘다고 하는게 더 맞을 것 같다.)

<code> styles.xml </code>

```xml
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="android:Theme.Material.Light.DarkActionBar">
        <!-- Action Bar 없애기 (위에 앱 이름이랑 메뉴 나오는거) -->
        <item name="android:windowActionBar">true</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">false</item>
        
        <!-- Navigation Bar를 투명하게 만들기 -->
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowTranslucentStatus">true</item>
        <item name="android:windowTranslucentNavigation">true</item>
    </style>

</resources>
```

위의 3개로 ActionBar를 없애고, 아래의 3개로 NavigationBar를 없애면 된다. 이렇게 하면 layout의 Design 탭에서 전체화면으로 디자인할 수 있게 된다.
