---
title: 摸了个整理 Pixiv 图片的脚本
date: 2021-10-18 22:23:52
tags: [日常, 脚本]
categories: [生活， 视觉]
---

闲的时候翻手机里存的色图，突然就犯病了
<!-- More -->

正好要在电脑上做个备份，就想把备份的图分类放到对应画师的文件夹整理好
拿 py 摸了一个脚本，勉强能用吧 [pixiv-sort-artist.py](https://gist.github.com/Cahosa/69e201dd0438bac4bd8e8e512bbbfd2b)
可以配合 [pixiv-file-rename.py](https://gist.github.com/Sg4Dylan/6f678e7bef35c6985082750afd291dd5) 这个给图片先重命名后在整理，注意脚本里的正则需要修改一下

抄了些 C 佬的代码，谢谢 C 佬 （<ゝω・）☆

### 使用前  

![old.png](https://cdn.jsdelivr.net/npm/xfb@0.5.0/img/new/old.png)

### 使用后  

![new.png](https://cdn.jsdelivr.net/npm/xfb@0.5.0/img/new/new.png)
