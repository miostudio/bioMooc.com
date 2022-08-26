# 列表 list

- list是R语言中包容性最强的数据对象，几乎可以容纳所有的其他数据类型。
	* 列表相当于pyhton的字典，保存的是键值对。但是基于list的hash效率很低。
	* 列表的元素可以是任何数据类型，甚至是函数，列表可以嵌套。
	* 函数可以通过返回list达到一次返回多个结果的效果，通过接受list参数获取多个信息


## (1) 创建列表

`Lst = list(name_1=object_1, …, name_m=object_m)`

我们一般把list()中的每个逗号分开的基本单位叫 一个键值对：等号左边的叫键(key)，右边的叫值(value)。


例1: 创建一个list

```
> Lst = list(name="Fred", wife="Mary", no.children=3,
            child.ages=c(4,7,9))
> Lst
$name
[1] "Fred"

$wife
[1] "Mary"

$no.children
[1] 3

$child.ages
[1] 4 7 9
```


例2: list 也可以没有名字

```
> list2=list(1, 100, iris[1:2, ]); list2
[[1]]
[1] 1

[[2]]
[1] 100

[[3]]
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
```





## (2) 查看信息、获取子集、元素

- 获取键名 names()，获取长度 length();
- 列表可以通过数字下标 `lst[[1]]` 获取值，有键名的列表还可以通过名字获取值 `lst[['key']]` 或者 `lst$key`。

```
# 查看一个list的结构
> str(Lst)
List of 4
 $ name       : chr "Fred"
 $ wife       : chr "Mary"
 $ no.children: num 3
 $ child.ages : num [1:3] 4 7 9


# 获取所有键名
> names(Lst)
[1] "name"        "wife"        "no.children" "child.ages" 


# 获取元素个数
> length(Lst)
[1] 4
```





例1：通过键或下标获取值
```
# 1.通过下标 list[[2]]
> Lst[[1]] #第一个元素。
[1] "Fred"
> Lst[[3]]
[1] 3
> Lst[[4]]
[1] 4 7 9


# 2.通过名字 list[["key"]]
> Lst[["child.ages"]]
[1] 4 7 9


# 3.通过$符
> Lst$child.ages
[1] 4 7 9
```



访问不存在的键
```
> Lst[['id3']]
NULL

> Lst$id3
NULL

> is.null(Lst$id3)
[1] TRUE
```




如果list的某个元素是向量，则可以继续按向量获取其元素。

例2: 获取第2个小孩的年龄
```
> Lst[[4]][2]  #基本形式
[1] 7

> Lst[["child.ages"]][2] #使用名字获取
[1] 7

> Lst$child.ages[2] #使用名字获取
[1] 7


访问不存在的下标，则返回NA。
> Lst[['child.ages']][10]
[1] NA
> is.na(Lst[['child.ages']][10])
[1] TRUE
```

也支持通过变量获取值:

```
> x = "child.ages"; 
> Lst[[x]]
[1] 4 7 9
```



如果使用方括号，错误的只写了一层，则返回的是一个list对象:

```
> Lst[1]
$name
[1] "Fred"

> class(Lst[1])
[1] "list"

# 支持取更多子集
> Lst[1:2] #返回list，包含下标第1-2的元素
$name
[1] "Fred"

$wife
[1] "Mary"


> Lst[ c(1,4)] #返回list，包含下标1和4的元素
$name
[1] "Fred"

$child.ages
[1] 4 7 9
```





## (3) 修改

修改list的键:

```
> names(Lst)[1] = "father.name"
> names(Lst)
[1] "father.name" "wife"        "no.children" "child.ages" 
```


修改list的值:

```
x = "child.ages"; 
Lst[[x]]=c(5,8,12) #可以直接修改 键值对的值

> Lst$child.ages
[1]  5  8 12

> Lst$child.ages[1]=6 #可以修改值的一部分
> Lst$child.ages
[1]  6  8 12
```


