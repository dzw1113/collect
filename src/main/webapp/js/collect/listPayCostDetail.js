var listPayCostDetailModel = angular.module("listPayCostDetailModel", []);

/**
 * 缴费主页面
 */
listPayCostDetailModel.controller("listPayCostDetailCtrl", function($rootScope,
		$scope, $stateParams,$state,$http) {
	
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	// 获取主账单信息
	$scope.bill = $.secureEvalJSON($stateParams.bill);

	try {
		$scope.plotId = $scope.responseBody.cList[0].cid;
	} catch (e) {
	}

	/**
	 * 获取账单详情
	 * 
	 * @returns {boolean}
	 */
	$scope.getDetail = function() {
		var header = new RequestHeader("BSPayQueryBillDetail");
		var body = {
			billNo : $scope.bill.billNo
		};
		var request = packRequest(body, header);

		$http.post(baseUrl, request).success(function(back) {
			if (back.response.responseBody.detailList != undefined) {
				$scope.readList = [];
				$scope.unReadList = [];
				$scope.detailList = back.response.responseBody.detailList;
				var detailList = back.response.responseBody.detailList;
				for ( var index in detailList) {
					// 水电煤放一起、大飞说的、出问题找他
					if (detailList[index].chargeNo == 'C003'
							|| detailList[index].chargeNo == 'C004'
							|| detailList[index].chargeNo == 'C005') {
						$scope.readList.push(detailList[index]);
					} else {
						$scope.unReadList.push(detailList[index]);
					}
				}
			}
		});

	};

	/**
	 * 一键缴费,包括选了复选框和不选的情况,
	 * 
	 * @constructor
	 */
	$scope.callBSPayOnePay = function() {
		var commVar = {
			"houseId" : $scope.bill.houseId,
			"plotId" : $scope.plotId,
			"ownerName" : $scope.bill.ownerName,
			"roomNo" : $scope.bill.areaNo + $scope.bill.unitNo + '单元' +$scope.bill.roomNo,
			"chargeType" : "01",
			"billNo" : $scope.bill.billNo,
			"payableType" : "周期性收费"
		};
		var record = new Array();
		var arreaList = new Array();
		var arreasAmountTotal = 0;
		var penaltyTotal = 0;
		var chargeNo = "";
		var chargeNos = new Array();
		//没选费项默认是全选
		if (readMap.size() == 0) {
			var detailList = $scope.detailList;
			for ( var index in detailList) {
				var read = detailList[index];
				//排除掉已缴
				if(read.paymentStatus=='02'){
					continue;
				}
				record.push({
					chargeNo : read.chargeNo,
					arreasAmount : parseFloatFixed(read.paymentAmount)
				});
				// 计算合计金额
				arreasAmountTotal = parseFloatFixed(arreasAmountTotal)
						+ parseFloatFixed(read.paymentAmount);
				// 计算滞纳金
				penaltyTotal = parseFloatFixed(penaltyTotal)
						+ parseFloatFixed(read.penalty);
				chargeNos.push(read.chargeNo);
			}
		} else {
			for ( var i in readMap.values()) {
				var read = readMap.values()[i];
				record.push({
					chargeNo : read.chargeNo,
					arreasAmount : parseFloatFixed(read.paymentAmount)
				});
				// 计算合计金额
				arreasAmountTotal = parseFloatFixed(arreasAmountTotal)
						+ parseFloatFixed(read.paymentAmount);
				// 计算滞纳金
				penaltyTotal = parseFloatFixed(penaltyTotal)
						+ parseFloatFixed(read.penalty);
				chargeNos.push(read.chargeNo);
			}
		}
		record.arreaList = arreaList;
		// 通知
		$scope.$emit("handleEmit", {
			record : record,
			commVar : commVar,
			arreasAmountTotal : arreasAmountTotal,
			penaltyTotal : penaltyTotal,
			billList : [{
				billNo : $scope.bill.billNo,
				chargeNos : chargeNos.join(",")
			}]
		});
	};

	var readMap = new Map();
	$scope.checkRead = function(read) {
		read.ck = !read.ck;
		if (read.ck) {
			readMap.put(read.chargeNo, read);
		} else {
			readMap.remove(read.chargeNo);
		}
	};
	
	$scope.toPrint = function(){
		$state.go('nonavPage.listPayCostDetailPrint', {
			detailList : $.toJSON($scope.detailList),
			houseId : $scope.bill.houseId,
			billStatus : $scope.bill.billStatus
		});
	};

});
