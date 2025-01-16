# shiny 简介

R web app 最简单的写法是使用 shiny 包。

Easy web apps for data science without the compromises

- 官网提供R和python版本的shiny: https://shiny.posit.co/
- 本文主要讲R版本的使用: https://shiny.posit.co/r/getstarted/shiny-basics/lesson1/
- 官方示例 https://github.com/DawnEve/shiny-examples


## 1. 第一个shiny实例

一个shiny webapp 主要包括三个部分，UI函数负责网页界面显示，server函数负责后台数据处理和响应，最后一行shinyApp负责组装以上两个函数。

- 安装: `> install.packages("shiny")`
- bslib 包提供了一些美化组件及主题，基于bootstrap项目。


在一个文件夹中，新建 app.R 文件。

```
$ cat script/app1/app.R
library(shiny)
library(bslib)

ui <- page_sidebar(
  title = "Hello Shiny!",
 
  sidebar = sidebar(
    sliderInput(
      inputId = "bins",
      label = "Number of bins:",
      min = 1,
      max = 50,
      value = 30
    )
  ),
  
  plotOutput(outputId = "distPlot")
)

server <- function(input, output) {
  output$distPlot <- renderPlot({
    x    <- faithful$waiting
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    hist(x, breaks = bins, col = "#007bc2", border = "white",
         xlab = "Waiting time to next eruption (in mins)",
         main = "Histogram of waiting times")
    })
}

shinyApp(ui = ui, server = server)
```

启动方式:

```
> library(shiny)
> runApp("script/app1/")

Listening on http://127.0.0.1:3057
如果是在Rstudio，已经弹出网页窗口。
如果在纯shell R下执行，可能还要做端口转发才能查看网页。


如果想在web界面查看shiny代码，可以在启动时添加 showcase 参数。

runApp("script/app1/", display.mode = "showcase")
```






## 2. 输入和输出




























# Ref

- https://rpubs.com/renyan/946510


