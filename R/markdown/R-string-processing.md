# R 字符串

R中最常使用的数据框的行名、列名都是字符串。

所以掌握R常见的字符串处理方法十分必要！

字符串、字符串向量是密不可分的。本文都会讲到。

```
> x="R lang"; x
[1] "R lang"
> class(x)
[1] "character"


> colnames(iris)
[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"  
> class(colnames(iris))
[1] "character"
```


```
nchar paste strsplit
tolower toupper casefold
chartr gsub sub
substr substring
grep grepl regexpr
```




# 获取长度

nchar() 是获取一个字符串有几个字符。

length() 则是获取一个向量有几个元素。

```
> x="hello"
> nchar(x) #这个字符串有5个字母
[1] 5

> length(x) #这个向量有1个字符串元素
[1] 1

> length( c("hi", "Tom") ) #该向量有2个元素
[1] 2
```




# 字符串合并















求长度、合并、拆分、替换、删除、取子字符串、大小写转换





# 参考资料

- https://www.runoob.com/r/r-string.html


- https://www.cnblogs.com/blueicely/archive/2013/03/18/2966556.html
- https://www.cnblogs.com/sakura-d/p/10938528.html
- http://t.zoukankan.com/speeding-p-4067846.html
- https://www.jianshu.com/p/2ddaa6d06008
- https://blog.csdn.net/weixin_44330955/article/details/110878817
- https://blog.csdn.net/qq_46040234/article/details/120960930


