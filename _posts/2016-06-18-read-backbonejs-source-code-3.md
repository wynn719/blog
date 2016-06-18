---
title: 阅读backbone源码——订阅-发布模式（pub/sub）
layout: post
time: 2016-06-18 13:55:00 
tag:
- Backbone.js
- 源码学习

categories:
- tech

excerpt: ""
---

## 订阅-发布模式

Backbone.js最吸引人的基本上就是事件对订阅-发布模式（pub/sub）的使用了，一个典型的Backbone例子如下：

{% highlight javascript %}
// 新建一个model
var Person = Backbone.Model.extend({
    ...
});
var person = new Person({});
// 绑定人名变更事件（订阅）
person.on('callme', function () {
    alert('wayne');
});
// 修改人名，触发事件（发布）
person.trigger('callme'); // 此时会弹出'wayne'的信息
// 解除事件绑定（取消订阅）
person.off('callme');
person.trigger('callme'); // 什么都不执行
{% endhighlight %}

有了这个模式，我们就可以做到一些比较节省工作的事情，一个典型的应用场景——在线笔记：

1. 用户在笔记的其中一个分类 backbone学习 点击添加一个新的笔记并保存
2. 保存成功，笔记总数+1

使用jQuery的大致实现过程如下：

{% highlight javascript %}
$('#save-btn').click(function() {
    // 保存笔记
    $.ajax(function() {
        success: function() {
            changeCount();
        }
    }); 
};);
{% endhighlight %}

看着似乎没什么问题，但是**如果需求改变了**，比如变成这样：

1. 用户在笔记的其中一个分类 backbone学习 点击添加一个新的笔记并保存
2. 保存成功后，笔记总数+1、笔记编写界面刷新、本地笔记缓存同步、服务器缓存同步、自动分享到团队笔记中。。。

这个时候代码会变成这样：

{% highlight javascript %}
$('#save-btn').click(function() {
    // 保存笔记
    $.ajax(function() {
        success: function() {
            dataView.changeCount();
            noteView.refresh();
            local.syncNote();
            server.syncNote();
            share.toMyTeam();
            ...
        }
    }); 
};);
{% endhighlight %}

此时，各模块的代码严重耦合在了一起，写这段代码的人同时需要了解其他模块有什么函数，其他模块的编写者也不能随意更改自己的模块接口。

而使用Backbone.js编写可以避免这个问题，大致实现过程如下：

各模块订阅noteModel的save-note事件，并写好callback

{% highlight javascript %}
dataView.listenTo(noteModel, 'save-note', dataView.changeCount);
noteView.listenTo(noteModel, 'save-note', noteView.refresh);
local.listenTo(noteModel, 'save-note', local.syncNote);
server.listenTo(noteModel, 'save-note', server.syncNote);
share.listenTo(noteModel, 'save-note', share.toMyTeam);
{% endhighlight %}

在Note View中点击保存时，noteModel发布save-note事件

{% highlight javascript %}
$('#save-btn').click(function() 
    // 保存笔记
    $.ajax(function() {
        success: function() {
            noteModel.trigger('save-note');
        }
    })
})
{% endhighlight %}

如上所示，编写保存模块的人不需要再去了解其他模块的内容，只需要在保存成功后发布通知，其他模块的人也不需要担心模块变更影响到别人的问题，只需要专注于自己的模块编写。这样减少了代码的耦合性。

## Backbone.js中发布-订阅模式的实现

一开始Backbone.js 0.1.0中的发布-订阅模式是很简单的

1. `bind`将所有事件绑定到`this._callbacks`对象中
2. `unbind`通过`for`循环将指定事件删除
3. `trigger`通过`for`循环触发匹配的事件
4. `extend`将Event拓展到其他模块上

代码如下：

