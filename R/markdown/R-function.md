# R中的函数

R自带很多函数。其中，使用R语言编写的函数(mean(), var(), postscript())和用户自定义的没有本质区别。

```
> class(mean)
[1] "function"


# 任何R语句都是函数调用，包括赋值语句(前面说过，赋值语句返回值是值本身，所以支持连续赋值)：
> 1:5
[1] 1 2 3 4 5
> mean( 1:5 )
[1] 3
```







## 函数的定义 `name = function(arg_1, arg_2, …) expression`

函数是一组表达式，使用参数 `arg_1, arg_2, …` 带入到表达式计算结果，然后返回一个值。

例1: 定义一个函数，计算1+2+...+n的值

```
sumTo = function(n){
  result=0;
  for(i in 1:n){
    result = result+i;
  }
  return(result)
}
sumTo(100)
# [1] 5050
```

- R 函数默认返回最后一个表达式的值。所以最后 `return(result)` 也可以写成 `result` 。
- 这个函数只有一个参数n，也可以没有参数，也可以有多个参数。







## 定义二元操作符 `%anything%`

`+` 就是一个二元操作符，也是一个函数。

```
> `+`
function (e1, e2)  .Primitive("+") #Primitive 表示不是用R书写的，可能是C语言写的。确实需要2个参数

> 1+3
[1] 4
> ?`+`
```

- R支持自定义二元操作符，形式 `%anything%`。
- 其实，点乘`%*%`、外积 `%o%` 也是这么定义的。

```
# 定义自己的二元操作符，计算 n+(n+1)+...+m 的值
`%addTo%` = function(n, m){ #注意：定义时要加单引号、双引号或反引号
  if(n>m){
    stop("Error: n shoud be smaller than m" )
  }
  result=0
  for(i in n:m){
    result=result+i;
  }
  return(result);
}

# 测试
> 1 %addTo% 100
[1] 5050

> 5 %addTo% 7
[1] 18

> 8 %addTo% 7
Error in 8 %addTo% 7 : Error: n shoud be smaller than m
```






## 命名参数与默认值

### 命名参数 Named arguments 

- 函数调用时，一般要按照函数定义时的顺序传入参数。
	* 如果调用函数时使用 `name=object` 形式，则可以任意顺序。

例: 乘方函数

```
pow =function(x, p){
  if(p<0 | x<0)
    stop("x and p should be >=0")
  rs=1
  if(p==0) 
    return(rs); #0次方为1
  for(i in 1:p){
    rs = rs * x;
  }
  rs #默认返回最后一个表达式的值
}

> pow(3, 0)
[1] 1
> pow(3, 3)
[1] 27

> pow(2, 10)
[1] 1024
> pow(10, 2) #默认参数顺序
[1] 100
> pow(p=10, x=2) #调用时指定参数名字
[1] 1024
```


### 参数默认值 defaults 

R 中很多函数都有默认值，如果调用时没有指定这些参数，则使用其默认值。

- 有默认值的参数只能放最后。也就是说一旦一个参数设置默认值，其后面的参数也都要有默认值。这在R中只是一种约定，不报错，但是遵守它能减少犯错。


```
> head(formals(plot.default)) #比如常用的 plot() 的type默认就是"p"
$x


$y
NULL

$type
[1] "p"

$xlim
NULL

$ylim
NULL

$log
[1] ""

# 调用
> plot(iris$Sepal.Length) #使用 type 的默认值
> plot(iris$Sepal.Length, type="o") #明确指定type的值
```






例2: 自定义向量自增函数，并设置自增默认值是1

```
increase=function(x, inc=1){
  x+inc
}

> increase(c(1,2,5))
[1] 2 3 6
> increase(c(1,2,5), inc=20)
[1] 21 22 25
```






## 不确定参数列表 ‘…’

如果不确定会传入什么参数，则可以其使用三个点 `...` 代替。


例1: 给向量递增，同时默认画图的函数。可以通过最后的 ... 传递参数给绘图设置 par()
```
do.add = function(arr, inc=1, graph=TRUE, ...){
  rs= arr+inc;
  if(graph){
    par(...)
    plot(rs)
  }
  return(rs)
}
x=1:5
do.add(x, inc=1e3, bg="deeppink")
do.add(x, bg="lightblue")
do.add(x, graph=F, bg="grey") #不画图
```

例2: 还可以在函数内获取`...`列表

```
# 累加所有数字元素的和
addAll=function(value, ...){
  lst=list(...) #获取未知参数，封装到list
  for(i in 1:length(lst)){ #遍历list长度
    arr=lst[[i]]          #获取每个子元素
    if(is.numeric(arr)){  #如果是数字，就求和
      value = value+ sum(arr)
    }
  }
  return(value)
}
# 
rs=addAll(10, x=1:3,  y=c('a', 'b'), z=c(2.5,3.8) ); rs
# [1] 22.3
```





## 函数内赋值

