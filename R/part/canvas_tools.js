/**==========================
* 功能： 单击、双击获取颜色hex
*==========================*/
console.log('Tips: 对于canvas上的色彩，单击获取一个颜色，双击获取一行颜色(unique colors);')
// rgb to hex
function rgb2hex(rgbArr) {
	var rgb =  rgbArr; //color.split(',');
	var r = rgb[0]
	var g = rgb[1]
	var b = rgb[2];
	var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return hex;
}

//get one color
function getColor(event){
	//获取鼠标的canvas画布坐标，通过js方法 [经典语句]
	var canvas=this;
	var ctx=canvas.getContext('2d');
	var x=event.clientX-canvas.getBoundingClientRect().left;//当前鼠标x位置，减去画布左侧的区域
	var y=event.clientY-canvas.getBoundingClientRect().top;
	
	//获取颜色
	var imgData=ctx.getImageData(x,y,1,1);
	//getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。
	var r=imgData.data[0];
	var g=imgData.data[1];
	var b=imgData.data[2];
	var hex=rgb2hex([r,g,b])
	console.log('%c'+hex, 'background:'+hex)
}

// get a line color
function getColors(event){
	//获取鼠标的canvas画布坐标，通过js方法 [经典语句]
	//console.log(this)
	var canvas=this;
	var ctx=canvas.getContext('2d');
	var x=event.clientX-canvas.getBoundingClientRect().left;//当前鼠标x位置，减去画布左侧的区域
	var y=event.clientY-canvas.getBoundingClientRect().top;
	
	//获取这一行的全部颜色
	var colorSet=[]
	for(var i=0;i<canvas.width; i++){
		var imgData=ctx.getImageData(i,y,1,1);
		//getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。
		var r=imgData.data[0];
		var g=imgData.data[1];
		var b=imgData.data[2];
		var hex=rgb2hex([r,g,b])
		if(colorSet.indexOf(hex)==-1){
			colorSet.push(hex)
		}
	}
	console.log(colorSet, colorSet.length)
	//
	var bgcolor=('background:'+colorSet.join('; |background:') ).split(' |');
	console.log.apply(null, ['%c "'+colorSet.join('", %c "')].concat(bgcolor) )
}

// 为画板绑定事件: 单击、双击
var ctxArr=[ctx1, ctx2, ctx3, ctx4];
for(var i=0; i<ctxArr.length; i++){
	var ctx=ctxArr[i]
	//console.log(i, ctx)
	ctx.canvas.addEventListener('click', getColor); //单击单个颜色
	ctx.canvas.addEventListener('dblclick', getColors); //双击一行，uniq color
}

