/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function(){
	function subexplain(id,award){
		var temp;
		var gtPoints="gotoGetPoints('"+award.code+"')";
			switch(id){
				case "003":
	                temp='<div>'+
			    			'<div class="item h5"><span>1、打开任意一条小区公告信息</span></div>'+
				    		'<div class="item h5"><span>2、点击评论输入框（消息的最下方）</span></div>'+
			    			'<div class="item h5">'+
			    				'<div class="item-img item-img1">'+
									'<img src="img/1/2.png" alt="">'+
								'</div>'+
			    			'</div>'+
				    		'<div class="item h5"><span>3、输入你想发表的评论</span></div>'+
			    			'<div class="item h5">'+
			    				'<div class="item-img item-img1">'+
									'<img src="img/1/3.png" alt="">'+
								'</div>'+
			    			'</div>'+
				    		'<div class="item h5"><span>4、输入完成后，点击确认，发表成功即可获得奖励</span></div>'+
				    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'
			    		'</div>';
	                break;
	            case "004":
	            	  temp='<div>'+
			    			'<div class="item h5"><span>1、缴费成功之后点击分享按钮或者进入好友邀请页面</span></div>'+
				    		'<div class="item">'+
								'<div><input type="button" onclick="'+gtPoints+'" class="button radius8" value="立即分享"></div>'+
							'</div>'+
				    		'<div class="item h5"><span>2、选择想要分享的平台</span></div>'+
				    		'<div class="item h5"><span>3、最后确定分享，即可获得奖励</span></div>'+
				    		'<div class="item h5"><span>4、积分奖励按次发放，每日获得的分数有上限</span></div>'
			    		'</div>';
	            	break;
	            case "005":
	            	  temp='<div>'+
			    			'<div class="item h5"><span>1、打开左侧抽屉设置模块</span></div>'+
				    		'<div class="item h5"><span>2、选择意见反馈，进入反馈页面</span></div>'+
			    			'<div class="item h5">'+
			    				'<div class="item-img item-img1">'+
									'<img src="img/2/2.png" alt="">'+
								'</div>'+
			    			'</div>'+
				    		'<div class="item h5"><span>3、选择反馈类型，输入反馈意见</span></div>'+
			    			'<div class="item h5">'+
			    				'<div class="item-img item-img1">'+
									'<img src="img/2/3.png" alt="">'+
								'</div>'+
			    			'</div>'+
				    		'<div class="item h5"><span>4、最后确定提交，即可获得奖励</span></div>'+
				    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'+
                            '<div class="item">'+
								'<div><input type="button" onclick="'+gtPoints+'" class="button radius8" value="意见反馈"></div>'+
							'</div>'
			    		'</div>';
	            	break;
	            case "006":
	            	   temp='<div>'+
			    			'<div class="item h5"><span>1、选择缴费功能，进入缴费页面，进行缴费</span></div>'+
				    		'<div class="item h5"><span>2、缴费成功之后，即可获得奖励</span></div>'+
//				    		'<div class="item">'+
//								'<div><input type="button" onclick="'+gtPoints+'" class="button radius8" value="立即缴费"></div>'+
//							'</div>'+
				    		'<div class="item h5"><span>3、积分奖励按次发放，每日获得的分数有上限</span></div>'
			    		'</div>';
	            	break;
	            case "007":
	            	temp='<div>'+
			    			'<div class="item h5"><span>1、打开左侧抽屉设置模块</span></div>'+
				    		'<div class="item h5"><span>2、选择邀请好友，进入邀请好友页面</span></div>'+
				    		'<div class="item">'+
								'<div><input type="button" onclick="'+gtPoints+'" class="button radius8" value="邀请好友"></div>'+
							'</div>'+
				    		'<div class="item h5"><span>3、输入手机号、通讯录选择好友或者选择平台进行分享邀请</span></div>'+
				    		'<div class="item h5"><span>4、好友接受邀请并成功注册，即可获得奖励</span></div>'+
				    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'+
			    		'</div>';
	            	break;
	            default:
			}
		   $("#subexplain").html(temp);
		}
	function loadData(json){
		if(json && YW.isString(json)){
            loadjson=$.parseJSON(json)
        }else{
            loadjson=json||{};
        }
        var _award=loadjson,award={};

    	var range=function (cycleRange){
			var ret={
				'00':'',//不限周期
				'01':'' ,//一次性
				'02':'每天'
			}
			if(cycleRange && typeof ret[cycleRange] != "undefined"){
				return ret[cycleRange];
			}else{
				return "";
			}
		}
		var unit=function(n,s,p){
			var ret="";
			if(typeof p == "undefined"){
				return ret;
			}
			// if(!n && !s){
			if(_award.code!='006'){
				ret="+"+p;
				award.class="integral-icon"
			}else{
				ret=n+"元="+s+'个积分'
				award.class="integral-txt"
			}
			return ret;
		}
        award.unit=unit(_award.unitAmount,_award.unitPoint,_award.point);
    	award.code=_award.code;


    	
		if(_award.rewardTimes){
			var tmprage=range(_award.cycleRange)+"前"+_award.rewardTimes+"次";
		}else{
			var tmprage="";
		}
    	switch(_award.code){
    		case "003":
                award.range=tmprage+'回复成功后给予奖励';
                break;
            case "004":
            	award.range=tmprage+'分享成功后给予奖励';
            	break;
            case "005":
            	award.range=tmprage+'成功后给予奖励';
            	break;
            case "006":
            	award.range=tmprage+'缴费成功后给予奖励';
            	break;
            case "007":
            	award.range=tmprage+'邀请好友成功注册给予奖励';
            	break;
            default:
                award.range=""
    	}
    	var html='<div class="item h5"><span>积分奖励：</span><span class="'+award.class+'">'+award.unit+'</span></div>'+
    		'<div class="item h5"><span>任务规则：</span><span>'+award.range+'</span></div>';
    	$("#share").html(html);
    	subexplain(_award.code,award);
	}
	window.loadData=loadData;
})()
// function gotoGetPoints(code){
// 	alert(code)
// }
$(function(){
    var data=YW.request;
	loadData({
    		point:data['point'],//	积分值
	        code:data["code"],//	积分动作编号
	        cycleRange:data['cyclerange'],//	周期范围
	        rewardTimes:data['rewardtimes'],//	奖励次数
	        unitAmount:data['unitamount'],//	单位金额
	        unitPoint:data['unitpoint']//	单位金额产生积分
    	})
})
// (function () {
//     var shareMod=angular.module('YW-ShareMod', []);
//     shareMod.controller('ctrl-share', ['$scope', function($scope){
//     	$scope.award={};
//     	$scope._award={
//     		point:"5",//	积分值
// 	        code:'006',//	积分动作编号
// 	        cycleRange:'00',//	周期范围
// 	        rewardTimes:'3',//	奖励次数
// 	        unitAmount:'20',//	单位金额
// 	        unitPoint:'元'//	单位金额产生积分
//     	}
//     	var range=function (cycleRange){
//     		var ret={
//     			'00':'',//不限周期
// 				'01':'' ,//一次性
// 				'02':'每天'
//     		}
//     		if(cycleRange && typeof ret[cycleRange] != "undefined"){
//     			return ret[cycleRange];
//     		}else{
//     			return "";
//     		}
//     	}
//     	var unit=function(n,s,p){
//     		var ret="";
//     		if(typeof p == "undefined"){
//     			return ret;
//     		}
//     		// if(!n && !s){
//     		if($scope._award.code!='006'){
//     			ret="+"+p;
//     			$scope.award.class="integral-icon"
//     		}else{
//     			ret=n+s+"="+p+'个积分'
//     			$scope.award.class="integral-txt"
//     		}
//     		return ret;
//     	}

