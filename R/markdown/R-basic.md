# 变量

R 语言的有效的变量名称由字母，数字以及点号 . 或下划线 _ 组成。

变量名称以字母或点开头。

- 合法的变量名: a1, .a1, a1_, gene.use, expr_log, geneExpression, msg102548, .a.3
- 不合法的变量名: 
	* 1a(不能数字开头)
	* _a1(不能下划线开头)
	* a-2(只能是数字、字母、点号、下划线)
	* .2a(.开头的不能紧跟数字)








# 变量赋值

最新版本的 R 语言的赋值可以使用左箭头 `<-`、等号 `=` 、右箭头 `->` 赋值:

```
> gene.exp = c(1,2.2,4) #推荐。多种编程语言通用
> gene.exp
[1] 1.0 2.2 4.0


> gene.symbol <- c("TP53", "CCNE2"); gene.symbol
[1] "TP53"  "CCNE2"


> 1:4 -> arr1; arr1
[1] 1 2 3 4
```










# 注释

R 只支持单行注释，就是一行中，#号后面的都是注释。

```
# 这是注释
a1=3; #这是一行注释
```

不过可以有变相的多行注释:

```
if(0){
  "
  这里都执行不了
  "
  执行不到的地方，怎么写都行。
  算是多行注释了。
}
```









# 运行方式

## 交互式

就是输入一行/一段，执行一行/一段。然后继续输入，继续输出。

我们只需要在命令行中执行 R 命令就可以进入交互式的编程窗口：

```
$ R 
> a1 = 1
> a2 = 2
> a1 + a2
[1] 3
```

交互式命令可以通过输入 q() 来退出：

```
> q()
Save workspace image? [y/n/c]: y
```


## 脚本式

把R代码放到一个文件中，后缀名为`.R`。

```
$ vim test1.R
a1=1
a2=2
a3 = a1+a2

print( sprintf("a1 + a2 = %d", a3) )
```


接下来我们在命令行窗口使用 Rscript 来执行该脚本：

```
$ Rscript test1.R 
[1] "a1 + a2 = 3"
```










# 输入与输出 I/O

## print()

```
> dim(iris)  #在交互式环境中，print可由可无。
[1] 150   5


> print( dim(iris) ) #但是脚本式运行时，比如有print才会打印结果
[1] 150   5


> print( head(iris, n=2) )
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
```

print() 只能接受一个参数，如果要输出两个变量的值，则需要使用两次print，或者把两个变量连接成一个字符串，再print输出。

```
> print("a", "b") #报错

> print( paste("a", "b") ) #先拼接成一个字符串，再输出
[1] "a b"
```






## cat()

```
> cat("dim(iris):", dim(iris)) #默认输出到控制台，元素之间默认用空白连接
dim(iris): 150 5

> cat("a", "b","\n", "c") #加入换行符 "\n"
a b 
 c

> cat("a", "b", sep='') #使用sep指定连接符号
ab
```


输出到文件
```
> cat("big", file="test/output.cat.txt") #指定file=表示输出到文件，文件内容: big
> cat("big", "small" file="test/output.cat.txt") #默认覆盖写入文件，文件内容: big small
> cat("\n", 10, 5, "\n" file="test/output.cat.txt", append=T) #append=T表示追加方式写入。
```





## sink() 

sink() 函数可以把控制台输出的文字直接输出到文件中去。

```
> sink("dustbin/output.sink.txt") #开始输出到文件
> print("output:") #输出到文件
> cat("p value=", 0.003) #输出到文件

> message("Error", ":", "can not be -1, set 0 now"); #不输出到文件
Error:can not be -1, set 0 now
> warning("this ", "is", " a warnig msg") #不输出到文件
Warning message:
this is a warnig msg 

> sink(); #结束输出



查看文件内容
$ cat dustbin/output.sink.txt 
[1] "output:"
p value= 0.003
```

还可以同时输出到文件和控制台:

```
sink("dustbin/output.sink.txt", split=TRUE)  # 控制台同样输出
for (i in 1:5)
  print(i)
sink()   # 取消输出到文件

sink("dustbin/output.sink.txt", append=TRUE) # 控制台不输出，追加写入文件
print("good")
sink()
```

文件内容
```
$ cat dustbin/output.sink.txt 
[1] 1
[1] 2
[1] 3
[1] 4
[1] 5
[1] "good"
```

控制台输出:
```
[1] 1
[1] 2
[1] 3
[1] 4
[1] 5
```







# 工作目录 

```
> setwd("/home/wangjl/data/bams/") #设定工作目录
> getwd()  #获取当前工作目录
[1] "/data/wangjl/bams"
```

两者不同，是因为我做了软链接，getwd() 返回的是实际目录。

```
$ ls -lth ~/data
lrwxrwxrwx 1 wangjl wangjl 12 Nov 12  2020 /home/wangjl/data -> /data/wangjl
```

