---
layout: post
title: Android - ButterKnife 설치방법 [KOR]
section-type: post
category: Android
tags: [ 'korean', 'android', 'butterknife', 'gradle' ]
---
### If you want to read this post in English,
Please click **[HERE]({{ site.baseurl }}{% link _posts/2017-01-11-how-to-download-butterknife-eng.md %})**. But I am unsure as to weather it is grammatically correct. **LUL**

## ButterKnife?

관용 코드 대신 Annotation을 사용할 수 있게 하는 라이브러리 입니다. ~~사실 저도 알게된지 얼마 안돼서....~~

```java
TextView textView = (TextView) findViewById(R.id.textView);
Button button = (Button) findViewById(R.id.button);

textView.setText("New TEXT");
button.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        // 버튼을 누르면 간단하게 반응하라고!
        Toast.makeText(getApplicationContext(), "Button 1st", Toast.LENGTH_LONG).show();
        }
    });
```

라고 지금까지 써오셨을 겁니다. 안드로이드 개발 경력이 오래된 사람이라면 아마.. findViewById Method를 수만 번 사용하셨을 겁니다. 그런데, ButterKnife 라이브러리를 사용하면, 다음과 같이 직관적인 코드로 변합니다! ~~절대 광고 아닙니다.. 저는 광고할 능력이..~~

```java
@BindView(R.id.button)
Button button;

@BindView(R.id.textView)
TextView textView;

@OnClick(R.id.button)
void onClickMethod() {
    Toast.makeText(getApplicationContext(), "Button 1st", Toast.LENGTH_LONG).show();
}
```

이게 뭐가 대단하냐구요?

```java
@OnClick(R.id.button, R.id.button2, R.id.button3) // 많은 button의 OnClick 함수를 동시에 제어
void onClickMethod() {
    Toast.makeText(getApplicationContext(), "Clicked", Toast.LENGTH_LONG).show();
}
```

이렇게 OnClick Annotation 뒤에 id를 나열해주면 동일 함수를 여러번 사용하게 해줄 수 있습니다! 물론, xml에서 일일이 함수를 지정해주면 되지만, 그런 수고로움(?)을 줄여주는 마법같은 라이브러리입니다. <br>

## 어떻게 사용하나요?

### 설명에 사용된 시스템

IDE: Android Studio 2.2.3  
ButterKnife: ButterKnife 8.4.0 (2017-01-11 최신)
OS: Windows 7 (64Bits)

### 다운로드 방법

간단합니다! build.gradle에 단, 3줄만 수정해주면 사용할 수 있으니깐요. 아-주 상세히 설명할테니, 초등학생이라도 할 수 있습니다. 새로운 프로젝트로 설명을 시작하겠습니다. (지금 작업하는 프로젝트에도 적용할 수 있습니다.)

#### 1. **새로운 프로젝트를 하나 만들어줍시다**
Android Studio - **New Project**(좌측 상단 File - New - New Project) - Application Name: ButterKnife ~~Company Domain이나 location은 취향에 따라 알아서 하세요. 초보자면 건들지 않는게 정신건강에 좋습니다.~~ - **Next** - Minimum SDK: API 10 ~~큰 의미는 없는데 그냥 모든 기기에서 사용해보라고 아주 옛날 버전을 선택~~ - **Next** - Empty Activity - **Next** - **Finish**

#### 2. **Gradle을 수정해줍시다**
만들어진 새 ButterKnife Project 창은 잠시 내려주고 [ButterKnife-GitHub][b0cc7986] 들어갑시다. 수많은 영어와 알지 못하는 파일들이 있지만 일단 무시하고 아래로 스크롤를 내리면 **README.md**, Butter Knife 라는 글자와 공식마크 ~~버터가 안드로이드 모양~~ 가 보입니다. 더 내려가면 **Download**라는 글자가 있을겁니다. 그곳을 주시하세요!

{% highlight java %}
dependencies {
    compile 'com.jakewharton:butterknife:8.4.0'
    annotationProcessor 'com.jakewharton:butterknife-compiler:8.4.0'
}
{% endhighlight java %}