函数内是局部作用域，函数内的赋值不影响外部全局变量。

例1: 函数内定义的变量，函数外无法访问。
```
> x #函数外没有定义该变量
Error: object 'x' not found

> fn1=function(){
   x=10
   message("in fn1: x=", x) #函数内定义了，函数内可以访问
 }
> fn1()
in fn1: x=10

> x
Error: object 'x' not found #调用函数后，函数外还是无法访问该变量
```



例2: 函数内赋值，不影响函数外的变量的值

```
> x=2  #函数外 x=2

> fn1=function(){
   message("in fn1: x=", x) #函数内，赋值前x=2
   x=10
   message("in fn1: x=", x) #函数内，赋值后x=10
 }
> fn1()
in fn1: x=2
in fn1: x=10

> x     #函数外，x还是=2
[1] 2
```

想要影响外部全局空间的变量，可以使用 超级赋值符 (superassignment) `<<-` 或 函数 `assign()` 


例3: 函数内对函数外赋值

```
> x=1
> fn2=function(){
   message("in fn1: x=", x) 
   x <<- 100; 
   message("in fn1: x=", x)
 }
> x
[1] 1         #调用函数前，x=1
> fn2()      #调用函数，函数内使用超级赋值符
in fn1: x=1 
in fn1: x=100
> x      #函数外x=100
[1] 100
```


方法2: 使用 assign() 函数。
```
> x=1
> fn3=function(){
+   message("in fn1: x=", x) 
+   assign("x", 200, envir = .GlobalEnv)
+   message("in fn1: x=", x)
+ }
> x
[1] 1
> fn3()
in fn1: x=1
in fn1: x=200
> x
[1] 200
```




## R允许函数嵌套

也就是可以函数内再定义函数。

```
> add3=function(x,y,z){
  add2=function(a,b){
    return(a+b)
  }
  add2(add2(x,y), z)
}

> add3(1,2,3)
[1] 6

> add2(1,2)
Error in add2(1, 2) : could not find function "add2"
```

add3() 函数内定义了 add2() 函数，子函数只能在函数内使用。






## 传入函数或者返回函数

函数是R的一级公民，什么都能做。

例1: 传入函数名作为参数

```
# 传入2个数字(x,y)和操作符op
process=function(x,y, op){
  op(x,y)
}
add = function(a, b){
  return(a + b)
}
multiply = function(a, b){
  return(a * b)
}

> process(c(1,2,3), c(10,20,30), add) #第三个参数是函数名
[1] 11 22 33
> process(c(1,2,3), c(10,20,30), multiply) #第三个参数是函数名
[1] 10 40 90
```


例2: 需要某个范围内等间距的数字向量，向量长度不确定。

```
# 三个参数 from, to, len。
# 第一个函数限定[from, to]范围，返回函数。
# 第二个函数，提供向量长度，返回具体数字向量
getSeq=function(from, to){
  return(function(len){ #返回一个函数: 这里是匿名函数
    step=(to-from)/(len-1)
    result=numeric(len) #定义并初始化向量
    for(i in 1:len){
      result[i] = from;
      from = from +step;
    }
    return(result)
  })
}
> seq1_10=getSeq(1,10) #限定1-10之间，返回的是一个函数

> seq1_10(10) #需要10个元素
 [1]  1  2  3  4  5  6  7  8  9 10
> seq1_10(5)  #需要5个元素
[1]  1.00  3.25  5.50  7.75 10.00
> seq1_10(3) #需要2个元素
[1]  1.0  5.5 10.0
> seq1_10(4)
[1]  1  4  7 10
```









## 匿名函数

没有名字的函数，就叫匿名函数。上文我们已经用过几次了，apply内的函数，函数返回的函数。

匿名函数没有名字，所以只能用一次。（返回的函数，如果有变量接收则可以重复利用）。


例1: 使用apply家族函数计算每种鸢尾花4项指标的均值。

```
> sapply( 
  X = split(iris[,1:4], iris[,5]), 
  FUN = function(x){
    colMeans(x)
  } )

#              setosa versicolor virginica
#Sepal.Length  5.006      5.936     6.588
#Sepal.Width   3.428      2.770     2.974
#Petal.Length  1.462      4.260     5.552
#Petal.Width   0.246      1.326     2.026
```


例2: 返回的匿名函数。

```
# 根据n的正负号，返回一个函数。
getFn=function(n){
  return( ifelse(n>=0, function(a, b){
    return(a + b)
  }, function(a, b){
    return(a - b)
  }) )
}

> x=c(1,2,3)
> y=c(10,20,30)

> getFn(1)(x, y)
[1] 11 22 33
> getFn(-5)(x, y)
[1]  -9 -18 -27
```






### 立即执行函数 `( function(){} )()`

立即执行函数的概念来自js，在js中有2种形式，在R中只有一种形式能工作。

