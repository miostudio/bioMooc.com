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
oP.innerHTML='广告位出租(编号:A1)  联系: jimmymall at 163 dot com'
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
