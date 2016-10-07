---
layout: post
title: jQuery-note
published: false
categories: 
- tech

tags: 
- note
- jQuery

time: 2015-03-31 10:20:56
excerpt: jQuery学习笔记

---

## JQ设计思想之选择元素

### JQ版本问题

* jQuery 1.x 支持ie6以上（受众广的网站）
* jQuery 2.x 不支持ie8一下的版本（移动端应用比较好，更小）

### 选择元素

```html
<div id="div1"></div>
<div class="div1"></div>
<div></div>
```

```javascript
$('#div1').css('background', 'red');// 选择id为div1的标签
$('.div1').css('background', 'red');// 选择所有class为div1的标签
$('div').css('background', 'red');// 选择所有div标签
```

### 独有表达式选择方式

```javascript
$('li:even').css('background', 'red');// 选择单数行
$('li:odd').css('background', 'red');// 选择偶数行
$('li:first').css('background', 'red');// 选择第一个元素
$('li').filter('.box').css('background', 'red');// 筛选class为box的元素
$('li').filter('[title=box]').css('background', 'red');// 筛选标签title属性为box的元素
```

## JQ设计思想之写法 （方法函数化）
 
```javascript
// 原生
window.onload = function(){};
onclick = function(){};

// jQuery 
$(function(){});
click(function(){});
$('div1').children().css('background','red');
```

## JQ设计思想之原生关系和链式操作

### 原生关系

jQuery可以和原生javascript混合写，但不能混用

```javascript
$(function(){
    $('#div1').click(function(){
        alert( $(this).html() ); // jq
        alert( this.innerHTML ); // js

        // 非法操作
        // alert( $(this).innerHTML );
        // alert( this.html() );
    })
})
```

### 链式操作

#### 混合写法：

```javascript
$(function(){
    var oDiv = $('#div1');
    oDiv.html('hello');

    oDiv.click(function(){
        alert( 123 );
    })
})
```

#### 链式操作的写法：

```javascript
$('#div1').html('hello').css('background', 'red').click(function(){
    alert(123); 
});
```

## JQ设计思想之取值，赋值

jq中函数的参数经常决定了函数的方式是取值，还是赋值

```javascript
$('li').html('hello'); // 赋值（可以同时赋值全部）
alert($('li').html('hello')); // 取值（只能取第一个值）
``` 

### attr() 取得标签属性和设置标签属性

```javascript
$('#oDiv').attr('title','hello'); // 赋值（可以同时赋值全部）
alert($('#oDiv').attr('title')); // 取值（只能取第一个值）
``` 

### not()和filter()

* filter()过滤器
* not()与filter的反义词

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>filter()和not()</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <div class="box">div1<span class="span">hi</span></div>
    <div>div2</div>
    <script>
    $(function() {
        // 选中box
        $('div').filter('.box').css('background','red');
        // 选中非box
        $('div').not('.box').css('background','red');
    })
    </script>
</body>
</html>
``` 

### has()包含的元素

```javascript
$(function() {
    // 选中div中的span
    $('div').has('span').css('background','red');
});
```

### prev()和next() 上下兄弟节点

```javascript
$(function() {
    // 选中.box的下一兄弟节点div
    $('.box').next('div').css('background','red');
});
```

### find() 查找方法

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>filter()和not()</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <div id="div">
        <h3>man</h3>
        <h2>women</h2>
        <h3>man</h3>
        <h3>man</h3>
        <h3>man</h3>
    </div>
    <script>
    $(function() {
        // 找到女的啦
        $('#div').find('h2').css('background','red');
    })
    </script>
</body>
</html>
```

### eq() 下标

```javascript
$(function() {
    // 选中第3个h3
    $('h3:eq(2)').css('background','red');
})
```

### index() 返回索引

```javascript
$(function() {
    // 选中第3个h3
    $('h3:eq(2)').index();
})
```

## JQ $().常用方法

### addClass()，removeClass()

```javascript
$(function() {
    $('oDiv').addClass('box1 box2');// 用空格做区分,重复的不会添加
    $('oDiv').removeClass('box1');
})
```

