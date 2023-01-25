---
layout: post
title: "[NFS] Server-Client 초기 세팅"
section-type: post
category: nfs
tags:
  - nfs
  - storage
---

NFS를 세팅하는 방법에 대해서 정리해보겠다.

## 환경 :: Environment

> Node 1 :: Server<br>
> IP : 192.168.9.183<br>
> OS : Centos Stream 8<br>

> Node 2 :: Client<br>
> IP : 192.168.9.102<br>
> OS : Centos Stream 8<br>

## Server : 192.168.9.183

```bash
$ dnf install -y nfs-utils # NFS 설치

# 방화벽 설정 (OS에 따라 다를 수 있음.)
$ firewall-cmd --permanent --add-service=nfs
$ firewall-cmd --permanent --add-service=rpc-bind
$ firewall-cmd --permanent --add-service=mountd
$ firewall-cmd --reload

# nfs-server 서비스 시작
$ systemctl start nfs-server.service
$ systemctl enable nfs-server.service
$ systemctl status nfs-server.service

# 공유할 폴더를 만들 것. (기존의 폴더도 가능)
$ mkdir -p /mnt/{share1,share2}

# NFS 로 공유할 폴더 설정.
# 공유할폴더 <띄어쓰기> IP(세팅)
$ cat <<EOF | tee /etc/exports >> /dev/null
/mnt/share1 192.168.9.102(rw,sync,no_all_squash,root_squash)
/mnt/share2 *(rw,sync)
EOF

# 공유 적용
$ exportfs -a

# 추후에 공유를 해제하고 싶을 때
$ exportfs -ua
```

만약에 잘 안된다면, firewall-cmd 를 끄거나, 각자 본인의 OS에 있는 방화벽을 해제하는 등의 적절히 세팅해주면 된다.

```/mnt/share2```의 예시처럼, 접근을 제한할 IP를 와일드카드로도 설정할 수 있으니 참고.<br>(```192.168.*.*``` 처럼)

## Client : 192.168.9.102

```bash
$ dnf install -y nfs-utils nfs4-acl-tools

# NFS 공유폴더 확인
$ showmount -e 192.168.9.183
Export list for 192.168.9.183:
/mnt/share2 *
/mnt/share1 192.168.9.102

$ mkdir /mnt/{share1,share2}
$ mount -t nfs 192.168.9.183:/mnt/share1 /mnt/share1
$ mount -t nfs 192.168.9.183:/mnt/share2 /mnt/share2

# 추후에 un-mount 하고 싶을 때
$ umount /mnt/share1
$ umount /mnt/share2
```

위와 같이 세팅하면 된다.