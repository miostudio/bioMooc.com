
/******************************************
* 我自己定义的函数: for tpl4
* v0.1
******************************************/

/** 返回创建的dom元素
* 只有第一个参数是必须的。
* 其余2个参数可选。
*/
function createElement(tag, json, innerHTML){
	var json=json||{};
	var dom=document.createElement(tag);

	if(json!=undefined){
		for(var key in json){
			dom.setAttribute(key,json[key]);
		}
	}

	if(innerHTML!=undefined){
		dom.innerHTML=innerHTML;
	}
	return dom;
}



/**
* name: 为嵌入 markdow 的html页面生成顶部目录
* version: 0.1
* version: 0.2 修正点击锚点错位一行的问题
* version: 0.3 修正目录计数，都从1开始；准确定位URL中锚点位置；
* version: 0.4 修正为ul，适合页面
*/
function addContents(){
	var oMd=document.getElementsByClassName("markdown")[0],
		aH=oMd.querySelectorAll("h1,h2,h3,h4,h5,h6"),
		oUl=createElement('ul');

	//创建content
	oContent=createElement('div',{'class':"content"},"")
	oMd.parentElement.insertBefore(oContent, oMd) //加入文档流

	//1. add "目录"
	//oContent.appendChild(createElement('h2',{},'Contents' ))

	for(var i=0;i<aH.length;i++){
		var j=i+1;
		var oH=aH[i],
			text=oH.innerText,  //"5.启动nginx"
			tagName=oH.tagName;  //"H3"
		var indentNum='indent_'+ tagName.replace("H",''); //标题缩进行数

		if(text.trim()!=""){
			// if h tag is empty, do nothing
			//1. add anchor
			//console.log(i,tagName, text,  aH[i])
			//oH.parentNode.insertBefore( createElement('p',{}, ''), oH);//占位置
			oH.parentNode.insertBefore( createElement('a',{'name':j,
				'my-data':'anchor',
				'style':"margin-top:-1px; padding-top:1px; border:1px solid rgba(0,0,0,0.0);"
			},), oH ); //h前添加锚点,无显示

			//2. show in the contents
			var innerSpan = createElement('span',{},text );
			var innerLi = createElement('li',{'class':'text_menu '+indentNum} );
			// 添加点击锚点
			var innerA = createElement('a',{'href':'#'+j, 'title':tagName+": "+text}); //鼠标悬停提示文字
			// 装载锚点 
			innerLi.appendChild(innerSpan);
			innerA.appendChild(innerLi);
			oUl.appendChild( innerA );
		}
	}
	oUl.appendChild( createElement("hr") ); //添加目录末尾分割线

	//2. add contents
	oContent.appendChild( oUl); //加入文档流
}
