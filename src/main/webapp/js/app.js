var routerApp = angular.module('routerApp', [ "ui.bootstrap", 'ui.router',
		'tmpProPayCostModel', 'preProPayModel', "listPayCostDetailPrintModel",
		"reconcilitationModel", 'USLoginModel', 'goldProReturnModel',
		'goldProPayListModel', "listPayCostModel", "proPayCostModel",
		"payListHistoryModel", "goldProPayModel", "listPayCostDetailModel",
		"widget", "tmpProPayCostModel", "nonProPayModel", "paysuccessModel" ]);

/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * 
 * @param {[type]}
 *            $rootScope
 * @param {[type]}
 *            $state
 * @param {[type]}
 *            $stateParams
 * @return {[type]}
 */
routerApp.run(function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.$on('handleEmit', function(event, arg) {
		$rootScope.$broadcast('handleBroadcast', arg);
	});

	/**
	 * 本地变量
	 */
	$rootScope.sysdictData = sysdictData;
	$rootScope.commUrl = commUrl;
	
}).constant("sysdictData", sysdictData);

/**
 * 配置路由。 注意这里采用的是ui-router这个路由，而不是ng原生的路由。 ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * 
 * @param {[type]}
 *            $stateProvider
 * @param {[type]}
 *            $urlRouterProvider
 * @return {[type]}
 */
routerApp.controller('sysLogoBg', ['$scope','$window', function($scope,$window){
	var data=$window.sysdictData,url=window.location.host.toString(),u = url.split("."),dir="";
    $scope.imgurl="";
    $scope.logoImg="";
    $scope.logoName="";
    function XHR() {
		var xhr;
		try {xhr = new $window.XMLHttpRequest();}
		catch(e) {
			var IEXHRVers =["Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
			for (var i=0,len=IEXHRVers.length;i< len;i++) {
				try {xhr = new $window.ActiveXObject(IEXHRVers[i]);}
				catch(e) {continue;}
			}
		}
		return xhr;
	}
    function IsExistsFile(filepath){
            var xmlhttp=XHR();
            xmlhttp.open("GET",filepath,false);
            xmlhttp.send();
            if(xmlhttp.readyState==4){  
                if(xmlhttp.status==200) return true; //url存在  
                else if(xmlhttp.status==404) return false; //url不存在  
                else return false;//其他状态  
            }
        }
    if(u.length>2){
        dir=u[0];
    };
    if(dir && data){
    	var dataList=data[dir];
    	var nameImg={};
    	if(dataList && dataList.length>0){
        	for (var i = 0; i < dataList.length; i++) {
        		switch(dataList[i].key){
					case "ywCname":
					  nameImg.ywCname=dataList[i].value;
					  break;
					case "ywLoginBackImg":
					  nameImg.ywBgImg=dataList[i].value;
					  break;
					case "ywLogo":
					  nameImg.ywLogoImg=dataList[i].value;
					  break;
					default:
				}
        	};
    	}
    	if(nameImg.ywBgImg){
    		var imgurl='background-image:url('+'http://'+url+'/ifs/'+nameImg.ywBgImg+')';
    		if(IsExistsFile(imgurl)){
    			$scope.imgurl=imgurl;
    		}
    		//$scope.imgurl='background-image:url('+'http://'+url+'/ifs/'+nameImg.ywBgImg+')';
    	};
    	if(nameImg.ywLogo){
    		var logoImg='background-image:url('+'http://'+url+'/ifs/'+nameImg.ywLogo+')';
    		if(IsExistsFile(logoImg)){
    			$scope.logoImg=logoImg;
    		}
    		//$scope.logoImg='background-image:url('+'http://'+url+'/ifs/'+nameImg.ywLogo+')';
    	};
    	if(nameImg.ywCname){
    		$scope.logoName=nameImg.ywCname;
    	};
    }
}])
routerApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	$urlRouterProvider.otherwise('/index');
	$stateProvider.state('index', {
		url : '/index',
		views : {
			'' : {
				templateUrl : 'tpls/comm/home.html'
			},
			'main@index' : {
				templateUrl : 'tpls/user/usLogin.html',
				controller:"sysLogoBg"
			}
		}
	}).state('nonavPage', {
		url : '/nonavPage',
		views : {
			'' : {
				templateUrl : 'tpls/comm/nonavPage.html'
			},
			'content@nonavPage' : {
				templateUrl : 'tpls/comm/nonavContent.html'
			}
		}
	}).state('nonavPage.listPayCostDetailPrint', {
		url : '/listPayCostDetailPrint/:detailList&:houseId&:billStatus',
		templateUrl : 'tpls/listPayCostDetailPrint.html'
	}).state('nonavPage.rePassword', {
		url : '/rePassword',
		templateUrl : 'tpls/user/rePassword.html'
	}).state('list', {
		url : '/list',
		views : { // 注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
			'' : {
				templateUrl : 'tpls/comm/list.html',
				controller:"sysLogoBg"
			},
			'content@list' : {
				templateUrl : 'tpls/comm/content.html'
			}
		}
	}).state('list.listPayCost', {// 账单缴费列表
		url : '/listPayCost',
		templateUrl : 'tpls/listPayCost.html'
	}).state('list.listPayCostDetail', {// 账单缴费详情
		url : '/listPayCostDetail?bill',
		templateUrl : 'tpls/listPayCostDetail.html'
	}).state('list.proPaycost', {// 业主收费
		url : '/proPaycost',
		templateUrl : 'tpls/proPayCost.html'
	}).state('list.tmpProPayCost', {// 临时收费
		url : '/tmpProPayCost/:houseId&:houseInfo',
		templateUrl : 'tpls/tmpProPayCost.html'
	}).state('list.preProPay', {// 预缴费用
		url : '/preProPayList/:houseId&:houseInfo',
		templateUrl : 'tpls/preProPay.html'
	}).state('list.goldProPay', {// 履约金收取
		url : '/goldProPay/:houseId&:houseInfo',
		templateUrl : 'tpls/goldProPay.html'
	}).state('list.goldProPayList', {// 履约金列表
		url : '/goldProPayList/:houseId&:houseInfo',
		templateUrl : 'tpls/goldProPayList.html'
	}).state('list.goldProReturn', {// 履约金退还
		url : '/goldProReturn/:formance&:houseInfo',
		templateUrl : 'tpls/goldProReturn.html'
	}).state('list.nonProPay', {// 非业主
		url : '/nonProPay',
		templateUrl : 'tpls/nonProPay.html'
	}).state('list.payListHistory', {// 缴费历史
		url : '/payListHistory',
		templateUrl : 'tpls/payListHistory.html'
	}).state('list.reconciliation', {// 对账
		url : '/reconciliation',
		templateUrl : 'tpls/reconciliation.html'
	}).state('list.paysuccess', {// 对账
		url : '/paysuccess/:successInfo&:orderNo&:houseId',
		templateUrl : 'tpls/paysuccess.html'
	}).state('list.printReceipt', {// 对账
		url : '/printReceipt/:orderNo&:houseId',
		templateUrl : 'tpls/printReceipt.html'
	});

	// 注入进度条
	$httpProvider.interceptors.push('loadProgresser');
});

