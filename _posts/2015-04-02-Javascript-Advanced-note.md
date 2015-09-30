---
layout: post
title: JS高级课程-笔记
published: false
categories: 
- tech

tags: 
- 笔记
- JavaScript

time: 2015-04-02 20:28:56
excerpt: 学习妙味课堂js高级课程的一些笔记

---

## 第一课 运动课程

### 匀速运动封装

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>简单的匀速运动函数封装</title>
    <script>
    // 封装获取样式函数
    function css(obj, attr){
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    }

    /*bug: 暂无*/
    function startMove (obj, json, iSpeed, fn) {
        clearInterval(obj.iTimer);

        var iCur = 0;// 未运动前的样式值
        var iAfter = 0;// 运动后的样式值

        obj.iTimer = setInterval(function(){
            var bBtn = true;// 控制运动状态是否完结

            for(var attr in json){
                var iTarget = json[attr];

                if (attr == 'opacity') {
                    // Math.round(x)把一个数字舍入为最接近的整数
                    iCur = Math.round(css(obj, 'opacity') * 100);
                }else{
                    iCur = parseInt(css(obj, attr));
                }

                // 获取正确方向上的速度
                var iSpeedNew = iCur < iTarget ? iSpeed : -iSpeed;

                if (iCur !== iTarget) {
                    bBtn = false;
                    iAfter = iCur + iSpeedNew;
                    if (attr == 'opacity') {
                        obj.style.opacity = (iAfter) / 100;
                        // 兼容ie7及以下
                        obj.style.filter = 'alpha(opacity=' + iAfter + ')';
                    }else{
                        // 防止运动越界的 bug
                        if (iSpeedNew > 0 && iAfter > iTarget || iSpeedNew < 0 && iAfter < iTarget) {
                            iAfter = iTarget;
                        }

                        obj.style[attr] = iAfter + 'px';
                    }
                }
            }

            if (bBtn) {
                clearInterval(obj.iTimer);
                // 如果回调函数存在，调用回调函数
                fn && fn.call(obj);
            }

        }, 15);
    }

    window.onload = function(){
        var oDiv = document.getElementById('div');

        startMove(oDiv, {
            left: 1000
        }, 10);

        /*startMove(oDiv, {
            width: 10,
            left: 1000
        }, 5);*/
    }
    </script>
    <style>
    #div{width: 100px;height: 100px;background-color: red;position: absolute;top: 0;left: 0;}
    </style>
</head>
<body>
    <div id="div"></div>
</body>
</html>
{% endhighlight %}

### 摩擦运动封装

原理：在匀速运动的原理上，使每次运动的速度都减一个定值

bug：因为速度不一定，所以减少时难以控制目标值

{% highlight javascript %}
obj.iTimer = setInterval(function(){
    var bBtn = true;// 控制运动状态是否完结

    iSpeed -= 1;// 难以控制目标点

    for(var attr in json){
        // ... 同匀速运动    
    }

    if (bBtn) {
        // ... 同匀速运动
    }
}, 30);
{% endhighlight %}

### 缓冲运动封装

