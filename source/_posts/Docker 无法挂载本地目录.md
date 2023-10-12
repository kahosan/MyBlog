---
title: Docker 无法挂载本地目录
date: 2023-10-12 10:27:43
tags: [Docker]
categories: [坑]
---

不要使用 `docker compose restart`

<!-- more -->

如果你更改了 `docker-compose-yaml` 中的 `volume`，却发现该映射进的目录并不存在于容器中。很可能你使用的是 `docker compose restart` 或是 `stop` 后再 `start`

需要使用 `docker compose up` 才能使更改生效

> 文档中关于 [`start`](https://docs.docker.com/engine/reference/commandline/compose_start/) 和 [`up`](https://docs.docker.com/engine/reference/commandline/compose_up/) 的描述