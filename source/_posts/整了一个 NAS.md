---
title: 整了一个 NAS
date: 2022-03-15 20:55:27
tags: [NAS, 玩具, Ubuntu]
categories: [生活, 技术]
---

可能我想要的只是一个好玩的玩具

<!-- more -->

## 先贴配置单

> CPU: Intel G3220
> 主板: 磐石至尊 ITX-B85
> 散热: 主板自带小风扇
> 内存: 光威 DDR3 8G
> 电源: 益衡 7025B
> 机箱: 群友送的星际蜗牛壳子
> 硬盘: 希捷 X12 12TB 垂直盘 *2

主板和 CPU 是套装，到货之后一看发的是 G3240，感谢发货的老哥（
总价大概 2800 (两块硬盘就快 2000，真贵。

没拍照，借用下网图，一模一样的

{% img https://npm.elemecdn.com/xfb/img/new/星际蜗牛C款.jpg 星际蜗牛 %}

## 系统选择

NAS 的系统选择挺多的，比较常见的：黑群晖，True NAS，ESXi，还有听说拆腻子比较喜欢的 unRAID。

但我只有带存储、同步功能，偶尔能充当开发机用下的简单需求，所以就没有用以上的高级玩意，选择了能自由配置的 Ubuntu。

系统安装配置之类的就跳过了，网上一搜一大把。

{% img https://npm.elemecdn.com/xfb/img/new/ubuntu.png ubuntu %}

## 软件配置

先说比较主要的，存储共享方面我使用常见的 SMB 为抓手，打通瑟图与 NAS 之间的链路，以 aria2 + qBittorrent 等工具形成的组合拳，构建网络仓鼠生态，解决不能随时使用珍藏瑟图来瑟瑟的痛点，实现人与瑟图的双向奔赴（犯病了

### Samba

简单配置一下，以下所有命令均在 Ubuntu Server 20.04 中操作

#### 配置共享目录与用户

* 更新软件包并安装 Samba
  
  ```console
  $: sudo apt update && sudo apt install samba
  ```

* 创建共享目录
  
  ```console
  $: sudo mkdir /path/<share dir>
  ```

* 将该文件夹的群组所有权设为 sambashare
  
  ```console
  $: sudo chgrp sambashare /path/<share dir>
  ```

* 创建一个 Linux 用户，将其设置成 Samba 用户
  
  ```console
  $: sudo useradd -M -s /usr/sbin/nologin -G sambashare <username>
  ```

  * 将目录所有权设为 sambashare 和 username
  
    ```console
    $: sudo chown <username>:sambashare /path/<share dir>
    ```

  * 设置成 Samba 用户，根据提示输入密码
  
    ```console
    $: sudo smbpasswd -a <username>
    ```

  * 启用设置好的 Samba 用户
  
    ```console
    $: sudo smbpasswd -e <username>
    ```

防止无法读写其他用户创建的文件
  
  ```console
  $: sudo chmod 2770 /path/<share dir>
  ```

#### 配置 Samba 共享

* 使用你熟悉的编辑器打开 /etc/samba/smb.conf

  ```console
  $: sudo vim /etc/samba/smb.conf
  ```

* 在最底下添加如下代码

  ```bash
  [<share dir name>]
    path = /path/<share dir>
    browseable = no
    read only = no
    force create mode = 0660
    force directory mode = 2770
    valid users = <username> @sambashare
  ```

* 最底下可能有两个已经配置好的打印服务，根据需要可以自行注释

* 最后重启 Samba 服务
  
  ```console
  $: sudo systemctl restart nmbd && sudo systemctl restart smbd
  ```

受限于咱的发霉皮 3B+，内网只有 160 Mbps 左右的速度，丢人了，，，
{% img https://npm.elemecdn.com/xfb/img/new/speed.png 下载速度 %}

### 下载服务

尝试了下使用 Docker-Compose 来安装管理 Aria2 和 qBittorrent
不得不说 Docker 使用是真的方便，对咱这种懒人来说复制一下 `docker-compose.yaml` 文件，然后 `docker-compose up -d` 简单配置一下容器的设置就可以不用管了

* Aria2 和 qBittorrent 使用的这两个镜像 [p3terx/arir2-pro](https://hub.docker.com/r/p3terx/aria2-pro) [linuxserver/qbittorrent](https://hub.docker.com/r/linuxserver/qbittorrent)

### 文件同步

这方面还没找到比较好的方案，先咕咕了

### 其他

挂了一个 `code-server` 服务写以上的配置文件，挺好用的
还能写写小项目，不用换一个地方就要整一遍环境，超方便的

还有，，

装了一上午，发现差两个螺丝

{% img https://pbs.twimg.com/media/FNyGD0hVsAIg2Aw?format=jpg&name=large fxxk %}

装好后，发现没插内存条...

{% img https://pbs.twimg.com/media/FNyhd_hVsAAy3Fp?format=jpg&name=large fxxk %}

我 tm

> 部分引用自 [如何在Ubuntu 20.04上安装和配置Samba](https://www.myfreax.com/how-to-install-and-configure-samba-on-ubuntu-18-04/)