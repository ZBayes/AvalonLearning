# 司徒正美Avalon教程**的笔记**-From 简书
暂时没有摘要

[TOC]

## avalon2学习教程01
> 司徒正美 2016年04月06日发布

网址：[avalon2学习教程01](https://segmentfault.com/a/1190000004882326)

首先是第一个跑成功的avalon案例：(easy_example\first.html)
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                a: 111
            })
        </script>
        <style>
            .ms-controller{
                display:none;
            }
        </style>
    </head>
    <body>
        <div ms-controller="test">
            <input ms-duplex="@a" />
            <p>{{@a}}</p>
        </div>
    </body>
</html>
```

首先引用是我花的比较多的时间的一个，avalon的git上有很多同名的文件，到最后我在找到那个正确的文件，在dist文件夹下的才是最新最完整的，引用后直接能使用。
```html
<script src="avalon.js"></script>
```

结合教程和代码，大概说说个人的理解。  
```JavaScript
var vm = avalon.define({
    $id: "test",
    a: 111
})
```

首先给出avalon的定义，这个定义能够返回一个名为vm的特殊对象，这个特殊对象里面首先需要一个id，用于定义不同的avalon对象，这个对象会在后面在dom里面埋变量有用，另一个就是可能会用到的对象，在这里就是初始化对话框里面的内容。

```CSS
.ms-controller{
    display:none;
}
```

这段主要是设置对应的类不出现，具体原因后面会讲到。

```html
<div ms-controller="test">
    <input ms-duplex="@a" />
    <p>{{@a}}</p>
</div>
```

在一个dom对象里面埋了一个变量，ms-controller，其变量内容就是test，所以用的就是上面定义的avalon控制器，可以圈定vm的作用域，该vm中的变量就能使用，即里面的id和a，下面就是两个使用方式，ms-duplex是其中之一，另一个是双大括号。下面是司徒正美给出的解释：
>ms-duplex是双向指令，它既能将vm中对应的属性显示在页面上，为了标识这是vm上的属性， 我们要求用@符号带头。这可能与.NET的一些模板引擎（如Razor）相冲突，但据我所知，这些在.NET 中都是可以配置的。{{}}是纯粹的文本指令，它与ms-text很像，但更方便，用于单向将数据拍到页面上。

## avalon2学习教程02vm
> 司徒正美 2016年04月06日发布

网址：[avalon2学习教程02vm](https://segmentfault.com/a/1190000004882922)

在前面也提到了vm对象。
> **vm是一种特殊的数据结构**，看起来像普通对象，但它大部分属性都被重写了，从而实现“操作数据即操作视图”的效果。我们在定义vm时，一般需要定义$id，其次是其他业务数据属性，它们都是来自后端的数据表。

除此之外，还有很多别的对象，先列出来。
>- $events， 用于放我们的$watch回调
>- $fire, 用于触发某一个属性的所有回调
>- $watch， 用于监听某个属性的变化，当它变化时，将对应回调依次执行
>- $hashcode， $id可能有重复，但$hashcode不会重复
>- $track, 这是一个字符串，里面包括vm的所有属性名（除了那些内置的$开头属性），以;;隔开（这用于内部对象转换的）
>- $model， 返回纯净的JS对象
>- $element， 同名的ms-controller元素节点，这是应社区的要求，怎么通过vm得到元素
>- $render， 灵感来自react的render方法，用于生成对应的虚拟DOM树
>- $accessors， 储存所有监控属性的定义，这在avalon.modern及avalon.next不存在，avalon.modern可以通过 Object.getOwnPropertyDescriptor得到访问器属性的定义，而avalon.next是使用Proxy实现vm，完全没有这方面的必要。

```JavaScript
var vm = avalon.define({
    $id: 'test',
    a: 11,
    b: 22
})
vm.$watch('a', function(newValue, oldValue){

})

console.log(vm)
```

当然，vm里面也能埋vm对象，最外层的vmm称为**顶层vm**，内层的则称为**子vm**。  
```JavaScript
var vm = avalon.define({
    $id: 'test',
    a: 11,
    b: {
       c: 22
    }
})

console.log(vm.b)
```

> vm.b就是一个子vm，它与顶层vm有些区别，首先其$id为顶层vm的$id加上其属性名构成， 即"test.b"。它少了一些系统属性，如$element, $render, $watch, $fire, $events(这个在avalon.next存在)，可以说是一个轻量的vm。它的数据发生改动时，它不会自己处理$watch回调，而是交由顶层的vm来处理，因为所有回调都放在顶层vm的$events上。

```JavaScript
var vm = avalon.define({
   $id: 'test',
    a: 11,
    arr: [{b:1},{b:2},{b:3}]
})
console.log(vm.arr)
```

> 如果vm的子级属性是一个数组，那么与1.4一样，转换为监控数组。监控数组就是一个push, unshift, splice, pop, shift, sort, reverse等方法被重写的数组。它在内部是由arrayFactory方法生成的。
> 如果监控数组的每个元素是一个对象，那么它们会转换为顶层vm, 由masterFactory生成，它们的$id名都叫做test.arr.*。

在avalon2中还提供了合并vm的方法。（easy_example\multi_vm.html）
```JavaScript
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
            var vm1 = avalon.define({
                $id: "test",
                a: 111
            })
            vm1.$watch('a', function(){
                console.log('vm1.a change')
            })
            var vm2 = avalon.define({
                $id: 'test2',
                b: 222
            })
            vm2.$watch('b', function(){
                console.log('vm2.b change')
            })
            var vm3 = avalon.mediatorFactory(vm1,vm2)
            //这个回调其实放在vm1.$events中
             vm3.$watch('a', function(){
                console.log('vm3.a change')
            })
             //这个回调其实放在vm2.$events中
            vm3.$watch('b', function(){
                console.log('vm3.b change')
            })
            console.log('------')
            vm3.a = 22
            vm3.b = 44
        </script>
        <style>
            .ms-controller{
                display:none;
            }
        </style>
    </head>
    <body>
        <div ms-controller="test">
            <input ms-duplex="@a" />
            <p>{{@a}}</p>
        </div>
    </body>
</html>
```

额，这个程序我是没有跑出来的，反正现在没有找到原因，问题是
> avalon.mediatorFactory is not a function

### vm作用域
与vm作用域相关的有三个指令，ms-skip, ms-controller, ms-important。

- ms-skip，让vm的作用域进不到此元素内部，那么里面的{{}}就不会被替换了。
- ms-controller， 让此vm的作用域进入此元素内部，并且如果它上方已经有ms-controller，那么它们所指向的vm会进行合并。合并方式使用mediatorFactory实现。
- ms-important, 让此vm的作用域进入此元素内部，并且屏蔽上方的ms-controller或ms-important的vm的影响。

下面是一个例子：（actionScope.html）
```html
<!DOCTYPE html>

<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                aaa: 111,
                ddd: 444
            })
            var vm2 = avalon.define({
                $id: "test2",
                ddd: 555
            })
            var vm3 = avalon.define({
                $id: "test3",
                aaa: 333
            })
        </script>
    </head>
    <body ms-controller="test">
        <p>{{@aaa}}</p>
       <div ms-controller="test2">
            {{@aaa}}::{{@ddd}}
        </div>
         <div ms-important="test3">
            {{@aaa}}::{{@ddd}}
        </div>
    </body>
</html>
```

controller可以统治内部的所有参数，而important能屏蔽外部的参数。

## avalon2学习教程03数据填充
> 司徒正美 2016年04月07日发布

网址：[avalon2学习教程03数据填充](https://segmentfault.com/a/1190000004883743)

在avalon2中提供了三种数据填充的方法。（fill.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
            var vm1 = avalon.define({
                $id: "test",
                a: 111,
                b: 222
            })
        
        
        </script>
        <style>
            .ms-controller{
                display:none;
            }
        </style>
    </head>
    <body>
        <div ms-controller="test">
            <p><input ms-duplex="@a" />{{@a}}<strong ms-text="@a"></strong></p>
            <p><input ms-duplex="@b" /><span>{{@b}}</span><span ms-html="@b"></span></p>
        </div>
    </body>
</html>
```

可以看到是下面三种：
>{{expr}}, ms-text, ms-html