라고 적혀있는데, 뭔 소린지 처음에는 모르실겁니다. ~~제가 그래서 겁나 헤맸거든요..~~ 일단 여기까지 왔으면, dependencies안에 있는 두 줄을 복사하고, 창은 잠시 최소화 해두고, 다시 Android Studio의 아까 만든 켜줍시다.  
좌측에 1-Project를 누르면 app 폴더와 Gradle Scripts~~초록구글 같이 생김~~라는 디렉토리들이 있죠? Gradle Scripts - **build.gradle (Module: app)** 을 열어봅시다. 

  [b0cc7986]: https://github.com/JakeWharton/butterknife "ButterKnife - Github"

{% highlight gradle %}
apply plugin: 'com.android.application'

// 중간 코드는 과감히 생략합니다.

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:25.1.0'
    testCompile 'junit:junit:4.12'
    compile 'com.jakewharton:butterknife:8.4.0' // 이 자리입니다!
    annotationProcessor 'com.jakewharton:butterknife-compiler:8.4.0' // 이 자리입니다!
}
{% endhighlight gradle %}

다음과 같은 코드들이 적혀있을 거예요. ~~위의 코드에서 보셨듯이 중간 코드는 과감히 생략했습니다.~~ **이 자리입니다!**라고 주석을 달아놓은 곳에 위에서 언급한 ButterKnife Readme에 있는 ~~아까 복사한~~ **Download**의 dependencies 안의 두 줄을 복사해서 붙여넣기 합시다. 만약, Gradle이 변경되었다고 위에 파란줄과 함께 Sync Now라는 창이 나오면 그냥 Sync Now 눌러주고 일단 넘어갑시다. 오류창이 나도 일단 무시하세요. (저의 경우에는 에러가 안 나왔습니다.)

다시 아까 [ButterKnife-GitHub][b0cc7986] 창을 열어봅시다. 아까 봤던 **Download** 밑에 **Library projects**라고 있죠? 

{% highlight gradle %}
buildscript {
  repositories {
    mavenCentral()
   }
  dependencies {
    classpath 'com.jakewharton:butterknife-gradle-plugin:8.4.0'
  }
}
{% endhighlight gradle %}

라고 적혀있을텐데,

{% highlight java %}
classpath 'com.jakewharton:butterknife-gradle-plugin:8.4.0'
{% endhighlight java %}

이 문장을 복사해줍시다. 그리고, Android Studio를 켜서 Gradle Scripts - build.gradle (Project: ButterKnife) 를 열어줍시다. ~~더블클릭~~ 

{% highlight gradle %}
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.3'
        // 이 자리입니다!
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
{% endhighlight gradle %}

라고 적힌 곳의 dependencies 밑에 붙여줍시다. ~~주석표시 된 곳에 붙이면 됩니다.~~ 마찬가지로 Sync Now가 뜨면 해줍시다.

마지막 하나 남았습니다. 여기까지 했으면 오류없이 잘 되는 사람도 있고, 안 되는 사람이 있을 텐데요. 만약 오류가 뜬다면, 아까 들어갔던 Gradle Scripts - **build.gradle (Module: app)**에 들어갑시다.

제일 첫 줄에 아마 다음과 같은 코드가 있을겁니다.

{% highlight java %}
apply plugin: 'com.android.application'
{% endhighlight java %}

이 밑에 한 줄을 추가합시다! 다음의 코드처럼요!

{% highlight java %}
apply plugin: 'com.android.application'
apply plugin: 'com.jakewharton.butterknife'
{% endhighlight java %}

그러면 사용할 준비가 다 됐습니다. ~~이러면 저는 되더라구요..~~

만약 오류가 생긴다면, Gradle Scripts - **build.gradle (Module: app)** 의

{% highlight java %}
apply plugin: 'com.android.application'
{% endhighlight java %}

대신에

{% highlight java %}
apply plugin: 'com.android.library'
{% endhighlight java %}

로 바꿔보세요! ~~원문은 apply plugin: 'com.android.library'로 할 것을 권하고 있습니다.~~ <br><br><br>


<br><br><br>
