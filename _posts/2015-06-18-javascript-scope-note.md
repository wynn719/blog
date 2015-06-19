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
> 
> 学习资料参考自：
> 
> <a href="http://www.laruence.com/2009/05/28/863.html?cp=all#comments" rel="no-follow">28 May 09 Javascript作用域原理</a>
> 
> <a href="http://www.cnblogs.com/lhb25/archive/2011/09/06/javascript-scope-chain.html" rel="no-follow">JavaScript 开发进阶：理解 JavaScript 作用域和作用域链</a>

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

结果为：

{% highlight javascript %}
I am laruence
{% endhighlight %} 

在刚进入app函数体时, app的活动对象有一个arguments属性, 俩个值为undefined的属性: name和func. 和一个值为'eve'的属性para;

此时的scope chain如下:

{% highlight javascript %}
[[scope chain]] = [
{
     para : 'eve',
     name : undefined,
     func : undefined,
     arguments : []
}, {
     window call object
}
]
{% endhighlight %}  

当调用进入factory的函数体的时候, 此时的factory的scope chain为:

{% highlight javascript %}
[[scope chain]] = [
{
     name : undefined,
     intor : undefined
}, {
     window call object
}
]
{% endhighlight %}  

注意到, 此时的作用域链中, 并不包含app的活动对象.

在定义intro函数的时候, intro函数的[[scope]]为:

{% highlight javascript %}
[[scope chain]] = [
{
     name : 'laruence',
     intor : undefined
}, {
     window call object
}
]
{% endhighlight %} 

从factory函数返回以后,在app体内调用intro的时候, 发生了标识符解析, 而此时的scope chain是:

{% highlight javascript %}
[[scope chain]] = [
{
     intro call object
}, {
     name : 'laruence',
     intor : undefined
}, {
     window call object
}
]
{% endhighlight %}

因为scope chain中,并不包含factory活动对象. 所以, name标识符解析的结果应该是factory活动对象中的name属性, 也就是'laruence'.

---

## Javascript的预编译

例子：

{% highlight javascript %}
alert(typeof eve); //function
function eve() {
  alert('I am Laruence');
};
{% endhighlight %} 

由于在js中存在着预编译的过程（JS在执行每一段JS代码之前，都会首先处理var关键字和function关键字）。

所以结果会是`function`

在调用函数执行之前，会首先创建一个活动对象，然后搜寻这个函数中的局部变量定义,和函数定义，将变量名和函数名都做为这个活动对象的同名属性，对于局部变量定义，**变量的值会在真正执行的时候才计算**，此时只是简单的赋为undefined.

而对于函数的定义,是一个要注意的地方:

函数表达式（var声明的function在预编译中跟变量做一样的处理），如下例子，对于函数定义式，会将函数定义提前而函数表达式，会在执行过程中才计算.

{% highlight javascript %}
alert(typeof eve); //结果:function
alert(typeof walle); //结果:undefined
function eve() { //函数定义式
  alert('I am Laruence');
};
var walle = function() { //函数表达式
};
alert(typeof walle); //结果:function
{% endhighlight %} 

而对于**反编译模式**创建的变量，如：

{% highlight javascript %}
var name = 'laruence';
age = 26;
{% endhighlight %} 

变量`age`会被定义在顶级作用域中。

当然，JS是对每一段的JS代码进行预编译的

{% highlight html %}
<script>
    alert(typeof eve); //结果:undefined
</script>
<script>
    function eve() {
        alert('I am Laruence');
    }
</script>
{% endhighlight %} 

---

## 作用域在实际运用中要注意的：

在调用DOM节点时，把要使用的全局变量先存储在引用变量中，减少往scope chain最低层window全局变量查找，提高程序的效率（当然，在小型的项目中体现不出来，但是当项目越大时，过多的全局变量的查找无疑会加大程勋运行的开销）。

减少查找的例子如下：

{% highlight javascript %}
function showTips(){
    document.getElementById('btn').onclick = function(){
        document.getElementById('tip').style.display = 'block';
    }
}
{% endhighlight %} 

将两次全局查找，优化成：

{% highlight javascript %}
function showTips(){
    var doc = document;
    doc.getElementById('btn').onclick = function(){
        doc.getElementById('tip').style.display = 'block';
    }
}
{% endhighlight %} 

在jquery的源码中，开头就把会频繁使用的变量存储起来了：

{% highlight javascript %}
(function( window, undefined ) {
  var
    // A central reference to the root jQuery(document)
    rootjQuery,

    // The deferred used on DOM ready
    readyList,

    // Support: IE9
    // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
    core_strundefined = typeof undefined,

    // Use the correct document accordingly with window argument (sandbox)
    // 看这里！我们都被存起来了~
    location = window.location,
    document = window.document,
    docElem = document.documentElement,
    ......
{% endhighlight %} 

---

## 延长作用域链

有两种情况会发生作用域延长的情况

* with语句
* try-catch语句的catch块

注：虽然with语句确实可以延长作用域链，但是在很多书中都明确警告了使用with会带来一些难以预料的问题（至于是什么问题就不细究了，反正就是不要使用with...）。

所以，还是不学习with了...

关于try-catch语句的catch块：

当try代码块中发生错误时，执行过程会跳转到catch语句，然后把异常对象推入一个可变对象并置于作用域的头部。在catch代码块内部，函数的所有局部变量将会被放在第二个作用域链对象中。

{% highlight javascript %}
try{
    doSomething();
}catch(ex){
    alert(ex.message); //作用域链在此处改变
}
{% endhighlight %} 

一旦catch语句执行完毕，作用域链机会返回到之前的状态。try-catch语句在代码调试和异常处理中非常有用，因此不建议完全避免。你可以通过优化代码来减少catch语句对性能的影响。**一个很好的模式是将错误委托给一个函数处理，**例如：

{% highlight javascript %}
try{
    doSomething();
}catch(ex){
    handleError(ex); //委托给处理器方法
}
{% endhighlight %} 

优化后的代码，handleError方法是catch子句中唯一执行的代码。该函数接收异常对象作为参数，这样你可以更加灵活和统一的处理错误。**由于只执行一条语句，且没有局部变量的访问，作用域链的临时改变就不会影响代码性能了。**