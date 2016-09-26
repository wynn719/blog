---
layout: post
title: HTML-CSS的细节与注意事项
categories: 
- tech

tags: 
- 笔记
- html
- css

time: 2015-04-06 23:22:56
excerpt: 主要记录网站开发中，html和css里一些比较容易忽视的细节和ie等浏览器的兼容性问题

---

1\. `border-style : dotted`的'dotted'属性**不兼容ie6**

2\. 不同元素的上下外边距`margin`会叠压，父子级包含的时候子级的`margin-top`会传递给父级；（内边距替代外边距）

3\. `word-spacing : 30px` 单词间距（以空格为解析单位）

4\. 样式优先级  tag(1)  <  class(10)  <  id(100)  <  style行间样式(1000) < js

5\. **IE6不支持**a以外其它任何标签的伪类；IE6以上的浏览器支持所有标签的`hover`伪类。

6\. 行内样式 `inline` 的特点：

* 默认同行可以继续跟同类型标签；
* 内容撑开宽度
* 不支持宽高
* 不支持上下的`margin`和`padding`
* 代码换行被解析

7\.1 `inline-block`的特点:

* 块在一行显示；
* 行内属性标签支持宽高；
* 没有宽度的时候内容撑开宽度

7\.2 `inline-block`存在的问题:

* 代码换行被解析；(代码换行的时候样式会有空隙)
* **ie6 ie7 不支持**块属性标签的inline-block;

8\. `img`的默认属性为`inline-block`，`img`自带边框（经常在css reset中重置边框为 none）

9\. `cursor : url(我的鼠标.jpg),pointer;`cursor也可以自带图片来模拟鼠标样式，但后面需要附上的默认样式

10\. 谨慎使用通配符`*`，会影响性能

11\. clear left/right/both/none 是指元素的某个方向不能有浮动元素

12\. 在**ie6下**高度小于19px的元素，高度会被当做19px来处理,解决办法:给该元素设置`overflow:hidden`

13\. **ie6**,7的hasLayout属性使得具有宽度的父级子元素不需要清除浮动

14\. **ie6**,7下元素浮动，要并在同一行的元素都要加浮动

15\. **IE6下**的双边距BUG

* 在IE6下，块元素有浮动和横向margin的时候，横向的margin值会被放大成两倍
* 解决办法: `display:inline`

16\. **IE6，7**下li的间隙
    
* 在IE6，7下li本身没浮动,但是li内容有浮动的时候，li下边就会产生几px的间隙
* 解决办法: 1.给li加浮动;2.给li加`vertical-align:top`;
        
17\. 图片下的空隙问题，`vertical-align:top`解决

18\. `position:absolute;`绝对定位的注意事项：

* 使内嵌支持宽高；(定义了绝对定位后，不用设置`display: block`)
* 块属性标签内容撑开宽度

19\. **ie6不支持**固定定位 `position: fixed;`，固定定位与绝对定位的差别是，固定定位始终相对于整个文档进行定位

20\. **ie7以下**父级的`overflow:hidden;`是包不住子级的相对定位的

21\. 在 ** IE6 下** 定位元素的父级宽高都为奇数那么在 **IE6 下** 定位元素的 right 和 bottom 都有1像素的偏差。

22\. 相对定位和绝对定位也可以用于清除浮动

23\. 英文断句的方式：

* `word-break:break-all;`所有形式的句子都断句，不考虑单词连贯性
* `word-break:break-word`保持英文单词完整性的断句

24\. 文本溢出显示省略号，在相应的显示文本的元素上加上`white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`样式。

25\. 未知宽高的img如何在容器里水平垂直居中？

方案一：使用vertical-align属性（多了没用的标签，个人不太推荐使用）

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:800px;height:600px;border:2px solid #000; text-align:center;}
span{ display:inline-block; height:100%; vertical-align:middle;}
img{ vertical-align:middle;}
</style>
</head>
<body>
    <div class="box">
        <img src="bigptr.jpg" /><span></span>
    </div>
</body>
</html>
```

方案二：使用表格布局默认居中的特性

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
.box{ width:800px;height:600px;border:2px solid #000;display:table;position:relative; overflow:hidden;}
span{ display:table-cell; text-align:center; vertical-align:middle;*position:absolute;left:50%;top:50%;}
img{ *position:relative; vertical-align:top;left:-50%;top:-50%;}
</style>
</head>
<body>
<div class="box">
    <span><img src="bigptr.jpg" /></span>
</div>
</body>
</html>
``` 

