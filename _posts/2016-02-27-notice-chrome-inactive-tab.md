---
title: chrome网页切换时，js定时器的问题
layout: post
time: 2016-02-27 18:25:32 
tag:
- js

categories:
- tech

excerpt: 做原生js轮播时，chrome浏览器切换页面或者缩小后，轮播动画出现多次重绘的问题
---

原生js轮播组件的代码在这：[https://github.com/zhengbowei/study-baidu-ife/tree/master/task0002/task0002_3](https://github.com/zhengbowei/study-baidu-ife/tree/master/task0002/task0002_3)

之前做的时候，会发现轮播在浏览器可见的情况下（没有缩小，没有切换标签），轮播是正常运行的；而当浏览器不可见的情况下（缩小, 切换标签），重新打开页面，轮播会出现几秒钟抽搐（真的很像）的现象，然后又恢复正常运行。

排除了动画逻辑，定时器泄露的问题，偶然情况下，发现IE下居然没问题！

看来崇拜的chrome也有抽筋的时候，**即chrome在浏览器不可见的情况下（缩小, 切换标签），会把定时器挂起（不会在后台运行），因此重新打开时，挂起的n个定时器突然运行，**所以chrome就抽风了！

说了这么多，解决方法很简单，只要监听这个事件 `visibilitychange` ：

```javascript
// fix chrome下的bug，定时器切换选项卡时被挂起
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState == 'visible') {
        slide(); // 未挂起时执行轮播
    } else if ((document.visibilityState == 'hidden')) {
        clearInterval(timer); // 挂起时清除定时器
    }
});
```

问题就解决了~

demo展示在这：[http://zhengbowei.github.io/study-baidu-ife/task0002/task0002_3/task0002_3.html](http://zhengbowei.github.io/study-baidu-ife/task0002/task0002_3/task0002_3.html)

（可恶，这个问题居然困惑了我好久，气煞我也，所以要记录下来……）