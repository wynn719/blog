---
title: JS中级课程-笔记
layout: post
time: 2015.3.17 22:26:15
tag:
- JavaScript
- 笔记

categories:
- tech

excerpt: 学习妙味课堂js中级课程的一些笔记
---

## 第01课：DOM基础概念、操作

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

### 表格操作

DOM提供了一些方便操作表格的属性：

* tHead 表格头
* tBodies 表格正文
* tFoot 表格尾部
* rows 行
* cells 列

此时HTML应该为如下的形式：

{% highlight html %}
<table id="table" width="100%" border="1px">
    <thead>
        <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>12880229</td>
            <td>wayne</td>
            <td>男</td>
        </tr>
        <tr>
            <td>88888888</td>
            <td>david</td>
            <td>男</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>必填</td>
            <td>必填</td>
            <td>选填</td>
        </tr>
    </tfoot>
</table>
{% endhighlight %}

{% highlight javascript %}
// 取得wayne的值
var oTable = document.getElementById('table');
alert( oTable.tBodies[0].rows[1].cell[1].innerHTML );
{% endhighlight %}

表格的实际应用：

{% highlight javascript %}
var data = [
    {id: 1, username: 'leo', sex: '男'},
    {id: 2, username: '小美', sex: '女'},
    {id: 3, username: '王亮', sex: '男'},
    {id: 4, username: '杜鹏', sex: '男'},
];

var oTab = document.getElementById('tab1');
var oTbody = oTab.tBodies[0];

for(var i=0; i<data.length; i++){
    var oTr = document.createElement('tr');
    
    if(i%2 == 0){
        oTr.style.background = 'white';
    } else {
        oTr.style.background = 'gray';
    }
    
    var oTd = document.createElement('td');
    oTd.innerHTML = data[i].id;
    oTr.appendChild(oTd);
    
    oTd = document.createElement('td');
    oTd.innerHTML = data[i].username;
    oTr.appendChild(oTd);
    
    oTd = document.createElement('td');
    oTd.innerHTML = data[i].sex;
    oTr.appendChild(oTd);
    
    oTd = document.createElement('td');

    /* oTd.innerHTML = '&nbsp;'; 
       兼容IE 7的做法，在IE 7下如果设置为''，表格的空白行无法显示，因此用实体字符&nbsp（也表示空白）代替
    */
    oTr.appendChild(oTd);
    
    var oA = document.createElement('a');
    oA.innerHTML = '删除';
    oA.href = 'javascript:;';
    oA.onclick = function(){
        oTbody.removeChild(this.parentNode.parentNode);
        
        for(var i=0; i<oTbody.rows.length; i++){
            if(i%2 == 0) {
                oTbody.rows[i].style.background = 'white';
            } else {
                oTbody.rows[i].style.background = 'gray';
            }
        }
    }
    oTd.appendChild(oA);
    
    oTbody.appendChild(oTr);
}
{% endhighlight %}

### 表单操作

{% highlight html %}
<form id="form1">
    <!-- 如果没有name值，值不会被提交 -->
    <input type="text" name="text1" />
    
    <input type="radio" name="sex" value="男" checked />男
    <input type="radio" name="sex" value="女" />女
    
    <input type="checkbox" name="a" value="html" checked />html
    <input type="checkbox" name="a" value="css" />css
    <input type="checkbox" name="a" value="javascript" />javascript
    
    <select name="city">
        <option value="">请选择城市</option>
        <option value="北京">北京</option>
        <option value="上海">上海</option>
    </select>
    
    <input type="button" value="按钮" name="btn" />
</form>
{% endhighlight %}

{% highlight javascript %}
// 获取input的值，无兼容性问题
oForm = document.getElementById('form1');

// onchange 内容改变后，在光标离开input后触发
oForm.text1.onchange = function(){
    ...
}

// radio，checkbox等相似元素其实是元素组
// nodeList
// 标准下点击的时候，只要值发生改变，就会触发
// 非标准下，焦点离开的时候，如果值发生改变就触发
oForm.sex[0].onchange = function(){
    ...
} 

// 一选择不同的项，就触发
oForm.city.onchange = function(){
    ...
}

// 通过checked和selected去判断checkbox，radio和select元素的状态
// 代替onchange事件，解决在浏览器下（IE 7）的兼容性
oForm.btn.onclick = function(){
    
    for(var i=0; i<oFrom.sex.length; i++){
        if(oForm.sex[i].checked){
            alert(oForm.sex[i].value + '被选中了');
        } else {
            alert(oForm.sex[i].value + '未被选中');
        }
    }
    
    for(var i=0; i<oFrom.a.length; i++){
        if(oForm.a[i].checked){
            alert(oForm.a[i].value + '被选中了');
        } else {
            alert(oForm.a[i].value + '未被选中');
        }
    }
}
{% endhighlight %}

