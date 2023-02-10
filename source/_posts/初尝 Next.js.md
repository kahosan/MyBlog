---
title: 初尝 Next.js
date: 2023-02-08 09:24:29
tags: [Typescript, Next.js]
categories: [React]
---

学到了很多，嗯

<!-- more -->

## 为什么使用 Next.js

> 虽然但是，Next.js 是一个基于 React 的应用框架。包括静态及服务器端融合渲染、支持 TypeScript、智能化打包、文件路由、简单的 API 路由、快速刷新...

只是刚好能用上 Next.js 简单的 API 路由和想尝试 SSR 渲染罢了（

## 用它做什么

自从组了 NAS 后，使用 Docker 部署的服务就越来越多。而且都是用的 IP:PORT 这样的形式访问，之后就配置了 Nginx 来用域名的方式访问

然而这种方式还是不够简单，要记一堆子域名。所以就打算做一个导航页，要支持在线编辑功能并且不依赖数据库，尽可能简单一些。最重要的是——**要好看！**（这好像和框架搭不上半毛钱关系）

## 开始

那么很简单的，用一个 JSON 文件来提供数据就行了。因为这个站点我默认是跑在服务器、电脑上，所以这种数据文件都是直接放在项目根目录。如果要支持 Vercel、Github Pages 部署的话，可以用对象存储。如 CloudFlare 的 R2，支持它的 API 就可以了

最初期是使用 Preact + Vite 来实现的。在线编辑功能通过 Github 的 API 来 commit 新的数据到 JSON 文件，触发 Github Pages 的构建。因为不想再写一个后端，所以绕了一大圈，，，

### API

在 Next.js 上，可以在 `pages/api` 目录中新建一个文件夹，这里就写 `services`
然后新建 `index.ts` 并默认导出 `handler` 函数就实现了一个简单的 API

```ts
// route: /api/services
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json('仅支持 GET 方法');
  } else {
    // 可以使用 async/await 语法
    res.status(200).json(await getServicesData());
  }
}
```

如果有动态路由的需求，可以再新建一个 `[action].ts` 文件，在其中对字段做判断就可以实现动态路由了

```ts
// route: /api/services/[action]
export default async function handler(req, res) {
  const { action } = req.query;
  const data = req.body;

  if (action === 'add') {
    await addServicesData(data);
  } else if (action === 'delete') {
    await deleteServicesData(data);
  }
  ...
}
```

### SSR

为什么用 SSR？

- 数据随时会更新，SSG 会导致首屏加载时 build 的数据被客户端获取的新数据覆盖，UI 会重新渲染产生偏移。视觉上很难受
- 数据量不大，对服务器基本没有性能负担
- 首屏秒加载
- 没用过

Next.js 提供了两个获取数据的方法 `getStaticProps` 和 `getServerSideProps`
可以很方便的将所需数据注入到页面中

这里以 `getServerSideProps` 为例，导出方法 Next.js 就会自动辨别为 SSR 模式

```tsx
// pages/index.tsx
export default function Page({ data }: Props) {
  return <div>{data.name}</div>;
}

export async function getServerSideProps() {
  const data = await getData();
  return {
    props: {
      data
    }
  }
}
```

因为 HTML 是在服务器进行渲染的，那么编写 hooks、components 时都需要考虑使用到的东西是不是客户端 only
比如用到了 `localstorage`、`document`、`window` 上的属性等

可以用 `useEffect` 来分离客户端和服务端的逻辑

```ts
useEffect(() => {
  if (isBrowser) {
    ...
  }
}, [dep])
```

### 暗黑模式

一般浏览器渲染是解析 HTML 文档 -> 构建样式 -> 下载执行 JavaScript（分异步和同步方式）-> 渲染（简略
在目前都使用框架的情况下，执行 js 的时候就会动态改变 DOM 结构
而 SSR 模式是在服务端就将 HTML 渲染好，客户端只需要展示

这就出现一个问题，暗黑模式通常是将用户选择的值保存在 `localstorage` 中。服务端渲染时是无法获取这个值的，页面展示时因为默认的模式值不同会出现一个 **闪烁** 的情况。想象一下大晚上你不小心刷新了一下网页然后一个白屏把你眼睛闪瞎了（

解决这个问题也不难，只要在生成的 HTML 插入一段 js 到 `<head>` 标签来提前切换模式就好了

> `index.css` 文件要包含 `html.dark` 的样式

```ts
// 插入到 <head> 标签
const theme = window.localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
if (theme !== 'dark' && theme !== 'light') {
  document.documentElement.classList.add(systemTheme);
} else if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}
```

Next.js 可以很方便的创建一个 `_document.tsx` 来自定义 `<html>` 和 `<body>` 标签的内容，可以把上述内容直接插进去

```tsx
// pages/_document.tsx
export default function MyDocument = () => {
  return (
    <Html>
      <Head />
      <body className="transition-color duration-300">
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              if (!window.localStorage) return;
              const theme = window.localStorage.getItem('theme')
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : ''
              if (theme !== 'dark' && theme !== 'light') {
                document.documentElement.classList.add(systemTheme);
              } else if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              };
            })()
          `
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
```

### 数据获取

推荐用 [swr](https://swr.vercel.app/zh-CN) 库来做这个，该有的它都有，非常高级
可以参考这篇文章——[为什么你不应该在 React 中直接使用 useEffect 从 API 获取数据](https://blog.skk.moe/post/why-you-should-not-fetch-data-directly-in-use-effect/#Geng-Duo-Wo-Huan-Yao-Geng-Duo)

通过 swr 提供的 `fallback` 「预请求数据」功能可以填充特定 `key` 的初始值
SSR、SSG 模式，在特定 `key` 的 `data` 为空的情况下就会直接使用初始值，而后再进行一次请求来对比新的数据和初始值是否有变化判断是否更新视图

```tsx
export default Page({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <DataView />
    </SWRConfig>
  )
}

export async getServerSideProps() {
  const data = await getData();

  return {
    props: {
      fallback: { '/api/xxx': data }
    }
  }
}

// components/DataView.tsx
export default function DataView() {
  const { data, error } = useSWR('/api/xxx', fetcher);

  if (error) return <ErrorHandler error={error} />

  return (
    <div>{data.name}</div>
  )
}

```

这样做有个好处是数据统一了，只要新建一个叫 `useData` 的 swr hook 就能保证使用它的组件都能得到最新的数据
不然就用全局 `store` 或者 `useContext` 一层层把数据传递下去，还要处理与 swr 的额外逻辑，挺麻烦（

### 结合

把这些功能都结合起来，就构成了一个简单的前后端一体 ~~还很好看~~ 的应用
可以访问 [home-page](https://home-page-kahosan.vercel.app/) 体验一下

## 总结

这篇流水账简单的记录了我使用 Next.js 的思路。其中收获最大的即是考虑到服务端与客户端之间的逻辑，一些以前不理解的写法现在都获得了解答。通过对编写 APP 时的开发、使用体验，对什么情况下使用怎样的渲染模式有了一定的了解

而项目中其他使用到的技术如状态管理、原子化 CSS 可能留到下篇文章来说明（也可能会咕咕咕

## 参考

- [彻底理解服务端渲染 - SSR原理](https://github.com/yacan8/blog/issues/30)
- [Next.js Docs](https://nextjs.org/docs)
- [SWR Docs](https://swr.vercel.app/zh-CN/docs/with-nextjs#pre-rendering-with-default-data)
- [question on preventing css flickering when implementing dark mode](https://github.com/vercel/next.js/discussions/12533)
