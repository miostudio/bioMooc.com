# 矩阵 matrix

矩阵主要用于数值计算，直接使用的不多。非要用的时候一般都是写C++扩展实现。

点到为止，以后再补充。


```
转置 t()
提取对角线元素 diag()
矩阵按行合并 rbind()，按列合并 cbind()

a2=matrix(1:6,2,3);a2
a2*a2 #矩阵的逐元乘积
a2 %*% t(a2) #矩阵的代数乘积(点乘)


m = matrix(1:12, nrow=3); m
apply(m, MARGIN=1, FUN=mean) # 求各行的均值
apply(m, MARGIN=2, FUN=mean) # 求各列的均值
scale(m, center=T, scale=T) #标准化
```




例1: 中心化与标准化

```
#所谓中心化就是将数据减去均值后得到的，比如有一组数据(1,2,3,4,5,6,7)，它的均值是4，中心化后的数据为(-3，-2，-1，0，1，2，3)
#  而标准化则是在中心化后的数据基础上再除以数据的标准差
#  在R语言中可以通过scale函数直接进行数据的中心化和标准化：Scale(x,center,scale)

# 参数解释：x—即需要标准化的数据
#   center—表示是否进行中心化
#   scale—表示是否进行标准化
c1=c(1,2,3,4,5,6,7)
t( scale(c1,scale=F) ) #仅中心化 -3 -2 -1 0 1 2 3
c1.sd=sd(c1) #标准差
scale(c1,scale=F)/c1.sd == scale(c1)


#sweep(X, MARGIN, STATS, FUN) #表示从矩阵X中按MATGIN计算STATS，并从X中除去(sweep out).
#减去中位数:
m
#     [,1] [,2] [,3] [,4]
#[1,]    1    4    7   10
#[2,]    2    5    8   11
#[3,]    3    6    9   12

row.med = apply(m, MARGIN=1, FUN=median); row.med
sweep(m, MARGIN=1, STATS=row.med, FUN='-') #
sweep(m, MARGIN=1, STATS=1:3, FUN='+') #按行分别加上1 2 3
#     [,1] [,2] [,3] [,4]
#[1,]    2    5    8   11
#[2,]    4    7   10   13
#[3,]    6    9   12   15
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


### (3) 从文件中读取数据框: read.table() read.csv()读取一个文本文件，返回Data Frame对象

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




### (4) 从字符串中读取数据表

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





### (5) 从内存中读取数据

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





## (2) 获取子行、子列数据框

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
```











## 修改

## 新增

## 删除

## 转置

## 遍历

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














# 4.列表 list

