---
layout: post
title: "[jekyll] Github Pages에 MathJax를 적용하는 과정에 대한 고찰"
section-type: post
category: jekyll
tags:
  - jekyll
  - kramdown
  - gfm
  - mathjax
---

이 글은 Github Pages에 MathJax를 적용하는 과정에서 일어난 일들에 대해서 알아보고 고찰한 내용에 대한 것이다.

## 문제상황

필자는 본 블로그를 5년째 운영하면서 부끄럽게도 유지보수를 거의 하지 않았다. 가끔 메일로 날아오는 Security Warning과 같은 문제에 대해서만 버전업 정도를 했을 뿐이다. 그런데 어느 날부터인가 MathJax (수학 Renderer?) 가 정상적으로 작동되지 않음을 발견하였다. 처음에는 cdn 만료와 관련한 Warning이 있어서 ```script src``` 정도만 수정하면 되는 간단한 문제일줄 알았는데 그게 아니었다.

처음 블로그를 개발할 때의 MathJax의 문법으로는 ```$ a = b + c $``` 와 같은 문법으로 달러 표시 사이에 수식을 입력하면 inlineMode \\(a = b + c\\), ```$$ a = b + c $$``` 와 같은 문법으로 사용하면 displayMode로 하나의 블록처리가 되어 수식이 렌더링 되었었다.

\\[
a = b + c
\\]

어떤 이유인지 모르겠으나, displayMode가 정상적으로 작동되지 않는 문제가 발생했다. displayMode를 이용한 수식들이 모두 정상적인 수식이 아닌

$$
a = b + c
$$

와 같은 형태로 보이게 되었다. 이 문제를 해결하기 위해서 과거에도 한번 고생한 적이 있었는데 그땐 특정 gem의 버전이 올라가는 과정에서 생긴 해프닝 정도로 생각되었다. 다른 gem들도 함께 버전이 올라가면 해결될 일이라고, 내가 해결할 수 없는 일이라고 생각되어 임시방편으로 문제를 해결했었다.

### 임시방편

```html
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$', '$'] ],
      displayMath: [ ['$$','$$']. ['++','++'] ],
      processEscapes: true,
      skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    },
    messageStyle: "none",
    "HTML-CSS": { preferredFont: "TeX", availableFonts: ["STIX","TeX"] }
  });
</script>
```

이런 식으로 displayMath의 Delimiter를 ```++```의 형태로 추가하여서 강제로(?) 수식으로 인식되게 만들었었다. 이렇게 하면 아쉽게도 VSCode의 markdown-preview-enhanced에서 정상적으로 인식되지 않는 문제가 있었지만, 블로그 내에서는 정상적으로 렌더링되기 때문에 나 하나만 불편하면 될 문제라고 생각했다.

그러나, 이 문제가 슬슬 거슬리기 시작했고, 최근 블로그를 다시 정상화하려고 하는 마음을 먹은 상태에서 이 문제를 먼저 해결해야겠다는 생각이 들었다.

## 문제의 원인이 무엇인가?

문제의 원인은 바로 MathJax에 있었다.

> The default math delimiters are ```$$...$$``` and ```\[...\]``` for displayed mathematics, and ```\(...\)``` for in-line mathematics.
> Note in particular that the ```$...$``` in-line delimiters are not used by default.
> - https://docs.mathjax.org/en/v3.0-latest/basic/mathematics.html#tex-and-latex-input

공식문서에 의하면 ```$...$```는 더 이상 지원하지 않는다고 한다. 그 이유는 실제 달러 표시를 위한 기호 사용과, 수식 입력을 위한 기호 사용에서 혼동이 올 수 있다는 이유에서였다. 이유가 어쨌든, 공식적으로는 ```\[...\]```과 ```\(...\)```을 써야한다는 말이다.

## 해결방법

일단, MathJax의 버전을 3.1.0 버전으로 올렸다. 그리고 내 블로그에 있는 모든 글의 달러표시를 ```\\( ... \\)``` 또는 ```\\[ ... \\]``` 로 변경하였다. 이 과정이 시간이 꽤 많이 걸린 것 같다. (하나하나 직접 바꿨으니..) 잘 되던 inlineMode도 변경한 이유는 언제 또 바뀔지 모르니, "이왕 하는거 한번에 하자!" 라는 마음도 있었고 Official한 문법을 따르는 것이 이상적이라고 생각해서 전부 바꿔버렸다.

## KaTeX에 대한 고찰

이 문제에 대해서 구글링하던 도중에 kramdown에서 KaTeX를 공식적으로 지원한다는 이야기를 들었다. 또한, 몇몇 블로거들은 본인의 Github page에 KaTeX를 적용한 사람들이 있는 것 같아 보인다. 이에 대한 고찰을 간단하게 해볼까 한다.

### 속도

KaTeX 공식 홈페이지도 그렇고, 다른 블로거들의 글도 그렇고 KaTeX가 MathJax보다 훨씬 가볍고 빠르다고 말한다. 그러나, 필자가 적용해봤을 때, localhost에서 렌더링하는 속도도 엄청나게 오래걸렸고(무려 14초), MathJax가 그렇게 막 느리다고 생각되지 않았기 때문에 속도면에서는 MathJax가 오히려 더 좋았다.

### 편안함

사실 지금까지 모든 포스트에 써왔던 ```$$ ... $$``` 문법을 그대로 사용하기 위해서 KaTeX 적용을 고려하고 있었다. 그러나, KaTeX를 적용하니 displayMode는 정상작동되나 다시 inlineMode가 작동되지 않는 상황이 발생했다.

누군가 Jekyll에 KaTeX를 잘 적용하기 위해서 jekyll-katex 라는 plugin을 개발하였는데, 이를 사용하기 위해서는 모든 post를 {% raw %}```{% katexmm %}``` ```{% endkatexmm %}```{% endraw %}로 묶어야했다. 이 또한, 상당히 (미관상으로도) 불편했기 때문에 별로였다.

그리고 가장 중요한, Markdown Preview Enhanced 에서 KaTeX 수식이 정상적으로 작동되지 않았다. 그래서 KaTeX 적용했던 것을 모두 취소하고 다시 MathJax로 돌아왔다.

## 결론

<ul style="margin: 0px"><li>inlineMode</li></ul>

```
\\( \some_thing{like}{this} \\) this is the way how to use inline math block
```
<br>
<ul style="margin: 0px"><li>displayMode</li></ul>

```
Long math equation should be like below.

\\[
  \some_thing {like} {this}
\\]

this is the way how to use display math block
```


<br><br><br>