### 表单事件

onsubmit()

{% highlight html %}
<form id="form1" action="http://www.baidu.com">
    <input type="text" name="text1" />
    <input type="text" name="text2" value="111" />
    <input type="submit" name="dosubmit" value="提交" />
    <input type="reset" name="doreset" value="重置" />
</form>
{% endhighlight %}

{% highlight javascript %}
oForm.onsubmit = function(){
    if(this.text1.value == ''){
        alert('请输入内容');
        return false; // 禁用提交
    }
}

/* 让页面等待一秒钟后自动提交
   通过调用submit()方法来提交表单数据
setTimeout(function(){
    oForm.submit();
}, 1000) 
*/
{% endhighlight %}

onreset()

{% highlight javascript %}
// reset为重置方法（回到初始HTML状态），不是清空
oForm.reset = function(){
    return confirm('您确定要重置吗？'); // 也是通过bool返回值来确定方法是否重置
}
{% endhighlight %}

### BOM (Browser Object Model 浏览器对象模型)

* window.open()
* window.close()

{% highlight html %}
<input type="button" value="打开新窗口" />
<input type="button" value="关闭窗口" />
<input type="button" value="关闭新窗口" />
{% endhighlight %}

{% highlight javascript %}
/*
BOM : Browser Object Model 浏览器对象模型
*/
window.onload = function() {
    var aInput = document.getElementsByTagName('input');
    var opener = null;
    
    aInput[0].onclick = function() {
        
        // open(地址默认是空白页面，打开方式默认新窗口) 打开一个新窗口
        window.open('http://www.baidu.com', '_self'); // _self在该窗口打开该页面
        
        opener = window.open();// 返回的新开页面的window对象
                
        //opener.document.body.style.background = 'red';
        
    }
    
    aInput[1].onclick = function() {
        
        window.close();
        /* 浏览器中的不同反应
            Firefox : 无法关闭
            chrome : 直接关闭
            ie : 询问用户
        */
        
    }
    
    aInput[2].onclick = function() {
        opener.close(); //可以通过关闭用window.open方法打开的窗口
    }
}
{% endhighlight %}

window.navigator.userAgent 浏览器信息

{% highlight javascript %}
//window.navigator.userAgent : 浏览器信息

if ( window.navigator.userAgent.indexOf('MSIE') != -1 ) {
    alert('我是ie');
} else {
    alert('我不是ie');
}
{% endhighlight %}

window.location 浏览器地址信息

{% highlight javascript %}
//window.location : 地址 （Object）
/*
    window.location.href = 当前窗口url
    window.location.search = url?后面的内容
    window.location.hash = url#后面的内容(可用于做幻灯片的切换)
*/
{% endhighlight %}

文档宽高及窗口事件clientWidth与clientHeight

{% highlight javascript %}
// 可视区尺寸(浏览器窗口)

document.documentElement.clientWidth; 
document.documentElement.clientHeight;
{% endhighlight %}

滚动距离

{% highlight javascript %}
document.body.scrollTop/scrollLeft;// scrollTop是可视区顶部到整个页面顶部的距离（就是滚动条滚动距离）,scrollLeft是横向滚动距离
document.documentElement.scrollTop/scrollLeft
/* 兼容性问题
 * chrome 滚动距离是指向body
 * other 滚动距离指向documentElement
 * 解决方法如下
 */
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
{% endhighlight %}

内容高度

{% highlight javascript %}
document.body.scrollHeight
element.scrollHeight // element.scrollWidth
{% endhighlight %}

文档高度

{% highlight javascript %}
document.body.scrollHeight
element.scrollHeight // element.scrollWidth
/* 存在兼容性问题
 * IE，如果内容没有可视区高，那么文档高就是可视区
 * other，文档的高并不是可视区的高
 */
// 在页面中取文档的高，请先在CSS中将body的margin去掉，然后用document.body.offsetHeight来取文档元素的高，不同浏览器body默认有不同的margin或者padding值
{% endhighlight %}

* onscroll 当滚动条滚动时触发
* onresize 当窗口改变时触发

{% highlight javascript %}
// 这两个函数的触发次数都是按时间间隔来算的，而不是根据拉动的次数来计算
window.onscroll = function(){
    i++;
}

window.onresize = function(){
    i++;
}
{% endhighlight %}

## 第03课：Event-事件详解1

### 焦点事件-1

焦点：使浏览器能够区分用户输入的对象。

元素获得焦点的方式：

* 鼠标点击
* tab
* js

注：并不是所有的元素都能够接收焦点。能够响应用户操作的元素才有焦点，如input，a，form元素。

