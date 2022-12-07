# 原生R操纵函数


## 参考资料 

- [very good] 官方文档 https://cran.r-project.org/doc/manuals/R-lang.html#Computing-on-the-language
- 书籍 [《Metaprogramming in R》](https://www.programmer-books.com/wp-content/uploads/2019/05/Metaprogramming-in-R.pdf), 配套的[Github](https://github.com/Apress/metaprogramming-in-r)
- [Manipulation-of-functions](https://cran.r-project.org/doc/manuals/R-lang.html#Manipulation-of-functions)
- [Manipulation of function calls](https://cran.r-project.org/doc/manuals/R-lang.html#Manipulation-of-function-calls)





# 获取函数参数列表、函数体、环境


经常需要操纵函数或闭包的组分。R提供了一套接口函数：

```
body
Returns the expression that is the body of the function.

formals
Returns a list of the formal arguments to the function. This is a pairlist.

environment
Returns the environment associated with the function.

body<-
This sets the body of the function to the supplied expression.

formals<-
Sets the formal arguments of the function to the supplied list.

environment<-
Sets the environment of the function to the specified environment.
```


例: 对于自定义函数，获取其参数列表、函数体、运行环境。
```
> myAdd=function(x, y=0) {x+y}
> formals(myAdd)
$x

$y
[1] 0
> body(myAdd)
{
    x + y
}
> environment(myAdd)
<environment: R_GlobalEnv>
```




















## formals() 获取和操作参数列表

Access to and Manipulation of the Formal Arguments


### 打印参数列表

```
> fn1=function(x, y=2){
   return(x+y)
 }
> params = formals(fn1)
> class(params) #这其实是一个 pairlist 对象。新版R中就是list。
[1] "pairlist"

> for(param in names(params)){
   cat(param, "=", 
	   '"',params[[param]],'"', 
	   '(', class(params[[param]]), ')',
	   "\n", sep="")
 }

x=""(name)
y="2"(numeric)
```

只有R定义的函数可以获取参数列表，C函数(Primitive function)不能获取。
```
> formals(`+`)
NULL
```












## body() 获取和操作函数体

Access to and Manipulation of the Body of a Function


### 打印函数体 body()

```
> fn2=function(x, y=2){
	x = x+10
	y=-y
	return(x+y)
 }

> body(fn2)
{
    x = x + 10
    y = -y
    return(x + y)
}
```

### 对函数体求值

函数求值时的环境，叫求值环境。

该环境先先填充实参，实参没有提供的则使用默认参数值。然后函数体放到该环境求值。

仅仅函数体求值会报错:
```
> eval(body(fn2))
Error in eval(body(fn2)) : object 'x' not found
```

但是提供一个环境即可求值:
```
> eval(body(fn2), list(x=0, y=5))
[1] 5
```

如果所有参数都有默认值，也可以使用参数列表作为执行环境：
```
> fn3=function(x=2) x*10;
> eval(body(fn3), formals(fn3))
[1] 20
```


更复杂的情况：参数互相引用时。
```
> fn4=function(x=y, y=5) x+y;
> fn4() #可以直接无参数调用并求值
[1] 10

但是使用参数列表作为环境则报错:
> eval(body(fn4), formals(fn4)) #x指向y，y指向数字5。x一直没有具体数值，所以报错
Error in x + y : non-numeric argument to binary operator


> formals(fn4)
$x
y

$y
[1] 5
> formals(fn4)[["x"]]
y
> typeof(formals(fn4)[["x"]])
[1] "symbol"
```

- 在求值环境中，R先把每个形式参数赋值给一个 promise。这些 promise 是占位符，作为一个未求值的表达式。
- 当访问它们时，才求值，R同时记住这个值。
	- 对于默认参数，promise 将会在求值环境中求值。
	- 对于实际参数，promise 将会在调用上下文环境求值。
- 因为所有 promise 都是为求值表达式，所以不用担心顺序问题。求值时变量存在即可。

```
不能有循环依赖的形参:
> fn=function(x=2*y, y=x/2) x+y
> fn()
Error in fn() : 
  promise already under evaluation: recursive default argument reference or earlier problems?
```



#### delayedAssign(x, value) 惰性求值

可以使用 形参 构建 promise，作为运行环境。用到函数 delayedAssign 把值赋值给 promise:

```
> fn4=function(x=y, y=5) x+y;
> fenv = new.env()
> paraList=formals(fn4)
> for(para in names(paraList)){
   delayedAssign(para, paraList[[para]], fenv, fenv)
 }
> eval(body(fn4), fenv)
[1] 10
```













## environment 获取环境

函数的运行环境，用来捕捉其上下文环境，这是R闭包的基础。

函数的求值环境建立在其创建环境上，所以变量如果在本地环境(本地变量、形参)找不到，则在其闭包环境中查找。

内函数能使用其创建环境内的变量，这叫闭包 enclosure。

```
# 计数器程序，私有变量
outer=function(){
  counter=0; #这个变量只有内函数可以访问。
  print( environment() )
  inner=function(n=NULL){
	if(is.null(n)) n=1;
    counter<<-counter+n;
    counter;
  }
}
> incre=outer() #外函数调用时返回内函数，内函数的查找顺序：本地变量、形参、其创建的环境。
<environment: 0x55cf5b74dd90>
> incre()
[1] 1
> incre()
[1] 2
> incre(10)
[1] 12

> environment(incre)
<environment: 0x55cf5b74dd90>
```









# 调用函数

尝试看一个复杂的函数调用例子，理解背后参数的传递机制。

```
enclosing <- function() {
  z <- 2
  function(x, y = x) {
    x + y + z
  }
}

f <- enclosing()

calling <- function() {
  w <- 5
  f(x = 2 * w)
}

calling()
## [1] 22
```


我们看 f 是返回的内函数，其所在环境有变量z。
```
> environment(f)
<environment: 0x55cf5a1931a0>
> ls(environment(f))
[1] "z"
```

这涉及到三个环境，可以明确的使用环境来模拟。

- f的定义环境 defenv，f的求值环境 envlenv，f的调用环境 callenv.
- defenv 和 callenv 的父环境是全局环境；envlenv 的父环境是 defenv。

```
defenv=new.env();
evalenv=new.env( parent=defenv );
callenv=new.env();

# 在定义环境中保存z的值
defenv$z=2;

# 在调用环境中保存w的值
callenv$w=5;


# 在求值环境，创建 promise。 delayedAssign 的参数3-4分别是promise的求值环境、赋值后保存结果的环境。

# 对于x，希望在调用环境中求值，然后保存到求值环境
delayedAssign("x", 2*w, callenv, evalenv);

# 对于y希望在求值环境求值，然后保存到求值环境 
delayedAssign("y", x, evalenv, evalenv);


然后在求值环境中执行函数f:
f1=function(x, y=x) x+y+z;
eval(body(f1), evalenv);
eval(body(f1), evalenv);
## [1] 22
```

以上展示了函数调用中，参数作为 promise 的传递过程。














# 修改函数 Modifying Functions

获取函数三部分的函数接口，也都有对应的赋值版本。


## 修改 参数列表

```
> fn1=function(x) x
> fn1 
function(x) x
```

例1: 添加默认参数

```
> formals(fn1)
$x

> formals(fn1) = list(x=3)
> fn1  #修改后的函数
function (x = 3) 
x


# 使用默认值调用
> eval(body(fn1), formals(fn1))
[1] 3

> fn1()
[1] 3
```

强调：对函数求值不像对函数体在其参数列表环境中求值那么简单！

无论是否在函数外修改其形式参数，其形式参数都将在函数定义的上下文求值。

例: 定义一个闭包，修改其参数，看参数怎么求值。
```
nested=function(){
	y=5;
	function(x)x
}

f=nested();

# 修改形式参数
formals(f)=list(x=quote(y));

> f
function (x = y) 
x
<environment: 0x55cf59869858>

> f() #求值时，参数解析的上下文是函数定义的上下文
[1] 5


> y=-2 #修改全局变量不影响结果
> f()
[1] 5

# 如果显式传入参数，则以传入的实参为准
> f(y)
[1] -2
> f(x=y)
[1] -2
```










## 修改函数体 

```
> f=function(x) x
> f
function(x) x


# 1.修改函数体为固定值
> body(f)=10
> f
function (x) 
10



# 2.修改函数体为更复杂的表达式
> body(f)=quote(10*x)
> f
function (x) 
10 * x
> f(2.5)
[1] 25



# 3.修改函数体为更复杂的形式
> body(f)=parse(text="{y=1; 10*x+y}")
> f
function (x) 
{
    y = 1
    10 * x + y
}
> f(-2)
[1] -19
```










## 修改环境

```
fn1_out=function(){
	y=-10;
	function(x){
		x+y;
	}
}

fn1=fn1_out();

fn2=function(){
	x=10; y=20;
}

> fn1(1) #在fn1_out函数内的环境中求值
[1] -9

> environment(fn1) = environment(fn2); #使 fn1的运行环境变为全局
> y=100
> fn1(1)  #在全局环境中求值
[1] 101
```






## 如何添加一个没有默认值的参数？

```
> f1=function(x) x+y 

> formals(f1)=list(x, y) #报错
Error in as.function.default(c(value, if (is.null(bd) || is.list(bd)) list(bd) else bd),  : 
  invalid formal argument list for "function"
> formals(f1)=list(x=, y=) #也报错
Error in list(x = , y = ) : argument 1 is empty


> formals(f1)=list(x=quote(x), y=quote(y)) #这形式很怪异
> f1
function (x = x, y = y) 
x + y
```

正确的做法是使用 alist，而不是 list:
```
> formals(f1) = alist(x=, y=) 
> f1
function (x, y) 
x + y
```


使用 alist 会自动quote，比如想使用 y=x:
```
> formals(f1) = alist(x=, y=x)
> f1
function (x, y = x) 
x + y
```












# 构建函数 constructing functions


## 使用 as.function( alist() ) 构建函数
- 使用 as.function 可以自己构建函数
- 输入是 alist，不能使用 list。
	* 把最后一个作为函数体，前面的作为参数。

```
> f3=as.function(alist(x=, y=2, x+y ))
> f3
function (x, y = 2) 
x + y

> f3(10)
[1] 12
```


使用 list 则不能达到目的:
```
> f3b=as.function(list(x=, y=2, x+y )) #list只能使用配对的键值对
Error in list(x = , y = 2, x + y) : argument 1 is empty

> f3b=as.function(list(x=1, y=2, x+y )) #使用键值对，得到的函数体也很怪异
> f3b
function (x = 1, y = 2) 
110

> f3c=as.function(list(x=1, y=2, quote(x+y) )) #最后一项函数体需要quote
> f3c
function (x = 1, y = 2) 
x + y
> f3c()
[1] 3
```







## 创建闭包 enclosure

构造函数使用的环境，就是运行 as.function 的环境。

如果想创建闭包，则可以在函数内运行 as.function。

```
> nested = function(val){
   as.function(alist(x=, y=val, x+y))
 }

> f1=nested(3); f1
function (x, y = val) 
x + y
<environment: 0x558ba56963c0>

> ( f2=nested(-1) )
function (x, y = val) 
x + y
<environment: 0x558ba77a7778>

> f2(10) #调用函数
[1] 9

> ls(environment(f2))  #看一下这个环境中的变量
[1] "val"
> get("val", environment(f2))
[1] -1
> environment(f2)$val
[1] -1
```


注意：不要重名了! 
```
> nested2 = function(y){
   as.function(alist(x=, y=y, x+y))
 }
> f1=nested2(1)
> f1
function (x, y = y) 
x + y
<environment: 0x558bad478628>

> f1(2)
Error in f1(2) : 
  promise already under evaluation: recursive default argument reference or earlier problems?
```
因为默认参数是 惰性求值 的，当定义y指向y的时候，会在解析求值时导致循环依赖。

下面这个定义也会导致循环依赖:
```
nested2b = function(y) {
 function(x, y = y) x + y
}
> f2=nested2b(1)
> f2
function(x, y = y) x + y
<environment: 0x558bad5545b0>

> f2(10)
Error in f2(10) : 
  promise already under evaluation: recursive default argument reference or earlier problems?
```


如果非要使用同名参数，则要在使用前改为其他名字:

```
nested2c = function(y) {
  z=y;
  function(x, y = z) x + y
}

> f3=nested2c(1)
> f3
function(x, y = z) x + y
<environment: 0x558bad658c48>
> f3(10)
[1] 11

或者省略中间变量:
> nested2c(1)(10)
[1] 11
```









## 指定函数的环境 as.function( alist(), envir= )

如果不想使用当前环境，还可以给 as.function 指定一个新函数的环境。


```
# 闭包，能看到函数内的 val 变量
nested = function(val){
	as.function( alist(x=, y=val, x+y) )
}

# 不是闭包，不能看到外函数内的 val 变量，但是能看到全局val变量。
nested2 = function(val){
	as.function( alist(x=, y=val, x+y),
		envir=globalenv())
}


# 求值
> val=1000
> nested(10)(2)
[1] 12
> nested(-10)(2)
[1] -8


> nested2(10)(2) #参数1访问不到，对结果没有影响
[1] 1002
> nested2(-10)(2)
[1] 1002
```


