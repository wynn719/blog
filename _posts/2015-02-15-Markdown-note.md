---
title: Markdown的语法学习总结
layout: post
time: 2015-02-13 23:09
tag:
- Markdown
- note

categories:
- tech

---

> Markdown只是一种适用于网络的书写语言，而不是编程语言

## 在HTML区块标签间的Markdown格式语法将不会被处理，而在Markdown格式语法里的HTML区段标签是有效的

{% highlight html %}
<div>
  <p>段落p</p>
  <p>段落p</p>
</div>
{% endhighlight %}

在网页中的显示效果：

<div>
  <p>段落p</p>
  <p>段落p</p>
</div>

# 区块元素

## 段落与换行

## 标题
{% highlight html %}
# h1
## h2
### h3
...
###### h6
{% endhighlight %}

## 区块引用 blockquote
{% highlight html %}
> Proin eget tortor risus.

> Curabitur aliquet quam id dui posuere blandit.
{% endhighlight %}

连续区块引用：
{% highlight html %}
> Proin eget tortor risus.
> Curabitur aliquet quam id dui posuere blandit.
> Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
> Donec sollicitudin molestie malesuada.
> Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.
{% endhighlight %}

嵌套：
{% highlight html %}
> > Proin eget tortor risus. Curabitur aliquet quam id dui posuere blandit.
{% endhighlight %}

在区块中引用其他Markdown语法:
{% highlight html %}
> #### h4
> 
> * list 1
> * list 2
> * list 3
{% endhighlight %}

## 列表
无序列表：
{% highlight html %}
* list1
* list2
* list3
{% endhighlight %}

有序列表：
{% highlight html %}
1. list 1 
2. list 2
3. list 3
{% endhighlight %}

将列表用p标签分隔开
{% highlight html %}
* list 1

* list 2
{% endhighlight %}