* 获取焦点事件onfocus \ 失去焦点事件 onblur (如：输入框提示文字)
* obj.focus(); 给指定的元素设置焦点
* obj.blur(); 取消指定元素的焦点
* obj.select(); 选中指定元素的焦点

提升input输入的用户体验：

{% highlight html %}
<input type="text" id="text1" value="请输入内容" />
<input type="button" value="全选" id="btn"/>
{% endhighlight %}

{% highlight javascript %}
var oText = document.getElementById('text1');
var oBtn = document.getElementById('btn');

//onfocus：当元素获取到焦点的时候触发
oText.onfocus = function(){
    if(value='请输入内容'){
        this.value = '';
    }
}

//onblur：当元素失去焦点的时候触发
oText.onblur = function(){
    if(this.value == ''){
        this.value = '请输入内容';
    }
}

oText.focus();

oBtn.onclick = function(){
    oText.select();
}
{% endhighlight %}

### event-事件对象和clientX,clientY

event 事件对象，当一个事件触发的时候，event对象会记录这个事件的有关的详细信息

事件对象必须在一个事件调用的函数里面使用才有内容

事件函数：事件调用的函数，一个函数是不是事件函数，不在定义的决定，而是取决于这个调用的时候

{% highlight javascript %}
alert(event); // 直接调用时，标准下： undefined ie中：null

document.onclick = function(){
    alert(event); // 显示event对象
}
{% endhighlight %}

{% highlight javascript %}
function fn1(){
    alert(event);
}

fn1(); //不是事件调用的函数，因此这时候event没有内容，显示undefined
document.onclick = fn1; // fn1是事件调用的函数，所以event有内容 这种写法在firefox无效
{% endhighlight %}

兼容性问题

* ie/chrome : event是一个内置全局对象
* 标准下 : 事件对象是通过事件函数的第一个参数传入

如果一个函数是被事件调用的那么，这个函数定义的第一个参数就是事件对象

{% highlight javascript %}
function fn1(ev){
    alert(ev);
}
document.onclick = fn1; //在火狐、标准ie下、chrome下都可以弹出事件对象（非标准ie会弹出undefined）
{% endhighlight %}

解决兼容性的问题

{% highlight javascript %}
function fn1(ev) {
    var ev = ev || event;// 标准函数中调用第一个，非标准调用第二个
    alert(ev);
    
    /*for(var attr in ev){
        console.log(attr + ' = ' + ev[attr]);
    }*/
}
document.onclick = fn1;
{% endhighlight %}

clientX \ clientY 当一个事件发生的时候，鼠标到页面可视区的距离

{% highlight html %}
<style>
#div1 {width: 100px; height:100px; background: red; position: absolute;}
</style>
<body style="height: 2000px;">
    <div id="div1"></div>
</body>
{% endhighlight %}

{% highlight javascript %}
//onmousemove；当鼠标在一个元素上移动的时候触发
//触发频率不是以像素记，而是间隔时间。在一个指定时间内（很短），如果鼠标的位置和上一次的位置发生了变化，那么就会触发一次
var oDiv = document.getElementById('div1');
document.onmousemove = function(){
    var ev = ev || event;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    oDiv.style.left = ev.clientX + 'px';
    oDiv.style.top = scrollTop + ev.clientY + 'px';
}
{% endhighlight %}

### 事件流-事件冒泡机制-

事件冒泡：当一个元素接收到事件的时候，会把它接收到的事件传播给它的父级，一直到顶层window，这也被称为js中的事件冒泡机制。

{% highlight javascript %}
// 给oDiv1加事件，给元素加事件处理函数，即使不给oDiv1加上事件，
// 点击oDiv1时依旧会触发事件，只不过事件没有被处理，onmouseover等也是同理
//oDiv1.onclick = fn1;  
{% endhighlight %}

冒泡示例

{% highlight html %}
<body>
    <div id="div1">
        <div id="div2">
            <div id="div3"></div>
        </div>
    </div>
</body>
<script>
var oDiv1 = document.getElementById('div1');
var oDiv2 = document.getElementById('div2');
var oDiv3 = document.getElementById('div3');

function fn1() {
    alert( this.id );
}

// 当点击div3时，div1也会弹出信息，即事件冒泡从div3往上一直冒泡到window对象，
// 而div3做了click的处理，所以弹出了信息。
oDiv1.onclick = fn1;
oDiv3.onclick = fn1;
</script>
{% endhighlight %}

阻止冒泡

在当前要阻止冒泡的事件函数中调用：事件对象.cancelBubble = true;

{% highlight html %}
<body>
    <input type="button" value="按钮" id="btn" />
    <div id="div1" style="width: 100px; height: 200px; border: 1px solid red; display: none"></div>
