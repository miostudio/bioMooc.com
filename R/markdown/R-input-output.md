# 文件与文件夹操作


## 快速索引表

```
rm(list=ls()) 
path = '~/dir/' 
setwd(path) 


## 写入文本文件
cat("file A\n", file="A.txt") #创建一个文件A.txt，文件内容是’file A’,’\n’表示换行，这是一个很好的习惯 

whole_article="this is a html"
write(whole_article, file = "index.html")   #把某个字符串写入文件

cat("file B\n", file="B.txt") #创建一个文件B.txt 

file.append("A.txt", "B.txt") #将文件B的内容附到A内容的后面，注意没有空行 
检查
$ cat A.txt 
file A
file B


file.create("A.txt") #创建一个文件A.txt, 注意会覆盖原来的文件 
file.append("A.txt", rep("B.txt", 10)) #将文件B的内容复制10遍，并依次附到文件A内容后 
file.show("A.txt") #新开工作窗口显示文件A的内容 
file.copy("A.txt", "C.txt")  #复制文件A保存为C文件，同一个文件夹 


dir.create("tmp") #创建名为tmp的文件夹 
file.copy(c("A.txt", "B.txt"), "tmp") #将文件夹拷贝到tmp文件夹中 


list.files("tmp") #查看文件夹tmp中的文件名 
unlink("tmp", recursive=F) #如果文件夹tmp为空，删除文件夹tmp 
unlink("tmp", recursive=TRUE) #删除文件夹tmp，如果其中有文件一并删除 
file.remove("A.txt", "B.txt", "C.txt") #移除三个文件


file.create("mytest.R") #创建mytest.R文件 
file.exists("mytest.R") #查询文件是否存在 
dir.exists(aa) ##查询目录aa是否存在 


file.info("mytest.R") #查询文件包含信息
file.info("mytest.R")$mode #特定信息 


file.rename("mytest.R", "mytest2.R") #重命名 文件
file.remove("mytest.R") #删文件
file.copy("mytest2.R", "mytest3.R") #复制为mytest3.R文件 

file.copy("D.txt", "C.txt", overwrite = TRUE)  #C.txt已存在，设置overwrite = TRUE进行覆盖

#复制D.txt中的内容10遍，添加到文件A.txt和B.txt
file.append(c("A.txt", "B.txt"), rep("D.txt", 10))

file.path("mytest3.R")  #拼接路径

#只有window版的R支持 choose.dir 函数
> data_dir = choose.dir(default="./", caption="choose an input dir") 
```







## 1. 工作目录
```
setwd("/home/wangxx/proj1/") #设置
getwd() #获取 
```

最好永远不要使用 setwd() ，从根本上防止你的代码只能在你的电脑工作，无法移植到其他电脑上的难题。


### 推荐使用 R project，配合设置相对目录变量:

```
outputRoot="/home/wangxx/proj1/"

pdf( paste0(outputRoot, "xx1/01_yy.pdf"), width=4, height=4)
plot(c(1))
dev.off()
```



### 文件管理主要函数

```
setwd( )：设定R软件当前工作目录。
getwd( )：查看R软件当前工作目录。

list.files( ): 查看当前目录下文件。
file.show( ): 显示文件。

file.access(names, mode=0): 查看文件是否存在、可执行、可读可写

file.create( ): 创建一个文件。例如：file.create(“D:/lesong.xls”).
dir.create( ): 创建一个目录。例如：dir.create(D:/lesong).

file.remove( ):删除一个文件。

File.choose( ):弹窗，选择一个文件，返回其路径


library(fs)
file_create()
dir_create()
link_create(): 创建链接
```








## 2. 文件夹操作 dir 

### (1)dir是否存在？
```
> dir.exists("pdf")
[1] TRUE

> dir.exists("output")
[1] FALSE
```


### (2) 创建目录和文件

- 创建目录使用dir.create()
- 当创建多级目录时，令recursive = TRUE即可。
- 创建空文件使用file.create()

```
> if( !dir.exists("output") )
	dir.create("output")
> saveRDS(pbmc, file = "output/pbmc_tutorial.rds")
```





### (3) 获取路径下的文件和目录 list.files()/dir() /list.dirs()
```
list.files() #查看当前目录下的子目录和文件
dir()       #查看当前目录下的子目录和文件

list.dirs() #查看当前目录下的子目录
# These functions produce a character vector of the names of files or directories in the named directory.
```

