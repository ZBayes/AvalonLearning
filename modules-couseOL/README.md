#司徒正美Avalon教程**的笔记**-组件部分
From 简书

## 摘要
暂时没有摘要

[TOC]

## 一步步编写avalon组件01：弹出层组件
> 司徒正美 2016年06月27日发布

网址：[一步步编写avalon组件01：弹出层组件](https://segmentfault.com/a/1190000005808167)

### webpack及各种loader配置
首先需要搭建环境，包括webpack以及各种loader配置。
![npminit1](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/npminit1.png)

在生成的package.json中修改为下面形式。
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

![npminit2](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/npminit2.png)

这样一来，环境算是基本搭建完成。

### 样式与模板
根据下图建立相应目录。
![建立目录](https://segmentfault.com/img/bVywBD)

style.scss编辑下面代码：
```scss

@import "./font.scss";
@import "./btn.scss";
.modal-mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(55,55,55,.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

}

.confirm-content{
  padding-left: 30px;
  padding-top: 30px;
  padding-bottom: 30px;
}



.modal-confirm{
  width: 400px;
  box-sizing: border-box;
  padding: 30px 40px;
  background-color: #fff;
  border-radius: 6px;
  transition: transform .3s ease;
  i{
    color: #fa0;
    font-size: 24px;
    position: relative;
    top: 2px;
  }

  .confirm-btns{
    text-align: right;
  }
}

.modal-box{
  width: 520px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 6px;
}


@media only screen and (max-width: 640px) {

  .modal-confirm{
    width: 100%;
    margin: 0 20px;
    padding: 10px 20px;

  }
  .modal-box{
    width: 100%;
    margin: 0 20px;
  }

}

.modal-header{
  padding: 13px 18px 14px 16px;
  border-bottom: 1px solid #e9e9e9;
  position: relative;
  i{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 14px;
    cursor: pointer;
  }
  h3{
    font-size: 14px;
  }
}

.modal-body{
  padding: 16px;
}

.modal-footer{
  padding: 10px 18px 10px 10px;
  border-top: 1px solid #e9e9e9;
  background: #fff;
  border-radius: 0 0 6px 6px;
  text-align: right;
}

.modal-enter {
  opacity: 0;
}
.modal-enter-active{
   opacity: 1;
   .modal-confirm{
      transform: scale(1.1); 
   }
   .modal-box{
      transform: scale(1.1); 
   }
}
.modal-leave {
   opacity: 1;
  
}
.modal-leave-active{
   opacity: 0;
   .modal-confirm{
      transform: scale(1.1); 
   }
   .modal-box{
      transform: scale(1.1); 
   }
}
.modal-enter,.modal-leave {
  transition: all .3s ease;
}


```

template如下：
```html
<div class="modal-mask"  ms-visible="@isShow" ms-effect="{is:'modal'}">
    <div class="modal-box">
        <div class="modal-header">
            <h3>{{@title}}</h3>
            <i class="iconfont icon-cross" ms-click="@cbProxy(false)"></i>
        </div>
        <div class="modal-body">
            <slot name="content"></slot>
        </div>
        <div class="modal-footer">
            <button class="btn" ms-click="@cbProxy(false)">取 消</button>
            <button class="btn btn-primary" ms-click="@cbProxy(true)">确 定</button>
        </div>
    </div>
</div>
```

>需要说明一下modal组件一般要直接放在body底下，是其直接子元素，方便其蒙板能罩住整个页面。上面的.modal-mask就是蒙板，.model-box就是弹出层，弹出层里面又分三大部分，标题栏，内容区与底部的按钮区。内容区比如复杂，我们使用DOM插入点机制来设置，换言之，那里使用slot元素占位。以后我们直接在自定义标签里面添加对应标签，它就会挪到slot的位置上了！

### 视图模型
modal组件一般有如下属性：
1. isShow: 用于控制显示与否
2. title: 标题
3. content: 内容，这个是一个非常复杂的HTML结构
4. 回调: 这里设计了两种回调onOk, onCancel。它们的行为很相近，因此我在模板上都封装成cbProxy,通过传参来区分它们。

index按照下面形式编辑：
```javascript
var avalon = require('avalon2')
require('./style.scss')

avalon.component('ms-modal', {
    template: require('text!./template.html'),
    defaults: {
        title:'modal',
        isShow: true,
        cbProxy: function(ok){
           
        }
    },
    soleSlot: 'content'
})
```
运用require形式，代码主题使用avalon.component。defaults对象里面定义组件要用到的属性，soleSlot是占位元素slot的名字。

### 事件与钩子
实质上就是一个事件cbProxy。
```javascript
cbProxy: function (ok) {
    var cbName = ok ? 'onConfirm' : 'onClose'
    if (this.hasOwnProperty(cbName)) {
        var ret = this[cbName]()
        if (ret !== false || (ret && typeof ret.next === 'function')) {
            this.isShow = false
        }
    } else {
        this.isShow = false
    }
},
```

阻止第一次动画效果：
```javascript
onReady: function(){
    var el = this.$element
    el.style.display = 'none'//强制阻止动画发生
    
    this.$watch('isShow', function(a){
        if(a){
           document.body.style.overflow = 'hidden' 
        }else{
           document.body.style.overflow = ''
        }
    })
}
```

建立入口文件main.js：
```javascript
var avalon = require('avalon2')
require('./index')
avalon.define({
    $id: 'test',
    show: function(){
        this.config.isShow = true
    },
    config: {
        isShow: false,
        onCancel: function(){
            alert('cancel')
        },
        onOk: function(){
            alert('ok')
        },
        title:'这是测试'
    }
})

module.exports = avalon 

```

### 打包运行
编辑webpack.config.js，如下所示。
```javascript
var webpack = require('webpack');

var path = require('path');


function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}
var api = heredoc(function () {
    /*
     avalon的弹出层组件
     1.  isShow: 用于控制显示与否
     2.  title: 标题
     3.  content: 内容，这个是一个非常复杂的HTML结构
     4.  onOk
     5:  onCancel
     
     使用
     兼容IE6-8
    
     <xmp ms-widget="[{is:'ms-modal'}, @config]">
     <p>弹窗的内容</p>
     <p>弹窗的内容</p>
     <p>弹窗的内容结束!</p>
     </xmp>
  
     只支持现代浏览器(IE9+)
    
     <ms-modal ms-widget="@config">
     <p>弹窗的内容</p>
     <p>弹窗的内容</p>
     <p>弹窗的内容结束!</p>
     </ms-modal>
      
     */
})

module.exports = {
    entry: {
        index: './main'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'avalon'
    }, //页面引用的文件
    plugins: [
        new webpack.BannerPlugin('弹出层组件 by 司徒正美\n' + api)
    ],
    module: {
        loaders: [
            //ExtractTextPlugin.extract('style-loader', 'css-loader','sass-loader')
            //http://react-china.org/t/webpack-extracttextplugin-autoprefixer/1922/4
            //http://stackoverflow.com/questions/34639720/webpack-font-include-issue
            // https://github.com/b82/webpack-basic-starter/blob/master/webpack.config.js 
            {test: /\.scss$/, loader:'style!css!sass',exclude: /node_modules/},
            {test: /\.(ttf|eot|svg|woff2?)((\?|#)[^\'\"]+)?$/, loader: 'url-loader'}

        ]
    },
    
    resolve: {
        extensions: ['.js', '', '.css']
    }
}
```
然后在该路径下命令行webpack。

![popwinWebpack1](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/popwinWebpack1.png)

建立一个html后查看结果：
```html
<!DOCTYPE html>
<html>
    <head>
        <title>modal</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="./dist/index.js"></script>
    </head>
    <body ms-controller="test">
        <xmp ms-widget="[{is:'ms-modal'}, @config]">
          <p>弹窗的内容</p>
          <p>弹窗的内容</p>
          <p>弹窗的内容结束!</p>
        </xmp>
    <p><button ms-click="@show">显示弹出</button></p>
    </body>
</html>
```
此时的路径是这样的：

![popwinPath1](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/popwinPath1.png)

PS：
- 运行结果报错，index.js:6109 Uncaught TypeError: effect[action] is not a function. 
- webpack知识需要补补。
- 源代码[下载链接](https://github.com/RubyLouvre/ms-modal)

### 与font-awesome整合
从上面的[下载链接](https://github.com/RubyLouvre/ms-modal)中载入font和stylesheets。

对index.js调整。
```javascript
require('./stylesheets/style.scss')
```

style.scss也需要修改
```scss
@charset 'utf-8';
//引入子模块
@import "./font-awesome.css";
@import "./btn.scss";
```

webpack里面加入extract-text-webpack-plugin的支持。
```javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");



//.....
    module: {
        loaders: [

          {test: /\.scss$/, loader:ExtractTextPlugin.extract('css!sass'),exclude: /node_modules/},
          {test: /\.(ttf|eot|svg|woff2?)((\?|#)[^\'\"]+)?$/, loader: 'file-loader'}

        ]
    },
    plugins: [new ExtractTextPlugin("styles.css")],
```

模板改成
```html
<div class="modal-mask"  ms-visible="@isShow" ms-effect="{is:'modal'}">
    <div class="modal-box">
        <div class="modal-header">
            <h3>{{@title}}</h3>
            <i class="icon-collapse-alt icon-large modal-close" ms-click="@cbProxy(false)"></i>
        </div>
        <div class="modal-body">
            <slot name="content"></slot>
        </div>
        <div class="modal-footer">
            <button class="btn" ms-click="@cbProxy(false)">取 消</button>
            <button class="btn btn-primary" ms-click="@cbProxy(true)">确 定</button>
        </div>
    </div>
</div>

```

page.html改成：
```html
<!DOCTYPE html>
<html>
    <head>
        <title>modal</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
        <link href="./dist/styles.css" rel="stylesheet">
        <!--[if IE 7]>
          <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome-ie7.min.css">
        <![endif]-->
        <script src="./dist/index.js"></script>
    </head>
    <body ms-controller="test">
        <xmp ms-widget="[{is:'ms-modal'}, @config]">
          <p>弹窗的内容</p>
          <p>弹窗的内容</p>
          <p>弹窗的内容结束!</p>
        </xmp>
    <p><button ms-click="@show">显示弹出</button></p>
    </body>
</html>

```

报错：
![popwinError1](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/popwinError1.png)
![popwinError2](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/modules-couseOL/pic/popwinError2.png)

## 一步步编写avalon组件02：分页组件
> 司徒正美 2016年06月28日发布

网址：[一步步编写avalon组件02：分页组件](https://segmentfault.com/a/1190000005820855)

