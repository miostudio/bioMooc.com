
# R数据结构概述

通过mode()函数可以查看一个对象的类型。R的基本数据类型(4种)：数值型（numeric）、字符型（character）、逻辑型（logical）、复数型（complex）。由基本数据类型构成复合对象，包括向量、列表、矩阵、数组、数据框、时间序列等，生信常用的是 向量、数据框、因子和列表。

还有其他类型，如函数型、表达式、数据库连接等，但是一般不表示数据。









# 向量 vector


## 向量与赋值

- 方法1

```
> x=c(1,2.5,3,4.1)
> x
[1] 1.0 2.5 3.0 4.1
```


- 方法2: 使用 assign 函数

```
> assign("y", c(-1,-2,-5))
> y
[1] -1 -2 -5


> class(y) #该变量的数据类型
[1] "numeric"
```


- 其他不推荐的赋值方式

```
> x1 <- c(-1,0,3) #赋值符推荐使用=，不推荐这个。原因：不通用，易与html tag搞混，且要输2个字符
> x1
[1] -1  0  3


> c(1,2,3) -> x2 #赋值不推荐这个：与其他编程语言不一致导致记忆负担，太长的代码容易看漏最后部分。
> x2
[1] 1 2 3
```


例1: 可以使用向量构建新的向量

```
> x=c(1,5)
> y=c(x, 100, x)
> y
[1]   1   5 100   1   5
```


例2: 按下标获取元素，R的下标是从1开始的

```
> x=c(-5, -1, 5)
> x[1]
[1] -5
```

例3: 带名字的向量 named vector

```
> x=c(20, 100, 30) #定义数值
> names(x)=c('down', 'ns', 'up') #添加名字
> x
down   ns   up 
  20  100   30 
> class(x)
[1] "numeric"


# 按照名字获取、按照下标获取
> x["up"]
up 
30 
> x[1]
down 
  20 

# 获取全部名字
> names(x)
[1] "down" "ns"   "up" 

# 获取全部数字
> as.numeric(x)
[1]  20 100  30
```





## 向量的算术运算

向量的算术运算，是对每一位分别执行算术运算。要求两个向量长度相同。


例1: 算术运算

```
> x = c(1,2,3)
> y = c(4,5,6)
> v = 2*x + y + 1
> v
[1]  7 10 13

> x + y
[1] 5 7 9
```


更多例子:

```
例2: 求几个数的方差 var(x)
> x=c(1,2,3,4)
> var(x)
[1] 1.666667

> sum((x-mean(x))^2)/(length(x)-1) #这个就是var() 函数内部执行的计算
[1] 1.666667


例3: 求倒数
> x=c(1,2,3)
> 1/x
[1] 1.0000000 0.5000000 0.3333333


例4: 单个数字与向量的运算，是该数字与每个向量的运算
> 10 + c(1,2,3)
[1] 11 12 13
```









## 产生规则的序列: seq, rep


- 方法1: 产生连续的数值向量

```
> 1:5
[1] 1 2 3 4 5

> seq(1,5)
[1] 1 2 3 4 5

> seq(1,5, by=2) #指定 间距/步长，只要奇数，不要偶数
[1] 1 3 5

> seq(0, 5, by=2) #只要偶数
[1] 0 2 4

> seq(1, 5, length=9) #指定要9个数，保证等宽
[1] 1.0 1.5 2.0 2.5 3.0 3.5 4.0 4.5 5.0
```


- 方法2: 使用函数 rep() 函数，产生规则的字符或数字向量。注意比较 times(默认)和 each 参数的差异。

```
> rep("i", 3) #产生3个i组成的向量，字符型。参数2名字默认是 times，看下文
[1] "i" "i" "i"

> rep( c("red", "Blue"), times=3) #第一个向量重复3次
[1] "red"  "Blue" "red"  "Blue" "red"  "Blue"

> rep( c("red", "Blue"), each=3) #第一个向量的每个元素重复3次。注意对比上一个结果。
[1] "red"  "red"  "red"  "Blue" "Blue" "Blue"
```









## 逻辑值向量

逻辑值只有 TRUE 和 FALSE 两个值，简写做T和F。

```
> x=c(1,2,3)
> a1 = x>2 #x的元素是否比2大
> a1
[1] FALSE FALSE  TRUE
```

- 强制转换时
	* 数值0对应F，非0对应T
	* F转数字是0，T转数字是1

```
> 0 == T
[1] FALSE
> 0 == F
[1] TRUE
> 1 == T
[1] TRUE


> 1+T
[1] 2
> 1+F
[1] 1
```