/**
 * 进度条拦截器
 */
routerApp
		.factory(
				'loadProgresser',
				[
						"$rootScope",
						function($rootScope, $q) {
							var index = null;
							var loadProgresser = {
								request : function(config) {
									if (config.method == 'POST') {
										console.log(config.data);
									}
									index = layer.load(0, {
										shade : false
									});
									config.requestTimestamp = new Date()
											.getTime();
									return config;
								},
								response : function(response) {
									if (response != null
											&& response.data != null
											&& response.data.response != null) {
										if (response.data.response.responseHeader.returnCode == 'EICIPBCC00015') {
											layer
													.confirm(
															response.data.response.responseHeader.returnDesc,
															{
																btn : [ '确定' ]
															// 按钮
															},
															function() {
																window.location.href = commUrl;
															});
											return response;
										}
									} else {
										response.config.responseTimestamp = new Date()
												.getTime();
									}
									layer.close(index);
									return response;
								},
								responseError : function(response) {
									if (response.status == 401) {
										layer.confirm("出错啦！", {
											btn : [ '确定' ]
										// 按钮
										}, function() {
											window.location.href = commUrl;
										});
									} else if (response.status === 404
											|| response.status === 500) {
										layer.confirm("程序走丢了！！", {
											btn : [ '确定' ]
										// 按钮
										}, function() {
											window.location.href = commUrl;
										});
									}
									return $q.reject(response);
								}
							};
							return loadProgresser;
						} ]);

/**
 * 增加房号指令
 */
routerApp.directive("dirsearch", function() {// search.html
	return {
		scope : true, // {} = isolate, true = child, false/undefined = no
		// change
		restrict : 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl : './tpls/comm/houseNo.html',
		replace : true,
		transclude : true
	};
});

/**
 * 增加房屋业主信息指令
 */
routerApp.directive("houseinfo", function() {// search.html
	return {
		scope : true, // {} = isolate, true = child, false/undefined = no
		// change
		restrict : 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl : './tpls/comm/houseInfo.html',
		replace : true,
		transclude : true
	};
});

/**
 * 日期指令
 */