dir() 示例，相当于 ls
```
> dir('./')
[1] "4cluster"   "c1.bam"     "c1.bam.bai"

# 函数的完整形式: 
dir(path = ".", pattern = NULL, all.files = FALSE,
           full.names = FALSE, recursive = FALSE,
           ignore.case = FALSE, include.dirs = FALSE, no.. = FALSE)

参数解释:
path 指定路径 > dir(path="/etc/")
pattern 指定文件名字的模式，支持正则表达式，比如o结尾的
	> dir(path="/etc/", pattern = "o$")
	[1] "rstudio"  "terminfo"
```



list.files 效果同 dirs()，只是函数名字的意义更明确。
```
> list.files(path="~/Downloads/" )
[1] "anki-2.1.49-linux"                     "anki-2.1.49-linux.tar.bz2"            
[3] "w.step1.Figure2.CD8_Tex_velo.html"     "w.step2.FigureS20.CD8_ovTex_velo.html"

> sample = list.files(path="~/Downloads/", pattern="html$" ); sample
[1] "w.step1.Figure2.CD8_Tex_velo.html"     "w.step2.FigureS20.CD8_ovTex_velo.html"
```







### (4) 是否是文件夹 

```
> file_test("-f", "mytest2.R") #"-f"判断是否为文件, "-d"判断是否为目录
[1] TRUE
> file_test("-d", "tmp2")
[1] TRUE
```


### (5) 删除目录和文件

有两个函数可以使用 file.remove 和 unlink ，其中unlink函数使用同删除目录操作是一样的。

> 警告：删除操作是危险操作，请谨慎操作！



### (6) 调用系统命令查看文件结构 `system("ls -lth")`

```
> system("tree") #通过系统命令查看目录结构
.
├── mytest2.R
├── mytest3.R
└── tmp2
    └── index.html

> system("ls -lth")
```



### (7) 获取路径(dirname)、获取文件名(basename)、组装路径(file.path)

```
# 获取路径，相当于去掉最后的文件名
> dirname("/p1/p2/p3/a.txt") #最后一个结尾没有/
[1] "/p1/p2/p3"

# 获取最后的文件名，丢掉前面的路劲
> basename("/p1/p2/p3/a.txt")
[1] "a.txt"

# 组装路径和文件名，自动使用斜线分割
> file.path("", "p1", "p2", "p3", "a.txt")
[1] "/p1/p2/p3/a.txt"
```


```
# 构建路径，可以使用相对路径符、家目录符
> folder = file.path("~", "data"); folder
[1] "~/data/"
> a1 = list.files(folder)  #相当于 ls

> a2 = system("ls ~/data", intern=T)

> setequal(a1, a2) #这2个集合相等
[1] TRUE


#构建路径，有点像字符串拼接函数
> file.path("some", "path", "to","index.html", fsep="|") #确实可拼接字符串
[1] "some|path|to|index.html"
```






## 3. 文件操作 file 



### (1) 文件复制
```
# file.copy(fromfilepath, tofilepath) #就是把文件 fromfilepath 复制到 tofilepath

> file.copy("/etc/rstudio/rsession.conf", "/home/rstudio/")
[1] TRUE
```




### (2) 文件改名字(重命名)

```
> filename = list.files()   #可以设置参数pattern="*.txt",选择特定文本类型
> filename
[1] "aaa.pdf"     "Rplot01.pdf" "Rplot02.pdf"
> file.rename(filename,c("11.pdf","22.pdf","33.pdf"))  # 重命名

> list.files()
[1] "11.pdf" "22.pdf" "33.pdf"


# 使用全名
> list.files(full.name = TRUE)
[1] "./mytest2.R" "./mytest3.R" "./tmp2"
```




### (3) 统计某路径下有几个文件/文件夹

```
> filename = list.files("/etc/")
> table(dir.exists( paste0("/etc/", filename) )) 
FALSE  TRUE 
   70    57
70个文件，57个文件夹。
```









## 实例 


### 1.遍历某路径下子文件夹内的gz文件，并复制到另一个地方

```
for(wd in filepath){
  files = dir(path=wd,pattern="gz$")
  #查看满足条件文件
  fromfilepath = paste(wd,"\\",files,sep="")
  file.copy(fromfilepath, tofilepath)
}
```



























