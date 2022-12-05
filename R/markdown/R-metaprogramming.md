# 什么是元编程?

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

(3) 缺点 

Every powerful method comes with a hidden cost.

会导致性能降低。


(4) 参考资料
- [very good] 官方文档 https://cran.r-project.org/doc/manuals/R-lang.html#Computing-on-the-language
- 书籍 [《Metaprogramming in R》](https://www.programmer-books.com/wp-content/uploads/2019/05/Metaprogramming-in-R.pdf), 配套的[Github](https://github.com/Apress/metaprogramming-in-r)



















# 原生R中的 元编程

R 中的元编程，主要是操作表达式、操作函数、操作环境等。


## 几个函数的关系

> 表达式的几个状态：
表达式字面量 --> 未经eval的表达式 --> 表达式字符串 or 计算结果

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

可以看到 expression 类由向量 vector 派生得到。
language 类是虚拟类，它包括我们熟悉的程序控制关键词/符号和 name、call 子类。










## expression(expr): R语句 to expression

把参数看成表达式，返回expression类型的对象。expression类型和list类型类似，是个容器，每个成员可能是call，symbol（name）和constants中的一种。
若有多个成员，eval每个成员都会求值一遍，但是只返回最后一个成员eval之后的值，这与绝大多数编程语言多个表达式语句（逗号隔开）返回的结果类似。


```
> x1 <- expression(3 - 5) #R 语句 转为 expression
> x1
expression(3 - 5) 
> class(x1)
[1] "expression"
> typeof(x1)
[1] "expression"
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








## parse(text=character): string to expression

是deparse的逆函数，把 表达式字符串 解析成为 未eval的expression。

```
> x2="3-5"
> x2
[1] "3-5"
> class(x2)
[1] "character"
> class(parse(text=x2)) #string 转为 expression
[1] "expression"


比较: 对"字符串"求值
> parse(text = "10 - 2 * 5") #字符串先转为 表达式
expression(10 - 2 * 5)
> eval(parse(text = "10 - 2 * 5")) #再对表达式求值
[1] 0
```










## deparse(expression): 未eval的expression to string

deparse把 没有eval的表达式 转换成 字符串。

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
[1] "expression(2^3)"  #注意：这个string和最开始的string已经不一样了
```


例2: 使用quote生成的表达式，则能基本还原
```
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








## eval(expression, envir): 对 expression 求值

对expr进行计算，默认是当前环境（也就是eval的parent.frame)。如果envir是list/data.frame，encloss参数默认增加当前环境，作为expr计算在list/data.frame之外寻找对象定义的闭包。

例1: 对 expression 求值
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


例3: 在制定环境中求值
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









## quote(expr): R语句 to 'call'(language 的子类)

把R语句转为 call 类型后，就可以直接操作语句了。

```
> x4=quote(2+20)
> x4
2 + 20
> class(x4)
[1] "call"
> typeof(x4)
[1] "language"

> eval(x4) 
[1] 22
```

subtitute/quote返回class/type根据表达式的不同而不同。表达式被解析为抽象语法树，可以访问其中每一个组成，还可以对返回的对象进行修改，即自己构造语法树（meta-programming）。


例2: 替换符号
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













## call(name, ...): string to 'call'(language 的子类)

构造一个没有eval的函数调用。第一个参数是函数名（字符串），后面是函数的参数。

```
> x5=call("+", 2, 20) #使用call构建函数调用，第一个是函数名(可以是函数名字符串)，后面是参数
> x5
2 + 20
> class(x5)
[1] "call"
> typeof(x5)
[1] "language"

> eval(x5) #求值
[1] 22

> deparse(x5) #转为字符串
[1] "2 + 20"
> class(deparse(x5))
[1] "character"
```


例2: 参数1也可以是自定义函数名

```
> myAdd=function(x,y) x+y;
> y5=call("myAdd", 10, 20)
> y5
myAdd(10, 20)
> class(y5)
[1] "call"

> eval(y5)
[1] 30
```





















## substitute(expr, env): 比quote多了替换功能

著名使用场景：画图时，捕获x变量名，转为字符串，作为x轴标签。
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


例3: 函数内使用 substitute () 捕获表达式参数

```
my_draw=function(x, ylab, main){
  plot(x, ylab=substitute (ylab), main=substitute(main) )
}

my_draw(1:10, ylab=m^2, main=x>y ) #注意y轴文字标签，图的标题
```


例4: substitute不仅变量能够替换，运算符（函数）也能够替换：
```
> substitute(a + b, list("+"=quote(myfn3)))
myfn3(a, b)
```


例5: substitute 有两种情况会发生名字的替换：一是在函数的参数中应用它时，二是当环境是非.GlobalEnv时。

```
情形1
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


注意：如果函数内没有计算步骤，则不会求值
对比: 
>fn2=function(x, y=deparse(substitute(x))){
  #x=x+1 #函数内没有计算
  y
}
>fn2(x=iris$Sepal.Length[1:4])
[1] "iris$Sepal.Length[1:4]" #是字符串


情形2
> substitute(cyl)
cyl

> substitute(cyl, mtcars)
 [1] 6 6 4 6 8 6 8 4 4 6 6 8 8 8 8 8 8 4 4 4 4 8 8 8 8 4 4 4 8 6 8 4
```







## 操作函数 //todo




















# in tidyR universe? //没搞懂，搞懂了再写

Any good tutorials for R metaprogramming and its best practices? enexpr(), deparse(), eval(), !!, syms(), {{}}

- https://www.reddit.com/r/rstats/comments/ovvjwq/any_good_tutorials_for_r_metaprogramming_and_its/
- https://search.r-project.org/CRAN/refmans/rlang/html/topic-data-mask-programming.html
- https://search.r-project.org/CRAN/refmans/rlang/html/topic-metaprogramming.html
- https://advanced-r-solutions.rbind.io/expressions.html














# Refer
- [Good] https://blog.csdn.net/ofoliao/article/details/103471604
- [Good] https://mp.weixin.qq.com/s/ZAjXuJDS2qGdkTdpGl4Pgw
- R语言元编程：字符转变量进行赋值 https://zhuanlan.zhihu.com/p/70034301
- R语言元编程：表达式   https://zhuanlan.zhihu.com/p/68993121
- https://stackoverflow.com/questions/514644/what-exactly-is-metaprogramming
- https://www.r-bloggers.com/2019/03/r-meta-programmation-2/
- https://www.r-bloggers.com/2013/09/metaprogramming-in-r-with-an-example-beating-lazy-evaluation/
- https://combine-australia.github.io/r-pkg-dev/advanced-topics.html
- 对字符串求值 https://statisticsglobe.com/r-eval-function-evaluate-expression
- parse 把 string转为 expression: https://statisticsglobe.com/parse-deparse-expression-r-function

