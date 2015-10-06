---
title: js for循环中删除数组的某一项
layout: post
time: 2015-10-07 0:10:36 
tag:
- js

categories:
- tech
- note

excerpt: js是很灵活的语言，因此可以很轻松的做到在for循环中删除数组的某个项。
---

从后台返回的数据经常是以数组的形式传递过来的，开发中遇到的一个小问题，js在处理数组删除时很灵活，故记笔记。

for循环删除数组的某一项，一般的会马上这么写代码：

{% highlight javascript %}
for(var i = 0, len = array.length; i < len; i++){
    if (array[i] === number) {
        array[i].splice(i, 1);
    }
}
{% endhighlight %} 

但是这样是不行的，**因为数组的长度已经改变，这样会造成数组越界**，这时可能会想到这样写：

{% highlight javascript %}
for(var i = 0; i < array.length; i++){
    if (array[i] === number) {
        array[i].splice(i, 1);
    }
}
{% endhighlight %} 

同样也行不通，**因为数组的索引变化难以把握**

**正确的做法**：

{% highlight javascript %}
for(var i = array.length - 1; i >= 0; i--) {
    if(array[i] === number) {
       array.splice(i, 1);
    }
}
{% endhighlight %} 

这样可以保证数组 `splice` 后，循环还按正常的逻辑运行。

---

当然，如果想保证**索引不改变的话**，可以使用 ES5 的新操作符

{% highlight javascript %}
for(var i = 0, len = array.length; i < len; i++){
    if (array[i] === number) {
        delete array[i]; // 索引逻辑不受影响哦！

		// 需要浏览器支持的话，可以尝试把`array[i]`置为null
		// array[i] = null;
    }
}
{% endhighlight %} 