- 逻辑操作符包括 `<, <=, >, >=, ==, !=`，分别表示小于、小于等于、大于、大于等于、等于、不等于。
- 逻辑运算符号:
	* ` & ` 表示 and
	* ` | ` 表示 or 
	* ` ! ` 表示 not

```
> c(1, 1) & c(0, 1) #且
#[1] FALSE  TRUE

> c(0, 0) | c(0, 1) #或
[1] FALSE  TRUE

> !c(0,1)  #非
[1]  TRUE FALSE
```









## 缺失值

缺失值是数据搜集时得不到的值，在R中用NA表示。

is.na() 检测缺失值，返回逻辑值

```
> x=c(1,3,5, NA)
> x
[1]  1  3  5 NA

> is.na(x) #返回每一位是否是缺失值
[1] FALSE FALSE FALSE  TRUE


# 去掉缺失值
> x[!is.na(x)]
[1] 1 3 5
```

不能使用 `x == NA` 检测缺失值，因为NA不是一个具体数字。这会导致整个向量被污染成NA:

```
> x == NA
[1] NA NA NA NA
```


另一种缺失值，是 NaN，表示 Not a Number

```
> 0/0
[1] NaN
> Inf - Inf 
[1] NaN

> is.na(0/0) #NaN 也能被 is.na 检测到
[1] TRUE

> is.nan( c(1, NA, 0/0) ) # is.nan 则只能检测 NaN
[1] FALSE FALSE  TRUE
```









## 字符串向量

```
> x=c("a1", "B2", "c3") #字符串向量的定义
> x
[1] "a1" "B2" "c3"
```

例2: 把2个向量逐位拼接

```
> paste( 1:3, c("a", "B", 'c') ) #默认使用空格拼接
[1] "1 a" "2 B" "3 c"
> paste( 1:3, c("a", "B", 'c'), sep="" ) #指定用空字符拼接
[1] "1a" "2B" "3c"


# 如果2个不等长，则短的会被循环使用
> labs = paste(c("X","Y"), 1:10, sep=""); labs
[1] "X1"  "Y2"  "X3"  "Y4"  "X5"  "Y6"  "X7"  "Y8"  "X9"  "Y10"
```









## 切片向量: 选择子集、修改子集

获取或修改向量的元素，可通过下标等几种形式：


例1: 通过逻辑值索引，返回T的元素

```
> x
[1]   1   2 NaN
> x[!is.na(x)] #通过逻辑值取子集：非na元素
[1] 1 2

> (x+1)[!is.na(x) & x>1] #非na且 x>1，则只有第2位。向量都加1后第二位是3
[1] 3

> x=1:10
> x[ which(x%%2==0) ] #获取偶数: 元素除以2余数是0的元素
[1]  2  4  6  8 10


> x=1:10 
> x[which(x %in% c(6, 8,10, 12) )] #在某个集合中: %in%
[1]  6  8 10

> x[which(!x %in% c(6, 8,10, 12) )] #不在某个集合中，只要在前面加!，它的优先级低于 %in%
[1] 1 2 3 4 5 7 9
```


例2: 通过正数向量下标获取

```
> x = seq(-5, 5); x
 [1] -5 -4 -3 -2 -1  0  1  2  3  4  5
> x[2:4] #获取第2到4位
[1] -4 -3 -2

> x[c(1,1,2,1)] #可以重复取某个元素
[1] -5 -5 -4 -5

> c("x","y")[rep(c(1,2,2,1), times=4)] #更极端的情况: 构建一个 (1,2,2,1)重复4次的向量当下标
[1] "x" "y" "y" "x" "x" "y" "y" "x" "x" "y" "y" "x" "x" "y" "y" "x"
```


例3: 通过负数向量下标排除值

```
> x=1:10
> y = x[-(1:5)]; y #获取除了1到5位之外的元素
[1]  6  7  8  9 10
```


例4: 通过字符串向量，获取命名向量的值

```
> fruit = c(5, 10, 1, 20)
> names(fruit) = c("orange", "banana", "apple", "peach")
> lunch = fruit[c("apple","orange")]
> lunch
 apple orange 
     1      5 
```



## 排序

```
> a1=c(5,3,2,8,-10); a1
[1] 5 3 2 8 -10
```


例1: sort() 直接排序
```
> sort(a1) #直接排序，默认升序
[1] -10   2   3   5   8
> sort(a1, decreasing = T) #指定降序排列
[1]   8   5   3   2 -10
```


例2：rank() 返回每个元素的大小序号，从小到大
```
> rank(a1) #第5个元素(-10)最小，排行第1；第二小的元素是第3个元素(2)
[1] 4 3 2 5 1

> rank( c(2,1,1,3) ) #相等的元素编号被平均
[1] 3.0 1.5 1.5 4.0
```



