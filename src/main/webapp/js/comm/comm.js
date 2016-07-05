/**
 * Created by lenovo on 2015/9/15.
 */
/**
 * 公共url
 */
var commUrl = '';
if (commUrl == '') {
	sessionStorage.setItem("commUrl", getRootPath());
}
var shareRequestHeader = JSON.parse(sessionStorage.getItem("shareHeader"));
var shareRequestBody = JSON.parse(sessionStorage.getItem("shareBody"));
var commUrl = sessionStorage.getItem("commUrl");

var baseUrl = commUrl + '/service.json';
/**
 * 保存tab切换，放置刷新
 * 
 * @param tabIndex
 */
var tableObj = {
	"activeIndex" : sessionStorage.getItem("tabIndex") ? sessionStorage
			.getItem("tabIndex") : 0
};
function tabChange(tabIndex) {
	sessionStorage.setItem("tabIndex", tabIndex);
}

function numberToDX(n) {
	if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
		return "数据非法";
	var unit = "千百拾亿千百拾万千百拾元角分", str = "";
	n += "00";
	var p = n.indexOf('.');
	if (p >= 0)
		n = n.substring(0, p) + n.substr(p + 1, 2);
	unit = unit.substr(unit.length - n.length);
	for (var i = 0; i < n.length; i++)
		str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
	return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(
			/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(
			/^元零?|零分/g, "").replace(/元$/g, "元整");
}
/**
 * 获取归类了的费项
 * @param arr
 * @param type
 * @returns {Array}
 */
function callQueryCharge(arr,type){
	var rarr = new Array();
	for(var i in arr.chargeNo){
		var obj = arr.chargeNo[i];
		if(obj.type==type){
			rarr.push(obj);
		}
	}
	return rarr;
}

/**
 * 获取未归类的费项，四个死值
 * @param serviceCode
 * @param request
 * @returns
 */
function callLocalService(serviceCode, request) {
	// json文件位置
	 var url = "json/" + serviceCode + "Response.json";
	var responseData = null;
	$.ajax({
		// 请求方式为get
		type : "post",
		// json文件位置
		url : url,
		dataType : "json",
		contentType : 'application/json;charset=utf-8',
		data : request,
		async : false,
		// cache: true,
//		timeout : 10000,
		// 请求成功完成后要执行的方法
		success : function(data) {
			responseData = data;
		},
		complete : function(XMLHttpRequest, textStatus) {
			// this; // 调用本次AJAX请求时传递的options参数
			XMLHttpRequest.abort();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			XMLHttpRequest.abort();
		}
	});
	return responseData;
}


/**
 * 提交动作，服务码、表单名、回调函数
 * 
 * @param serviceCode
 * @param formName
 * @param callBack
 */

function sendService(serviceCode, formName, callBack) {
	var data = requestService(serviceCode, formName);
	var responseHeader = unPackHeader(data);
	var responseBody = unPackBody(data);
	return callBack(responseHeader, responseBody, formName);
}

function sendServiceByRequest(serviceCode, request, callBack) {
	var data = callService(serviceCode, request);
	var responseHeader = unPackHeader(data);
	var responseBody = unPackBody(data);

	return callBack(responseHeader, responseBody);
}

function requestService(serviceCode, formName) {
	var obj = $(formName).serializeObject();
	var requestHeader = new RequestHeader(serviceCode);

	var request = packRequest(obj, requestHeader);

	console.log(request);
	return callService(serviceCode, request);
}


function callService(serviceCode, request,callBackFunc) {
	console.log(request);
	// json文件位置
	var url = commUrl + '/service.json';
	var index=null;
	$.ajax({
		type : "post",
		url : url,
		dataType : "json",
		contentType : 'application/json;charset=utf-8',
		data : request,
		// cache: true,
		timeout : 60000,
		beforeSend : function(){
			//index = layer.load(1);
		},
		// 请求成功完成后要执行的方法
		success : function(responseData) {
			//if (responseData == undefined || responseData == null) {
			//	layer.alert("暂停服务，请稍后再试！");
			//	return;
			//}
			//if (responseData.response.responseHeader.returnCode == 'EICIPBCC00015') {
			//	layer.confirm(responseData.response.responseHeader.returnDesc, {
			//	    btn: ['确定'] //按钮
			//	}, function(){
			//		window.location.href = commUrl;
			//	});
			//}
			if($.isFunction(callBackFunc)){
				console.log(serviceCode,callBackFunc);
				callBackFunc(responseData);
			}
			
		},
		complete : function(XMLHttpRequest, textStatus) {
			// this; // 调用本次AJAX请求时传递的options参数
			//layer.close(index);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//layer.close(index);
		}
		
	});
}


/**
 * 解包获取header
 */
function unPackHeader(responseData) {
	return responseData.response.responseHeader;
}
/**
 * 解包获取body
 */
function unPackBody(responseData) {
	return responseData.response.responseBody;
}

/**
 * 打包Body
 */
function packBody(body) {
	return $.toJSON({
		requestBody : body
	});
}

/**
 * 打包header
 */
function packHeader(header) {
	return $.toJSON({
		requestHeader : header
	});
}

/**
 * 打包request
 */
function packRequest(body, header) {
	return $.toJSON({
		requestHeader : header,
		requestBody : body
	});
}

/**
 * js获取项目根路径
 * 
 * @returns
 */
function getRootPath() {
	var curWwwPath = window.document.location.href;
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPaht = curWwwPath.substring(0, pos);
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
}

/**
 * form转换格式
 */
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

/**
 * requestHeader对象
 */
function RequestHeader(serviceCode, companyID, conversationId, accessToken,
		productId, softTerminalId) {
	if (productId == null || productId == undefined) {
		this.productId = "CHARGE";// 产品ID
	} else {
		this.productId = productId;// 产品ID
	}
	/** 服务码 */
	this.serviceCode = serviceCode;

	/** 物业公司编号 */
	try{
		if (!companyID) {
			this.companyID = shareRequestBody.companyID;// 产品ID
		} else {
			this.companyID = companyID;// 产品ID
		}
	}catch(e){
	}
	/** app版本号 */
	this.softTerminalVersion = "1.0.0";
	this.interfaceVersion = "1.0.0";
	/** 产品唯一标示 */
	this.softTerminalId = softTerminalId == undefined ? "T-WEB"
			: softTerminalId;
	/** 会话ID */
	this.conversationId = conversationId;
	try{
		this.accessToken = accessToken==undefined?shareRequestHeader.accessToken:accessToken;
	}catch(e){
		this.accessToken = null;
	}
	this.systemDate = new Date().Format("yyyyMMddhhmmss");

	if (RequestHeader.prototype.serviceCode == undefined) {
		RequestHeader.prototype.serviceCode = function() {
			layer.alert("无法识别服务码！");
		};
	}
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 
 * @param fmt
 * @returns
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (fmt == undefined) {
		fmt = "yyyy-MM-dd";
	}
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 * 初始化日期语言
 */
$.datetimepicker.setLocale('ch');

Date.prototype.LastDate = function(fmt) {
	var temp = new Date(this.getFullYear(), this.getMonth() + 1, "0");
	return temp.Format(fmt);
};

Date.prototype.FirstDate = function(fmt) {
	var temp = new Date(this.getFullYear(), this.getMonth(), "01");
	return temp.Format(fmt);
};

function Page() {
	// 当前页
	this.pageNum;
	// 每页的数量
	this.pageSize;
	// 当前页的数量
	this.size;
	// 当前页面第一个元素在数据库中的行号
	this.startRow;
	// 当前页面最后一个元素在数据库中的行号
	this.endRow;
	// 总记录数
	this.total;
	// 总页数
	this.pages;
	// 第一页
	this.firstPage;
	// 前一页
	this.prePage;
	// 下一页
	this.nextPage;
	// 最后一页
	this.lastPage;

	// 是否为第一页
	this.isFirstPage = false;
	// 是否为最后一页
	this.isLastPage = false;
	// 是否有前一页
	this.hasPreviousPage = false;
	// 是否有下一页
	this.hasNextPage = false;
	// 导航页码数
	this.navigatePages;
	// 所有导航页号
	this.navigatepageNums;
}

String.prototype.replaceNull = function(s1) {
	var arr = this.split(s1);
	var str = '';
	if (arr.length > 0) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i].length > 0 && arr[i] != undefined && arr[i] != "") {
				if (i == 0) {
					str = arr[i];
				} else {
					str = str + s1 + arr[i];
				}

			}
		}
		return str;
	} else {
		return s1;
	}
};