# 读写文件(input and output, IO)

```
read.table(file, header = FALSE, sep = "", quote = "\"'",
           dec = ".", numerals = c("allow.loss", "warn.loss", "no.loss"),
           row.names, col.names, as.is = !stringsAsFactors,
           na.strings = "NA", colClasses = NA, nrows = -1,
           skip = 0, check.names = TRUE, fill = !blank.lines.skip,
           strip.white = FALSE, blank.lines.skip = TRUE,
           comment.char = "#",
           allowEscapes = FALSE, flush = FALSE,
           stringsAsFactors = FALSE,
           fileEncoding = "", encoding = "unknown", text, skipNul = FALSE)

read.csv(file, header = TRUE, sep = ",", quote = "\"",
         dec = ".", fill = TRUE, comment.char = "", ...)

read.csv2(file, header = TRUE, sep = ";", quote = "\"",
          dec = ",", fill = TRUE, comment.char = "", ...)

read.delim(file, header = TRUE, sep = "\t", quote = "\"",
           dec = ".", fill = TRUE, comment.char = "", ...)

read.delim2(file, header = TRUE, sep = "\t", quote = "\"",
            dec = ",", fill = TRUE, comment.char = "", ...)
```



## 1.小文件读到内存(几行)

(1)本文件内读取示例数据
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



(2)更简洁的写法：
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

以上适合小数据及，大型数据集还是要从文件读取。






## 2. 单列文件的读写

(1)读入一列基因名字:
```
geneList2=readLines("geneList2.txt")
```

(2) 把id写入文件，一个id一行，不要行列标题
```
#最简单形式
writeLines(ls(), 'ls.txt') #第一个元素是一个向量
# 输出:
# e1
# p1
# p2


> writeLines(iris$Species, "dustbin/iris.txt") #必须是字符，否则报错
Error in writeLines(iris$Species, "dustbin/iris.txt") : 
  can only write character objects
> class(iris$Species) #确实是因子
[1] "factor"
> writeLines(as.character(iris$Species), "dustbin/iris.txt") #还必须是字符，不能是因子


# 复杂形式（不建议使用）
write.table(colnames(iris), file="cid.txt",
            quote=F, row.names = F, col.names = F)
```





## 3. 一般文件读写

```
> write.table(iris, 'dustbin/iris.txt')
> dat = read.table('dustbin/iris.txt')
> head(dat, n=2)
  Sepal.Length Sepal_Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
```


(1) 一次读入数据框

- 更多参数
	* header = T 包含文件头
	* sep="\t" 指定分隔符为tab
	* row.names=1 指定行名为第一列
	* stringsAsFactors = F 字符列不转为因子，保持 character

```
fileName="D:/coding/Java/CCDS.20160908.txt";
#a= read.table(choose.files(),sep = '\t', stringsAsFactors = F, header = T)# 选择你下的CCDs文件，只有 MS win 系统有 choose.files() 函数
a = read.table(fileName, sep = '\t', stringsAsFactors = F, header = T)# 选择你下的CCDs文件

newdata = read.csv(file = "data.csv", row.names=1, stringsAsFactors = F, sep = ",")
```

> 教训：一定要加入 stringsAsFactors = F，否则数据可能会异常。

> R认为列名的短横线-是无效的，所以如果读入的列名中包含了-，它会默认将其替换为点号“.”。匹配或获取列名时要特别注意检查。







## 4. R语言逐行读取并处理，大文件最好逐行读取: readLines(con,n=1)

用R语言作分析时，有时候需要逐行处理非常大文件，各种教材中推荐的read.table 和scan都是一次性读入内存，如果文件有好几个Gb大小，一般电脑肯定吃不消。

其实R中可以逐行读取的行数，这里示例一个函数，作为备忘：

```
con = file("e:/data.txt", "r")
line=readLines(con,n=1)
while( length(line) != 0 ) {
     print(line)  #操作本行
     line=readLines(con,n=1)  #读取下一行
}
close(con)
```


如果需要将一行的文字劈成多段，再进行处理，可以用strsplit函数，除此之外，还有一些常用的字符串处理函数，记录如下：
substr(),nchar(), grep(), regexpr(), sub(), gsub()




### 文件打开失败怎么关闭连接？设置函数内退出处理 on.exit()

