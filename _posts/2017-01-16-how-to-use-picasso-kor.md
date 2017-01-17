---
layout: post
title: Android - Picasso 사용법 [KOR]
section-type: post
category: Android
tags: [ 'korean', 'android', 'picasso', 'gradle', 'library' ]
---
### If you want to read this post in English,
Please click **[HERE]({{ site.baseurl }}{% link _posts/2017-01-16-how-to-use-picasso-eng.md %})**. But I am unsure as to weather it is grammatically correct. **LUL**

## Picasso 사용법

### 설치하기

Android Studio의 Gradle Scripts – build.gradle (Module: app)에 들어갑니다.

```gradle
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:25.1.0'
    testCompile 'junit:junit:4.12'
    // 여기입니다!!
}
```

위의 코드에, 아래의 코드 한 줄을 추가해줍시다.

```gradle
compile 'com.squareup.picasso:picasso:2.5.2'
```

이제 사용할 수 있습니다. (Sync Now를 눌러줍시다.)

### 사용하기

딱히 Picasso는 설명이 필요없어 보이는 라이브러리 입니다. ~~Reactive Programming의 장점이죠.~~ 예시코드로 살펴보죠.

```java
ImageView imageView = (ImageView) findViewById(R.id.imageView);
Picasso.with(this)
.load("https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png")
.into(imageView);
```

Picasso(Reactive Programming)는 3부분으로 이루어져있습니다. Input, Operator, Output 이렇게 3가지 말입니다.
Picasso에서의 Input은 with(Context) Method로 이루어져있습니다. Context 객체를 잘 넣어주시면 됩니다. 간단합니다.
Picasso에서 Output은 이미지를 보여주고 싶은 ImageView 객체를 지정해주면 됩니다.
중요한 건 Operator 부분입니다. Picasso에서의 Operator는 많은 Method로 이루어질 수 있습니다. 예를 들면, 이렇게 말입니다.

```java
Picasso.with(context) // Input 부분
    .load(url) // Operator 시작: URL에서 이미지를 불러옵니다.
    .placeholder(R.drawable.user_placeholder) // 불러오는 시간 동안 보여줄 이미지 파일입니다.
    .error(R.drawable.user_placeholder_error) // 불러오지 못하면 보여주는 이미지 파일입니다.
    .resize(100, 100) // 이미지의 크기를 100x100 사이즈로 리사이즈 해줍니다.
    .rotate(90f) // 사진 파일을 회전해줍시다. Operator 끝났습니다.
    .into(imageView); // Output 부분: 변수 이름을 imageView라고 지정한 ImageView에 이미지를 보여줍니다.
```

참 쉽죠? 정말 복잡한 과정을 간단하게 알아서 해주는 똑똑한 라이브러리 Picasso 였습니다.


<br><br><br>
이전 글: [Android - Picasso란?]({{ site.baseurl }}{% link _posts/2017-01-15-what-is-picasso-in-android-kor.md %})
<br><br><br>
