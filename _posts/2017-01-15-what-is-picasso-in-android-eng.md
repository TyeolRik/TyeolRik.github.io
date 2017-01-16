---
layout: post
title: Android - Picasso? [ENG]
section-type: post
category: Android
tags: [ 'english', 'android', 'butterknife', 'gradle', 'library' ]
---
### 본 문서를 한국어로 읽고 싶으신가요?
**[여기]({{ site.baseurl }}{% link _posts/2017-01-15-what-is-picasso-in-android-kor.md %})**를 클릭하세요. 영어를 잘 못하므로 한국어로 읽는 것을 추천드립니다! **LUL**

## Picasso?

Picasso is open source library(software) developed by Square Inc. It is really intuitive because of Method Chain form. No one leaves room for questions about below codes.

```java
Picasso.with(this) // input
       .load(imageURL) // operators
       .into(imageView); // output
```

I think this is not a programming language but natural language(English). Picasso is library which is kind of Reactive Programming. Intuitive, and handy due to loading images in a line.

## Strong point

### 1. Intuitive.

Reactive Programming is made of 3 parts. Input → Operator → Output. You can understand without hardand complex thought.

### 2. Handy to load image from Network.

It makes HTTP requests automatically. You don't have to think that what pages are made of or how I can load pages. You don't have to worry about exceptions due to networking. Because we don't download images in Main Thread. There is no much cost to recall  because of image cashing.

### 3. Easy to edit image

You can crop, center, resize images easily. I will show you details in next post.



<br><br><br>
Next post: [Android - How to use Picasso?]({{ site.baseurl }}{% link _posts/2017-01-16-how-to-use-picasso-eng.md %})
<br><br><br>