{% highlight javascript %}
Backbone.Events = {
    // 绑定事件到ev上，通过callback进行回调
    // ev等于'all'时，所有事件触发都会激活callback回调
    bind: function(ev, callback) {
        // 总回调对象，存储所有回调的事件，格式如下：
        // this._callbacks = {
        //   'ev' : [
        //     function callback1() {},
        //     function callback2() {}
        //     ...
        //   ]
        // }
        var calls = this._callbacks || (this._callbacks = {});

        // 将回调函数加入this._callbacks对应的ev中，此处ev是数组，
        // 因为存在着一个事件绑定多个回调函数的情况
        var list = this._callbacks[ev] || (this._callbacks[ev] = []);
        list.push(callback);

        // 链式调用
        return this;
    },

    // 移除一个或者多个回调函数，如果callback为空，移除该事件的所有callback，
    // 如果事件为空，移除所有事件的绑定
    unbind: function(ev, callback) {
        var calls;
        if (!ev) { // 移除所有绑定
            this._callbacks = {};
        } else if (calls = this._callbacks) {
            if (!callback) {
                calls[ev] = [];
            } else {
                var list = calls[ev];
                // 该事件下回调为空，返回
                if (!list) return this;
                // 移除事件
                for (var i = 0, l = list.length; i < l; i++) {
                    if ( callback=== list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
        // 链式调用
        return this;
    },

    // 触发一个事件，执行所有绑定的回调
    // 除了事件名称，所有回调都要传递同样的参数'trigger'
    trigger: function(ev) {
        var list, calls, i, l;
        var calls = this._callbacks;
        // callback队列为空，走你
        if (!(calls = this._callbacks)) return this;
        if (list = calls[ev]) {
            for (i = 0, l = list.length; i < l; i++) {
                // 传递参数到回调函数并触发事件
                list[i].apply(this, _.rest(arguments));
            }
        }
        if (list = calls['all']) {
            for (i = 0, l = list.length; i < l; i++) {
                list[i].apply(this, arguments);
            }
        }
        return this;
    }
};

_.extend(Backbone.Model.prototype, Backbone.Events, {});
{% endhighlight %}

到Backbone.js 0.9.0之前做的都是一些小的语意重构或者bug修正，并没有什么太大的变化，Backbone.js 0.9.0对Event做了优化

1. `bind`改为业界通用的`on`，即语意重构，但是向下兼容
2. 通过队列结构来重构`for`循环事件绑定（个人觉得意义不大，js中数组的处理速度是比直接读对象快的）

代码如下：

{% highlight javascript %}
Backbone.Events = {
    // 语意重构，将bind改为on，unbind改为off
    on: function(events, callback, context) {
        var ev;
        events = events.split(/\s+/);

        // 注意，此处calls指向this._callbacks，即calls改变，this._callbacks也会改变
        var calls = this._callbacks || (this._callbacks = {}); // callback队列
        while (ev = events.shift()) { // 每次取出一个事件
            // tail是一个空的对象，用于充当下一个节点
            // 此处的结构是这样的：
            // this._callbacks = {
            //     event1: {
            //         next: {
            //             callback: function(){},
            //             context: el,
            //             next: {
            //                 callback: function(){},
            //                 context: el,
            //                 next: {
            //                     ...
            //                     tail: （等于next）
            //                 }
            //             }
            //         }, 
            //         tail: {}
            //     },
            //     
            //     event2: {
            //         ...
            //     }
            // }
            var list = calls[ev] || (calls[ev] = {});
            var tail = list.tail || (list.tail = list.next = {});
            tail.callback = callback; // 回调
            tail.context = context; // 执行环境上下文，相当于this变量
            list.tail = tail.next = {};
        }
        return this;
    },

    off: function(events, callback, context) {
        var ev, calls, node;
        if (!events) { // 清空所有事件的所有绑定
            delete this._callbacks;
        } else if (calls = this._callbacks) {
            events = events.split(/\s+/);
            while (ev = events.shift()) {
                // 先清空该事件下的所有绑定：
                node = calls[ev]; // 这里的node等于上面on中的list
                delete calls[ev]; // 清空xx事件下的所有绑定的方法

                // Object.off('add')的情况
                if (!callback || !node) continue;

                // Object.off('add', 'addOne')的情况下，
                // 将context不匹配的重新绑定
                // Create a new list, omitting the indicated event/context pairs.
                while ((node = node.next) && node.next) {
                    // Object.off('add', 'addOne', this.$input)的情况，
                    // context一致则过滤掉
                    if (node.callback === callback &&
                        (!context || node.context === context)) continue;

                    // 将context不匹配的重新绑定
                    this.on(ev, node.callback, node.context);
                }
            }
        }
        return this;
    },

    trigger: function(events) {
        var event, node, calls, tail, args, all, rest;

        // 没有回调则返回当前对象，便于链式调用
        if (!(calls = this._callbacks)) return this;

        all = calls['all'];
        (events = events.split(/\s+/)).push(null); // null是为了制造循环的结束标志

        while (event = events.shift()) {
            // all事件的入栈处理，多加一个event用于区分
            if (all) events.push({
                next: all.next,
                tail: all.tail,
                event: event
            });

            // 其他事件的入栈处理
            if (!(node = calls[event])) continue;
            events.push({
                next: node.next,
                tail: node.tail
            });
        }
        rest = slice.call(arguments, 1); // 取出用户自定义参数，即events后面接的参数
        while (node = events.pop()) {
            tail = node.tail;
            // 如果是all事件，则将event并入rest中
            args = node.event ? [node.event].concat(rest) : rest;
            while ((node = node.next) !== tail) { // tail等于next，则说明该事件的所有回调已经结束
                // 调用事件
                node.callback.apply(node.context || this, args);
            }
        }
        return this;
    }
};
{% endhighlight %}