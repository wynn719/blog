---
layout: post
title: 百度ife-javascript闭包学习笔记
categories: 
- tech

tags: 
- 笔记
- ife
- task0003

time: 2015-06-23 22:15:00
excerpt: 深入学习javascript的闭包原理，同时记录在学习中遇到的问题。

---

> 学习任务来自：<a href="https://github.com/baidu-ife/ife" rel="no-follow">百度ife前端技术学院</a>
> 
> 学习资料参考自：
> 
> <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures" rel="no-follow">闭包</a>
> 
> <a href="http://www.cnblogs.com/wangfupeng1988/p/3977924.html" rel="no-follow">深入理解javascript原型和闭包</a>

在经过前面作用域和原型、原型链的学习，感觉遇到闭包也不怕啦... 准备被虐杀！

先补全一些作用域上的知识：

### 自由变量

在A作用域中使用的变量x，却没有在A作用域中声明（即在其他作用域中声明的），对于A作用域来说，x就是一个自由变量。

例如：

{% highlight javascript %}
var x = 10; 

function fn(){
    var b = 20;

    // x不在fn的作用域中声明，但却调用了
    // 因此x叫做自由变量
    console.log(b + x); 
}
{% endhighlight %} 

一个经常容易犯错的例子：

{% highlight javascript %}
var x = 10;

function fn() {
    console.log(x);
}

function show(f) {
    var x = 20;
    fn();
}

show(); // 10
{% endhighlight %} 

这个例子中，输出的不是20，而是10，因为在函数定义的时候就已经决定了函数的上下文执行环境，故，fn的作用域链上，只能找到window执行环境下的变量x

---

另一个例子：

{% highlight javascript %}
var x = 10;
function fn(){
    console.log(x);
}

function show(f){
    var x = 20;
    (function(){
        f(); 
    })()
}

show(fn); // 10
{% endhighlight %} 

很抱歉，还是10，原理同上~

## 闭包

闭包就是能够读取其他函数内部变量的函数。可以简单的理解成“定义在一个函数内部的函数”，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

### 闭包应用的两种情况

#### 函数作为返回值

{% highlight javascript %}
function fn(){
    var max = 10;

    return function bar(x) {
        if (x > max) {
            console.log(x);
        }
    };
}

var f1 = fn();
f1(15);
{% endhighlight %} 

bar函数作为返回值，赋值给f1变量，执行f1(15)时，用到了fn作用域下的max变量的值（此时fn在执行后作用域应该是销毁了，但是由于闭包的作用，变量max依旧存在）

---

注意：内部函数定义在引用的变量之前，内部函数依旧可以访问闭包中的变量

{% highlight javascript %}
function sayAlice() {
    var sayAlert = function() { alert(alice); }
    // Local variable that ends up within closure
    var alice = 'Hello Alice';
    return sayAlert;
}
var helloAlice=sayAlice();
helloAlice(); // Hello Alice
{% endhighlight %} 

#### 函数作为参数被传递

{% highlight javascript %}
var max = 10,
    fn = function(x) {
        if (x > max) {
            console.log(x);
        }
    };

// 模拟块级域
// f(15)成功访问到了max = 10
(function(f)) {
    var max = 100;
    f(15);
})(fn);
{% endhighlight %} 

fn函数作为一个参数被传递到另一个函数，赋值给f参数，执行f(15)，f的作用域中，max = 10，而不是100；

#### 闭包原理

创建函数A本身也就创建了一个新的，独立的作用域A-context，而由于执行A函数时，由于正好要引用到A函数上下文环境中存在的一个变量（或者几个变量）(该变量恰好存在于包裹该A函数的B函数的作用域中)，因此在销毁B函数后，因为该独立的A函数被返回的同时需要B函数的变量，所以该变量不会销毁，而接收该返回的A函数就是闭包

#### 闭包的问题

* 因为存在于闭包中的变量不会销毁，一直保存在内存中，因此在运行程序时就 **增加了内容开销**，在IE中可能导致内存泄露。

解决方法是：在退出函数之前，将不使用的局部变量全部删除（尽管javascript中有垃圾回收机制）

* 在用闭包模拟javascript中所不含有的私有变量和共有变量时，把闭包当做公有方法要切记不要用闭包修改了私有变量

* 在循环中引用闭包也容易出现问题

错误的代码：

{% highlight javascript %}
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp();
{% endhighlight %} 

我们希望的理想结果是指定哪个显示哪个，可是事实不是这样的，该问题的原因在于赋给 onfocus 是闭包（showHelp）中的匿名函数而不是闭包对象；在闭包（showHelp）中一共创建了三个匿名函数，但是它们都共享同一个环境（item）。在 onfocus 的回调被执行时，循环早已经完成，且此时 item 变量（由所有三个闭包所共享）已经指向了 helpText 列表中的最后一项。

---

正确的做法是使onfocus指向一个新的闭包对象：

{% highlight javascript %}
Your age (you must be over 16)
{% endhighlight %} 


{% highlight javascript %}
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function makeHelpCallback(help) {
  return function() {
    showHelp(help);
  };
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = makeHelpCallback(item.help);
  }
}

setupHelp();
{% endhighlight %} 

### 设计模式中的单例模式

单例模式singleton就是闭包的典型应用

{% highlight javascript %}
var singleton = function () {
    var privateVariable;
    function privateFunction(x) {
        ...privateVariable...
    }
  
    return {
        firstMethod: function (a, b) {
            ...privateVariable...
        },
        secondMethod: function (c) {
            ...privateFunction()...
        }
    };
}();
{% endhighlight %} 

此时， privateVariable和privateVariable都是私有变量，通过闭包完成了私有的成员和方法的封装。只返回了两个接口~
