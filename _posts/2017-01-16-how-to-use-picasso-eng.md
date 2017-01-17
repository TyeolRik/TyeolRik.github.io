---
layout: post
title: Android - How to use Picasso? [ENG]
section-type: post
category: Android
tags: [ 'english', 'android', 'picasso', 'gradle', 'library' ]
---
### 본 문서를 한국어로 읽고 싶으신가요?
**[여기]({{ site.baseurl }}{% link _posts/2017-01-16-how-to-use-picasso-kor.md %})**를 클릭하세요. 영어를 잘 못하므로 한국어로 읽는 것을 추천드립니다! **LUL**

## The way to use Picasso

### Install

Open Android Studio - Gradle Scripts - build.gradle (Module: app)

```gradle
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:25.1.0'
    testCompile 'junit:junit:4.12'
    // Right here!!
}
```

In above codes, add a following single line.

```gradle
compile 'com.squareup.picasso:picasso:2.5.2'
```

Now you can use it. (Please press the button, named Sync Now)

### Instructions

Picasso is a library which has no need to explain. ~~This is the advantage of Reactive Programming.~~ Let's look around with example codes

```java
ImageView imageView = (ImageView) findViewById(R.id.imageView);
Picasso.with(this)
.load("https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png")
.into(imageView);
```

Picasso(Reactive Programming)is mainly composed of 3 parts. Input, Operator and Output.
The input of Picasso consists of Method which name is 'with(Context).' The only thing you have to do is just insert proper Context object. Simple!
The Output of Picasso is setting ImageView object where you want to show image.
The most important part is Operator. Operator can be composed of lots of Methods. For example, like this!

```java
Picasso.with(context) // Input
    .load(url) // Operator Begin: Load image from URL
    .placeholder(R.drawable.user_placeholder) // Image file that is shown during loading time.
    .error(R.drawable.user_placeholder_error) // Image file that is shown when loading is failed.
    .resize(100, 100) // Resize image to 100 x 100
    .rotate(90f) // Rotate Image file. Operator End.
    .into(imageView); // Output: Show image at the ImageView whose variable name is imageView.
```

Quite simple isn't it? This is smart library which does complex process itself.


<br><br><br>
Previous post: [Android - Picasso?]({{ site.baseurl }}{% link _posts/2017-01-15-what-is-picasso-in-android-eng.md %})
<br><br><br>