</body>
<script>
var oBtn = document.getElementById('btn');
var oDiv = document.getElementById('div1');

oBtn.onclick = function(ev){
    var ev = ev || event;
    ev.cancelBubble = true; //阻止当前对象的当前事件的冒泡
    oDiv.style.display = 'block';
}

// 点击btn不会触发document的click事件了
document.onclick = function(){
    /* 测试事件冒泡
    setTimeout(function(){
        oDiv.style.display = 'none';
    }, 1000);
    */
    oDiv.style.display = 'none';
}
</script>
{% endhighlight %}

事件冒泡的实际应用

{% highlight html %}
<!-- 侧边栏分享到……应用 -->
<body>
    <div id="div1">
        <div id="div2"></div>
    </div>
</body>
<style>
#div1 {width: 100px; height: 200px; background: red; position: absoute; left: -100px; top: 100px;}
#div2 {width: 30px; height: 60px; position: absolute; right: -30px; top: 70px; background: black; color: white; text-align: center;}
</style>
<script>
var oDiv = document.getElementByid('div1');
// 点击div2时冒泡机制使div1触发下列事件
oDiv.onmouseover = function(){
    this.style.left = '0px';
}
oDiv.onmouseout = function(){
    this.style.left = '-100px';
}
</script>
{% endhighlight %}

### 事件冒泡第二种形式

注意：上面提到的是事件冒泡的第一种形式，不能同时处理两个事件

{% highlight javascript %}
function fn1(){alert(1);}
function fn2(){alert(2);}
document.onclick = fn1;
document.onclick = fn2; //会覆盖前面绑定的fn1
{% endhighlight %}

给对象绑定事件处理函数的第二种形式

ie：obj.attachEvent(事件名称, 事件函数);

* document.attachEvent('onclick', fn1);
* 没有捕获
* 事件名称有on
* 事件函数执行的顺序：标准ie -> 正序；非标准ie -> 倒序
* this指向window

标准：obj.addEventListener(事件名称, 事件函数, 是否捕获);

* document.addEventListener('click', fn1, false);
* 有捕获
* 事件名称没有on
* 事件函数执行顺序：正序
* this指向触发该事件的对象

call() 函数下的一个方法，call方法的第一个参数可以改变函数执行过程中的内部this的指向；call方法从第二个参数开始就是原来函数的参数列表；如果call方法传入的第一个参数是null，那么就是不改变函数内部的this指向的。

{% highlight javascript %}
function fn1(){
    alert(this);
}

//fn1(); //window
fn1.call(); //调用函数 也就是说：fn1() 可视为等同于 fn1.call() 弹出window
fn1.call(1) //弹出1，因为在fn1里面的this变成了1。
{% endhighlight %}

{% highlight javascript %}
function fn1(a + b){
    alert(this);
    alert(a + b);
}
fn1.call(1, 20, 30); //先弹出1，然后弹出50
fn1.call(null, 10, 20); //先弹出window对象，然后弹出30
{% endhighlight %}

函数绑定封装函数(解决兼容性问题)

{% highlight javascript %}
function bind(obj, evname, fn){
    if(obj.addEventListener){
        obj.addEventListener(evname, fn, false);
    } else {
        obj.attachEvent('on' + evname, function(){
            fn.call(obj);
        })
    }
}
{% endhighlight %}

{% highlight html %}
<body>
    <div id="div1">
        <div id="div2">
            <div id="div3"></div>
        </div>
    </div>
</body>
<script>
var oDiv1 = document.getElementById('div1');
var oDiv2 = document.getElementById('div2');
var oDiv3 = document.getElementById('div3');

function fn1(){
    alert(this);
}

//通过将addEventListener的第三个参数设置为true，来设置事件捕获
oDiv1.addEventListener('click', fn1, true); //上面这一句告诉oDiv1：如果有一个进去的事件触发了你，你就去执行fn1这个函数
oDiv2.addEventListener('click', fn1, true);
oDiv3.addEventListener('click', fn1, true);    
</script>
{% endhighlight %}

事件捕捉：从父级向子级穿透，与事件冒泡正好相反，即事件冒泡和事件捕捉不能同时发生

{% highlight javascript %}
oDiv1.addEventListener('click', function(){
    alert(1);
}, false)
oDiv1.addEventListener('click', function(){
    alert(3);
}, true)
oDiv1.addEventListener('click', function(){
    alert(2);
}, false)
//弹出顺序是：3 -> 2 -> 1
{% endhighlight %} 

### 事件绑定的取消

取消第一种事件绑定函数（普通绑定）

{% highlight javascript %}
function fn1(){alert(1);}
function fn2(){alert(2);}

document.onclick = fn1;
document.onclick = null; //通过赋值的形式取消了原来的事件绑定函数fn1
{% endhighlight %} 

