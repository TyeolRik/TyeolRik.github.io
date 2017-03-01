---
layout: post
title: "[네트워킹] 소켓이란?"
section-type: post
category: Network
tags:
  - network
  - theory
  - osi
  - socket
---

## 소켓 (Socket)

소켓(Socket)은 운영체제를 통해 네트워크 통신을 하는 표준 방법이다. 프로그래머에게 소켓은 네트워크로 데이터를 주고 받는데 사용하는 도구이다. 이 데이터는 L5(Session Layer)에서 전송된다. L4(Transport Layer)의 구조를 결정하는 여러 종류의 소켓 타입이 있는데, 가장 보편적인 타입이 Stream 소켓과 Datagram 소켓이다.

### 스트림 소켓 (Stream Socket)

전화와 같이 **믿을 수 있는 양방향 통신**을 제공한다. 한쪽에서 다른 한쪽으로의 연결을 초기화하고, 연결이 생성된 후에는 어느 쪽에서든 다른 쪽으로 통신할 수 있다. 보낸 내용이 실제로 도착했는지도 즉각 확인할 수 있다. 스트림 소켓은 전송 제어 프로토콜(TCP :: Transmission Control Protocol)이라 불리는 표준 통신 프로토콜을 사용한다. TCP는 OSI 모델에서 L4(Transport Layer)에 있다. 컴퓨터 네트워크에서 데이터는 보통 패킷이라는 단위로 전송되는데, TCP는 패킷이 오류 없이 순서대로 도착하도록 설계되었다. 웹서버, 메일서버, 각 클라이언트 애플리케이션 모두는 TCP와 스트림 소켓을 사용한다.

### 데이터그램 소켓 (Datagram Socket)

데이터그램 소켓의 연결은 **단방향이고 신뢰할 수 없다.** 또한 수신 측에서 데이터를 순서대로 받는다고 보장할 수도 없다. 데이터그램은 L4 계층에서 사용자 데이터그램 프로토콜(UDP :: User Datagram Protocol)이라는 표준 프로토콜을 사용한다. 안전장치도 별로 없어서 단순하고 간단하고, 가벼운 방법이다. 고로, 부하가 매우 적다. 하지만, 패킷이 잘 도착했는지 확인하려면 수신 측에서 승인 패킷(Acknowledgment Packet)을 보내줘야한다. 패킷 손실이 허용되기도 한다. 보통, 네트워크 게임이나 미디어 스트리밍에서 자주 쓰인다.