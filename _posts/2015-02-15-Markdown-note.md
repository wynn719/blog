---
title: Markdown的语法学习总结
layout: post
time: 2015-02-13 23:09
tag:
- Markdown
- note

categories:
- tech

excerpt: 最近在学习了jekyll建站后，顺便学了下Markdown书写语言，多学肯定有益啦，总结一下，不定期更新……
---

> Markdown只是一种适用于网络的书写语言，而不是编程语言

# 兼容

在HTML区块标签间的Markdown格式语法将不会被处理，而在Markdown格式语法里的HTML区段标签是有效的

# 区块元素

## 段落
普通段落：
```html
这是一个普通的段落
啦啦啦，将会被转换为p标签
连续的

不连续的\(^o^)/~
```

## 标题
```html
# h1
## h2
### h3
...
###### h6
```

## 区块引用 blockquote
```html
> Proin eget tortor risus.

> Curabitur aliquet quam id dui posuere blandit.
```

连续区块引用：
```html
> Proin eget tortor risus.
> Curabitur aliquet quam id dui posuere blandit.
> Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
> Donec sollicitudin molestie malesuada.
> Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.
```

嵌套：
```html
> > Proin eget tortor risus. Curabitur aliquet quam id dui posuere blandit.
```

在区块中引用其他Markdown语法:
```html
> #### h4
> 
> * list 1
> * list 2
> * list 3
```

## 列表
无序列表：
```html
* list1
* list2
* list3
```

有序列表：
```html
1. list 1 
2. list 2
3. list 3
```

将列表用p标签分隔开：
```html
* list 1

* list 2
```

多段落列表：

(单个列中多段落以段前4个空格符或者间隔符来区分，段落间空行使p标签包裹文本)

```html
1.   Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.Proin eget tortor risus. Proin eget tortor risus. Cras ultricies ligula sed magna dictum porta.

2.   Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.Proin eget tortor risus. Proin eget tortor risus.Crasultricies ligula sed magna dictum porta.

3.   Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.Proin eget tortor risus. Proin eget tortor risus. Cras ultricies ligula sed magna dictum porta.
```

在列表中加入引用blockquote：

（需要缩进）

```html
*   Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.

    > This is a blockquote
    > inside a list item.
```

用反斜线来防止列表的生成：
```html
1\.this blockquote looks pretty good.
```

## 分隔线
（三个以上的星号、减号、底线）
```html
* * *

***

- - -

---------------------------------------
```

# 区段元素
## 链接
行内链接：
```html
it links to [google](http://www.google.com/ "the title of this link") , click it!

[yahoo](http:www.yahoo.com) has no title attr.
```

参考链接：
```html
This is [an example] [id] reference-style link.

<!-- 然后在任意的地方把链接定义出来，不区分大小写，有点像书本的脚标 -->

[id]: <http://example.com/>  "Optional Title Here"
```

e.g.
```html
I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"
```

## 强调
一个星号包裹是em，两个是strong，同样反斜线输出正常的星号
```html
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
```

## 代码
用反引号包裹形成code代码
```html
`printf()`
```

## 图片
行内图片：
```html
![Alt text](/path/to/img.jpg)

![Alt text](/path/to/img.jpg "Optional title")
```

参考图片：
```html
![Alt text][id]

[id]: url/to/image  "Optional title attribute"
```

# 其他
## 自动连接
```sh
<address@example.com>
```

## 反斜杠
Markdown 支持以下这些符号前面加上反斜杠来帮助插入普通的符号：

```html
\   反斜线
`   反引号
*   星号
_   底线
{}  花括号
[]  方括号
()  括弧
#   井字号
+   加号
-   减号
.   英文句点
!   惊叹号
```

> 以上仅方便个人使用，一些自己觉得不需要的就没有加入了。
>
> 强大的Markdown肯定有一些更好的语法，请自行google哈！