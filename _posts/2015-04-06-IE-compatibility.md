---
layout: post
title: 低版本IE为主的兼容性问题╮(╯﹏╰）╭
categories: 
- tech

tags: 
- 笔记
- css
- html
- 兼容性

time: 2015-04-06 21:22:56
excerpt: 众所周知，前端工程师的大坑之一就是低版本的IE浏览器（IE6，IE7，IE8）所带来的，而身为一个敬业（菜鸟）的前端工程师，有必要时刻记住浏览器带来的兼容性问题的解决方案（看着还有2015年5%的IE6市场份额，真想说一句wtf!!!!!）

---

> 本文涉及的代码要放在IE 6，IE 7和IE 8下运行，与标准浏览器进行对比
> 推荐使用IE浏览器测试程序 **IE tester**

## 常见问题

1\. 在IE6元素浮动，如果宽度需要将内容撑开，就给里边的块元素都加浮动

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:400px;}
.left{background:red;float:left;}
.right{float:right; background:blue;}
h3{margin:0;height:30px; float:left;}/*如果不加浮动，ie6下元素不会撑开*/
</style>
</head>
<body>
<div class="box">
    <div class="left">
        <h3>左侧</h3>
    </div>
    <div class="right">
        <h3>右侧</h3>
    </div>
</div>
</body>
</html>
``` 

2\. 在IE6，7下元素要通过浮动并在同一行，就给这行元素都加浮动

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
/* 由于.right没有加浮动，ie6下就会出现间隙啦 */
.left{width:100px;height:100px;background:Red; float:left;}
.right{width:200px;height:100px;background:blue;margin-left:100px;}
</style>
</head>
<body>
    <div class="box">
        <div class="left"></div>
        <div class="right"></div>
    </div>
</body>
</html>
```  

3\. 注意标签的嵌套规范

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
p{width:100px;height:100px;background:Red;}
</style>
</head>
<body>
<!-- 这样做很不文明…… -->
    <p>
        <h3></h3>
    </p>
</body>
</html>
``` 

## 应该注意的兼容性问题

1\. IE6下最小高度问题，在IE6下元素的高度的小于19px的时候，会被当做19px来处理，解决办法，给元素加上`overflow:hidden;`

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{height:2px;background:red;}
</style>
</head>
<body>
    <!-- ie6下.box为19px -->
    <div class="box"></div>
</body>
</html>
```  

2\. border的属性dotted在ie6中不被支持，会被解析成dashed解决方法：使用背景图片平铺

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:100px;height:100px;border:1px dotted #000;}
</style>
</head>
<body>
    <!-- 显示为dashed -->
    <div class="box"></div>
</body>
</html>
```  

3\. 在IE6下解决margin传递要触发haslayout，在IE6下父级有边框的时候，子元素的margin值消失，解决办法:触发父级的haslayout（使用`zoom: 1;`）

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
body{margin:0;}
.box{background:blue;border:1px solid #000;/*zoom:1;*/}
.div{width:200px;height:200px;background:red;margin:100px;}
</style>
</head>
<body>
    <!-- ie6下div的margin不见了 -->
    <div class="box">
        <div class="div"></div>
    </div>
</body>
</html>
``` 

4\. IE6下双边距BUG，在IE6，块元素有浮动和和横向的margin值 ，横向的margin值会被放大成两倍，解决办法: `display:inline;`

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
body{margin:0;}
.box{width:200px;height:200px;background:Red;float:left;margin:100px;/*display:inline;*/}
</style>
</head>
<body>
    <!-- ie6下，box的margin值变成了两倍 -->
    <div class="box"></div>
</body>
</html>
``` 

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ float:left;border:10px solid #000;}
.box div{width:100px;height:100px;background:Red;margin-right:20px;border:5px solid #ccc; float:left;/*display: inline;*/}
/*
    margin-right 一行右侧第一个元素有双边距
    margin-left 一行左侧第一个元素有双边距
*/
</style>
</head>
<body>
<div class="box">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
</div>
</body>
</html>
``` 

5\. 在IE6，7下，li本身没浮动，但是li的内容有浮动，li下边就会产生一个间隙，解决办法:

