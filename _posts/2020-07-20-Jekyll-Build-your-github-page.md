---
layout: post
title: "[Jekyll] Github Page 를 빠르게 구현하기"
section-type: post
category: jekyll
tags:
  - jekyll
  - git
  - markdown
  - blog
---

본 문서는 Github Page를 이용하여 Static Website를 빠르게 구축하는 방법에 대한 실용적인 글입니다.

본 문서는 초기 설치화면을 보여주기 위하여 Docker Container에서 작업되었습니다. (```docker pull ruby``` [Docker Ruby Link][0])

## 1. Download

### Ruby 설치

제일 먼저 해야할 일은 여러 Package들을 다운로드를 하는 일입니다. 그 중에서 제일 첫번째는 Ruby를 설치하는 일입니다.

Windows를 사용하고 있다면 > [Download for Windows][1] 여기서 적절한 거 선택하세요. 최신버전 설치해도 좋고, 제 컴퓨터에서는 2.6.5p114 버전이 설치되어있네요. (With DevKit으로)

Linux를 사용하고 있다면.. 적절히 잘 설치하시기 바랍니다.

Docker hub에도 Jekyll이 있으니 이용해보시기 바랍니다. [Docker for Jekyll][2]

정상적으로 설치가 되었다면 ```ruby -v``` 명령어를 cmd나 bash에서 실행한다면 다음과 같이 버전이 떠야합니다. 안 뜬다면, 정상적으로 설치되지 않았거나 PATH 설정을 직접 하셔야합니다.

![Imgur](https://i.imgur.com/1eu0BZi.png)

빨간 박스 처럼 말입니다.

### Jekyll 설치

이제 위의 상태에서 ```gem install jekyll bundler``` 명령어를 실행합니다. 다음과 같이 설치가 됩니다.

![Imgur](https://i.imgur.com/zG0hQUK.png)

이렇게 약 5분 정도의 시간이 지나서 설치가 다 된 모습입니다. 기본적인 필수 구성요소들은 모두 설치되었을 것입니다.

### Initialize My Blog

```jekyll new myblog``` 라는 명령어를 입력하시면 다음과 같이 수많은 작업을 합니다.

![Imgur](https://i.imgur.com/XpntOMS.png)

그리고 이렇게, ```./myblog``` 라는 폴더에 여러 파일들이 저장되죠. myblog 라고 하지 않고, 다른 이름으로 하셔도 괜찮습니다. (경험상 짧으면 짧을수록 좋습니다.)

### Jekyll Local server 실행하기

```cd ./myblog``` 명령어를 실행하여 위에서 만든 폴더로 이동한 뒤 ```bundle exec jekyll serve``` 명령어를 실행합니다.

![Imgur](https://i.imgur.com/QQ6PPhz.png)

그러면 다음과 같이 서버 주소가 나오고, 설치가 완료됩니다!

> 참고<br>
Docker의 경우에는 ```bundle exec jekyll serve --host 0.0.0.0 -p 4000``` 명령어를 주면, http://localhost:4000 에서 정상작동합니다. (물론, Docker container를 만들 때, ```-p``` 명령어로 포트포워딩을 해줘야겠죠?)

그렇게 위 주소로 들어가보면,

![Imgur](https://i.imgur.com/9FSsTrm.png)

이런 초기화면이 나오죠.

## 2. Theme 설치

이런 블로그를 만드려고 우리가 Jekyll을 사용하는 것이 아닙니다. 뭔가, 다른 블로그랑은 다른 차별화된 **나만의 블로그**를 만드는 것이 목적이잖아요. 그래서, 우리는 디자인을 해야하는데, 사실 하는게 꽤나 귀찮고 복잡합니다. 많은 웹 개발 지식이 필요하죠. 그래서 우리는 Free Theme을 하나 따오려 합니다.

구글에 Jekyll theme 이라 검색하면 많이 나오는데 [link to JekyllThemes][3] 그 중에서 아무거나 들어가서, Github link나 Download를 누르시고 myblog에 그대로 덮어쓰면 됩니다! (아니면, 다른 곳에 압축을 풀어도 괜찮아요.)

그리고 다시 ```bundle exec jekyll serve``` 명령어를 통해서 정상적으로 페이지가 설치되었는지, 실제로는 어떤 모습인지 확인을 하면 됩니다.

이제 내 것으로 만들어야겠죠? 정석적으로는 Github link에 README 파일이 있기 때문에 보고 설명대로 하면 됩니다만, 대게는 ```_config.yml``` 파일을 수정하면 대부분의 모든 것은 해결됩니다. Gemfile (Ruby Package 관리자?)의 경우에는 특수한 경우나, update가 필요할 때, 새로운 package를 설치하고자 할 때 수정하시면 됩니다.

## 3. 글쓰기

```_posts``` 라는 폴더가 있을 것입니다. 들어가보시면, 처음 설명을 위한 예제 파일들이 있을 것입니다. 이것을 일단 찬찬히 보고 어떤 문법을 가졌는지 보세요. 이 문법(언어)을 **Markdown** 이라고 합니다.

파일의 이름은 대게 ```YYYY-MM-DD-Post-Name.md``` 로 되어 있습니다. 반드시 이 문법을 지켜줘야 나중에 편해집니다. 저는 포스트의 이름을 ```YYYY-MM-DD-Category-PostNumberInCategory-PostName.md``` 로 해놓습니다. 왜냐하면, blog 포스트의 순서가 물론 날짜별로 작성되지만 시간까지는 기록되지 않기 때문에 파일의 이름순으로 정렬되기 때문에 같은 날짜에 여러 글을 썼다면 글을 쓰거나 의도한 순서대로 정렬되지 않는 문제가 생깁니다. 그러므로 저는 Category의 이름과 글의 순서를 글의 가장 앞에 적습니다.

그리고 글을 작성할 때 가장 먼저할 일은 글의 제목과 글의 타입을 정하는 일입니다. 일단은 blog라고 적으면 됩니다. 현재 글의 최상단의 태그(?)는 다음과 같습니다.

![Imgur](https://i.imgur.com/QEfrLpU.png)

## 4. Github Page를 구동하기

다 만들었으니 실제 서버에 올려야겠죠? 이 부분은 감사하게도 Github가 무료로 해주고 있기 때문에 간단합니다. ```본인아이디.github.io``` 라는 이름의 repository를 만들고, 거기에 Push 하면 됩니다. 초기 블로그를 만들 때에는 몇분 걸리지만, 그 이후에는 5초 내로 새로고침이 됩니다.



[0]: https://hub.docker.com/_/ruby
[1]: https://rubyinstaller.org/downloads/
[2]: https://hub.docker.com/r/jekyll/jekyll
[3]: http://jekyllthemes.org/