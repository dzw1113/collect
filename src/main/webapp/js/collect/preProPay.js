/**
 * Created by lenovo on 2015/9/22.
 * 预缴费用
 */
var preProPayModel = angular.module("preProPayModel", []);

preProPayModel.controller("preProPayCtrl", function ($rootScope, $scope, $http, $state, $stateParams,sysdictData,tokenService,$timeout) {
    $scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
    $scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

    $scope.houseInfo = $.evalJSON($stateParams.houseInfo);
    $scope.houseId = $stateParams.houseId;


    /**
     * 查询费项
     */
    var QueryCharge = function () {
        var body = {};
        var header = new RequestHeader("QueryCharge");
        var request = packRequest(body, header);
        var back = callLocalService("QueryCharge", request);
        $scope.chargeList = back.response.responseBody.chargeListFour;
    };
    QueryCharge();

    $scope.ownerName = $scope.houseInfo.ownerName;//业主姓名
    try {
        $scope.plotId = $scope.responseBody.cList[0].cid; //小区编号
        $scope.communityName = $scope.responseBody.cList[0].communityName;
    } catch (e) {
    }
    $scope.roomNo = $scope.houseInfo.banNo + $scope.houseInfo.unitNo + "单元" + $scope.houseInfo.roomNo;//房号
    $scope.chargeType = '01';//缴费类型
    $scope.chargeNo = $scope.chargeList[0].chargeNo;//费项编号
    $scope.chargeName = '';//费项名称
    $scope.chargeWar = '1';//计费方式
    $scope.chargeAmount = 0.00;//收费金额
    $scope.peopleNum = '';//人数
    $scope.uintPrice = '';//计费单价
    $scope.paymentType = '01';//支付方式

    $scope.cashMoney = 0.00;//实收
    $scope.changeMoney = 0.00;//找零
    $scope.shippingType = '0'; //优惠方式  

    $scope.collectMoney = 0;
    $scope.shippingAmount = 0;
    $scope.cycle = '1';
    $scope.thisUnitPrice = 0;

    /**
     * 查询优惠信息
     */
    $scope.payQueryPreInfo = function () {
        var body = {plotId: $scope.plotId, shippingType: '0'};
        var header = new RequestHeader("BSPayQueryPreInfo");
        var request = packRequest(body, header);
        
        $http.post(baseUrl, request).success(function(back) {
        	$scope.shippingList = back.response.responseBody.shippingList;
        	$timeout(function(){
        		$scope.calculatePrice();
        	},500);
		});
    };
    $scope.payQueryPreInfo();

    $scope.$watch("thisUnitPrice",function(){
    	$scope.calculatePrice();
    });
    
    /**
     * 查询单价
     */
    var recordList;
    $scope.getUnitPriceByCharge = function () {
        var chargeNo = $scope.chargeNo;
        var body = {houseId: $scope.houseId, chargeNo: chargeNo};
        var header = new RequestHeader("BSPayQueryArreas");
        var request = packRequest(body, header);
        
        $http.post(baseUrl, request).success(function(back) {
        	recordList = back.response.responseBody.recordList[0];
            $scope.thisUnitPrice = recordList.thisUnitPrice;
            if (recordList.isArreas == 0 || parseFloat(recordList.arreasAmount) > 0) {
                layer.alert('存在欠费，确定将进入周期性缴费！');
                // 光标
            	tabChange('0');
            	tableObj = {
            		"activeIndex" : sessionStorage.getItem("tabIndex") ? sessionStorage
            				.getItem("tabIndex") : 0
            	};
                $state.go('list.listPayCost');
            }
		});
    };
    $scope.getUnitPriceByCharge();

    /**
     * 重新查询单价、重置各种值
     */
    $scope.showPrice = function () {
        $scope.chargeAmount = '0';
        $scope.collectMoney = '0';
        $scope.shippingAmount = '0';
        $scope.cycle = '1';
        $scope.cycle1 = '1';
        $scope.chargeAmount = '0';
        $scope.cashMoney = '0';
        $scope.advanceAmount = '0';
        $scope.getUnitPriceByCharge();
        $scope.calculatePrice();
    };

    /**
	 * 计算找零
	 */
	$scope.getChangeMoney = function() {
		$scope.changeMoney = (parseFloat($scope.cashMoney) - parseFloat($scope.chargeAmount));
	};
	
    /**
     * 计算收费金额
     */
    $scope.calculatePrice = function () {
        if ($scope.chargeNo != "C001" && $scope.chargeNo != "C002") {
            return;
        }else{}
        //判断是否选了月份
        var cycle = $scope.cycle == '0' ? $scope.cycle1 : $scope.cycle;
        if (cycle == undefined) {
            return;
        }
        var spList = new Array();
        //根据费项取出费项优惠
        for (var i in $scope.shippingList) {
            var sp1 = $scope.shippingList[i];
            if (sp1.chargeNo == $scope.chargeNo) {
            	spList.push(sp1);
            }else{
            	sp1 = null;
            }
        }
        //根据优惠规则排序，主要是针对按金额
        spList.sort(function(a,b){
        	return a.shippingRule>b.shippingRule?1:-1;
        });
        
        //计算待收
        var areaNum = $scope.houseInfo.houseBuildArea;
        if($scope.chargeNo != "C001"){
        	areaNum = 1;
        }
        $scope.collectMoney = parseFloatFixed(parseInt(cycle) * parseFloatFixed($scope.thisUnitPrice)* parseFloatFixed(areaNum));
        
        var sp = null;
        for(var j in spList){
        	var sp2 = spList[j];
        	//按月份
        	if(sp2.shippingWar=='0'){
        		//如果选择的月份大于等于又会有月份，赋值sp
        		if(parseFloatFixed(cycle)>=parseFloatFixed(sp2.shippingRule)){
            		sp = sp2;
            	};
        	}
        	//按触发金额
        	if(sp2.shippingWar=='1'){
        		//如果待收大于触发金额
        		if($scope.collectMoney>=sp2.shippingRule){
        			sp = sp2;
        		}
        	}
        }
        if(sp!=null){
        	
	        //优惠比例
	        $scope.shippingRate = sp.shippingRate;
	
	        //按周期
	        if (sp.shippingWar == '0') {
	        	//按优惠金额
	        	if (sp.shippingForm == '0') {
	        		//选的月份是否触发了规则
		        	if(cycle<sp.shippingRule){
		        		$scope.chargeAmount = $scope.collectMoney;
			            $scope.shippingAmount = 0;
		        	}else{
			            //收费金额=月份*单价-优惠金额
			            $scope.chargeAmount = $scope.collectMoney - parseFloatFixed(sp.shippingAmount);
			            $scope.shippingAmount = sp.shippingAmount;
		        	}
	        	}else{//按比率
	        		//收费金额=单价*月份*优惠比率
		            $scope.chargeAmount = $scope.collectMoney * parseFloat(sp.shippingRate);
	        	}
	        	
	        } else {//按金额
	        	//按优惠金额
	        	if (sp.shippingForm == '0') {
	        		//收费金额是否触发了规则
		        	if($scope.collectMoney<sp.shippingRule){
		        		$scope.chargeAmount = $scope.collectMoney;
			            $scope.shippingAmount = 0;
		        	}else{
			            //收费金额=月份*单价-优惠金额
			            $scope.chargeAmount = $scope.collectMoney - parseFloatFixed(sp.shippingAmount);
			            $scope.shippingAmount = sp.shippingAmount;
		        	}
	        	}else{//按比率
	        		//收费金额=单价*月份*优惠比率
		            $scope.chargeAmount = $scope.collectMoney * parseFloat(sp.shippingRate);
	        	}
	        	
	        }
        }else{
	        $scope.chargeAmount = $scope.collectMoney;
	        $scope.shippingAmount = 0;
        }
        //实收
        $scope.cashMoney = $scope.chargeAmount;
        //优惠金额
        $scope.advanceAmount = parseFloatFixed($scope.collectMoney) - parseFloatFixed($scope.chargeAmount);
        $scope.getChangeMoney();
    };
    $scope.calculatePrice();


    /**
     * 确认收费
     */
    $scope.applyPay = function () {
        var cycle = $scope.cycle == '0' ? $scope.cycle1 : $scope.cycle;
        if ($scope.chargeNo == "C001" || $scope.chargeNo == "C002") {
            if ($scope.cycle == undefined && $scope.cycle1 == undefined) {
                layer.alert("请选择月份");
                return;
            }
        }
        tokenService.getTokenId().then(function(res){
		    var tokenId = res.data.response.responseBody.tokenId[0];
		    if($scope.chargeNo!='C001' && $scope.chargeNo!='C002'){
		    	$scope.cycle = null;
		    }
	        var body = {
	            houseId: $scope.houseId,
	            ownerName: $scope.ownerName,
	            plotId: $scope.plotId,
	            roomNo: $scope.roomNo,
	            chargeType: $scope.chargeType,
	            chargeNo: $scope.chargeNo,
	            cycle: $scope.cycle == '0' ? $scope.cycle1 : $scope.cycle,
	            chargeAmount: ""+$scope.chargeAmount,
	            paymentType: $scope.paymentType,
	            payerChannel: $scope.payerChannel,
	            advanceAmount: ""+$scope.advanceAmount,
	            preferTypetype: "03",
	            type: $scope.type,
	            code: $scope.code
	            , operatorName : $scope.responseBody.name
	            , tokenId : tokenId
	            , communityName : $scope.communityName
	        };
	        var header = new RequestHeader("BSPayPropertyCosts");
	        var request = packRequest(body, header);
	
	        $http.post(baseUrl, request).success(function(back) {
	        	//没有收费信息
	            if (back.response.responseHeader.returnStatus == '0') {
	                layer.alert('收费失败！');
	                return;
	            }else {
	            	$state.go("list.paysuccess",{
	    				successInfo:back.response.responseHeader.returnDesc,
	    				houseId : $scope.houseId,
						orderNo:back.response.responseBody.orderNo
	    			});
	    		}
			});
        });
    };
    
});