routerApp
		.directive(
				'dirdatetimepicker',
				function() {
					// Runs during compile
					var html = '<div><input type="text" class="some_class" id="startDate" ng-model="startDate"/>'
							+ '<span>至：</span>'
							+ '<input type="text" class="some_class" id="endDate" ng-model="endDate"/></div>';
					return {
						scope : true, // {} = isolate, true = child,
						// false/undefined = no change
						restrict : 'E', // E = Element, A = Attribute, C =
						// Class, M = Comment
						template : html,
						replace : true,
						link : function() {
							$.datetimepicker.setLocale('ch');
							$('.some_class').datetimepicker({
								timepicker : false,
								format : 'Ymd'
							});
						}
					};
				});

/**
 * 打印指令
 */
routerApp.directive("print", function($timeout) {
	return {
		scope : true, // {} = isolate, true = child, false/undefined = no
		restrict : 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link : function(scope, element, attrs) {
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
				print : function() {
					window.print();
					window.document.body.innerHTML = this.bdhtml;
				}
			};
			YW.extend("widget.PreView", PreView);

			scope.$apply(function() {
				scope.print = new YW.widget.PreView(element, YW
						.parse($(element).attr("data-widget-config")));
				setTimeout(function() {
					scope.print.print();
				}, 0);
			});

		}
	};
});

/**
 * 按钮防重指令
 */
routerApp.directive("token", function($timeout) {
	return {
		scope : true, // {} = isolate, true = child, false/undefined = no
		restrict : 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link : function(scope, element, attrs) {
			scope.$watch("onclick", function() {
				console.log('ss');
			});
		}
	};
});

/**
 * 支付渠道过滤
 */
routerApp.filter("filter_terminIdentify", function() {
	return function(input) {
		var terminIdentify = "--";
		if (!input) {
			terminIdentify = "--";
		} else if (input.indexOf("P") == 0) {
			terminIdentify = "自助缴费";
		} else if (input.indexOf("T-WEB") == 0) {
			terminIdentify = "服务中心收取";
		} else {
			terminIdentify = "上门收取";
		}
		return terminIdentify;
	};
});

/**
 * 费项
 */
routerApp.filter("filter_chargeNo", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.chargeNo) {
			if (sysdictData.chargeNo[i].key == input) {
				chargeName = sysdictData.chargeNo[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 缴费类型
 */
routerApp.filter("filter_chargeType", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.chargeType) {
			if (sysdictData.chargeType[i].key == input) {
				chargeName = sysdictData.chargeType[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 支付方式
 */
routerApp.filter("filter_paymentType", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.paymentType) {
			if (sysdictData.paymentType[i].key == input) {
				chargeName = sysdictData.paymentType[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 支付方式
 */
routerApp.filter("filter_payStatus", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.payStatus) {
			if (sysdictData.payStatus[i].key == input) {
				chargeName = sysdictData.payStatus[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 计费方式
 */
routerApp.filter("filter_chargeWar", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.chargeWar) {
			if (sysdictData.chargeWar[i].key == input) {
				chargeName = sysdictData.chargeWar[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 日期
 */
routerApp.filter("filter_Date", function() {
	return function(input) {
		var newDate = '--';
		try {
			newDate = input.substr(0, 4) + "-" + input.substr(4, 2) + "-"
					+ input.substr(6, 2);
		} catch (e) {
		}
		return newDate;
	};
});

/**
 * 日期-月份
 */
routerApp.filter("filter_Date_Month", function() {
	return function(input) {
		var newDate = '--';
		try {
			newDate = input.substr(0, 4) + "-" + input.substr(4, 2);
		} catch (e) {
		}
		return newDate;
	};
});

/**
 * 日期-毫秒
 */
routerApp.filter("filter_Date_S", function() {
	return function(input) {
		var newDate = '--';
		try {
			newDate = input.substr(0, 4) + "/" + input.substr(4, 2) + "/"
					+ input.substr(6, 2) + " " + input.substr(8, 2) + ":"
					+ input.substr(10, 2) + ":" + input.substr(12, 2);
		} catch (e) {
		}
		return newDate;
	};
});

/**
 * 缴费状态
 */
routerApp.filter("filter_billStatus", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.billStatus) {
			if (sysdictData.billStatus[i].key == input) {
				chargeName = sysdictData.billStatus[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 履约金状态
 */
routerApp.filter("filter_returnStatus", function() {
	return function(input) {
		var chargeName = '--';
		for ( var i in sysdictData.returnStatus) {
			if (sysdictData.returnStatus[i].key == input) {
				chargeName = sysdictData.returnStatus[i].value;
				break;
			}
		}
		return chargeName;
	};
});

/**
 * 获取令牌
 */
routerApp.service('tokenService', [ '$http', '$q', function($http, $q) {
	var tokenId = null;

	return {
		getTokenId : function() {
			// 如果已存在则直接返回
			if (tokenId) {
				return $q.when(tokenId);
			}
			var body = {};
			var header = new RequestHeader("BCCGetTokenId");
			var request = packRequest(body, header);
			return $http.post(baseUrl, request).success(function(back) {
				return back;
			});
		}
	};
} ]);

