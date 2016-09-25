---
title: PHP PDO参数绑定查询后，查看实际执行SQL的方法
layout: post
time: 2016-04-11 13:43:55 
tag:
- php

categories:
- tech

excerpt: 记录PHP PDO参数绑定时遇到的调试问题
---

PDO提供了一个`PDOStatement::debugDumpParams` — 打印一条 SQL 预处理命令的调试方法，但是打印出来的结果有点鸡肋，比如说：

```php
<?php
try {
    $pdo = new PDO();

    $sql = "SELECT * FROM `users` WHERE `username` = ? AND `email` = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $username, PDO::PARAM_STR);
    $stmt->bindParam(2, $email, PDO::PARAM_STR);
    $username = 'wynnezheng';
    $email = '********@qq.com';
    $stmt->execute();
    
    $stmt->debugDumpParams();
} catch (PDOException $e) {
    echo $e->getMessage();
}

// 结果很感人：
// SQL: [58] SELECT * FROM `users` WHERE `username` = ? AND `email` = ?
// Params:  2
// Key: Position #0:
// paramno=0
// name=[0] ""
// is_param=1
// param_type=2
// Key: Position #1:
// paramno=1
// name=[0] ""
// is_param=1
// param_type=2
?>
```

要是 SQL 语句一复杂这根本就阅读不了嘛！

**PDO 的执行方式的不同，导致SQL 语句并不是在参数绑定上去后再传入数据库服务器的**，上面的这段代码它在内部的执行方式是这样的：

```php
<?php
// $stmt = $pdo->prepare($sql); 
prepare sql from 'SELECT * FROM `users` WHERE `username` = ? AND `email` = ?' 

// $username = 'wynnezheng';
// $email = '********@qq.com';
// $stmt->bindParam(1, $username, PDO::PARAM_STR);
// $stmt->bindParam(2, $email, PDO::PARAM_STR);
set @username = 'wynnezheng'
set @email = '********@qq.com'

// $stmt->execute();
execute sql using @username, @email
?>
```

可以看到，PDO 的执行在 mysql 中其实是分步进行的，**因此 PDO 并没有办法去获取到绑定参数后完整的 SQL 语句**

当然还是有解决的调试方法的，就是**通过 mysql 日志来查看所有的数据库查询**，以下是在windows平台，通过 mysql 控制台来设置（也可以通过 mysql my.ini 配置文件来设置）：

{% highlight bash %}
# 查看日志情况
# show variables like '%general%';

# 开启日志
# SET GLOBAL general_log = 'On';

# 指定日志文件
# SET GLOBAL general_log_file = 'E:/my.log';
```

再执行一遍刚刚额查询，就可以在E:/my.log中看到以下的内容了：

{% highlight bash %}
160411 13:26:27     4 Connect   root@localhost on mall
            4 Query SELECT * FROM `users` WHERE `username` = 'wynnezheng' AND `email` = '********@qq.com'
            4 Quit
```