可以通过list覆盖值
```
> Lst[1] = list(father.name="Tom") #ok
> Lst[1]
$father.name
[1] "Tom"

> Lst[1] = list(name="Tom2") #key 不同，或者没有key，也可以
> Lst[1]
$father.name
[1] "Tom2"


#不同长度会给警告，按照第一个覆盖，甚至不检查key是否相等。
# 不得不说，R语言在细节上确实很不严谨。与Pyhton的键值对模型还有点距离。
> Lst[1] = list(name="Tom3", house=1)
Warning message:
In Lst[1] = list(name = "Tom3", house = 1) :
  number of items to replace is not a multiple of replacement length
> Lst[1]
$father.name
[1] "Tom3"
```







## (4) 添加元素

直接使用数字下标或者名字添加新元素。

```
> list2=list(start=0)
> list2
$start
[1] 0

> list2[[2]] = 100 #添加没有key的value
> list2[["avg"]]=50  #添加 键值对
> list2$median=10 #添加键值对
> list2
$start
[1] 0

[[2]]
[1] 100

$avg
[1] 50

$median
[1] 10
```







## (5) 删除元素

删除一个键，只需要把它的value设置为 NULL。

```
> list2$median=NULL #这个键(key)就消失了
> list2
$start
[1] 0

[[2]]
[1] 100

$avg
[1] 50
```



## (6) 合并列表

`list.ABC = c(list.A, list.B, list.C)`


```
> l2=list(x=1, y=2)
> l3=list(a=100, b=200)
> list4=c(l2, l3) #合并列表
> list4
$x
[1] 1

$y
[1] 2

$a
[1] 100

$b
[1] 200
```



## (7) 转换列表为向量

`unlist(list2)` 返回一个 named vector.

```
> l2=list(x=1, y=2); l2
$x
[1] 1

$y
[1] 2

> v2=unlist(l2); v2 #列表变向量
x y 
1 2 

> class(v2)
[1] "numeric"
> str(v2)
 Named num [1:2] 1 2
 - attr(*, "names")= chr [1:2] "x" "y"
```

当value为向量时，转化后的named vector 的名字使用数字后缀区分:
```
> l3=list(ages=c(10,2,3), name="Tom"); l3
$ages
[1] 10 2 3

$name
[1] "Tom"

> unlist(l3)
ages1 ages2 ages3  name  #这几个ages前缀 + 数字编号后缀
  "10"   "2"   "3" "Tom" 
```































# 数据框 data.frame

数据框(data.frame)在R中使用的十分广泛。只要你用read.table输入数据，基本都是data.frame类别的数据。

Data Frame一般被翻译为数据框，就像是R中的Excel表，由行和列组成。矩阵Matrix要求每个元素都必须存储同样类型的对象，而数据框data frame可以存储不同类型的对象，但每一列里面数据类型相同。

Data Frame每一列有列名，每一行也可以指定行名。如果不指定行名，那么就是从1开始自增的Sequence来标识每一行。

data frame常用的操作包括查看、统计、创建、筛选、取子集、获取值、修改、新增、删除、转置、遍历、连接合并、计算等。







## 查看

### (1) 查看维度、行列数
```
> class(Puromycin) #查看数据类型
[1] "data.frame"

> dim(Puromycin) #查看行、列数
[1] 23  3
> nrow(Puromycin) #行数
[1] 23
> ncol(Puromycin) #列数
[1] 3
```


### (2) 查看前几行、数据结构
```
> head(Puromycin) #查看数据前6行
  conc rate   state
1 0.02   76 treated
2 0.02   47 treated
3 0.06   97 treated
4 0.06  107 treated
5 0.11  123 treated
6 0.11  139 treated
> head(Puromycin, n=10) #指定查看前n行
> tail(Puromycin) #查看末尾6行

> str(Puromycin) #查看数据结构
'data.frame':	23 obs. of  3 variables:
 $ conc : num  0.02 0.02 0.06 0.06 0.11 0.11 0.22 0.22 0.56 0.56 ...
 $ rate : num  76 47 97 107 123 139 159 152 191 201 ...
 $ state: Factor w/ 2 levels "treated","untreated": 1 1 1 1 1 1 1 1 1 1 ...
 - attr(*, "reference")= chr "A1.3, p. 269"
# 我们看到 state 列是一个因子类型。

> View(Puromycin) #在新的标签页查看该数据表，行列布局类似 Excel 的表
```



### (3) 查看和修改列名: names、colnames函数

