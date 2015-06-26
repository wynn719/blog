---
layout: post
title: 百度ife-javascript面向对象学习笔记
categories: 
- tech

tags: 3
- 笔记
- ife
- task0003

time: 2015-06-25 07:15:00
excerpt: 深入学习javascript的面向对象编程，同时记录在学习中遇到的问题。

---

javascript不具有其他语言的类，继承等的特性，因此javascript的面向对象编程更多的是基于构造函数和原型的方式实现类的功能；基于原型链来实现类的继承；基于闭包的原理来实现私有化；

当然也有非原型链的继承，如jquery中使用的对象拓展(extend)，通过对对象的 **深度**复制来实现。

## javascript面向对象编程

javascript本身不具有类的特征，那如何模拟类的特征呢？

### 一些好的尝试，但不够完美

在此之前，有工厂模式，有构造函数模式，但都存在着一些大的问题：

* 工厂模式的问题：无法识别对象是由谁创建的
* 构造函数的问题：在创建每个实例时，构造函数给每个实例的新建了方法，即使该方法本身是一模一样的，而面向对象的思想并不希望方法是一样的但是却要重复的创建，这本身浪费内存空间

### 原型模式

为了解决工厂模式和构造函数模式的问题，于是有了原型模式

把共享的变量和方法都放到原型上，然后让子类的原型与父类的原型建立关系，就实现了原型式继承

代码如下：

{% highlight javascript %}
function Person(){}

// 定义要共享的方法
Person.prototype.name = 'wynne';
Person.prototype.sayName = function(){
    console.log(this.name);
}

// 或者另一种写法
Person.prototype = {
    constructor: Person, // 不要忘记修正constructor指向
    name : 'wynne',
    sayName = function() {
        console.log(this.name);
    }
}
{% endhighlight %} 

但是原型模式也存在着一些问题：

{% highlight javascript %}
function Person(){}

// 定义要共享的方法
Person.prototype.name = 'wynne';
Person.prototype.sayName = function(){
    console.log(this.name);
}

// 或者另一种写法
Person.prototype = {
    constructor: Person, // 不要忘记修正constructor指向
    name : 'wynne',
    sayName : function() {
        console.log(this.name);
    }
}

var p1 = new Person();
var p2 = new Person();

p1.sayName(); // 'wynne'
p2.sayName(); // 'wynne'
console.log(p1.sayName === p2.sayName); // true
p1.job = 'student';
console.log(p1.job); // student
console.log(p2.job); // undefined
{% endhighlight %} 

这段代码是没有什么问题的，p1和p2已经分离开了，而且也共享着属性和方法，但是，如果Person的属性为对象或者数组呢？

{% highlight javascript %}
function Person(){}

// 定义要共享的方法
Person.prototype.name = 'wynne';
Person.prototype.hobby = ['basketball', 'running', 'code'];
Person.prototype.sayName = function(){
    console.log(this.name);
}

var p1 = new Person();
var p2 = new Person();

console.log(p2.hobby); // ['basketball', 'running', 'code']
p1.hobby.push('girl');
console.log(p1.hobby); // ["basketball", "running", "code", "girl"]
console.log(p2.hobby); // ["basketball", "running", "code", "girl"]
{% endhighlight %} 

咦，p2.hobby并没有'girl'这个爱好啊，可是p1的爱好居然影响了它，这就是原型模式的问题了，原因很简单，p1和p2的`__proto__`都指向了Person的原型，导致在实例上的修改都改变Person的原型的方法

{% highlight javascript %}
console.log(p1.__proto__ === Person.prototype); // true
console.log(p2.__proto__ === Person.prototype); // true
{% endhighlight %} 

还有另一个问题，类的构造函数不是可以传递参数吗，定义在prototype上还怎么传参数呢？

---

### 组合使用构造函数和原型 （推荐）

为了解决上面的问题，将构造函数模式和原型模式做个组合就解决了问题：

{% highlight javascript %}
function Person(name) {
    this.name = name;
    this.hobby = ['basketball', 'running', 'code'];
}

