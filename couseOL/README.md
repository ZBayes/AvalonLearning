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