### width(),innerWidth(),outerWidth()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>width(),innerWidth(),outerWidth()</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    div{width: 100px;background-color: red;padding: 10px;border: 10px solid black;margin: 10px;}
    </style>
</head>
<body>
    <div>gg</div>
    <script>
    $(function() {
        // 与css()获得的值不同，它没有单位

        $('div').width();// width
        $('div').innerWidth();// width + padding
        $('div').outerWidth();// width + padding + border
        $('div').outerWidth(true);// width + padding + border + margin
    });
    </script>
</body>
</html>
```

### DOM操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>节点操作</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    #div1{width: 100px;height: 100px;background-color: red;}
    #div2{width: 50px;height: 50px;background-color: blue;}
    </style>
</head>
<body>
    <div id="div1">div1</div>
    <div id="div2">div2</div>
    <script>
    $(function() {
        // $('#div2').insertBefore($('#div1'));// 插入到节点之前
        // $('#div1').before($('#div2'));// 操作div2在div1的前面
        // $('#div1').insertAfter($('#div2'));// 插入到节点之后
        // $('#div1').after($('#div2'));// 操作div2在div1的后面
        // $('#div2').appendTo($('#div1'));// 插入到节点之内的后面
        // $('#div2').prependTo($('#div1'));// 插入到节点之内的前面
        // $('#div1').append($('#div2'));// 操作div2到div1的里面的后面
        $('#div1').prepend($('#div2'));// 操作div2到div1的里面的前面
        // $('#div1').remove();// 从文档中删除div1
    });
    </script>
</body>
</html>
```

注：insertBefore与before的区别，操作的元素不同，其他方法同理

### 事件操作 

#### on(), off()

```javascript
// 普通事件写法
$('div').click(function(){
    alert(123);
});

// on 绑定事件
$('div').on('click',function(){
    alert(123);
});
// 多个事件1
$('div').on('click mouseover',function(){
    alert(123);
});

$('div').on({
    'click' : function(){
        alert(123);
    },
    'mouseover' : function(){
        alert(456);
    }
});

// off 取消事件
$('div').on('click',function(){
    // 点击一次后取消
    alert(123);
    $(this).off();
});

$('div').on('click mouseover',function(){
    // 取消mouseover
    alert(123);
    $('div').off('mouseover');
});
```

#### scrollTop() 滚动距离

```javascript
$(function(){
    $(document).click(function(){
        alert($(window).scrollTop());// 滚动距离
    });
})
```

#### 创建元素

$('<div>') 用<>创建元素

```javascript
$(function(){
    var oDiv = $('<div>');
    $('body').append( oDiv );
})
```

### 事件细节

#### 小细节

* ev : event对象
* ev.pageX(相对于文档的位置) ： clientX(相对于可视区)
* ev.which ：keyCode
* ev.preventDefault() ：阻止默认事件
* ev.stopPropagation() : 阻止冒泡操作
* return false; : 阻止默认事件 + 冒泡操作
* one() : 只执行一次,跟on一样使用

#### offset（相对于原生的offsetLeft等）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>节点操作</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    #div1{width: 100px;height: 100px;background-color: red;position: relative;}
    #div2{width: 50px;height: 50px;background-color: blue;margin: 20px;padding: 10px;}
    </style>
</head>
<body>
    <div id="div1"><div id="div2">div2</div></div>
    <script>
    $(function() {
        // alert($('#div2').offset().left); // 与定位无关，获取到屏幕的左距离
        // alert($('#div2').offset().top); // 与定位无关，获取到屏幕的上距离
        // alert($('#div2').position().left); // 到有定位的父级的左距离
        alert($('#div2').position().top); // 到有定位的父级的左距离，把当前元素转换成定位的形式（不计算margin值）
    });
    </script>
