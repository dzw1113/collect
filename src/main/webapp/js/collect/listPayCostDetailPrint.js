var listPayCostDetailPrintModel = angular.module("listPayCostDetailPrintModel", []);

/**
 * 缴费主页面
 */
listPayCostDetailPrintModel.controller("listPayCostDetailPrintCtrl", function($rootScope,
		$scope, $stateParams,$state,$window,$timeout,$compile,$http) {
	
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	// 获取主账单信息
	$scope.detailList = $.secureEvalJSON($stateParams.detailList);
	
	$scope.billStatus = $stateParams.billStatus;
	
	$scope.houseId = $stateParams.houseId;

	try {
		$scope.plotId = $scope.responseBody.cList[0].cid;
		$scope.communityName = $scope.responseBody.cList[0].communityName;
		$scope.companyName = $scope.responseBody.companyName;
	} catch (e) {
	}

	/**
	 * 获取账单详情
	 * 
	 * @returns {boolean}
	 */
	$scope.paymentAmountTotal = 0.00;
	$scope.paymentAmountTotalDX = "";
	$scope.getDetail = function() {
		if ($scope.detailList != undefined) {
			$scope.readList = [];
			$scope.unReadList = [];
			var detailList = $scope.detailList;
			for ( var index in detailList) {
				// 水电煤放一起、大飞说的、出问题找他
				if (detailList[index].chargeNo == 'C003'
						|| detailList[index].chargeNo == 'C004'
						|| detailList[index].chargeNo == 'C005') {
					$scope.readList.push(detailList[index]);
				} else {
					$scope.unReadList.push(detailList[index]);
				}
				$scope.paymentAmountTotal = parseFloatFixed($scope.paymentAmountTotal) + parseFloatFixed(detailList[index].paymentAmount);
				$scope.startDate = detailList[index].startDate;
				$scope.endDate = detailList[index].endDate;
			}
			$scope.paymentAmountTotalDX = numberToDX($scope.paymentAmountTotal);
			
		}
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
		});
	};
	
	$scope.getHouseInfo();
	$scope.getDetail();
	

	//有问题，待解决,存在一个问题，必须要timeout解决
//    $scope.$watch('$viewContentLoaded', function() {  
//    	YW.extend("widget.PreView", PreView);
//    	var pdiv = angular.element("#print");
//    	if(pdiv.length>0){
//    		console.log($compile(pdiv[0].innerHTML)($scope));
//    	}
//    	var tbPrint= new YW.widget.PreView($compile($("#print")[0].innerHTML)($scope), YW.parse($("#print").attr("data-widget-config")));
//		tbPrint.tbPrint();
//    });
    
    $scope.$watch('$stateChangeSuccess', 
    		function(event, toState, toParams, fromState, fromParams){
    	YW.extend("widget.PreView", PreView);
    	$timeout(function () {
    		$("div#myPrintArea").printArea();
    	}, 0);
    });
    
    
});
