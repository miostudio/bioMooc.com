广告的加载顺序:

$.getScript("/wp-content/themes/biomooc/assets/js/main.js?v=1.15");//回到顶部js文件
	$.getScript("/ads/ads.js"); //加载广告
		console.log("ad sense...")



目标: 怎么让加载更流畅？