</body>
</html>
```

#### parent() 和 offsetParent()

* parent() 获取父级
* offsetParent() 获取有定位父级

#### val(), size(), each()

* $('input').val() 获取值
* $('input').val(123) 赋值

* $('li').size() 获取长度，相当于length

* each() 相当于循环

```javascript
$(function(){
    // @i 下标
    // @elem 每个元素
    $('li').each(function(i,elem){
        $(elem).html(i);
    })
})
```

### hover和简单动画

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>节点操作</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    #div1{width: 100px;height: 100px;background-color: red;}
    #div2{width: 50px;height: 50px;background-color: blue;}
    </style>
</head>
<body>
    <div id="div1">div1</div>
    <div id="div2">div2</div>
    <script>
    $(function() {
        // hover接收两个参数
        $('#div1').hover(function(){
            // 鼠标移入时操作
            // $('#div2').hide();
            // $('#div2').hide(1000);// 加时间时有动画效果
            // $('#div2').fadeIn();// 透明度动画，默认400
            // $('#div2').fadeIn(1000);
            // $('#div2').slideUp();// 宽度动画，可加时间
            $('#div2').fadeTo(1000,0.3);// 指定透明度,和时间
        }, function(){
            // 鼠标移出时操作
            // $('#div2').show();
            // $('#div2').show(1000);
            // $('#div2').fadeOut();
            // $('#div2').fadeOut(1000);
            // $('#div2').slideDown();
            $('#div2').fadeTo(1000,1);
        });
    });
    </script>
</body>
</html>
```

## jQuery高级

### 基础拓展

#### get() 把jQuery转成原生JS

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>get()</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    </style>
</head>
<body>
    <div id="div1">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
    <script>
    $(function() {
        // jq中也有length属性
        for (var i = 0; i < $('li').length; i++) {
            // document.getElementById('#div1').innerHTML;
            // alert($('#div1').get(0).innerHTML); 通过get(下标)来转换成原声js，不带下标时为全选

            $('li').get(i).style.background = 'red';

            // $('li')[i].style.background = 'red';// 同样可行
        };
    });
    </script>
</body>
</html>
```

#### outerWidth()拓展

* 原生中，offsetWidth获取不到隐藏元素的值
* jQuery中outerWidth()可以获取到

#### text() 只获取文本，不会获取标签

* html() 包括文本和标签
* text() 只获取所有元素的文本内容
* text('<h2></h2>') h2被转成文本

#### remove() : detach()

```javascript
$(function(){
    $('div').click(function(){
        alert(123);
    });

    var oDiv = $('div').remove();
    $('body').append(oDiv);// 元素还在，但事件全部取消了
});
```

```javascript
$(function(){
    $('div').click(function(){
        alert(123);
    });

    var oDiv = $('div').detach();
    $('body').append(oDiv);// 元素还在，事件也在
});
```

#### 关于$符号

```javascript
// 简写，等DOM加载完，性能更好
$(function(){
    // ...
});
/* 完整写法
$(document).ready(function(){
    // ... 
});*/

// 等window加载完
window.onload = function(){};
// 对应的： DOMContentLoaded
```

### DOM操作拓展

* parents() 获取所有祖先元素，参数是筛选功能
* closest() 获取最近的指定的祖先节点（包括当前元素自身），必须要写筛选的参数，只能找到一个元素
* siblings() 找所有的兄弟节点，参数也是筛选功能
* nextAll() 下面所有的兄弟节点，参数也是筛选功能
* preAll() 上面所有的兄弟节点，参数也是筛选功能
* parentsUntil() 不写参数等于parents(),写了就顾名思义了……
* nextUntil() 不写参数等于nextAll(),写了就顾名思义了……
* preUntil() 同理
* clone() 复制节点，可以接受一个参数true或者false，可以复制之前的操作行为 
* wrap() 给每个外层包标签，接收类似于'<div>'的字符串
* wrapAll() 给整体包装，会破坏层次
* wrapInner() 内部包装
* unwrap() 删除包装（删除父级 : 不包括body元素）
* add() 任意组合元素，相当于把元素往数组放
* slice(n,m) 截取指定(n到m)节点的范围
* serialize() 格式化form表单的提交数据
* serializeArray() 格式化form表单为json形式

#### add()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery add()操作</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <div>ddddddddd</div>
    <span>aaaaaaaaa</span>
    <h2>ssssssss</h2>
    <script>
    $(function(){
        var ele1 = $('div');
        var ele2 = ele1.add('span').add('h2');

        ele2.css('color','red');
    });
    </script>
</body>
</html>
```

