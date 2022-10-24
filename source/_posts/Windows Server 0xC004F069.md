---
title: Windows Server 0xC004F069
date: 2022-10-24 15:11:57
tags: [KMS, Windows Server]
categories: [分享]
---

想用 KMS 激活的时候遇到这个沙壁问题

<!-- more -->

百度和谷歌中文搜索都会教你将注册表 `SkipRearm` 的值改为 1，卵用没有，因为你安装的版本是 **Windows Server Standard (Datacenter) Evaluation** 版本，需要用零售版的 key 激活，如果想用 KMS 密钥激活，使用以下命令

```PowerShell
DISM.exe /online /Set-Edition:ServerStandard /ProductKey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX /AcceptEula
```

中间的 xxxx 改为微软官方提供的 **对应系统版本** 的密钥 [点这里查看](https://learn.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)
