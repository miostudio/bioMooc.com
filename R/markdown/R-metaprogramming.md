# 什么是元编程?


问题：我想让"iris"这个字符串变为变量名，表示同名数据框。使用元编程可解决。

```
> df2=eval(parse(text="iris"))
> dim(df2)
[1] 150   5
> df2 |> head()
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
4          4.6         3.1          1.5         0.2  setosa
5          5.0         3.6          1.4         0.2  setosa
6          5.4         3.9          1.7         0.4  setosa
```


(1) 多种定义

Metaprogramming in general just means programs that manipulate programs. 
Metaprogramming refers to a variety of ways a program has knowledge of itself or can manipulate itself.
Metaprogramming is just programming, but it's basically "writing code that writes code".
Metaprogramming refers to code that reads and modifies other code.
Metaprogramming is writing code that writes code.


元编程的操作对象是代码。code as data。
元编程一言以蔽之，就是用代码生成（操纵）代码。
如果编程的本质是抽象，那么元编程就是更高层次的抽象。
一般代码的操作对象是数据，元编程操作的对象是其他代码。


(2) Metaprograms 包括几个方面

Parsers /
Domain specific languages (DSLs) /
Embedded domain specific languages (EDSLs) /
Compilers /
Interpreters /
Term rewriters /
Theorem provers


R 语言元编程的主要内容:

**What You'll Learn**

* Find out about the anatomy of a function in R 
* Look inside a function call
* Work with R expressions and environments
* Manipulate expressions in R
* Use substitutions 


(3) 缺点 

Every powerful method comes with a hidden cost.

会导致性能降低。