#### serialize()和serializeArray()

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery序列化表单</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <form action="">
        <input type="text" name="username">
        <input type="password" name="password">
        <input type="submit" id="submit">
    </form>
    <script>
    $(function(){
        $('#submit').click(function(){
            // var arr = $('form').serialize();
            var arr = $('form').serializeArray();
            alert(arr[0].value);

            return false;
        });
    });
    </script>
</body>
</html>
```

### jQuery中的运动

#### animate()

$(selector).animate({params},speed,style,callback);

* 必需的 params 参数接收json类数据，定义形成动画的 CSS 属性。
*  * 属性值也可以接收'toggle','show','hide'参数
* 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒
* 可选的 style 参数规定动画形式。它可以取以下值："linear"、"swing" 
* 可选的 callback 参数是动画完成后所执行的函数名称。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery中的运动</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    #div1{width: 100px;height: 100px;background-color: red;}
    #div2{width: 100px;height: 100px;background-color: orange;}
    </style>
</head>
<body>
    <div id="div1"></div>
    <div id="div2"></div>
    <script>
    $(function(){
        $('#div1').click(function(){
            $('#div1').animate({width : '500px',height : '500px'}, 1000, 'linear', function(){
                alert(123);
            });

            /* 相对上一次增加
            $('#div1').animate({width : '+=100px',height : '+=100px'}, 1000, 'linear', function(){
                alert(123);
            });*/

            $('#div2').animate({width : '500px',height : '500px'}, 1000, 'swing', function(){
                alert(123);
            });
        });
    })
    </script>
</body>
</html>
```

#### stop(),finish()

$(selector).stop(stopAll,goToEnd);

* 可选的 stopAll 参数规定是否应该清除动画队列。默认是 false，即仅停止活动的动画，允许任何排入队列的动画向后执行。
* 可选的 goToEnd 参数规定是否立即完成当前动画。默认是 false。

```javascript
$(function(){
        $('#div1').click(function(){
            $('#div1').animate({width : '500px',height : '500px'}, 1000, 'linear', function(){
                alert(123);
            });
        });

        $('#div2').click(function(){
            $('div1').stop();
        });
    })
```

$(selector).finish() 立即结束所有动画

#### delay() 延迟运动

delay(1000) 延迟一秒

```javascript
$(function(){
    $('#div1').click(function(){
        $('#div1').animate({width : '500px'}, 1000).delay(1000).animate({height : '500px'}, 1000);
    });
});
```

### jQuery事件委托

#### 事件委托

* delegate() 绑定事件委托
* undelegate() 解除事件委托

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery事件委托</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    <script>
    $(function(){
        // 类似于冒泡，不用循环
        $('ul').delegate('li','click',function(){
            $(this).css('backgroundColor', 'red');
            $('ul').undelegate();// 取消事件委托
        });
    });
    </script>
</body>
</html>
```

#### 主动触发

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery主动触发</title>
</head>
<body>
    <div id="div1"></div>
    <script>
    $(function(){
   /*     $('#div1').on('click',function(){
           alert(123);
        });

        $('#div1').trigger('click');// 自动触发click事件
*/
        // 自定义事件
        $('#div1').on('show',function(){
           alert(123);
        });

        $('#div1').trigger('show');// 自动触发click事件
    })
    </script>
</body>
</html>
</body>
</html>
```

#### 事件细节

```javascript
$(function(){
    $('#div1').on('click', {name: 'hello'}, function(ev){
        // alert(ev.data.name); // 找出json数据
        // alert(ev.target); // 找出事件源
        // alert(ev.type); // 找出事件类型
    });
});
```

### jQuery工具方法： $下的方法（不是$(()）

$ === jQuery

不仅可以给jQuery用，也可以给原生javascript用，工具方法