```
> df1=iris[1:3, ]; df1 #取一个数据框的一部分
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa

> colnames(df1) #查看列名
[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"
> names(df1)  #同上


> colnames(df1)[2]="SW" #修改列名：把第二个改为 SW
> colnames(df1)
[1] "Sepal.Length" "SW"           "Petal.Length" "Petal.Width"  "Species"


> colnames(df1) = c("SL", "SW", "PL", "PW", "S") #修改列名：全部修改为新列名
> df1
   SL  SW  PL  PW      S
1 5.1 3.5 1.4 0.2 setosa
2 4.9 3.0 1.4 0.2 setosa
3 4.7 3.2 1.3 0.2 setosa
```


### (4) 查看和修改行名: row.names/rownames 函数

```
> df2=mtcars[1:3, 1:2]; df2 #取一个数据框的一部分
               mpg cyl
Mazda RX4     21.0   6
Mazda RX4 Wag 21.0   6
Datsun 710    22.8   4

> rownames(df2) #获取行名
[1] "Mazda RX4"     "Mazda RX4 Wag" "Datsun 710" 


> rownames(df2) = c("M1", "M2", "Da") #修改行名
> df2
    mpg cyl
M1 21.0   6
M2 21.0   6
Da 22.8   4
```

也可以用 `dimnames()` 查看行名和列名。

```
> dimnames(df2)
[[1]]
[1] "M1" "M2" "Da"

[[2]]
[1] "mpg" "cyl"
```












## 统计 


变量之间的关系：成对数据散点图
```
> pairs(Puromycin, panel = panel.smooth)
```

使用xtabs( )函数由交叉分类因子产生一个列联表:
```
> xtabs(~state + conc, data = Puromycin)
           conc
state       0.02 0.06 0.11 0.22 0.56 1.1
  treated      2    2    2    2    2   2
  untreated    2    2    2    2    2   1


> xtabs(~state, data = Puromycin)
state
  treated untreated 
       12        11
```


使用 table() 统计
```
> table(Puromycin$state, Puromycin$conc)
           
            0.02 0.06 0.11 0.22 0.56 1.1
  treated      2    2    2    2    2   2
  untreated    2    2    2    2    2   1

> table(Puromycin$state)

  treated untreated 
       12        11
```










## 创建 数据框

### (1) 使用已有向量建立数据框: data.frame()
```
> patientID = c(1:4)
> age = c(23,35,46,58)
> diabetes = c("Type1","Type2","Type1","Type1")
> status = c("Poor","Improved","Excellent","Poor")

> patientdata = data.frame(patientID,age,'diabetesType'=diabetes,status) #可以修改列名
> patientdata
  patientID age diabetesType    status
1         1  23        Type1      Poor
2         2  35        Type2  Improved
3         3  46        Type1 Excellent
4         4  58        Type1      Poor
```


### (2)使用向量直接建立数据框: data.frame()
```
> student = data.frame(
   ID=c(8011,8012,8013),
   Name=c("Lily", "Percy","Lilei"),
   Gender=c("F","M","M"),
   Birthdate=c("2084-12-29","2073-5-6","2080-8-8")
 )
> student
    ID  Name Gender  Birthdate
1 8011  Lily      F 2084-12-29
2 8012 Percy      M   2073-5-6
3 8013 Lilei      M   2080-8-8
```


用row.names参数直接为行命名
```
my_df1 = data.frame(
  num = 1:3, 
  letter = LETTERS[1:3], 
  logic = c(T,F,T), 
  row.names = paste('row',1:3, sep="_")  
  # row.names = 2 #也可以为数字，比如 2，表示第n列删掉变为row.names，该列不能重复
  #paste参数sep设置连接符
)

> my_df1
      num letter logic
row_1   1      A  TRUE
row_2   2      B FALSE
row_3   3      C  TRUE
```


### (3) 读取文本文件: read.table(), read.csv()

读取一个文本文件，返回Data Frame对象.

读取数据库也是返回Data Frame对象。

```
text1=read.table('001.txt')  #文本最后一行是不是空行，现在都可以
text2=read.table('001.txt', header=F)   #设置是否有标题。如果第一行比其他行少1个，则默认 header=T
text3=read.table('001.txt', header=F, sep=",")  #设置分隔符，默认sep=""表示一个或多个空白、tab、新行回车。
	# sep ="\t" 表示使用tab作为分隔符。


# 例: 读取文件
x1=read.table("dustbin/iris.txt", 
              sep = ' ',     #指定分隔符是空白。
              row.names = 1,  #用第一列命名行名
              header=TRUE) #文件带有标题
> x1
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
```