取消第二种形式的事件绑定函数

* IE：obj.detachEvent(事件名称, 事件函数);
* 标准：obj.removeEventListener(事件名称, 事件函数, 是否捕获 );

### 键盘事件

注意：不是所有的元素都能够接受键盘事件，能够响应用户输入的元素才可以。能够接收焦点的元素就能够接收键盘事件

**onkeydown** 当键盘按键按下的时候触发

event.keyCode 当发生键盘事件时，keyCode会存储键盘按下的值（同样的功能键返回的值一样）

ctrlKey, shiftKey, altKey 布尔值，存储相应按键的状态

当onkeydown长按时，会连续触发，触发原理为第一次为单次触发，之后会重复触发

{% highlight javascript %}
document.onkeydown = function(ev){
    var ev = ev || event;
    alert(ev.keyCode);
}

document.onclick = function(ev){
    var ev = ev || event;
    alert(ev.ctrlKey); //当按下ctrl点击的时候，弹出true；没有按ctrl点击的时候，返回false
}
{% endhighlight %} 

**onkeyup** 当键盘按键抬起的时候触发，同理如上

仿qq留言本

{% highlight html %}
<body>
    <input type="text" id="text1" />
    <ul id="ul1"></ul>  
</body>
<script>
var oText = document.getElementById('text1');
var oUl = document.getElementById('ul1');

/*
oText.onkeydown = function(){
    alert(this.value); //这里会发现，onkeydown的事件触发是在给oText赋值之前，所以这里应该改为onkeyup才行
}
*/

oText.onkeyup = function(ev){
    
    var ev = ev || event;

    if(this.value != ''){

        if(ev.keyCode == 13 && ev.ctrlKey){ //如果同时按住ctrl + 回车 

            var oLi = document.createElement('li');
            oLi.innerHTML = this.value;

            if(oUl.children[0]){
                oUl.insertBefore(oLi, oUl.children[0]);
            } else {
                oUl.appendChild(oLi);
            }

        }
            
    }
}    
</script>
{% endhighlight %} 

### 事件默认行为  （浏览器本身的默认行为等）

oncontextmenu 右键菜单事件，当右键菜单（环境菜单、上下文菜单）显示出来的时候触发



{% highlight html %}
<body style="height: 2000px"></body>
<script>
// 通过对当前有默认行为的元素以return false来禁用行为
document.onkeydown = function(){
    return false; //这样就阻止了点击空格，滚动条向下滚动的默认事件
}
document.oncontextmenu = function(){
    //alert(1);
    return false; //阻止了点击右键，弹出右键菜单的默认行为
}
</script>
{% endhighlight %} 

自定义右键菜单原理

{% highlight html %}
<body>
    <div id="div1"></div>
</body>
<style>
#div1 {width: 100px; height: 200px; border: 1px solid red; position: absolute; display: none;}
</style>
<script>
var oDiv = document.ElementById('div1');

document.oncontextmenu = function(ev){
    var ev = ev || event;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    
    oDiv.style.display = 'block';
    
    oDiv.style.left = scrollLeft + ev.clientX + 'px';
    oDiv.style.top = scrollTop + ev.clientY + 'px';

    return false;
}

document.onclick = function(){
    oDiv.style.display = 'none';
}
</script>
{% endhighlight %} 

## 事件深入应用

### 拖拽的原理

基本由这三个事件主导，主要是计算拖拽的相对距离

* onmousedown 选择元素
* onmousemove 移动元素
* onmouseup 释放元素

{% highlight html %}
<body>
    <div id="div"></div>
</body>
<style>
#div{position: absolute;width: 100px;height: 100px;background-color: orange;}
</style>
<script>
var oDiv = document.getElementById('div1');

oDiv.onmousedown = function(){
    var ev = ev || event;

    // 计算出相对距离
    var disX = ev.clientX - this.offsetLeft;
    var disY = ev.clientY - this.offsetTop;// 如果有scroll也要加入就算

    /*
     * oDiv.onmousemove = function (ev) {
     * 事件在oDiv上时，如果div进入另一个div中，
     * mouseup会被另一个div覆盖，无法触发
     */
    document.onmousemove = function (ev) {
        var ev = ev || event;
            
        oDiv.style.left = ev.clientX - disX + 'px';
        oDiv.style.top = ev.clientY - disY + 'px';
    }

    // 同理
    document.onmouseup = function () {
        document.ommousemove = document.onmouseup = null;
    }
} 
// 依旧有bug，看下面分解= =
</script>
{% endhighlight %}

### 拖拽的问题和解决方法

注意：如果拖拽的时候有文字被选中，会产生问题

原因：