这样在异常时可能不能及时关闭资源，有博文建议如下方式写：
http://stackoverflow.com/questions/6304073/warning-closing-unused-connection-n

```
getCommentary = function(filepath) {
    con = file(filepath) 
    on.exit(close(con)) #这样，不管函数因为什么原因结束，都会关闭该资源链接。
	
    Commentary = readLines(con)
    Commentary
}

getCommentary("foo.txt")
```








## 5. 数据对象(object)的读写: `.RData`(保存变量名), `.Rds`(不保存变量名，推荐)


(1) R对象的保存(save/load): RData 格式，原样读写，保存 变量名字和值

风险是，读入时有可能覆盖已有的同名变量的值。

```
i) 整个工作空间的对象都写入硬盘
save.image("img.RData")	#保存工作空间到文件 myfile 中(默认值为.RData)
load("img.RData") #读取一个工作空间到当前会话中(默认值为.RData)


ii) 单个对象写入硬盘
> lst2=list(number=1:5, data=head(iris) );
> str(lst2)
List of 2
...


# 变量名和值写入硬盘：
> save(lst2, file='dustbin/lst2.RData');    #保存指定对象到一个文件中
> save(lst2, iris, file='dustbin/lst2.RData'); # 也可以是多个对象


# 从硬盘读取变量名和值
> load("dustbin/lst2.RData")
> ls()
[1] "iris" "lst2"
```


(2) R对象的保存(saveRDS/readRDS): Rds 格式，只保存变量值，不保存变量值，能读到指定变量中

特别适合保存单个大数据对象，比如 Seurat 对象。


```
# 创建对象(一个微型化的类)
setClass("Person", slots = c(
  name="character",
  age="numeric"
))

# 创建该类的show方法
setMethod("show", "Person", function(object){
  cat(sprintf("Class: Person, name:%s, age=%d", object@name, object@age))
})

p2=new("Person", name="Lily", age=18)
p2
> p2
Class: Person, name:Lily, age=18
```


```
> saveRDS(p2, "p2.obj.Rds") #保存R对象

> girl = readRDS("p2.obj.Rds") #读到新变量中
> girl
Class: Person, name:Lily, age=18
```





## 6.执行外部(函数)源码文件: source()
```
> source("xx.func.R")
```





## 7. 直接编辑文件，如果不存在就新建该文件: file.edit()

```
> file.edit( paste0(rootPath, keyword, ".R5.Colon_nue.cluster3VS5.DEG.txt"))
```






## 8. 使用 sink() 函数把 R 输出导出到文本文件(You want to write output to a file.)

- http://www.cookbook-r.com/Data_input_and_output/Writing_text_and_output_from_analyses_to_a_file/
- 这个方法特别适合写成输出函数，比如输出 DEG list，样本信息，日期等。

(1) 使用方法
```
getwd()
dir("my_output/")

# Start writing to an output file
output_file='my_output/analysis-output-test.txt'
sink(output_file)

set.seed(12345)
x = rnorm(10,10,1)
y = rnorm(10,11,1)
# Do some stuff here
cat(sprintf("x has %d elements:\n", length(x)))
print(x)
cat("y =", y, "\n")

cat("======= ============ ==========\n")
cat("T-test between x and y\n")
cat("======= ============ ==========\n")
t.test(x,y)

# Stop writing to the file
sink()



# Append to the file
sink(output_file, append=TRUE)
cat("Some more stuff here...\n")
sink()
```

(2) 查看文件内容
```
x has 10 elements:
 [1] 10.585529 10.709466  9.890697  9.546503 10.605887  8.182044 10.630099  9.723816  9.715840  9.080678
y = 10.88375 12.81731 11.37063 11.52022 10.24947 11.8169 10.11364 10.66842 12.12071 11.29872 
======== =========== ==========
T-test between x and y
======== =========== ==========

	Welch Two Sample t-test

data:  x and y
t = -3.8326, df = 17.979, p-value = 0.001222
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 -2.196802 -0.641042
sample estimates:
mean of x mean of y 
 9.867056 11.285978 

Some more stuff here...
```








## 9. 读取 gz 压缩过的文本文件 gzfile()
(1) 实例
```
> outputRoot="/home/wangjl/data/"

> df1=read.table(gzfile( paste0(outputRoot, "fastq/counts.tsv.gz")), header = T)
> head(df1)
                  gene     cell count
1 ENSMUSG00000000001.5 AAACACCA    25
2 ENSMUSG00000000001.5 AAACGAGA    78
3 ENSMUSG00000000001.5 AAACTTAG    11
```