* $.type() 得出更精确的类型
* $.trim() 去掉左右空格
* $.inArray() 类似于 indexOf
* $.proxy() 改变this指向
* $.noConflict() 防止冲突的
* $.parseJson() 解析字符串为json
* $.makeArray 转换为数组
* $.isPlainObject( object ) 测试对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery工具方法</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <script>
    $(function(){
        var a = 123;
        alert($.type(a));// 类似于原生typeof，但是返回类型更加精确

        var b = new Date();
        alert($.type(b));// date

        var c = '   d   ';
        alert($.trim(c));// d

        var arr = ['a','b','c','d'];
        alert($.inArray('a', arr)); // 0
        alert($.inArray('z', arr)); // -1
    });
    </script>
</body>
</html>
```

#### $.proxy

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery改变this指向</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <script>
    $(function(){

        function show (n1, n2) {
            alert(this);// window
        }

        show();

        $.proxy(show, document)(); // document

        // 传参方式
        $.proxy(show, document)(3,4); // 1
        $.proxy(show, document,3,4)(); // 2
        $.proxy(show, document,3)(4); // 3

        // 第二种传参可以防止函数运行
        $(document).click( $.proxy(show, window, 3, 4) );
    });
    </script>
</body>
</html>
```

#### $.noConflict

```javascript
var hehe = $.noConflict();

hehe(function(){
    hehe(document).click(function(){
        alert(123);
    });
});
```

#### $.makeArray

```javascript
window.onload = function(){
    var aDiv = document.getElementsByTagName('div'); // 类数组
    $.makeArray(aDiv).push();
}
```

### jQuery Ajax使用

参考：<a href="http://www.w3school.com.cn/jquery/ajax_ajax.asp">w3c Ajax</a>

### jQuery 插件开发

* $.extend 扩展工具方法下的插件形式 $.xxx()
* $.fn.extend 扩展到jQuery对象下的插件形式 $().xxx()

#### 拓展工具方法  $.extend

简单的拓展工具：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery插件</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <script>
    $.extend({
        leftTrim : function(str){
            return str.replace(/^\s+/,'');
        }
    });
    </script>
    <script>
    var str = '   hello   ';
    alert('(' + $.leftTrim(str) + ')');
    </script>
</body>
</html>
```

#### 拓展对象插件  $.fn.extend

简单的拓展对象插件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery插件</title>
    <style>
    #div1{width: 100px;height: 100px;background-color: orange;position: absolute;}
    </style>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <div id="div1"></div>
    <script>
    $.fn.extend({
        drag : function(){
            // this : $('#div1')

            var disX = 0;
            var disY = 0;

            var This = this;

            this.mousedown(function(ev){
                disX = ev.pageX - $(this).offset().left;
                disY = ev.pageY - $(this).offset().top;

                $(document).mousemove(function(ev){
                    This.css('left', ev.pageX - disX);
                    This.css('top', ev.pageY - disY);
                });

                $(document).mouseup(function(){
                    $(this).off();
                });

                return false;
            });
        }
    });
    </script>
    <script>
    $(function(){
        $('#div1').drag();
    })
    </script>
</body>
</html>
```

### jQuery插件深入

学习笔记都来源于：<a href="http://javascript.ruanyifeng.com/jquery/plugin.html#toc0" rel="nofollow">阮老师的教程</a>

#### 原理

本质上，jQuery插件是定义在jQuery构造函数的prototype对象上面的一个方法，这样做就能使得所有jQuery对象的实例都能共享这个方法。**因为jQuery构造函数的prototype对象被简写成jQuery.fn对象**，所以插件采用下面的方法定义。

```javascript
jQuery.fn.myPlugin = function() {
    // Do your awesome plugin stuff here
};
``` 

为了使用美元符号$，改写成这样：

```javascript
/*分号是为了防止多个脚本文件合并时，
其他脚本的结尾语句没有添加分好，
造成的运行时错误*/
;(function ($){
    $.fn.myPlugin = function (){
        // Do your awesome plugin stuff here
    };
})(jQuery);
``` 

还可以把顶层对象（window）作为参数输入，这样可以加快代码的执行速度和执行更有效的最小化操作:

