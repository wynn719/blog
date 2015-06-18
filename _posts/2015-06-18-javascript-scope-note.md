---
layout: post
title: 百度ife-javascript作用域学习笔记
categories: 
- tech

tags: 
- 笔记
- ife
- task0003

time: 2015-06-18 21:45:56
excerpt: 深入学习javascript作用域原理，同时记录在学习中遇到的问题。

---

> 学习任务来自：<a href="https://github.com/baidu-ife/ife" rel="no-follow">百度ife前端技术学院</a>

## javascript的作用域链

> javascript中的函数运行在她们被定义的作用域里，而不是它们被执行的作用域里
> -- 《javascript权威指南》

注意：在JS中，作用域的概念和其他语言差不多， 在每次调用一个函数的时候 ，就会进入一个函数内的作用域，当从函数返回以后，就**返回调用前的作用域**.

javascript中作用域的实现方式与C/C++不同，不是使用“堆栈”的方式，而是使用**列表**，实现过程如下（ECMA262）：

> javascript高级程序设计3中，指出函数的执行环境是保存在环境栈中的，执行完函数后，会把函数环境弹出栈
> 
> ……为何不一样的说法啊（高程中没有探讨到[[scope]]上）

作用域链（scope chain）：保证对执行环境有权访问的所有变量和函数的有序访问。

* 任何执行上下文时刻（context）的作用域，都是由作用域链（scope chain）来实现的。
* 在一个函数被定义的时候，会将它定义时刻的scope chain链接到这个函数对象的[[scope]]属性。
* 在一个函数对象被调用的时候，会创建一个活动对象（object），然后对每一个函数的形参（arguments），都命名为该活动对象的命名属性，然后将这个活动对象做为此时的作用域链（scope chain）最前端，并将这个函数对象的[[scope]]加入到scope chain中。

---

解析这个例子：

{% highlight javascript %}
var func = function(lps, rps){
  var name = 'laruence';
  ........
}
func();
{% endhighlight %} 

它的解析过程是这样的：

* 定义name

* 定义func时：
* * func的[[scope]]创建，[[scope]]指向window对象
* * [[scope]]链接到scope chain上

* 执行func时：
* * 创建活动对象funcObj（预编译时创建，假设是这个名字）
* * 创建arguments对象，添加lps和rps属性
* * 定义局部变量name='laruence'
* * 定义其他...
* * 运行函数，发生标识符解析时，逆向（从作用域链最前端）开始查找funcObj的每一个属性，找到返回，找不到，返回undefined

---

下一个例子：

{% highlight javascript %}
var name = 'laruence';
function echo() {
  alert(name);
}
 
function env() {
  var name = 'eve';
  echo();
}
 
env();
{% endhighlight %} 

运行结果：

{% highlight javascript %}
laruence
{% endhighlight %} 

解析过程是这样的：

* 定义name

* 定义echo时：
* * echo的[[scope]]创建，[[scope]]指向window对象
* * [[scope]]链接到scope chain上

* 定义env时：
* * env的[[scope]]创建，[[scope]]指向window对象
* * [[scope]]链接到scope chain上，在echo的[[scope]]后面

* 执行env时：
* * 创建活动对象envObj（预编译时创建，假设是这个名字）
* * 创建arguments对象
* * 定义局部变量name='eve'
* * 执行echo函数，从echo的[[scope]]开始逆向查找作用域链，找到定义在window上的name，返回`laruence`，结束查找
* * 结束！

作用域链如该图：

<img src="{{ site.url }}/imgs/posts/2015-06-18-javascript-scope-note01.png" alt="作用域链图像">

---

第三个例子：

{% highlight javascript %}
function factory() {
  var name = 'laruence';
  var intro = function(){
      alert('I am ' + name);
  }
  return intro;
}
 
function app(para){
  var name = para;
  var func = factory();
  func();
}
 
app('eve');
{% endhighlight %} 