/*
 * MAP对象，实现MAP功能
 * 
 * 接口： size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value)
 * 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
 * 获取指定KEY的元素值VALUE，失败返回NULL element(index)
 * 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key)
 * 判断MAP中是否含有指定KEY的元素 containsValue(value) 判断MAP中是否含有指定VALUE的元素 values()
 * 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
 * 
 * 例子： var map = new Map();
 * 
 * map.put("key", "value"); var val = map.get("key") ……
 * 
 */
function Map() {
	this.elements = new Array();
	// 获取MAP元素个数
	this.size = function() {
		return this.elements.length;
	};
	// 判断MAP是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	};
	// 删除MAP所有元素
	this.clear = function() {
		this.elements = new Array();
	};
	// 向MAP中增加元素（key, value)
	this.put = function(_key, _value) {
		if (!this.containsKey(_key)) {
			this.elements.push({
				key : _key,
				value : _value
			});
		}
	};
	// 删除指定KEY的元素，成功返回True，失败返回False
	this.remove = function(_key) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};
	// 获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	};
	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	};
	// 判断MAP中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};
	// 判断MAP中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};
	// 获取MAP中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = new Array();
		for (var i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	};
	// 获取MAP中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = new Array();
		for (var i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	};
}

/**
 * js实现list
 * 
 */
