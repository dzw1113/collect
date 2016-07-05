/**
 * Created by lenovo on 2015/9/22.
 * 预缴费用
 */
var goldProPayModel = angular.module("goldProPayModel", []);

goldProPayModel.controller("goldProPayCtrl", function ($rootScope, $scope, $http, $state, $stateParams,sysdictData,$http,tokenService) {
    $scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
    $scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

    $scope.houseInfo = $.evalJSON($stateParams.houseInfo);
    $scope.houseId = $stateParams.houseId;

    /**
	 * 查询费项
	 */
	$scope.chargeList = callQueryCharge(sysdictData,'3');

    $scope.ownerName = $scope.houseInfo.ownerName;//业主姓名
    try {
        $scope.plotId = $scope.responseBody.cList[0].cid; //小区编号
        $scope.communityName = $scope.responseBody.cList[0].communityName;
    } catch (e) {
    }
    $scope.roomNo = $scope.houseInfo.banNo + $scope.houseInfo.unitNo + "单元" + $scope.houseInfo.roomNo;//房号
    $scope.chargeType = '03';//缴费类型
    try {
        $scope.chargeNo = $scope.chargeList[0].key;//费项编号
        $scope.chargeWar = sysdictData.chargeWar[0].key;//计费方式
    } catch (e) {
    }
    $scope.chargeName = '';//费项名称
    
    $scope.chargeAmount = 0.00;//收费金额
    $scope.peopleNum = '';//人数
    $scope.uintPrice = '';//计费单价
    $scope.paymentType = '01';//支付方式

    $scope.cashMoney = 0.00;//实收
    $scope.changeMoney = 0.00;//找零

    /**
     * 计算收费金额
     */
    $scope.calculate = function () {
        if ($scope.chargeWar == 2) {
            $scope.chargeAmount = parseFloat(parseInt($scope.peopleNum) * parseFloat($scope.uintPrice))
        }
        if ($scope.chargeWar == 3) {
            $scope.chargeAmount = parseFloat(parseFloat($scope.houseInfo.houseBuildArea) * parseFloat($scope.uintPrice))
        }
        $scope.getChangeMoney();
    };

    /**
     * 确认收费
     */
    $scope.applyPay = function () {
    	tokenService.getTokenId().then(function(res){
		    var tokenId = res.data.response.responseBody.tokenId[0];
	        var body = {
	            houseId: $scope.houseId
	            , ownerName: $scope.ownerName
	            , plotId: $scope.plotId
	            , roomNo: $scope.roomNo
	            , chargeType: $scope.chargeType
	            , chargeNo: $scope.chargeNo
	            , chargeName: $scope.chargeName
	            , chargeWar: $scope.chargeWar
	            , chargeAmount: ""+$scope.chargeAmount
	            , peopleNum: $scope.peopleNum
	            , uintPrice: $scope.uintPrice
	            , paymentType: $scope.paymentType
	            , operatorName : $scope.responseBody.name 
	            , tokenId : tokenId
	            , communityName : $scope.communityName
	        };
	        var header = new RequestHeader("BSPayPerformanceCharge");
	        var request = packRequest(body, header);
	
	        $http.post(baseUrl, request).success(function(back) {
				$scope.bSPayPerformanceChargeback(back);
			});
    	});
    };
    
    $scope.bSPayPerformanceChargeback = function(back){
    	//没有收费信息
        if (back.response.responseHeader.returnStatus == '0') {
            layer.alert(back.response.responseHeader.returnDesc==undefined?'收费失败！':back.response.responseHeader.returnDesc);
            return;
        }else {
        	$state.go("list.paysuccess",{
        		successInfo:back.response.responseHeader.returnDesc,
				houseId : $scope.houseId,
				orderNo:back.response.responseBody.orderNo
			});
		}
    };

    /**
     * 计算找零
     */
    $scope.getChangeMoney = function () {
        $scope.changeMoney = (parseFloat($scope.cashMoney) - parseFloat($scope.chargeAmount))
    }
});