ms-html具有一些比较厉害的特性，就是允许里面输入html样式，但是缺点是让用户拥有过大的自由可以添加各种属性和链接，此时会对网站产生破坏，所以哦不建议使用。

此外值得注意的是，当然我们将插值表达式{{}}应用于网站首屏时，有时由于网络慢的缘故，会出大量的乱码现象（就是{{@b}}让用户看到了），这时我们有两个办法。

第一个方法，添加ms-controller类名，将当前区域先隐藏起来，avalon扫描到这里后会自动隐藏它们的。但是需要注意这样式必须写head的上方，方便它第一时间被应用。

```html
 .ms-controller{
     display:none;
 }
```

第二个方法，使用ms-text代替{{}}，这个最省心最有效，比第一个效果好。

数据填充是传统静态模板的最基础功能。因此你在混用avalon与其他后端模板时，会出现冲突，大家都使用 {{}}做界定符。这时我们可以使用以下方式配置界定符，注意，这个脚本也在放在head前面，或保证你在扫描前运行它。

```JavaScript
avalon.config({
   interpolate:["{%","%}"]
})
```

此时，我们可以通过avalon.config.openTag, avalon.config.closeTag得到“{%”,"%}"。注意，界定符里面千万别出现<, >，因为这存在兼容性问题。这两个界定符也不能一样，最好它们的长度都大于1。

## avalon2学习教程04显示隐藏处理
> 司徒正美 2016年04月07日发布

网址：[avalon2学习教程04显示隐藏处理](https://segmentfault.com/a/1190000004885280)

主角是ms-visible。类比display和jQuery的toggle。

第一个例子（visible1.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script >
            var vm = avalon.define({
                $id: "test",
                toggle: false,
                array:[1,2,3,4]
            })
          
        </script>
        <style>
            table{
                width:300px;
                border-collapse: collapse;
                border:1px solid red;
            }
            td {
                padding:5px;
                border:1px solid red;
            }
            .menu{
                display:inline-block;
                *display:inline;
                *zoom:1;
                width:140px;
                padding:5px 20px;
                text-align: center;
                margin-left:1em;
                border: 1px solid greenyellow;
            }
            .btn{
                padding:5px 20px;
                margin-left:1em;
                display: inline-block;
            }
        </style>
    </head>
    <body ms-controller="test" >
        <table ms-visible="@toggle" border="1" >
            <tr ms-visible="@toggle"><td>1111</td><td>1111</td></tr>
            <tr><td>1111</td><td>1111</td></tr>
        </table>
        <br/>
        <table border="1" >
            <tr ms-visible="@toggle"><td >aaa</td><td>bbb</td></tr>
            <tr><td ms-visible="@toggle">ccc</td><td>ddd</td></tr>
        </table>
        <table border="1" >
            <tr ms-for="el in @array">
                <td ms-visible="@toggle">{{el}}</td>
                <td ms-visible="@toggle">{{el+10}}</td>
            </tr>
        </table>
        <div style="display:none" class="menu" ms-visible="@toggle">item</div>  
        <button style="display:none" class="btn" type="button" ms-visible="@toggle">btn</button> 
        <p><input type="button" ms-click="@toggle = !@toggle" value="click me"></p>
    </body>
</html>
```

通过ms-click绑定一个事件是点击按钮可以将变量toggle取反。虽然元素部分不可见，但是某些属性值还是被存起来，用变量的形式。

另一个例子：（visible2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script >
            var vm = avalon.define({
                $id: "test",
                toggle: true
            })
          
        </script>
        <style>
            div div{
                flex:1;
                margin: 20px;
                height: 30px;
                background: #a9ea00;
            }
        </style>
    </head>
    <body ms-controller="test" >
        <div ms-visible="@toggle" style="display: flex;display:-webkit-flex;background: #ffd">
            <div></div> <div></div> <div></div>
        </div>
        <p ms-click="@toggle = !@toggle">click me</p>
    </body>
</html>
```

通过这个例子可知avalon能够解决内联样式混乱的问题。

下面这个例子就是一个实例，用于实现一个切换卡。（visible2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script >
            var vm = avalon.define({
                $id: "test",
                curIndex: 0, //默认显示第一个
                buttons: ['aaa', 'bbb', 'ccc'],
                panels: ["<div>面板1</div>", "<p>面板2</p>", "<strong>面板3</strong>"]
            })

        </script>
        <style>
            button{
                margin:1em 3em;
            }
            .panel div{
                height:200px;
                background: #a9ea00;
            }
            .panel p{
                height:200px;
                background: green;
            }
            .panel strong{
                display:block;
                width:100%;
                height:200px;
                background: #999;
            }
        </style>
    </head>
    <body ms-controller="test" >
        <div>
            <button ms-for='(i, el) in @buttons' ms-click='@curIndex = i'>{{el}}</button>
        </div>
        <div class='panel' ms-for='(jj, el) in @panels' ms-visible='jj === @curIndex' ms-html='el'></div>
    </body>
</html>
```


## avalon2学习教程05属性操作
> 司徒正美 2016年04月07日发布

网址：[avalon2学习教程05属性操作](https://segmentfault.com/a/1190000004886685)

相比avalon1，avalon2从减轻用户记忆的角度出发，简化了属性和对象。

```html
<div ms-attr="{aaa:@a, bbb:@b+11, ccc: @fn(@d,@e)}"></div>

<div ms-attr="@attrObj"></div>

<div ms-attr="[{@aaa:@a}, {bbb: @b}, @toggle ? {add:"111"}: {}]"></div>
```

下面是一个完整的例子：（objectTest.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script >
            var vm = avalon.define({
                $id: "test",
                title:111,
                src: "222",
                lang: 333
            })

        </script>
    </head>
    <body ms-controller="test" >
          <div  aaa='ddd' bbb=333 
                ms-attr='{title: @title,
                    ddd:@src, 
                    lang:@lang}' >{{
                   @src ? 333: 'empty'
              }}</div>
          <input ms-duplex="@src"/>
    </body>
</html>
```

可以发现里面ms-attr里面可以存储一个长而且复杂的对象，但是作者建议为了性能着想还是尽可能让ms-attr保持一行。

## avalon2学习教程06样式操作
> 司徒正美 2016年04月07日发布

网址：[avalon2学习教程06样式操作](https://segmentfault.com/a/1190000004887727)

和ms-attr类似，ms-css将多个操作集成到一个对象处理，因此只有类似ms-css="Object"或ms-css="Array"的形式。

> 注意，当你用对象字面量的方式传参时，注意存在－号的键名要用“”号括起来。

下面两种形式才是正确的
```html
<div ms-css="{fontSize: @fs}"></div>

<div ms-css="{'font-size': @fs}"></div>
```

avalon2里面不允许加入太多的插值表达式，只支持加上厂商前缀，驼峰化，对数字属性加上px。
```html
<div ms-css="[{width:@width, height: @height+'px', color: @color, backgroundColor:@bg}, @otherStyleObject, @thirdStyleObject]"></div>
```

下面是一个例子：（CSSOperate1.html）
```html

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                background: "red"
            })
        </script>
    </head>
    <body>
        <div ms-controller="test">
            <div style="width:200px; height:50px" 
                 ms-css="{background: @background}">
            </div>
            <select ms-duplex="@background">
                <option value="red">红</option>
                <option value="yellow">黄</option>
                <option value="green">绿</option>
            </select>
        </div>
    </body>
</html>
```

在这里面，会随着object的选择会改变background的值，从而改变上面的div的值。

（CSSOperate2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js" ></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                percent: 0
            })
            var a = true
            var id = setInterval(function() {
                if (a) {
                    if (vm.percent < 100) {
                        vm.percent++
                    } else {
                        a = false
                    }
                } else {
                    if (vm.percent > 0) {
                        vm.percent--
                    } else {
                        a = true
                    }
                }
            }, 100)
        </script>
        <style>
            .handerx{
                width:20px;
                height:20px;
                position: absolute;
                color:#fff;
                background: #000;
            }
            .sliderx{
                width:100%;
                height:20px;
                position: relative;
            }
            .body{
                padding:40px;
            }
        </style>
    </head>
    <body ms-controller="test" class="body">
        <div class="slider" style="background:red;">
            <div class="handerx" ms-css="{left: @percent+'%'}" >{{ @percent }}</div>
            <div style="background: greenyellow;height:20px" ms-css="{width:@percent+'%'}"></div>
        </div>
        <div class="sliderx" style="background:#d2d2d2;">
            <div style="background: #2FECDC;height:20px" ms-css="{width:100-@percent+'%'}"></div>
        </div>
    </body>
</html>
```

这里面使用了一个计时器，这个计时器随着时间变化下面的进度条会变化，从代码看来，上面一条进度条是以红色为底色，然后上面还有一层，是绿色，长度会随着时间变化而变化，然后就能够简单粗暴地实现进度条形式，下面的类似，就是少了一个进度值。

（CSSOperate3.html）
```html
<html>
    <head>
        <title>ms-css</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js" ></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                w: 100,
                h: 100,
                click: function () {
                    vm.w = vm.w + 10;
                    vm.h = vm.h + 10;
                }
            })

        </script>
    </head>
    <body>
        <div ms-controller="test">
            <div style=" background: #a9ea00;" ms-css='{width:@w,height:@h}' ms-click="@click"></div>
            <p>{{ @w }} x {{ @h }}</p>
            <!--change过滤器相当于原来data-duplex-event='change'-->
            <p>W: <input type="text" ms-duplex-number="@w|change" /></p>
            <p>H: <input type="text" ms-duplex-number="@h" /></p>
        </div>
    </body>
