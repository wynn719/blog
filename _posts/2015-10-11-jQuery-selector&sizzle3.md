---
published: false
title: jQuery选择器与Sizzle引擎（三）
layout: post
time: 2015-10-11 21:53:17 
tag:
- jQuery
- Sizzle

categories:
- tech

excerpt: 上次分析到了刚进入 Sizzle 的 select 函数中，接下来继续分析
---

> 终于进入 Sizzle 中了，当然 select 是它的主函数

## 词法分析

在进入select函数后，一开始肯定是初始化一堆变量：

{% highlight javascript %}
/**
 * @note : 低版本的选择器到这里来
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 *  @note : 一个普通选择器或者预编译过的选择器
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against 种子集
 */
select = Sizzle.select = function(selector, context, results, seed) {
    var i, tokens, token, type, find,
        compiled = typeof selector === "function" && selector,
        match = !seed && tokenize((selector = compiled.selector || selector));

    results = results || [];

    ...
{% endhighlight %}

**请注意其中的：**

{% highlight javascript %}
match = !seed && tokenize((selector = compiled.selector || selector));
{% endhighlight %}

tokenize 就是jquery的词法分析器，词法分析涉及编译的原理（输入一行代码，计算机是怎么解析这行代码的过程），就不展开说了…… 只要明白** tokenize 的工作就是把接收到的复杂选择器字符串解析成一个个这样形式的 token **

看看它的代码：

{% highlight javascript %}
tokenize = Sizzle.tokenize = function(selector, parseOnly) {
    var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[selector + " "];

    if (cached) {
        return parseOnly ? 0 : cached.slice(0);
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while (soFar) {

        // Comma and first run
        if (!matched || (match = rcomma.exec(soFar))) {
            if (match) {
                // Don't consume trailing commas as valid
                soFar = soFar.slice(match[0].length) || soFar;
            }
            groups.push((tokens = []));
        }

        matched = false;

        // Combinators
        if ((match = rcombinators.exec(soFar))) {
            matched = match.shift();
            tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrim, " ")
            });
            soFar = soFar.slice(matched.length);
        }

        // Filters
        for (type in Expr.filter) {
            if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                    (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                });
                soFar = soFar.slice(matched.length);
            }
        }

        if (!matched) {
            break;
        }
    }
{% endhighlight %}

比如说，遇到这种形式的 `$('#id div>.class')`

{% highlight javascript %}
{
    value:'', 
    type:'对应的Token类型',
    matches:'正则匹配到的一个结构'
}
{% endhighlight %}

