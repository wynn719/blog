---
title: JS中级课程-笔记
layout: post
time: 2015.2.07 22:26:15
tag:
- JavaScript
- 笔记

categories:
- tech

excerpt: 学习妙味课堂js中级课程的一些笔记
---

## 第02课：DOM、BOM相关方法及属性

### getElementsByClassName

{% highlight javascript %}
function getElementsByClassName(parent, tagName, className){
    var aEls = parent.getElementsByTagName(tagName),
        arr = [];// 存储选中的对象

    for(var i = 0; i < aEls.length; i++){
        var aClassName = aEls[i].className.split(' ');

        for(var j = 0; j < aClassName.length; j++){
            if(aClassName[j] === className){
                arr.push( aEls[i] );
                break;// 跳过该元素的处理
            }
        }
    }
    
    return arr;
}
{% endhighlight %}

### 封装addClass和removeClass

{% highlight javascript %}
function addClass (obj, className) {
    if (obj.className === '') {
        obj.className = className;
    }else{
        var arrClassName = obj.className.split(' '),
            _index = indexOfArr(arrClassName, className);

        if (_index === -1) {
            obj.className += ' ' + className; 
        }
    }
}

function removeClass (obj, className) {
    if (obj.className !== '') {
        var arrClassName = obj.className.split(' '),
            _index = indexOfArr(arrClassName, className);

        if (_index !== -1) {
            arrClassName.splice(_index, 1);// 删除当前元素
            obj.className = arrClassName.join(' ');
        }
    }
}

// 取得类名在数组中的索引
function indexOfArr (arr, v) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === v) {
            return i;
        }
    }
    return -1;
}
{% endhighlight %}
