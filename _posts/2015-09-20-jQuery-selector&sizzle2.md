---
published: false
title: jQuery选择器与Sizzle引擎（二）
layout: post
time: 2015-10-10 0:01:51 
tag:
- jQuery
- Sizzle

categories:
- tech

excerpt: 团队的技术分享，我选择了分享 -- 分析Sizzle选择器引擎，故在此做一下笔记，记录Sizzle学习笔记，有了新的体会会再次更新。
---

## Sizzle选择器

> Sizzle，作为一个独立全新的选择器引擎，出现在jQuery 1.3版本之后，并被John Resig作为一个开源的项目，可以用于其他框架：Mool、Dojo、YUI等。

jQuery是总入口，选择器支持9种方式的处理：

{% highlight javascript %}
1.$(document)   
2.$('<div>')
3.$('div')
4.$('#test')
5.$(function(){})
6.$("input:radio", document.forms[0]);
7.$('input', $('div'))
8.$()
9.$("<div>", {
         "class": "test",
         text: "Click me!",
         click: function(){ $(this).toggleClass("test"); }
      }).appendTo("body");
10.$($('.test'))
{% endhighlight %}

## Sizzle的设计思路

Sizzle 的选择器匹配思路和 CSS 是类似的，也是从右到左的匹配，当然，只能说大体是这样，在1.8中引入了编译的概念，大大提高了重复的选择的效率。

Sizzle引擎提供的接口跟document.querySelectorAll是一样的，其输入是一串选择器字符串，输出则是一个符合这个选择器规则的DOM节点列表（jQuery对这个结果集做了处理，成为jQuery对象）

Sizzle 的整体结构：

- Sizzle 主函数，包含选择器的切割，内部循环调用 Sizzle.find,Sizzle.filter,最后是去重过滤
- 辅助函数， 如 uniqueSort，matches，matchesSelector
- find 主查找函数
- filter 主过滤函数
- selectors 包含各种匹配的正则，过滤用的正则，分解过的正则，预处理函数，过滤函数
- 根据浏览器特征设置的 makeArray，sortOrder，contains等方法
- 根据浏览器特征重写的 selectors 的部分查找函数，过滤函数，查找次序
- 若浏览器支持 querySelectorAll，用该函数重写 Sizzle，原 Sizzle 备用
- 其他辅助函数，isXML，posProcess

## 当 `$()` 获得一个选择器字符串是怎么做的？

直截了当，`$()`绑定在了这个函数上：

{% highlight javascript %}
init = jQuery.fn.init = function(selector, context) { // @note : 选择器初始入口
    var match, elem;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if (!selector) {
        return this;
    }

    // Handle HTML strings
    if (typeof selector === "string") {
        if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
            // Assume that strings that start and end with <> are HTML and skip the regex check
            match = [null, selector, null];

        } else {
            match = rquickExpr.exec(selector); // 正则过滤
        }

        // Match html or make sure no context is specified for #id
        if (match && (match[1] || !context)) {

            // HANDLE: $(html) -> $(array)
            if (match[1]) {
                ...
            } else { // @note : 处理id
                elem = document.getElementById(match[2]);

                ...

                this.context = document;
                this.selector = selector;
                return this;
            }

            // HANDLE: $(expr, $(...))
        } else if (!context || context.jquery) { 
            return (context || rootjQuery).find(selector);

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
        } else { // @note : 对于复杂选择器从这里进入 find 函数中
            return this.constructor(context).find(selector);
        }

        // HANDLE: $(DOMElement)
    } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;

        // HANDLE: $(function)
        // Shortcut for document ready
    } else if (jQuery.isFunction(selector)) {
        return typeof rootjQuery.ready !== "undefined" ?
            rootjQuery.ready(selector) :
            // Execute immediately if ready is not present
            selector(jQuery);
    }

    if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
    }

    return jQuery.makeArray(selector, this);
};
{% endhighlight %}

过程是这样子的：

1. `$()`选择元素
2. 如果不是`<div>`这种形式的选择符（很少用，但是jQuery确实支持），则对字符串做**正则过滤(防止XSS等)**
3. 然后检测是否为`$('#id') 和 $('<li>hello')，$('<li>')`这种形式的选择符，当然后面那种形式不做详解，处理id时会调用原生的接口`document.getElementById`（如果遇到 IE7 下 `name` 和 `id` 混淆的问题，**进入接口 `find`** ）
4. 当发现是复杂选择器时，进入接口 `find`
5. 当选择器不是字符串时，如 `document`, `Function`, `undefined`另做处理，不详解

到这里，可以知道，**当面对复杂情况时，`jQuery.fn.init` 把工作都交给了 `jQuery.find`** (果不其然，find 很重要) 

**But**，并不是直接进入`jQuery.find`函数，而是先进入非常熟悉的`jQuery.extend.find()`方法中，也就是常用的`$().find()`方法

{% highlight javascript %}
jQuery.fn.extend({ // 写插件的会发现，插件都是写在这个extend接口下的
    find: function(selector) {
        var i,
            ret = [],
            self = this,
            len = self.length;

        if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(self[i], this)) {
                        return true;
                    }
                }
            }));
        }

        for (i = 0; i < len; i++) {
            jQuery.find(selector, self[i], ret); // 这里才是真正进入了Sizzle中
        }

		...
{% endhighlight %}

全局搜索下，可以在**2600多行**看到这么一行代码：

{% highlight javascript %}
jQuery.find = Sizzle;
{% endhighlight %}

至此，**终于进入了大名鼎鼎的 Sizzle 中了**~