function List() {
	this.value = [];
	/* 添加 */
	this.add = function(obj) {
		return this.value.push(obj);
	};
	/* 大小 */
	this.size = function() {
		return this.value.length;
	};
	/* 返回指定索引的值 */
	this.get = function(index) {
		return this.value[index];
	};
	/* 删除指定索引的值 */
	this.remove = function(index) {
		this.value.splice(index, 1);
		return this.value;
	};
	/* 删除全部值 */
	this.removeAll = function() {
		return this.value = [];
	};
	/* 是否包含某个对象 */
	this.constains = function(obj) {
		for ( var i in this.value) {
			if (obj == this.value[i]) {
				return true;
			} else {
				continue;
			}
		}
		return false;
	};

	/* 是否包含某个对象 */
	this.getAll = function() {
		var allInfos = '';
		for ( var i in this.value) {
			if (i != (value.length - 1)) {
				allInfos += this.value[i] + ",";
			} else {
				allInfos += this.value[i];
			}
		}
		return allInfos += this.value[i] + ",";
	};

}

/**
 * 深度克隆对象
 * 
 * @param obj
 * @returns {*}
 */
function clone(obj) {
	var objClone;
	if (obj.constructor == Object) {
		objClone = new obj.constructor();
	} else {
		objClone = new obj.constructor(obj.valueOf());
	}
	for ( var key in obj) {
		if (objClone[key] != obj[key]) {
			if (typeof (obj[key]) == 'object') {
				objClone[key] = clone(obj[key]);
			} else {
				objClone[key] = obj[key];
			}
		}
	}
	objClone.toString = obj.toString;
	objClone.valueOf = obj.valueOf;
	return objClone;
}

function isNull(_var) {
	if (typeof (_var) == "undefined") {
		return "";
	} else if (_var == undefined) {
		return "";
	} else if (isNaN(_var)) {
		return 0;
	} else {
		return _var;
	}
}

function parseFloatFixed(_var, _num) {
	_num = _num | 2;
	var _tmp = "0";
	if (typeof (_var) == "undefined" || typeof (_var) == null) {
		_tmp = "0";
	} else {
		_tmp = _var;
	}
	return parseFloat(parseFloat(_tmp).toFixed(_num));
}

function PreView(elm, obj) {
	if (!elm) {
		return;
	}
	this.indexobj = YW.addObj({
		printCls : "ks-print" // 打印样式class名
	}, obj || {});
	this.bdhtml = window.document.body.innerHTML; // 获取当前页的html代码
	var prnnd = $(elm);
	prnnd.children().addClass(this.indexobj.printCls);
	var prnhtml = prnnd.html();
	window.document.body.innerHTML = prnhtml;
}

PreView.prototype = {
	tbPrint : function() {
		window.print();
		window.document.body.innerHTML = this.bdhtml;
	}
};
