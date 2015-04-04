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
* * onload：加载完成后显示图片
* * onerror：加载失败时，进行其他处理（跳过、显示信息等）
* 预判加载——自动加载下一张图片
* 延迟加载——加载可视区图片，其他图片等进入可视区再加载





