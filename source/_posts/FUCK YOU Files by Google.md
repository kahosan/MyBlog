---
title: FUCK YOU Files by Google
date: 2024-07-27 13:49:20
tags: [坑, 谷歌相册, 文件极客]
categories: [Google]
---

世上最恐怖的事情之一，你手机里的图片不断消失而你却不知道是谁干的

<!-- more -->

## 操蛋的星期六

中午闲来无事，打算鉴赏一下最近收集的涩图。然后就发生了灵异事件

> *我他妈收集的涩图几乎全不见了，差点哇的一声哭出来*

不过想起来我有用 Syncthing 和谷歌相册还有 Immich 做了备份，连 OneDrive 也有一份。顿时松了一口气

但也不能放着罪魁祸首逍遥法外，接下来就是侦探时间了

## 存储空间隔离

前面说到我有用 Syncthing 做备份，熟悉这个应用的小伙伴立马就察觉到了它的嫌疑。因为它是双向同步，虽说可以用来做备份，但是一方做了修改时另一方也会同步修改。所以如果是 NAS 那边删除了文件，确实也会同步删除手机上的文件。随即花了一些时间调查一番，却没有找到决定性的证据

而且，当我冷静下来思考时。发现只有手机上 `Pictures` 路径的图片被删除了，包括 NAS 也是只有这个同步目录被删除，其他路径的图片与文件都没有遭到毒手

这基本能锁定嫌疑为手机上的某个软件了

然后我突然想起来我有装一个叫存储空间隔离的软件，其有个功能叫文件监视。尝试了一下，输入路径进行过滤后与文件被删除的时间做对比（文件夹修改时间），发现居然是谷歌相册，访问图片的时间完全对的上

## 谷歌相册

这时我已非常自信抓到了罪魁祸首，然后马上就被打脸了

谷歌相册如果想删除本地的文件，在设置中只有一个「释放此设备空间」的选项。但这个选项是需要人为操作的，也没有发现什么定时删除已同步图片的设置

但是文件监视里明确了作案时间时，只有谷歌相册在访问图片
解铃还须系铃人，谷歌犯下得罪也只有谷歌来偿还了（打开谷歌搜索）

## 文件极客（Files by Google）

经过一番检索，我发现一个 [帖子](https://android.stackexchange.com/questions/249378/clarification-on-delete-backed-up-photos-automatically-for-google-photos) 其中有这样一句话：

> Note that the automatic cleanup is a feature of the [Files by Google](https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.files) app as mentioned on its [help center](https://support.google.com/files/answer/10862356). Also, note that it's only available on Pixel devices. On Samsung and other devices, the "Smart Storage" setting is unavailable.

然后在这个软件中的设置找到了这样一个选项

![Files by Google](https://cf-image-hosting.kahosan.workers.dev/file/23e47f056712a65bee4c6.png)

这选项居然是他妈默认开启的，我有点无语了
不过问题好歹是解决了，可喜可贺可喜可贺

<details>
<summary style="cursor: pointer; width: min-content">?</summary>
FUCK YOU GOOGLE！！！
</details>