* 当鼠标按下的时候，如果页面中有文字被选中，会触发浏览器的默认拖拽文字的效果。
* 选中图片时也同理

解决方法：

* 标准：阻止浏览器的默认行为
* ie：全局捕获 setCapture()

{% highlight javascript %}
// 拖拽基础，具体情况有所不同
oDiv.onmousedown = function(ev) {
    var ev = ev || event;
    
    var disX = ev.clientX - this.offsetLeft;
    var disY = ev.clientY - this.offsetTop;
    
    // ie：设置全局捕获 setCapture()
    if ( oDiv.setCapture ) {
        oDiv.setCapture(); // div监测所有事件，需要释放
    }
    
    document.onmousemove = function(ev) {
        var ev = ev || event;
        
        oDiv.style.left = ev.clientX - disX + 'px';
        oDiv.style.top = ev.clientY - disY + 'px';
    }
    
    document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null;
        //释放全局捕获 releaseCapture();
        if ( oDiv.releaseCapture ) {
            oDiv.releaseCapture();
        }
    }
    
    return false; // 标准下：阻止浏览器默认拖拽选中文字的行为
    
}
{% endhighlight %} 

### 拖拽的封装-限制范围、磁性吸附

封装函数

{% highlight javascript %}
function drag(obj){
    obj.onmousedown = function(ev){
        var ev = ev || event;
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;
        
        if(obj.setCapture){
            obj.setCapture();
        }
        
        document.onmousemove = function(ev){
            var ev = ev || event;
            
            obj.style.left = ev.clientX - disX + 'px';
            obj.style.top = ev.clientY - disY + 'px';
            
        }
        
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            
            if(obj.releaseCapture){
                obj.releaseCapture();
            }
        }
        
        return false;
    }   
}
{% endhighlight %} 

限制范围的拖拽

{% highlight javascript %}
function drag(obj){
    obj.onmousedown = function(ev){
        var ev = ev || event;
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;
        
        if(obj.setCapture){
            obj.setCapture();
        }
        
        document.onmousemove = function(ev){
            var ev = ev || event;
            var L = ev.clientX - disX;
            var T = ev.clientY - disY;
            
            // 限制拖拽范围在页面内
            if(L < 0){
                L = 0;
            } else if( L > document.documentElement.clientWidth - obj.offsetWidth){
                L = document.documentElement.clientWidth - obj.offsetWidth;
            }
            if(T < 0){
                T = 0;
            } else if(T > document.documentElement.clientHeight - obj.offsetHeight){
                T = document.documentElement.clientHeight - obj.offsetHeight;
            }
            
            obj.style.left = L + 'px';
            obj.style.top = T  + 'px';
            
        }
        
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            
            if(obj.releaseCapture){
                obj.releaseCapture();
            }
        }
        
        return false;
    }   
}
{% endhighlight %} 

磁性吸附

{% highlight javascript %}
function drag(obj){
    obj.onmousedown = function(ev){
        var ev = ev || event;
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;
        
        if(obj.setCapture){
            obj.setCapture();
        }
        
        document.onmousemove = function(ev){
            var ev = ev || event;
            var L = ev.clientX - disX;
            var T = ev.clientY - disY;
            
            // 限制拖拽范围在页面内
            if(L < 100){ //只要把原来的0改为一个范围，例如：100，就实现了磁性吸附的效果
                L = 0;
            } else if( L > document.documentElement.clientWidth - obj.offsetWidth){
                L = document.documentElement.clientWidth - obj.offsetWidth;
            }
            if(T < 100){
                T = 0;
            } else if(T > document.documentElement.clientHeight - obj.offsetHeight){
                T = document.documentElement.clientHeight - obj.offsetHeight;
            }
            
            obj.style.left = L + 'px';
            obj.style.top = T  + 'px';
            
        }
        
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            
            if(obj.releaseCapture){
                obj.releaseCapture();
            }
        }
        
        return false;
    }   
}
{% endhighlight %} 

### 碰撞检测

{% highlight html %}
<body>
    <div id="div1"></div>
    <img id="img1" url="1.jpg" />   
