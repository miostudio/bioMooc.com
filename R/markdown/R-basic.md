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













# R帮助

```
> help("print") #显示print函数的帮助文档
> ?print #同上

> example("print") #Run an Examples Section from the Online Help
```


















# 输入与输出 (I/O)

## print() 输出到控制台

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

- print() 只能接受一个参数，如果要输出两个变量的值
	* 则需要使用两次print
	* 或者把两个变量连接成一个字符串，再print输出

```
> print("a", "b") #报错

> print( paste("a", "b") ) #先拼接成一个字符串，再输出。默认使用空格分隔符
[1] "a b"

> print( paste("a", "b", sep=", ") ) #使用sep 指定分隔符，隔开多个(字符串)参数
[1] "a, b"
```



使用C语言风格的 sprintf() 格式化字符串 / 拼接多个字符串、数字：
```
> print( sprintf("%s--%s", "a", "b") ) 
[1] "a--b"
```



对于向量，可使用 collapse= 分割后拼接成一个字符串：
```
> print( paste(colnames(iris), collapse=", ") )  # 使用 collapse 隔开一个参数(向量)的多个元素
[1] "Sepal.Length, Sepal.Width, Petal.Length, Petal.Width, Species"
```







## message()/warning() 输出调试信息

```
> message("nrow:", nrow(iris)) #多个输出之间没有分隔符
nrow:150

> warning( "nrow:", nrow(iris) ) #多个输出之间没有分隔符
Warning message:
nrow:150 


# 可自定义输出换行符 "\n"，制表符"\t", 空格 " "等
> message( "nrow:","\t", nrow(iris) )
nrow:	150


# 对于长消息，可以结尾添加换行符号 \，注意是空格加反斜杠，反斜杠后面不能有任何字符。
> message("==>> This is the function called when loading this pkg. \
           Very suit to load .so file here.")
==>> This is the function called when loading this pkg. 
          Very suit to load .so file here.
```




Seurat 4 R包源码中的用法:
```
# 函数 NBResiduals 中
message(sprintf('glm.nb failed for gene %s; falling back to scale(log(y+1))', gene))


# 函数 Seurat:::Parenting

> warning("Nothing to parent", immediate. = TRUE, 
                call. = FALSE) #立刻给出提醒
```









## cat() 输出到控制台、文件(file=参数)

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





## sink() 适合输出报告

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



## source() 从文件载入R代码

Read R Code from a File, a Connection or Expressions
常用于从文件中载入R脚本，一般是自己的函数库。

例: 在文件中写一个R计算平均值的函数，通过 source() 载入该文件。
```
$ cat my_functions.R
average = function(x){
  return( sum(x)/length(x) )
}


$ R
> ls()
character(0)
> source("my_functions.R") #从文件中载入R代码

> ls()
[1] "average"
> class(average) #确实是一个函数
[1] "function"

> average(c(1,2,3,4,5)) #使用该函数
[1] 3 
```






## pdf() 保存图片到文件

保存图片的系列函数，常用的是 pdf(), 其次是 png()，svg().


- pdf 是矢量图，体积小，可以任意缩放，方便后续修改。建议使用
- 为了防止 Illustrator 调整时不变形，建议绘图时添加 useDingbats=F 选项。
```
pdf("scatter.pdf", width=3.5, height=4, useDingbats=F)
plot(mtcars$mpg, mtcars$disp, xlab="mpg", ylab="disp", pch=19, col="purple")
dev.off()
```



- png是位图，放大就模糊，适合最后的输出。
```
res = 96 #设置分辨率
png("scatter.png", width=3.5*res, height=4*res, res=res)
plot(mtcars$mpg, mtcars$disp, xlab="mpg", ylab="disp", pch=19, col="purple")
dev.off()
```






- svg 也是矢量图，不过是XML存文本描述的所有绘图细节，体积最大。
```
svg("scatter.svg", width=3.5, height=4)
plot(mtcars$mpg, mtcars$disp, xlab="mpg", ylab="disp", pch=19, col="purple")
dev.off()
```









# 工作目录与全局变量

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


获取 全局环境中的变量，并删除
```
> a=1
> ls() #全局空间中的变量名
[1] "a"

> rm('a') #删除某变量
> a  #已经找不到了
Error: object 'a' not found

> rm( list=ls()) #删除当前全局空间的全部变量
```







# 全局变量

```
> 1/7
[1] 0.1428571   # 显示7位小数
> options("digits") #默认是显示7位小数
$digits
[1] 7

> options("digits"=10) #设置为10位小数
> 1/7
[1] 0.1428571429 #显示10位小数
```


全局变量是一个列表，可以像普通list一样查看、添加、修改:

```
> class(options())
[1] "list"

> names(options()) #查看全局变量全部key
 [1] "add.smooth"                 "askpass"                    "asksecret"                 
 [4] "bitmapType"                 "browser"                    "browserNLdisabled"         
 [7] "buildtools.check"           "buildtools.with"            "CBoundsCheck"  
 ...

# 添加全局变量
> options("xx.xx2"=3)

# 使用全局变量
> options("xx.xx2") #返回的list
$xx.xx2
[1] 3

> options()[["xx.xx2"]] #返回key对应的value
[1] 3
```
