---
layout: post
title: css常用布局总结
categories: 
- tech

tags: 
- css
- 笔记

time: 2015-04-26 20:45:56
excerpt: （对之前旧笔记关于布局的加深理解）主要记录常用布局中，双飞翼布局、圣杯布局、栅格布局的特性，实现原理，优缺点。

---

## 等高布局

1. 容器高度随着左右两边的增高而变化
2. 通过`padding-bottom: 10000px;`和`margin-bottom: -10000px;`互相挤压，外容器隐藏溢出，形成自适应高度

{% highlight html %}
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
{% endhighlight %} 

{% highlight css %}
.wrap {
    width:100%;
    margin:0 auto;
    overflow:hidden;
}
.wrap:after {
    content:"";
    display:block;
    clear:both;
}
.left {
    width:20%;
    background:Red;
    float:left;
    padding-bottom:10000px;
    margin-bottom:-10000px;
}
.center {
    float: left;
    padding-bottom: 10000px;
    margin-bottom: -10000px;
    background-color: yellow;
    width: 60%;
}
.right {
    width:20%;
    background:blue;
    float:right;
    padding-bottom:10000px;
    margin-bottom:-10000px;
}
{% endhighlight %} 

效果如下：

<div class="wrap" style="width:100%; margin:0 auto; overflow:hidden;">
    <div class="left" style="width:20%; background:#99b4de; float:left; padding-bottom:10000px; margin-bottom:-10000px;">
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
    </div>
    <div class="center" style="float: left; padding-bottom: 10000px; margin-bottom: -10000px; background-color: #ffff80; width: 60%;">
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        因为我最高所以他们跟着我一样高了！
    </div>
    <div class="right" style="width:20%; background:#80ffff; float:right; padding-bottom:10000px; margin-bottom:-10000px;">
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
        &nbsp;页面内容<br/>
    </div>
</div>

## 圣杯布局与双飞翼布局

### 共同点

1. 三栏布局
2. 主要内容块在最前面（优先载入），但布局位于中间
3. 两侧固定宽度，分别位于中间主要内容块的两侧，中间流式布局（自动调整宽度）
4. 技术使用：`float`、`margin`(负边距)、`position`(relative)

### 圣杯布局

#### 布局原理

1. 三栏全部浮动
2. html内容顺序 main-left-right，main优先载入
3. 

#### 代码实现

html样式：

{% highlight html %}
<div class="container">
    <div class="main">main</div>
    <div class="left">left</div>
    <div class="right">right</div>
</div>
{% endhighlight %} 

基本css：呈现三列布局

{% highlight css %}
.container {
    overflow: hidden;
}
.main {
    float: left;
    width: 100%;
    background-color: #c0c0c0;
    height: 200px;
}
.left {
    float: left;
    width: 200px;
    background-color: #80ffff;
    height: 200px;
    margin-left: -100%;/*注意此时为100%*/
}
.right {
    float: left;
    width: 150px;
    background-color: #80ff80;
    margin-left: -150px;
    height: 200px;
}
{% endhighlight %} 

处理中间块：解决中间块被掩盖的问题

{% highlight html %}
<div class="container">
    <!-- 添加额外标签来解决 -->
    <div class="main">
        <div class="main-content">#main</div>
    </div>
    <!-- 添加额外标签来解决 -->
    <div class="left">left</div>
    <div class="right">right</div>
</div>
{% endhighlight %} 

{% highlight css %}
/*加入一条新的属性*/
.main-content {  
    margin: 0 230px 0 190px;
}
{% endhighlight %} 

效果如下：

<div class="container" style="overflow: hidden;">
    <div class="main" style="float: left; width: 100%; background-color: #c0c0c0; height: 200px;">
        <div class="main-content" style="margin: 0 230px 0 190px;">#main</div>
    </div>
    <div class="left" style="float: left; width: 200px; background-color: #80ffff; height: 200px; margin-left: -100%;">left</div>
    <div class="right" style="float: left; width: 150px; background-color: #80ff80; margin-left: -150px; height: 200px;">right</div>
</div>

> 双飞翼布局完成啦！
> 
> 同时，还可以给该布局加上登高布局的特性，就形成一个流式的布局

#### 另一种实现方案（(bsolute)(比较简单)

{% highlight html %}
<div class="container">
    <div class="main">main</div>
    <div class="left">left</div>
    <div class="right">right</div>
</div>
{% endhighlight %} 

{% highlight css %}
.container{
    position: relative;
}
.main {
    height:600px;
    background:#f60;
    margin:0 200px;
}
.left {
    width:200px;
    background:#fc0;
    height:600px;
    position:absolute;
    left:0;
    top:0;
}
.right {
    width:200px;
    background:#fcc;
    height:600px;
    position:absolute;
    right:0;
    top:0;
}
{% endhighlight %}

> 也可以加入登高布局的特性！ 

## 流式栅格布局


