---
title: Git常用语法笔记
layout: post
time: 2015-02-16 23:027
tag:
- Git
- note

categories:
- tech

---

## 创建仓库与初始化
创建新的文件夹，进入文件夹
{% highlight sh %}
$ git init
{% endhighlight %}

## 检出远程仓库
{% highlight sh %}
$ git clone /path/to/repository 
$ git clone username@host:/path/to/repository
{% endhighlight %}

## 添加与提交
{% highlight sh %}
$ git add <filename>
$ git add *

git commit -m "代码提交信息"
{% endhighlight %}

## 推送到服务器
{% highlight sh %}
$ git push origin master

$ git remote add origin <server>
{% endhighlight %}