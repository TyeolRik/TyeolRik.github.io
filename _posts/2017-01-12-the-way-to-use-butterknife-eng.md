---
layout: post
title: Android - The Way to Use ButterKnife [ENG]
section-type: post
category: Android
tags: [ 'english', 'android', 'butterknife', 'gradle' ]
---
### 본 문서를 한국어로 읽고 싶으신가요?
**[여기]({{ site.baseurl }}{% link _posts/2017-01-12-the-way-to-use-butterknife-kor.md %})**를 클릭하세요. 영어를 잘 못하므로 한국어로 읽는 것을 추천드립니다! **LUL**

## ButterKnife 사용법

First, If the following codes are coded in your gradle,

```java
apply plugin: 'com.android.library'
```

you should use R2 instead of R when using ButterKnife. However, It doesn't matter whether you use R or R2 when you are coding normal Boilerplate, which means the methods, findViewById. (I don't know why this works.)
In this post, I will use R2 to show you difference between normal Boilerplate and ButterKnife.

### 1. No findViewById!

You may code like the following before.

```java
TextView textView1;
textView1 = (TextView) findViewById(R.id.textView1);
```

You might use findViewById millions times. It is really annoying works to people who are newbie like me. ~~I don't know whether I am paranoid but,~~ I tried to make variable name same as id. However, I forgot the name of id when I open the java files after working xml files.
But, if you use ButterKnife,

```java
// Declare views with ButterKnife.
public class MainActivity extends AppCompatActivity {
    @BindView(R2.id.textView2) TextView textView2;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        textView2.setText("Hello World!");
    }
}
```

top java codes becomes above java codes. You might think there is no difference but, it is really convenient to people who wants to make same name because you write id name first with Android studio's assistance and set variable's name. And also, if there are lots of variable not just one, more convenient!

I heard that you could manage resources efficiently, loading views by using ButterKnife. Because ButterKnife words at compile time so, your app won't be slow and efficiently search resources when app finds view or listener.  (It happens when there is a lot of developer in one project because variable names are various.. Yes, this is JOKE LUL)

### 2. Convenience of Event Listener

What did you do before, for using OnClickListener?

```java
button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(getApplicationContext(), "Hello World!", Toast.LENGTH_SHORT).show();
            }
        });
```

As above codes, we usually make new OnClickListener as a parameter for setOnClickListener. Or we could add method name at the properties of xml files. However, there is no bothersome and codes are more intuitive, using ButterKnife.

```java
public class MainActivity extends AppCompatActivity {
    @BindView(R2.id.button) Button button;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
    }
    @OnClick(R2.id.button)
    public void popUpToast() {
        Toast.makeText(getApplicationContext(), "Hello World!", Toast.LENGTH_SHORT).show();
    }
}
```

You can set onClickListener at @OnClick(R2.id.button), annotation. And also, you can group views and make codes more intuitive. I will tell you fourth chapter in details.

### 3. You can manage resources easily.

```java
class MainActivity extends Activity {
	@BindString(R2.string.title) String title;
	@BindDrawable(R2.drawable.graphic) Drawable drawable;
	@BindColor(R2.color.red)int red;
	@BindDimen(R2.dimen.spacer) float spacer;
}
```

You can get property of Activity like this way.

### 4. Grouping views.

I think this is the most marvelous part of ButterKnife.

```java
@BindView(R2.id.button) Button button;
@BindView(R2.id.button2) Button button2;
@OnClick({R2.id.button, R2.id.button2})
public void popUpToast() {
    Toast.makeText(getApplicationContext(), "Hello World!", Toast.LENGTH_SHORT).show();
}
```

button and button2 execute same method. Newbie programmer like me often changes plan during building projects. There is lots of annoying things when modifying button made of Anonymous class or making other button do same action. But, if you use grouping system of ButterKnife, code would be easy and intuitive. And also, when there are lots of button which work simple function, new world will open after using it with if(view.getId() == id).

And, you can modify all property of view at a time by grouping views.

```java
@BindViews({ R2.id.button, R2.id.button2 })
List<Button> nameViews;
ButterKnife.apply(nameViews, View.ALPHA, 0.0f);
```

You can modify transparency at one go by grouping views with list like above codes. Outside of that, there are lots of handy function, which can make you modify properties, in ButterKnife.apply method.<br><br><br>

Previous post: [Android - ButterKnife EASY Installation/Instructions]({{ site.baseurl }}{% link _posts/2017-01-11-how-to-download-butterknife-eng.md %})
<br><br><br>
