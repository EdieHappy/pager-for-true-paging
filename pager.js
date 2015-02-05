/**
 * User: 12071095
 * Date: 15-2-4
 * Time: 上午9:46
 * To change this template use File | Settings | File Templates.
 */

;(function(window,$){
	'use strict';

	/**全局配置*/
	var pageModel = {
		 /*选填*/
	        pageSize: 15,//每页显示的最大条目数
	        pageStartMax: 5,//页数超过该页数进入省略页数显示状态
	        /*必填*/
	        pageContainer: null,//分页的容器
	        pageListContainer: null,//列表的容器
	        pageViewName: null,//分页对象名字
	        url: null,//获取分页数据远程url
	        urlRequestData: {},//获取分页数据远程url所需的参数当前页除外
	        skin: 'sh-pages',//分页样式皮肤名称
	        /*必不填*/
	        curPage: 1,//当前页
	        totalRecordNumber: null//记录总条数，一定不需要填写
	},
	that;

	/**全局主对象**/
	var pageView = {

		/**
         	* 初始化框架
        	 * @method _init
		*/
		init:function(){
			that = this;
		},

		/**
     		*   可配置分页属性
    		* @param opt 
     		*/
		initParam:function(opt){
			//分页的初始化的参数值与默认值得融合
       		 	$.extend(pageModel, opt);
		},
		/**
         	* 渲染分页
         	* @method renderPager
         	* @param {Number} totalRecordNumber 总的条目数
         	* @param {Number}  每页大小
         	* @param {String} curPageStr 要跳入的页
         	*/
		renderPager:function(totalRecordNumber,pageSize,curPageStr){
			if (totalRecordNumber > 0) {
		        	var curPage = parseInt(curPageStr);
		                /**计算总的页数*/
		                var maxpage = Math.ceil(totalRecordNumber / pageSize);
		                /**显示5个固定页码**/
		                var pageCodeNum = pageModel.pageStartMax;
		                /**初始化显示第一个页码是1**/
		                var blockStartNum = 2;
		                /**初始化显示的最后一个页码是5**/
		                var blockEndNum = pageModel.pageStartMax - 1;
		                if(maxpage<6){
					blockEndNum=maxpage-1;	
		                 }
		                var pageViewName = pageModel.pageViewName;
	
				//构造中间显示区段
				var i = 0;
				if ((curPage >= (pageCodeNum - 1)) && (maxpage > pageCodeNum)) {
					var blockStart = (3 - 1) * i + 3 - 1;
					var blockEnd = (3 - 1) * (i + 1) + 3 - 1;
					var flag = false;
					while (flag != true) {
						blockStart++;//3,4
						blockEnd++;  //5,6
						if ((curPage == (blockStart + 1)) || (blockEnd == (maxpage - 1))) {
							flag = true;//找到了要显示的部分
							blockStartNum = blockStart;
							blockEndNum = blockEnd;
						}
						i++;
					}
				}

				//开始构造分页显示内容
				var pageHtml = [];
	
				//当前页为第一页不可向上翻页（上一页）
				if (curPage == 1) {
					pageHtml.push('<div class="' + pageModel.skin + '"><span class="prev invalid"><b></b><a href="javascript:;">上一页</a></span>');
				} else {
					pageHtml.push('<div class="' + pageModel.skin + '"><span class="prev prev-on"><b></b><a href="javascript:' + pageViewName + '.goPage(' + (curPage - 1) + ');">上一页</a></span>');
				}

				//第一页显示
				if (maxpage >= 1) {
					var firstPageHtml = '<a href="javascript:' + pageViewName + '.goPage(1);" class="page"';
		                if (curPage == 1) {
					firstPageHtml = '<a href="javascript:' + pageViewName + '.goPage(1);" class="page current"';
		                }
		                firstPageHtml = firstPageHtml + ' >1</a>';
		                pageHtml.push(firstPageHtml);
				}

				//前面点的显示
				if (blockStartNum > 2) {
					pageHtml.push('<span class="leave">...</span>');
				}

				//除第一页和最后一页的绘制
				var blockIndex = blockStartNum;
				while (blockIndex <= blockEndNum) {
					var buttonHtml = '<a href="javascript:' + pageViewName + '.goPage(' + blockIndex + ');" class="page"';
					if (blockIndex == curPage) {
						buttonHtml = '<a href="javascript:' + pageViewName + '.goPage(' + blockIndex + ');" class="page current"';
					}
					buttonHtml = buttonHtml + ' >' + blockIndex + '</a>';
		                	pageHtml.push(buttonHtml);
		                	blockIndex++;
		            	}

		            	//末位点的绘制
		            	if ((blockEndNum + 1) < maxpage) {
		        		pageHtml.push('<span class="leave">...</span>');
		            	}

		            	//第maxpage页的绘制
		            	if (maxpage != 1) {
		                	if (curPage == maxpage) {
		                		pageHtml.push('<a href="javascript:' + pageViewName + '.goPage(' + maxpage + ');" class="page current">' + maxpage + '</a>');
		                	} else {
		                    		pageHtml.push('<a href="javascript:' + pageViewName + '.goPage(' + maxpage + ');" class="page">' + maxpage + '</a>');
		                	}
		            	}

		            	//如果当前页是最后一个则下一页不可用（下一页）
		            	var nextPageBtnHtml = '<span class="next next-on"><b></b><a href="javascript:' + pageViewName + '.goPage(' + (curPage + 1) + ');">下一页</a></span>';
		            	if (curPage == maxpage) {
		                	nextPageBtnHtml = '<span class="next invalid"><b></b><a href="javascript:;">下一页</a></span>';
		            	}
		            	pageHtml.push(nextPageBtnHtml);
		            
				//跳至多少页的部分(跳页）
            			pageHtml.push('<span class="gopage">向第<input id="gopagenum" type="text" onafterpaste="this.value=this.value.replace(/D/g,'')" value=' + curPage + '>');
        			pageHtml.push('页</span><div class="go-btn">跳转</div>');
		            	//最后将分页加入容器中
		            	pageHtml = pageHtml.join("");
		            	return pageHtml;
	        	}
		},

		/**
     		*   跳页函数，对外开放
     		* @param curPage    要跳入的页
     		*/
		goPage:function(curPage){
		        var urlRequestData = pageModel.urlRequestData;
		        urlRequestData.pageSize = pageModel.pageSize;
		        pageModel.curPage = urlRequestData.curPage = curPage;
		        $.ajax({
		            url: pageModel.url,
		            type: "POST",
		            data: urlRequestData,
		            dataType: "text",
		            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		            success: function (data) {
		                //构造列表
		                pageModel.pageListContainer.html(data);
		                //获取总页数,和当前页
		                pageModel.totalRecordNumber = $("#totalCount").val();
		                //构造分页
		                pageModel.pageContainer.html(that.renderPager(pageModel.totalRecordNumber, pageModel.pageSize, pageModel.curPage));
		            }
		        });   
		}
		/**
     		*   输入页数的跳页函数，对外开放
     		* @param maxPages 最大页数
     		*/
		jumpToPage:function(maxPages){
			var pagesStr = $("#gopagenum").val();
		        if (null == pagesStr || "" == pagesStr) {
				alert("不能为空！");
		            	return;
		        }
		        var charCheck = new RegExp("^[0-9]*$");
		        if (!charCheck.test(pagesStr)) {
		        	alert("类型不匹配，请输入正确的格式！");
		        	return;
		        }
		        var pages = parseInt(pagesStr);
		        if (pages < 1 || pages > maxPages) {
		        	alert("页码超出范围，请注意!");
		        } else {
		        	that.goPage(pages);
		        }
		}
	};
	/**初始化**/
	pageView.init();
	/**附加到全局对象**/
	window.pageView = pageView;	
})(window,jQuery);
