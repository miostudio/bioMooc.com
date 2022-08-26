# 1.顺序结构

```
if(cond) expr
if(cond) cons.expr  else  alt.expr

for(var in seq) expr
while(cond) expr
repeat expr
break
next
```


R是一个表达式语言，它的语句就是函数或表达式，都有返回值。甚至赋值语句也要返回值，就是值本身，所以支持连续赋值：
```
> a = b = 100
> a
[1] 100
> b
[1] 100
```

顺序执行的语句可以使用 `{ }` 括起来，这个大语句的返回值就是最后一个子表达式的值。

```
> x = { a=1; b=2; c=a+b} 
> x
[1] 3
```

R语言默认是顺序执行的，除非遇到if、for、while等控制结构。






# 1.条件

## `if (expr_1) expr_2 else expr_3`

expr_1 是一个布尔值或运算结果是一个布尔值。可以使用 `AND (&), OR (|), or EQUAL (==)` 等。

```
# 只有 if
> x=1
> if( x>0 ){
   message("x is positive")
 }
x is positive


# if else 
x=0
if( x>0 ){
  message("x is positive")
}else{
  print("x is NOT positive")
}
# [1] "x is NOT positive"


# 有一个或多个 else if
x=85
if(x==100){
  print("A+")
}else if(x>=90){
  print("A")
}else if(x>=80){
  print("B")
}else if(x>=70){
  print("C")
}else if(x>=60){
  print("D")
}else{
  print("E")
}
# [1] "B"
```


注意if else的结构写法，有以下三种，除此之外，会不识别else。

注意: R中执行if else报错：unexpected 'else' in "else"，多半是缺少expr_2。
多行(包括注释)语句必须使用{}包裹，

```
结构  1： if ( 1>0 ) print("Code") else print("More code")   # 一行；
结构  2： if()  {xx} else  {yy}  
	或者 
	if(){
		xx
	}else{    #此处如果没有{}就只能写1个语句
		yy
	}
结构3: if else 可以嵌套
if (Condition) { # The condition must return TRUE or FALSE
    # Code
} else {
    # Code
    if(Condition 2) { # The condition must return TRUE or FALSE
        # Code
    } else {
        # More code
    }
} 
```




## `&& and ||`(首元素比较) V.S.  `& and |`(每个元素比较，返回向量)

```
# && 和 || 返回一个值，使用两个向量的第一个元素进行比较
> x=c(1,0,0)
> y=c(1,1,0)
> x && y 
[1] TRUE
> x || y
[1] TRUE


# & 和 | 返回布尔向量，逐个元素比较的结果
> x & y 
[1]  TRUE FALSE FALSE
> x | y
[1]  TRUE  TRUE FALSE
```






## if/else 的向量形式: ifelse(test, yes, no) 函数

`ifelse(vector_with_condition, value_if_TRUE, value_if_FALSE)`


```
# 可用于赋值语句中
> x=100
> xlabel = ifelse(x>0, "up", "non-up")
> xlabel
[1] "up"



# 也可用于分支语句
# 把小于0的元素改为0，其他元素不变
> x=c(-3:3); x
[1] -3 -2 -1  0  1  2  3
> y=ifelse(
   test = x>=0,
   yes= {x},
   no = {0}
)
> y
[1] 0 0 0 0 1 2 3
```

ifelse 函数也支持嵌套(R支持最多50层嵌套):
```
ifelse(vector_with_condition,
       ifelse(vector_with_condition_if_TRUE, value_if_TRUE, value_if_FALSE),
       ifelse(vector_with_condition_if_FALSE, value_if_TRUE, value_if_FALSE))
```








## switch(expr, list) 分支语句

R 的 switch 语句功能强大，使用得当能可以大大简化代码。

- 解释1:
	* switch(statment, list) #首先判断条件的不同而执行不同的分支语句。
	* 首先执行statment，其返回值范围为1到list的长度; 然后switch语句执行list中包含的某一行语句，并将结果返回。