(4) 参考资料
- [very good] 官方文档 https://cran.r-project.org/doc/manuals/R-lang.html#Computing-on-the-language
- 书籍 [《Metaprogramming in R》](https://www.programmer-books.com/wp-content/uploads/2019/05/Metaprogramming-in-R.pdf), 配套的[Github](https://github.com/Apress/metaprogramming-in-r)







## 环境 environment //todo

一个函数总是运行在某个环境中的。怎么获取、比较、修改环境？

// todo


## assign("key", val): 字符串 转 变量并赋值

Assign a value to a name in an environment.

`assign(x, value, pos = -1, envir = as.environment(pos), inherits = FALSE, immediate = TRUE)`

例1: 
```
for(i in 1:6) { # Create objects  'r1', 'r2', ... 'r6'
    nam = paste("r", i, sep = "")
    assign(nam, 1:i)
}
> ls(pattern = "^r\\d$")
[1] "r1" "r2" "r3" "r4" "r5" "r6"
```

assign函数赋值，第一个参数是变量名的字符串；第二个则是我们需要赋值的具体对象（可以是数字、字符等任意对象）。















# 原生R中 操作表达式: 获取并修改R表达式的语法树

R 中的元编程，主要是操作表达式、操作函数、操作环境等。

- 调用类型 (call) 实质上是一个可修改的 list，可用 quote() 包围表达式生成，调用 eval() 执行求的计算结果。
- 调用类型（call()）这个东西，其实是一个list，如果不执行，就是一个相当于list的东西，如果执行，将会返回一个值。如果想让它执行，就用eval()，一般eval() 里面都有quote之类的函数，来保证里面的函数是表达式。
- 另外，因为call类型有list的属性，那么用as.list() 和as.call() 之间可以相互转换。比如list转换成了call，然后在eval() 执行。

```
> a1=list(`*`, 5, 10)
> a2=as.call(a1)
> a2
.Primitive("*")(5, 10)

> eval(a2)
[1] 50
```


## 几个函数的关系

> 表达式的几个状态：
表达式字面量(就是R中的多数语句) --> 未经eval的表达式(expression类型) --> 表达式字符串(string or character) or 计算结果

![pic](/R/images/meta/fn_names.png)

(1) 表达式字面量 -> 未经eval的表达式 
substitute()
quote()

(2) 未经eval的表达式 -> 求值 
eval() 

(3) 未经eval的表达式 -> 表达式字符串
deparse()

(4) 表达式字符串 -> 未经eval的表达式
parse()

(5) 生成 未经eval的表达式 
call()
expression()












## 相关的类: expression, language(call, name) 
```
> getClass("expression")
Class "expression" [package "methods"]

No Slots, prototype of class "expression"

Extends: "vector"


> getClass("call")
Class "call" [package "methods"]

No Slots, prototype of class "call"

Extends: "language"


> getClass("language")
Virtual Class "language" [package "methods"]

No Slots, prototype of class "name"

Known Subclasses: 
Class "name", directly
Class "call", directly
Class "{", directly
Class "if", directly
Class "<-", directly
Class "for", directly
Class "while", directly
Class "repeat", directly
Class "(", directly
Class ".name", by class "name", distance 2, with explicit coerce


> getClass("name")
Class "name" [package "methods"]

No Slots, prototype of class "name"

Extends: "language", "refObject"

Known Subclasses: 
Class ".name", directly, with explicit coerce
```

- 在R语言中，“表达式”的概念有狭义和广义两种意义。
  * 狭义的表达式指表达式（expression）类对象，由expression函数产生；
  * 而广义的的表达式既包含expression类，也包含R language类。
- expression 和 language 是R语言中两种特殊数据类。
  * 可以看到 expression 类由向量 vector 派生得到的。
  * language 类是虚拟类，它包括我们熟悉的 程序控制关键词/符号和 name、call 子类。











## expression(expr): R语句 to Unevaluated Expressions

把参数看成表达式，返回expression类型的对象。expression类型和list类型类似，是个容器，每个成员可能是call，symbol（name）和constants中的一种。

```
> x1 <- expression(3 - 5) #R 语句 转为 expression
> x1
expression(3 - 5) 
> class(x1)
[1] "expression"
> typeof(x1)
[1] "expression"

> eval(x1) #可以对 expression 类求值
[1] -2
```


展开成list:
```
> class(x1)
[1] "expression"
> as.list(x1)
[[1]]
3 - 5

> class(x1[[1]]) #expression 的子元素是 "call"类型
[1] "call"

> as.list(x1[[1]])
[[1]]
`-`

[[2]]
[1] 3

[[3]]
[1] 5


> as.list(x1[[1]])[[1]] 
`-`
> class(as.list(x1[[1]])[[1]]) #"call"的子元素1是 "name"类型
[1] "name"

> as.list(x1[[1]])[[2]] 
[1] 3
> class(as.list(x1[[1]])[[2]]) #"call"的子元素2是 "numeric"类型
[1] "numeric"
```


例2: 可以按list修改，修改后可以继续执行
```
> x1 <- expression(3 - 5)
> x1
expression(3 - 5)
> eval(x1) #求值
[1] -2
> x1[[1]] [[1]]
`-`

> x1[[1]] [[1]]=`+` #运算符改成+号
> x1
expression(.Primitive("+")(3, 5))
> eval(x1) #求值
[1] 8

```


例3: 若有多个成员，eval每个成员都会求值一遍，但是只返回最后一个成员eval之后的值，这与绝大多数编程语言(比如C语言)多个表达式语句（逗号隔开）返回的结果类似。

```
> ex3 <- expression(u, 2, u + 0:9)
> ex3
expression(u, 2, u + 0:9)
> sapply(ex3, mode)
[1] "name"    "numeric" "call"   
> sapply(ex3, class)
[1] "name"    "numeric" "call"   
> sapply(ex3, typeof)
[1] "symbol"   "double"   "language"

> as.list(ex3)
[[1]]
u

[[2]]
[1] 2

[[3]]
u + 0:9

> as.vector(ex3)
expression(u, 2, u + 0:9)

> length(ex3)
[1] 3



求值之前不关心变量是否定义过
> sapply(ex3, eval)
Error in FUN(X[[i]], ...) : object 'u' not found
> u=0
> sapply(ex3, eval)
[[1]]
[1] 0

[[2]]
[1] 2

[[3]]
 [1] 0 1 2 3 4 5 6 7 8 9

> eval(ex3) #对整个expression求值，只返回最后一个表达式的值
 [1] 0 1 2 3 4 5 6 7 8 9
```


确实依次求值了: //todo 特例，特别注意！`=`和`<-`行为不一致
```
> x=1; eval(expression(x<-2, x>1))  #这里使用<-会修改全局变量的值，而使用=则不会
[1] TRUE
> x
[1] 2

> x=1; eval(expression(x=2, x>1)) #使用=则不修改全局变量的值
[1] FALSE
> x
[1] 1
```










## parse(text=character): string to Unevaluated Expression

是deparse的逆函数，把 表达式字符串 解析成为 未eval的expression。

- parse(text="") 是deparse的逆函数，把字符串转为语法树。
- 注意: 第一个参数是 file 一般不用，所以必须指定参数名 text=。


例1: 字符串转为 未求值的表达式
```
> x2="3-5"
> x2
[1] "3-5"
> class(x2)
[1] "character"
> class(parse(text=x2)) #string 转为 expression
[1] "expression"
```

例2: 对"字符串"求值
```
> parse(text = "10 - 2 * 5") #字符串先转为 表达式
expression(10 - 2 * 5)
> eval(parse(text = "10 - 2 * 5")) #再对表达式求值
[1] 0


> ex <- parse(text = "local({a <- 10; a+1})"); ex
expression(local({a <- 10; a+1}))
> eval(ex) #返回最后一个表达式的值
[1] 11


> eval( parse(text="apply(iris[,1:4], 2,mean)") )
Sepal.Length  Sepal.Width Petal.Length  Petal.Width 
    5.843333     3.057333     3.758000     1.199333 
```












## deparse(expression): 未eval的expression to string

deparse把 没有eval的表达式 转换成 字符串。

例1: expression 对象还原成原始字符串时，前面带有 "expression("

```
> x3=expression(2**3)
> x3
expression(2^3)
> class(x3)     #expression 类
[1] "expression"

> rs=deparse(x3) #转为 string
> class(rs)
[1] "character"
> rs
[1] "expression(2^3)"  #注意：这个string和最开始的string已经不一样了，但计算结果不变
```



例2: 解析 local() 字符串，并执行
```
> ex = parse(text = "local({a = 10; a+1})"); ex
expression(local({a = 10; a+1}))
> deparse(ex)
[1] "structure(expression(local({"                                          
[2] "    a = 10"                                                            
[3] "    a + 1"                                                             
[4] "})), srcfile = <environment>, wholeSrcref = structure(c(1L, 0L, "      
[5] "2L, 0L, 0L, 0L, 1L, 2L), srcfile = <environment>, class = \"srcref\"))"
> deparse(ex[1])
[1] "expression(local({" "    a = 10"         "    a + 1"          "}))"               
> deparse(ex[[1]])
[1] "local({"    "    a = 10" "    a + 1"  "})"

执行 
> parse(text=deparse(ex[[1]]))
expression(local({
    a = 10
    a + 1
}))
> eval(parse(text=deparse(ex[[1]])))
[1] 11
> eval(ex)
[1] 11
```



例3: quote生成的"call"表达式，基本能被 deparse 还原为字符串
```
> deparse(quote(x <- 1))
[1] "x <- 1"

> deparse( quote(2**3) ) #quote()还原为字符串
[1] "2^3"

> deparse( expression(2**3) ) #expression()还原为字符串-不推荐
[1] "expression(2^3)"


> as.character(expression(2**3)) #expression()还原为字符串-推荐
[1] "2^3"
> class(as.character(expression(2**3)))
[1] "character"
```

R的 parser和 deparser都不能完美可逆。

可以把命令放到文本文件中，逐行读取(readLines)并用R执行(parse)。



例4: 定义x、y轴的label为变量名本身
```
myplot=function(x, y){
  plot(x,y,
       xlab=paste0("xx_",deparse(substitute(x))),
       ylab=deparse(substitute(y))
  )
}
myplot(iris$Sepal.Length, iris$Sepal.Width) #这样 xlab 就是 "xx_iris$Sepal.Length"
plot(iris$Sepal.Length, iris$Sepal.Width) #默认的plot的 xlab 是 "iris$Sepal.Length"
```


例5: 函数变字符串

```
> class(args(lm))
[1] "function"

> args(lm)
function (formula, data, subset, weights, na.action, method = "qr", 
    model = TRUE, x = FALSE, y = FALSE, qr = TRUE, singular.ok = TRUE, 
    contrasts = NULL, offset, ...) 
NULL

> deparse(args(lm))
[1] "function (formula, data, subset, weights, na.action, method = \"qr\", " 
[2] "    model = TRUE, x = FALSE, y = FALSE, qr = TRUE, singular.ok = TRUE, "
[3] "    contrasts = NULL, offset, ...) " 
[4] "NULL"
> deparse(args(lm), width.cutoff = 500)
[1] "function (formula, data, subset, weights, na.action, method = \"qr\", model = TRUE, x = FALSE, y = FALSE, qr = TRUE, singular.ok = TRUE, contrasts = NULL, offset, ...) "
[2] "NULL"    
```















## eval(expr, envir, enclos): 在指定环境中执行 捕获的 未求值表达式(Unevaluated Expression)

Evaluate an R expression in a specified environment.

对expr进行计算，默认是当前环境（也就是eval的parent.frame)。

