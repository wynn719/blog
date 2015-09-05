---
title: sticky footer
layout: post
time: 2015-9-5 10:19:38 
tag:
- css

categories:
- tech

excerpt: css实现页面底部模块固定和自适应
---

开发中经常会碰到的一种情况是：由于页面的内容不够长，无法撑开页面，导致底部的模块下面留下一大块空白，实在不雅，sticky footer技术解决了这个问题

1.页面结构：

{% highlight html %}
<div class="page-wrap">
	<div class="header">
		header
	</div>
	<div class="content">
		<button id="add">Add Content</button>
	</div>
</div>

<div class="site-footer">
	footer is!
</div>
{% endhighlight %} 

2.css：**因为此处使用到了after伪元素，所以也就意味着IE7以下是无法使用该方法的**

{% highlight css %}
* {
	margin: 0;
	padding: 0;
}
html, body {
	height: 100%; /* 注意，这是必须的 */
}
.header {
	height: 100px;
	background-color: #ffff80;
}
.page-wrap {
	min-height: 100%;
	margin-bottom: -150px; /* 必须与footer高度相等 */
}
.page-wrap:after {
	content: "";
	display: block;
	height: 150px;
}
.site-footer {
	height: 150px;
}
.site-footer {
	background-color: #0080ff;
}
{% endhighlight %}

3.原理：

- `margin-bottom` 将footer向上拉动
- `:after`用于当页面长度超过屏幕时占位把footer向下挤
- footer必须位于最外层，这也DOM结构有所不规范

实现的效果可看：[http://1.wynnezheng.sinaapp.com/sticky_footer/index.html](http://1.wynnezheng.sinaapp.com/sticky_footer/index.html "sticky footer")
