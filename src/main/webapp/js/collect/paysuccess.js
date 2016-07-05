/**
 * Created by lenovo on 2015/9/22. 缴费成功页面
 */
var paysuccessModel = angular.module("paysuccessModel", [ "routerApp" ]);

paysuccessModel.controller("paysuccessCtrl", function($rootScope, $scope,
		$http, $state, $stateParams) {
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	$scope.orderNo = $stateParams.orderNo;
	$scope.successInfo = !$stateParams.successInfo?$stateParams.successInfo:'提交成功';
	$scope.houseId = $stateParams.houseId;
	
	try{
		$scope.companyName = $scope.responseBody.companyName;
	}catch(e){
	}
	
	$scope.printPz = function(){
		$state.go('list.printReceipt',{orderNo:$scope.orderNo,houseId:$scope.houseId});
	};

});

paysuccessModel.controller("printReceiptCtrl", function($rootScope, $scope,
		$http, $state, $stateParams,$timeout) {
	$scope.responseBody = JSON.parse(sessionStorage
			.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage
			.getItem("shareHeader"));
	
	$scope.orderNo = $stateParams.orderNo;
	$scope.houseId = $stateParams.houseId;

	try{
		$scope.companyName = $scope.responseBody.companyName;
		$scope.communityName = $scope.responseBody.cList[0].communityName;
	}catch(e){}
	
	$scope.getList = function(){
		var body = {
				"orderNo" : $scope.orderNo,
			};
			var header = new RequestHeader("BSPayQueryRecordList");
			var request = packRequest(body, header);
			$http.post(baseUrl, request).success(function(back) {
				console.log($.toJSON(back));
				
				$scope.readList = [];
				$scope.unReadList = [];
				$scope.detailList = back.response.responseBody.recordList;
				var detailList = back.response.responseBody.recordList;
				var subDetailList = new Array();
				for ( var index in detailList) {
					if(detailList[index].chargeNo=='Y001'){
						for(var j in detailList[index].feeList){
							subDetailList.push(detailList[index].feeList[j]);
						}
					}else{
						// 水电煤放一起、大飞说的、出问题找他
						if (detailList[index].chargeNo == 'C003'
								|| detailList[index].chargeNo == 'C004'
								|| detailList[index].chargeNo == 'C005') {
							$scope.readList.push(detailList[index]);
						} else {
							$scope.unReadList.push(detailList[index]);
						}
					}
					$scope.paymentDate = detailList[index].payDate;
					$scope.terminIdentify = detailList[index].terminalId;
					$scope.operatorName = detailList[index].operatorName;
					$scope.paymentAmountTotal = parseFloatFixed($scope.paymentAmountTotal) + parseFloatFixed(detailList[index].payAmount);
				}
				if(subDetailList.length>0){
					$scope.paymentAmountTotal = 0;
				}
				for(var index in subDetailList){
					subDetailList[index].payAmount = subDetailList[index].paymentAmount;
					// 水电煤放一起、大飞说的、出问题找他
					if (subDetailList[index].chargeNo == 'C003'
							|| subDetailList[index].chargeNo == 'C004'
							|| subDetailList[index].chargeNo == 'C005') {
						$scope.readList.push(subDetailList[index]);
					} else {
						$scope.unReadList.push(subDetailList[index]);
					}
					$scope.paymentAmountTotal = parseFloatFixed($scope.paymentAmountTotal) + parseFloatFixed(subDetailList[index].payAmount);
				}
				$scope.paymentAmountTotalDX = numberToDX($scope.paymentAmountTotal);
			});
	};
	
	/**
	 * 获取业主房屋信息
	 */
	$scope.getHouseInfo = function() {
		var header = new RequestHeader("BSQueryHouseInfo");
		var body = {
			houseId : $scope.houseId
		};
		var request = packRequest(body, header);
		$http.post(baseUrl, request).success(function(back) {
			if (back.response.responseBody != undefined) {
				$scope.houseInfo = back.response.responseBody;
			}
			$scope.getList();
		});
	};
	
	$scope.getHouseInfo();
	
	$scope.$watch('$stateChangeSuccess', 
    		function(event, toState, toParams, fromState, fromParams){
    	YW.extend("widget.PreView", PreView);
    	$timeout(function () {
    		$("div#myPrintArea").printArea();
    	}, 1000);
    });	

});