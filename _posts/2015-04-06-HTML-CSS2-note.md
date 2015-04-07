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

* 代码换行被解析；
* **ie6 ie7 不支持**块属性标签的inline-block;

8\. `img`的默认属性为`inline-block`，`img`自带边框（经常在css reset中重置边框为 none）