</body>
<style>
#div1 { width: 100px; height: 100px; background: red; position: absolute; z-index: 2 }
#img1 { position: absolute; left: 500px; top: 200px; }    
</style>
<script>
function drag(obj){
    obj.onmousedown = function(ev){
        var ev = ev || event;
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;
        
        if(obj.setCapture){
            obj.setCapture();
        }
        
        document.onmousemove = function(ev){
            var ev = ev || event;
            var L = ev.clientX - disX;
            var T = ev.clientY - disY;
            
            //被拖动的元素的四条边
            var L1 = L;
            var R1 = L + obj.offsetWidth;
            var T1 = T;
            var B1 = T + obj.offsetHeight;
            
            //被碰撞的元素的四条边(这个例子里面是img元素)
            var L2 = oImg.offsetLeft;
            var R2 = L2 + oImg.offsetWidth;
            var T2 = oImg.offsetTop;
            var B2 = T2 + oImg.offsetHeight;
            
            if(R1 < L2 || L1 > R2 || B1 < T2 || T1 > B2){
                oImg.src = '1.jpg';
            } else {
                oImg.src = '2.jpg';
            }
            
            obj.style.left = L + 'px';
            obj.style.top = T  + 'px';
            
        }
        
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            
            if(obj.releaseCapture){
                obj.releaseCapture();
            }
        }
        
        return false;
    }   
} 
</script>
{% endhighlight %} 

### 拖拽改变层大小

{% highlight html %}
<body>
    <div id="div1"></div>
</body>
<style>
#div1 { width: 100px; height: 100px; background: red; position: absolute; left: 500px; top: 200px; }
</style>
<script>
var oDiv = document.getElementById('div1');

oDiv.onmousedown = function(ev){
    var ev = ev || event;
    var disW = this.offsetWidth;
    var disX = ev.clientX;
    var disL = this.offsetLeft;
    var b = '';
    
    if(disX > disL + disW - 10){
        b = 'right';
    }
    if(disX < disL + 10){
        b = 'left';
    }
    
    document.onmousemove = function(ev){
        var ev = ev || event;
        switch(b){
            case 'left':
                oDiv.style.width = disW - (ev.clientX - disX) + 'px';
                oDiv.style.left = disL + (ev.clientX - disX) + 'px';
                break;
            case 'right':
                oDiv.style.width = disW + (ev.clientX - disX) + 'px';
                break
        }
    }
    document.onmouseup = function(){
        document.onmousemove = document.onmouseup = null;
    }
    return false;
}
</script>
{% endhighlight %} 

### 滚动条的模拟和扩展运用

{% highlight html %}
<body>
    <div id="div1">
        <div id="div2></div>
    </div>
    <div id="div3></div>
</body>
<style>
#div1 { width: 30px; height: 500px; background: black; position: absolute; left: 10px; top: 10px; }
#div2 { width: 30px; height: 30px; background: red; position: absolute; left: 0; top: 0 }
#div3 { width: 500px; height: 500px; background: green; position: absolute; left: 50px; top: 10; }
</style>
<script>
var oDiv1 = document.getElementById('div1');
var oDiv2 = document.getElementById('div2');
var oDiv3 = document.getElementById('div3');
var iMaxTop = oDiv1.offsetHeight - oDiv2.offsetHeight;

oDiv2.onmousedown = function(ev){
    var ev = ev || event;
    var disY = ev.clientY - this.offsetTop;
    
    document.onmousemove = function(ev){
        var ev = ev || event;
        var T = ev.clientY - disY;
        
        if(T < 0){
            T = 0;
        } else if(T > iMaxTop){
            T = iMaxTop;
        }
        oDiv2.style.top = T + 'px';
        
        var iScale = T / iMaxTop;
        oDiv3.style.height = 500 * iScale + 'px';
    }
    document.onmouseup = function(){
        document.onmousemove = document.onmouseup = null;
    }
    
    return false;
}    
</script>
{% endhighlight %}

控制内容的滚动

{% highlight html %}
<body>
    <div id="div1">
        <div id="div2"></div>
    </div>
    <div id="div3">
        <div id="div4">这里是一段内容。</div>
    </div>
</body>
<style>
#div1 { width: 30px; height: 500px; background: black; position: absolute; left: 10px; top: 10px; }
#div2 { width: 30px; height: 30px; background: red; position: absolute; left: 0; top: 0 }
#div3 { width: 498px; height: 498px; border: 1px solid green; position: absolute; left: 50px; top: 10; }
#div4 { position: absolute; top: 0; left: 0; }
</style>
<script>
var oDiv1 = document.getElementById('div1');
var oDiv2 = document.getElementById('div2');
var oDiv3 = document.getElementById('div3');
var oDiv4 = document.getElementById('div4');
var iMaxTop = oDiv1.offsetHeight - oDiv2.offsetHeight;

oDiv2.onmousedown = function(ev){
    var ev = ev || event;
    var disY = ev.clientY - this.offsetTop;
    
    document.onmousemove = function(ev){
        var ev = ev || event;
        var T = ev.clientY - disY;
        
        if(T < 0){
            T = 0;
        } else if(T > iMaxTop){
            T = iMaxTop;
        }
        oDiv2.style.top = T + 'px';
        
        var iScale = T / iMaxTop;
        oDiv4.style.top = (oDiv3.clientHeight - oDiv4.offsetHeight) * iScale + 'px';
    }
    document.onmouseup = function(){
        document.onmousemove = document.onmouseup = null;
    }
    
    return false;
}
</script>
{% endhighlight %}

