---
title: TypeScript 使用 tsc 编译成 JavaScript 后的 Alias 踩坑之旅
date: 2022-04-27 14:26:38
tags: [踩坑, 编译]
categories: [TypeScript]
---

这个问题让我掉了不少头发,,

<!--more-->

## 踩坑之始

昨晚我敲下 `tsc --project tsconfig.json` 后，等待编译完成

然后进入 dist 文件夹运行 `node index.js` 本以为万事大吉，但事与愿违，看着那个 `Error Cannot find module '@/xxx'` 我陷入了沉思...

初步判断是我在 `tsconfig.json` 里设置的 `paths` 出了问题

## 爬坑之时

遇到问题了那怎么办啊，当然是求助百度、谷歌、stackoverflow 呀

随即我就在掘金上找到一篇文章，说 tsc 编译时不会处理映射后的路径，要不用 `webpack` 打包、要不使用 `module-paths` 包

当然，写的小工具是不会用 `webpack` 杀鸡的，那就先试试 `module-paths` 包吧

先用你喜欢的包管理工具安装 `module-paths` 接着在 `package.json` 写入配置，然后在入口文件调用，像这样

```json
{
 // Aliases
 "_moduleAliases": {
  "@root"      : ".", // Application's root
  "@deep"      : "src/some/very/deep/directory/or/file",
  "@my_module" : "lib/some-file.js",
  "something"  : "src/foo", // Or without @. Actually, it could be any string
 }
}
```

```javascript
// 在入口文件最顶端调用即可
require('module-alias/register')
```

接着运行下编译的文件，啪、很快啊
报错立马就弹出来了，nmd 我不玩了

中文搜索是靠不住了，接着去 stackoverflow 看了下
找到一个两年前的[问题](https://stackoverflow.com/questions/59179787/tsc-doesnt-compile-alias-paths)。看来这个也有蛮久远了，到现在都还没解决

也是有两个答案，使用 `ttypescript` 和 `@zerollup/ts-transform-paths` 或者 `tsc-alias` 。看名字我觉得 `tsc-alias` 能直接解决我的问题了

使用方法很简单，安装下 `tsc-alias` 然后使用 `tsc && tsc-alias` 进行构建就可以了。

但我这里还是踩了一个小坑，如果你引入文件的方式是这样

```javascript
import xxx from "@/xxx/xxx" // 不包括文件扩展名
```

需要在 `tsconfig.json` 中加入

```json
// 加入到最底部就行
{
 "tsc-alias": {
  "resolveFullPaths": true
 }
}
```

## 尾声

在某个微信群里吐槽了这事后，有大佬告诉我其实可以通过在 `package.json` 里使用 `imports` 字段

```json
{
  "imports": {
    "#src": {
     "./src/*.js"
    }
  }
}
```

因为这个问题实质上是 js 文件不明白映射的别名是个啥，只要让它知道这是个啥就行了。但这个方法只能使用 # 开头的别名设置，所以有点麻烦（也不好看

希望之后这个问题能得到修复吧
