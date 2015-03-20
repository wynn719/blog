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
