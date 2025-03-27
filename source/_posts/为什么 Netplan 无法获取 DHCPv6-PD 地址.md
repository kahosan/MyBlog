---
title: 为什么 Netplan 无法获取 DHCPv6-PD 地址
date: 2025-03-27 16:25:50
tags: [Netplan]
categories: [IPv6]
---

AI 暂时还替代不了 Google

<!--more-->

出现这个问题，可以看看下列环境与你是否有相似之处

1. 上游 DHCPv6 服务器下发的是 PD 地址
2. 上游只有 DHCPv6，没有 RA
3. 客户端使用 Netplan 配网（废话

---

首先看一下 `/run/systemd/network/` 里的文件，接着照抄以下命令行操作
因为 Netplan 不支持配置 PD 相关的配置项，这里使用覆盖生成后的配置文件的方法来加上相关配置项

```sh
# 我这里是 10-netplan-eth0.network 和 10-netplan-eth0.link
ll /run/systemd/network

# 注意文件夹名称要和上述的一致 10-netplan-eth0.network
sudo mkdir /etc/systemd/network/10-netplan-eth0.network.d
# 这里文件名称只要后缀是 .conf 就行
sudo touch /etc/systemd/network/10-netplan-eth0.network.d/override.conf
```

将下面的配置项写入 `override.conf` 文件中

```conf
[Network]
DHCPv6PrefixDelegation=yes

[DHCPv6]
PrefixDelegationHint=::/60
WithoutRA=solicit

[Route]
Destination=::/0
Gateway=route-ip
```

解释一下这些配置项：

- `DHCPv6PrefixDelegation=yes`
  - 从获取到的 PD 地址中取一个分配给 eth0
- `PrefixDelegationHint=::/60`
  - 上游下发的 PD 前缀长度
- `WithoutRA=solicit`
  - 允许 DHCPv6 Client 在没有 RA 的情况下启动
- `Destination=::/0`
  - 没有 RA 的情况下不会配置默认路由和网关
- `Gateway=route-ip`
  - 这里的 route-ip 请使用网关的内网 v6 地址

---

更详细的说明请参阅 systemd-network 的[文档](https://www.freedesktop.org/software/systemd/man/latest/systemd.network.html#id-1.60.4)