---
layout: post
title: 百度ife-javascript面向对象学习笔记
categories: 
- tech

tags: 
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

```javascript
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
``` 

但是原型模式也存在着一些问题：

```javascript
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
``` 

这段代码是没有什么问题的，p1和p2已经分离开了，而且也共享着属性和方法，但是，如果Person的属性为对象或者数组呢？

```javascript
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
``` 

咦，p2.hobby并没有'girl'这个爱好啊，可是p1的爱好居然影响了它，这就是原型模式的问题了，原因很简单，p1和p2的`__proto__`都指向了Person的原型，导致在实例上的修改都改变Person的原型的方法

```javascript
console.log(p1.__proto__ === Person.prototype); // true
console.log(p2.__proto__ === Person.prototype); // true
``` 

还有另一个问题，类的构造函数不是可以传递参数吗，定义在prototype上还怎么传参数呢？

---

### 组合使用构造函数和原型 （推荐）

为了解决上面的问题，将构造函数模式和原型模式做个组合就解决了问题：

```javascript
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
``` 

构造函数模式用来定义实例属性，原型模式用来定义定义共享的属性和方法，这下解决了这个问题！

这是使用最为广泛的创建自定义类型的方法！

---

### 动态原型模式

组合使用构造函数和原型，使得与其他语言存在不同的地方，构造函数和原型独立了。如果是java代码，它定义是这样的：

```java
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
``` 

可以看到构造函数和方法都是在Person类中定义的，而javascript的构造函数和原型则分离开了，而动态原型模式就是解决这一问题的：

```javascript
function Person(name, age){
    this.name = name;
    this.age = age;

    if(typeof this.sayName != 'function'){
        Person.prototype.sayName = function(){
            alert(this.name);
        };
    }
}
``` 

通过检测sayName函数是否存在，在去定义原型上的函数，使得函数得一统一

--- 

### 寄生构造函数模式

在前面几种模式都不适合时，寄生构造函数是一个不错的选择

基本思想：创建一个函数Fn，Fn的作用仅仅是封装创建对象的代码，然后再返回新创建的对象

```javascript
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
``` 

`return o`其实重写了使用`new`操作符隐式返回的`this`，因此重写了调用构造函数时返回的值

一个很好的例子，拓展一个Array的自定义方法，产生一个特殊Array，而不会修改到原生Array

```javascript
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
``` 

可是存在着构造函数的问题：无法识别对象类型

```javascript
console.log(arr instanceof Array); // true
console.log(arr.constructor); // Array
``` 

试图手动修改constructor的值也是徒劳的...

```javascript
SpecialArray.prototype.constructor = SpecialArray;
var arr = new SpecialArray('first', 'second', 'third');
console.log(arr instanceof Array); // true
console.log(arr.constructor); // Array
``` 

---

## 继承

### 深度复制实现继承（extend）

其实就是把父对象的所有属性，全部都拷贝给子对象，然后再在子对象上做拓展，实现继承（不能叫继承吧，我觉得叫对象的拓展比较适合）

先明白什么是浅复制：

```javascript
function extend(p) {
    var o = {};
    for(var i in p) {
        o[i] = p[i];
    }
    return o;
}
``` 

这样虽然实现了简单的拷贝，但是，这样的拷贝只对基本类型有用，如果`p`中存在一个属性是数组或者对象，它可能是这样的：

```javascript
p.obj = {
    name : {
        firstName : 'Zheng',
        secondName : 'wynne'
    }
}
``` 

此时`o`只是引用了`p.obj`的地址，而没有复制到里面的`firstName`的什么鬼……，所以此时要使用的就是深复制啦，而深复制也就是把数组与对象做一个递归复制而已~

如下：

```javascript
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
``` 

而jquery中用的就是这种方法来实现继承的。

--- 

### 构造函数和原型链继承

通过构造函数和原型链可以实现继承，其实javascript本身就是使用这种方式来实现继承的，如Array继承于Object

#### 原型链继承

通过让子类的原型指向父类的创建的实例，实现子类共享父类的属性和方法

```javascript
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
};

function SubType() {
    this.subProperty = false;
}

// 子类的原型指向父类原型的引用，实现原型方法的共享
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function() {
    return this.subProperty;
};

var instance = new SubType();
console.log(instance.getSuperValue()); // true
``` 