</html>
```

上面的例子是与ms-duplex结合使用的例子。click是一个事件，点击按钮的时候会改变属性值。但是发现两者存在少许区别，W的变化时需要在点击鼠标的时候才会改变事件，而H则是随着框里面的变化而变化。

## avalon2学习教程07类名处理
>司徒正美 2016年04月08日发布

网址：[avalon2学习教程07类名处理](https://segmentfault.com/a/1190000004894518)

avalon2的类名操作涉及到ms-class,ms-active,ms-hover。由于用法类似，所以就只以其中一个为例。

>ms-class可以对应vm中的一个字符串属性，里面可以有空格（一个空格就是一个类名嘛）

```html
vm.classes = "aaa bbb ccc"
<div ms-class="@classes"></div>

<div ms-class="[@aaa, @bbb, {xxx:false, yyy: true, zzz: @toggle}, '222']"></div>
```

我选择看一个例子：(className1.html)
```html
<!DOCTYPE html>
<html>
    <head>
        <title>新风格</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "ms-class",
                toggle: true,
                aaa: 'xxx',
                bbb: 'yyy',
                ccc: 'zzz'
            })
        </script>
        <style>
            .test{
                width:100px;
                height:100px;
                border:1px solid red;
                color:red;
                -webkit-user-select: none;  /* Chrome all / Safari all */
                -moz-user-select: none;     /* Firefox all */
                -ms-user-select: none;      /* IE 10+ */
                -o-user-select: none;
                user-select: none;          
            }
            .aaa{
                color:blue;
                border:1px solid blue;
            }
        </style>
    </head>
    <body ms-controller="ms-class">
        <div class="test" ms-class="{aaa:@toggle}" ms-click="@toggle = !@toggle">点我</div>
        <div  ms-class="'aaa bbb ccc'"> 它的名类是aaa bbb ccc   </div>
        <div  ms-class="[@aaa,@bbb,@ccc]" >  它的名类是xxx yyy zzz   </div>
        <div  ms-class="[@aaa, @toggle ? @bbb: @ccc]">  它的名类是xxx yyy  </div>
     

    </body>
</html>
```

从这个例子可以看出，类能通过ms-class传入，而且能和传统的class一同使用。另外还需要注意的是代码。

（className2.html)
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-class</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js"></script>
        <style>
            .ms-class div{
                display:inline-block;
                width:200px;
                height:100px;
                border: 1px solid  black;
            }
            .active{
                background: black;
                color: white;
            }
            .bgRed {
                background:palegoldenrod;
            }
            .hover{
                background: red;
                color: white;
            }
        </style>
        <script type="text/javascript">
            var vm = avalon.define({
                $id: "test",
                w: 500,
                h: 200,
                num: "00",
                className: "点我",
                changeClassName: function(e) {
                    vm.num = (100 * Math.random()).toFixed(0);
                    vm.className = e.target.className
                }
            })
        </script>
    </head>
    <body ms-controller="test" class="ms-class">
        <div ms-active="'active'" >测试:active</div>
        <div ms-hover="'hover'" >测试:hover</div>
        <div ms-class="['bgRed', 'width'+@w, 'height'+@h]" ms-css="{width: @h}">
            类名通过插值表达式生成<br/>
            {{@w}} * {{@h}}<br/>
            <input  ms-duplex="@h | change">
        </div>
        <p><button type="button" ms-class="'test'+@num" ms-click="@changeClassName">{{@className}}</button></p>
    </body>
</html>
```

在这里就能看到active，hover和class的区别，前两者是在触发某个事件的时候能出现，设置该形式的样式，十分方便。

（className3.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                color: "red",
                toggle: true,
    
                switchColor: function() {
                    vm.color = vm.color === "red" ? "blue" : "red"
                }
            })
        </script>
        <style>
            .ms-class-test{
                background:green;
                width:300px;
                height:100px;
            }
            .c-red{
                background: red;
            }
            .c-blue{
                background: blue;
            }
        </style>
    </head>
    <body ms-controller="test">
        <div class="ms-class-test" ms-hover="[@toggle ? 'c-'+@color: '']"> </div>
        <button ms-click="@switchColor"> 点我改变类名</button>
        <button ms-click="@toggle = !@toggle"> 点我改变toggle</button>
    </body>
</html>
```

通过条件表达式可以控制样式根据条件变化。大概的几层关系我也简单的搞了一下：

![className1.png](https://raw.githubusercontent.com/ZBayes/AvalonLearning/master/couseOL/pic/className1.png)

> ms-class、 ms-hover、 ms-active涵盖了所有与类名相应的需求，并且使用上比jQuery还简单。最后看一下用它实现斑马线的效果吧。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-class</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script>
            avalon.define({
                $id: "test",
                array: avalon.range(0, 14)
            })
        </script>
        <style>
            .zebra-table{
                border-collapse: collapse;
                width:400px;
                border:1px solid black;
            }
            .zebra-table td{
                border:1px solid black;
                text-indent: 1em;
            }
            .zebra-table .even td{
                background:#ddd;
                color:white;
            }
             .zebra-table .hover td{
                color: red;
                font-weight: bolder;
            }
        </style>
    </head>
    <body ms-controller="test" >
        <table class="zebra-table">
            <tr ms-for="($index, el ) in @array" ms-hover="'hover'" ms-class="{even: $index % 2 == 0}">
                <td>{{$index}}</td>
                <td>{{ new Date - 0 | date("yyyy-MM-dd")}}</td>
            </tr>
        </table>
    </body>
</html>
```

这是实现斑马线主要功能的方法，可以做笔记，**注意理解其原理**，里面还用到了ms-for的循环语句。

## avalon2学习教程08插入移除操作
> 司徒正美 2016年04月08日发布