例3：order() 返回(从小到大)排序后每个位置来自于原来的第几个元素

```
> order(a1) # 第一个是5，表示最小值来自于原来的第5个元素
[1] 5 3 2 1 4
> a1[order(a1)] #这样获得排序后的向量
[1] -10   2   3   5   8


> order( c(2,1,1,3) ) #相等时随机排
[1] 2 3 1 4  #
> c(2,1,1,3) [order( c(2,1,1,3) )]
[1] 1 1 2 3
```

order() 如果第一个相等时，还支持第二个参数。













## 实例


### 例1: 替换缺失值NA为0

```
> x=c(1,3, NA); x
[1]  1  3 NA
> x[is.na(x)]=0  #替换：等号左边是索引，选出NA的位置；等号右边是替换后的目标值
> x
[1] 1 3 0
```



### 例2: 去除重复 duplicated() / unique()

```
> genelist=c('a1', 'b1', 'c3', 'a1', 'e2' ); genelist
[1] "a1" "b1" "c3" "a1" "e2"

> genelist[duplicated(genelist)] #获取重复的值
[1] "a1"

> genelist.uniq = unique(genelist); genelist.uniq #去除重复的值
[1] "a1" "b1" "c3" "e2"
```




### 例3: 把某向量恢复到原始指定的顺序？ match(x=bigOrder, table=smallVector)

相关函数: `match(x, table)` 返回向量x中的每个元素在向量table中的下标，如果没找到则返回NA。
```
> match(x=c(-1,2), table=0:5 )
[1] NA  3                      #-1没找到返回NA，2在0:5的第三个位置。
```

要完成本题目标，我们需要反过来思考，查询原始向量在现有向量中的下标，然后去掉NA，再根据下标重排现有向量。
```
arr_now=paste0("a", c(1,5,8)) #现在的顺序
arr_raw=paste0("a", c(8,6,9,1,10,5,3)) #原始的顺序(需要的顺序)

# 思路要点：把目标顺序放到 match(x=)，把现有(不需要的)顺序放到 match( table=)
a2 = arr_now[na.omit( object= match(x=arr_raw, table=arr_now) )];a2 #恢复顺序
# [1] "a8" "a1" "a5"
```


另一种问法: 取小集合在大集合的子集，并保持在大集合中的位置顺序（大集合没有的元素删掉）。
```
# Seurat 4 实例
cells.scaled = cells.scaled[na.omit(object = match(x = colnames(x = x), table = cells.scaled))]


一步一步展开:
cells.scaled=c(3, 80,1000,20,500) #小集合
x=c(1:100) #大集合，规定顺序

rs1=match(x = x, table = cells.scaled); rs1
rs2=na.omit(rs1); rs2 #1,4, 2
cells.scaled[rs2] #3 20 80



# 在函数 WhichCells.Seurat 最后，也使用到了这个套路
cells =c(20, 4, 60, 8) # 是经过各种筛选后留下的小集合。
cell.order =seq(100,1, -1) # 是最早的大集合。规定顺序。
# 排序: 大集合在小集合中的下标，去掉na，然后是小集合的元素，按照大集合的顺序输出
cells2 = cells[na.omit(object = match(x = cell.order, table = cells))]
cells2
# [1] 60 20  8  4
```






###  例4: 按某分组向量，求一组向量的 各组均值。

`tapply(incomes, statef, mean)` 返回结果是 工资向量incomes 按照 州statef 分组后的 平均值 mean

```
> state = c("tas", "sa",  "qld", "nsw", "nsw", "nt",  "wa",  "wa",
             "qld", "vic", "nsw", "vic", "qld", "qld", "sa",  "tas",
             "sa",  "nt",  "wa",  "vic", "qld", "nsw", "nsw", "wa",
             "sa",  "act", "nsw", "vic", "vic", "act")

> incomes = c(60, 49, 40, 61, 64, 60, 59, 54, 62, 69, 70, 42, 56,
               61, 61, 61, 58, 51, 48, 65, 49, 49, 41, 48, 52, 46,
               59, 46, 58, 43)

> incmeans = tapply(incomes, state, mean)
> class(incmeans)
[1] "array"

> incmeans
     act      nsw       nt      qld       sa      tas      vic       wa 
44.50000 57.33333 55.50000 53.60000 55.00000 60.50000 56.00000 52.25000 
```

还可以自定义函数：计算方差(standard errors )

```
> stdError = function(x) sqrt(var(x)/length(x))
> incster = tapply(incomes, state, stdError)
> incster
     act      nsw       nt      qld       sa      tas      vic       wa 
1.500000 4.310195 4.500000 4.106093 2.738613 0.500000 5.244044 2.657536 

> tapply(incomes, state, length) #每个州的样本数
act nsw  nt qld  sa tas vic  wa 
  2   6   2   5   4   2   5   4 



```

















