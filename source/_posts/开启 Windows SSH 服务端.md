---
title: 开启 Windows SSH 服务端
date: 2022-01-01 13:26:17
tags: [Windows, SSH]
categories: [记录]
---

记录下开启 Windows 的 sshd 的方法

<!-- more -->

每次开 sshd 都要谷歌一番，懒得找了
看到一篇比较详细的文章，记录一下开启的过程

### 这里是过程

首先打开管理员权限的 PowerShell 查看下是否安装 OpenSSH

```powershell
Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
```

应该会显示如下输出，版本号可能会有变化

```powershell
Name  : OpenSSH.Client~~~~0.0.1.0
State : NotPresent
Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```

然后通过以下命令安装客户端和服务端

```powershell
# 安装客户端
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# 安装服务端
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 它们的输出应该类似下面这样
Path          :
Online        : True
RestartNeeded : False
```

最后输入 `Start-Service sshd` 来开启 sshd，使用 `ssh username@localhost` 检查是否开启成功

来源: [几步命令轻松搭建Windows SSH服务端](https://segmentfault.com/a/1190000022248357)