原理：在匀速运动的原理上，使每次运动的速度为 (iTarget - iCur)/num 的值，即速度逐渐减少，最后归零

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>简单的匀速运动函数封装</title>
    <script>
    // 封装获取样式函数
    function css(obj, attr){
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    }

    /*bug: 暂无*/
    function startMove (obj, json, fn) {
        clearInterval(obj.iTimer);

        var iCur = 0;// 未运动前的样式值
        var iAfter = 0;// 运动后的样式值
        var iSpeed = 0;// 初始化速度

        obj.iTimer = setInterval(function(){
            var bBtn = true;// 控制运动状态是否完结

            for(var attr in json){
                var iTarget = json[attr];

                if (attr == 'opacity') {
                    // Math.round(x)把一个数字舍入为最接近的整数
                    iCur = Math.round(css(obj, 'opacity') * 100);
                }else{
                    iCur = parseInt(css(obj, attr));
                }

                // 计算缓冲后的速度
                iSpeed = (iTarget - iCur) / 8;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                if (iCur !== iTarget) {
                    bBtn = false;
                    iAfter = iCur + iSpeed;
                    if (attr == 'opacity') {
                        obj.style.opacity = (iAfter) / 100;
                        // 兼容ie7及以下
                        obj.style.filter = 'alpha(opacity=' + iAfter + ')';
                    }else{
                        // 防止运动越界的 bug（不再需要）
                        /*if (iSpeed > 0 && iAfter > iTarget || iSpeed < 0 && iAfter < iTarget) {
                            iAfter = iTarget;
                        }*/

                        obj.style[attr] = iAfter + 'px';
                    }
                }
            }

            if (bBtn) {
                clearInterval(obj.iTimer);
                // 如果回调函数存在，调用回调函数
                fn && fn.call(obj);
            }

        }, 15);
    }

    window.onload = function(){
        var oDiv = document.getElementById('div');

        startMove(oDiv, {
            left: 1000,
            top: 500
        }, 10);

        /* 相反无问题
        startMove(oDiv, {
            width: 10,
            left: 1000
        }, 5);*/
    }
    </script>
    <style>
    #div{width: 100px;height: 100px;background-color: red;position: absolute;top: 0;left: 0;}
    </style>
</head>
<body>
    <div id="div"></div>
</body>
</html>
{% endhighlight %}

### 图片预加载原理

* 不直接修改img元素的src，加载完成后，再显示
* 用到的事件
  * onload：加载完成后显示图片
  * onerror：加载失败时，进行其他处理（跳过、显示信息等）
* 预判加载——自动加载下一张图片
* 延迟加载——加载可视区图片，其他图片等进入可视区再加载

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>图片预加载原理</title>
    <style></style>
</head>
<body>
    <img id="img1" src='' />
    <script>
    /*
    属性：
        src：当我们给Image对象的src属性赋值一个url的时候，这个Image对象就会去加载url资源。加载完成以后的资源被保存到了浏览器的缓存文件夹里面。下次如果我们要去调用这个url地址的时候，直接是从缓存文件夹读取到的。所以速度很快。
    事件：
        onload：当资源加载完成的时候触发
        onerror：当资源加载失败的时候触发
    */
    window.onload = function(){
        var oImage = new Image();
        var oImg = document.getElementById('img1');

        oImage.src = '1.png';
        oImage.onload = function(){
            alert('加载完成');

            document.onclick = function(){
                oImg.src = '1.png';
            }
        }
        oImage.onerror = function(){
            alert('加载出错');
        }
    }
    </script>
</body>
</html>
{% endhighlight %}

实例应用：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>图片预加载二</title>
</head>
<body>
    <img src="images/p1.jpg" id="img1" style="width: 300px;" />
    <script>
    window.onload = function(){

        var oImg = document.getElementById('img1');
        var oImage = new Image();
        var arr = [
            'images/p2.jpg',
            'images/3.jpg',
            'images/p4.jpg',
        ];
        var iCur = 0;
        var i = 0;

        xunlei();

        oImg.onclick = function(){
            i++;
            if(i < arr.length){
                oImg.src = arr[i];
            }
        }

        function xunlei(){
            oImage.src = arr[iCur];
            oImage.onload = function(){
                iCur++;
                if(iCur < arr.length){
                    xunlei();
                }
            }
        }

    }
    </script>
</body>
</html>
{% endhighlight %}

图片按需加载：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>图片按需加载</title>
    <style>
    #ul1 { margin: 100px auto 0; padding: 0; }
    li { float: left; margin: 0 0 10px 10px; list-style: none; border: 1px solid black;}
    img { width: 300px; height: 200px; display: block; }
    </style>