网址：[avalon2学习教程08插入移除操作](https://segmentfault.com/a/1190000004896630)

> 本节介绍的ms-if指令与ms-visible很相似，都是让某元素“看不见”，不同的是ms-visible是通过CSS实现，ms-if是通过移除插入节点实现。

（ifExist1.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-if</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js" ></script>
        <script>
            var vmodel = avalon.define({
                $id: "test",
                object: {}
            })

            setTimeout(function() {
                vmodel.object = {id: "132", message: "显示！！"}
            }, 3000)

            setTimeout(function() {
                vmodel.object = {}
            }, 5000)

        </script>
    </head>
    <body>
        <div ms-controller="test" >
            这是比较输出结果:{{@object.id != null}}
            <div ms-visible="@object.id != null">
                这是visible的:
                <span>{{@object.message}}</span>
            </div>
            <div ms-if="@object.id != null">
                这是if的:
                <span>{{@object.message}}</span>
            </div>
        </div>
    </body>
</html>
```

查看生成的html可知，ms-if和ms-visible的区别，两者的区别在于该dom节点是否存在。

这是一个新的选项卡的实现（ifExist2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-if</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script >
            var vm = avalon.define({
                $id: "test",
                curIndex: 0, //默认显示第一个
                buttons: ['aaa', 'bbb', 'ccc'],
                panels: ["<div>面板1</div>", "<p>面板2</p>", "<strong>面板3</strong>"]
            })

        </script>
        <style>
            button{
                margin:1em 3em;
            }
            .panel div{
                height:200px;
                background: #a9ea00;
            }
            .panel p{
                height:200px;
                background: green;
            }
            .panel strong{
                display:block;
                width:100%;
                height:200px;
                background: #999;
            }
        </style>
    </head>
    <body ms-controller="test" >
        <div>
            <button ms-for='(i, el) in @buttons' ms-click='@curIndex = i'>{{el}}</button>
        </div>
        <div class='panel' ms-for='(jj, el) in @panels' ms-if='jj === @curIndex' ms-html='el'></div>
    </body>
</html>
```

ms-for又起到了作用，需要对其使用有足够的熟悉。另一方面是ms-if，这个才是这章的重点额。

## avalon2学习教程09循环操作
> 司徒正美 2016年04月10日发布

网址：[avalon2学习教程09循环操作](https://segmentfault.com/a/1190000004908426)

在avalon2中，只有ms-for这一种命令，如果需要得到数组元素或者是对象键值，可以在in前面定义新变量。

```html
<div ms-for="el in @arrayOrObject">{{el}}</div>
```

这里面@arrayOrObject就是数组。

如果要指定数组索引值或对象的键名，那么需要加一个小括号。
```html
<div ms-for="(index,el) in @arrayOrObject">{{el}}</div>
```

我们可以用limitBy, filterBy， orderBy, selectBy过滤器生成新的循环体。
```html
<div ms-for="(index,el) in @arrayOrObject ｜ filterBy('name')">{{el}}</div>
```

如果用limitBy过滤器，那么数组的长度或对象的大小会变小，那我们现在就不知道现在的长度，因此我们需要另一个变量引用新对象新数组
```html
<div ms-for="(index,el) in @arrayOrObject as newArray｜ filterBy('name')">{{el}}::{{newArray.length}}</div>
```

如果想实现之前的$fist, $last效果，那就需要用到js指令
```html
<div ms-for="(index,el) in @arrayOrObject  as newArray｜ filterBy('name')">
<!--ms-js:var $first = $index === 0 -->
<!--ms-js:var $last = $index === new Array -2 -->
</div>
```

这里存在注释指令，实质上ms-if为false时创建的注释节点也是一种注释指令。

这个以元素属性存在的ms-for指令，会翻译成以注释节点存在的ms-for指令。
```html
<div class='panel' ms-for="($index, el) in @array">{{el}}::{{$index}}</div>
```

等价于
```html
<!--ms-for:($index,el) in @array-->
<div class='panel'>{{el}}::{{$index}}</div>
<!--ms-for-end:-->
```

这种方式能够帮助解决循环多个元素的问题，如：
```html
<!--ms-for:($index,el) in @array-->
<td>{{el.td1}}</td>
<td>{{el.td2}}</td>
<!--ms-for-end:-->
```

>注意，avalon2的监控数组已经移除size()方法，由于内部使用了虚拟DOM，你直接使用@array.length就能得知道当前长度了。

>avalon2也没有angular的track by机制，或像React那样强制使用key.这种为优化排序性能的方法，avalon内部帮你搞定，就不需要你多写什么了。

（msfor1.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js" ></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                array: ["aaa","bbb","ccc"]
            })
            setTimeout(function(){
                 vm.array = ['ccc','dd1','dd2','dd3']
            },3000)
           

        </script>
    </head>
    <body ms-controller="test">
        <ul>
            <li ms-for="($index, el) in @array">{{el}} --- {{$index}}</li>
        </ul>
    </body>
</html>
```

这是一个很简单地实现循环的例子。当然，这种方式常用在接受后台数据并展示。这种方式似乎比runtime更加方便而且组件化，直接把内容埋在dom节点里面（个人觉得）。

在有些时候，需要循环二维甚至多维数组。（msfor2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js" ></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                array: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
            })
            setTimeout(function(){
                vm.array.set(0, [13,14,15,16])
            },3000)
        </script>
    </head>
    <body ms-controller="test">
        <table border="1">
            <tr ms-for="($index, el) in @array">
                <td ms-for="elem in el">{{elem}}  它位于第<b style="color:orchid">{{$index}}</b>行</td>
            </tr>
        </table>
    </body>
</html>
```

```html

<!DOCTYPE HTML>
<html>
    <head>
        <title>ms-repeat</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="avalon.js" ></script>
        <script>

            var definition = {
                $id: 'test',
                array: ['1', '2', '3', '4'],
                removeAt: function (e) {
                    var elem = e.target
                    if (isFinite(elem.value)) {//this为input元素
                        var a = ~~elem.value
                        this.array.removeAt(a)
                        elem.value = ''
                    }
                }
            }
            'push,unshift,remove,ensure'.replace(avalon.rword, function (method) {
                definition[method] = function (e) {
                    //avalon2中,所有通过ms-on-* 及其变体绑定的事件,其this都是指向vm,
                    //而元素本身则通过e.targeta得到
                    var elem = e.target
                    if (elem.value) {
                        this.array[method](elem.value)
                        elem.value = ''
                    }
                }
            })
            'pop,shift,sort,reverse'.replace(avalon.rword, function (method) {
                definition[method] = function (e) {
                    this.array[method]()
                }
            })
            
            avalon.define(definition)

        </script>
    </head>
    <body ms-controller="test">
        <p>监控数组拥有以下方法，我们可以操作它们就能同步对应的区域</p>
        <blockquote>
            push, shift, unshift, pop, slice, splice, remove, removeAt, removeAll, clear,
            ensure, pushArray, sort, reverse, set
        </blockquote>
        <ul>
            <li ms-for="($index,el) in @array">数组的第{{$index+1}}个元素为{{el}}</li>
        </ul>
        <p>对数组进行push操作，并回车<input ms-keypress="@push | enter"></p>
        <p>对数组进行unshift操作，并回车<input ms-keypress="@unshift | enter"></p>
        <p>对数组进行ensure操作，并回车<input ms-keypress="@ensure | enter"><br/>
            (只有数组不存在此元素才push进去)</p>
        <p>对数组进行remove操作，并回车<input ms-keypress="@remove | enter"></p>
        <p>对数组进行removeAt操作，并回车<input ms-keypress="@removeAt | enter"></p>
        <p><button type='button' ms-click="@sort">对数组进行sort操作</button></p>
        <p><button type='button' ms-click="@reverse">对数组进行reverse操作</button></p>
        <p><button type='button' ms-click="@shift">对数组进行shift操作</button></p>
        <p><button type='button' ms-click="@pop">对数组进行pop操作</button></p>
        <p>当前数组的长度为<span style="color:red">{{@array.length}}</span>。</p>

    </body>
</html>
```

这个案例比较复杂，实现了很多对数组的操作。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: 'for3',
                header: ['name','age','sex'],
                list: []
            })
            var sexMap = {
                true: "男",
                false: "女"
            }
            function genData(n){
                var ret = []
                for(var i =0 ; i< n; i++){
                    ret.push({
                        name: Math.random(), 
                        age: 3+ Math.ceil((Math.random() *30)),
                        sex: sexMap[1-Math.random() > 0.5],
                        desc: Math.random()
                    })
                }
                return ret
            }
           setInterval(function(){
                var t1 = Date.now();
                vm.list = genData(100)
                console.log('total ' + (Date.now() - t1) + ' ms');
            }, 70);
        </script>
    </head>
    <body>

        <div ms-controller='for3' >
            <table border="1">
                <tr><th ms-for='el in @header'>{{el}}</th></tr>
               <tr ms-for='tr in @list'>
                    <td ms-for='td in tr | selectBy(["name","age","sex"])' ms-attr="{align:td === 'age' ?'left':'right'}">{{td}}</td>
                </tr>
            </table>
        </div>
    </body>
