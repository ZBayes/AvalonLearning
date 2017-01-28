require.config({
    baseUrl:'',// 本地模块的基础目录
    paths:{// 制定各个模块的位置
        jquery:'vendor/jquery/jquery-2.1.1',
        avalon:'vendor/avalon/avalon',
        text:'vendor/require/text',
        domReady:'vendor/require/domReady',
        css:'vendor/require/css'
    },
    priority:['text','css'], //某些模块优先加载
    shim:{ // 帮助加载非AMD库
        jquery:{
            export:'jQuery'
        },
        avalon:{
            export:'avalon'
        }
    }
});

require(['avalon','domReady!'],function(){
    avalon.log("加载avalon完毕，开始构建根VM和加载其他模块")
    avalon.templateCache.empty="&nbsp;"
    avalon.define({
        $id:'root',
        header:'这是根模块，用于放置其他模块都共用的东西，比如<b>用户名</b>',
        footer:'页脚信息',
        page:'empty'
    })
    avalon.scan(document.body)

    require(['.modules/aaa/aaa'],function(){
        avalon.log("其他模块加载完毕")
    });
});