---
layout: post
title: "[c] stdlib rand function 알아보기 (Source code)"
section-type: post
category: c
tags:
  - stdlib
  - rand
---

GCC(glibc) 기준에서 ```stdlib.h```의 ```rand()``` function은 Linear congruential generator Algorithm 의 구현체라고 한다.

```c
#include <stdio.h>
#include <stdlib.h> // random 함수
#include <stdint.h>

/* Linear congruential.  */
#define TYPE_0 0
#define BREAK_0 8
#define DEG_0 0
#define SEP_0 0
/* x**7 + x**3 + 1.  */
#define TYPE_1 1
#define BREAK_1 32
#define DEG_1 7
#define SEP_1 3
/* x**15 + x + 1.  */
#define TYPE_2 2
#define BREAK_2 64
#define DEG_2 15
#define SEP_2 1
/* x**31 + x**3 + 1.  */
#define TYPE_3 3
#define BREAK_3 128
#define DEG_3 31
#define SEP_3 3
/* x**63 + x + 1.  */
#define TYPE_4 4
#define BREAK_4 256
#define DEG_4 63
#define SEP_4 1

static int32_t randtbl[DEG_3 + 1] = {
        TYPE_3,
        -1726662223,  379960547,  1735697613,  1040273694,  1313901226,
         1627687941, -179304937, -2073333483,  1780058412, -1989503057,
         -615974602,  344556628,   939512070, -1249116260,  1507946756,
         -812545463,  154635395,  1388815473, -1926676823,   525320961,
        -1009028674,  968117788,  -123449607,  1284210865,   435012392,
        -2017506339, -911064859,  -370259173,  1132637927,  1398500161,
         -205601318,
};

static struct random_data unsafe_state = {
        .fptr = &randtbl[SEP_3 + 1],
        .rptr = &randtbl[1],
        .state = &randtbl[1],
        .rand_type = TYPE_3,
        .rand_deg = DEG_3,
        .rand_sep = SEP_3,
        .end_ptr = &randtbl[sizeof(randtbl) / sizeof(randtbl[0])]};

int __random_r(struct random_data *buf, int32_t *result) {
    int32_t *state;
    if (buf == NULL || result == NULL)
        goto fail;
    state = buf->state;
    if (buf->rand_type == TYPE_0) {
        int32_t val = ((state[0] * 1103515245U) + 12345U) & 0x7fffffff;
        state[0] = val;
        *result = val;
    } else {   
        printf("\nSECOND CALL!\n");
        int32_t *fptr = buf->fptr;
        int32_t *rptr = buf->rptr;
        int32_t *end_ptr = buf->end_ptr;
        uint32_t val;
        val = *fptr += (uint32_t)*rptr;
        /* Chucking least random bit.  */
        *result = val >> 1;
        ++fptr;
        if (fptr >= end_ptr) {
            fptr = state;
            ++rptr;
        } else {
            ++rptr;
            if (rptr >= end_ptr)
                rptr = state;
        }
        buf->fptr = fptr;
        buf->rptr = rptr;
    }
    return 0;
fail:
    return -1;
}

long int __random (void) {
  int32_t retval;
  (void) __random_r (&unsafe_state, &retval);
  return retval;
}

weak_alias (__random_r, random_r)

/* Return a random integer between 0 and RAND_MAX.  */
int rand (void) {
  return (int) __random ();
}
```

[원문](https://code.woboq.org/userspace/glibc/stdlib/rand.c.html)은 위와 같다. ```#include <stdlib.h>``` 해서 ```rand()```를 호출한 결과와 똑같이 나옴을 확인하였다. (GCC 9.3.0)