</html>
```

额，这个程序似乎是存在bug。暂时没找到解决方案。  
问题："Uncaught DOMException: Failed to execute 'setAttribute' on 'Element': 'name\??3' is not a valid attribute name.
    at Object.toDOM "

## avalon2学习教程10事件绑定
> 司徒正美 2016年04月12日发布

网址：[avalon2学习教程10事件绑定](https://segmentfault.com/a/1190000004926503)

>avalon2的事件指令，比起avalon1来强大多了。

>首先其内部是使用事件代理实现的，能冒泡的事件全部绑定document上。只有旧式IE的几个事件还绑定在原元素上。

>其次，this直接指向vmodel，元素节点则通过e.target获取。如果要传入多个参数，需要指定事件对象，还是与原来一样使用$event

```html
<div ms-click='@fn(111,222,$event)'>{{@ddd}}</div>
```

>再次，添加了一些专门针对事件回调的过滤器
1. 对按键进行限制的过滤器esc，tab，enter，space，del，up，left，right，down
2. 对事件方法stopPropagation, preventDefault进行简化的过滤器stop, prevent

>最后，对事件回调进行缓存，防止重复生成。

事件绑定是使用ms-on-☆绑定来实现，但avalon也提供了许多快捷方式，让用户能直接以ms-eventName调用那些常用事件，如下
> animationend、 blur、 change、 input、 click、 dblclick、 focus、 keydown、 keypress、 keyup、 mousedown、 mouseenter、 mouseleave、 mousemove、 mouseout、 mouseover、 mouseup、 scan、 scroll、 submit

avalon的事件绑定支持多投事件机制（同一个元素可以绑定N个同种事件，如ms-click=fn, ms-click-1=fn2, ms-click-2=fn3）

（case1.html）
```html
<!DOCTYPE HTML>
<html>
    <head>
        <title>ms-on</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js" ></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                firstName: "司徒",
                array: ["aaa", "bbb", "ccc"],
                argsClick: function(e, a, b) {
                    alert([].slice.call(arguments).join(" "))
                },
                loopClick: function(a, e) {
                    alert(a + "  " + e.type)
                },
                status: "",
                callback: function(e) {
                    vm.status = e.type
                },
                field: "",
                check: function(e) {
                    vm.field = e.target.value + "  " + e.type
                },
                submit: function() {
                    var data = vm.$model
                    if (window.JSON) {
                        setTimeout(function() {
                            alert(JSON.stringify(data))
                        })
                    }
                }
            })

        </script>
    </head>
    <body>
        <fieldset ms-controller="test">
            <legend>有关事件回调传参</legend>
            <div ms-mouseenter="@callback" ms-mouseleave="@callback">{{@status}}<br/>
                <input ms-on-input="@check"/>{{@field}}
            </div>
            <div ms-click="@argsClick($event, 100, @firstName)">点我</div>
            <div ms-for="el in @array" >
                <p ms-click="@loopClick(el, $event)">{{el}}</p>
            </div>
            <button ms-click="@submit" type="button">点我</button>
        </fieldset>
    </body>
</html>
```

这个例子里面能看到各种事件的绑定。
（case2.html）
```html
<!DOCTYPE HTML>
<html>
    <head>
        <title>ms-on</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js" ></script>
        <script>
            var count = 0
            var model = avalon.define({
                $id: "multi-click",
                str1: "1",
                str2: "2",
                str3: "3",
                click0: function() {
                    model.str1 = "xxxxxxxxx" + (count++)
                },
                click1: function() {
                    model.str2 = "xxxxxxxxx" + (count++)
                },
                click2: function() {
                    model.str3 = "xxxxxxxxx" + (count++)
                }
            })
        </script>
    </head>
    <body>
        <fieldset>
            <legend>一个元素绑定多个同种事件的回调</legend>
            <div ms-controller="multi-click">
                <div ms-click="@click0" ms-click-1="@click1" ms-click-2="@click2" >请点我</div>
                <div>{{@str1}}</div>
                <div>{{@str2}}</div>
                <div>{{@str3}}</div>
            </div>
        </fieldset>
    </body>
</html>
```

从这个案例可以看到多个事件绑定的方式。

```html
<!DOCTYPE HTML>
<html>
    <head>
        <title>ms-on</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js" ></script>
        <script>
            avalon.define({
                $id: "xxx",
                fn: function() {
                    console.log("11111111")
                },
                fn1: function() {
                    console.log("2222222")
                },
                fn2: function() {
                    console.log("3333333")
                }
            })
        </script>
    </head>
    <body>
        <div ms-controller="xxx" 
             ms-on-mouseenter-3="@fn"
             ms-on-mouseenter-2="@fn1"
             ms-on-mouseenter-1="@fn2"
             style="width:100px;height:100px;background: red;"
             >
        </div>
    </body>
</html>
```

从这个案例能知道，其标号"-x"无所谓。

（case4.html）
```html
<!DOCTYPE html> <html>
    <head>
        <title>ms-mouseenter, ms-mouseleave</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js"></script>
        <script>
            avalon.define({
                $id: "test",
                fn1: function(e) {
                    console.log(e.type)
                    console.log(e.target)
                },
                fn2: function(e) {
                    console.log(e.type)
                    console.log(e.target)
                }
            })
        </script>
    </head>

    <body ms-controller="test">
        <div ms-mouseenter="@fn1" ms-mouseleave="@fn2" style="background: red;width:200px;height: 200px;padding:20px;">
            <div style="background: blue;width:160px;height: 160px;margin:20px;"></div>
        </div>
    </body>
</html>
```

好好看看e是啥，e.target和e.type又是啥。

（case5.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-on-mousewheel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                text: "",
                callback: function(e) {
                    vm.text = e.wheelDelta + "  " + e.type
                }
            })

        </script>
    </head>

    <body ms-controller="test">
        <div ms-on-mousewheel="@callback" id="aaa" style="background: red;width:200px;height: 200px;">
            {{@text}}
        </div>
    </body>
</html>
```
关于滚轮时间，兼容性实现的比较难（火狐orz）。通过正负来实现。

> 此外avalon还对input，animationend事件进行修复，大家也可以直接用avalon.bind, avalon.fn.bind来绑定这些事件。但建议都用ms-on绑定来处理。


## avalon2学习教程11数据联动
> 司徒正美 2016年04月14日发布

网址：[avalon2学习教程11数据联动](https://segmentfault.com/a/1190000004942177)

> 在许多表单应用，我们经常遇到点击一个复选框（或下拉框）会引发旁边的复选框（或下拉框）发生改变，这种联动效果用avalon来做是非常简单的。因为avalon拥有经典MVVM框架的一大利器，双向绑定！绝大部分的指令是从vm单向拍到页面，而双向绑定，则通过监听元素的value值变化，反向同步到vm中。

> 在avalon中，双向绑定是由双工指设，ms-duplex实现的。这个指令在1.0中已经不断增强，到2.0，它的服务对象已经不局限于表单元素，还扩展到可编辑元素（contenteditable＝true）上了。

>此外ms-duplex还可以与新加入的ms-validate指令一起使用。因此双工指令是集成数据转换，数据格式化，数据验证，光标处理4大功能。

数据转换与之前1.5一样，使用四大转换器：
```html
ms-duplex-string="@aaa"
ms-duplex-number="@aaa"
ms-duplex-boolean="@aaa"
ms-duplex-checked="@aaa"
```

前三个是将元素的value值转换成string, number, boolean（只有为'false'时转换为false），最后是根据当前元素（它只能是radio或checkbox）的checked属性值转换为vm对应属性的值。它们都是放在属性名上。当数据从元素节点往vmodel同步时，转换成预期的数据。

数据格式化是放在属性值时，以过滤器形式存在，如
```html
ms-duplex='@aaa | uppercase'
ms-duplex='@aaa | date('YYYY:MM:dd')'
```

此外还存在两个控制同步时机的过滤器，change与debounce。

change过滤器相当于之前的data-duplex-event="change".debounce是对频繁输入进行节流处理。它既不像那oninput事件那样密集（由于使用了虚拟DOM，每一个字符，都会重新短成一个全新的虚拟DOM树），也不像onchange事件那么滞后。这在自动元素的suggest组件中非常有用。debounce可以传参，为毫秒数。
```html
ms-duplex='@aaa | debounce(300)'
```

然后是数据验证，这必须在所有表单元素的上方，加上ms-validate才会生效。这时每个表单元素要加上data-duplex-validator.
```html
<form ms-validate="@validation">
<input ms-duplex='@aaa' 
       data-validators='require,email,maxlength' 
       data-maxlength='4' 
       data-maxlength-message='太长了' >
</form>
```

最后是光标处理，目的是确保光标不会一下子跑到最前还是最后。

除此之后，ms-duplex还有一个回调，data-duplex-changed，用于与事件绑定一样，默认第一个参数为事件对象。如果传入多个参数，那么使用$event为事件对象占位。

（dataOperate1.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                data: [{checked: false}, {checked: false}, {checked: false}],
                allchecked: false,
                checkAll: function (e) {
                    var checked = e.target.checked
                    vm.data.forEach(function (el) {
                        el.checked = checked
                    })
                },
                checkOne: function (e) {
                    var checked = e.target.checked
                    if (checked === false) {
                        vm.allchecked = false
                    } else {//avalon已经为数组添加了ecma262v5的一些新方法
                        vm.allchecked = vm.data.every(function (el) {
                            return el.checked
                        })
                    }
                }
            })
        </script>
    </head>
    <body>
        <table ms-controller="test" border="1">
            <tr>
                <td><input type="checkbox" 
                           ms-duplex-checked="@allchecked" 
                           data-duplex-changed="@checkAll"/>全选</td>
            </tr>
            <tr ms-for="($index, el) in @data">
                <td><input type="checkbox" ms-duplex-checked="el.checked" data-duplex-changed="@checkOne" />{{$index}}::{{el.checked}}</td>
            </tr>
        </table>

    </body>
