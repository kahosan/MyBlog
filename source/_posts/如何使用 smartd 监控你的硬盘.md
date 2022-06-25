---
title: 如何使用 smartd 监控你的硬盘
date: 2022-06-20 09:33:20
tags: [记录, smartd]
categories: [NAS]
---

毕竟谁也不想 NAS 里的硬盘一声不吭就全寄了吧，，

<!--more-->

**本文测试环境为 Ubuntu Server 20.04 LTS
以下命令均在 Ubuntu Server 20.04 LTS 下进行**

## Smartmontools

smartmontools 包含两个分析和监控硬盘的工具 smartctl 和 smartd，前者在本文不进行深入了解。

安装:

```bash
sudo apt update
sudo apt install smartmontools -y
```

### smartctl

使用这两个工具需要硬盘支持 SMART，可使用以下命令进行检测和开启:

```bash
sudo smartctl --info /dev/sda | grep 'SMART support is:'

# 如果输出不是 Available 可以关闭本文了
SMART support is: Available - device has SMART capability.
SMART support is: Enabled
```

如果输出不为 Enabled ，可以这样启用:

```bash
sudo smartctl --smart=on /dev/sda

=== START OF ENABLE/DISABLE COMMANDS SECTION ===
SMART Enabled.
```

### smartd

smartd 守护进程可以监控硬盘的状态，并在出现问题时发邮件进行通知。
本文仅对网络上的信息进行梳理。如需更加完整的信息，请查看 `/etc/smartd.conf` 里的注释，或阅读 [smartd.conf(5)](https://man.archlinux.org/man/smartd.conf.5)

#### 选项描述

| Options | Description |
| :---: | --- |
| -d | 指定硬盘类型，如 ata、scsi |
| -H | 检查磁盘的 SMART 状态 |
| -l | 监控 SMART 日志 (错误或自检) |
| -s | 指定正则表达式来安排自检，配合 L、S 参数 (扩展自检、短自检) |
| -m | 向指定邮箱发送电子邮件通知 |
| -M | 只有在提供 -m 指令时才会起作用，有几个常用参数，见下列 |

> `once` 为检测到的每种磁盘问题只发送一封警告邮件
> `daily` 为检测到的每种磁盘问题每隔一天发送一封额外的警告提醒邮件
> `diminishing` 为检测到的每种问题发送一封额外的警告提醒邮件，开始是每隔一天，然后每隔两天，每隔四天，以此类推。每个间隔是前一次间隔的 2 倍
> `test` 只要 smartd 一启动，立即发送一封测试邮件
> `exec PATH` 运行 PATH 路径下的可执行文件。PATH 必须指向一个可执行的二进制文件或脚本

#### 错误通知

注意邮件通知需要系统已经配置好 mail 服务 (postfix、ssmtp 之类) 能够向外发送邮件

我查询到的一些信息说需要在 `/etc/default/smartmontools` 中添加

```ini
start_smartd=yes # 在配置文件的注释中也没提到这个参数
```

才能在开机时启动 smartd，但经过我实际测试，有没有这条语句都会启动 smartd

----

配置文件默认设置为监控所有硬盘的 SMART 错误，但不会发送通知邮件，需要在配置文件中设置

```bash
DEVICESCAN -m address@domain.com # 使用 -m 添加邮件通知
```

也可以这样来监控指定的硬盘

```bash
/dev/sda -m address@domain.com
/dev/sdb -m address@domain.com
```

如果你想邮件通知后，再执行系统关机、或向别的邮箱发送邮件，可以使用
`-M exec` 参数指定一个脚本发送邮件后自动执行

```bash
DEVICESCAN -m address@domain.com -M exec /usr/local/bin/smartdscript
```

脚本里可以使用一些 smartd 传过来的变量，见示列

```bash
#!/bin/sh

# some code ...

# 向其他邮箱发送邮件
echo "$SMARTD_MESSAGE" | mail -s "$SMARTD_FAILTYPE" "address@domain.com"

# 执行关机命令
shutdown -h now

# some code ...
```

如果你需要定时启动自检，并在出现问题时发送邮件，可以这样设置

```bash
# 每周六凌晨两点短自检，每月二十号凌晨两点长自检
DEVICESCAN -H -l error -l selftest -s (S/../../6/02/|L/../20/./02) -m address@domain.com -M diminishing
```

`-H、-l error、-l selftest` 指令作用为检测 smart 状态，`-s` 为定时自检，按照 `(T\MM\DD\d\HH)` 格式

- T 代表以下类型
  - L 长测试
  - S 短测试
  - C 传输测试 **仅限ATA**
  - O 离线测试 **仅限ATA**

- 其它参数如下
  - `MM` 月份
  - `DD` 日期
  - `d` 星期几，1 代表星期一，2 代表星期二，以此类推
  - `HH` 小时 (24 小时制)

可以使用 | 来指定多个自检时间

```bash
# 每周一、五的两点短自检和每月十五号凌晨五点长自检
DEVICESCAN -s (S/../../(1|5)/02|L/../10/./05)

# 四月、八月、十二月的十五号凌晨两点进行一次长自检
DEVICESCAN -s (L/(04|08|12)/15/./02)
```

因为我目前只用到这些功能，更多的如温度检测、能耗管理敬请参阅 [archwiki](https://wiki.archlinux.org/title/S.M.A.R.T.#smartd)

顺带 **重要资料一定要做多份备份**，云盘、NAS、有条件还可以异地冷储存，定时查看 smart 的数据，一旦快到临界点或者有报错了，及时转移数据到新的硬盘，避免存了几年的密藏资源付之一炬！

## Reference

- [S.M.A.R.T.](https://wiki.archlinux.org/title/S.M.A.R.T.)
- [smartd.conf.5](https://man.archlinux.org/man/smartd.conf.5)
- [使用 smartmontools 查看硬盘的健康状态](https://linux.cn/article-4461-2.html)
- [How to configure smartd and be notified of hard disk problems via email](https://linuxconfig.org/how-to-configure-smartd-and-be-notified-of-hard-disk-problems-via-email) 这个有教你使用 `msmtp` 做邮件转发