其中 envir是代码中变量名的首要查找位置，envir中查找不到的变量名会在enclos中查找。


可以直接对R表达式字面量求值
```
> a=1
> eval(a+1,envir = globalenv())
[1] 2
> eval(a+1)
[1] 2
```


例1: 对捕获的 expression 求值
```
> x1 <- expression(3 - 5)  #R 语句 转为 expression
> x1
expression(3 - 5) 
> class(x1)
[1] "expression"

> eval(x1) #求值
[1] -2
```


例2: 对 字符串 求值，要先用 parse 把 字符串 转为 expression，再用 eval 对 expression 求值.
```
> x2="3-5"
> x2
[1] "3-5"
> class(x2)
[1] "character"
> class(parse(text=x2)) #string 转为 expression
[1] "expression"

> eval(parse(text=x2)) #再求值
[1] -2
```



例3: 在指定环境中求值

如果envir是list/data.frame，enclos 参数默认增加当前环境，作为expr计算在list/data.frame之外寻找对象定义的闭包。

```
> b=-2
> y1=expression(a+b)
> y1
expression(a + b)

> eval(y1, list(a=10, b=20)) #求值时，参数2提供2个值
[1] 30
> eval(y1, list(a=10))  #求值时，参数2只提供一个值，另一个从当前环境中查找
[1] 8
```



例4: 如果指定的环境是一个多行数据框

数据框也是一个list，每一列是对应list的一项键值对。

```
> df1=data.frame(x=1:3, y=c(1,20,300))
> df1
  x   y
1 1   1
2 2  20
3 3 300
> lst2=as.list(df1)
> lst2
$x
[1] 1 2 3

$y
[1]   1  20 300

> eval( quote(x+y), df1) #求值是对数据框的每一行求值
[1]   2  22 303

> eval( quote(x+y), lst2) #求值是对list的每一个位置下标求值
[1]   2  22 303
```






