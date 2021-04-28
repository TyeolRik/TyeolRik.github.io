---
layout: post
title: "[VScode] Colab을 VSCode에서 사용하기!"
section-type: post
category: VScode
tags:
  - colab
  - VSCode
  - remote
  - ssh
---

이 방법은 StackOverflow의 [어떤 글](https://stackoverflow.com/a/59537334/7105963)을 읽고 여러 시행착오를 겪으며 쓴 글입니다.

아래 방법은 Windows10 기준으로 작성되었습니다.

## Colab에서 해야할 것

일단 Colab에서 새 파일을 연 뒤에 아래와 같은 코드를 작성합니다.

```python
# This project is influenced by Dimitris Milonopoulos in StackOverflow
# https://stackoverflow.com/a/59537334/7105963

import random, string
password = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))

#Download ngrok
! wget -q -c -nc https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
! unzip -qq -n ngrok-stable-linux-amd64.zip
#Setup sshd
! apt-get install -qq -o=Dpkg::Use-Pty=0 openssh-server pwgen > /dev/null
#Set root password
! echo root:$password | chpasswd
! mkdir -p /var/run/sshd
! echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
! echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
! echo "LD_LIBRARY_PATH=/usr/lib64-nvidia" >> /root/.bashrc
! echo "export LD_LIBRARY_PATH" >> /root/.bashrc

#Run sshd
get_ipython().system_raw('/usr/sbin/sshd -D &')

#Ask token
print("Copy authtoken from https://dashboard.ngrok.com/auth")
import getpass
authtoken = getpass.getpass()

# Permission denied error. from https://stackoverflow.com/a/62924061/7105963
get_ipython().system_raw('chmod 755 ./ngrok')

#Create tunnel
get_ipython().system_raw('./ngrok authtoken $authtoken && ./ngrok tcp 22 &')
#Print root password
print("Root password: {}".format(password))
#Get public address
! curl -s http://localhost:4040/api/tunnels | python3 -c \
    "import sys, json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])"
```

그리고 실행을 하면 다음과 같은 창이 나옵니다.

```
Creating config file /etc/ssh/sshd_config with new version
Creating SSH2 RSA key; this may take some time ...
2048 SHA256:2ag8GQlM0acBelYRqrrqDamCrsv+oCDdYWlUIfF09A8 root@eafa879e544d (RSA)
Creating SSH2 ECDSA key; this may take some time ...
256 SHA256:y4Gj3DmyeJPFdmOZAk2NHP6sh0ikjKjnsSPA0J4LtRs root@eafa879e544d (ECDSA)
Creating SSH2 ED25519 key; this may take some time ...
256 SHA256:L7kAGOFWUfNE3bhf2qp+eBbBLF5pAKYi8M+fNxroOMA root@eafa879e544d (ED25519)
Created symlink /etc/systemd/system/sshd.service → /lib/systemd/system/ssh.service.
Created symlink /etc/systemd/system/multi-user.target.wants/ssh.service → /lib/systemd/system/ssh.service.
invoke-rc.d: could not determine current runlevel
invoke-rc.d: policy-rc.d denied execution of start.
Copy authtoken from https://dashboard.ngrok.com/auth
··········
Root password: 0MKzAbyilN9adjhPWoF2
tcp://2.tcp.ngrok.io:13761
```

여기서 중요한 포인트는 아래의 4개의 문장입니다.

```
Copy authtoken from https://dashboard.ngrok.com/auth
··········    # 여기서 여러분의 Input을 받습니다.
Root password: 0MKzAbyilN9adjhPWoF2
tcp://2.tcp.ngrok.io:13761
```

위에서 표시한 부분에서 여러분의 Input을 기다릴텐데, 위의 링크에 들어갑니다. 회원가입 및 로그인을 해주시구요, 아래와 같은 화면이 나옵니다.

![Imgur](https://i.imgur.com/DZ1YJSi.png)

오른쪽 Copy를 클릭하거나 빨간색 부분을 복사하여 Colab의 Input 부분에 집어넣습니다. 그러면 아래의 Root password와 ngrok 주소가 출력될 것입니다. Password나 위 URL, 포트번호는 세션에 따라 주기적으로 갱신되기 때문에 큰 의미가 없습니다.

잘 접속이 되는지 확인을 해봅시다. Command Prompt(CMD)를 켜시고, 아래와 같이 입력합니다.

```bash
> ssh root@2.tcp.ngrok.io -p 13761
```

![Imgur](https://i.imgur.com/5aheREi.png)

중간에 패스워드를 물어볼텐데, 복사 붙여넣기를 하면 (SSH 보안정책 상?) 글자는 안 보이지만 붙여넣기 잘 되니 따라쓰는 노동은 하지 않으셔도 됩니다. 여튼, 아래와 같이 잘 접속되는 것을 알 수 있습니다. ~~Colab의 Python 서버는 Ubuntu 18.04 LTS를 사용하는군요!~~

## Visual Studio Code를 켭시다!

좌측의 Extensions를 검색하여 [Remote-ssh (by Microsoft)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) 를 설치해주세요!

좌측 하단에 초록색 >< 표시가 있을텐데요, 이것을 클릭하면 다음과 같은 창이 나옵니다.

![Imgur](https://i.imgur.com/6cP5qKI.png)

![Imgur](https://i.imgur.com/bZSHSFf.png)

![Imgur](https://i.imgur.com/rlywWKe.png)

그림과 같이, ```C:\Users\컴퓨터이름\.ssh\config``` 이런 식으로 작성하면 됩니다. 뒤에 ```config```이 아닌 경우도 있던데, 대충 형식이 맞으면 됩니다. 이렇게 바꾸는 이유가, Linux 버전이랑 Windows 버전이 Remote-ssh 에서 잘못 만든건지 어떤 혼동이 있었는지는 모르겠으나, Configuration file의 경로를 찾지 못하는 문제가 발생하여 이를 해결하기 위해서 다음과 같이 바꿔줍니다.[^1]

자, 이제 거의 다 왔습니다.

![Imgur](https://i.imgur.com/EXEtkiG.png)

![Imgur](https://i.imgur.com/SvoVTvv.png)

아까 위의 Colab의 Output에 있었던 ```tcp://2.tcp.ngrok.io:13761``` 부분의 ```tcp://``` 부분은 떼고, 뒷부분만 복사하여 ```root@2.tcp.ngrok.io:13761``` 이렇게 작성해줍니다. (포트번호나 URL 주소는 다를 수 있습니다!)

새창이 열릴텐데요, 여기서 Colab의 Output에 있었던 비밀번호를 복사 붙여넣기 해줍니다. 아래 사진처럼요. (혹시, Linux, Windows, MacOS 중에 선택하라는 창이 나올 수 있습니다. (1회에 한해서) 그때는 Linux를 눌러주세요!)

![Imgur](https://i.imgur.com/o7s1dzw.png)

그러면 처음 접속시에는 약간의 시간이 걸리나 (서버에 VSCode-server를 설치하는 시간이 좀 걸립니다.) 금방 완료되고 아래에는 영롱한 초록빛깔의 접속 표시가 나옵니다.

![Imgur](https://i.imgur.com/3HJjKbB.png)

이걸로 무엇을 할 수 있을진 모르겠지만.. VSCode와 Colab을 연결하는 포스팅이었습니다~

<br>
<br>
<br>
<hr>

[^1]: [Bad Owner or Permissions on username\.ssh\config file #3210](https://github.com/microsoft/vscode-docs/issues/3210)