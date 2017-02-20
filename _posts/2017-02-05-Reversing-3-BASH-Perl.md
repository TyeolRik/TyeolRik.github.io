---
layout: post
title: "BASH Shell 사용법"
section-type: post
category: Reversing
tags:
  - reversing
  - hacking
  - linux
  - bash
  - perl
---


## BASH 셸을 이용하자.

해킹의 기본은 공격하고 실험하는 데 있다. 다른 여러가지 것들로 시도해보는 것이 가장 중요하다. 이 과정에서 BASH 셸과 펄(Perl)을 널리 사용된다.

### 펄(Perl) / 기본 사용법

펄은 print 명령을 이용해서 긴 문자열을 만드는 데 특히 적합한 인터프리트(Interpret) 프로그래밍 언어이다. 펄은 다음과 같은 명령어로 커맨드라인에서 명령을 실행하는데 사용된다. 펄에게 print "A" x 20 이라는 명령어를 실행하라는 명령이다.

```bash
TyeolRik@hacking:~/booksrc $ perl -e 'print "A" x 20;'
AAAAAAAAAAAAAAAAAAAAi
```

다음과 같이 \x## 와 같은 형식으로 문자열을 출력할 수도 있다. ##부분에는 16진수가 들어간다. ~~아마도 ASCII 표기법에 의해서 문자열이 출력되는 것 같다.~~

```bash
TyeolRik@hacking:~/booksrc $ perl -e 'print "\x41" x 20;'
AAAAAAAAAAAAAAAAAAAA
```

다음과 같이 점을 이용해서 문자열을 계속적으로 붙일 수도 있다. 여러 개의 주소를 하나의 문자열로 만들 때 유용하게 사용가능하다.

```bash
TyeolRik@hacking:~/booksrc $ perl -e 'print "A" x 20 . "BCD" . "\x61\x66\x67\x69" x 2 . "Z";'
AAAAAAAAAAAAAAAAAAAABCDafgiafgiZ
```

셸 명령 전체가 값을 리턴하는 함수처럼 실행될 수도 있다. 참고로 다음 bash는 모두 같은 명령어이다. uname 명령어는 현재 시스템의 정보를 출력하는 명령어이다.

```bash
TyeolRik@hacking:~/booksrc $ uname
Linux
TyeolRik@hacking:~/booksrc $ $(perl -e 'print "uname";')
Linux
TyeolRik@hacking:~/booksrc $ una$(perl -e 'print "m";')e
Linux
```

마지막 명령이 헷갈릴 수도 있는데, una를 우리가 수동으로 쳤고, $(perl -e 'print "m";') 명령어에 의해서 m이 리턴되었고, e를 수동으로 쳤기 때문에 uname가 된다.
