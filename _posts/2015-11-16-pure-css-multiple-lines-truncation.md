---
title: CSS多行文字截断（适用移动端）
layout: post
time: 2015-11-16 21:53:17 
tag:
- css

categories:
- tech

excerpt: 最近在项目中遇到的小问题，单行文字截断经常看到，但是多行文字截断的方法比较少，故分享下关于多行文字截断的实现方法
---

废话不多说，直接讲一下常见的单行截断：

{% highlight html %}
<div class="single-line">
    For a while I think we have got away with it, but then a flare goes up and we are caught suddenly in broad daylight.
</div>
{% endhighlight %}

{% highlight css %}
.single-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;/* 给一个宽度限制就可以出现...了 */
}
{% endhighlight %}

这个方法在各大浏览器都适用，然而当遇到需要多行截断时问题就来啦，除了粗暴的用后台来根据指定字数`truncate`掉，或者粗暴的写个js`truncate`掉，其实还可以用纯css的方法来实现：

{% highlight html %}
<div class="multiple-lines">
    For a while I think we have got away with it, but then a flare goes up and we are caught suddenly in broad daylight.
</div>
{% endhighlight %}

{% highlight css %}
.multiple-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    width: 200px; /* 一样要给一个宽度 */
}
{% endhighlight %}

**唯一不足的是，如代码所见，对webkit内核的支持比较好，因此在移动端的兼容性会比较好（移动端大部分浏览器都是webkit内核）**

这么重要的属性估计很快也会得到w3c的支持的！如果有兼容性问题的话，对于这种功能只能是用**后台或者js**粗暴的解决了。。。