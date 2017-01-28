# 司徒正美Avalon教程-From 简书
暂时没有摘要

## avalon2学习教程01
> 司徒正美 2016年04月06日发布

网址：[avalon2学习教程01](https://segmentfault.com/a/1190000004882326)

首先是第一个跑成功的avalon案例：(easy_example\first.html)
```HTML
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
```HTML
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

```HTML
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
```HTML
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
```HTML
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

```HTML
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
[avalon2学习教程04显示隐藏处理](https://segmentfault.com/a/1190000004885280)

主角是ms-visible。类比display和jQuery的toggle。

第一个例子（visible1.html）
```HTML
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
```HTML
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

下面这个例子就是一个实例，用于实现一个切换卡。
```HTML

```