例5: 指定数据框作为环境，执行某个表达式筛选该数据框

在环境 mtcars 下，求表达式 gear>4 的值
```
> eval( quote(gear>4), mtcars)
[1] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
[19] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE  TRUE FALSE
```

可以使用该列的值过滤 mtcars 的行：
```
> mtcars[eval( quote(gear>4), mtcars), ]
                mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2  26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa   30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2
Ford Pantera L 15.8   8 351.0 264 4.22 3.170 14.5  0  1    5    4
Ferrari Dino   19.7   6 145.0 175 3.62 2.770 15.5  0  1    5    6
Maserati Bora  15.0   8 301.0 335 3.54 3.570 14.6  0  1    5    8
```








### evalq(expr, envir, enclos): evalq 等价于 eval(quote(expr), ...)

The evalq form is equivalent to eval(quote(expr), ...). 

`eval evaluates its first argument in the current scope before passing it to the evaluator: evalq avoids this.`

```
> a = 3 ; aa = 4 ; evalq(evalq(a+b+aa, list(a = 1)), list(b = 5)) # == 10
> a = 3 ; aa = 4 ; evalq(evalq(a+b+aa, -1), list(b = 5))        # == 12

> eval( eval(a+b+aa, list(a = 1)), list(b = 5)) # == 10
Error in eval(a + b + aa, list(a = 1)) : object 'b' not found #执行外层函数时，先读参数1求值，发现找不到b

> eval( quote( eval(a+b+aa, list(a = 1)) ), list(b = 5)) #参数1先捕获(也算求值)，然后再求值
[1] 12

分成两步如下: 
> t1=quote( eval(a+b+aa, list(a = 1)) ); t1
eval(a + b + aa, list(a = 1))
> class(t1)
[1] "call"
> eval(t1, list(b=5))
[1] 12
```






### eval.parent(expr, n = 1): 等价于 eval(expr, parent.frame(n)).

```
ev = function() {
   e1 = parent.frame()
   print(e1);
   print(ls(e1))
   
   ## Evaluate a in e1
   aa = eval(expression(a), e1) #环境e1中a的值，e1是上一个函数的作用域
   
   ## evaluate the expression bound to a in e1
   a = expression(x+y) #x+y 未求值表达式
   list(aa = aa, eval = eval(a, e1)) #在e1作用域中求值
}
tst.ev = function(a = 7) { 
  print( environment() );
  x = pi; y = 1; ev() 
}
> tst.ev()
<environment: 0x55c36748cde8>
<environment: 0x55c36748cde8>
[1] "a" "x" "y"
$aa
[1] 7

$eval
[1] 4.141593
```




### local(expr, envir = new.env()): 在执行环境中执行函数

local 函数会在一个本地环境中执行代码。
等同于 evalq, 除了 loval 默认会创建一个新的空白环境。
local evaluates an expression in a local environment. It is equivalent to evalq except that its default argument creates a new, empty environment. 

因为环境中的变量在外面不可见，所以适合创建匿名递归函数，和作为一个限制的命名空间。(可以有效的舍弃运算过程中产生的中间变量，返回最后一行。)
This is useful to create anonymous recursive functions and as a kind of limited namespace feature since variables defined in the environment are not visible from the outside.


例1: 简单示例，就类似一个函数。
RStudio的Run as Local作业就是这么实现的：参数2是可以是当前环境或新环境(默认)。
```
rs=local({
  a = 1:3;
  b = a
}, envir = new.env())
> rs
[1] 1 2 3

> a #可见，a变量不在调用环境中，只在loal({}) 的花括号内。
Error: object 'a' not found
> b
Error: object 'b' not found
```




例2: 递归函数版本，两个函数互相递归
```
# Mutually recursive.
# gg gets value of last assignment, an anonymous version of f.

gg = local({
    k = function(y)f(y)
    f = function(x) if(x) x*k(x-1) else 1
})

> gg(10)
[1] 3628800

> sapply(1:5, gg)
[1]   1   2   6  24 120
```



例3: 嵌套的 local() 函数，a 变量是只有k函数可以访问的私有存储
```
# Nesting locals: a is private storage accessible to k
gg2 = local({
    k = local({
        a = 1
        function(y){
			print(a <<- a+1); #向上一层环境写入值。a每次调用增加1
			f(y)
		}
    })
    f = function(x) { 
		if(x) 
			x*k(x-1) 
		else 1
	}
})

> sapply(1:5, gg2)
[1] 2
[1] 3
[1] 4
[1] 5
[1] 6
[1] 7
[1] 8
[1] 9
[1] 10
[1] 11
[1] 12
[1] 13
[1] 14
[1] 15
[1] 16
[1]   1   2   6  24 120

> ls( envir = environment(gg2) )
[1] "f" "k"

> ls( envir = environment( get("k", envir = environment(gg2)) ) )
[1] "a"
```














## 捕获代码 quote(expr): R语句 to 'call'(language 的子类)

quote(expr) 简单地返回"call"对象，对expr没有进行eval。和substitute相比，没有替换。

把R语句转为 call 类型后，就可以直接按照list操作该R语句了。

