---
title: jQuery选择器与Sizzle引擎（一）
layout: post
time: 2015-09-20 11:00
tag:
- jQuery
- Sizzle

categories:
- tech

excerpt: 团队的技术分享，我选择了分享 -- 分析Sizzle选择器引擎，故在此做一下笔记，记录Sizzle学习笔记，有了新的体会会再次更新。
---

## 关于CSS选择器

> jQuery选择器的原理与CSS选择器很相似，有必要先了解下CSS表达式在浏览器中是怎么去运作的

CSS1-CCS3提供了非常多的选择器，总体可以分为**4大类**和17种：

* 群组选择器：“，”
* 简单选择器：ID,TAG,CLASS,ATTR,*
* 关系选择器：亲子，后代，相邻，兄弟
* 伪类：动作伪类，目标伪类，语言伪类，状态伪类，结构伪类，取反伪类

**群组选择器用于分组合并多个处理的结构**

```1
selector1, selector2, selectorN
```

**简单选择器：基本都有内置的原生API支持，但是存在兼容问题**

1.`getElementById`

IE7及以下该方法不区分 ID 和 name 属性，也就是说如果存在类似这样的结构

```1
<label for="username">用户名</label><input type="password" id="username">
```

该方法会返回 label 元素，而不是 input 元素，因此选择器引擎会处理该兼容性，通过判断元素的id属性是否与选择器相同来查找元素

2.`getElementsByTagName`

IE8及以下，当 selector 为通配符时，即`*`，返回的结果集会包括注释节点，而且该方法也不能返回 object 元素

第一种情况：判断元素的 nodeType 和 nodeName 来过滤结果集
第二种情况：判断元素的 nodeName 来过滤

3.`getElementsByClassName`

IE9及以上才能使用，因此选择器引擎会选择模拟一个方法来做兼容处理，getElementsByTagName后过滤结果集

4.`getElementsByName`

IE下只能选取表单元素，因为效率比较低，使用场景也小，选择器引擎一般不会去使用它

5.attr选择器

在CSS2.1中，有4个属性选择器：

* `[att]`
* `[att=val]`
* `[att~=val]`属性中含有空格分隔，其中之一为val的，如class属性就是有空格分隔的属性
* `[att|=val]`属性中含有val，或者以val-开头格式的

CSS3中新增了3个属性选择器：

* `[att^=val]`属性中以val开头的
* `[att$=val]`属性中以val结尾的
* `[att*=val]`属性中包含val的

除此之外，jQuery也实现了一些自定义的属性选择器：

* `[att!=val]`

**关系选择器**

- ancestor descendant (CSS1) -- getElementsByTagName，注意注释节点
- parent > child (CSS2) -- 直接children，注意注释节点（如果不考虑XML）
- prev + next (CSS2) -- nextSibling 或 nextElementSibling
- prev ~ siblings (CSS3) -- Sibling迭代

**伪类**

这个细分就很多了，jQuery把这些伪类加工并扩展成几个大块：

- 基本筛选器： eq get first lang not odd root...
- 内容筛选器： contains empty has parent...
- 可见筛选器： hidden visible
- 子元素筛选器： first-child nth-child only-child...
- 表单： bottom checkbox foucs input text...

 ## CSS的解析原理

**排版引擎解析 CSS 选择器时一定要从右往左析**

1. HTML 经过解析生成 DOM Tree（这个我们比较熟悉）；而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。Render Tree 中的元素（WebKit 中称为「renderers」，Firefox 下为「frames」）与 DOM 元素相对应，但非一一对应：一个 DOM 元素可能会对应多个 renderer，如文本折行后，不同的「行」会成为 render tree 种不同的 renderer。也有的 DOM 元素被 Render Tree 完全无视，比如 display:none 的元素。
2. 在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 renderer。对于每个 DOM 元素，必须在所有 Style Rules 中找到符合的 selector 并将对应的规则进行合并。选择器的「解析」实际是在这里执行的，在遍历 DOM Tree 时，从 Style Rules 中去寻找对应的 selector。
3. 因为所有样式规则可能数量很大，而且绝大多数不会匹配到当前的 DOM 元素（因为数量很大所以一般会建立规则索引树），所以有一个快速的方法来判断「这个 selector 不匹配当前元素」就是极其重要的。
4. 如果正向解析，例如「div div p em」，我们首先就要检查当前元素到 html 的整条路径，找到最上层的 div，再往下找，如果遇到不匹配就必须回到最上层那个 div，往下再去匹配选择器中的第一个 div，回溯若干次才能确定匹配与否，效率很低。、
5. 逆向匹配则不同，如果当前的 DOM 元素是 div，而不是 selector 最后的 em，那只要一步就能排除。只有在匹配时，才会不断向上找父节点进行验证。
6. 但因为匹配的情况远远低于不匹配的情况，所以逆向匹配带来的优势是巨大的。同时我们也能够看出，在选择器结尾加上「*」就大大降低了这种优势，这也就是很多优化原则提到的尽量避免在选择器末尾添加通配符的原因。

**CSS的选择器的设计，完全是为了优化从子元素找父元素而决定的**