</html>
```

这个设置全选和全不选。

>我们仔细分析其源码，allchecked是用来控制最上面的复选框的打勾情况，数组中的checked是用来控制下面每个复选框的下勾情况。由于是使用ms-duplex，因此会监听用户行为，当复选框的状态发生改变时，就会触发data-duplex-changed回调，将当前值传给回调。但这里我们不需要用它的value值，只用它的checked值。

>最上面的复选框对应的回调是checkAll，它是用来更新数组的每个元素的checked属性，因此一个forEach循环赋值就是。

>下面的复选框对应的checkOne，它们是用来同步最上面的复选框，只要它们有一个为false上面的复选框就不能打勾，当它们被打勾了，它们就得循环整个数组，检查是否所有元素都为true，是才给上面的checkall属性置为true。

（dataOperate2.html）
```html
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="savalon.js" ></script>
        <script>
            if (!Date.now) {//fix 旧式IE
                Date.now = function() {
                    return new Date - 0;
                }
            }
            var model = avalon.define({
                $id: "test",
                selected: "name",
                options: ["name", "size", "date"],
                trend: 1,
                data: [
                    {name: "aaa", size: 213, date: Date.now() + 20},
                    {name: "bbb", size: 4576, date:Date.now() - 4},
                    {name: "ccc", size: 563, date: Date.now() - 7},
                    {name: "eee", size: 3713, date: Date.now() + 9},
                    {name: "555", size: 389, date: Date.now() - 20}
                ]
            })

        </script>
    </head>
    <body ms-controller="test">
        <div style="color:red">
            <p>本例子用于显示如何做一个简单的表格排序</p>
        </div>
        <p>
            <select ms-duplex="@selected">
                <option  ms-for="el in @options">{{el}}</option>
            </select>
            <select ms-duplex-number="@trend">
                <option value="1">up</option>
                <option value="-1">down</option>
            </select>
        </p>
        <table width="500px" border="1">
            <tbody >
                <tr ms-for="el in @data | orderBy(@selected, @trend)">
                    <td>{{el.name}}</td> <td>{{el.size}}</td> <td>{{el.date}}</td>
                </tr>
            </tbody>
        </table>
    </body>
</html>

```

首先需要熟悉循环的使用方式，然后是了解orderby这个过滤器，可以发现这个排序十分方便简洁，另外，可以看到数据都是json形式，可以换成后台数据。

这是一个两框联动的例子（dataOperate3.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="avalon.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script>
            avalon.define({
                $id: "fruit",
                options: ["苹果", "香蕉", "桃子", "雪梨", "葡萄", "哈蜜瓜", "橙子", "火龙果", "荔技", "黄皮"],
                selected: "桃子"
            })
        </script>
    </head>
    <body ms-controller="fruit">
        <h3>文本域与下拉框的联动</h3>
        <input  ms-duplex="@selected" />
        <select ms-duplex="@selected" >
            <option ms-for="el in @options" ms-attr="{value: el}" >{{el}}</option>
        </select>
    </body>
</html>
```

来一个更加牛逼的联动。（dataOperate4.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="avalon.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script>
            var map = {
                "中国": ["江南四大才子", "初唐四杰", "战国四君子"],
                "日本": ["日本武将", "日本城堡", "幕府时代"],
                "欧美": ["三大骑士团", "三大魔幻小说", "七大奇迹"],
                "江南四大才子": ["祝枝山", "文征明", "唐伯虎", "周文宾"],
                "初唐四杰": ["王勃", "杨炯", "卢照邻", "骆宾王"],
                "战国四君子": ["楚国春申君黄歇", "齐国孟尝君田文", "赵国平原君赵胜", "魏国信陵君魏无忌"],
                "日本武将": ["织田信长", "德川家康", "丰臣秀吉"],
                "日本城堡": ["安土城", "熊本城", "大坂城", "姬路城"],
                "幕府时代": ["镰仓", "室町", "丰臣", "江户"],
                "三大骑士团": ["圣殿骑士团", "医院骑士团", "条顿骑士团"],
                "三大魔幻小说": ["冰与火之歌", "时光之轮", "荆刺与白骨之王国"],
                "七大奇迹": ["埃及胡夫金字塔", "奥林匹亚宙斯巨像", "阿尔忒弥斯月神殿", "摩索拉斯陵墓", "亚历山大港灯塔", "巴比伦空中花园", "罗德岛太阳神巨像"]
            }
            var vm = avalon.define({
                $id: 'linkage',
                first: ["中国", "日本", "欧美"],
                second: map['日本'].concat(),
                third: map['日本武将'].concat(),
                firstSelected: "日本",
                secondSelected: "日本武将",
                thirdSelected: "织田信长"
            })


            vm.$watch("firstSelected", function (a) {
                vm.second = map[a].concat()
                vm.secondSelected = vm.second[0]
            })
            vm.$watch("secondSelected", function (a) {
                vm.third = map[a].concat()
                vm.thirdSelected = vm.third[0]
            })

        </script>
    </head>
    <body >
        <div ms-controller="linkage">
            <h3>下拉框三级联动</h3>
            <select ms-duplex="@firstSelected" >
                <option  ms-for="el in @first" ms-attr="{value:el}" >{{el}}</option>
            </select>
            <select ms-duplex="@secondSelected" >
                <option  ms-for="el in @second" ms-attr="{value:el}" >{{el}}</option>
            </select>
            <select ms-duplex="@thirdSelected" >
                <option  ms-for="el in @third" ms-attr="{value:el}" >{{el}}</option>
            </select>
        </div>
    </body>