### (4) 从字符串中读取数据表 read.table(text= )

适合小数据集，大型数据集还是要从文件读取。

```
Input =("
        Distance    Trill  No.trill
        10m        16     8
        100m        3    18
        ")
Matriz = as.matrix(read.table(textConnection(Input),
                              header=TRUE,
                              row.names=1))
Matriz
#     Trill No.trill
#10m     16        8
#100m     3       18
```


稍简洁的写法:
```
# 直接在程序中嵌入数据
mydatatxt="
age gender
1 M
2 F
3 F
"
mydata=read.table(text=mydatatxt, header=T) # text设置了，file就要留空。
mydata
#  age gender
#1   1      M
#2   2      F
#3   3      F
```




### (5) 把其他数据类型转为数据框 as.data.frame()

apply 家族函数返回可能是矩阵，可以使用 as.data.frame 转为 数据框。

```
> mat = t(sapply( split(iris[,1:4], iris[,5]), function(x){
   apply(x, 2, mean)
 })); #mat
> class(mat)              # 矩阵类型
[1] "matrix" "array" 

> df2=as.data.frame(mat) #转为数据框
> class(df2)             # 数据框类型
[1] "data.frame"
> df2
           Sepal.Length Sepal.Width Petal.Length Petal.Width
setosa            5.006       3.428        1.462       0.246
versicolor        5.936       2.770        4.260       1.326
virginica         6.588       2.974        5.552       2.026
```



### (6) 读取R内置的数据集

R 内置数据集都位于 datasets R包中。
```
> search() #列出变量搜索路径，发现有 datasets 包，才可以使用其中的数据
 [1] ".GlobalEnv"        "tools:rstudio"     "package:stats"     "package:graphics"  "package:grDevices"
 [6] "package:utils"     "package:datasets"  "package:methods"   "Autoloads"         "package:base"

> data() #列出数据名字等信息 Data sets in package ‘datasets’
```

列出某个R包中的数据集
```
> data(package = "ggplot2")  Data sets in package ‘ggplot2’
> data(package = .packages(all.available = TRUE)) #所有R包带有的数据
```


引用某个包的数据
```
> data(package="ggplot2") #查看某R包自带的数据集名字
> data(diamonds, package="ggplot2") #载入该数据包（也可跳过）

> head(ggplot2::diamonds) #使用该数据。如果载入过可以省略包名前缀: head(diamonds).
# A tibble: 6 × 10
  carat cut       color clarity depth table price     x     y     z
  <dbl> <ord>     <ord> <ord>   <dbl> <dbl> <int> <dbl> <dbl> <dbl>
1  0.23 Ideal     E     SI2      61.5    55   326  3.95  3.98  2.43
2  0.21 Premium   E     SI1      59.8    61   326  3.89  3.84  2.31
3  0.23 Good      E     VS1      56.9    65   327  4.05  4.07  2.31
4  0.29 Premium   I     VS2      62.4    58   334  4.2   4.23  2.63
5  0.31 Good      J     SI2      63.3    58   335  4.34  4.35  2.75
6  0.24 Very Good J     VVS2     62.8    57   336  3.94  3.96  2.48



引用 datasets 包中的数据可以直接使用，不用加包名前缀
> head(Puromycin)
  conc rate   state
1 0.02   76 treated
2 0.02   47 treated
3 0.06   97 treated
4 0.06  107 treated
5 0.11  123 treated
6 0.11  139 treated

> class(Puromycin) #如果不是数据框，使用 as.data.frame 转为数据框即可。
[1] "data.frame"
```







### (7) 从内存中读取数据

如果是从excel、txt中复制到内存的，可以直接读取内存。

```
# windows 下适用；在浏览器内使用远程linux服务器的Rstudio需要 X11
text4=read.table('clipboard',header=T) #设置有标题
```








## 获取值、筛选、取子集


### (1)获取某一行、某一列、某个元素

