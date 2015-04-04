---
layout: post
title: JS高级课程-笔记
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

