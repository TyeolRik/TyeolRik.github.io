---
layout: post
title: "[HTML] Button onclick tag로 Javascript function이 동작하지 않는 이유"
section-type: post
category: HTML
tags:
  - button
  - javascript
  - html
  - onclick
---

재미있는 현상을 발견해서 오늘 하루종일 삽질한 내용에 대해서 간략하게 메모하고자 한다.

```js
// some_javascript_file.js
function customized_submit() {
  // ...
  form.submit();
}
```

```html
<!-- Declare HTML5 -->
<!DOCTYPE html>
<form>
  <input id="id"> <!-- 생략 --> </input>
  <input id="pw"> <!-- 생략 --> </input>
  <button id="someButton" name="someButton" onclick="customized_submit();">CLICK!</button>
</form>
```

뭐 대충 이런 코드가 있다고 할 때, ~~문법상 잘못된 코드일 수 있다. 단지 예시~~ button을 클릭하면 ```customized_submit()``` 함수가 작동될 것이라고 생각할 수 있다. 그러나, HTML5에서는 form tag 안에 둘러쌓인 button은 자동적으로 ```submit()```을 수행한다고 한다.

```html
<button type="button">Button</button>
```

으로 type을 명시해주면 ```onclick``` tag가 정상적으로 작동될 것으로 보인다.

<br>

[Referenced Link - W3C](https://www.w3.org/TR/2011/WD-html5-20110525/the-button-element.html#the-button-element)

<br><br><br>