</html>
```

> 这里的技巧在于使用$watch回调来同步下一级的数组与选中项。注意，使用concat方法来复制数组。


## avalon2学习教程12数据验证
> 司徒正美 2016年04月15日发布

网址：[avalon2学习教程12数据验证](https://segmentfault.com/a/1190000004947858)

avalon内置验证规则有

规则|  描述
--|--
required(true)|  必须输入的字段。
email(true)| 必须输入正确格式的电子邮件。
url(true)|   必须输入正确格式的网址。
date(true或正则)|   必须输入正确格式的日期。默认是要求YYYY-MM-dd这样的格式。
number(true)|    必须输入合法的数字（负数，小数）。
digits(true)|    必须输入整数。
pattern(正则或true)|    让输入数据匹配给定的正则，如果没有指定，那么会到元素上找pattern属性转换成正则再匹配。
equalto(ID名）|    输入值必须和 #id 元素的value 相同。
maxlength：5| 输入长度最多是 5 的字符串（汉字算一个字符）。
minlength：10|    输入长度最小是 10 的字符串（汉字算一个字符）。
chs(true)|   要求输入全部是中文。
max:5|   输入值不能大于 5。
min:10|  输入值不能小于 10。

> 这些验证规则要求使用ms-rules指令表示，要求为一个普通的JS对象。

> 此外要求验征框架能动起来，还必须在所有表单元素外包一个form元素，在form元素上加ms-validate指令。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-validate</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                aaa: "",
                bbb: '',
                ccc: '',
                validate: {
                    onError: function (reasons) {
                        reasons.forEach(function (reason) {
                            console.log(reason.getMessage())
                        })
                    },
                    onValidateAll: function (reasons) {
                        if (reasons.length) {
                            console.log('有表单没有通过')
                        } else {
                            console.log('全部通过')
                        }
                    }
                }
            })

        </script>
    </head>

    <body ms-controller="test">
        <form ms-validate="@validate">
            <p><input ms-duplex="@aaa" placeholder="username"
                      ms-rules='{required:true,chs:true}' >{{@aaa}}</p>
            <p><input type="password" id="pw" placeholder="password"
                      ms-rules='{required:true}' 
                      ms-duplex="@bbb" /></p>
            <p><input type="password" 
                   ms-rules='{required:true,equalto:"pw"}' placeholder="再填一次"
                   ms-duplex="@ccc | change" /></p>
            <p><input type="submit" value="submit"/></p>
        </form>
    </body>
</html>
```

这是一个简单地注册验证，可见代码变得更加简洁。

>因此，要运行起avalon2的内置验证框架，必须同时使用三个指令。ms-validate用于定义各种回调与全局的配置项（如什么时候进行验证）。ms-duplex用于将单个表单元素及相关信息组成一个Field对象，放到ms-validater指令的fields数组中。ms-rules用于定义验证规则。如果验证规则不满足你，你可以自行在avalon.validators对象上添加。

配置项| 描述
--|--
fields|  框架自行添加，用户不用写。为一个数组，放置ms-duplex生成的Field对象。
onSuccess|   空函数，单个验证成功时触发，this指向被验证元素this指向被验证元素，传参为一个对象数组外加一个可能存在的事件对象。
onError| 空函数，单个验证无论成功与否都触发，this与传参情况同上
onComplete|  空函数，单个验证无论成功与否都触发，this与传参情况同上。
onValidateAll|   空函数，整体验证后或调用了validateAll方法后触发；有了这东西你就不需要在form元素上ms-on-submit="submitForm"，直接将提交逻辑写在onValidateAll回调上
onReset| 空函数，表单元素获取焦点时触发，this指向被验证元素，大家可以在这里清理className、value
validateInBlur|  true，在blur事件中进行验证,触发onSuccess, onError, onComplete回调
validateInKeyup| true, 在keyup事件中进行验证,触发onSuccess, onError, onComplete回调。当用户在ms-duplex中使用change debounce过滤器时会失效
validateAllInSubmit| true，在submit事件中执行onValidateAll回调
resetInFocus|    true，在focus事件中执行onReset回调
deduplicateInValidateAll|    false，在validateAll回调中对reason数组根据元素节点进行去重

> 在上表还有一个没有提到的东西是如何显示错误信息，这个avalon不帮你处理。但提示信息会帮你拼好，如果你没有写，直接用验证规则的message，否则在元素上找data-message或data-required-message这样的属性。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-validate</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: "test",
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                confirm_password: '',
                email: '',
                agree: false,
                topic: [],
                toggle: false,
                validate: {
                    onError: function (reasons) {
                        reasons.forEach(function (reason) {
                            console.log(reason.getMessage())
                        })
                    },
                    onValidateAll: function (reasons) {
                        if (reasons.length) {
                            console.log('有表单没有通过')
                        } else {
                            console.log('全部通过')
                        }
                    }
                }
            })
            avalon.validators.checked = {
                message: '必须扣上',
                get: function (value, field, next) {
                    next(value)
                    return value
                }
            }
             avalon.validators.selecttwo = {
                message: '至少选择两个',
                get: function (value, field, next) {
                    next(!vm.toggle || value.length >= 2)
                    return value
                }
            }
        </script>
    </head>

    <body ms-controller="test">
        <form class="cmxform" ms-validate="@validate" >
            <fieldset>
                <legend>验证完整的表单</legend>
                <p>
                    <label for="firstname">名字</label>
                    <input id="firstname" 
                           name="firstname" 
                           ms-duplex="@firstname"
                           ms-rules="{required:true}" 
                           data-required-message="请输入您的名字" >
                </p>
                <p>
                    <label for="lastname">姓氏</label>
                    <input id="lastname" 
                           name="lastname"
                           ms-duplex="@lastname"
                           ms-rules="{required:true}" 
                           data-required-message="请输入您的姓氏"
                           >
                </p>
                <p>
                    <label for="username">用户名</label>
                    <input id="username" 
                           name="username"
                           ms-duplex="@username | change"
                           ms-rules="{required:true, minlength:2}" 
                           >
                </p>
                <p>
                    <label for="password">密码</label>
                    <input id="password" 
                           name="password" 
                           type="password"
                           ms-duplex="@password"
                           ms-rules="{required:true,minlength:5}" 
                           data-required-message="请输入密码"
                           data-required-message="密码长度不能小于 5 个字母"

                           >
                </p>
                <p>
                    <label for="confirm_password">验证密码</label>
                    <input id="confirm_password" 
                           name="confirm_password" 
                           type="password"
                           ms-duplex="@confirm_password | change"
                           ms-rules="{required:true,equalto:'#password'}" 
                           data-equalto-message="两次密码输入不一致"
                           >
                </p>
                <p>
                    <label for="email">Email</label>
                    <input id="email" 
                           name="email" 
                           type="email"
                           ms-duplex="@email"
                           ms-rules="{email:true}" 
                           data-email-message="请输入一个正确的邮箱"
                           >
                </p>
                <p>
                    <label for="agree">请同意我们的声明</label>
                    <input type="checkbox" class="checkbox" id="agree" name="agree"
                           ms-duplex-checked="@agree"
                           ms-rules="{checked:true}" 
                           >
                </p>
                <p>
                    <label for="newsletter">我乐意接收新信息</label>
                    <input type="checkbox" class="checkbox" 
                           id="newsletter" 
                           name="newsletter"
                           ms-duplex-checked="@toggle"
                           >
                </p>
                <fieldset id="newsletter_topics" ms-visible="@toggle" >
                    <legend>主题 (至少选择两个) </legend>
                    <label for="topic_marketflash">
                        <input type="checkbox" 
                               id="topic_marketflash" 
                               value="marketflash" 
                               name="topic[]" 
                               ms-duplex="@topic"
                               ms-rules="{selecttwo:true}"
                               >Marketflash
                    </label>
                    <label for="topic_fuzz">
                        <input type="checkbox"
                               id="topic_fuzz"
                               value="fuzz"
                               name="topic[]"
                               ms-duplex="@topic"
                               ms-rules="{selecttwo:true}"
                               >Latest fuzz
                    </label>
                    <label for="topic_digester">
                        <input type="checkbox" 
                               id="topic_digester"
                               value="digester"
                               name="topic[]"
                               ms-duplex="@topic"
                               ms-rules="{selecttwo:true}"
                               >Mailing list digester
                    </label>
                    <label for="topic" class="error" style="display:none">至少选择两个</label>
                </fieldset>
                <p>
                    <input class="submit" type="submit" value="提交">
                </p>
            </fieldset>
        </form>
    </body>