- 解释2:
	* switch(expr, list) #其中，expr为表达式，其值或为一个整数值或为一个字符串；list为一个列表。
	*运行机理：若expr的计算结果为整数，且值在1~length(list)之间时，则switch()函数返回列表相应位置的值。若expr的值超出范围，则没有返回值（老版本的R中返回NULL）。
	* 若返回字符串，则找后面该名字的语句(语句块)执行。



例1: 第一个值是n，就执行后面第 (n+1) 个表达式，因为第一个表达式也占位。
```
xx=3
switch(xx,
       {print("A")},
       {print("B")},
       {print("C")})
# [1] "C"


#由switch(x)来选择执行那个函数
> switch(2, mean(1:10), rnorm(4))  #执行rnorm(4)
[1]  0.58635791 -0.64430894  0.05521177 -2.21971431
> switch(1, mean(1:10), rnorm(4))  #执行 mean(1:10)
[1] 5.5
```

例2: 如果第一个是字符串，则后面必须是带名字的list

```
# 例2: 如果第一个参数是字符串，则后面表达式也要指定名字
you.like = "fruit"
switch(you.like, drink="water", meat = "beef", fruit = "apple", vegetable="cabbage")
# [1] "apple"
```


例3: 嵌套进 for 循环中的switch()函数

```
for( i in c('b','a') ){
	rs=switch(i, a='apple',b='bag',c="cat")
	print(rs)
}
#[1] "bag"
#[1] "apple"
```

实例：不同的细胞周期，映射不同的颜色。类似python中的字典的效果。
```
col=RColorBrewer::brewer.pal(n = 5,name = "Set2")
phases=c( "G1S", "M", "G1S", "MG1", "G2M" ) #可能几千个
colors = sapply( 
  X=phases, 
  FUN=function(x){
    switch(x, G1S=col[1], S=col[2], G2M=col[3], M=col[4], MG1=col[5])
  });

> colors
      G1S         M       G1S       MG1       G2M 
"#66C2A5" "#E78AC3" "#66C2A5" "#A6D854" "#8DA0CB" 
```

- 以上还有更多其他实现方式，欢迎补充。



例4: 使用字符参数，指定绘图类型（字符串到函数的映射）

```
library(ggplot2)
g=ggplot(diamonds, aes(cut, log10(price/carat), fill=clarity))
#
plotType='boxplot' # 根据这个参数，决定绘图类型
g2 = g + switch(plotType,
                boxplot=geom_boxplot(),
                jitter=geom_jitter(),
                violin=geom_violin()
)
g2
```




实例1: (Seurat 4 R包的代码) 检查是否含有异常值，有了就警告
```
CheckMatrix.dMatrix = function(
  object,
  checks = c('infinite', 'logical', 'integer', 'na'),
  ...
) {
  checks = match.arg(arg = checks, several.ok = TRUE)
  x = slot(object = object, name = 'x')
  for (i in checks) {
    switch(
      EXPR = i,
      'infinite' = if (any(is.infinite(x = x))) { #有无穷大，就警告
        warning("Input matrix contains infinite values")
      },
      'logical' = if (any(is.logical(x = x))) { #有逻辑值，就警告
        warning("Input matrix contains logical values")
      },
      'integer' = if (!all(round(x = x) == x, na.rm = TRUE)) { #有非整数，就警告
        warning("Input matrix contains non-integer values")
      },
      'na' = if (anyNA(x = x)) { #有NA，就警告
        warning("Input matrix contains NA/NaN values")
      },
    )
  }
  return(invisible(x = NULL))
}
```



