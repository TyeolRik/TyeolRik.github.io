---
layout: post
title: "[논문요약] An Implementation of cloud gaming model using Google cloud platform and Parsec"
section-type: post
category: Journal
tags:
  - game
  - cloud
  - stadia
  - xcloud
  - psnow
---

## Author

<p style="text-align: center;">Jadav Utpalkumar H., Ankita Gandhi</p>

<p style="text-align: center;">in <i>M.Tech computer engineering, Parul University, Vadodara, India</i></p>
<br><br>
Original Link: [Where did I find](https://d1wqtxts1xzle7.cloudfront.net/63082669/B100403091320200424-94874-i6g9id.pdf?1587792314=&response-content-disposition=inline%3B+filename%3DAn_Implementation_of_cloud_gaming_model.pdf&Expires=1595354383&Signature=DBLPfgcL5nlYEwS1c26YXyVv-gSc415mqkdUzpkiykyzep0GD64FMkEqx-J7kv5GzPrxPIbiE-rmCjnD-F3ZKbPmIj9CKTqicKaUio7x4L5ztfbmWmpNNbdOC15Bs8pgAiBYopySvbMTFagOovrkvVK0~EX6n8npSTmN18x1ntyh91-Oq1gJbwh2b-VXFF~HZFRgyjTxDhx4fhr9J7KtNcGwgjhJgs2Huio9gnewcYtxws-IqRxDFDB1ObYrx6i1yNtkrAytFodu5sxvhnQjiDHVJX2h-AHUUj1jgyL6Ez72~ZuJf0arq7lYGkldGXpvVSIREgovtRv0qGoTn3-imA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA)<br>
Archived Link: [Download in Google Drive](https://drive.google.com/file/d/1Ru8XPKwo_zZ3imXECZ4vrNIQ6DWTnEMM/view?usp=sharing)

## 필자요약

> Game Cloud을 대략적으로 어떻게 구현해야하는지를 큰 그림으로 보여주는 논문.<br>
> 본인들이 실제로 구현해보고, 어떤 순서로 구현해야하는지, 어떤 과정이 필요한지를 개괄적으로 보임.<br>
> 비판적으로 보자면, **Parsec을 설치해봤다.** 수준의 논문이므로 실제로 구현한 것은 없어보임.<br>
> 이 논문에서 유의미한 파트는 **실제로 Benchmark** 하여 Warframe이라는 게임에서 몇 프레임의 성능을 내는지, 게임 할만한 수준인지를 테스트한 결과가 인상적임.

### Cloud Game의 전망

인터넷에 많음. 굳이 설명하자면,

게이머 입장:

- 언제 어디서나 게임 가능함.
- 게임 구매가 자유로움. (성능에 구애받지 않는?)
- 컴퓨터 살 필요가 없음.
- In-game Live tournament를 시청하거나 친구한테 내 게임플레이 공유 가능.

개발자 입장:

- 불법 다운로드 근절. (애초에 클라이언트 컴퓨터에 설치가 안되니)
- 개발할 때, Device 마다 테스트하거나, 포팅하는데 비용 / 시간 절약

서비스제공자 입장:

- 이미 충분히 인프라가 구축되어 있으므로 새로운 수요 해결
- 새로운 수익모델 창출

사업적인 가장 큰 포인트는 Client 단 Machine의 성능이 필요가 없어진다는 것이다. 최소 2Mb/s 정도의 네트워크 성능만 가지고 있으면 충분히 게임을 즐길 수 있으며, 이제 서비스 제공자가 어떤 Architecture를 갖느냐에 따라 성능이 더 좋아질 수도, 아닐 수도 있다.

## Implementation

### 개괄적인 구조

1. Client는 Cloud data platform에 Request하고, 시스템에 로그인하고, 게임을 선택함.
2. CLoud system은 적절한 데이터센터를 선택하고, Network 상황에 따라 적절한 노드를 선택, Edge node한테 CPU / GPU / Memory 가 얼마나 필요한지를 알려줌. 그 때, Data center는 가상 머신의 주소를 Client에게 알려줌.
3. Client는 게임함. Input signal을 Data center한테 보내줌. (키보드, 마우스 클릭 등)
4. Client input을 받은대로 게임을 업데이트하고 Video를 Client한테 보내줌.

### Server side

**Google Cloud Platform** 사용했고, OS는 Microsoft **Server 2016** Datacenter Edition, GPU는 GCP에서 제공하는 것으로 사용. ~~논문에서 뭐 사용했는지 안 알려줌.~~ DirectX3D 11, Nvidia GPU Driver 설치하였음. Streaming 하기 위해서 VB-Audio Cable 사용했고, **UDP**로 통신하였음. Steam이나 Epic Games같이 실제 게임 하기 위한 소프트웨어를 설치함. **Streaming에는 Parsec**이라는 소프트웨어를 사용하였음.

### Client side

Streaming Setup을 위해서 기본적으로 Workstation이나 노트북 사용하였음. ~~도대체 Workstation이라고 표현한 이유가 뭘까~~ Streaming 때문에 Parsec 사용하였음.

Parsec 쓴 이유가 적혀있는데, 오픈소스 Desktop 캡처 프로그램으로 Cloud-base 게임에 많이 사용되는데, 이걸 쓰면 게임을 다른 PC에 돌려놓고 원격 게임이 가능하며 그걸 Streaming 하는 방식으로 할 수 있도록 한다고 함. (즉, 알아서 다 해준다는 의미 인듯) H.265 encoder/decoder 사용하였음.

### Parsec

![Imgur](https://i.imgur.com/kk5AEIU.png)

## Test Result

아직 4K가 모든 게임에 지원되는 것도 아니고, Cloud Service로 제공되는 GPU도 30 / 60 프레임의 제한이 걸려있기 때문에 프레임의 한계치가 존재하는 실험임. 서버의 가상 머신으로 게임을 해보니, Latency가 거의 없거나 아예 안 느껴지는 수준이어서 만족스러운 환경을 보여줬음.

Warframe이라는 게임으로 테스트 해봤는데, 프레임이 끊기거나, 인풋렉(User가 Input하면 게임이 반응하는 그 사이의 Delay)이 거의 안 느껴지는 수준이었음.

Server / Client 간의 통신 상태가 좋았기 때문에 (거의 5Mb/s 정도) 고해상도로 게임을 즐기는데 지장이 없었음.

![Imgur](https://i.imgur.com/rS2NYYF.png)

## 결론

현재 기술적 인프라로는 충분히 Game cloud 가 구현가능하고, 비용이 크게 비싸지도 않은 5Mb/s 정도 인 것으로 생각됨.



<br>
<br>
<br>
<hr/>