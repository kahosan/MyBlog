---
title: JavaScript 获取明天的日期
date: 2022-04-27 14:26:38
tags: [日期, Tips]
categories: [JavaScript]
---

遇到了一个问题需要明天的时间戳
记录一下

<!--more-->

起手先打开 [MDN 的 Date 页面](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) ，看看有什么方法可以用的

研究了下发现有两个办法，一个是用 `new Date()` 构造函数，像这样

```javascript
const curTime = new Date.getTime();
const tomorrow = new Date(curTime + 24 * 60 * 60 * 1000).getTime();
```

或者用 `setDate()` 方法，像这样
```javascript
const date = new Date();
const tomorrow = date.setDate(date.getDate() + 1);
```

第一个比较粗暴，我推荐使用第二个方法，更方便的获取 n 天后的时间戳
