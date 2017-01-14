---
layout: post
title: Android - ButterKnife 사용법 [KOR]
section-type: post
category: Android
tags: [ 'korean', 'android', 'butterknife', 'gradle' ]
---
### If you want to read this post in English,
Please click **[HERE]({{ site.baseurl }}{% link _posts/2017-01-12-the-way-to-use-butterknife-eng.md %})**. But I am unsure as to weather it is grammatically correct. **LUL**

## ButterKnife 사용법

일단 먼저, 자기 Gradle Scripts에

```java
apply plugin: 'com.android.library'
```

라고 되어있다면, ButterKnife를 사용할 때는 R 대신에 R2를 사용해야합니다. 일반적인 boilerplate 문(findViewById)을 사용할 때는 R을 쓰든 R2를 쓰든 상관 없습니다. (왜 그런지는 모르겠습니다만..)
이 글은 일반적인 Boilerplate문과 ButterKnife 사이의 차이를 명확히 보여주기 위해서 R2로 표현하겠습니다.

### 1. findViewById가 없다!

기존에는 다음과 같은 코드를 작성했을 것입니다. 

```java
TextView textView1;
textView1 = (TextView) findViewById(R.id.textView1);
```

findViewById를 수만 번은 사용하셨겠지요. 저같은 초보 개발자에게는 좀 짜증나는 경우가 있습니다. ~~강박인지 모르겠지만~~ TextView 객체의 변수명과 id의 이름을 같게 하려고 노력하는데, xml 파일에서 열심히 작성해놓고서는 java 파일로 들어오면 id의 이름을 까먹거든요..
그런데, ButterKnife를 사용한다면!

```java
// ButterKnife를 이용해서 View 선언
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

가 됩니다. 별 차이가 없을 것 같지만, findViewById 메소드를 작성할 때에 id 값을 먼저 작성하고, 변수 이름을 설정하게 되므로 저같이 변수이름과 id를 같게 하는 사람에게는 매우 편리합니다. 또한, 변수가 위의 코드처럼 1개가 아니라 여러 개가 된다면, 훨씬 더 편리하겠죠!

ButterKnife를 사용해서 View를 불러온다면, 효율적인 자원관리가 가능해진다고 합니다. ButterKnife는 컴파일 타임에서 작동하기 때문에 앱이 느려질 염려도 없으며, 뷰를 찾거나 리스너를 찾을 때의 자원 검색도 효율적으로 일어나게 됩니다. (한 프로젝트에 개발자가 많이 있으면 이런 현상이 일어난다고 하는군요.)

### 2. Event Listener의 편이

기존에 OnClickListener를 사용하려면 어떻게 했나요?

```java
button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(getApplicationContext(), "Hello World!", Toast.LENGTH_SHORT).show();
            }
        });
```

위의 코드처럼 보통은 setOnClickListener 메소드로 OnClickListener를 매개변수로 해서 사용합니다. 또는, xml 파일에서 속성값으로 onClick에 메소드 이름을 넣거나 하는 방식으로 할 수 있는데, ButterKnife를 사용하면, 그런 귀찮음도 없고 코드가 훨씬 직관적으로 변합니다.

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

@OnClick(R2.id.button)에서 onClickListener를 설정할 수 있습니다! 또한, ButterKnife에서는 뷰를 그룹으로 묶을 수 있기 때문에 좀더 직관적인 코드를 사용할 수 있습니다. 이 부분은 다음 챕터에서 다시 설명하겠습니다.

### 3. 자원을 관리하기 수월합니다.

```java
class MainActivity extends Activity {
	@BindString(R2.string.title) String title;
	@BindDrawable(R2.drawable.graphic) Drawable drawable;
	@BindColor(R2.color.red)int red;
	@BindDimen(R2.dimen.spacer) float spacer;
}
```

이런 식으로 Activity의 Property로 가져올 수 있습니다.

### 4. 뷰의 그룹화

이게 제가 생각하는 신세계가 아닌가 싶습니다.

```java
@BindView(R2.id.button) Button button;
@BindView(R2.id.button2) Button button2;
@OnClick({R2.id.button, R2.id.button2})
public void popUpToast() {
    Toast.makeText(getApplicationContext(), "Hello World!", Toast.LENGTH_SHORT).show();
}
```

이렇게 작성되면 button와 button2에서 공통된 메소드를 실행하게 됩니다. 저같은 초보 개발자는 제작하면서 기획을 수정하는 경우가 많은데, 익명 클래스(new onClickListener())로 만들어진 버튼을 수정한다던가, 다른 버튼도 같은 기능을 수행하도록 하고 싶을 때 귀찮은 경우가 많아집니다. 그런데, 이렇게 ButterKnife의 그룹화를 사용하면 매우 직관적이고 편리해집니다. 만약, 단순한 기능을 하는 버튼이 있을 때, if(view.getId()==id)와 함께 연동해서 사용한다면 더욱 신세계가 펼쳐집니다.

또한, View를 그룹화하는 것으로 모든 View에 Property(속성)를 한 번에 적용할 수 있습니다.

```java
@BindViews({ R2.id.button, R2.id.button2 })
List<Button> nameViews;
ButterKnife.apply(nameViews, View.ALPHA, 0.0f);
```

이렇게 사용하면, View들을 리스트로 묶어버려서 한 번에 투명도를 설정할 수 있습니다. 그 외에도 ButterKnife.apply 메소드를 사용해서 속성을 한 번에 적용할 수 있는 편리한 기능이 있습니다.<br><br><br>

이전 글: [Android - ButterKnife 설치방법]({{ site.baseurl }}{% link _posts/2017-01-11-how-to-download-butterknife-kor.md %})
<br><br><br>