数据框获取元素的操作符是 [行index, 列index]，其中可两个参数都可省略。

```
> df1=iris[1:3, ] #取(前3行)子集作为测试数据
> df1
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa


> df1[1, 1] #获取第1行，第1列
[1] 5.1


获取一行
> df1[1, ]
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa

获取一列: 使用列号
> df1[, 1]
[1] 5.1 4.9 4.7

获取列: 使用列名字
> df1$Sepal.Length #取某列
[1] 5.1 4.9 4.7
```

数据框本质是list，每列是一个单位。所以还可以像list一样取元素:
```
> mode(df1)
[1] "list"

> df1[[1]] #取某列，等价写法
[1] 5.1 4.9 4.7

> df1[["Sepal.Length"]] #取某列，等价写法
[1] 5.1 4.9 4.7
```





### (2) 获取子行、子列数据框

```
> df1=iris[1:3, ] #测试数据
> df1
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa


获取【子列】数据框
df1[, c("Sepal.Length", "Species")] #如果取不连续的列，可以用列名
df1[, c(1,5)] #也可以用向量，取列时可省略逗号(不建议省略，防止误解)
df1[c(1,5)] #不推荐
#  Sepal.Length Species
#1          5.1  setosa
#2          4.9  setosa
#3          4.7  setosa


返回【子行】数据框
df1[1:3,] #1到3行
df1[c(1,3),] #1和3行
```




### (3) 使用which对行过滤filter: 布尔值、是否在集合

使用 布尔值 + which()筛选符合要求的行，是数据处理中最常用的操作。

- which() 返回的是符合条件的下标向量，`> which( mtcars$gear == 5)` 返回 `[1] 27 28 29 30 31`。然后就回到了(2)
- 布尔值则是返回和原行数相等的布尔值向量，然后向量给出T的行，不返回F的行。
- 因为机制不同，所以不能并列使用。不过把逻辑判断放到which内是可以的。

```
#选出 gear 列是5的行

> mtcars[mtcars$gear == 5, ] #使用布尔值: mtcars$gear == 5 是一个布尔值向量
                mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2  26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa   30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2
Ford Pantera L 15.8   8 351.0 264 4.22 3.170 14.5  0  1    5    4
Ferrari Dino   19.7   6 145.0 175 3.62 2.770 15.5  0  1    5    6
Maserati Bora  15.0   8 301.0 335 3.54 3.570 14.6  0  1    5    8


> mtcars[which( mtcars$gear == 5), ] #使用子行下标
                mpg cyl  disp  hp drat    wt qsec vs am gear carb
Porsche 914-2  26.0   4 120.3  91 4.43 2.140 16.7  0  1    5    2
Lotus Europa   30.4   4  95.1 113 3.77 1.513 16.9  1  1    5    2
Ford Pantera L 15.8   8 351.0 264 4.22 3.170 14.5  0  1    5    4
Ferrari Dino   19.7   6 145.0 175 3.62 2.770 15.5  0  1    5    6
Maserati Bora  15.0   8 301.0 335 3.54 3.570 14.6  0  1    5    8

注意，上一条 列名是空的，表示全部都要。
如果想只看某几列，可以给出列名:
> mtcars[which( mtcars$gear == 5), c("mpg", "carb")]
                mpg carb
Porsche 914-2  26.0    2
Lotus Europa   30.4    2
Ford Pantera L 15.8    4
Ferrari Dino   19.7    6
Maserati Bora  15.0    8
```


使用逻辑值，输出略。
```
> mtcars[which( mtcars$gear == 5 & mtcars$carb == 2), ] # gear 为5，且 carb为2
> mtcars[which( mtcars$gear == 5 | mtcars$carb == 2), ] # gear 为5，或 carb为2
> mtcars[which( !(mtcars$gear == 5) & mtcars$carb == 2), ] # gear 不为5，且 carb为2
```

使用集合

```
> mtcars[which( mtcars$gear %in% c(3,4) ), ]   # 保留 gear 的值在 c(3,4)的行
> mtcars[which( !mtcars$gear %in% c(3,4) ), ]  # 保留 gear 的值 不在 c(3,4)的行
```





### (4) 使用 subset() 函数筛选行