```
> x4=quote(2+20)
> x4
2 + 20
> c(class(x4), typeof(x4), mode(x4))
[1] "call"     "language" "call"  

> eval(x4) #求值
[1] 22

> deparse(x4) #变字符串
[1] "2 + 20"
> class(deparse(x4))
[1] "character"
```


例1: 比较 quote() 和 enquote() 的区别。
- quote(expr)函数捕获未执行的代码。
- enquote(cl)捕获代码的运行结果, cl为call对象。

```
> eval(quote(1:9 + 2))
[1]  3  4  5  6  7  8  9 10 11
> enquote(1:9 + 2)
base::quote(c(3, 4, 5, 6, 7, 8, 9, 10, 11))
> eval(enquote(1:9 + 2))
[1]  3  4  5  6  7  8  9 10 11
```



subtitute/quote返回class/type根据表达式的不同而不同。表达式被解析为抽象语法树，可以访问其中每一个组成，还可以对返回的对象进行修改，即自己构造语法树（meta-programming）。


例2: 替换运算符/函数
```
> x4=quote(2+20)
> as.list(x4)
[[1]]
`+`

[[2]]
[1] 2

[[3]]
[1] 20

> x4[[1]]
`+`
> x4[[1]]=`*` #替换符号
> x4
.Primitive("*")(2, 20)
> eval(x4)  #按新的符号重新计算
[1] 40


> quote(2*20) #而直接构建，则是这样的。
2 * 20
```




例3: 在R中，`+-*/`都是函数，所以下面的写法是等价的
```
> quote(`+`(2,20) )
2 + 20
> quote(2+20)
2 + 20

> identical( quote(`+`(2,20)), quote(2+20))
[1] TRUE
```




例4: 展开函数调用语句，并修改传入的参数
```
> e3 <- quote(plot(x = age, y = weight))
> e3
plot(x = age, y = weight)
> as.list(e3)
[[1]]
plot

$x
age

$y
weight


> e3$x
age
> e3$y
weight

尝试画图
> class(e3$x)
[1] "name"
> 
> age=iris$Sepal.Length
> weight=iris$Sepal.Width
> eval(e3) #注意x和y坐标轴label是"age"和"weight"


修改一个参数
> weight2=iris$Petal.Length
> e3$y=as.name("weight2")
> e3
plot(x = age, y = weight2) #已经被修改
> eval(e3) #注意x和y坐标轴label是"age"和"weight2"
```


例5: 对于简单对象，数字和字符串等，quote后不变。
```
> quote(10)
[1] 10
> class(quote(10))
[1] "numeric"


> quote("sum")
[1] "sum"
> class(quote("sum"))
[1] "character"
```









## call(name, ...): string to 'call'(language 的子类)

构造一个没有eval的函数调用(function call)。第一个参数必须是函数名的字符串形式，后面是该函数的参数。

```
> x5=call("+", 2, 20) #使用call构建函数调用，第一个是函数名(可以是函数名字符串)，后面是参数
> x5
2 + 20
> class(x5)
[1] "call"
> typeof(x5)
[1] "language"

> eval(x5) #求值：执行该"call"对象
[1] 22

> deparse(x5) #转为字符串
[1] "2 + 20"
> class(deparse(x5))
[1] "character"
```


例2: 参数1也可以是自定义函数名

```
> myAdd=function(x,y) x+y;
> call(myAdd, 10, 20) #参数1必须是字符串，该函数是否定义都行。
Error in call(myAdd, 10, 20) : first argument must be a character string

> y5=call("myAdd", 10, 20)
> y5
myAdd(10, 20)
> class(y5)
[1] "call"

> eval(y5) #求值
[1] 30
```


例3：参数也可以是quote()捕获的表达式。

```
> call("+", 2+2, x)
Error: object 'x' not found

> e1 = call("+", 2+2, quote(x))
> e1
4 + x

> eval(e1, list(x=11)) #求值
[1] 15
```


例4: 获取语法树

```
> my_call=call("sum", quote(x2), na.rm=T)
> my_call
sum(x2, na.rm = TRUE)
> c(class(my_call), typeof(my_call)) #查看类型
[1] "call"     "language"

> (cl_list <- as.list(my_call)) #转为list类型
[[1]]
sum

[[2]]
x2

$na.rm
[1] TRUE


> c(class(cl_list), typeof(cl_list)) #查看类型
[1] "list" "list"


还可以再转为 call 类型
> as.call(cl_list)
sum(x2, na.rm = TRUE)
> x2=1:5; eval(as.call(cl_list))
[1] 15


还可以通过修改 mode()方式转为 call 类型:
> mode(cl_list) <- "call"
> c(class(cl_list), typeof(cl_list))
[1] "call"     "language"
> class(cl_list)
[1] "call"
> cl_list
sum(x2, na.rm = TRUE)
```







## do.call(what, args) 使用args参数调用what 命令 

do.call(what, args, quote = FALSE, envir = parent.frame()) 命令则是直接在envir中用参数args执行 what 命令。

do.call constructs and executes a function call from a name or a function and a list of arguments to be passed to it.