## 鼠标滚轮和cookie

### 鼠标滚轮

* IE/chrome: onmousewheel
* 取得滚动值：event.wheelDelta 数字类型 （上：120，下：-120）
* 标准浏览器下的event.detail永远都是0；非标准IE的event.detail是undefined

* firefox：DOMMouseScroll 必须用addEventListener来实现绑定
* 取得滚动值：event.detail（上：-3，下：3）

* return false阻止的是obj.on事件名称=fn所触发的默认行为，阻止不了addEventListener绑定的行为
* 用addEventListener绑定的事件需要通过event下面的preventDefault();来阻止默认行为
* IE下用attachEvent来绑定的话，还是可以用return false来阻止默认事件

兼容性做法：

{% highlight html %}
<body>
    <div id="div1"></div>
</body>
<style>
body { height: 2000px; }
#div1 { width: 100px; height: 100px; background: red; }    
</style>
<script>
var oDiv = document.getElementById('div1');

oDiv.onmousewheel = fn;

if(oDiv.addEventListener){
    oDiv.addEventListener('DOMMouseScroll', fn, false);
}

function fn(ev){
    var ev = ev || event;
    
    var b = true; // 控制鼠标滚轮状态值
    if(ev.wheelDelta){
        b = ev.wheelDelta > 0 ? true : false;
    } else {
        b = ev.wheelDelta > 0 ? false : true;
    }
    
    if(b){
        this.style.height = this.offsetHeight - 10 + 'px';
    } else {
        this.style.height = this.offsetHeight + 10 + 'px';
    }
    
    if(ev.preventDefault){
        ev.preventDefault();
    }
    
    return false;
}    
</script>
{% endhighlight %}

### cookie

* 不同的浏览器存放的cookie位置不一样，也是不能通用的
* cookie的存储是以域名的形式进行区分的
* cookie的数据是可以设置名字的
* 一个域名下存放的cookie的个数是有限制的。不同的浏览器存放的个数不一样
* 每一个cookie存放的内容大小也是有限制的，不同的浏览器存放的内容大小不一样

通过document.cookie来获取当前网站下的cookie的时候，得到的是字符串形式的值，它包含了当前网站下所有的cookie。它会把所有的cookie通过一个分号+空格的形式串联起来。

设置一个过期的时间(这个时间必须是字符串格式)延长cookie的销毁时间。cookie默认是临时存储的，当浏览器关闭进程的时候，自动销毁。

{% highlight javascript %}
//document.cookie = '名字=值;expires=' + 字符串格式的时间;
var oDate = new Date();
oDate.setDate( oDate.getDate() + 5 ); //5天以后
//oDate.toGMTString(); //将日期对象转换为字符串格式

//内容最好编码存放，encodeURI
//alert(encodeURI('你好'));
//alert(decodeURI('%E4%BD%A0%E5%A5%BD'));

document.cookie = 'username =' + encodeURI('leo\n你好') + ' leo;expires=' + oDate.toGMTString();
document.cookie = 'age = 32';
alert(decodeURI(document.cookie));

function getCookie(key){
    var arr1 = document.cookie.split('; ');
    for(var i=; i<arr1.length; i++){
        var arr2 = arr1[i].split('=');
        if(arr2[0] == key){
            return decodeURI(arr2[1]);
        }
    }
}

alert(getCookie('age'));

function setCookie(key, value, t){
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t );
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

setCookie('sex', '男', 10);

function removeCookie(key){
    setCookie(key, '', -1);
}

removeCookie('username');
{% endhighlight %}

cookie实例应用 记住登录名
{% highlight html %}
<input type="text" id="username" />
<input type="button" value="登陆" id="login" />
<input type="button" value="删除" id="del" />
{% endhighlight %}


{% highlight javascript %}
var oUsername = document.getElementById('username');
var oLogin = document.getElementById('login');
var oDel = document.getElementById('del');

if(getCookie('username')）{
    oUsername.value = getCookie('username');
}

oLogin.onclick = function(){
    alert('登陆网站成功');
    setCookie('username', oUsername.value, 5);
}

oDel.onclick = function(){
    removeCookie('username');
    oUsername.value = '';
}

function getCookie(key){
    var arr1 = document.cookie.split('; ');
    for(var i=; i<arr1.length; i++){
        var arr2 = arr1[i].split('=');
        if(arr2[0] == key){
            return decodeURI(arr2[1]);
        }
    }
}

function setCookie(key, value, t){
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t );
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

function removeCookie(key){
    setCookie(key, '', -1);
}
{% endhighlight %}


