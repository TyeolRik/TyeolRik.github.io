---
layout: post
title: "[Android] SurfaceView 위에 ImageView 그리기"
section-type: post
category: "Android"
tags:
  - android
  - surfaceview
  - imageview
---

SurfaceView는 다른 View와는 좀 차별화된 Android의 특수한 View이다. SurfaceView는 일반적인 방법인 XML을 이용해서 열심히 Design을 수정해도 가장 마지막에 Rendering 되기 때문에 최상단에 표시된다. 그러나, 우리는 SurfaceView의 위에 여러 기능(ImageView, Button, Animation 등)을 표시해야할 때가 있다. 지금부터, 어떻게 해야 SurfaceView 위에 ImageView를 그릴 수 있는지를 알아보도록 하겠다.

### XML 파일

<code>activity_qrcode_scan.xml</code>

```xml
<RelativeLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/relativeLayoutInQRCode"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layout_margin="0dp"
    tools:context="io.github.tyeolrik.hangmanqrcode.QRCodeScan">

    <SurfaceView
        android:id="@+id/cameraSurfaceView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_margin="0dp"
        android:padding="0dp" />

    <ImageView
        android:id="@+id/cameraFocusQR"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:layout_margin="0dp"
        android:padding="0dp"
        android:src="@mipmap/camerafocus" />

</RelativeLayout>
```

RelativeLayout 을 Background로 사용했다. 확실히는 모르겠지만, RelativeLayout이 Z-Order를 이용해서 위아래를 표현할 수 있다고 한다.

![Imgur](https://i.imgur.com/v2IvPLH.png)

위 그림은 필자의 모니터에서 보이는 XML Design 화면이다. 참고!

### 코드

```java


ImageView cameraFocusQR;    // 내가 띄우고 싶은 ImageView
SurfaceView cameraSurfaceView;  // SurfaceView Layout과 연결된 변수
CameraSource cameraSource;  // 본 포스팅에서는 의미없음

protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qrcode_scan);
        
        // 중간에 여러 잡것 생략
        
        cameraSurfaceView.getHolder().addCallback(new SurfaceHolder.Callback() {

            @Override
            public void surfaceCreated(SurfaceHolder surfaceHolder) {
                try {
                    if (ActivityCompat.checkSelfPermission(thisContext, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        Log.d("Permission", "Granted");
                        cameraSource.start(cameraSurfaceView.getHolder());

                        cameraFocusQR.invalidate();

                        return;
                    }
                } catch (IOException ie) {
                    Log.e("CAMERA SOURCE", ie.getMessage());
                }
            }

            @Override
            public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
                cameraSource.stop();
                Log.d(nowStatusLogTag, "SurfaceView Destroyed and CameraSource Stopped");
            }
        });
    }
}
```

위 코드를 잘 보면, SurfaceView의 변수인 ```cameraSurfaceView```의 선언을 잘 보자. ```getHolder().addCallback()```에 필수적으로 들어가야하는 ```surfaceCreated()```, ```surfaceChanged()```, ```surfaceDestroyed()``` 3개의 함수가 있다. 여기서 주목해야할 부분은 ```surfaceCreated()```이다.

잡다한 것을 제외하고 자세히 살펴보자.

<code>surfaceCreated()</code>

```java
@Override
public void surfaceCreated(SurfaceHolder surfaceHolder) {
    cameraFocusQR.invalidate();
}    
```

cameraFocusQR 이라는 ImageView를 ```surfaceCreated()```에서 ```invalidate()``` 해줌으로써 다시 Rendering 해줬다. ~~확실하지는 않지만, invalidate() 함수가 다시 화면을 다시 렌더링 하는 것같다.~~
