---
layout: post
title: 百度ife-javascript构造函数学习笔记
categories: 
- tech

tags: 
- 笔记
- ife
- task0003

time: 2015-06-25 07:15:00
excerpt: 深入学习javascript的构造函数，同时记录在学习中遇到的问题。

---

### constructor 是什么

当我们创建一个构造函数时，就会创建一个constructor的属性

```javascript
function Foo(){
        this.name = 'wynne';
    }

// 实例化对象
var foo = new Foo();

console.log(Foo.constructor); // Function()
console.log(Foo.prototype.constructor === Foo); // true
console.log(foo.constructor); // Foo()
console.log(foo.constructor === Foo); // true
``` 

由于Foo本身是由Function创建的，所以Foo的constructor就自然而然的指向了Function()，而foo是由Foo()创建的，所以foo的constructor就指向了Foo，即constructor默认指向创建自己的函数。

要注意的是，Foo.prototype.constructor也指向Foo，其实就是一个循环引用,Foo的prototype属性指向Foo的原型，然后Foo的原型的constructor属性指向Foo

即：Foo.prototype -> Foo原型，Foo原型的constructor -> Foo

### constructor在使用中应该注意的

要知道constructor一直都是指向创建当前对象的构造函数的，但是，在以下代码中，constructor被修改了，而可能编码的人根本不知道~

```javascript
function Person(name) {
    this.name = name;
}
console.log(Person.prototype.constructor); //   Person

var p1 = new Person('wynne'); //    Person
console.log(p1.constructor); // Object

// 像这样，其实重新定义了prototype
Person.prototype = {
    sayName : function() {
        console.log(this.name);
    }
};

console.log(Person.prototype.constructor); // Object

var p2 = new Person('wynne');
console.log(p2.constructor); // Object
console.log(p2.constructor === Object);  // true
console.log(Person.prototype.constructor === Object); // true
console.log(p2.constructor.prototype.constructor === Object); // true
``` 

说好的p2是Person创建的，可是此时p2却指向了Object，其实是因为这一行的问题：

```javascript
Person.prototype = {
    ...
};
``` 

这等价于：

```javascript
Person.prototype = new Object({
   ... 
});
``` 

此时，Person.prototype变成了由Object构造的，而Person.prototype.constructor也指向了创建自己的对象，即Object。这时候就肯定不对头了~

修正的方法也很简单，就是让Person.prototype.constructor重新指向Person:

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype = {
    sayName : function() {
        console.log(this.name);
    }
};

Person.prototype.constructor = Person;
var p = new Person('wynne');
console.log(p.constructor === Person);  // true
console.log(Person.prototype.constructor === Person); // true
console.log(p.constructor.prototype.constructor === Person); // true
``` 

这下也就没问题了吧~

---

不仅在创建对象的时候要注意，在做继承(这里的继承方式不是最好的，只是为了示例)的时候也要注意：

```javascript
function Person(name){
    this.name = name;
}

// 这种并不会重写constructor
Person.prototype.sayName = function(){
    console.log(this.name);
}

// 新建一个子类
function Student(job){
    Person.call(this, name);
    this.job = job;
}

// 原型链继承，注意此时prototype也被修改了，
// constructor也难幸免
Student.prototype = Person.prototype;

console.log(Student.prototype.constructor === Student); // false
console.log(Student.prototype.constructor === Person); // true

// 赶快修正回来！
Student.prototype.constructor = Student;

console.log(Student.prototype.constructor === Student); // true
console.log(Student.prototype.constructor === Person); // false

var s = new Student('wynne', 'student'); 
s.sayName(); // wynne
``` 

总结：在进行面向对象编程时，要及时修正constructor的指向，防止混乱
