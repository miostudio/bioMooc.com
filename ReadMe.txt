>biomooc.com

按照 sitemap 组织内容。

git remote add origin https://github.com/MioStudio/biomooc.com.git
git push origin master

miostudio/bioMooc

> v0.1.1 add links: e1071,docker
> v0.1.2 change css: narrow space between links.
	change H2 title styles.

> v0.1.3 add links: work flow
> v0.1.4 change css, add GATK training link.
> v0.1.5 add immoc logo, add qq qun No.
> v0.1.6 change style to Ubuntu
> v0.1.7 add enNewspapers links.html,logo
	> v0.1.7.2 add html title, separate css/links.css to file.add nature,science,cell links.
> v0.1.8 add links to en/links.html	
	> v0.1.8.1 en/links.html add links,add css
	> v0.1.8.2 en/links.html modify css
	> v0.1.8.3 en/links.html add theAtlantic
	> v0.1.8.4 en/links.html edit links
	> v0.1.8.5 add 百度统计 code	[https://tongji.baidu.com: 亲自走路/Bd12345678]
	> v0.1.8.6 添加百度统计查看按钮
		https://tongji.baidu.com/web/welcome/ico?s=e8bfc4624d292f16f30358abd921d748
	> v0.1.8.7 调整描述。
	> v0.1.8.8 add 英文标题。
	> v0.1.8.9 去掉viewport。
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
		添加新周刊名字：
> v0.1.9-1 添加 BI商业内参 
	> v0.1.9-2 添加友情链接。打算改版。 
	> v0.1.9-3 独立tongji文件。 
	> v0.1.9-4 修改utf-8标示。
		<meta http-equiv="Content-Type" content="text/html; charset=utf8" />。 
> v0.2.0 调整 英文杂志链接到ielts中：http://ielts.biomooc.com/en/links.html

--------------------

> v0.2.1 改变后的首页效果
搭建新框架，模仿： http://www.runoob.com

给我发邮件：http://openmail.qq.com
图片转base64编码：http://www.atool.org/img2base64.php
ico图标转换： 	http://www.bitbug.net
html 美化： https://tool.lu/html/


-------------------- dev 分支下进行
	> v0.2.1-1 logo灰色表示没有开通 desaturate。
	整理和归类静态资源。
	还没有自己的icon？logo怎么办？
	> v0.2.1-2 设计火焰形logo，更新微信等地方、favicon.ico
	todo 为什么手机浏览器不显示顶部logo图片？

	> v0.2.1-3 添加linux部分的首页，
	> v0.2.1-4 补充aboutus。精简拆分首页。
	> v0.2.1-5 添加linux目录。fix顶部目录。拆分右侧导航。添加sitemap
index自动跳转
<head>
<!-- 以下方式只是刷新不跳转到其他页面 -->
<meta http-equiv="refresh" content="10">
<!-- 以下方式定时转到其他页面 -->
<meta http-equiv="refresh" content="0;url=linux-tutorial.html"> 
</head>
	
	> v0.2.1-6 替换网站logo为文字，增加两个logo，写到about.html中。

-----------------------------
	> v0.2.1-7 网易云课堂。微调。
网易云课堂申请： http://study.163.com/cp/introduction.htm
	批准入驻-后台：http://cp.study.163.com/400000000359002
	批准入驻-前台：http://study.163.com/provider/400000000359002/index.htm
	绑定网易支付bj卡建行 https://epay.163.com/main.htm 

[20180106提交课程计划]	
章节1:windows和linux下安装R与RStudio
章节2:R语言语法核心：变量类型和运算符
章节3:数据输入与输出I/O
章节4:控制结构（分组、条件和循环）
章节5:函数和面向对象初步
章节6:字符串处理与正则表达式
章节7:基因表达数据与数据框data.frame操作
章节8:R语言绘图（高水平、低水平绘图函数）
章节9:R语言包管理

	已经有其他人的课程了：http://study.163.com/course/introduction/1004104013.htm
		biowolf 更多介绍： http://study.163.com/provider/1026136977/index.htm
-----------------------------


> nav0.2.2 加链接，调顺序 
https://www.ezlippi.com/blog/2017/02/sed-introduction.html

> nav0.2.2-2 加入IGB等工具
	http://bioviz.org/igb/
	v0.2.2-3 添加R/,删除Linux首页中的空格。
	v0.2.2-4 去掉index首页中的//www.biomooc.com 字样。都变成相对URL了。



---------------
todo
1. 热力图，最后使用ggplot2灵活、好看的效果：https://www.plob.org/article/10156.html