```
> c2=call("sum", quote(1:n), na.rm=T)
> c2
sum(1:n, na.rm = TRUE)
> class(c2)
[1] "call"

#新建一个环境
> e1=new.env()
> e1$n=100
> e1
<environment: 0x55c364291630>
> ls(e1)
[1] "n"
> e1$n
[1] 100

> do.call(what='eval', args=list(c2), envir = e1 ) 
[1] 5050
```












## 捕获代码并传递环境: substitute(expr, env): 比quote多了替换功能

substitute returns the parse tree for the (unevaluated) expression expr, substituting any variables bound in env.

substitute的用处就是把输入的字符直接使用，不用加引号。


著名使用场景：plot()画图时，捕获x变量名，转为字符串，作为x轴标签。

```
> plot.default

xlabel <- if (!missing(x))
    deparse(substitute(x))
```


例1: 只有一个参数时，类似 quote()
```
> substitute(a+b)
a + b
> class(substitute(a+b))
[1] "call"
> typeof(substitute(a+b))
[1] "language"
```


如果希望捕获代码中，某些变量名被替换为对应的值，可以使用substitute(expr, env)的第二个参数 env。substitute函数除了需要捕获的代码，还可以传递一个替换环境env（可以是列表、数据框、执行环境等）参数，此时代码中的变量名如果在env中有对应的值，则会被替换为相应的值，除非env是全局执行环境。

例2: 使用参数2，替换参数1中的变量
```
> x6=substitute(a + b, list(a = 1))
> x6
1 + b
> class(x6)
[1] "call"

> b=15
> eval(x6)
[1] 16

> b=-2
> eval(x6) #根据当前环境求值
[1] -1
```

也可以用新的expression替换旧的值:
```
> substitute(a + b)
a + b
> substitute(a + b, list(a = 1, b = quote(x)))
1 + x


注意：quote()是必须的，否则就解析并使用了x的值
> x=120
> substitute(a + b, list(a = 1, b =x)) #我的推理：这是先转为 "call"，再替换的
1 + 120
```


这可以很方便的把 **数学表达式** 打印到图中：
```
> plot(0)
> for (i in 1:4)
   text(1, 0.2 * i,
        substitute(x[ix] == y, list(ix = i, y = pnorm(i)))) #图略
```

- 效果：
  * []里的是下标，自动替换为数字i；
  * ==只保留一个= ??//todo
  * 右侧的y是数值：pnrom(i)

```
# 仅仅是词法解析，不检查输出的call对象在求值时刻是否合法。比如:
> substitute(x <- x + 1, list(x = 2))
2 <- 2 + 1

这方便把数学符号打印到图形中，如 `{}>=40*" years"`。
> plot(0)
> text(1, 0.2 * 4,  labels=substitute({}>=40*" years") ) #图略
```






例3: substitute不仅变量能够替换，运算符（函数）也能够替换。

而且这里不检查该函数是否已经定义，调用时才会检查，并可能报无定义错误。

```
> substitute(a + b, list("+"=quote(myfn3)))
myfn3(a, b)
```



例4: **两次替换**: substitute 通常不对第一个参数求值。这导致了如何对包含在变量中的对象进行替换的难题。解决方法是再调用一次 substitute.

```
> expr <- quote(x + y)
> substitute(substitute(e, list(x = 3)), list(e = expr)) #比如想把e替换为表达式 expr，外层 substitute()替换其参数1
substitute(x + y, list(x = 3))
> eval(substitute(substitute(e, list(x = 3)), list(e = expr))) #内层 substitute() 继续替换
3 + y
```