- 立即执行函数适用于需要全局环境，但是又不想污染全局环境的情况(不使用超级赋值符和assgin函数的情况下)。
- 比如获取Seurat对象的中间值，并绘图或返回，但是除了返回值没有任何副作用。
- 立即执行函数内部要使用 print() 等显式输出，否则只输出返回值。

```
# 基本结构就是
# step1, 写2对圆括号: ()()
# step2, 在第1对圆括号内写匿名函数 function(){}
# step3, 在匿名函数体内随意写语句。
# step4, 光标移动到函数首尾两行，执行。
```


例1: 在立即执行函数内查看、修改全局变量，不影响全局变量本身。

```
> x=iris[1:3,] #取前3行
> (function(){
  # 立即执行函数内不会污染全局变量
  print(dim(x))
  y=x[,1:2]
  x=y      #不影响外部的x
  print(x)
})()
[1] 3 5 
  Sepal.Length Sepal.Width  #函数内输出的x只有2列
1          5.1         3.5
2          4.9         3.0
3          4.7         3.2
> x                         #函数外的x不受影响
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
> y    #函数内定义的局部变量，函数结束就销毁了。
Error: object 'y' not found
```


例2: 立即执行函数可以传参

```
# 计算1+2+...+100的和
> (function(x){
   s=0;
   while(x>0){
     s=s+x
     x=x-1
   }
   return(s)
 })(100)
# [1] 5050
```


例3: 立即执行函数的返回值也可以使用变量接收。

```
# 求偶数的平方和
x=1:10
y=(function(){
  x=x[x%%2==0] #取偶数
  result=sum(x**2)
})()

> y   #返回值
[1] 220
> x  #不影响全局变量x
 [1]  1  2  3  4  5  6  7  8  9 10
> result  #没有添加全局变量
Error: object 'result' not found
```

- 除了返回值，没有任何副作用。







实例: 单细胞分析中，临时取子集并统计、绘图。

```
# 使用立即执行函数获取CD4表达水平超过众数的细胞
(function(){
  tmp=FetchData(pbmc, vars=c("CD4", "CD8A", "seurat_clusters"))
  print(head(tmp))
  hist(tmp$CD4, n=100, ylim=c(0,50))
  #
  tmp=subset(pbmc, subset= CD4>1.5)
  print(tmp)
  DimPlot(tmp, label=T)
})()
```













## 作用域 Scope

R 使用词法作用域。函数内的变量先看是不是参数，如果不是，则在函数调用处查找，这叫 词法作用域(lexical scope)

```
> n=3
> cube = function(n) {
  sq = function() n*n
  n*sq()
}

> cube(2)
[1] 8
```





### 闭包 Closures

闭包也是js的概念，不过在R中也成立。

R中被返回的函数，能访问它定义时的上下文环境，而不是调用时的上下文。

```
#1. 函数fn定义在父函数outer外部
x=1:5
fn=function(){
  print(x)
}
fn() #[1] 1 2 3 4 5

outer=function(){
  x=10
  return(fn)
}
fn1=outer()
fn1() #返回的函数访问的x是定义fn处的 1:5
# [1] 1 2 3 4 5



# 2.函数fn2定义在父函数outer2内部
outer2=function(){
  x=10
  fn_in=function(){
    print(x)
  }
  return(fn_in)
}

fn2=outer2()
fn2() #返回的函数访问的x是定义fn_in处的 10
# [1] 10
```

上文第二种情况，函数定义在父函数内部并被返回，则它还能访问父函数内定义的其他变量，这就叫闭包。

> JS 对闭包的定义: A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment ). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time. 



例2: 定义一个只有某个函数能访问和修改的变量。

```
# 外函数返回一个list，里面包含2个函数，可以访问和修改name，其他方式无法修改这个name变量。
outer=function(){
  bookTitle="biomooc";
  return(list(
    get=function(){return(bookTitle)},
    set=function(newName){ bookTitle <<- newName;} #这里必须使用 超级赋值符才能修改该函数上一层空间的值
  ))
}

> book=outer() #外函数返回一个列表对象，其成员是2个函数
> book$get()
[1] "biomooc"
> book$set("Tom") #设置值
> book$get() #获取值
[1] "Tom"



# 其实，还可以通过环境名字修改bookTitle的值。
> environment(book$get) #获取环境对象
<environment: 0x55f6fad55470>
> ls(envir = environment(book$get)) #查看该环境内的成员
[1] "bookTitle"
> assign('bookTitle', 'HarryPoter', envir = environment(book$get)) #修改该环境中的成员
> book$get() #获取值
[1] "HarryPoter"
```





## 类、泛型函数与面向对象(Classes, generic functions and object orientation)

同一个函数，对不同的类有不同的定义。取决于对象的 class 属性。



- https://cran.r-project.org/doc/manuals/R-intro.html#Object-orientation
















# 参考资料

- https://cran.r-project.org/doc/manuals/R-intro.html#Writing-your-own-functions


