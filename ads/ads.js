/*
<div class="col middle-column">
<div class="topbar-adBox">
	<a target="_blank" href="/about.html#ads"><p class=big></p></a>
</div>
*/

// ads css
var oCss=document.createElement('link')
oCss.setAttribute('href', '/ads/ads.css')
oCss.setAttribute('type', 'text/css')
oCss.setAttribute('rel', 'stylesheet')
document.body.append(oCss)

// top ads
var oP=document.createElement('p')
oP.setAttribute('class', 'big')
oP.innerHTML='生信QQ群: 187923577; 广告位(A1): jimmyMall at 163.com'
//
var oA=document.createElement('a')
oA.setAttribute('target', '_blank')
oA.setAttribute('href', '/about.html#ads')
oA.append(oP)
//
var oDiv=document.createElement('div')
oDiv.setAttribute('class', 'topbar-adBox')
oDiv.append(oA)
//
var oArticle=document.getElementsByClassName('article')[0]
oArticle.parentElement.insertBefore(oDiv, oArticle)




/*****************
* google adsense 
*******************/
//<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9506119208881563"
//     crossorigin="anonymous"></script>
//window.addEventListener('load', function(){}, false)
setTimeout(function(){
	var oAdSense=document.createElement('script');
	oAdSense.setAttribute('async','async')
	oAdSense.setAttribute('crossorigin','anonymous')
	oAdSense.setAttribute('src', "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9506119208881563")
	//
	document.body.append(oAdSense)
	console.log("ad sense...")
}, 0)