- 替换的精确规则如下：
  * 参数1的语法树的每个符号 和参数2进行匹配，参数2既可以是有键名的列表也可以是一个环境变量。
  * 如果它是一个简单的局部对象，它的值将被插入， 除非它 匹配全局环境。//?
  * 如果它是一个 promise（常常是函数参数）， promise 表达式会被替换(见下文例7 情形1)
  * 如果符号没有被匹配上，它不会有任何改变。
  * 而在高层次的替换的特殊例外确实很奇怪。这是从 S语言 继承而来，原理基本上是，没有控制哪个变量可能在那个层次上绑定，所以最好让 substitute 的表现和 quote 一致。
  * 不是很懂吧？可以尝试看看 [R官方文档原文 6.2](https://cran.r-project.org/doc/manuals/R-lang.html#Direct-manipulation-of-language-objects)





例5: 函数内使用 substitute() 捕获 函数的 参数 表达式实参

```
my_draw=function(x, ylab, main){
  #使用quote捕获的是字面量"ylab"，使用substitute捕获的是ylab的实参"m^2"
  plot(x, ylab=substitute (ylab), main=substitute(main) ) 
}

my_draw(1:10, ylab=m^2, main=x>y ) #注意y轴文字标签，图的标题
```




例6: (lazy evaluation 和 Promise)如果局部变量在substitute()使用前被替换(函数内部)，则可能会解析为该变量修改后的值

如果局部变量在substitute使用前被替换，promise 替换的规则和 S相应的规则稍稍有点不同。R 将使用变量的新值，而 S 将无条件地使用参数表达式 —— 除非它是一个常量。这导致一个很古怪的结果，即在S里面 f((1)) 可能和 f(1) 差异很大。但 R 的规则更清晰，尽管它也有一些比较奇怪的和 lazy evaluation(惰性求值) 相关结果。 参看下面的例子

```
logplot <- function(y, ylab = deparse(substitute(y))) {
    y <- log(y)
    plot(y, ylab = ylab) #这个y在使用前被替换过，所以ylab使用的是替换后的y的值
}
height=1:10
logplot(y=height)
# 调用之后发现，ylab是丑陋的、log求值后的好几列常常的具体数字！
```

这是因为 y 被修改后才调用的 ylab 变量。

解决方法是首先强制yalb求值。

```
logplot2 <- function(y, ylab = deparse(substitute(y))) {
    ylab
    y <- log(y)
    plot(y, ylab = ylab)
}

height=1:10
logplot2(y=height)
# 这时 ylab 就是正常的字符串 "height" 了。
```

注意：这种情况不应该使用 `eval(ylab)`。如果 ylab 是  language or expression 对象，那样将会导致求值，更不适合传入类似 `quote(log[e](y))` 这样的数学表达式。


```
logplot3 <- function(y, ylab = deparse(substitute(y))) {
  ylab;
  #eval(ylab); ##调用时错误 Error: object 'e' not found，找不到ylab中的 log[e] 的e
  y <- log(y)
  plot(y, ylab = ylab)
}
height=1:10
logplot3(y=height)

# 图中的ylab 默认是 y的实参名字，现在主动为ylab传入实参
> logplot3(y=height, ylab=quote(log[e](y)))
> logplot3(y=height, ylab=quote(log[e](height)))
```

- [关于 Promise 对象](https://cran.r-project.org/doc/manuals/R-lang.html#Promise-objects)
  * 一个 promise 捕获(capture)了需要计算的表达式（但是没有计算eval），以及计算表达式所处的environment. 
  * 第一次访问promise时，触发表达式的计算，从而产生environment中的表达式对应绑定对象的值。
  * promise就像“薛定谔的猫”，一旦访问，就触发计算，从而退出promise状态。
  * 还有一个同名但内涵不同的概念，有个R包实现了R的异步(asynchronous)编程，类似JavaScript的 Promise 功能: https://cran.r-project.org/web/packages/promises/promises.pdf







例7: substitute 的参数1有两种情况会发生名字替换为值：一是在函数的参数中应用它时(例5)，二是当环境是非.GlobalEnv时。

```
情形1: 函数内引用参数时，解析参数1为实参

> deparse(substitute(x))
[1] "x"
> deparse(substitute(iris$Sepal.Length[1:4]))
[1] "iris$Sepal.Length[1:4]"

> fn2=function(x, y=deparse(substitute(x))){
   x=x+1
   y
 }
> fn2(x=iris$Sepal.Length[1:4])
[1] "c(6.1, 5.9, 5.7, 5.6)" #是数字


注意：如果函数内没有计算步骤，则不会求值，这就是R的惰性求值 lazy evaluation.
对比: 
> fn2b=function(x, y=deparse(substitute(x))){
   #x=x+1 #函数内没有计算
   y
 }
> fn2b(x=iris$Sepal.Length[1:4])
[1] "iris$Sepal.Length[1:4]" #是字符串
```



情形2: 参数2是非全局环境时求值
```
> substitute(cyl) #参数2是全局环境，对参数1不求值
cyl
> substitute(cyl, mtcars) #参数2不是全局环境，对参数1求值
 [1] 6 6 4 6 8 6 8 4 4 6 6 8 8 8 8 8 8 4 4 4 4 8 8 8 8 4 4 4 8 6 8 4

> b <- 1;substitute(a + b, globalenv()) #参数2是全局环境，对参数1不求值(没做任何操作，和quote一样)
a + b
> substitute(a + b, list(b = 1)) #参数2不是全局环境，对参数1求值(替换也算求值吧)
a + 1

> substitute( quote(a + b), list(b = 1)) #还是对参数1求值
quote(a + 1)


用于筛选数据框：
> mtcars[eval(substitute(gear>4, mtcars)),]
                mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2  26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa   30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2
Ford Pantera L 15.8   8 351.0 264 4.22 3.170 14.5  0  1    5    4
Ferrari Dino   19.7   6 145.0 175 3.62 2.770 15.5  0  1    5    6
Maserati Bora  15.0   8 301.0 335 3.54 3.570 14.6  0  1    5    8
```




例8: 借助 delayedAssign() 实现函数外的 Promise(惰性求值).

```
> msg <- "old"
> delayedAssign("x", msg)
> substitute(x) # shows only 'x', as it is in the global env.
x
> msg <- "new!"
> x # new!
[1] "new!"
> delayedAssign("x", {
   for(i in 1:3)
     cat("yippee!\n")
   10
 })

> x^2 #- yippee 第一次调用，先计算再返回值
yippee!
yippee!
yippee!
[1] 100

> x^2 #- simple number 第二次调用，只有值
[1] 100




> ne <- new.env()
> delayedAssign("x", pi + 2, assign.env = ne)

> ## See the promise {without "forcing" (i.e. evaluating) it}:
> substitute(x, ne) #  'pi + 2'
pi + 2

> get("x", ne) #访问该变量
[1] 5.141593
```


环境中的 promise (面向高级用户)
```
> e <- (function(x, y = 1, z) environment())(cos, "y", {cat(" HO!\n"); pi+2})
> ls(e)
[1] "x" "y" "z"


## How can we look at all promises in an env (w/o forcing them)?
> gete <- function(e_)
   lapply(lapply(ls(e_), as.name),
          function(n) eval(substitute(substitute(X, e_), list(X=n))))

> (exps <- gete(e))
[[1]]
cos

[[2]]
[1] "y"

[[3]]
{
    cat(" HO!\n")
    pi + 2
}

> sapply(exps, typeof)
[1] "symbol"    "character" "language" 


> (le <- as.list(e)) # evaluates ("force"s) the promises
 HO!
$x
function (x)  .Primitive("cos")

$y
[1] "y"

$z
[1] 5.141593

> stopifnot(identical(unname(le), lapply(exps, eval))) # and another "Ho!"
 HO!
```















### bquote() 是 substitute() 的简写：包含在.()中的 子比表达式 才会被替换为值

例1: 精确控制替换
```
功能相似：
> substitute(a + b, list(b = 1))
a + 1
> bquote(a + .(b), list(b = 1))
a + 1


但是有相同变量名时，bquote能精确控制替换哪个 子表达式:
> substitute(x <- x + 1, list(x = 1:3))
1:3 <- 1:3 + 1
> bquote(x <- .(x) + 1, list(x = 1:3))
x <- 1:3 + 1
```


例2: 简化代码
```
> plot(0)
> for (i in 1:4)
   text(1, 0.2 * i,
        substitute(x[ix] == y, list(ix = i, y = pnorm(i))) )


更紧凑的写法: 
plot(0)
for(i in 1:4)
   text(1, 0.2*i, bquote( x[.(i)] == .(pnorm(i)) ))
```

- 替换规则就是，.()内的表达式求值，外边的保留表达式。
- 参数2是可选的，指定计算值的环境。
- bquote 语法借鉴自 LISP 的后置引用宏(backquote macro)。








## 捕获带操作符`~`的公式

由操作符~构成的命令，被捕获或执行后结果是一致的，唯一的区别在于～被捕获后产生的结果没有属性（attributes）部分。

但无论何种情况我们可以像操作命令树一样取出~前后的内容，所以~经常被用作捕获代码的便捷操作符号。

```
> y~x
y ~ x
> class(y~x)
[1] "formula"
> str(y~x)  #默认就和被执行 eval 的输出一致
Class 'formula'  language y ~ x
  ..- attr(*, ".Environment")=<environment: R_GlobalEnv>

> eval(y~x)
y ~ x
> class(eval(y~x))
[1] "formula"
> str(eval(y~x))  #被执行后，有attr属性
Class 'formula'  language y ~ x
  ..- attr(*, ".Environment")=<environment: R_GlobalEnv> 

> quote(y~x)
y ~ x
> class(quote(y~x))
[1] "call"
> str(quote(y~x)) #被捕获后，没有attr属性
 language y ~ x
```


### terms可以用于提取公式的信息，更具体的，可以 ?formula
```
> fo <- y ~ x1*x2
> fo
y ~ x1 * x2 
> c(class(fo), typeof(fo))
[1] "formula"  "language"

> terms(fo)
y ~ x1 * x2
attr(,"variables")
list(y, x1, x2)
attr(,"factors")
   x1 x2 x1:x2
y   0  0     0
x1  1  0     1
x2  0  1     1
attr(,"term.labels")
[1] "x1"    "x2"    "x1:x2"
attr(,"order")
[1] 1 1 2
attr(,"intercept")
[1] 1
attr(,"response")
[1] 1
attr(,".Environment")
<environment: R_GlobalEnv>
```









# in tidyR universe? //没搞懂，搞懂了再写

Any good tutorials for R metaprogramming and its best practices? enexpr(), deparse(), eval(), !!, syms(), {{}}

- https://www.reddit.com/r/rstats/comments/ovvjwq/any_good_tutorials_for_r_metaprogramming_and_its/
- https://search.r-project.org/CRAN/refmans/rlang/html/topic-data-mask-programming.html
- https://search.r-project.org/CRAN/refmans/rlang/html/topic-metaprogramming.html
- https://advanced-r-solutions.rbind.io/expressions.html

- https://combine-australia.github.io/r-pkg-dev/advanced-topics.html













# Refer
- [Good] https://blog.csdn.net/ofoliao/article/details/103471604
- [Good] https://mp.weixin.qq.com/s/ZAjXuJDS2qGdkTdpGl4Pgw
- [Good] https://liripo.github.io/noteWeb/R-metaprogramming.html
- https://www.r-bloggers.com/2019/03/r-meta-programmation-2/
- https://www.r-bloggers.com/2013/09/metaprogramming-in-r-with-an-example-beating-lazy-evaluation/
