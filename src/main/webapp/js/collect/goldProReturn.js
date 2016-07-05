/**
 * Created by lenovo on 2015/9/25.
 */
var goldProReturnModel = angular.module("goldProReturnModel", []);

goldProReturnModel
    .controller(
    "goldProReturnCtrl",
    function ($rootScope, $scope, $http, $state, $stateParams,tokenService) {
        $scope.responseBody = JSON.parse(sessionStorage
            .getItem("shareBody"));
        $scope.responseHeader = JSON.parse(sessionStorage
            .getItem("shareHeader"));

        $scope.houseInfo = $.evalJSON($stateParams.houseInfo);
        $scope.formance = $.evalJSON($stateParams.formance);

        $scope.formanceId = $scope.formance.formanceId;//履约金编号
        $scope.houseId = $scope.formance.houseId;// 房屋编号
        $scope.ownerName = $scope.houseInfo.ownerName;// 业主姓名
        try {
            $scope.plotId = $scope.responseBody.cList[0].cid; // 小区编号
            $scope.communityName = $scope.responseBody.cList[0].communityName;
        } catch (e) {
        }
        $scope.roomNo = $scope.houseInfo.banNo
            + $scope.houseInfo.unitNo + "单元"
            + $scope.houseInfo.roomNo;// 房号
        $scope.chargeNo = $scope.formance.chargeNo;// 费项编号
        $scope.performanceAmount = $scope.formance.formanceAmount;// 履约金金额
        $scope.acceptanceResult = "验收通过，返还全部";// 验收结果
        $scope.isOffset = false;// 是否冲抵物业费
        $scope.offsetAmount = "0";// 冲抵金额 欠费金额

        $scope.billList = "";// 冲抵账单列表= "";//列表
        // $scope.biiNo= "";//账单编号
        // $scope.chargeNos= "";//费项列表

        $scope.returnAmount = $scope.performanceAmount;// 退还金额
        $scope.remark = "";// 备注

        $scope.callBSPayQueryArreas = function () {
            var body = {
                houseId: $scope.houseId
            };
            var header = new RequestHeader(
                "BSPayQueryAllArreas");
            var request = packRequest(body, header);

            $http.post(baseUrl, request).success(function(back) {
            	$scope.arreaList = back.response.responseBody.arreaList;
                $scope.arreasAmount = back.response.responseBody.arreasAmount;
                $scope.penaltyTotal = back.response.responseBody.penaltyTotal;
    		});
        };
        $scope.callBSPayQueryArreas();

        /**
         * 显示抵充费项
         */
        $scope.saa = true;
        $scope.showAllArreas = function () {
            if ($scope.saa) {
                $("#ks-pop-box").css("display", "block");
            } else {
                $("#ks-pop-box").css("display", "none");
                $scope.offsetAmount = 0;
                $scope.returnAmount = $scope.performanceAmount;// 履约金金额
            }
        };

        /**
         * 隐藏抵充费项
         */
        $scope.hideAllArreas = function () {
            $("#ks-pop-box").css("display", "none");
        };

        /**
         * 确认收费
         */
        $scope.applyPay = function () {
        	if(parseFloatFixed($scope.offsetAmount)>0){
        		$scope.isOffset = true;
        	}else{
        		$scope.isOffset = false;
        	}
        	tokenService.getTokenId().then(function(res){
    		    var tokenId = res.data.response.responseBody.tokenId[0];
	            var body;
	            if ($scope.billList == null || $scope.billList == undefined || $scope.billList == "") {
	                body = {
	                    houseId: $scope.houseId,
	                    ownerName: $scope.ownerName,
	                    plotId: $scope.plotId,
	                    roomNo: $scope.roomNo,
	                    chargeNo: $scope.chargeNo,
	                    performanceAmount: $scope.performanceAmount,
	                    acceptanceResult: $scope.acceptanceResult,
	                    isOffset: $scope.isOffset ? "Y" : "N",
	                    offsetAmount: $scope.offsetAmount,
	                    returnAmount: $scope.returnAmount,
	                    remark: $scope.remark,
	                    formanceId: $scope.formanceId
	                    , operatorName: $scope.responseBody.name
	                    , tokenId : tokenId
	                    , communityName : $scope.communityName
	                };
	            } else {
	                body = {
	                    houseId: $scope.houseId,
	                    ownerName: $scope.ownerName,
	                    plotId: $scope.plotId,
	                    roomNo: $scope.roomNo,
	                    chargeNo: $scope.chargeNo,
	                    performanceAmount: ""+$scope.performanceAmount,
	                    acceptanceResult: $scope.acceptanceResult,
	                    isOffset: $scope.isOffset ? "Y" : "N",
	                    offsetAmount: ""+$scope.offsetAmount,
	                    billList: $scope.billList,
	                    returnAmount: ""+$scope.returnAmount,
	                    remark: $scope.remark,
	                    formanceId: $scope.formanceId
	                    , operatorName: $scope.responseBody.name
	                    , tokenId : tokenId
	                };
	            }

            
	            var header = new RequestHeader(
	                "BSPayReturnPerformance");
	            var request = packRequest(body, header);
	
	            $http.post(baseUrl, request).success(function(back) {
	            	// 没有收费信息
	                if (back.response.responseHeader.returnStatus == '0') {
	                    layer.alert(back.response.responseHeader.returnDesc == undefined ? '收费失败！' : back.response.responseHeader.returnDesc);
	                    return;
	                } else {
	                    $state.go("list.paysuccess", {
	                        successInfo:back.response.responseHeader.returnDesc,
							houseId : $scope.houseId,
							orderNo:back.response.responseBody.orderNo
	                    });
	                }
	    		});
            });
        };

        /**
         * 计算欠款费项、以及滞纳金
         */
        var billList = new Array();
        $scope.calculateBill = function () {
            // 计算总金额
            $scope.totalMoney = 0;
            for (var idx in map.values()) {
                var penalty = 0;
                if (map1.containsKey(map.keys()[idx])) {
                    penalty = parseFloatFixed(map.values()[idx].penalty);
                } else {
                    penalty = 0;
                }
                $scope.totalMoney = (parseFloatFixed($scope.totalMoney))
                    + (parseFloatFixed(map.values()[idx].paidAmount))
                    + penalty;
            }
            $scope.offsetAmount = $scope.totalMoney;

            // 履约金不足抵充欠费物业费，performanceAmount=33
            if (parseFloatFixed($scope.performanceAmount) < parseFloatFixed($scope.offsetAmount)) {
                layer.alert('履约金不足抵充物业费！请重新选择！');
                $scope.offsetAmount = 0;
                return;
            }

            // 统计billList
            for (var i in map.keys()) {
                var obj = new Object();
                var detail = map.get(map.keys()[i]);
                if (map1.containsKey(map.keys()[i])) {
                    obj.isPenalty = 'Y';
                } else {
                    obj.isPenalty = 'N';
                }
                obj.billNo = detail.billNo;
                obj.chargeNos = detail.chargeNo;
                billList.push(obj);
            }
            $scope.billList = billList;

            $scope.returnAmount = parseFloatFixed($scope.performanceAmount)
                - parseFloatFixed($scope.offsetAmount);

            $scope.hideAllArreas();

        };

        /**
         * 复选框选中事件
         *
         * @param val
         * @param chk
         */
        $scope.bck = false;
        $scope.pck = false;
        var map = new Map();
        var map1 = new Map();
        $scope.check = function (val, chk, flag, billNo) {
            // 账单编号
            if (flag == 0) {
                if (!chk == true) {
                    val.billNo = billNo;
                    map.put(val.detailNo, val);
                } else {
                    map.remove(val.detailNo);
                }
            }
            // 滞纳金
            if (flag == 1) {
                if (!chk == true) {
                    map1.put(val.detailNo, true);
                } else {
                    map1.remove(val.detailNo);
                }
            }
            console.log("输出：" + map.size());
        };
    });