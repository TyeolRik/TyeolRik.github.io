---
layout: post
title: "[GIT] 에러 Object file is empty 문제 해결법"
section-type: post
category: GIT
tags:
  - git
  - error
  - troubleshooting
---

어느날 이런 문제가 발생했다.

```console
$ git pull
error: object file .git/objects/52/fbac1a2981e0925b6fd0dd546a6cc35d9ae4cc is empty
fatal: loose object 52fbac1a2981e0925b6fd0dd546a6cc35d9ae4cc (stored in .git/objects/52/fbac1a2981e0925b6fd0dd546a6cc35d9ae4cc) is corrupt
```

최근 자주 이런 문제가 발생하는 듯 하여, 문제해결법을 [Stackoverflow](https://stackoverflow.com/a/31110176/7105963)에서 발견하였다.

### 요약

```console
$ find .git/objects/ -type f -empty | xargs rm
$ git fetch -p
$ git fsck --full # 여기서 끝.
$ git pull
```

### Example

```console
$ find .git/objects/ -type f -empty | xargs rm

$ git fetch -p
error: refs/heads/main does not point to a valid object!
error: refs/remotes/origin/HEAD does not point to a valid object!
error: refs/remotes/origin/main does not point to a valid object!
error: refs/heads/main does not point to a valid object!
error: refs/remotes/origin/HEAD does not point to a valid object!
error: refs/remotes/origin/main does not point to a valid object!
error: refs/heads/main does not point to a valid object!
error: refs/remotes/origin/HEAD does not point to a valid object!
error: refs/remotes/origin/main does not point to a valid object!
error: refs/heads/main does not point to a valid object!
error: refs/remotes/origin/HEAD does not point to a valid object!
error: refs/remotes/origin/main does not point to a valid object!
error: refs/heads/main does not point to a valid object!
error: refs/remotes/origin/HEAD does not point to a valid object!
error: refs/remotes/origin/main does not point to a valid object!
remote: Enumerating objects: 72, done.
remote: Counting objects: 100% (72/72), done.
remote: Compressing objects: 100% (52/52), done.
remote: Total 72 (delta 22), reused 65 (delta 18), pack-reused 0
Unpacking objects: 100% (72/72), 74.28 KiB | 1.46 MiB/s, done.
From https://github.com/TyeolRik/balance_problem
 * [new branch]      main       -> origin/main

$ git fsck --full
Checking object directories: 100% (256/256), done.

$ git pull
Already up to date.
```

아주 잘 된다. 기억해두자.