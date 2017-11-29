---
layout: post
title: "[Android] 에러: app:transformDexWithDexForRelease 해결"
section-type: post
category: "Android"
tags:
  - android
  - error
  - debug
---

처음으로 해보는 Generate Signed APK 에서 다음과 같은 상황이 나왔다. 일단, Java SE(TM)의 작동이 중지되었으며, 끝낼 것인지 또는 디버그 할 것인지에 대한 윈도우 대화상자가 나왔다. ~~캡쳐가 없다..~~ 그리고 Android studio의 Message 탭에서는 다음과 같은 에러가 나왔다.

>  app:transformDexWithDexForRelease ... 어쩌고 저쩌고 ...

### 해결방안

중국의 어느 [블로그](http://blog.csdn.net/monkin2011/article/details/78519953)에서 알게된 방법이다. ~~설명도 딱히 안 적혀있고 부족한 한자실력으로 대충 때려맞춘 거다.~~ 확실한 원인은 모르기 때문에 그냥.. 넘어가자.

다음과 같이 수정하면 된다.

<code>build.gradle(Module\:app)</code>

```gradle
android {
    ...
    defaultConfig {
        ...
        multiDexEnabled true
    }
}
```

defaultConfig에 multiDexEnabled 태그를 추가하고 true로 해주면 된다. 깔끔 해결 완료!