# 因子

一个因子或因子向量不仅包括分类变量本身, 还包括变量不同的可能水平(即使它们在数据中不出现). 

因子最常用的地方是ggplot2画图时的数值型分类变量。

```
因子利用函数factor( )创建:
factor(x, levels = sort(unique(x), na.last = TRUE),labels = levels, exclude = NA, ordered = is.ordered(x))

参数说明：
	levels用来指定因子的水平（缺省值是向量x中不同的值；如果x中有levels中没有指定的值，则x中该值会被记作NA）；
	labels用来指定水平的名字（并显示出来）；
	exclude表示从向量x中剔除的水平值；
	ordered是一个逻辑型选项，用来指定银子的水平是否是有次序。
	这里x可以是数值型或字符型，这样对应的因子也就称为数值型因子或字符型因子。因此，因子的建立可以通过字符型向量或数值型向量来建立，且可以转化。
```


## 字符 to 因子

例1: 将字符型向量转换成因子

```
> a=c("green", "blue", "green","yellow")
> a1=factor(a)
> a1   #或使用 str(a1) 或 attributes(a1)查看因子顺序
[1] green  blue   green  yellow
Levels: blue green yellow

> levels(a1) #查看因子顺序
[1] "blue"   "green"  "yellow"

> class(a)
[1] "character"

> class(a1)
[1] "factor"
```


例2: 使用levels选项人为指定顺序

因子默认是按照字母顺序排序的，这个实际情况很可能不一致。可以使用levels选项人为指定顺序。

```
> a2=factor(a, levels=c("green", "blue","yellow"))
> a2
[1] green  blue   green  yellow
Levels: green blue yellow


# 把普通列变为 factor 列，方便作为ggplot2的color或fill变量
data.plot$id = factor(x = data.plot$id, levels = id.levels)
```






## 数字 to 因子

例3: 将数值型向量转换成因子

```
> b=c(1,2,3,1)
> b1=factor(b)
> b1
[1] 1 2 3 1
Levels: 1 2 3

> class(b)
[1] "numeric"

> class(b1)
[1] "factor"
```

为了对人类更友好，可以用labels为数值型贴上标签。此后显示的时候按标签设置显示：

```
> gender=factor(b, levels=c(1,2,3), labels=c("M","F","U") )
> gender
[1] M F U M
Levels: M F U
```





## 将字符型因子 to 数值型因子

```
a2=a1;a2
## [1] green  blue   green  yellow
## Levels: blue green yellow

levels(a2)=c(1,2,3,4)
a2
## [1] 2 1 2 3 ## 因子4没有出现过
## Levels: 1 2 3 4

ff=factor(c("A","B","C"), labels=c(1,2,3));ff
## [1] 1 2 3
## Levels: 1 2 3
```


## 将数值型因子 to 字符型因子

```
b2=b1;b2  ## Levels: 1 2 3
levels(b2)=c("low","middle","high");b2  #Levels: low middle high


ff=factor(1:3, labels=c("A","B","C"));ff  #Levels: A B C

#注: 函数levels( )用来提取一个因子中可能的水平值
ff = factor(c(2, 4), levels=2:5); ff
levels(ff)  #[1] "2" "3" "4" "5"
```



## 函数gl()能产生规则的因子序列. gl(k,n)，其中k是水平数, n是每个水平重复的次数. 

此函数有两个选项：length指定产生数据的个数, label指定每个水平因子的名字.

```
> gl(3,5)
 [1] 1 1 1 1 1 2 2 2 2 2 3 3 3 3 3
Levels: 1 2 3

> gl(3,5,length=30)
 [1] 1 1 1 1 1 2 2 2 2 2 3 3 3 3 3 1 1 1 1 1 2 2 2 2 2 3 3 3 3 3
Levels: 1 2 3

> gl(2,6,label=c("Male","Female"))
 [1] Male   Male   Male   Male   Male   Male   Female Female Female Female Female Female
Levels: Male Female
```



## 数值型因子 to 数字

```
> a1=c(1,2,1,1,2); a1
[1] 1 2 1 1 2
> a2=factor(a1); a2 #数字型因子
[1] 1 2 1 1 2
Levels: 1 2

> as.numeric(a2) #方法1
[1] 1 2 1 1 2

> as.numeric(levels(a2))[a2] #方法2
[1] 1 2 1 1 2
```
































# 参考资料

1. https://cran.r-project.org/doc/manuals/R-intro.html#Simple-manipulations-numbers-and-vectors











