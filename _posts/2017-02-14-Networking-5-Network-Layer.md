---
layout: post
title: "[네트워킹] 네트워크 계층 (Network Layer)"
section-type: post
category: Network
tags:
  - network
  - theory
  - osi
  - network_layer
  - tcp_ip
  - ip
---

## 네트워크 계층(L3 :: Network Layer)

TCP/IP 프로토콜에서의 네트워크 계층은 노드 간의 Datagram을 전달하는 역할을 한다.

### IP :: Internet Protocol

**IP는 이름 그대로 하나의 프로토콜로써 주소지정과 데이터 전송을 담당한다.** 네트워크 계층에서 각각의 노드를 식별하는 식별자는 IP 주소이다. 현재 인터넷에서는 IPv4를 사용한다. IP주소는 xxx.xxx.xxx.xxx와 같은 4바이트 배열 형식으로 구성된다. Ethernet Header 처럼 IP 헤더도 존재하는데, 이 헤더에는 패킷의 데이터 타입, 라우팅할 출발지와 목적지 주소필드, 체크섬이나 패킷 분할 필드도 있다. IP는 좀더 상위 계층의 패킷을 전송하는데 사용한다. 네트워크 링크에 패킷 크기 제한이 있어서 큰 패킷을 한번에 전송하지 못하는 경우가 있을 수 있다. 그럴 때, IP는 패킷의 데이터 부분을 분할하고 앞에 같은 헤더를 붙이는 방식으로 원본 패킷을 분할하고 전송한다. 각 분할 패킷에는 서로 다른 분할 오프셋(Fragment Offset)이 존재하고, 이 값은 IP 헤더에 저장하는 필드가 존재한다. 수신자는 분할 오프셋을 이용해서 분할된 패킷을 재조합 한다.

### ICMP :: Internet Control Message Protocol

ICMP 패킷은 **메시징과 네트워크 진단에 사용**된다. IP 패킷을 보낼 경우, 실제로 목적지에 도달 안할 수도 있는데, 만약 도달하지 못했다며 중간 라우터에서 송신자에게 문제의 원인이 담겨있는 ICMP 패킷을 반환한다. 그래서 ICMP는 네트워크 연결을 테스트하는 데 쓰이는데, 주로 사용하는 ping 유틸리티에서 ~~cmd에서 ping 하는거~~ ICMP Echo 요청과 Echo 응답 메시지를 사용한다.
