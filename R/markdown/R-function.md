# R中的函数


* **John Chambers**: To understand computations in R, two slogans are helpful:
	- Everything that exists is an object.
	- Everything that happens is a function call.



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



R 函数类型
```
> typeof(sum)
[1] "builtin"  #内置函数

> typeof(`[`)
[1] "special"
```





## 内置数学函数

```
exp()
log() #自然对数为底，就是 ln(2.718291829)=1
log10()

sqrt()
abs()
sin()，cos() 等三角函数
min()，max()：向量的最小、最大值
which.min()，which.max()：向量的最小、最大元素的位置索引
pmin()，pmax()：多个向量逐元素对比
sum()，prod()
cumsum()，cumprod()
round()，floor()，ceiling()

factorial()：阶乘
```






## 保留n位小数、保留n位有效数字 

```
# 1. round, 保留4位小数，末尾是0的就没了
x1=round(12.345678, 4)
x1 #[1] 12.3457


# 2. sprintf, 返回字符串，最后一位是0也保留
x2=sprintf("%0.4f", 12.345006) #保留4位小数
x2  #[1] "12.3450"



# 3. 保留有效数字, 返回字符串，末尾是0不保留
x3=formatC(12.3456, digits = 4)
x3 #[1] "12.35"


# 4. 有效数字位数signif
x4= signif(0.0000000000133, 4)
# signif rounds the values in its first argument to the 
# specified number of significant digits.
x4 #[1] 1.33e-11
```

















# 自定义函数





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

- R函数的返回值可选，使用return则必须使用()。
- 否则默认返回最后一个表达式的值。所以最后 `return(result)` 也可以写成 `result` 。
- 这个函数只有一个参数n，也可以没有参数，也可以有多个参数。


```
#函数也可以不加{}
f1=function(x)x*2+3;
print( f1(2) )

#甚至这么写
f2=function(x)x
body(f2)=quote(x^3);#重新改写函数；
print( f2(3) )

#输入函数名，
page(nls) #查询函数代码；
edit(nls) #编辑函数代码；
# 由于一些基本函数是C编写的，不能用上述方法查看和修改。
```




## 定义二元操作符 `%anything%`

`+` 就是一个二元操作符，也是一个函数。

```
> `+`
function (e1, e2)  .Primitive("+") #Primitive 表示不是用R书写的，可能是C语言写的。确实需要2个参数

> 1+3
[1] 4

> `+`(1,3)
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
















## 不确定参数列表 dot-dot-dot: ‘…’

- 如果不确定会传入什么参数、几个参数时，则可以其使用三个点 `...` 代替。
- 不想为内涵数一一指定参数了，可以使用 ... 把参数从外函数传递给内涵数。
- 泛型函数定义中，使用 ... 表示根据数据类型使用合适的方法



比如paste()函数，他的作用是将一连串字符串连接起来，然后新建一个字符串或向量，所以无法预知参数个数：
```
> args(paste)
function (..., sep = " ", collapse = NULL) 
NULL
```

还有cat()函数，它的功能是和paste相似，也是连接字符串。
```
> args(cat)
function (..., file = "", sep = " ", fill = FALSE, labels = NULL, 
    append = FALSE) 
NULL
```


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



例3: 用到plot函数，但是其参数太多，不想一一复制时
```
myplot = function(x, y, type = "l", ...) {
    plot(x, y, type = type, ...)  ## Pass '...' to 'plot' function
}
```



注意：任何出现在...之后的参数列表必须明确的给出名称。而且不能够部分匹配或位置匹配。
```
比如，paste() 指定参数后，后面的分隔符sep参数必须使用完整形式，不能省略。
paste('a','b',sep=":") #"a:b"
paste('a','b',":") #"a b :" 不符合预期。
```













## 参数的验证

在函数内开始处理前，对参数进行验证，是一个好习惯。

我们不能相信用户的输入，要有必要的检查。


例1:如果不是指定的值，则退出

```
fn=function(keyword, ...){
	if( !(keyword %in% c('value1','value2')) ){
		stop("Error: keyword must in c('value1','value2')")
	}
	# ...
}
```


例2: 如果有参数不是NULL，则执行某段代码(missing 函数)

```
fn1=function(x, subset2=NULL){
  if( !missing(subset2)){
    print(subset2)
  }
}
> fn1()
> fn1(1, "xx")
[1] "xx"
```


















## 参数部分匹配

R函数支持参数部分匹配，要求前1个到多个字母必须对，且不能有歧义。
```
fn=function(apple, bag=10){
  return(apple+bag)
}
> fn(a=15)
[1] 25

> options(warnPartialMatchArgs = TRUE) #也可以打开警告，减少使用部分匹配。
> fn(a=15)
[1] 25
Warning message:
In fn(a = 15) : partial argument match of 'a' to 'apple'
```




### match.arg(arg = checks, several.ok = TRUE) 能自动补齐参数，第二个参数T则支持arg为向量

```
# 拿到部分匹配到的完整值
> match.arg(arg="d", choices=c("counts", "data", "scale.data"))
[1] "data"
```


实例: Seurat 4 由部分匹配获取完整字符串(match.arg 函数)

```
#' @rdname AssayData
#' @export
#' @method GetAssayData Assay
#'
#' @examples
#' # Get the data directly from an Assay object
#' GetAssayData(pbmc_small[["RNA"]], slot = "data")[1:5,1:5]
#'
GetAssayData.Assay = function(
  object,
  slot = c('data', 'scale.data', 'counts'),
  ...
) {
  CheckDots(...)
  slot = slot[1]
  slot = match.arg(arg = slot) #对参数 slot 做自动补齐
  return(slot(object = object, name = slot))
}
```


例: 只输入长字符串的开头几个字母，自动补齐其余部分，获取完整版参数。
```
fn1=function( checks = c('infinite', 'logical', 'integer', 'na'), flag=T){
  checks= match.arg(arg = checks, several.ok = flag)
  print(checks)
}

# several.ok 默认F，只支持一个参数匹配，不能是向量。
fn1(c("inf", "n"), F)  #报错'arg' must be of length 1
# 设置several.ok=T支持数组
fn1(c("inf", "n"), T) #"infinite" "na"

fn1(c("l")) #"logical"

# 如果输入有歧义，则无法自动补齐
fn1(c("in"), T) #Error: 'arg' should be one of “infinite”, “logical”, “integer”, “na”
fn1(c("int"), T) #[1] "integer"

fn1(flag=T) # 空白则匹配全部参数
# [1] "infinite" "logical"  "integer"  "na"
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












## 函数递归

就是函数调用自己。

```
# 累加
cumulate=function(n){
	if(n==1) return(1);
	return(n+cumulate(n-1))
}
cumulate(100);
[1] 5050

# 累乘(https://www.zhihu.com/question/43378587)
funr = function(x) {
  return(ifelse(x>1, x*funr(x-1), x))
}
funr(5)
[1] 120
```















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
















##  返回不可见的值(Invisible values)


```
> j03 <- function() 1
> j03()
# [1] 1


> j04 <- function() invisible(1)
> j04() #这个值不打印了，但是可以接收
> x=j04()
> x 
[1] 1


# 可以使用函数 withVisible 强制看结果
> str(withVisible(j04()))
List of 2
 $ value  : num 1
 $ visible: logi FALSE
```

最常见的返回不可见值的是赋值语句和ggplot2作图函数，你可以使用值接收，但是命令行不打印结果。

```
> x=10
> (x=10)
[1] 10


> library(ggplot2)
> ggplot(mtcars, aes(mpg, cyl))+geom_point()
> g1=ggplot(mtcars, aes(mpg, cyl))+geom_point()
> class(g1)
[1] "gg"     "ggplot"
```










## 函数退出处理(Exit handlers)

- `on.exit()` 指定在函数结束(退出时)处理的方法，不管函数是正常返回还是异常结束。
- 一定要使用 `add=T` 参数，否则前面的 on.exit 信息将会被覆盖。

```
j05 <- function() {
  stop("I'm an error")
  return(10)
}
j05() #函数执行到 stop 时，输出提示语，并立即结束执行。
# Error in j05(): I'm an error
```


```
j06 = function(x) {
  cat("Hello\n")
  on.exit(cat("Goodbye!\n"), add = TRUE)
  
  if (x) {
    return(10)
  } else {
    stop("Error")
  }
}

> j06(T)   # 我们看到，退出(return)前执行 on.exit，然后是返回值。
Hello
Goodbye!
[1] 10

> j06(F)   # 我们看到，退出(stop)后执行 on.exit。先报错，然后执行 on.exit，然后退出。
Hello
Error in j06(F) : Error
Goodbye!
```


特别适合一些需要清理的工作:

```
cleanup = function(dir, code) {
  old_dir = setwd(dir)
  on.exit(setwd(old_dir), add = TRUE)
  
  old_opt = options(stringsAsFactors = FALSE)
  on.exit(options(old_opt), add = TRUE)
}
```


配合 惰性求值，可以创建一个临时环境，运行一些代码，然后再恢复。

```
with_dir = function(dir, code) {
  old = setwd(dir)
  on.exit(setwd(old), add = TRUE)

  force(code)
}

getwd()
# [1] "/Users/runner/work/adv-r/adv-r"
with_dir("~", getwd())
# [1] "/Users/runner"



# 以及执行若干行代码
with_dir("~", {
  getwd()
  system("ls -lth | head")
})
```


多条on.exit的执行顺序:
```
# R3.4及之前版本，都是顺序执行的
j08 = function() {
  on.exit(message("a"), add = TRUE)
  on.exit(message("b"), add = TRUE)
}
j08()
# a
# b


# R3.5及以后可以通过 after 控制执行的顺序
j09 = function() {
  on.exit(message("a"), add = TRUE, after = FALSE)
  on.exit(message("b"), add = TRUE, after = FALSE)
}
j09()
# b
# a
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

R语言采用的是Lexical Scoping(词法作用域)。词法作用域，又称静态作用域，即变量定义后的作用域是不变的。

函数使用哪个变量，是先在它定义处查找，而不是它调用处。例子：在本页搜 "闭包"。

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



#2.函数fn2定义在父函数outer2内部
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

R 是支持类的定义的，包括S3和S4类。
关于 OOP 的概念，见本网站[R OOP专题](/R/R-OOP.html)。

- 同一个类，有不同的方法。
- 同一个函数，对不同的类有不同的定义。取决于对象的 class 属性。


- 要定义类的方法，要先定义该方法的泛型函数。
- 泛型函数是一个函数族，其中的每个函数都有相似的功能，但是适用于某个特定的类。



### 获取函数的源代码

- 直接在R console中敲函数 的名字，有些函数是可以直接显示所有代码，但是有些却不能。
- 对于那些不能的，使用函数 getAnywhere(函数名）可以返回这个函数的代码。
	* 对于同名函数，还需要使用[n]指定顺序编号，才能正确返回函数源代码:

```
> getAnywhere(add)[1]
function (x) 
{
    return(x + 7)
}
<bytecode: 0x8f948c0>
<environment: namespace:wjl007>
```



```
# 查看针对 数据框 数据类型的函数
> methods(class="data.frame")
 [1] [             [[            [[<-          [<-           $<-           aggregate    
 [7] anyDuplicated anyNA         as.data.frame as.list       as.matrix     by           
[13] cbind         coerce        dim           dimnames      dimnames<-    droplevels   
[19] duplicated    edit          format        formula       head          initialize   
[25] is.na         Math          merge         na.exclude    na.omit       Ops          
[31] plot          print         prompt        rbind         row.names     row.names<-  
[37] rowsum        show          slotsFromS3   split         split<-       stack        
[43] str           subset        summary       Summary       t             tail         
[49] transform     type.convert  unique        unstack       within        xtfrm        
see '?methods' for accessing help and source code


# plot 对不同类有不同的定义
> methods(plot)
 [1] plot.acf*           plot.data.frame*    plot.decomposed.ts* plot.default       
 [5] plot.dendrogram*    plot.density*       plot.ecdf           plot.factor*       
 [9] plot.formula*       plot.function       plot.hclust*        plot.histogram*    
[13] plot.HoltWinters*   plot.isoreg*        plot.lm*            plot.medpolish*    
[17] plot.mlm*           plot.ppr*           plot.prcomp*        plot.princomp*     
[21] plot.profile.nls*   plot.raster*        plot.spec*          plot.stepfun       
[25] plot.stl*           plot.table*         plot.ts             plot.tskernel*     
[29] plot.TukeyHSD*     
see '?methods' for accessing help and source code
```



很多泛型函数的函数体很短，可能只有一行。
```
> coef   # 看到 UseMethod 表示这是一个 S3 泛型函数
function (object, ...) 
UseMethod("coef")
<bytecode: 0x55719ff62f20>
<environment: namespace:stats>


> methods(coef) #查询该函数针对的类
[1] coef.aov*     coef.Arima*   coef.default* coef.listof*  coef.maov*    coef.nls*    
see '?methods' for accessing help and source code
```



### 查看 S3 形式的实现源码

```
> getAnywhere("coef.aov")
A single object matching ‘coef.aov’ was found
It was found in the following places
  registered S3 method for coef from namespace stats
  namespace:stats
with value

function (object, complete = FALSE, ...) 
{
    cf <- object$coefficients
    if (complete) 
        cf
    else cf[!is.na(cf)]
}
<bytecode: 0x5571a439cfd0>
<environment: namespace:stats>


> getS3method("coef", "aov")
function (object, complete = FALSE, ...) 
{
    cf <- object$coefficients
    if (complete) 
        cf
    else cf[!is.na(cf)]
}
<bytecode: 0x5571a439cfd0>
<environment: namespace:stats>



> `[[<-.data.frame` 
function (x, i, j, value) 
{
    if (!all(names(sys.call()) %in% c("", "value"))) 
...
```






### 查看 S4 形式的实现源码

```
> getMethod("[[<-", signature = "Seurat")
Method Definition:

function (x, i, j, ..., value) 
{
    x <- UpdateSlots(object = x)
...
```









### 定义S3形式的函数: `[[]]`,  `[]`, `print2`

我们先定义S3类 唐伯虎(Tangbohu)，然后才能定义该类的方法。

- 关于 S3 OOP 的概念，见本网站[R OOP专题](/R/R-OOP.html)。
- 定义S3类的方法，要先定义泛型方法，再定义具体实现。有些方法的泛型方法R已经已经定义过了，我们就可以直接定义具体实现。


```
#1. S3类就是一个普通的R数据类型，加上 class()=""属性
obj2=list( data= iris[1:3, ], stat=mtcars[1:2,], version=1 )
class(obj2)
class(obj2) = "Tangbohu"
class(obj2)

#2. 为该S3类定义一个print函数: x[[i,j]]=value
`[[<-.Tangbohu` = function(x, i, j, value){
  # 记录数据类型，清空class属性
  oldClass=class(x)
  class(x)=""
  #
  df1=x[['data']];
  df1[i,j]=value;
  x[['data']]=df1
  # 添加回 class 属性
  class(x)=oldClass;
  x
}
# 测试
obj2[[1,2]]=1005
obj2


#3. 再定义一个 S3 方法: x[i,j]=value
`[<-.Tangbohu` = function(x, i, j, value){
  # 记录数据类型，清空class属性
  oldClass=class(x)
  class(x)=""
  #
  df1=x[['stat']];
  df1[i,j]=value;
  x[['stat']]=df1
  # 添加回 class 属性
  class(x)=oldClass;
  x
}
obj2[2,1]=16880

> obj2 #注意到2处修改，data[1,2] 被修改了，stat[2,1]被修改了
$data
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1      1005.0          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa

$stat
                mpg cyl disp  hp drat    wt  qsec vs am gear carb
Mazda RX4        21   6  160 110  3.9 2.620 16.46  0  1    4    4
Mazda RX4 Wag 16880   6  160 110  3.9 2.875 17.02  0  1    4    4

$version
[1] 1

attr(,"class")
[1] "Tangbohu"



#4. 再定义一个全新的打印函数，模仿 `print.data.frame`
print2=function(x){     #定义泛型函数。如果是 print 等已经定义过泛型函数的，则要省略本步骤。
	UseMethod("print2")
}

# 对该类的实现
`print2.Tangbohu` = function(x){
  message( paste0("S3 class:", class(x)), ", ",
       paste0("slots:", paste( names(x), collapse = ", " ) ))
  for(i in 1:length(x)){
    tmp=x[[i]]
    if(class(tmp) %in% c("data.frame", "matrix") )
      message( paste("  ", names(x)[i], ":", nrow(tmp), ncol(tmp)  ) )
    else if( class(tmp) %in% c("character", "numeric")  )
      message( paste("  ", names(x)[i], ":", length(tmp)  ) )
  }
  invisible(x)
}
> print2(obj2)
S3 class:Tangbohu, slots:data, stat, version
   data : 3 5
   stat : 2 11
   version : 1
```








### 定义S4形式的函数: `[[]]`,  `[]`, `print2`

我们先定义S4类 吴道子(Wudaozi)，然后才能定义该类的方法。

- 关于 S4 OOP 的概念，见本网站[R OOP专题](/R/R-OOP.html)。
- 定义S4类的方法，要先定义泛型方法，再定义具体实现。有些方法的泛型方法R已经已经定义过了，我们就可以直接定义具体实现。

```
#1. 定义S4类
setClass(
  "Wudaozi",
  slots=c(
    data="data.frame",
    stat="data.frame",
    version="character"
  )
)

# 创建该类的实例

obj4=new("Wudaozi",
  data=iris[1:3, ],
  stat=mtcars[1:2,],
  version="2"
)
class(obj4) #[1] "Wudaozi"
isS4(obj4) #T



#2. 为该S4类定义一个函数: x[[i,j]]=value
# 模仿 getMethod("[[<-", signature = "Seurat")

setMethod(
  f="[[<-",
  signature = "Wudaozi",
  definition = function(x, i,j, ..., value){
    x@data[i,j]=value
    x
  }
)

# 测试
obj4[[1,2]]=1500
obj4



#3. 再定义一个 S4 方法: x[i,j]=value
setMethod(
  f="[<-",
  signature = "Wudaozi",
  definition = function(x, i,j, ..., value){
    #用复杂写法
    df1=slot(x, "stat")
    df1[i,j]=value
    slot(x, "stat") = df1;

    #x@stat[i,j]=value
    x
  }
)
# 测试
obj4[2,1]=16880

> obj4 #注意到2处修改，data[1,2] 被修改了，stat[2,1]被修改了
An object of class "Wudaozi"
Slot "data":
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1      1500.0          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa

Slot "stat":
  mpg cyl disp  hp drat    wt  qsec vs am gear carb
Mazda RX4        21   6  160 110  3.9 2.620 16.46  0  1    4    4
Mazda RX4 Wag 16880   6  160 110  3.9 2.875 17.02  0  1    4    4

Slot "version":
  [1] "2"




#4. 再定义一个全新的打印函数，模仿 `print.data.frame`
setGeneric("print2", function(x) standardGeneric("print2"))
#如果已经定义过泛型函数的 print, show, 则要省略这一步骤

setMethod(
  f="print2",
  signature = "Wudaozi",
  definition = function(x) {
    arr_names = slotNames(x)
    message( paste0("S4 class:", class(x)), ", ",
             paste0("slots:", paste( arr_names, collapse = ", " ) ))
    #
    for(i in 1:length(arr_names)){
      tmp=slot(x, arr_names[i])
      if(class(tmp) %in% c("data.frame", "matrix") )
        message( paste("  ", arr_names[i], "dim:", nrow(tmp), ncol(tmp)  ) )
      else if( class(tmp) %in% c("character", "numeric")  )
        message( paste("  ", arr_names[i], "length:", length(tmp)  ) )
    }
    invisible(x)
  }
)

> print2(obj4)
S4 class:Wudaozi, slots:data, stat, version
   data dim: 3 5
   stat dim: 2 11
   version length: 1
```







## 惰性求值(lazy evaluation) //todo

就是只在不得不用的时候调用，否则就一直拖着。

```
# 这个函数调用后，x值一直没用到，所以一直没报错。
h01 = function(x) {
  10
}
h01(stop("This is an error!"))
#> [1] 10


h02 = function(x) {
  x
}
> h02(stop("This is an error!"))
Error in h02(stop("This is an error!")) : This is an error!

> h02(stop("This is an error!", call.=F)) #进报错，不说哪个语句
Error: This is an error!
```




### promise //todo




















# 高阶函数

参数是函数的函数，叫高阶函数。

Common Higher-Order Functions in Functional Programming Languages
```
Reduce(f, x, init, right = FALSE, accumulate = FALSE)
Filter(f, x)
Find(f, x, right = FALSE, nomatch = NULL)
Map(f, ...)
Negate(f)
Position(f, x, right = FALSE, nomatch = NA_integer_)
```





## Filter(f, x) 把f函数应用到数组x上，结果是TRUE的返回x上原来位置上的元素

```
# 返回偶数
> Filter(f=function(x){x%%2==0}, 1:10)
[1]  2  4  6  8 10


# 数据框本质是 列list。按列输入，返回是数字的列
> Filter(function(x) is.numeric(x), head(iris, n=2))
  Sepal.Length Sepal.Width Petal.Length Petal.Width
1          5.1         3.5          1.4         0.2
2          4.9         3.0          1.4         0.2
```

















## do.call(what, args,) 用参数 args(list 类型) 调用函数 what 

`do.call(what, args, quote = FALSE, envir = parent.frame())`

- what可以是一个函数也可以是一个 字符串形式的函数名称(eg. kmeans or ‘kmeans’). 
- args 供函数调用的参数设置，这些参数都将被 what 识别并调用. 
- quote 逻辑值, 是否引用参数. 
- envir 评估函数调用时所处的环境. 对于what是字符串形式函数名称且对应的参数都是符号或者引用的表达式时会非常有用.


do.call() 就是普通函数调用的等价形式，只是把调用函数名和参数列表分开定义了。
```
# 例1: 求均值
> mean(1:4)
[1] 2.5

# 把args这个list的元素当作mean的参数
> do.call(what=mean, args = list(1:4) )
[1] 2.5

> do.call(what="mean", args = list(1:4) ) #函数名是字符串也可以
[1] 2.5



# 例2: 对数组求和，忽略NA值(2个参数)
> x2=c(1:5, NA); x2
[1]  1  2  3  4  5 NA
> sum(x2) #NA
[1] NA
> sum(x2, na.rm=T) #15
[1] 15


# 使用 do.call() 的等价写法
> do.call(sum, list(x2))
[1] NA
> do.call(sum, list(x2, na.rm=T))
[1] 15
```

那么，do.call() 的优势是什么呢？



例3: 传入不确定的参数

```
# 给生成随机数的函数传递参数
> do.call(runif,list(n=10))

# 如果想传入更多参数呢？已经把部分参数写成list形式了，可以使用c()拼接list。
> params = list(min=10, max=20)
> do.call(runif, list(n=10, min=10, max=20)) # works

> do.call(runif, list(n=10, params)) # doesn't work
> do.call(runif, c(n=10, params)) # work


封装成函数，貌似过度包装了。还是看下一个例子吧。
getRunif0100=function(n=1, params=list()){
  do.call(runif, c(n=n, min=0, max=100, params))
}

> getRunif0100(3)
[1] 11.28247 90.50525 34.29226



# Hadley 大神给出一个案例: 执行未知个数的参数的函数。相当于给出调用函数的新形式。
# https://adv-r.hadley.nz/quasiquotation.html
library(rlang)
exec = function(f, ..., .env = caller_env()) {
  args = list(...)
  do.call(f, args, envir = .env)
}

> exec(sum, x=3, y=4, z=5)
[1] 12

> exec(sum, arr=c(1,2,3, NA), na.rm=T )
[1] 6
```







### do.call() 优势案例

案例欣赏1: 使用list()单独设置函数的参数列表，然后再用do.call("pheatmap", hm.parameters )的形式执行。

```
# 摘抄自其他人的代码，来源忘了
plotCycle = function  ( phaseCorsMatrix ) {
    library("pheatmap")
    library("RColorBrewer")
    breaks = seq ( -1 , 1 , length.out = 31 )
    heatColors = rev (brewer.pal ( 9, 'RdBu'))
    heatColors =colorRampPalette(heatColors)
    colorPallete = heatColors((length ( breaks ) - 1 ))
    
    # create heatmap
    hm.parameters = list(phaseCorsMatrix,
    color = colorPallete,
    breaks = breaks,
    cellwidth = NA, cellheight = NA, scale = "none",
    treeheight_row = 50,
    kmeans_k = NA,
    show_rownames = T, show_colnames = F,
    main = "",
    clustering_method = "average",
    cluster_rows = FALSE, cluster_cols = FALSE,
    clustering_distance_rows = "euclidean",
    clustering_distance_cols = NA ,
    legend = T , annotation_legend = F )
    
    do.call("pheatmap", hm.parameters ) #前面创建参数列表，最后使用 do.call 把参数传给调用函数。
}
```




案例2: 合并list中的n个相同字段名的数据框，n不确定。

```
#1.创建包含5个不同行的 数据框 的list。 create a list containing 5 data.frames of different rows
allframes=lapply(1:5, function(x){
  data.frame(
    key=paste0("name", x),
    value=1:x
  )
})
allframes
sapply(allframes, nrow) #[1] 1 2 3 4 5

# 1)如何合并该list中5个数据框呢？
rbind(allframes) #not work
lapply(allframes, rbind) #not work

rbind(allframes[[1]], allframes[[2]], allframes[[3]], allframes[[4]], allframes[[5]] ) #ok

# 2)如果list中数据框个数n是会变动的呢？
answer=NULL;
for(i in 1:length(allframes)){
  answer=rbind(answer, allframes[[i]])
}
answer
# 这个代码完美实现了“按行合并list中的n个数据框，且n可变”。
# 我认为已经很好了，直到我遇到了 do.call

# 3) 更精简的
do.call(rbind, allframes)

# 4) Reduce 也能解决本问题，不过它不能接收更多参数
Reduce(rbind, allframes)
```




> do.call / lapply 组合: 分类-处理-合并结果，一行搞定。

The use of the do.call / lapply combination is a powerful way to leverage functional programming in R. In short, you write a function that performs some actions and apply it to a list of inputs, which can then be fed into a function that combines everything into a single object.


* do.call() 的第二个参数需要是list，正好lapply返回一个list
	- lapply(df, function(x){}) return a list;
	- do.call(rbind, list)

例3: 鸢尾花各类指标的均值

```
# 1)method1: 使用apply家族函数 sapply + apply
> sapply(
     X=split(iris[,1:4], iris[,5]), 
     FUN=function(x){
         colMeans(x)
     } )
#             setosa versicolor virginica
#Sepal.Length  5.006      5.936     6.588
#Sepal.Width   3.428      2.770     2.974
#Petal.Length  1.462      4.260     5.552
#Petal.Width   0.246      1.326     2.026

# 等价形式。
> sapply( split(iris[,1:4], iris[,5]), function(x){
  apply(x, 2, mean)
} )




# 2)method2: 使用 do.call + lapply实现
do.call(rbind, lapply( split(iris[,1:4], iris[,5]), function(x){
  colMeans(x)
}))
#           Sepal.Length Sepal.Width Petal.Length Petal.Width
#setosa            5.006       3.428        1.462       0.246
#versicolor        5.936       2.770        4.260       1.326
#virginica         6.588       2.974        5.552       2.026

# 如果第一个参数不同，使用行合并(cbind)
> do.call(what=cbind, 
        args = lapply(
          X=split(iris[,1:4], iris[,5]), 
          FUN=function(x){
            colMeans(x)
          } )
)
#             setosa versicolor virginica
#Sepal.Length  5.006      5.936     6.588
#Sepal.Width   3.428      2.770     2.974
#Petal.Length  1.462      4.260     5.552
#Petal.Width   0.246      1.326     2.026
```


































## magrittr包中的 %>% 管道符号

看看R的管道符怎么定义的:
```
> `%>%`
function (lhs, rhs) 
{
    lhs <- substitute(lhs)
    rhs <- substitute(rhs)
    kind <- 1L
    env <- parent.frame()
    lazy <- TRUE
    .External2(magrittr_pipe)
}
<bytecode: 0x563b3e36e458>
<environment: namespace:magrittr>
```

到.External2()这一步看不懂了，放弃。


- 多个参数依赖调用，大概有3种实现方式：
	* 嵌套式: `f( g(x) )`
	* 中间变量式: `y=g(x); f(y)`
	* 使用管道: `x %>% g() %>% f()`

重点学习R管道符怎么用吧。就是把前一个结果作为后一个函数的第一个参数。

- `x %>% f() is equivalent to f(x)`
- `x %>% f(y) is equivalent to f(x, y)`

```
> library(magrittr)
> iris %>% dim() #等价于 dim(iris)
[1] 150   5


# 用于数据框的筛选
> subset(mtcars, gear==5 & carb==2) #一般形式
               mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2 26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa  30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2

> mtcars %>% subset(gear==5 & carb==2) #管道形式
               mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2 26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa  30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2

> mtcars %>% 
   subset(gear==5 & carb==2) %>%     #管道形式支持连写
   dim()
# [1]  2 11
```




## 求积分 第一个参数是函数

```
> integrate(sin, 0, pi/2)
1 with absolute error < 1.1e-14


#第一个参数也可以是自定义匿名函数
> integrate(function(x){sin(x)}, 0, pi/2)
1 with absolute error < 1.1e-14
```






















# 元编程 - 操纵函数

元编程，就是编写能生成R代码的代码。元编程的操作对象是R表达式，包括对函数的增添修改等动态操作。


## 查看一个函数的形参列表和函数体

函数本身也是是对象，可以查看其形参部分和函数体。

- 一个R函数由三个部分组成：
	* 函数体 body()，即要函数定义内部要执行的代码；
	* 形参列表 formals()，即函数的形式参数表以及可能存在的缺省值；
	* environment()，是函数定义时所处的环境， 这会影响到参数表中缺省值与函数体中非局部变量的的查找。

```
> add =function(x,y=0){ x+y} #自定义函数
> add(1,2)
[1] 3

> environment(add)
<environment: R_GlobalEnv>

> body(add)
{
    x + y
}

> formals(add)
$x


$y
[1] 0
```

注意，函数名并不是函数对象的必要组成部分。比如匿名函数就没有函数名。









## 修改函数的形参列表 alist()

R提供了一个非常方便的函数alist用来构建参数列表。我们可以像定义函数一样很简单地指定参数列表。

```
> f = function(x, y=1, z=-2) { x + y + z}
> formals(f) = alist(x=, y=100, z=200)
> args(f)
function (x, y = 100, z = 200) 
NULL
> f
function (x, y = 100, z = 200) 
{
    x + y + z
}
```









# 参考资料

- https://cran.r-project.org/doc/manuals/R-intro.html#Writing-your-own-functions
- https://cran.r-project.org/doc/manuals/R-intro.html#Object-orientation
- https://adv-r.hadley.nz/functions.html#function-forms