</head>
<body>
    <ul id="ul1">
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
        <li><img _src="1.jpg" src="white.jpg"></li>
        <li><img _src="2.jpg" src="white.jpg"></li>
        <li><img _src="3.jpg" src="white.jpg"></li>
        <li><img _src="4.jpg" src="white.jpg"></li>
        <li><img _src="5.jpg" src="white.jpg"></li>
        <li><img _src="6.jpg" src="white.jpg"></li>
        <li><img _src="7.jpg" src="white.jpg"></li>
    </ul>
    <script>
    window.onload = function(){
        var oUl = document.getElementById('ul1');
        var aImg = oUl.getElementsByTagName('img');

        showImg();
        window.onscroll = showImage;

        function showImg(){

            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            for(var i=0; i<aImg.length; i++){

                // 判断图片加载状态和是否位于可视区
                if(!aImg[i].isLoad && getTop(aImg[i]) < scrollTop + document.documentElement.clientHeight ){
                    aImg[i].src = aImg[i].getAttribute('_src');
                    aImg[i].isLoad = true;
                }
            }
        }

        // 获取图片位置
        function getTop(obj){
            var iTop = 0;
            while(obj){
                iTop += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return iTop;
        }
    }
    </script>
</body>
</html>
{% endhighlight %}

### 弹性运动原理

* 在目标点左边，加速；在目标点右边，减速
* 根据距离，计算加速度

#### 普通弹性运动

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>弹性运动</title>
    <style>
    #div1 { width: 100px; height: 100px; background: red; position: absolute; left: 0; }
    #bg { width: 1px; height: 500px; background: black; position: absolute; left: 500px; top: 0; }
    </style>
</head>
<body>
    <input type="button" value="开始运动" id="input1">
    <div id="div1"></div>
    <div id="bg"></div>
    <script>
    window.onload = function(){
        var oInput = document.getElementById('input1');
        var oDiv = document.getElementById('div1');
        var timer = null;
        var iSpeed = 0;

        oInput.onclick = function(){

            startMove();

        }

        function startMove(){

            clearInterval(timer);
            timer = setInterval(function(){

                // 实际走了不止500
                if(oDiv.offsetLeft < 500){
                    iSpeed += 5;
                } else {
                    // 当iSpeed小于0时开始回弹
                    iSpeed -= 5;
                }
                oDiv.style.left = oDiv.offsetLeft + iSpeed + 'px';

            }, 30);

        }
    }
    </script>
</body>
</html>
{% endhighlight %}


#### 弹性运动带摩擦

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>弹性运动</title>
    <style>
    #div1 { width: 100px; height: 100px; background: red; position: absolute; left: 0; }
    #bg { width: 1px; height: 500px; background: black; position: absolute; left: 500px; top: 0; }
    </style>
</head>
<body>
    <input type="button" value="开始运动" id="input1">
    <div id="div1"></div>
    <div id="bg"></div>
    <script>
    // 在目标地会停止
    window.onload = function(){
        var oInput = document.getElementById('input1');
        var oDiv = document.getElementById('div1');
        var timer = null;
        var iSpeed = 0;

        oInput.onclick = function(){

            startMove();

        }

        function startMove(){

            clearInterval(timer);
            timer = setInterval(function(){

                // if(oDiv.offsetLeft < 500){
                //  iSpeed += (500 - oDiv.offsetLeft)/50;
                // } else {
                //  iSpeed -= (oDiv.offsetLeft - 500)/50;
                // }

                iSpeed += (500 - oDiv.offsetLeft)/50;
                iSpeed *= 0.95;

                // Math.abs()返回一个数字的绝对值
                if(Math.abs(iSpeed) <= 1 && Math.abs(500 - oDiv.offsetLeft) <=1 ){
                    clearInterval(timer);

                    // 回归目标地
                    oDiv.style.left = '500px';
                    iSpeed = 0;
                } else {
                    oDiv.style.left = oDiv.offsetLeft + iSpeed + 'px';
                }

            }, 30);

        }
    }
    </script>
</body>
</html>
{% endhighlight %}

### 弹性过界

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>弹性过界</title>
    <style>
    #div1 { width: 100px; height: 30px; background: red; }
    </style>
</head>
<body>
    <div id="div1"></div>
    <script>
    window.onload = function(){

        var oDiv = document.getElementById('div1');
        var timer = null;
        var iSpeed = 0;

        oDiv.onmouseover = function(){
            startMove(300);
        }
        oDiv.onmouseout = function(){
            startMove(30);
        }

        function startMove(iTarget){

            clearInterval(timer);
            timer = setInterval(function(){
                iSpeed += (iTarget - oDiv.offsetHeight) / 6;
                iSpeed *= 0.75;
                
                if(Math.abs(iSpeed) <= 1 && Math.abs(iTarget - oDiv.offsetHeight) <= 1){
                    clearInterval(timer);
                    iSpeed = 0;
                    oDiv.style.height = iTarget + 'px';
                } else {
                    var H = oDiv.offsetHeight + iSpeed; 
                    // 解决IE下的弹性过界的问题
                    // ie8一下，width等值不能为负数
                    if(H < 0) {
                        H = 0;
                    }
                    oDiv.style.height = H + 'px';
                }
            }, 30)

        }

    }
    </script>
</body>
</html>
{% endhighlight %}

#### 完整弹性框架

{% highlight javascript %}
function css(obj, attr){
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
}

function startMove (obj, json, fn) {
    // body...
    clearInterval(obj.iTimer);

    // 循环所有运动参数
    var iSpeed = {};
    for(var attr in json){
        iSpeed[attr] = 0;
    }

    obj.iTimer = setInterval(function(){

        var bBtn = true;// 处理临界状态

        for(var attr in json){
            var iCur = 0;

            if(attr === 'opacity'){
                iCur = Math.round(css(obj, attr) * 100);
            }else{
                iCur = parseInt(css(obj, attr));
            }

            iSpeed[attr] += (json[attr] - iCur)/6;
            iSpeed[attr] *= 0.75;

            if (Math.abs(iSpeed[attr]) > 1 && Math.abs(500 - iCur) > 1) {
                bBtn = false;
            }

            var value = iCur + iSpeed[attr];

            // 处理ie宽度和高度越界
            if(value < 0 && (attr === 'width' || attr === 'height')){
                value = 0;
            }

            if(attr == 'opacity'){
                    obj.style.filter = 'alpha(opacity='+ value +')';
                    obj.style.opacity = value / 100; 
            }
            else{
                    obj.style[attr] = value + 'px';
            }
        }


        if (bBtn) {
            clearInterval(obj.iTimer);

            // 临界值处理
            for(var attr in json){
                iSpeed[attr] = 0;
                if(attr == 'opacity'){
                        obj.style.filter = 'alpha(opacity='+ json[attr] +')';
                        obj.style.opacity = json[attr] / 100; 
                }
                else{
                        obj.style[attr] = json[attr] + 'px';
                }
            }
            
            if(fn){
                fn.call(obj);
            }
        }
    }, 30); 
}
{% endhighlight %}



## 第二课 面向对象课程

> 虽然Object构造函数和对象字面量的方法都可以用来创建单个对象，但这些方式都有明
> 显的缺点：**使用一个接口创建很多对象时，会产生大量的代码**

### 工厂模式（存在缺点）

{% highlight javascript %}
function createPerson(name, sex, job) {
    // 1.原料
    var obj = new Object();

    // 2.加工
    obj.name = name;
    obj.sex = sex;
    obj.job = job;

    obj.sayName = function() {
        alert('我叫' + obj.name);
    };

    obj.saySex = function() {
        alert('我的性别' + obj.sex);
    };

    obj.sayJob = function() {
        alert('我的工作是' + obj.name);
    };

    // 3.出厂
    return obj;
}

window.onload = function() {
    var p1 = createPerson('wayne', '男', '学生');
    var p2 = createPerson('luccy', '女', '学生');

    p1.sayName();
    p1.saySex();
    p2.sayName();
    p2.saySex();

    // 此时两个实例的方法不属于同一个对象，如果定义多个实例，
    // 则有多个相同的方法占据空间，过于浪费空间
    alert(p1.sayName() == p2.sayName());// false
}
{% endhighlight %} 

缺点：

* 没有new方法
* 每个对象都有一套自己的函数--浪费资源
* 没有解决对象的识别性问题

### 构造函数模式（也有缺点）

{% highlight javascript %}
function Person(name, sex, job) {
    this.name = name;
    this.sex = sex;
    this.job = job;

    this.sayName = function() {
        alert('我叫' + obj.name);
    };

    this.saySex = function() {
        alert('我的性别' + obj.sex);
    };

    this.sayJob = function() {
        alert('我的工作是' + obj.name);
    };

    // 因为创建对象时使用了 new 关键字，所以就不需要返回对象了
}

window.onload = function() {
    // 可以作为构造函数使用
    var p1 = new Person('wayne', '男', '学生');
    var p2 = new Person('luccy', '女', '学生');
    // 作为普通函数使用
    Person('wayne','男','学生');
    window.sayName(); // 此时指向 window
    
    p1.sayName();
    p1.saySex();
    p2.sayName();
    p2.saySex();

    // 依旧没有解决方法不在同一个对象下面的问题
    alert(p1.sayName == p2.sayName);// false
}
{% endhighlight %} 

缺点：

* ECMA 中每个函数也是一个对象，因此每定义一个恶函数也就相当于实例化了一个对象
* 每声明一个实例就相当创建了同一个方法，但两个方法却是独立存在的，类似于工厂模式的问题

### 原型模式(常用)

原型：prototype 每个函数都有一个原型属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法

{% highlight javascript %}
function Person(name, sex, job) {
    this.name = name;
    this.sex = sex;
    this.job = job;
}

// 将方法定义在对象的原型上来共享对象所包含的属性和方法
Person.prototype.sayName = function() {
    alert('我叫' + this.name);
};

Person.prototype.saySex = function() {
    alert('我的性别' + this.sex);
};

Person.prototype.sayJob = function() {
    alert('我的工作是' + this.name);
};

window.onload = function() {
    var p1 = new Person('wayne', '男', '学生');
    var p2 = new Person('luccy', '女', '学生');

    p1.sayName();
    p1.saySex();
    p2.sayName();
    p2.saySex();

    // 方法为同一个对象下的资源
    alert(p1.sayName == p2.sayName); // true
}
{% endhighlight %} 

### 实例：面向对象的选项卡

面向过程的选项卡：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>选项卡</title>
    <style>
    #div1 div{display: none;width: 200px;height: 200px;border: 1px solid black;}
    .active{background-color: red;}
    </style>
    <script>
    window.onload = function(){
        var oDiv = document.getElementById('div1'),
            aBtn = document.getElementsByTagName('input'),
            aDiv = oDiv.getElementsByTagName('div'),
            i = 0;

        for (var i = 0; i < aBtn.length; i++) {
            aBtn[i].index = i;

            aBtn[i].onclick = function(){
                for (var i = 0; i < aBtn.length; i++) {
                    aBtn[i].className = '';
                    aDiv[i].style.display = 'none';
                };
                this.className = 'active';
                aDiv[this.index].style.display = 'block';
            };
        };
    };
    </script>
</head>
<body>
    <div id="div1">
        <input type="button" value="1">
        <input type="button" value='2'>
        <input type="button" value='3'>
        <div></div>
        <div></div>
        <div></div>
    </div>
</body>
</html>
{% endhighlight %} 

面向对象的选项卡：**注意 this 的指向问题**

{% highlight javascript %}
/*改写：
    1.前提：所有东西都在onload里
    2.改写：不能有函数嵌套，但可以有全局变量
    3.onload改写成构造函数 
        onload  - 构造函数
        全局变量  -  属性
        函数 - 方法
    4.处理this指向问题（闭包的方式）
        定时器  再嵌套一层function(){},把this存起来使用
        事件
*/

window.onload = function(){ 
    var oTab = new TabSwitch('div1');
}

// 改写成对象
function TabSwitch(id) {
    var oDiv = document.getElementById(id);
    this.aDiv = oDiv.getElementsByTagName('div');
        i = 0;
    this.aBtn = document.getElementsByTagName('input');

    // 定时器和事件的 this 指向问题都可以用类似的方法解决
    var _this = this;// 这个this为oTab实例

    for (var i = 0; i < this.aBtn.length; i++) {
        this.aBtn[i].index = i;

        this.aBtn[i].onclick = function(){
            _this.tab(this);// this为aBtn[i];
        };
    };
};

// 改写成对象原型上的方法
TabSwitch.prototype.tab = function(oBtn) {
    // alert(this);
    for (var i = 0; i < this.aBtn.length; i++) {
        this.aBtn[i].className = '';
        this.aDiv[i].style.display = 'none';
    };
    oBtn.className = 'active';
    this.aDiv[oBtn.index].style.display = 'block';
};
{% endhighlight %} 

### json中的面向对象

{% highlight javascript %}
// json 本身也是一个对象，因此也可以自由定义方法
var wayne = {};

wayne.common = {
    name : 'wayne',
    sex : 'man',
    job : 'student',

    showName : function(){
        alert('我的名字叫做' + this.name);
    }
}

wayne.common.showName();

// 类似于java中包的概念
var miaov = {};

miaov.common = {
    getClass : function(){

    },

    getId : function(){

    }
}

miaov.fx = {
    startMove : function(){

    }
}

// 在公司中把相同的东西包在同一个包中
{% endhighlight %}  

### 实例：面向对象的拖拽动画的实现

面向过程的拖拽：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>面向过程的拖拽</title>
    <style>
    #div{width: 100px;height: 100px;background-color: red;position: absolute;}
    </style>
</head>
<body>
    <div id="div"></div>
    <script>
    window.onload = function(){
        var oDiv = document.getElementById('div');

        oDiv.onmousedown = function(ev){
            var ev = ev || event;

            var disX = ev.clientX - oDiv.offsetLeft;
            var disY = ev.clientY - oDiv.offsetTop;

            document.onmousemove = function(ev){
                var ev = ev || event;

                oDiv.style.left = ev.clientX - disX + 'px';
                oDiv.style.top = ev.clientY - disY + iScroll + 'px';
            }

            document.onmouseup = function(ev){
                var ev = ev || event;

                document.onmousemove = null;
                document.onmoseup = null;
            }
        }
    }
    </script>
</body>
</html>
{% endhighlight %} 

面向对象的拖拽：

{% highlight javascript %}
function Drag(id) {
    var _this = this;
    console.log(this);// this指向 Drag 

    this.oDiv = document.getElementById(id);
    this.disX = 0;
    this.disY = 0;

    // this.oDiv.onmousedown = this.fnDown;
    
    this.oDiv.onmousedown = function(){
        console.log(this); // this指向 oDiv

        _this.fnDown();
    };
}

Drag.prototype.fnDown = function(ev) {
    var _this = this;

    var ev = ev || event;
    console.log(this); // 指向 Drag
    this.disX = ev.clientX - this.oDiv.offsetLeft;
    this.disY = ev.clientY - this.oDiv.offsetTop;

    document.onmousemove = function(){
        _this.fnMove();
    };

    document.onmouseup = function(){
        _this.fnUp();
    };
}

Drag.prototype.fnMove = function(ev) {
    var ev = ev || event;

    this.oDiv.style.left = ev.clientX - this.disX + 'px';
    this.oDiv.style.top = ev.clientY - this.disY + 'px';
}

Drag.prototype.fnUp = function(ev) {
    document.onmousemove = null;
    document.onmoseup = null;
}

window.onload = function(){
    var oDiv = new Drag('div');
}
{% endhighlight %}

### 继承

{% highlight javascript %}
// Person类
function Person (name, sex) {
    this.name = name;
    this.sex = sex;
}

Person.prototype.showSex = function(){
    alert(this.sex);
}

Person.prototype.showName = function(){
    alert(this.name);
}

// Worker类
function Worker(name, sex, job){
    // 调用父级的构造函数
    // 通过 call 来改变 this 指向
    // 构造函数伪装
    Person.call(this, name, sex);

    this.job = job;
}

//原型链 --- 继承父级的原型
// Worker.prototype = Person.prototype; // 会影响父类

// 解决引用带来的问题
for(var i in Person.prototype){
    Worker.prototype[i] = Person.prototype[i];
}

Worker.prototype.showJob = function(){
    alert(this.job);
}

var oW1 = new Worker('blue', '男', '程序员');

oW1.showName();
oW1.showJob();

var oP1 = new Person('leo','男'); 
alert(oP1.showJob);// undefined
{% endhighlight %} 

### 实例：拖拽对象的继承应用

父类：Drag.js

{% highlight javascript %}
function Drag(id) {
    var _this = this;
    console.log(this); // this指向 Drag 

    this.oDiv = document.getElementById(id);
    this.disX = 0;
    this.disY = 0;

    // this.oDiv.onmousedown = this.fnDown;

    this.oDiv.onmousedown = function() {
        console.log(this); // this指向 oDiv

        _this.fnDown();
    };
}

Drag.prototype.fnDown = function(ev) {
    var _this = this;

    var ev = ev || event;
    console.log(this); // 指向 Drag
    this.disX = ev.clientX - this.oDiv.offsetLeft;
    this.disY = ev.clientY - this.oDiv.offsetTop;

    document.onmousemove = function() {
        _this.fnMove();
    };

    document.onmouseup = function() {
        _this.fnUp();
    };
}

Drag.prototype.fnMove = function(ev) {
    var ev = ev || event;

    this.oDiv.style.left = ev.clientX - this.disX + 'px';
    this.oDiv.style.top = ev.clientY - this.disY + 'px';
}

Drag.prototype.fnUp = function(ev) {
    document.onmousemove = null;
    document.onmoseup = null;
}
{% endhighlight %} 

子类：LimitDrag.js

{% highlight javascript %}
function LimitDrag(id) {
    Drag.call(this, id);
}

for (var i in Drag.prototype) {
    LimitDrag.prototype[i] = Drag.prototype[i];
}

LimitDrag.prototype.fnMove = function(ev) {
    var ev = ev || event;
    var l = ev.clientX - this.disX;
    var t = ev.clientY - this.disY;

    if (l < 0) {
        l = 0;
    } else if (l > document.documentElement.clientWidth - this.oDiv.offsetWidth) {
        l = document.documentElement.clientWidth - this.oDiv.offsetWidth;
    }

    if (t < 0) {
        t = 0;
    } else if (t > document.documentElement.clientHeight - this.oDiv.offsetHeight) {
        t = document.documentElement.clientHeight - this.oDiv.offsetHeight;
    }

    this.oDiv.style.left = l + 'px';
    this.oDiv.style.top = t + 'px';
}
{% endhighlight %} 

应用：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>继承拖拽-限制拖拽</title>
    <style>
    #div{width: 100px;height: 100px;background-color: orange;position: absolute;}
    #div1{width: 100px;height: 100px;background-color: yellow;position: absolute;}
    </style>
    <script src="Drag.js"></script>
    <script src="LimitDrag.js"></script>
</head>
<body>
    <div id="div"></div>
    <div id="div1"></div>
    <script>
    window.onload = function(){
        var oDiv = new 1Drag('div');
        var oDiv1 = new LimitDrag('div1');
    }
    </script>
</body>
</html>
{% endhighlight %} 

### 系统对象

#### 本地对象（非静态对象）

常用对象：Object,Function,Array,String,Boolean,Number,Date,RegExp,Error

#### 内置对象（静态对象）

Global, Math

#### 宿主对象（浏览器提供的对象）

DOM,BOM