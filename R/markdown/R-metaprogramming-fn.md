# 原生R操纵函数


## 参考资料 

- [very good] 官方文档 https://cran.r-project.org/doc/manuals/R-lang.html#Computing-on-the-language
- 书籍 [《Metaprogramming in R》](https://www.programmer-books.com/wp-content/uploads/2019/05/Metaprogramming-in-R.pdf), 配套的[Github](https://github.com/Apress/metaprogramming-in-r)



# 操纵函数调用 Manipulation of function calls

- https://cran.r-project.org/doc/manuals/R-lang.html#Manipulation-of-function-calls




# 操纵函数 Manipulation of functions

- https://cran.r-project.org/doc/manuals/R-lang.html#Manipulation-of-functions

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

