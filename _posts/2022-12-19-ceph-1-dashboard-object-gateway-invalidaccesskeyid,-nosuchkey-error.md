---
layout: post
title: "[CEPH] dashboard Object Gateway InvalidAccessKeyId, NoSuchkey Error 해결"
section-type: post
category: CEPH
tags:
  - ceph
---

## 문제 상황

![Imgur](https://i.imgur.com/TkRU3gO.png)

```
RGW REST API failed request with status code 403 (b'{"Code":"InvalidAccessKeyId","RequestId":"tx000000000000000000017-005ecac06c' b'-e349-eu-west-1","HostId":"e349-eu-west-1-default"}')!
```

```
Error connecting to Object Gateway: RGW REST API failed request with status code 404 (b'{"Code":"NoSuchKey","BucketName":"dashboard","RequestId":"tx00000f84ffa8b34579fa' b'a-0061e93872-4bc673c-ext-default-primary","HostId":"4bc673c-ext-default-prim' b'ary-ext-default"}')
```

와 같은 에러가 발생하였다.

## 해결방법

`radosgw-admin` 의 `uid` 를 **admin** 으로 맞추면 된다.

```bash
[root@node1 ~]$ radosgw-admin user rm --uid=admin
could not remove user: unable to remove user, user does not exist
[root@node1 ~]$ radosgw-admin user create --uid=admin --display-name=admin --system
{
    "user_id": "admin",
    "display_name": "admin",
    "email": "",
    "suspended": 0,
    "max_buckets": 1000,
    "subusers": [],
    "keys": [
        {
            "user": "admin",
            "access_key": "2K3AAL55599E2DXT17QD",
            "secret_key": "WnNvWJCyZvTVamOy4cJ5grcqvOCpuRrjDB9FmBw7"
        }
    ],
    "swift_keys": [],
    "caps": [],
    "op_mask": "read, write, delete",
    "system": "true",
    "default_placement": "",
    "default_storage_class": "",
    "placement_tags": [],
    "bucket_quota": {
        "enabled": false,
        "check_on_raw": false,
        "max_size": -1,
        "max_size_kb": 0,
        "max_objects": -1
    },
    "user_quota": {
        "enabled": false,
        "check_on_raw": false,
        "max_size": -1,
        "max_size_kb": 0,
        "max_objects": -1
    },
    "temp_url_keys": [],
    "type": "rgw",
    "mfa_ids": []
}
[root@node1 ~]$ echo "2K3AAL55599E2DXT17QD" > accesskey
[root@node1 ~]$ echo "WnNvWJCyZvTVamOy4cJ5grcqvOCpuRrjDB9FmBw7" > secretkey
[root@node1 ~]$ ceph dashboard set-rgw-api-access-key -i accesskey
Option RGW_API_ACCESS_KEY updated
[root@node1 ~]$ ceph dashboard set-rgw-api-secret-key -i secretkey
Option RGW_API_SECRET_KEY updated
[root@node1 ~]$ ceph dashboard set-rgw-api-admin-resource admin
Option RGW_API_ADMIN_RESOURCE updated
```

이러면 해결이 된다. 이유는 모르겠다.

## 가설 1. Dashboard ID 와 radosgw uid 가 같아야하는게 아닐까?

Dashboard ID 를 변경해보아도, `radosgw uid=admin` 일 때만 잘 됐고, `dashboard` 일 때에는 안됐다.<br>고로, 관련 없어 보인다.