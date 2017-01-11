---
layout: post
title: Android - ButterKnife EASY Installation/Instructions [ENG]
section-type: post
category: Android
tags: [ 'english', 'android', 'butterknife', 'gradle' ]
---
### 본 문서를 한국어로 읽고 싶으신가요?
**[여기]({{ site.baseurl }}{% link _posts/2017-01-11-how-to-download-butterknife-kor.md %})**를 클릭하세요. 영어를 잘 못하므로 한국어로 읽는 것을 추천드립니다! **LUL**

## ButterKnife?

It is android library that makes you be able to use Annotation instead of idiomatic  codes. ~~Actually, I've heard this recently....~~

```java
TextView textView = (TextView) findViewById(R.id.textView);
Button button = (Button) findViewById(R.id.button);

textView.setText("New TEXT");
button.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        // Reaction after pressing button.
        Toast.makeText(getApplicationContext(), "Button 1st", Toast.LENGTH_LONG).show();
        }
    });
```

You may have coded like this. If you have lots of experience in developing android, you might have used method, findViewById, about a million times. But, after you using ButterKnife library, it changes to intuitive codes. ~~This is absolutely not ads.~~

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

Almost same number of lines, nothing special?

```java
@OnClick(R.id.button, R.id.button2, R.id.button3) // You can control several buttons at once.
void onClickMethod() {
    Toast.makeText(getApplicationContext(), "Clicked", Toast.LENGTH_LONG).show();
}
```

As above codes, you can apply same functions(methods) by listing ids after OnClick Annotation. Of course, you can specify methods one by one but, this library relieves your painstaking. <br>

## How can I use it?

### System which is used in this post.

IDE: Android Studio 2.2.3  
ButterKnife: ButterKnife 8.4.0 (2017-01-11 Latest)
OS: Windows 7 (64Bits)

### How to download

Really easy! You can use it after modifying 3 lines in build.gradle. I will go into details, and you can do it even if you are 10 years old. Let me give you an explanation with new project. (You can apply your current project.)

#### 1. **Make New Project**
Android Studio - **New Project**(upper left corner, File - New - New Project) - Application Name: ButterKnife ~~You can choose Company Domain of Location what you like. If you are newbie of Android like me, do not touch it for your mental health LUL~~ - **Next** - Minimum SDK: API 10 ~~There is no meaning of this. If you choose API 10, all devices can use this project(Application)~~ - **Next** - Empty Activity - **Next** - **Finish**

#### 2. **Modify your gradle file**
Please minimize your New Project Windows and enter  [ButterKnife-GitHub][b0cc7986]. There is so many words and files that we don't know but, ignore them and scroll down. You can see **README.md**, Butter Knife Words and Official logo. ~~Butter looks like android.~~ Further scroll down, there would be the word, **Download**. Please keep an eye on it.

{% highlight java %}
dependencies {
    compile 'com.jakewharton:butterknife:8.4.0'
    annotationProcessor 'com.jakewharton:butterknife-compiler:8.4.0'
}
{% endhighlight java %}

You may have no idea, if you are newbie. ~~So, I was wandering. LUL~~ Copy two lines which is in depecdencies and minimize your browser and open Android Studio.  
Open Gradle Scripts - **build.gradle (Module: app)** which is in left side. (Press 1-Project and Go to Gradle Scripts, which has icon like green google LUL)

  [b0cc7986]: https://github.com/JakeWharton/butterknife "ButterKnife - Github"

{% highlight gradle %}
apply plugin: 'com.android.application'

// Skip the in-between codes

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
        exclude group: 'com.android.support', module: 'support-annotations'
    })
    compile 'com.android.support:appcompat-v7:25.1.0'
    testCompile 'junit:junit:4.12'
    compile 'com.jakewharton:butterknife:8.4.0' // This position!
    annotationProcessor 'com.jakewharton:butterknife-compiler:8.4.0' // This position!
}
{% endhighlight gradle %}

There is codes as above snippet. ~~As you can see, I skip some lines that means nothing in this post.~~ Please **copy and paste the two lines** that I mentioned above(ButterKnife Readme) **at the position where I comments out.** If blue lines pops up and says that 'Gradle is changed and needs to sync', just click Sync Now button. If there is error, ignore it. (In my case, there is no error.)

Please open internet browser, [ButterKnife-GitHub][b0cc7986] again. There is **Library projects** beneath **Download**.

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

In readme files, there is codes like above.

{% highlight java %}
classpath 'com.jakewharton:butterknife-gradle-plugin:8.4.0'
{% endhighlight java %}

Copy this line. And, Open Android Studio - Gradle Scripts - build.gradle (Project: ButterKnife)

{% highlight gradle %}
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.3'
        // This position!
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
{% endhighlight gradle %}

Paste the line beneath dependencies.  ~~You can paste at the position where I comment out.~~ Likewise, if there is Sync Now button, click it.

The last one is left. If you come this far, there is people who go well or not. If you have error, go to Gradle Scripts - **build.gradle (Module: app)**

There is code at the very first line like below snippet.

{% highlight java %}
apply plugin: 'com.android.application'
{% endhighlight java %}

Add one more line as below.

{% highlight java %}
apply plugin: 'com.android.application'
apply plugin: 'com.jakewharton.butterknife'
{% endhighlight java %}

Now, you are ready to use it. ~~According to my experience~~

If there is error, go to Gradle Scripts - **build.gradle (Module: app)** and swap

{% highlight java %}
apply plugin: 'com.android.application'
{% endhighlight java %}

to

{% highlight java %}
apply plugin: 'com.android.library'
{% endhighlight java %}

Official readme recommend you to use 'com.android.library' <br><br><br>


<br><br><br>