</html>
```

里面实现的点很多，可以作为代码库保存起来。确实，avalon在验证里面给了很多便利。

## avalon2学习教程13组件使用
>司徒正美 2016年04月16日发布

网址：[avalon2学习教程13组件使用](https://segmentfault.com/a/1190000004949412)

>avalon2最引以为豪的东西是，终于有一套强大的类Web Component的组件系统。这个组件系统媲美于React的JSX，并且能更好地控制子组件的传参。

>avalon自诞生以来，就一直探索如何优雅的定义组件使用组件。从avalon1.4的ms-widget，到avalon1.5的自定义标签。而现在的版本恰好是它们的结合体，并从web component那里借鉴了slot插入点机制及生命周期管理，从react那里抄来了render字符串模板。

在avalon中，有三大标签作为组建定义的容器。
> xmp, wbr, template

xmp是闭合标签，与div一样，需要写开标签与闭标签。但它里面的内容全部作为文本存在，因此在它里面写带杠的自定义标签完全没问题。并且有一个好处时，它是能减少真实DOM的生成（内部就只有一个文本节点）。
```html
<xmp ms-widget="@config"><ms-button ms-widget="@btn1"><ms-button><div></div><ms-tab ms-widget="@tab"><ms-tab></xmp>
```

wbr与xmp一样，是一个很古老的标签。它是一个空标签，或者说是半闭合标签，像br, area, hr, map, col都是空标签。我们知道，自定义标签都是闭合标签，后面部分根本不没有携带更多有用的信息，因此对我们来说，没多大用处。
```html
<wbr ms-widget="@config" />
```

template是HTML5添加的标签，它在IE9－11中不认，但也能正确解析得出来。它与xmp, wbr都有一个共同特点，能节省我们定义组件时页面上的节点规模。xmp只有一个文本节点作为孩子，wbr没有孩子，template也没有孩子，并且用content属性将内容转换为文档碎片藏起来。
```html
<template ms-widget="@config" ><ms-dialog ms-widget="@config"></ms-dialog></template>
```

当然如果你不打算兼容IE6－8，可以直接上ms-button这样标签。自定义标签比起上面三大容器标签，只是让你少写了is配置项而已，但多写了一个无用的闭标签。
```html
<ms-dialog ms-widget="@config" ><ms-panel ms-widget="@config2"></ms-panel></ms-dialog>
<!--比对下面的写法-->
<xmp ms-widget="@config" ><wbr ms-widget="@config2"/></xmp>
```

如果你想在页面上使用ms-button组件，只能用于以下四种方式
```html
<!--在自定义标签中，ms-widget不是必须的-->
<ms-button></ms-button>
<!--下面三种方式，ms-widget才是存在，其中的is也是必须的-->
<xmp ms-widget='{is:"ms-button"}'></xmp>
<wbr ms-widget='{is:"ms-button"}'/>
<template ms-widget='{is:"ms-button"}'></template>
```

（units1.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-validate</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: 'test',
                button: {//注意这里不能以 $开头
                    buttonText: "VM内容"
                }
            })

            avalon.component('ms-button', {
                template: '<button type="button"><span><slot name="buttonText"></slot></span></button>',
                defaults: {
                    buttonText: "默认内容"
                },
                soleSlot: 'buttonText'
            })

        </script>
    </head>

    <body ms-controller="test">
    <!--在自定义标签中，ms-widget不是必须的-->
    <ms-button ></ms-button>
    <!--下面三种方式，ms-widget才是存在，其中的is也是必须的-->
    <xmp ms-widget='{is:"ms-button"}'></xmp>
    <wbr ms-widget='{is:"ms-button"}'/>
    <template ms-widget='{is:"ms-button"}'></template>
</body>
</html>
```

对其进行少部分修改，能够控制控件更新（units2.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>ms-validate</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
        <script src="../dist/avalon.js"></script>
        <script>
            var vm = avalon.define({
                $id: 'test',
                button: {//注意这里不能以 $开头
                    buttonText: "按钮内容"
                }
            })

            avalon.component('ms-button', {
                template: '<button type="button"><span><slot name="buttonText"></slot></span></button>',
                defaults: {
                    buttonText: "button"
                },
                soleSlot: 'buttonText'
            })

        </script>
    </head>

    <body ms-controller="test">
    <!--在自定义标签中，ms-widget不是必须的-->
    <ms-button ms-widget="@button"></ms-button>
    <!--下面三种方式，ms-widget才是存在，其中的is也是必须的-->
    <xmp ms-widget='[{is:"ms-button"},@button]'></xmp>
    <wbr ms-widget='[{is:"ms-button"},@button]'/>
    <template ms-widget='[{is:"ms-button"},@button]'></template>
</body>
</html>
```
这样我们直接操作 vm中的button对象中对应属性就能更新组件了。

>此外，avalon2还支持Web Components规范中所说的slot插入点机制，它是用来配置
一些字符串长度很长的属性。比如说ms-tabs组件，通常有一个数组属性，
而数组的每个元素都是一个很长的文本，用于以应一个面板。这时我们可以在自定义标签的
innerHTML内，添加一些slot元素，并且指定其name就行了。

>当我们不使用slot，又不愿意写面板内部放进vm时，你的页面会是这样的：
```html
<ms-tabs ms-widget='{panels:[
"第一个面板的内部dfsdfsdfsdfdsfdsf",
"第二个面板的内部dfsdfsdfsdfdsfdsf"
"第三个面板的内部dfsdfsdfsdfdsfdsf"]  }'
></ms-tabs>
```

使用了slot后
```html
<ms-tabs>
<div slot='panels'>第一个面板的内部dfsdfsdfsdfdsfdsf</div>
<div slot='panels'>第二个面板的内部dfsdfsdfsdfdsfdsf</div>
<div slot='panels'>第三个面板的内部dfsdfsdfsdfdsfdsf</div>
</ms-tabs>
```

而你的组件是这样定义
```html
<ms-tabs>
<slot name='panels'></solt>
<slot name='panels'></solt>
<slot name='panels'></solt>
</ms-tabs>
```
上面的div会依次替代slot元素。

此外，如果我们只有一个插槽，不想在页面上slot属性，那么可以在组件里使用soleSlot。

注意avalon.component的第二个参数，是一个对象，它里面有三个配置项，template是必须的， defaults、 soleSlot是可选的。

组件属性的寻找顺序，会优先找配置对象，然后是innerHTML，然后是defaults中的默认值.我们可以看一下测试
```html
div.innerHTML = heredoc(function () {
            /*
             <div ms-controller='widget0' >
             <xmp ms-widget="{is:'ms-button'}">{{@btn}}</xmp>
             <ms-button>这是标签里面的TEXT</ms-button>
             <ms-button ms-widget='{buttonText:"这是属性中的TEXT"}'></ms-button>
             <ms-button></ms-button>
             </div>
             */
        })
        vm = avalon.define({
            $id: 'widget0',
            btn: '这是VM中的TEXT'
        })
        avalon.scan(div)
        setTimeout(function () {
            var span = div.getElementsByTagName('span')
            expect(span[0].innerHTML).to.equal('这是VM中的TEXT')
            expect(span[1].innerHTML).to.equal('这是标签里面的TEXT')
            expect(span[2].innerHTML).to.equal('这是属性中的TEXT')
            expect(span[3].innerHTML).to.equal('button')
            vm.btn = '改动'
            setTimeout(function () {
                expect(span[0].innerHTML).to.equal('改动')
                done()
            })
        })
```

生命周期回调的例子.avalon是使用多种策略来监听元素是否移除，确保onDispose回调会触发！
（units3.html）
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="avalon.js"></script>
        <script>
avalon.component('ms-button', {
    template: '<button type="button"><span><slot name="buttonText"></slot></span></button>',
    defaults: {
        buttonText: "button"
    },
    soleSlot: 'buttonText'
})
            var vm = avalon.define({
                $id: 'widget0',
                config: {
                    buttonText: '按钮',
                    onInit: function (a) {
                        console.log("onInit!!")
                    },
                    onReady: function (a) {
                        console.log("onReady!!")
                    },
                    onViewChange: function () {
                        console.log("onViewChange!!")
                    },
                    onDispose: function () {
                        console.log("onDispose!!")
                    }
                }
            })
            setTimeout(function () {
                vm.config.buttonText = 'change'
                setTimeout(function () {
                    document.body.innerHTML = ""
                }, 1000)
            }, 1000)

        </script>
    </head>

    <body>
        <div ms-controller='widget0' >
            <div><wbr ms-widget="[{is:'ms-button'},@config]"/></div>
        </div>
    </body>
</html>
```