实例2: (Seurat4的NNHelper()内部函数) 根据 method 字符串，决定使用哪个函数计算细胞的最近邻？
```
  results = (
    switch(
      EXPR = method,
      # 不是默认方法
      "rann" = {
        args = args[intersect(x = names(x = args), y = names(x = formals(fun = nn2)))]
        do.call(what = 'nn2', args = args)
      },
      # 默认是"annoy"
      "annoy" = {
      	# 获取参数列表的名字(names())，和 求 NN的函数的参数名字求交集，然后获取这些参数及其值，见本文 3.9
        args = args[intersect(x = names(x = args), y = names(x = formals(fun = AnnoyNN)))]
        do.call(what = 'AnnoyNN', args = args) #调用 what 函数，使用args 参数列表
      },
      # 求最近邻的方法，目前只能二选一，否则报错
      stop("Invalid method. Please choose one of 'rann', 'annoy'")
    )
  )
```














# 2.循环

警告：在R中for循环使用频率远低于其在编译型语言中的频率。R的循环常常用向量化函数或apply家族函数代替。高频使用的限速步骤还可以写C/C++扩展实现。

## `for (name in expr_1) expr_2`

例1: 计算 1+2+...+100的值

```
> sum=0
> for(i in 1:100){
   sum = sum+i
 }
> sum
[1] 5050
```





例2: 画出3种类型的鸢尾花的花萼长宽散点图和拟合曲线

![for_scatter.png](images/control/for_scatter.png)
```
x=iris$Sepal.Length
y=iris$Sepal.Width
ind=iris$Species

xc = split(x, ind)
yc = split(y, ind)
cols=colors=c("firebrick1", "deepskyblue3", "goldenrod1", 
              "mediumpurple1", "orange3", "palegreen4")
res=96
png("scatter.png", width=4*res, height=4*res, res=res)
plot(NULL, 
     xlab="Sepal.Length",
     ylab="Sepal.Width",
     mgp=c(2,0.5,0),
     xlim=c(min(x), max(x)), 
     ylim=c(min(y), max(y)))
for (i in 1:length(yc)) {
  points(xc[[i]], yc[[i]], pch=19, col=cols[i])
  abline(lsfit(xc[[i]], yc[[i]]), lwd=3, lty=2, col=cols[i])
}
xy = par("usr");xy #x1,x2, y1,y2
legend(xy[1], xy[4]*1.09, 
       legend=names(yc), fill=cols,
       ncol=3,
       x.intersp=0.04, #图形和文字的距离
       text.width=0.9, #两个图例之间的距离
       xpd=T, bty="n", border = NA)
dev.off()
```








## while (condition) expr

例1：计算1+2+...+100的值 

```
> sum=0
> i=1
> while(i<=100){
   sum = sum + i;
   i = i+1;
 }
> sum
[1] 5050
```




## repeat expr

repeat{} 要在循环内部使用break跳出循环。我基本不用。

例1：计算1+2+...+100的值

```
sum=0;
i=1;
repeat{
  if(i<=100){
    sum = sum + i
    i=i+1;
  }else
    break;
}
sum
```



## break 和 next

- break 是跳出当前循环。
- next是立刻开始下一个循环迭代。当前循环内、next后的部分跳过。

```
例1: for循环，当i==3时停止循环(break)
for(i in c(1,2,3,4,5)){
  x=rnorm(i); #产生i个随机数(正态分布N(0,1))
  if(i==3)
    break;
  cat(i,":",x,"\n", sep="");#输出函数，各元素之间默认用空格分割
}

# 1:0.1057737
# 2:0.66613451.436698



例2: for循环，当i>3时立刻进行下一个循环迭代(next)
for(i in c(1,2,3,4,5)){
  x=rnorm(i); #产生i个随机数(正态分布N(0,1))
  if(i==3)
    next;
  cat(i,":",x,"\n", sep="");
}

#1:0.4242651
#2:0.79411531.645681
#4:0.8773362-0.05469944-0.35065220.158811
#5:-0.1806122-0.12995390.72298860.6389151-0.1392588
# 没有3的输出结果，因为到i==3时，走了next，循环内next后的语句不会执行，然后执行i=4的迭代。
```












# 参考资料

- https://cran.r-project.org/doc/manuals/R-intro.html#Loops-and-conditional-execution


