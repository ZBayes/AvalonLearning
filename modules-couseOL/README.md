#司徒正美Avalon教程**的笔记**-组件部分
From 简书

##
暂时没有摘要

[TOC]

## 一步步编写avalon组件01：弹出层组件
> 司徒正美 2016年06月27日发布

网址：[一步步编写avalon组件01：弹出层组件](https://segmentfault.com/a/1190000005808167)

首先需要搭建环境，包括webpack以及各种loader配置。
![npminit1]()
![npminit2]()


```json
{
  "name": "ms-modal",
  "version": "1.0.0",
  "description": "modal",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com.RubyLouvre/ms-modal.git"
  },
  "dependencies": {
    "avalon2": "~2.1.1",
    "url-loader": "0.5.7",
    "node-sass": "^3.8.0",
    "sass-loader": "^3.2.2",
    "style-loader": "~0.13.1",
    "css-loader": "~0.8.0",
    "text-loader": "0.0.1",
    "webpack": "^1.13.1"
  },
  "author": "RubyLouvre",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/RubyLouvre/ms-modal/issues"
  },
  "homepage": "https://github.com/RubyLouvre/ms-modal#readme"
}
```

根据下图建立相应目录。