---
title: 第一次购买域名与VPS
date: 2021-03-13 21:39:49
tags: [域名, VPS]
categories: [消费]
---

上学时就对有自己的域名与服务器挺期待的，但碍于一些问题，一直没有动作。

<!-- More -->

在临近毕业，并开始实习的时候，咱终于有能力捣鼓属于自己的网站了。
（咱的博客其实是看到某位大佬的博客，觉得挺好看的就抄了一个，照着网上的教程白嫖了Github）

## 购买域名

因为咱不想备案、不使用国内服务器，便选择了国外的注册商。
在咕咕噜上搜索一番后，再三对比（懒得挑了）选择了价格便宜，并且支持支付宝以及微信的 [Namesilo](https://www.namesilo.com/)。
这里提供一个介绍了比较知名的注册商的文章 [适合国人的域名注册商推荐](https://tlanyan.me/domain-register-for-mainland/)。

主页面长这样，咱觉得还挺好看的（其实后台有毒）

{% img https://cdn.jsdelivr.net/npm/xfb/img/Namesilo.png namesilo %}  

<br/>

创建个账号，然后搜索下喜欢的域名是不是已经被购买了，没有的话直接点 Add 然后再点 checkout 购买就行了。

{% img https://cdn.jsdelivr.net/npm/xfb/img/buy.png namesilo %}

<br/>

弹出的页面确认下购买的域名是否正确，然后点 CONTINUE。
选择支付宝或者微信支付。（买的时候没有截图，就不放图了）

买完后点右上角的 Manage My Domains 里就能看到域名了，之后想换用 CF 还是继续用 Namesilo 自带的服务都是随你啦。

## 购买 VPS

因为没有经验，就买了群友推荐的一个大盘鸡，打算用来做远程下载。
供应商是 [HotlineServer](https://www.hotlineservers.com/) ，配置如下图：

{% img https://cdn.jsdelivr.net/npm/xfb/img/vps.png namesilo %}

<br/>

流程和之前买域名一样，不过买的时候**不能挂 VPN**，如果你填写的资料和 IP 不对应的话
账号就会被判 **Fraud（欺诈）**，只能发工单解释自己忘记关代理了。

这家支持支付宝，填完资料后直接购买就行了，然后创个密码连接 SSH 。
建议大家登机器第一件事就是把 SSH 密码登入关掉，改用密钥登入，不然鬼知道哪里的人就把你密码破解了拿去挖矿也说不定（
咱就中招了，CPU 一直 100% ，咕咕噜了一下，

{% img https://cdn.jsdelivr.net/npm/xfb/img/zz.png namesilo %}  

<br/>

`netstat -antlp` 命令有这个 IP 段的，`top` 命令 **kswapd0**  进程占用巨高的，基本就是中招了。

也算是积累经验了吧，咱的网络防范意识太弱鸡惹。
过段时间就弄台好点的服务器，把博客丢上去吧。