* 给li加浮动（当IE6下最小高度问题，和li的间隙问题共存的时候需用这种方法解决）
* 给li加`vertical-align`

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
ul{margin:0;padding:0;width:302px;}
li{ list-style:none;height:30px;border:1px solid #000; /*vertical-align:top;*/}
a{width:100px;float:left;height:30px;background:Red;}
span{width:100px;float:right;height:30px;background:blue;}
</style>
</head>
<body>
    <ul>
        <li>
            <a href="#"></a>
            <span></span>
        </li>
        <!-- ie6，ie7下两个li之间有间隙啊啊啊啊 -->
        <li>
            <a href="#"></a>
            <span></span>
        </li>
        <li>
            <a href="#"></a>
            <span></span>
        </li>
    </ul>
</body>
</html>
``` 

6\. 在IE6下的文字溢出BUG，子元素的宽度和父级的宽度相差小于3px的时候,两个浮动元素中间有注释或者内嵌元素，解决办法:用div把注释或者内嵌元素用div包起来  

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:400px;}
.left{float:left;}
.right{width:400px;float:right;}
</style>
</head>
<body>
    <div class="box">
        <div class="left"></div>
        <!-- IE6下的文字溢出BUG，因为有了注释 --><span></span>

        <!-- 我是正确的 start -->
        <div><!-- IE6下的文字溢出BUG，因为有了注释 --><span></span></div>
        <!-- 我是正确的 end -->

        <div class="right">&darr;我会溢出来找你的……</div>
    </div>
</body>
</html>
``` 

7\. 当一行子元素占有的宽度之和和父级的宽度相差超过3px,或者有不满行状态的时候,最后一行子元素的下margin在IE6下就会失效，解决方法：尽量用padding来代替

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{border:10px solid #000;width:600px; overflow:hidden;}
.box div{width:100px;height:100px;background:Red;margin:20px;border:5px solid #ccc; float:left; display:inline;}
</style>
</head>
<body>
    <div class="box">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <!-- 最后一行margin失效了 -->
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>
</body>
</html>
``` 

8\. IE6，7下，子元素有相对定位的话，父级的overflow包不住子元素，解决办法: 给父级也加相对定位

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:200px;height:200px;border:1px solid #000; overflow:auto; /*position:relative;*/}
.div{ width:150px;height:300px;background:yellow; position:relative;}
</style>
</head>
<body>
    <div class="box">
        <!-- IE6，7下div溢出了 -->
        <div class="div"></div>
    </div>
</body>
</html>
``` 

9\. 在IE6下绝对定位元素的父级宽高是奇数的时候，元素的right值和bottom值会有1px的偏差（注意：top和left不会出现该问题）

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{width:201px;height:201px;border:1px solid #000; position:relative;}
.box span{ width:20px;height:20px;background:yellow; position:absolute;right:0px;bottom:0px;/*right:-1px;bottom:-1px;*/}
</style>
</head>
<body>
    <div class="box">
        <!-- ie6下span离div还有一个像素 -->
        <span></span>
    </div>
</body>
</html>
``` 

10\. `position: fixed;`在ie6下不能使用

11\. 在IE6，7下输入类型的表单控件上下各有1px的间隙，解决办法:给input加浮动

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:200px;height:32px;border:1px solid red;}
input{width:100px;height:30px;border:1px solid #000;margin:0;padding:0; /*float:left;*/}
</style>
</head>
<body>
    <div class="box">
        <!-- ie6,7下有1px的空隙 -->
        <input type="text" />
    </div>
</body>
</html>
``` 

12\. 在IE6，7下输入类型的表单控件输入文字的时候，背景图片会跟着一块移动，解决办法: 把背景加给父级

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:100px;height:30px;border:1px solid red;background:yellow; background:url(ball.png) no-repeat;/*把背景加给我，please!*/}
input{width:100px;height:30px;border:none;margin:0;padding:0; float:left; background:none;}
</style>
</head>
<body>
    <div class="box">
        <input type="text" />
    </div>
</body>
</html>
``` 

13\. 想要去掉input的border属性，在IE6，7下输入类型的表单控件加`border:none;`的同时重置input的背景

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:200px;height:32px;border:1px solid red;background:yellow;}
input{width:100px;height:30px;border:none;margin:0;padding:0; float:left; /*background:#fff;*/}
</style>
</head>
<body>
<div class="box">
    <!-- IE6，7去边框失败…… -->
    <input type="text" />
</div>
</body>
</html>
``` 

14\. IE 6不支持png格式的图片透明，解决方案：开源插件 <a href="http://www.dillerdesign.com/experiment/DD_belatedPNG/">DD_belatedPNG.js</a> 解决图片透明问题

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
body{ background:#000;}
.box{width:400px;height:400px;background:url(img/png.png);}
</style>

<!--[if IE 6]>
<script src="DD_belatedPNG_0.0.8a.js"></script>
<script>
DD_belatedPNG.fix('.box');
</script>
<![endif]-->

</head>
<body>
    <div class="box"></div>
</body>
</html>
``` 

15\. 在IE6下，在important，后边在家一条同样的样式，会破坏掉important的作用，会按照默认的优先级顺序来走

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{width:100px;height:100px;background:red !important; background:pink;}
</style>
</head>
<body>
    <!-- ie6中box为黑色 -->
    <div class="box" style="background:#000;"></div>
</body>
</html>
``` 

16\. CSS hack（危险，尽量不要使用！）

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:100px;height:100px;background:Red;background:blue\9; +background:yellow;_background:green;}
@media screen and (-webkit-min-device-pixel-ratio:0){.box{background:pink}}
/*
css hack：
    \9    IE10之前的IE浏览器解析
    +,*    IE7包括IE7之前的IE浏览器解析
    _    IE6包括IE6之前的IE浏览器   
    chrome hack 的写法：@media screen and (-webkit-min-device-pixel-ratio:0){.box{background:pink}}
*/
</style>
</head>
<body>
    <div class="box"></div>
</body>
</html>
``` 

17\. ie6不支持fixed，可模拟如下（存在一些小问题，比较少使用）:

第一种方法：

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
html{height:100%;overflow:hidden;}
body{margin:0; height:100%;overflow:auto;}
.box{height:2000px;}
.div{width:100px;height:100px;background:red; position:absolute;left:100px;top:100px;}
</style>
</head>
<body>
    <!-- 因为.div相对于document定位，当文档大小不变时，.div也不会移动 -->
    <div class="box">
        <div class="div"></div>
    </div>
</body>
</html>
``` 

第二种方法：

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{height:2000px;}
.div{width:100px;height:100px;background:red; position:fixed;left:100px;top:100px;_position:absolute;_top:expression(eval(document.documentElement.scrollTop+100));
}
</style>
</head>
<body>
    <!-- css hack模式 -->
    <!-- ie6下滑动时会颤抖…… -->
    <div class="box">
        <div class="div"></div>
    </div>
</body>
</html>
``` 

## 番外篇--布局……

### 圣杯布局（双飞翼布局）

左右两侧固定，中间自由伸缩，中间先加载

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
body{margin:0;}
.center{height:600px;background:#f60;margin:0 200px;}
.left{width:200px;background:#fc0;height:600px; position:absolute;left:0;top:0;}
.right{width:200px;background:#fcc;height:600px;position:absolute;right:0;top:0;}
</style>
</head>
<body>
    <div class="center"></div>
    <div class="left"></div>
    <div class="right"></div>
</body>
</html>
```

### 等高布局

容器高度随着左右两边的增高而变化

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
body{margin:0;}
.wrap{ width:900px;margin:0 auto; border:10px solid #000; overflow:hidden;}
.wrap:after{content:"";display:block;clear:both;}
.left{width:200px;background:Red;float:left; padding-bottom:10000px; margin-bottom:-10000px;}
.center{float: left;padding-bottom: 10000px;margin-bottom: -10000px;background-color: yellow;width: 500px;}
.right{width:200px;background:blue;float:right;padding-bottom:10000px;margin-bottom:-10000px;}
</style>
</head>
<body>
    <div class="wrap">
        <div class="left">
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
        </div>
        <div class="center">
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
        </div>
        <div class="right">
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
            &nbsp;页面内容<br/>
        </div>
    </div>
</body>
</html>
``` 

> 可能还有别的知识，未完待补充！！
> 
> 如果你有一些其他的跟兼容性有关的知识，请分享给我，谢谢！