Person.prototype = {
    constructor : Person,
    sayName : function() {
        console.log(this.name);
    }
}

var p1 = new Person('wynne');
var p2 = new Person('king');

console.log(p1.hobby === p2.hobby); // false
{% endhighlight %} 

构造函数模式用来定义实例属性，原型模式用来定义定义共享的属性和方法，这下解决了这个问题！

这是使用最为广泛的创建自定义类型的方法！

---

### 动态原型模式

组合使用构造函数和原型，使得与其他语言存在不同的地方，构造函数和原型独立了。如果是java代码，它定义是这样的：

{% highlight java %}
class Person{
    private String name;
    private int age;
    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }

    public String getName(){
        return this.name;
    }

    public void setAge(age){
        this.age = age;
    }
}
{% endhighlight %} 

可以看到构造函数和方法都是在Person类中定义的，而javascript的构造函数和原型则分离开了，而动态原型模式就是解决这一问题的：

{% highlight javascript %}
function Person(name, age){
    this.name = name;
    this.age = age;

    if(typeof this.sayName != 'function'){
        Person.prototype.sayName = function(){
            alert(this.name);
        };
    }
}
{% endhighlight %} 

通过检测sayName函数是否存在，在去定义原型上的函数，使得函数得一统一

--- 

### 寄生构造函数模式

在前面几种模式都不适合时，寄生构造函数是一个不错的选择

基本思想：创建一个函数Fn，Fn的作用仅仅是封装创建对象的代码，然后再返回新创建的对象

{% highlight javascript %}
function Person(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}

var p = new Person('wynne',22,'student');
p.sayName(); // 'wynne'
{% endhighlight %} 

`return o`其实重写了使用`new`操作符隐式返回的`this`，因此重写了调用构造函数时返回的值

一个很好的例子，拓展一个Array的自定义方法，产生一个特殊Array，而不会修改到原生Array

{% highlight javascript %}
function SpecialArray() {
    var arr = new Array();
    arr.push.apply(arr, arguments);
    arr.toInterestString = function(){
        return this.join('^_^');
    };
    return arr;
}
var arr = new SpecialArray('first', 'second', 'third');
console.log(arr.toInterestString()); // first^_^second^_^third
{% endhighlight %} 

可是存在着构造函数的问题：无法识别对象类型

{% highlight javascript %}
console.log(arr instanceof Array); // true
console.log(arr.constructor); // Array
{% endhighlight %} 

试图手动修改constructor的值也是徒劳的...

{% highlight javascript %}
SpecialArray.prototype.constructor = SpecialArray;
var arr = new SpecialArray('first', 'second', 'third');
console.log(arr instanceof Array); // true
console.log(arr.constructor); // Array
{% endhighlight %} 

---

## 继承

### 深度复制实现继承（extend）

其实就是把父对象的所有属性，全部都拷贝给子对象，然后再在子对象上做拓展，实现继承（不能叫继承吧，我觉得叫对象的拓展比较适合）

先明白什么是浅复制：

{% highlight javascript %}
function extend(p) {
    var o = {};
    for(var i in p) {
        o[i] = p[i];
    }
    return o;
}
{% endhighlight %} 

这样虽然实现了简单的拷贝，但是，这样的拷贝只对基本类型有用，如果`p`中存在一个属性是数组或者对象，它可能是这样的：

{% highlight javascript %}
p.obj = {
    name : {
        firstName : 'Zheng',
        secondName : 'wynne'
    }
}
{% endhighlight %} 

此时`o`只是引用了`p.obj`的地址，而没有复制到里面的`firstName`的什么鬼……，所以此时要使用的就是深复制啦，而深复制也就是把数组与对象做一个递归复制而已~

如下：

{% highlight javascript %}
function deepExtend(p, o) {
    var o = o || {};
    for (var i in p) {
        if (type p[i] === 'object') {
            o[i] = (p[i].constructor === Array) ? [] : {};
            deepExtend(p[i], o[i]);
        }else {
            o[i] = p[i];
        }
    }
    return o;
}
{% endhighlight %} 

而jquery中用的就是这种方法来实现继承的。

--- 

### 