```
# gear >4 且 carb 为2的行，只显示3列
> subset( mtcars, subset = gear >4 & carb == 2, select=c("mpg", 'gear', 'carb') )
               mpg gear carb
Porsche 914-2 26.0    5    2
Lotus Europa  30.4    5    2


# 行名以 Merc 开头，gear>3的行
> subset( mtcars, subset= startsWith(rownames(mtcars),"Merc") & gear >3 )
           mpg cyl  disp  hp drat   wt qsec vs am gear carb
Merc 240D 24.4   4 146.7  62 3.69 3.19 20.0  1  0    4    2
Merc 230  22.8   4 140.8  95 3.92 3.15 22.9  1  0    4    2
Merc 280  19.2   6 167.6 123 3.92 3.44 18.3  1  0    4    4
Merc 280C 17.8   6 167.6 123 3.92 3.44 18.9  1  0    4    4
```



### (5) 使用 SQL 查询

sqldf包支持SQL查询。

```
# install.packages("sqldf")
> library(sqldf)
> result = sqldf("select mpg,gear,carb from mtcars where gear>=5 and carb>2")
> result
   mpg gear carb
1 15.8    5    4
2 19.7    5    6
3 15.0    5    8
```






## 遍历

- 常规解决不了的就用遍历。虽然效率可能不理想，但至少先work。
- 如果需要比较复杂的比较，甚至计算、函数调用，则不得不遍历。
- 有时候遍历是为了获取新的数据，并不做筛选。


```
> df2=mtcars[1:2, 1:4]
> df2
              mpg cyl disp  hp
Mazda RX4      21   6  160 110
Mazda RX4 Wag  21   6  160 110

# 遍历每个元素
> for(i in 1:nrow(df2)){
   for(j in 1:ncol(df2)){
     print(df2[i,j])
   }
 }
[1] 21
[1] 6
[1] 160
[1] 110
[1] 21
[1] 6
[1] 160
[1] 110
```


### for 遍历筛选 gear >=5 且 carb>2的行
```
> df2=mtcars;
> result=NULL
> for(i in 1:nrow(df2)){
   tmp=df2[i, ]
   if( tmp$gear>=5 & tmp$carb>2 ){
     result = rbind(result, tmp)   #记录符合条件的行
   }
 }
> result
                mpg cyl disp  hp drat   wt qsec vs am gear carb
Ford Pantera L 15.8   8  351 264 4.22 3.17 14.5  0  1    5    4
Ferrari Dino   19.7   6  145 175 3.62 2.77 15.5  0  1    5    6
Maserati Bora  15.0   8  301 335 3.54 3.57 14.6  0  1    5    8
```




### apply 遍历筛选 gear >=5 且 carb>2的行
```
> keep=apply(mtcars, 1, function(x){
   ifelse(x[['gear']]>=5 & x[['carb']]>2, T, F)
 })
> mtcars[keep,]
                mpg cyl disp  hp drat   wt qsec vs am gear carb
Ford Pantera L 15.8   8  351 264 4.22 3.17 14.5  0  1    5    4
Ferrari Dino   19.7   6  145 175 3.62 2.77 15.5  0  1    5    6
Maserati Bora  15.0   8  301 335 3.54 3.57 14.6  0  1    5    8
```










## 修改

### df 转为 list: unclass()

```
> unclass(iris[1:3,])
$Sepal.Length
[1] 5.1 4.9 4.7

$Sepal.Width
[1] 3.5 3.0 3.2

$Petal.Length
[1] 1.4 1.4 1.3

$Petal.Width
[1] 0.2 0.2 0.2

$Species
[1] setosa setosa setosa
Levels: setosa versicolor virginica

attr(,"row.names")
[1] 1 2 3
```


### 修改数据类型









## 新增

## 删除

## 转置



## 连接合并

## 计算






(5)数据框操作







#取子集
subset(Puromycin, state == "treated" & rate > 160)
subset(Puromycin, conc > mean(conc))


#添加新列的三种方法。iconc=1/conc
a=head(Puromycin);a
#方法1
a$iconc=1/a$conc;a
#方法2：使用with
a$iconc=with(a,1/conc);a
#方法3：用 transform( )函数, 且可一次性定义多个变量
a=transform(a, iconc=1/conc, sqrtconc=sqrt(conc));a










