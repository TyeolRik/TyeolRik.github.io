---
layout: post
title: "[Java] Redirect 된 URL의 실제 주소 찾기"
section-type: post
category: "Android"
tags:
  - java
  - http
  - redirect
  - url
---

핸드폰으로 바코드, QR코드 등을 인식할 수 있는 어플들이 세상에 수없이 많다. 그것을 이용해서 나만의 어플을 만들어야할 경우도 종종 생긴다. 구글에서는 이런 문제를 해결하기 위해서[ Google Mobile Vision](https://developers.google.com/vision/)이라는 API를 제공하고 있다. 이번 글은 Google Mobile Vision API를 사용하는 방법에 대해서 알아보도록 하겠다.

예제에서 사용된 코드 전문은 [Github](https://github.com/TyeolRik/BarcodeScanTest)에 있으니 참고바란다.

## Google Mobile Vision

> Find objects in photos and video, using real-time on-device vision technology.
> <br/>기기에서의 실시간 영상 기술을 이용해서 사진이나 동영상 속의 물체를 찾는 것

위에서 모든 설명이 나와 있지만 다시 한번 말하자면, 실시간으로 사진이나 물체 속의 목표물(?)을 쉽게 인식할 수 있다. ~~그만큼 쿼리가 빠르다고 이해하면 될 것 같다.~~ 아쉬운 점은 아무래도 내가 **문서** 라는 것에 익숙치가 않아서 그런지 사용법을 몰라서 한참 해맸다. 아, 물론 Github에 [Code sample](https://github.com/googlesamples/android-vision)이 있어서 한참 들여다보니 사용할 수는 있었다. 좀더 좋은 방법이나 구글이 원하는(?) 방법을 알고싶다면 Sample 링크에 들어가서 확인해보는 것이 정신건강에 더 유익할 것이라고 생각된다.

### 인식가능한 바코드 종류

우리가 이번에 사용할 것은 [BarcodeDetector](https://developers.google.com/android/reference/com/google/android/gms/vision/barcode/BarcodeDetector) 라는 부분이다. 여기서 설명하는 사용 가능한 종류는 다음과 같다.

- [AZTEC](https://en.wikipedia.org/wiki/Aztec_Code)
- [CODE_128](https://en.wikipedia.org/wiki/Code_128)
- [CODE_39](https://en.wikipedia.org/wiki/Code_39)
- [CODE_93](https://en.wikipedia.org/wiki/Code_93)
- [CODABAR](https://en.wikipedia.org/wiki/Codabar)
- [DATA_MATRIX](https://en.wikipedia.org/wiki/Data_Matrix)
- [EAN_13](https://en.wikipedia.org/wiki/International_Article_Number)
- [EAN_8](https://en.wikipedia.org/wiki/EAN-8)
- [ITF](https://en.wikipedia.org/wiki/Interleaved_2_of_5)
- [PDF417](https://en.wikipedia.org/wiki/PDF417)
- [QR_CODE](https://en.wikipedia.org/wiki/QR_code)
- [UPC_A](https://en.wikipedia.org/wiki/Universal_Product_Code)
- [UPC_E](https://en.wikipedia.org/wiki/Universal_Product_Code#UPC-E)

난 바코드가 2종류(상품 뒤에 있는 일반적인 바코드, QR코드) 밖에 없는 줄 알았는데 그 일반적인 바코드가 수많은 바코드 종류 중에 하나인 EAN_13이라는 사실을 새롭게 알게 되었다. 일단 바코드 종류가 겁나겁나게 많다. 그걸 하나하나 구분하는 Google Mobile Vision API가 대단하다.

### API 사용하기

#### layout

실시간 카메라를 사용하기 위해서는 즉각적인 화면의 전환이 필요하고 이는 즉, SurfaceView가 필요함을 알 수 있다. 고로 layout에 SurfaceView를 추가해주자. 다음은 예제의 layout 파일이다.

<code>activity_main.xml</code>

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:theme="@style/AppTheme"
    tools:context="io.github.tyeolrik.barcodescantest.MainActivity">

    <Button
        android:id="@+id/startButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginEnd="8dp"
        android:layout_marginStart="8dp"
        android:layout_marginTop="180dp"
        android:text="Start"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</android.support.constraint.ConstraintLayout>
```

<code>activity_qrcode_scan.xml</code>

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="io.github.tyeolrik.barcodescantest.MainActivity">

    <SurfaceView
        android:id="@+id/cameraSurface"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</android.support.constraint.ConstraintLayout>
```

굳이 2개의 xml을 이용한 이유는 1개의 Activity를 이용해서 간단하게 Camera 권한을 얻고, Mobile Vision API를 SurfaceView와 연결하는 예제를 만드려고 했으나, 앱을 처음 실행할 때 카메라 권한 문제 때문에 SurfaceView가 제대로 callback 함수를 수행하지 못하는 버그가 생겨서 그냥 속편하게(?) Activity를 2개로 만들었다. 실제로 다른 앱을 만들 때, 일반적으로 권한은 [SplashActivity](https://en.wikipedia.org/wiki/Splash_screen)나 ~~기술적으로는 아무 작업도 하지 않는~~ 첫 Acitivity에서 획득하기 때문에 그냥, 예제에서도 그러한 맥락으로 2개의 Activity를 만들었다.

#### gradle

어떤 프로그램이든 API를 사용하기 위해서는 라이브러리를 import 해야한다. 이에 대한 자세한 사항은 다음의 [링크](https://developers.google.com/android/guides/setup)를 따라가서 확인하기 바란다.

일단 SDK를 사용하기 위해서 필요한 기기의 요구사항은 다음과 같다.

- 4.0 버전(Icecream Sandwich) 이상, 구글 플레이스토어가 있어야함.
- 또는, 가상기기(AVD)를 사용한다면 4.2.2 버전 이상부터 가능

![Imgur](https://i.imgur.com/cqMkydG.png)

구글 [Dashboard](https://developer.android.com/about/dashboards/index.html)에서 발췌하였다. 하드웨어 상 안드로이드 4.3 이상은 93.7%를 차지하기 때문에 대부분의 기종에서는 다 돌아갈 것이다. ~~심지어 한국은... 핸드폰 선진국이니깐..~~

<code>build.gradle (Module: app)</code>

```groovy
dependencies {
    
    // ... 중간생략
    
    // Google Mobile Vision API 사용
    implementation 'com.google.android.gms:play-services-vision:11.6.2'
}
```

위와 같이 ```'com.google.android.gms:play-services-vision:11.6.2'```를 implementation하거나 compile 하면 된다. Android Studio 3.0 이후부터 gradle build 속도를 이유로 implementation을 권장하는 바이다. ~~구체적으로는 implementation과 compile은 서로 다르다.~~

#### play-services를 가져오면 안되나요?

여러 개발자들의 블로그 포스트를 읽어보면 ```com.google.android.gms:play-services```를 implementation(또는 compile) 하는 경우가 있다. 물론, 작동은 잘 된다. 그러나, 구글은 공식적으로 위와 같은 코드를 사용하는 것을 **지양** 하고 있다. 다음은 이에 대한 공식 홈페이지에서의 설명이다.

> Don't use the combined play-services target. It brings in dozens of libraries, bloating your application. Instead, specify only the specific Google Play services APIs your app uses.
> <br/>play-services 전체(묶음)를 가져오지 마세요. 그것은 수많은 라이브러리를 가지고 있고, 당신의 앱을 부풀립니다. 대신에 당신의 앱에서 사용하는 특정한 Google Play services API를 구체적으로 명시하세요.

즉, play-services는 수많은 API의 묶음으로 되어 있기 때문에 본 앱에 필요하지 않는 것들도 같이 가져오게 된다는 것이다. 고로, 앱의 크기는 커질 수 밖에 없고, 속도는 느려진다는 것이다. 고로, 우리는 본 앱에서 사용할 Google Mobile Vision API 인 ```com.google.android.gms:play-services-vision```만 가져오자.

#### 카메라 권한 얻기

Android에서 카메라를 사용하기 위해서는 권한이 필요하다. 권한을 얻기 위해서는 Manifest에서도 카메라를 사용한다고 명시하여야 하고, Code 상에서는 사용자에게 직접적으로 권한 획득을 받아야한다. API 22(Android 5.1)이하에서는 설치할 때 권한을, API 23(Android 6.0)이상에서는 실행할 때 권한을 획득하여야 한다.

<code>AndroidManifest.xml</code>

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="io.github.tyeolrik.barcodescantest">

    <!-- CAMERA 사용권한 획득 -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.hardware.camera.autofocus" />

    <!-- 카메라 권한 사용 -->
    <uses-feature android:name="android.hardware.camera" />

    <application>
        ... 중간 생략
    </application>
</manifest>
```

위의 코드 처럼 Manifest에서 권한을 명시한다. 그리고 java 코드상에서 카메라 권한을 획득하자.

<code>MainActivity.java</code>

```java
private boolean getCameraPermission() {
    if(ContextCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
        return true;
    } else {
        // 권한이 왜 필요한지 설명이 필요한가?
        if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                android.Manifest.permission.CAMERA)) {
            Toast.makeText(this, "카메라 사용을 위해 확인버튼을 눌러주세요!", Toast.LENGTH_SHORT).show();
            return true;
        } else {
            // 설명이 필요하지 않음.
            ActivityCompat.requestPermissions(this,
                    new String[]{android.Manifest.permission.CAMERA},
                    CAMERA_PERMISSIONS_GRANTED);
            return true;
        }
    }
}
```

코드를 좀더 직관적으로 볼 수 있도록 권한을 얻는 부분을 아예 함수로 새로 짜봤다. ```getCameraPermission()``` 함수를 실행하면 권한을 물어보는 대화상자가 뜬다.

### Code

<code>MainActivity.java</code>는 위에서 언급한 ```getCameraPermission()```을 호출하고, Intent를 이용하여 다음 Activity를 실행하는 역할만 수행하므로 코드는 생략하겠다.

<code>QRCodeScan.java</code>

```java
public class QRCodeScan extends Activity {

    CameraSource cameraSource;
    SurfaceView cameraSurface;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qrcode_scan);

        cameraSurface = (SurfaceView) findViewById(R.id.cameraSurface); // SurfaceView 선언 :: Boilerplate

        BarcodeDetector barcodeDetector = new BarcodeDetector.Builder(this)
                .setBarcodeFormats(Barcode.QR_CODE) // QR_CODE로 설정하면 좀더 빠르게 인식할 수 있습니다.
                .build();
        Log.d("NowStatus", "BarcodeDetector Build Complete");

        cameraSource = new CameraSource
                .Builder(this, barcodeDetector)
                .setFacing(CameraSource.CAMERA_FACING_BACK)
                .setRequestedFps(29.8f) // 프레임 높을 수록 리소스를 많이 먹겠죠
                .setRequestedPreviewSize(1080, 1920)    // 확실한 용도를 잘 모르겠음. 필자는 핸드폰 크기로 설정
                .setAutoFocusEnabled(true)  // AutoFocus를 안하면 초점을 못 잡아서 화질이 많이 흐립니다.
                .build();
        Log.d("NowStatus", "CameraSource Build Complete");

        // Callback을 이용해서 SurfaceView를 실시간으로 Mobile Vision API와 연결
        cameraSurface.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                try {   // try-catch 문은 Camera 권한획득을 위한 권장사항
                    if (ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.CAMERA) 
                                == PackageManager.PERMISSION_GRANTED) {
                        cameraSource.start(cameraSurface.getHolder());  // Mobile Vision API 시작
                        return;
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                cameraSource.stop();    // SurfaceView가 종료되었을 때, Mobile Vision API 종료
                Log.d("NowStatus", "SurfaceView Destroyed and CameraSource Stopped");
            }
        });

        barcodeDetector.setProcessor(new Detector.Processor<Barcode>() {
            @Override
            public void release() {
                Log.d("NowStatus", "BarcodeDetector SetProcessor Released");
            }

            @Override
            public void receiveDetections(Detector.Detections<Barcode> detections) {
                // 바코드가 인식되었을 때 무슨 일을 할까?
                final SparseArray<Barcode> barcodes = detections.getDetectedItems();
                if(barcodes.size() != 0) {
                    String barcodeContents = barcodes.valueAt(0).displayValue; // 바코드 인식 결과물
                    Log.d("Detection", barcodeContents);
                }
            }
        });
    }
}

```

여기서 핵심은 ```getHolder().addCallback``` 함수를 통해서 SurfaceView와 CameraSource를 연결하는 것이다. 그리고 ```barcodeDetector.setProcessor()``` 함수 내의 ```receiveDetections()``` 함수를 통해서 이벤트로 바코드를 인식할 때마다 어떤 작업을 수행할지를 명령할 수 있다. 단, 인식하는 속도(?)가 겁나겁나 빠르기 때문에 (프레임 수만큼 된다. 위의 예제에서는 29.8fps로 설정했기 때문에 초당 29번 함수가 호출된다.) 본인이 편리한 적절한 방법으로 코드를 사용하면 된다.

### 실행화면

![Imgur](https://i.imgur.com/3hC3IGs.png)

처음에 Start를 누르기 전에 권한 요청 대화상자가 뜬다. Start를 누르면 다음 화면(오른쪽)으로 넘어가는데 멈춰있는 사진이 아니라 화면이 카메라에 따라 계속적으로 바뀌고 있는 중이다. 다음과 같이 QR코드가 조금 가려져있어도 인식은 겁나 잘된다. ~~어떻게 가능한건지는 모르겠지만 그것또한 기술력이겠지..~~

![Imgur](https://i.imgur.com/iW8ZAqz.png)

필자는 인식이 되면 ```Log.d("Detection", barcodeContents);``` 를 통해서 인식된 바코드의 내용을 출력하도록 했는데, 위의 사진처럼 겁나겁나 많이 뜬다. 이상으로 포스트를 마치겠다.

[Github에서 전체 코드 보기](https://github.com/TyeolRik/BarcodeScanTest)
