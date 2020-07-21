---
layout: post
title: "[논문요약] The Case for RAMClouds - Scalable High-Performance Storage Entirely in DRAM"
section-type: post
category: Journal
tags:
  - ram
  - ram_cloud
  - cloud
---

## Author

<p style="text-align: center;">John Ousterhout, Parag Agrawal, David Erickson, Christos Kozyrakis, Jacob Leverich, David Mazières, Subhasish Mitra, Aravind Narayanan, Guru Parulkar, Mendel Rosenblum, Stephen M. Rumble, Eric Stratmann, and Ryan Stutsman</p>

<p style="text-align: center;">in <i>Department of Computer Science Stanford University</i></p>
<br><br>
Original Link: [Where did I find](https://web.stanford.edu/~ouster/cgi-bin/papers/ramcloud.pdf)<br>
Archived Link: [Download in Google Drive](https://drive.google.com/file/d/14W9_7I734yKBpeVaPptRjw0lJ0DdhtXl/view?usp=sharing)

## 필자요약

> &nbsp;&nbsp;RAM Cloud가 학술적으로, 산업적으로 어떤 가치가 있는지 설명하는 논문이다. RAM Cloud가 어떤 구조를 갖춰야하며 전압 안정성 문제를 어떻게 해결할 것인지, 비용은 어느 정도 나올 것인지를 기존의 Hard Disk Drive Cloud, Flash Memory Cloud와 비교하였다.<br>
> &nbsp;&nbsp;그러나 본 논문에는 어떻게 구현할 것인지, 실제로 구현하였을 때 어느 정도의 효과를 거두었는지에 대한 설명은 없다.<br>
> &nbsp;&nbsp;본 논문은 Stanford John Ousterhout 박사가 중심이 되어 연구가 진행되었다. 현재 후속 연구로 Granular Computing이라는 프로젝트가 진행 중에 있다.

### Introduction

40년 정도, 우리는 Magnetic Disk (Hard Disk Drive)를 기반으로 한 Computer system을 이용해왔고 이것이 Online information을 담고 있는 Primary 매체이다. CPU나 고객의 수요는 점점 상승해서 Database system이나 File system 들이 발전하고 있는데, Disk 그 자체의 성능은 같은 속도로 상승을 못하고 있다. 그런데, Large Scale Web application에서 (대형 서버) 이 수요를 처리하기에는 이제 힘들 지경이 이르렀다. 혹자는 Flash Memory Device를 HDD 대신 사용해서 문제를 해결하자고 제안하는데, 본 고에서는 RAM을 Primary locus of online data로 사용하는 것을 해결책으로서 제시해보려 한다.

RAMCloud는 Main Memory에 Storage를 두는 것이 포인트이다. 이로써 HDD 기반으로 한 서버보다 100~1000배 정도는 더 낮은 Latency를 제공할 것이고 이는 100~1000배 정도로 처리량을 대폭 상승시킬 수 있음을 시사한다.

RAMCloud를 사용하면 장점이 3가지 있다. **첫째는 Large scale Web application을 쉽게 만들 수 있다.** 지금은 Web application의 규모가 커지면 그에 수반되는 많은 Scalability issue 들이 발생하는데, 그런 문제들을 신경 쓰지 않아도 된다. **둘째는 Low latency로 인해서 더 괜찮은 Query 모델들이 발생**할 것이며 이는 데이터 집중적인 Application을 쉽게 개발할 수 있음을 의미한다. **세번째는 클라우드 컴퓨팅에 있어 확장가능한 Storage에 대한 수요를 감당**할 수 있다는 것이다. 소규모의 Application이 확장되면서 개발자에게 복잡한 문제를 주는 경향이 많은데 이런 문제에 대해 해방할 수 있다.

### RAMCloud Overview

대형 Datacenter는 크게 2가지의 서버로 나뉘어져 있는데 하나는 Application, 하나는 Storage이다. Storage 서버의 경우 전통적으로 많은 파일이나 관계형 데이터 베이스에 얽혀있다. 그러나, 최근 몇 년 동안 여러 Storage Mechanism 들이 개발되어 확장성을 염두한 데이터베이스 저장 기법들이 많이 생겼다. 예를 들어, Bigtable이나 Memcached 같은 것들 말이다.

RAMCloud는 두가지 특성을 가져야한다. 첫째는 Cache 같은 것이 아니고, 입출력 장치(Flash memory)에 데이터가 저장되는 그런 방식이 아니다. 그냥 DRAM에 저장되는 것이다. 둘째는 수천 Storage 서버의 증축 가능성을 고려하여 수요에 의해 자동적으로 확장되어야한다. 또한, 저장된 정보는 마치 하나의 서버인 것처럼 안정해야한다.

RAMCloud의 기술의 목표는 현재 Disk 기반의 Storage 시스템보다 100~1000배 정도 더 나은 성능을 가질 것을 목표로 하는데 아래는 현재 Disk 기반 Storage 시스템의 특징이다.

- 같은 데이터센터, 같은 서버에서 5~10 ms의 시간 내에 End-to-End 통신이 가능해야
한다.
- 각 서버는 최소 초당 백만 request 들을 처리할 수 있어야한다. (Cache hit rates에 따라 다를 수 있다.)

### 동기(Motivation)

왜 RAMCloud를 개발하기 시작했냐는 이유로는 Application이랑 Technology 측면이 있다. 보통 어떤 사이트가 커지면 많은 수정을 거쳐야한다. 예를 들어서 ad hoc2 기술의 적용 같은 것 말이다. 그런데, 사이트가 Another level 수준으로 커지면, 좀더 특별한 기술을 이용해서 확장성 이슈 문제를 해결해야 하는데 이 문제 때문에 RAMCloud 기술 개발하려고 한다.

예를 들어, 2009년 8월 페이스북이 이런 이슈가 있었다. 그 때 페이스북은 4000개의 MySQL 서버를 가지고 있었는데, 여러 데이터가 서로 분산되어 있는 상황이었다. 그런데, 페이스북의 처리량을 감당 못할 정도로 규모가 커졌고, 그래서 페이스북은 2000개의 Memcached 서버를 구매했다. 불행히도 Memcached 서버랑 MySQL 서버가 서로 consistency를 가지고 있기 위해서 다른 Software에 의해서 서버들이 관리되어야만 했고, 서버 자체의 복잡성을 늘리는 결과가 생겼다.

또한, Disk가 CPU나 Memory의 발전 속도 보다 느리기 때문이다. 우리가 필요한 데이터의 규모는 점점 커지는 데에 비해서 입출력 속도는 그만큼 성능이 향상되지 않았다. 그래서 성능 향상이 필요하다고 생각했는데, 마침 DRAM 자체의 가격도 과거에 비해 많이 저렴해졌기 때문에 가격 경쟁력이 있다고 판단되었다.

Cache hit rate 문제도 개발 동기 중의 하나이다. Hit rate 이 100%이면 DRAM을 Storage로 쓰는 것이랑 똑같은 성능이 나올 것인데 그건 현실적으로 불가능하다. 위에서 예시로 든 Facebook이 25%의 데이터가 Main Memory 안에 들어있고, 이 데이터에 한해서 Cache hit rate이 96.5%에 도달한다. Cache hit 하지 않으면 Disk access time 때문에 성능에 큰 문제를 초래한다. 1%의 miss ratio가 약 10배 정도 성능 감소를 보인다고 한다. 다시 말해서, DRAM 자체가 Storage라면, Access에 대한 성능은 보장될 것이고, 이는 성능 보장으로 직결된다고 판단했다.

최근에는 Flash Memory로 된 Cloud system들이 많이 생기고 있다. Flash memory의 특징이 접근속도가 빠르고 DRAM보다는 전력을 적게 소비한다는 것이다. 그럼에도 불구하고 DRAM이 장점이 더 많다고 판단되는데, 그 핵심은 Latency이다. 일반적으로 Latency가 5-10배 정도 더 작다.

## Research Issues

첫번째 문제는 네트워크 송수신 속도 문제이다. 특정 네트워크 Protocol인 Infiniband나 Myrinet 같은 환경에서는 10μs 정도의 latency를 얻을 수 있다. 그러나, Datacenter 들은 대부분은 Ethernet / IP / TCP 통신 들을 사용하는데 이것들은 300~500μs 정도의 Latency를 가지고 있다. 하드웨어 적으로는 1μs 정도까지 가능한데, delay를 고려하면 5μs 정도까지는 될 것으로 보인다. Latency가 5μs정도에 초당 백만 requests 정도를 처리 가능해지면 software overhead가 매우 감소하여 interrupt나 context switch 등의 인터페이스들이 전혀 느끼지 못할 정도가 될 것이다.

두번째 문제는 데이터 지속성(Durability)과 가용성 문제이다. 서버 하나가 터졌다고 전체 시스템에 영향을 줘서는 안되고 수초내로 시스템이 정상적으로 작동하도록 커버할 수 있어야 하는데 이 때 중요하게 생각되는 것이 정전 방지 기술이다. 이것을 수행하기 위한 방법으로는 1 write request를 받으면 3 copy로 복제하는 것이다. 그런데, 이런 방법은 write latency를 늘리기도 하고, 서버 자체가 나가면 데이터 접근이 안되기 때문에 좋은 방법은 아니라 생각된다. 그래서 최소 여러 서버에 사본을 두어야할 것이다. 그래서 Buffered logging 기술을 제안한다.

![Imgur](https://i.imgur.com/VCoJIZs.png)

위 그림을 보자. Primary Server는 DRAM을 업데이트한다. Log entry 들을 Backup server의 DRAM에 재전송한다. 데이터가 좀 쌓이면 Backup server는 독자적인 방식으로 DRAM에 있는 데이터를 효율적으로(시공간적으로) Disk에 써서 영구 보관하고 DRAM에 있는 데이터를 삭제한다.

세번째 문제는 시스템의 데이터 모델이다. 정말 많은 데이터 모델을 선택하는 방법들이 있고 정말 많은 조합들을 가진 시스템들이 있다. 3가지 측면에서 살펴보려 하는데, 첫번째 측면은 기본 객체 자체를 넣는 것이다. 몇몇 시스템에서는 변수 자체의 길이를 정하기도 하는데 관계형 데이터베이스가 그렇다. 두번째 측면은 Aggregation(집계함수)을 지원하느냐는 문제이다. 보통 key-value store에서는 집계함수를 지원 [^1] 하지 않는다. 세번째 측면은 Naming이랑 Indexing 메커니즘이다.

그 외에도 고려할 점으로는 Data를 어디에 두고, 어떻게 확장시킬 것인지에 대한 Distribution 문제, Request를 받을 때 데이터의 동시성(Concurrency)을 어떻게 보장할 것인가, 자동적으로 어떻게 Managing 할 것인가 (서버가 엄청 많으면 일일이 관리할 수 없으니) 등이 있다.

물론, RAMCloud에도 단점이 있다. 1bit 당 가격과 에너지 소모가 매우 높다는 것은 일단 자명한 사실이다. 가격과 에너지 소모 측면에서는 Disk-based 보단 50~100배, SSD 보단 5~10배 정도 나쁠 것이다. (그러나, 1 operation 당으로 생각해서 Latency를 고려한 효율을 계산해보면, RAMCloud가 100~1000배 정도는 더 효율적일 것으로 보인다.) RAMCloud는 Datacenter 자체의 공간 (물리적 공간) 도 더 많이 필요할 것이다. 그래서 Application이 데이터를 많이 사용하거나 (inexpensively needs) 상대적으로 데이터 자체가 low access rate을 가진다면, RAMCloud는 좋은 솔루션이 아니다.

<br>
<br>
<br>
<hr/>
[^1]: 필자 주. 최근 하고 있는 프로젝트에 Google Firestore를 사용하고 있는데 Aggregation이 없어서 너무 불편하다.