## 10. 读取 excel 文件: xlsx 包


(1) 安装

安装 Java: 自己搜索吧。

装包: `> install.packages('xlsx')`




(2) 使用
```
library(xlsx)
dat = read.xlsx("data.xlsx", sheetName = "Sheet1", encoding = 'UTF-8')
```

一个标准的数据读取如上所示，下面将几个常用的参数：

- "data.xlsx"：表示读取数据的名称。
- sheetName：表示读取表中表的名称，通常第一个就是Sheet1。
- encoding：这个在读取中文数据的时候是一定要加上的，不然读取数据会出现乱码。
- sheetIndex：表示读取文件中第几个表，sheetIndex = 1表示读取文件中第一个表。

需要特别注意：当文件中我们的表明为中文字时，不能使用类似sheetName = "表1"进行读取，即使加上encoding = 'UTF-8'也会出现读取错误，这时就需要使用sheetIndex来进行读取。


- Ref: https://www.r-bloggers.com/2013/07/read-excel-files-from-r/







## 11. R list 与 json文件 的互转(相当于序列化)


要先安装R包 jsonlite: `install.packages("jsonlite")`


1.写入json文件

```
# 准备list数据
colorSets=list(
  "group1"=c('red','blue','#FF9600'),
  "group2"=c('brwon', 'green', '#F000F0'),
  "group3"=c("purple")
)


# 转为 json 格式
library("jsonlite")
> class(jsonlite::toJSON(colorSets))
[1] "json"
> jsonlite::toJSON(colorSets)
{"group1":["red","blue","#FF9600"],"group2":["brwon","green","#F000F0"],"group3":["purple"]} 


# 保存到文件
writeLines(jsonlite::toJSON(colorSets), "data/colors.json")


查看文件内容：
$ cat data/colors.json
{"group1":["red","blue","#FF9600"],"group2":["brwon","green","#F000F0"],"group3":["purple"]}
```

2.读入为list (json file to R list)
```
> colorsSet2=jsonlite::fromJSON("data/colors.json")
> str(colorsSet2) ## List of 3
```








## 其他注意事项

### 读文件时，防止字符变因子: stringsAsFactors=FALSE


字符型数据读入时自动转换为因子，因子是R中的变量，它只能取有限的几个不同值，将数据保存为因子可确保模型函数能够正确处理。
但是当变量作为简单字符串使用时可能出错。

要想防止转换为因子：
1. 令参数stringsAsFactors=FALSE,防止导入的数据任何的因子转换。
2. 更改系统选项options(stringsAsFactors=FALSE)
3. 指定抑制转换的列：as.is=参数。通过一个索引向量指定，或者一个逻辑向量，需要转换的列取值FALSE,不需要转换的列取值TRUE。

```
> data5 = read.csv('item.csv',stringsAsFactors=FALSE)
```


```
> options("stringsAsFactors") #查询
$stringsAsFactors
[1] FALSE

> options(stringsAsFactors=FALSE) #设置(R4.0开始初始化设置为F了)
```


```
> dat=read.table("dustbin/iris.txt", as.is = "Species") #只能是列名，是列编号5还是因子
> str(dat)
'data.frame':	11 obs. of  5 variables:
 $ Sepal.Length: num  5.1 4.9 4.7 4.6 5 5.4 4.6 5 4.4 4.9 ...
 $ Sepal_Width : num  3.5 3 3.2 3.1 3.6 3.9 3.4 3.4 2.9 3.1 ...
 $ Petal.Length: num  1.4 1.4 1.3 1.5 1.4 1.7 1.4 1.5 1.4 1.5 ...
 $ Petal.Width : num  0.2 0.2 0.2 0.2 0.2 0.4 0.3 0.2 0.2 0.1 ...
 $ Species     : chr  "setosa" "setosa" "setosa" "setosa" ...
```



### 中文乱码

如果数据集中含有中文，直接导入很有可能不识别中文，这时加上参数fileEncoding='utf-8'

```
> read.csv('data.csv',fileEncoding='utf-8')
```



- https://www.r-bloggers.com/2021/05/working-with-files-and-folders-in-r-ultimate-guide/


