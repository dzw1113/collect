/**
 * Created by lenovo on 2015/9/22.
 * 预缴费用
 */
var nonProPayModel = angular.module("nonProPayModel", ["routerApp"]);

nonProPayModel.controller("nonProPayCtrl", function ($rootScope, $scope, $http, $state,sysdictData,$http,tokenService) {
	
    $scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
    $scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

    try {
        $scope.plotId = $scope.responseBody.cList[0].cid; //小区编号
    } catch (e) {
    }
    /**
     * 查询费项
     */
    $scope.chargeList = callQueryCharge(sysdictData,'2');

    try {
        $scope.chargeNo = $scope.chargeList[0].key;//费项编号
    } catch (e) {
    }

    try {
        $scope.plotId = $scope.responseBody.cList[0].cid; //小区编号
        $scope.communityName = $scope.responseBody.cList[0].communityName;
    } catch (e) {
    }
    $scope.mobileNo = '';//联系方式
    $scope.paymentName = '';//缴费人姓名
    $scope.chargeAmount = '';//收费金额
    $scope.paymentType = '01';//支付方式
    $scope.licensePlate = "";//车牌号
    $scope.cashMoney = 0.00;//实收
    $scope.changeMoney = 0.00;//找零

    /**
     * 确认收费
     */
    $scope.applyPay = function () {
    	tokenService.getTokenId().then(function(res){
		    var tokenId = res.data.response.responseBody.tokenId[0];
	        var body = {
	            plotId: $scope.plotId
	            , chargeNo: $scope.chargeNo
	            , mobileNo: $scope.mobileNo
	            , paymentName: $scope.paymentName
	            , chargeAmount: ""+$scope.chargeAmount
	            , paymentType: ""+$scope.paymentType
	            , licensePlate: ""+$scope.licensePlate
	            , operatorName : $scope.responseBody.name 
	            , chargeType : "04"
	            , tokenId : tokenId
	            , communityName : $scope.communityName
	        };
	        var header = new RequestHeader("BSPayNoOwnerCharge");
	        var request = packRequest(body, header);
	
	        $http.post(baseUrl, request).success(function(back) {
	        	//没有收费信息
	            if (back.response.responseHeader.returnStatus == '0') {
	                layer.alert(back.response.responseHeader.returnDesc==undefined?'收费失败！':back.response.responseHeader.returnDesc);
	                return;
	            }else {
	            	//没有houseId
	            	$state.go("list.paysuccess",{
	    				successInfo:back.response.responseHeader.returnDesc,
	    				orderNo:back.response.responseBody.orderNo
	    			});
	    		}
			});
    	});
    }
});