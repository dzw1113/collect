/**
 * Created by lenovo on 2015/9/21.
 */
var proPayCostModel = angular.module("proPayCostModel", []);

/**
 * 周期性收费（欠费）主页面
 */
proPayCostModel.controller("proPayCostCtrl", function($rootScope, $scope,
		$http, $state, $stateParams,$timeout) {
	
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	$scope.houseId = null;
	try {
		$scope.plotId = $scope.responseBody.cList[0].cid;
	} catch (e) {
	}
	// 小区编号

	/**
	 * 初始化房号
	 */
	var header = new RequestHeader("BSPayUnitHouseNumber");
	var request = packRequest({
		plotId : $scope.plotId
	}, header);
	
	$http.post(baseUrl, request).success(function(back) {
		if (back.response.responseHeader.returnStatus == '0') {
			layer.alert(back.response.responseHeader.returnDesc);
			return false;
		}
		$scope.roomList = back.response.responseBody.roomList;
	});
	
	/**
	 * 获取业主房屋信息
	 */
	$scope.getHouseInfo = function(callback) {
		var header = new RequestHeader("BSQueryHouseInfo");
		var body = {
			houseId : $scope.houseId
		};
		var request = packRequest(body, header);
		
		$http.post(baseUrl, request).success(function(back) {
			if (back.response.responseBody != undefined) {
				$scope.houseInfo = back.response.responseBody;
			}
			try{
				callback();
			}catch(e){
			}
		});
	};

	$scope.arreasAmount = 0.00;
	/**
	 * 一键缴费,包括选了复选框和不选的情况,
	 * 
	 * @constructor
	 */
	$scope.callBSPayQueryArreas = function(flag) {
		var address = null;
		try {
			address = angular.element($('#houseNo').scope())[0].address;
		} catch (e) {
		}

		if (address == undefined || address.houseNo == undefined) {
			$scope.houseId = null;
		} else {
			$scope.houseId = address.houseNo;
		}

		if ($scope.houseId == undefined) {
			layer.alert('请选择房号');
			return;
		}
		var body = {
			houseId : $scope.houseId
		};
		var header = new RequestHeader("BSPayQueryAllArreas");
		var request = packRequest(body, header);

		$http.post(baseUrl, request).success(function(back) {
			$scope.arreaList = back.response.responseBody.arreaList;
			$scope.arreasAmount = back.response.responseBody.arreasAmount;
			$scope.penaltyTotal = back.response.responseBody.penaltyTotal;
		});
		$scope.getHouseInfo();
	};

	$scope.totalMoney = 0;
	$scope.chk = false;
	var map = new Map();
	$scope.check = function(val, chk, ss) {
		if (!chk == true) {
			val.billNo = ss;
			map.put(val.detailNo, val);
		} else {
			map.remove(val.detailNo);
		}
		$scope.totalMoney = 0;
		for ( var idx in map.values()) {
			$scope.totalMoney = $scope.totalMoney
					+ (parseFloatFixed(map.values()[idx].paidAmount))
					+ (parseFloatFixed(map.values()[idx].penalty));
		}
	};

	/**
	 * 一键缴费,包括选了复选框和不选的情况,
	 * 
	 * @constructor
	 */
	$scope.callBSPayOnePay = function() {
		if(map.size()==0 && $scope.arreaList==undefined){
			layer.alert('请选择房号');
			$("#ks-pop-box").css("display", "none");
		}else{
			$("#ks-pop-box").css("display", "block");
			var arreasAmountTotal = 0;
			var penaltyTotal = 0;
			var record = new Array();
			var billList = new Array();
			var allMap = new Map();
			var billMap = new Map();
			
			if (map != undefined && map.size() > 0) {
				for ( var idx in map.keys()) {
					var arrea = map.values()[idx];
					if (allMap.containsKey(arrea.chargeNo)) {
						var arreasAmount = allMap.get(arrea.chargeNo);
						allMap.remove(arrea.chargeNo);
						allMap.put(arrea.chargeNo, arreasAmount);
					} else {
						allMap.put(arrea.chargeNo, arrea.paidAmount);
					}
					//合计billMap
					if (billMap.containsKey(arrea.billNo)) {
						var chargeNos = billMap.get(arrea.billNo);
						billMap.remove(arrea.billNo);
						billMap.put(arrea.billNo, chargeNos+","+arrea.chargeNo);
					} else {
						billMap.put(arrea.billNo, arrea.chargeNo);
					}
					
					// 计算合计金额
					arreasAmountTotal = arreasAmountTotal
							+ parseFloatFixed(arrea.paidAmount);
					// 计算滞纳金
					penaltyTotal = penaltyTotal + parseFloatFixed(arrea.penalty);
				}
				
				for(var i in billMap.keys()){
					billList.push({billNo:billMap.keys()[i],chargeNos:billMap.values()[i]});
				}
			} else {
				for ( var i in $scope.arreaList) {
					var arreas = $scope.arreaList[i];
					for ( var j in arreas.detailList) {
						var arrea = arreas.detailList[j];
						if (allMap.containsKey(arrea.chargeNo)) {
							var arreasAmount = allMap.get(arrea.chargeNo);
							allMap.remove(arrea.chargeNo);
							allMap.put(arrea.chargeNo, arreasAmount);
						} else {
							allMap.put(arrea.chargeNo, arrea.paidAmount);
						}
						// 计算合计金额
						arreasAmountTotal = arreasAmountTotal
								+ parseFloatFixed(arrea.paidAmount);
						// 计算滞纳金
						penaltyTotal = penaltyTotal + parseFloatFixed(arrea.penalty);
					}
					billList.push({billNo:arreas.billNo,chargeNos:allMap.keys().join(",")});
				}
			}
			//allMap TO record
			for(var i in allMap.keys()){
				record.push({chargeNo:allMap.keys()[i],arreasAmount:allMap.values()[i]});
			}
			
			var commVar = {
				"houseId" : $scope.houseId,
				"plotId" : $scope.plotId,
				"chargeType" : "01",
				"payableType" : "周期性收费",
				"roomNo" : $scope.houseInfo.banNo + $scope.houseInfo.unitNo + '单元' +$scope.houseInfo.roomNo,
			};
			
			$scope.$emit("handleEmit", {
				record : record,
				commVar : commVar,
				arreasAmountTotal : arreasAmountTotal,
				penaltyTotal : penaltyTotal,
				billList : billList
			});
		}
	}

	/**
	 * 到达子页面
	 */
	$scope.toSubDetail = function(urlFlag) {
		var address = null;
		try {
			address = angular.element($('#houseNo').scope())[0].address;
		} catch (e) {
			layer.alert('房号获取错误！');
			return;
		}
		if(address==undefined){
			layer.alert('请选择房号');
			return;
		}
		if (address != undefined || address.houseNo != undefined) {
			$scope.houseId = address.houseNo;
		}
		var hid = $scope.houseId;
		if (hid == undefined) {
			layer.alert('请选择房号');
			return;
		}
		$scope.hid = hid;
		$scope.urlFlag = urlFlag;
		try{
			$scope.getHouseInfo($scope.doDetail);
		}catch (e) {
			layer.alert('房号获取错误！');
			return;
		}
	};
	//房号获取后回调函数
	$scope.doDetail = function(){
		urlFlag = $scope.urlFlag;
		
		var proUrl = '';
		if (urlFlag == 1) {
			proUrl = 'list.tmpProPayCost';
		} else if (urlFlag == 2) {
			proUrl = 'list.preProPay';
		} else if (urlFlag == 3) {
			proUrl = 'list.goldProPay';
		} else if (urlFlag == 4) {
			proUrl = 'list.goldProPayList';
		} else {
			return false;
		}
		var houseInfo = $scope.houseInfo;
		$state.go(proUrl, {
			houseId : $scope.hid,
			houseInfo : $.toJSON(houseInfo)
		});
	}

});
