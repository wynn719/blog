---
layout: post
title: jQuery-note
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

{% highlight html %}
<div id="div1"></div>
<div class="div1"></div>
<div></div>
{% endhighlight %}

{% highlight javascript %}
$('#div1').css('background', 'red');// 选择id为div1的标签
$('.div1').css('background', 'red');// 选择所有class为div1的标签
$('div').css('background', 'red');// 选择所有div标签
{% endhighlight %}

### 独有表达式选择方式

{% highlight javascript %}
$('li:even').css('background', 'red');// 选择单数行
$('li:odd').css('background', 'red');// 选择偶数行
$('li:first').css('background', 'red');// 选择第一个元素
$('li').filter('.box').css('background', 'red');// 筛选class为box的元素
$('li').filter('[title=box]').css('background', 'red');// 筛选标签title属性为box的元素
{% endhighlight %}

## JQ设计思想之写法 （方法函数化）
 
{% highlight javascript %}
// 原生
window.onload = function(){};
onclick = function(){};

// jQuery 
$(function(){});
click(function(){});
$('div1').children().css('background','red');
{% endhighlight %}

## JQ设计思想之原生关系和链式操作

### 原生关系

jQuery可以和原生javascript混合写，但不能混用

{% highlight javascript %}
$(function(){
    $('#div1').click(function(){
        alert( $(this).html() ); // jq
        alert( this.innerHTML ); // js

        // 非法操作
        // alert( $(this).innerHTML );
        // alert( this.html() );
    })
})
{% endhighlight %}

### 链式操作

#### 混合写法：

{% highlight javascript %}
$(function(){
    var oDiv = $('#div1');
    oDiv.html('hello');

    oDiv.click(function(){
        alert( 123 );
    })
})
{% endhighlight %}

#### 链式操作的写法：

{% highlight javascript %}
$('#div1').html('hello').css('background', 'red').click(function(){
    alert(123); 
});
{% endhighlight %}

## JQ设计思想之取值，赋值

jq中函数的参数经常决定了函数的方式是取值，还是赋值

{% highlight javascript %}
$('li').html('hello'); // 赋值（可以同时赋值全部）
alert($('li').html('hello')); // 取值（只能取第一个值）
{% endhighlight %} 

### attr() 取得标签属性和设置标签属性

{% highlight javascript %}
$('#oDiv').attr('title','hello'); // 赋值（可以同时赋值全部）
alert($('#oDiv').attr('title')); // 取值（只能取第一个值）
{% endhighlight %} 

### not()和filter()

* filter()过滤器
* not()与filter的反义词

{% highlight html %}
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
{% endhighlight %} 

### has()包含的元素

{% highlight javascript %}
$(function() {
    // 选中div中的span
    $('div').has('span').css('background','red');
});
{% endhighlight %}

### prev()和next() 上下兄弟节点

{% highlight javascript %}
$(function() {
    // 选中.box的下一兄弟节点div
    $('.box').next('div').css('background','red');
});
{% endhighlight %}

### find() 查找方法

{% highlight html %}
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
{% endhighlight %}

### eq() 下标

{% highlight javascript %}
$(function() {
    // 选中第3个h3
    $('h3:eq(2)').css('background','red');
})
{% endhighlight %}

### index() 返回索引

{% highlight javascript %}
$(function() {
    // 选中第3个h3
    $('h3:eq(2)').index();
})
{% endhighlight %}

## JQ $().常用方法

### addClass()，removeClass()

{% highlight javascript %}
$(function() {
    $('oDiv').addClass('box1 box2');// 用空格做区分,重复的不会添加
    $('oDiv').removeClass('box1');
})
{% endhighlight %}

### width(),innerWidth(),outerWidth()

{% highlight html %}
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
{% endhighlight %}

### DOM操作

{% highlight html %}
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
{% endhighlight %}

注：insertBefore与before的区别，操作的元素不同，其他方法同理

### 事件操作 

#### on(), off()

{% highlight javascript %}
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
{% endhighlight %}

#### scrollTop() 滚动距离

{% highlight javascript %}
$(function(){
    $(document).click(function(){
        alert($(window).scrollTop());// 滚动距离
    });
})
{% endhighlight %}

#### 创建元素

$('<div>') 用<>创建元素

{% highlight javascript %}
$(function(){
    var oDiv = $('<div>');
    $('body').append( oDiv );
})
{% endhighlight %}

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

{% highlight html %}
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
{% endhighlight %}

#### parent() 和 offsetParent()

* parent() 获取父级
* offsetParent() 获取有定位父级

#### val(), size(), each()

* $('input').val() 获取值
* $('input').val(123) 赋值

* $('li').size() 获取长度，相当于length

* each() 相当于循环

{% highlight javascript %}
$(function(){
    // @i 下标
    // @elem 每个元素
    $('li').each(function(i,elem){
        $(elem).html(i);
    })
})
{% endhighlight %}

### hover和简单动画

{% highlight html %}
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
{% endhighlight %}