这样就实现了简单的继承了，但是这样的继承却存在着很大的问题：

* 生成的子类实例的constructor属性指向了父类（因为子类的原型指向了父类的原型，所以子类的原型上的constructor属性就指向了父类的构造函数）
* 每次继承时，都调用了父类（别忘了父类本质也是函数）
* 创建子类的实例时，不能向超类型的构造函数传递参数
* 如果属性中包含一个引用类型，那么子类实例对数组的操作会影响到另一个子类实例，看下面例子：

```javascript
function SuperType() {
    this.colors = ['red', 'blue', 'green'];
}

function SubType() {}

// 子类的原型指向父类原型的引用，实现原型方法的共享
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push('black');

var instance2 = new SubType();
// 另一个子类被影响到了
console.log(instance2.colors); // ['red', 'blue', 'green', 'black']
``` 

为什么会影响到父类呢？因为子类的原型指向了父类的原型的引用，因此子类原型实际上是父类的实例，引用类型实际上只是把地址给了实例，实例之间就会共享所有的引用类型

#### 借用构造函数

```javascript
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

function SubType() {
    // 在子类中调用父类的方法，当做是执行函数更好理解
    SuperType.call(this, 'name');
    this.age = 29;
}

var sub1 = new SubType();
sub1.colors.push('black');
console.log(sub1.colors); // ['red', 'blue', 'green', 'black']

var sub2 = new SubType();
console.log(sub2.colors); // ['red', 'blue', 'green']
``` 

借用构造函数虽然解决了原型链继承的实例共享和参数传递的问题，但是却出现了新的问题：

* 由于只能在构造函数上定义，函数复用失效了
* 在超类型原型中定义的方法，子类也不能拥有（没有继承原型链）

#### 组合继承

那么把原型继承和借用构造函数组合一下各取所长，就有了新的继承方式啦：

```javascript
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    alert(this.name);
};

function SubType(name, age){  
    SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors);  //"red,blue,green,black"
instance1.sayName();      //"Nicholas";
instance1.sayAge();       //29

   
var instance2 = new SubType("Greg", 27);
alert(instance2.colors);  //"red,blue,green"
instance2.sayName();      //"Greg";
instance2.sayAge();       //27
``` 

可是又特么有问题啦！

```javascript
console.log(instance1.constructor); // SuperType
``` 

`instance1`的`constructor`属性应该是指向创建它的构造函数的，但这里却指向了`SuperType`

#### 原型式继承

道格拉斯.克罗克福德实现的继承方法，不适用构造函数，而是借助原型可以基于已有的对象创建对象，同时还不必因此创建自定义类型。

```javascript
function object(o) {
    function F(){}; // 创建临时构造函数
    F.prototype = o; // 将传入的对象作为临时函数的原型
    return new F(); // 返回临时函数的实例
}
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
``` 

本质上是执行了一次浅复制，因此`anotherPerson`和`yetAnotherPerson`都共享了`person`的方法（其实我不知道这种继承的意义是啥……）

ECMAScript中实现了该方法Object.create()，<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create" rel="no-follow">Object.create()</a> ，这与原型式继承是一样的

#### 寄生式继承

与原型式继承类似，增强对象，返回新的对象：

```javascript
function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function(){
        console.log('hi');
    };
    return clone;
}
var person = {
    name : 'wynne',
    friend : ['king', 'steve'];
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // hi
``` 

与构造函数模式相似，使用寄生式继承不能做到函数复用

#### 寄生式组合继承（大BOSS，前面的都是铺垫）

* 组合继承存在构造函数被多次调用的问题
* 子类的constructor被修改

寄生式组合继承就解决了这两个问题，并结合其他继承的特性：

```javascript
function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

// 用中间对象来过渡，避免调用父类的构造函数，浪费资源
// 接收子类和父类的构造函数
function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype); // 得到父类对象，存入副本
    prototype.constructor = subType; // 修正constructor指向
    subType.prototype = prototype; // 子类继承父类
}

function SuperType(name) {
    this.name = name;
    this.color = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayName = function() {
    console.log(this.age);
}
``` 

一切问题都解决了，这就是最理想的继承了，当然，为了避免把变量暴露在全局环境下，最好对寄生式组合继承做一个封装！



