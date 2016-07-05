var payListHistoryModel = angular.module("payListHistoryModel", []);

/**
 * 缴费记录页面
 */
payListHistoryModel.controller("payListHistoryCtrl", function ($rootScope, $scope, $http, $state,sysdictData) {
	
        $scope.payStatusList = sysdictData.payStatus;
        $scope.chargeTypeList = sysdictData.chargeType;
        $scope.payTypeList = sysdictData.paymentType;
        var back = callLocalService("QueryCharge");
        $scope.terminIdentifyList = back.response.responseBody.terminIdentifyList;

        $scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
        $scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

        try {
            $scope.plotId = $scope.responseBody.cList[0].cid;
        } catch (e) {
        }
        //小区编号

        $scope.sumAmount = 0;
        $scope.address = {};
        /**
         * 初始化房号
         */
        var header = new RequestHeader( "BSPayUnitHouseNumber");
        var request = packRequest({plotId: $scope.plotId}, header);
        
        $http.post(baseUrl, request).success(function(back) {
        	if (back.response.responseHeader.returnStatus == '0') {
                layer.alert(back.response.responseHeader.returnDesc);
                return false;
            }
            $scope.roomList = back.response.responseBody.roomList;
		});
        
        /**
         * 初始化分页参数
         * @type {{}}
         */
        var vm = $scope.vm = {};
        vm.page = {
            pageNum: ""+1,
            pageSize: ""+10
        };

        /**
         * 分页动作
         */
        vm.pageChanged = function () {
            console.log(vm.page);
            $scope.getRecordListByPage('3');
        };


        /**
         * 撤销原因
         * */
        $scope.revokeAccount = "";

        /**
         * 撤销的记录列表流水号
         * */
        $scope.revokeRecord = "";
        $scope.revokeOperate = function (k) {
            $scope.revokeRecord = $scope.recordList[k];
        };


        /**
         * 提交撤销
         * */
        $scope.confirmRevoke = function () {
            if (!$scope.revokeAccount) {
                layer.alert("撤销原因不能为空");
                return;
            }
            var body = {
                remark: $scope.revokeAccount, transNo: $scope.revokeRecord.transNo
            };
            var header = new RequestHeader("BSPayReverse");
            var request = packRequest(body, header);
            
            $http.post(baseUrl, request).success(function(back) {
            	if (back.response.responseHeader.returnStatus == '0') {
                    layer.alert(back.response.responseHeader.returnDesc);
                    return false;
                } else {
                    layer.alert(back.response.responseHeader.returnDesc);
                    $state.reload();//关闭弹出框
                }
    		});
            
            
        };


        /**
         * 打印收据
         * */
        $scope.printRecord = "";
        $scope.printReceipt = function (k) {
            $scope.printRecord = $scope.recordList[k];
            console.log($scope.printRecord);
            $state.go('list.printReceipt',{orderNo:$scope.printRecord.transNo,houseId:$scope.printRecord.houseId});
        };

        /**
         * 开发票
         * */
        $scope.ticketRecord = "";
        $scope.printTicket = function (k) {
            $scope.ticketRecord = $scope.recordList[k];
            alert("跳转到开发票");
        };

        /**
         * 跳转到对账
         * */
        $scope.skipRecord;
        $scope.skipRecon = function () {
            $state.go("list.reconciliation");
        };


        /**
         * 获取缴费状态复选框的值
         * @type {boolean}
         */
        var ps = new Map();
        $scope.statechk = function (payStatus) {
            payStatus.ck = !payStatus.ck;
            if (payStatus.ck) {
                ps.put(payStatus.key, payStatus.key);
            } else {
                ps.remove(payStatus.key);
            }
        };

        /**
         * 获取缴费类型复选框的值
         * @type {boolean}
         */
        var jfps = new Map();
        $scope.jfstatuschk = function (chargeType) {
            chargeType.ck = !chargeType.ck;
            if (chargeType.ck) {
                jfps.put(chargeType.key, chargeType.key);
            } else {
                jfps.remove(chargeType.key);
            }
        };

        /**
         * 获取支付方式复选框的值
         * @type {boolean}
         */
        var ptps = new Map();
        $scope.ptpsstatechk = function (payType) {
            payType.ck = !payType.ck;
            if (payType.ck) {
                ptps.put(payType.key, payType.key);
            } else {
                ptps.remove(payType.key);
            }
        };


        /**
         * 获取渠道类型复选框的值
         * @type {boolean}
         */
        var pcps = new Map();
        $scope.pcpsstatechk = function (terminIdentify) {
        	terminIdentify.ck = !terminIdentify.ck;
            if (terminIdentify.ck) {
                pcps.put(terminIdentify.terminIdentifyCode, terminIdentify.terminIdentifyCode);
            } else {
                pcps.remove(terminIdentify.terminIdentifyCode);
            }
        };

        /**
         * 分页获取账单列表
         * @param flag
         */
        $scope.getRecordListByPage = function (flag) {
            var body = {};
            //拿到指令作用域里的scope
            var address = null;
            try {
                address = angular.element($('#houseNo').scope())[0].address;
                //缴费开始结束时间
                $scope.startDate = angular.element($('#startDate').scope())[0].startDate;
                $scope.endDate = angular.element($('#endDate').scope())[0].endDate;
            } catch (e) {
            }

            

            //缴费状态
            var keys;
            if (ps != undefined && ps.size() > 0) {
                keys = ps.keys();
                $scope.payStatus = keys.join("|");
            }else{
            	$scope.payStatus = null;
            }
            
            //缴费类型
            if (jfps != undefined && jfps.size() > 0) {
                keys = jfps.keys();
                $scope.chargeType = keys.join("|");
            }else{
            	$scope.chargeType = null;
            }
            //支付渠道
            if (pcps != undefined && pcps.size() > 0) {
                keys = pcps.keys();
                $scope.terminIdentify = keys.join("|");
            }else{
            	$scope.terminIdentify = null;
            }
            //支付方式
            if (ptps != undefined && ptps.size() > 0) {
                keys = ptps.keys();
                $scope.payType = keys.join("|");
            }else{
            	$scope.payType = null;
            }



            var header = new RequestHeader("BSPayQueryRecordList");
            if (address == undefined || address.houseNo == undefined) {
                $scope.houseId = null;
            } else {
                $scope.houseId = address.houseNo
            }

            /**
             * 分页
             */
            //初始化，设置pageNum=1
            if (flag == '1') {
                pageNum = "1";
            } else if (flag == '2') {
                // 搜索按钮
                if ($scope.houseId == undefined) {
                    layer.alert('请选择房号');
                    return;
                } else {
                    pageNum = ""+vm.page.pageNum;
                }
            } else {
                pageNum = vm.page.pageNum;
            }

            body = {
                plotId: $scope.plotId,
                houseId: $scope.houseId,
                pageNum: ""+pageNum,
                pageSize: vm.page.pageSize,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                payStatus: $scope.payStatus,
                chargeType: $scope.chargeType,
                terminIdentify : $scope.terminIdentify,
                payType : $scope.payType
            };

            var request = packRequest(body, header);

            $http.post(baseUrl, request).success(function(back) {
            	$scope.recordList = back.response.responseBody.recordList;
                $scope.responseBody = back.response.responseBody;
                //合计笔数、总金额
                $scope.sumWrite = back.response.responseBody.total || 0;//合计笔数
                $scope.sumAmount = back.response.responseBody.totalAmount;//总金额
    		});
        };

        /**
         * 过滤状态查询
         */
        $scope.filterList = function () {
            $scope.getRecordListByPage(3);
        }

    }
);

