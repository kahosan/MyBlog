---
title: JavaScript 获取明天的日期
date: 2022-04-26 14:26:38
tags: [日期, Tips]
categories: [JavaScript]
---

遇到了一个问题需要明天的时间戳
记录一下

<!--more-->

起手先打开 [MDN 的 Date 页面](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) ，看看有什么方法可以用的

研究了下发现有两个办法，一个是用 `new Date()` 构造函数，像这样

```javascript
const date = new Date()
const day = 1
// 构造出来的日期默认是 00:00 有需要可以添加时、分、秒的参数
const tommorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + day)
```

或者用 `setDate()` 方法，像这样

```javascript
const date = new Date();
const tomorrow = date.setDate(date.getDate() + 1);
```

> 22/6/3 更新
> 根据时区和夏令时的不同，时间转换似乎会出问题，我没有去测试过（毕竟中国也不实行夏令时），有兴趣可以去 [stackoverflow](https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript) 或者 [这篇文章](https://zhuanlan.zhihu.com/p/346276216) 查询