//     	$scope.award.unit=unit($scope._award.unitAmount,$scope._award.unitPoint,$scope._award.point);
//     	$scope.award.code=$scope._award.code;
//     	$scope.award.gotoGetPoints=function(code){
// 			if($.isFunction(window.gotoGetPoints)){
// 				window.gotoGetPoints(code)
// 			}
//     	}
//     	var tmprage=range($scope._award.cycleRange)+"前"+$scope._award.rewardTimes;
//     	switch($scope._award.code){
//     		case "003":
//                 $scope.award.range=tmprage+'次回复成功后给予奖励';
//                 break;
//             case "004":
//             	$scope.award.range=tmprage+'次分享成功后给予奖励';
//             	break;
//             case "005":
//             	$scope.award.range=tmprage+'次成功后给予奖励';
//             	break;
//             case "006":
//             	$scope.award.range='缴费成功后给予奖励';
//             	break;
//             case "007":
//             	$scope.award.range=tmprage+'次邀请好友成功注册给予奖励';
//             	break;
//             default:
//     	}
//     }])

//     shareMod.directive('subexplain003',function(){
//     	var temp='<div>'+
// 		    			'<div class="item h5"><span>1、打开任意一条小区公告信息</span></div>'+
// 			    		'<div class="item h5"><span>2、点击评论输入框（消息的最下方）</span></div>'+
// 		    			'<div class="item h5">'+
// 		    				'<div class="item-img item-img1">'+
// 								'<img src="img/1/2.png" alt="">'+
// 							'</div>'+
// 		    			'</div>'+
// 			    		'<div class="item h5"><span>3、输入你想发表的评论</span></div>'+	
// 		    			'<div class="item h5">'+
// 		    				'<div class="item-img item-img1">'+
// 								'<img src="img/1/3.png" alt="">'+
// 							'</div>'+
// 		    			'</div>'+
// 			    		'<div class="item h5"><span>4、输入完成后，点击确认，发表成功即可获得奖励</span></div>'+
// 			    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'
// 		    		'</div>';
// 			return {
// 				restrict:"AE",
// 				replace:true,
// 				template:temp,
// 				transclude:true
// 			};
// 		});
//     shareMod.directive('subexplain004',function(){
//     	var temp='<div>'+
// 		    			'<div class="item h5"><span>1、缴费成功之后点击分享按钮或者进入好友邀请页面</span></div>'+
// 			    		'<div class="item">'+
// 							'<div><input type="button" ng-click="award.gotoGetPoints(award.code)" class="button radius8" value="立即分享"></div>'+
// 						'</div>'+
// 			    		'<div class="item h5"><span>2、选择想要分享的平台</span></div>'+
// 			    		'<div class="item h5"><span>3、最后确定分享，即可获得奖励</span></div>'+
// 			    		'<div class="item h5"><span>4、积分奖励按次发放，每日获得的分数有上限</span></div>'
// 		    		'</div>';
// 			return {
// 				restrict:"AE",
// 				replace:true,
// 				template:temp,
// 				transclude:true
// 			};
// 		});
//     shareMod.directive('subexplain005',function(){
//     	var temp='<div>'+
// 		    			'<div class="item h5"><span>1、打开左侧抽屉设置模块</span></div>'+
// 			    		'<div class="item h5"><span>2、选择意见反馈，进入反馈页面</span></div>'+
// 		    			'<div class="item h5">'+
// 		    				'<div class="item-img item-img1">'+
// 								'<img src="img/2/2.png" alt="">'+
// 							'</div>'+
// 		    			'</div>'+
// 			    		'<div class="item h5"><span>3、选择反馈类型，输入反馈意见</span></div>'+
// 		    			'<div class="item h5">'+
// 		    				'<div class="item-img item-img1">'+
// 								'<img src="img/2/3.png" alt="">'+
// 							'</div>'+
// 		    			'</div>'+
// 			    		'<div class="item h5"><span>4、最后确定提交，即可获得奖励</span></div>'+
// 			    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'
// 		    		'</div>';
// 			return {
// 				restrict:"AE",
// 				replace:true,
// 				template:temp,
// 				transclude:true
// 			};
// 		});
//     shareMod.directive('subexplain006',function(){
//     	var temp='<div>'+
// 		    			'<div class="item h5"><span>1、选择缴费功能，进入缴费页面，进行缴费</span></div>'+
// 			    		'<div class="item h5"><span>2、缴费成功之后，即可获得奖励</span></div>'+
// 			    		'<div class="item">'+
// 							'<div><input type="button" ng-click="award.gotoGetPoints(award.code)" class="button radius8" value="立即缴费"></div>'+
// 						'</div>'+
// 			    		'<div class="item h5"><span>3、积分奖励按次发放，每日获得的分数有上限</span></div>'
// 		    		'</div>';
// 			return {
// 				restrict:"AE",
// 				replace:true,
// 				template:temp,
// 				transclude:true
// 			};
// 		});
//     shareMod.directive('subexplain007',function(){
//     	var temp='<div>'+
// 		    			'<div class="item h5"><span>1、打开左侧抽屉设置模块</span></div>'+
// 			    		'<div class="item h5"><span>2、选择邀请好友，进入邀请好友页面</span></div>'+
// 			    		'<div class="item">'+
// 							'<div><input type="button" ng-click="award.gotoGetPoints(award.code)" class="button radius8" value="邀请好友"></div>'+
// 						'</div>'+
// 			    		'<div class="item h5"><span>3、输入手机号、通讯录选择好友或者选择平台进行分享邀请</span></div>'+
// 			    		'<div class="item h5"><span>4、好友接受邀请并成功注册，即可获得奖励</span></div>'+
// 			    		'<div class="item h5"><span>5、积分奖励按次发放，每日获得的分数有上限</span></div>'+
// 		    		'</div>';
// 			return {
// 				restrict:"AE",
// 				replace:true,
// 				template:temp,
// 				transclude:true
// 			};
// 		});
// })()


/*----------   2015-10-16 14:14:07   ----------*/