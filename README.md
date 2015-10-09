# pager-for-true-paging

写这个小插件主要是为了后台开发人员在写分页的时候更加得心应手，逻辑清晰，含括分页需要的各种功能。


##引入pager.js

首先确保先引入jquery，之后再引入pager.js，它会产生一个名为`pageView`的全局对象，请避免重名。

##页面模块定义

在页面中定义相应的列表模块和分页模块，页面分页和查询用ajax局部刷新实现。举个粟子：
页面中的列表和分页模块如下:

```html
<div class="recycle-result">
    <#--[[列表容器-->
    <div id="pageList">	
     </div>
    <#--列表容器]]-->   
    <#--[[翻页容器-->
    <div id="pageView">
    </div> 
    <#--翻页容器]]--> 
</div>
```
“列表容器”包含的页面是ajax局部返回的，java代码可实现返回到列表容器所在的模块。

##页面初始化加载

按照代码逻辑，刚进入搜索结果页可执行分页插件，默认查询第一页的记录。如带有参数可以自行添加在urlRequestData对象中。
初始化分页配置如下：
```js
pageView.initParam({
		pageContainer:$("#pageView"),//分页的容器
		pageListContainer:$("#pageList"),//列表的容器
		pageViewName:'pageView',//分页对象名字
		url:base+'/queryByKeyWords.do',//获取分页数据远程url
		urlRequestData:{
			keyWord:$('#keyWord').val()
		}//获取分页数据远程url所需的参数当前页除外	
	});
	pageView.goPage(1);
```

Thanks!