```javascript
;(function ($, window) {
    $.fn.myPlugin = function() {
        // Do your awesome plugin stuff here
    };
}(jQuery, window));
``` 

**注意**：在插件内部，this关键字指的是jQuery对象的实例。而在一般的jQuery回调函数之中，this关键字指的是DOM对象

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <style>
    .box1,.box2,.box3{background-color: red;margin-top: 10px;}
    .box1{width: 100px;height: 100px;}
    .box2{width: 200px;height: 200px;}
    .box3{width: 300px;height: 300px;}
    </style>
    <script>
    (function($){
        // 返回一系列DOM对象中高度最高的那个对象的高度。
        $.fn.maxHeight = function(){
            var max = 0;

            // this 指向调用该插件的元素，即jQuery对象实例
            console.log(this.length); // 3

            this.each(function(){
                // 这里的 this 指向每个 div
                max = Math.max(max, $(this).height());
            });

            return max;
        }
    })(jQuery);

    $(function(){
        alert($('div').maxHeight());
    });
    </script>
</head>
<body>
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
</body>
</html>
``` 

大多数情况下，插件**应该返回jQuery对象**，这样可以**保持链式操作**。

```javascript
(function ($){
    $.fn.greenify = function (){
        this.css("color", "green");
        return this;
    };
})(jQuery);

// 进行链式操作
$("a").greenify().addClass("greenified");
``` 

对于包含多个jQuery对象的结果集，可以采用each方法，进行处理：

```javascript
$.fn.myNewPlugin = function() {
    return this.each(function() {
        // 处理每个对象
    });
};
``` 

插件可以接受一个属性对象参数：

<a href="http://jquery.bootcss.com/jQuery.extend/" rel="nofollow">jQuery.extend()的官方解释</a>

```javascript
(function ($){
    // option 为用户定义的参数
    $.fn.tooltip = function (options){
        // 使用extend方法，为参数对象设置属性的默认值。
        var settings = $.extend( {
            // 设置默认参数
            'location'         : 'top',
            'background-color' : 'blue'
        }, options);

        return this.each(function (){
            // 填入插件代码
        });
    };
})(jQuery);
``` 

#### 侦测环境（不是很明白=  =）

jQuery逐渐从浏览器环境，变为也可以用于服务器环境。所以，定义插件的时候，最好首先侦测一下运行环境。

```javascript
if (typeof module === "object" && typeof module.exports === "object") {
  // CommonJS版本
} else {
  // 浏览器版本
}
``` 

#### 实例

将a元素的href属性添加到网页的插件：

```javascript
(function($){
    $.fn.showLinkLocation = function() {
        return this.filter('a').append(function(){
            return ' (' + this.href + ')';
        });
    };
}(jQuery));

// 用法
$('a').showLinkLocation();
``` 

#### 插件的发布

首先，编写一个插件的信息文件yourPluginName.jquery.json。文件名中的yourPluginName表示你的插件名。

```javascript
{
  "name": "plugin_name",
  "title": "plugin_long_title",
  "description": "...",
  "keywords": ["jquery", "plugins"],
  "version": "0.0.1",
  "author": {
    "name": "...",
    "url": "..."
  },
  "maintainers": [
    {
      "name": "...",
      "url": "..."
    }
  ],
  "licenses": [
    {
      "type": "MIT",
      "url": "http://www.opensource.org/licenses/mit-license.php"
    }
  ],
  "bugs": "...", // bugs url
  "homepage": "...", // homepage url
  "docs": "...", // docs url
  "download": "...", // download url
  "dependencies": {
    "jquery": ">=1.4"
  }
}
``` 

然后，将代码文件发布到Github，在设置页面点击“Service Hooks/WebHook URLs”选项，填入网址http://plugins.jquery.com/postreceive-hook，再点击“Update Settings”进行保存。

最后，为代码加上版本，push到github，你的插件就会加入jQuery官方插件库。

```javascript
git tag 0.1.0
git push origin --tags
``` 

以后，你要发布新版本，就做一个新的tag。
