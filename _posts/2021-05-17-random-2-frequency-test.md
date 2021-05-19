---
layout: post
title: "[Random] frequency test"
section-type: post
category: random
tags:
  - random
  - nist_sp800-22
  - test
---

본 글은 [NIST SP800-22 Revision 1a](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-22r1a.pdf) 를 번역한 것과 제 생각을 일부 덧붙여서 작성되었습니다.

## 테스트의 목적

> 0과 1의 비율이 거의 \\(1/2\\) 인가?

이 테스트에서 주목해야할 점은 전체 수열의 0과 1의 비율이다. 이 테스트의 목적은 "어떤 수열에서 0과 1의 비율이 \[진짜 랜덤에서 기대되는 것처럼\] 거의 같은가?"이다. 이 테스트는 1들의 부분들의 가까움을 \\(1/2\\)로 추정한다. 다시 말해서, 어떤 수열의 0과 1의 수는 거의 같아야한다는 의미이다. 모든 차후의 테스트들은 이 테스트를 통과했는지에 달린다.

## Codify

[Github](https://github.com/TyeolRik/RandomnessStatisticalTest/blob/main/nist_sp800_22/frequencyTest.go)에서 확인해볼 수 있습니다.

Go 1.16.4 로 작성되었습니다.

```go
package nist_sp800_22

import (
	"errors"
	"math"
)

func FrequencyTest(targetSequence []uint8) float64 {

	// Step 1. Conversion to ±1
	var S_n int64 = 0
	for _, v := range targetSequence {
		if v == 0 {
			S_n = S_n - 1
		} else if v == 1 {
			S_n = S_n + 1
		} else {
			panic(errors.New("one of input bits is neither 0 nor 1"))
		}
	}

	// Step 2. Compute the test statistic S_obs
	var S_obs float64 = (math.Abs(float64(S_n)) / math.Sqrt(float64(len(targetSequence))))

	// Step 3. Compute P-value
	var P_value float64 = math.Erfc(S_obs / math.Sqrt(2))

	return P_value

	/**
	* 2.1.5 Decision Rule (at the 1% Level)
	* If the computed P-value is < 0.01,
	* then conclude that the sequence is non-random.
	* Otherwise, conclude that the sequence is random.
	 */
}
```

<br><br><br>