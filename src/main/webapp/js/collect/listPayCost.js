var listPayCostModel = angular.module("listPayCostModel", ["routerApp"]);

/**
 * 总欠费面板
 */
listPayCostModel.controller("queayCtrl", function($rootScope, $scope,$state,$http,tokenService) {
	
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));
	
	try {
		$scope.plotId = $scope.responseBody.cList[0].cid;
		$scope.communityName = $scope.responseBody.cList[0].communityName;
	} catch (e) {
	}

	$scope.$on('handleBroadcast', function(event, args) {
		$scope.record = args.record;
		$scope.commVar = args.commVar;
		// 应付金额
		$scope.payable = args.arreasAmountTotal;
		// 收费金额
		$scope.arreasAmountTotal = args.arreasAmountTotal;
		// 预交费金额
		$scope.advanceAmount = isNull(args.advanceAmount);
		// //区分账单缴费、业主收费、非业主收费、缴费记录
		$scope.flag = args.commVar.flag;

		$scope.penaltyTotal = args.penaltyTotal;
		
		$scope.pad = $scope.arreasAmountTotal;

		$scope.discount = "1";
		$scope.paymentType = "01";
		$scope.billList = args.billList;
	});

	$scope.chk = null;
	$scope.discount = 0.00;

	$scope.paidIn = 0.00;

	/**
	 * 计算找零
	 */
	$scope.getPaidIn = function() {
		if($scope.pad==null){
			$scope.pad = 0;
		}
		// 找零=实付-应付金额
		$scope.paidIn = (parseFloatFixed($scope.pad))
				- (parseFloatFixed($scope.payable));
	};
	
	/**
	 * 计算应付金额
	 * 
	 * @returns {number}
	 */
	$scope.totalArreasAmount = function() {
		var total = 0;
		try {
			// 滞纳金加欠费金额
			if ($scope.chk) {
				total = parseFloatFixed($scope.penaltyTotal)
						+ parseFloatFixed($scope.arreasAmountTotal);
			} else {
				// 欠费金额
				total = parseFloatFixed($scope.arreasAmountTotal);
			}
			if ($scope.discount) {
				// 计算金额乘以折扣
				total = total * (parseFloatFixed($scope.discount));
			}
		} catch (e) {
			return 0;
		}
		// 应付金额
		$scope.payable = total;
		$scope.getPaidIn();
	};

	$scope.totalArreasAmount();
	

	/**
	 * 确认一键缴费
	 */
	$scope.sendBSPayOnePay = function() {
		tokenService.getTokenId().then(function(res){
		    var tokenId = res.data.response.responseBody.tokenId[0];
			var body = {
				"houseId" : $scope.commVar.houseId,
				"plotId" : $scope.commVar.plotId,
				"ownerName" : $scope.commVar.ownerName,
				"roomNo" : $scope.commVar.roomNo,
				"chargeType" : $scope.commVar.chargeType,
				"paymentAmount" : ""+$scope.arreasAmountTotal,
				"discounts" : $scope.discount=="1"?"":$scope.discount,
				"paymentType" : $scope.paymentType,
				"isChargedPenal" : $scope.isChargedPenal ? "Y" : "N",
				"payerChannel" : "",
				"advanceAmount" : ""+$scope.advanceAmount,
				"discountAmount" : "",
				"type" : "",
				"code" : "",
				"billList" : $scope.billList
				, operatorName : $scope.responseBody.name 
				, tokenId : tokenId
				, communityName : $scope.communityName
			};
			var header = new RequestHeader("BSPayOnePay");
			var request = packRequest(body, header);
			$http.post(baseUrl, request).success(function(back) {
				$scope.bSPayOnePayback(back);
				tokenId = null;
			});
		});
	};
	
	
	$scope.bSPayOnePayback = function(back){
		if (back.response.responseHeader.returnStatus == '0') {
			layer.alert(back.response.responseHeader.returnDesc);
			return;
		}else{
			$state.go("list.paysuccess",{
				successInfo:back.response.responseHeader.returnDesc,
				houseId : $scope.commVar.houseId,
				orderNo:back.response.responseBody.orderNo
			});
			$("#ks-pop-box").css("display", "none");
		}
	};
	
	$scope.popColse = function(){
		$("#ks-pop-box").css("display", "none");
	};

});
/**
 * 缴费主页面
 */
listPayCostModel
		.controller(
				"listPayCostCtrl",
				function($rootScope, $scope, $http, $state,$http) {
					$scope.responseBody = JSON.parse(sessionStorage
							.getItem("shareBody"));
					$scope.responseHeader = JSON.parse(sessionStorage
							.getItem("shareHeader"));

					try {
						$scope.plotId = $scope.responseBody.cList[0].cid;
					} catch (e) {
					}
					// 小区编号

					$scope.address = {};
					/**
					 * 初始化房号
					 */
					var header = new RequestHeader("BSPayUnitHouseNumber");
					var request = packRequest({
						plotId : $scope.plotId
					}, header);
					
					//回调
					$scope.bSPayUnitHouseNumberBack = function(back){
						if (back.response.responseHeader.returnStatus == '0') {
							layer.alert(back.response.responseHeader.returnDesc);
							return false;
						}
						$scope.roomList = back.response.responseBody.roomList;
					};
					
					$http.post(baseUrl, request).success(function(back) {
						$scope.bSPayUnitHouseNumberBack(back);
					});
					
					

					/**
					 * 初始化分页参数
					 */
					var vm = $scope.vm = {};
					vm.page = {
						pageNum : 1,
						pageSize : 10
					};

					/**
					 * 分页动作
					 */
					vm.pageChanged = function() {
						console.log(vm.page);
						$scope.getBillListByPage('3');
					};

					/**
					 * 初始化展示钱数
					 * 
					 * @type {number}
					 */
					$scope.colletedBill = 0;
					$scope.colletedAmount = 0;
					$scope.receivedBill = 0;
					$scope.receivedAmount = 0;

					/**
					 * 获取复选框的值
					 * 
					 * @type {boolean}
					 */
					$scope.chk = false;
					var id = "";
					$scope.check = function(val, chk) {
						if (!chk == true) {
							id += val + ",";
						} else {
							id = id.replace(val + ",", "");
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
							$scope.bSQueryHouseInfoback(back);
						});
					};
					//回调
					$scope.bSQueryHouseInfoback = function(back){
						if (back.response.responseBody != undefined) {
							$scope.houseInfo = back.response.responseBody;
						}
					};
					
					/**
					 * 分页获取账单列表
					 * 
					 * @param flag
					 */
					$scope.getBillListByPage = function(flag) {
						
						var body = {};
						// 拿到指令作用域里的scope
						var address = null;
						try {
							address = angular.element($('#houseNo').scope())[0].address;
						} catch (e) {
						}
						
						var header = new RequestHeader("BSPayQueryBillList");
						if (address == undefined
								|| address.houseNo == undefined) {
							$scope.houseId = null;
						} else {
							$scope.houseId = address.houseNo;
						}

						var paid = $scope.paid ? '02' : '';
						var unpaid = $scope.unpaid ? '01' : '';
						var owe = $scope.owe ? '03' : '';
						var status = '' + paid + '|' + unpaid + '|' + owe;
						status = status.replaceNull('|');

						/**
						 * 分页
						 */
						// 初始化，设置pageNum=1
						if (flag == '1') {
							pageNum = 1;
						} else if (flag == '2') {
							// 搜索按钮
							if ($scope.houseId == undefined) {
								layer.alert('请选择房号');
								return;
							} else {
								pageNum = vm.page.pageNum;
							}
						} else {
							pageNum = vm.page.pageNum;
						}

						body = {
							plotId : $scope.plotId,
							houseId : $scope.houseId,
							pageNum : pageNum + "",
							pageSize : vm.page.pageSize + "",
							billStatus : status
						};

						var request = packRequest(body, header);
						$http.post(baseUrl, request).success(function(back) {
							$scope.bSPayQueryBillListback(back);
						});
					};
					//回调
					$scope.bSPayQueryBillListback = function(back){
						$scope.billList = back.response.responseBody.billList;
						$scope.responseBody = back.response.responseBody;

						// 已收账单、已收金额、待收账单、待收金额
						$scope.colletedBill = $scope.responseBody.colletedBill ? $scope.responseBody.colletedBill
								: 0;
						$scope.colletedAmount = $scope.responseBody.colletedAmount ? $scope.responseBody.colletedAmount
								: 0;
						$scope.receivedBill = $scope.responseBody.receivedBill ? $scope.responseBody.receivedBill
								: 0;
						$scope.receivedAmount = $scope.responseBody.receivedAmount ? $scope.responseBody.receivedAmount
								: 0;

						// 重置复选框
						id = "";
					};

					/**
					 * 一键缴费,包括选了复选框和不选的情况,
					 * 
					 * @constructor
					 */
					$scope.callBSPayOnePay = function() {
						try {
							$scope.getHouseInfo();
						} catch (e) {
							layer.alert('房号获取失败！');
							return;
						}
						var body = {};
						if (id.split(',').length - 1 > 0) {
//							var bills = id.split(',');
//							bills.pop();
							body = {
								houseId : $scope.houseId,
								billNos : id.substr(0,id.length-1)
							};
						} else {
							/**
							 * 默认不选调用接口查询待缴费用 调用查询代缴金额（物业代收
							 */
							body = {
								houseId : $scope.houseId
							};
						}
						var header = new RequestHeader("BSPayQueryArreas");
						var request = packRequest(body, header);

						$http.post(baseUrl, request).success(function(back) {
							$scope.bSPayQueryArreasback(back);
						});
					};
					
					$scope.bSPayQueryArreasback = function(back){
						// 传递给其他controller
						var record = back.response.responseBody.recordList;

						var commVar = {
							"houseId" : $scope.houseId,
							"plotId" : $scope.plotId,
							"chargeType" : "01",
							"payableType" : "周期性收费",
							"roomNo" : 	$scope.houseInfo.banNo+$scope.houseInfo.unitNo+'单元'+$scope.houseInfo.roomNo
						};
						var arreasAmountTotal = 0;
						var penaltyTotal = 0;
						var billMap = new Map();
						var record1 = new Array();
						for ( var i in record) {
							//除掉预缴
							if(record[i].isArreas=='1'){
								record.splice();
								continue;
							}
							record1.push(record[i]);
							arreasAmountTotal = arreasAmountTotal
									+ parseFloat(record[i].arreasAmount);
							penaltyTotal = penaltyTotal
									+ parseFloat(record[i].penaltyTotal);
							for(var j in record[i].arreaList){
								var arrea = record[i].arreaList;
								// 存在
								if (billMap.containsKey(arrea[j].billNo)) {
									if(billMap.get(arrea[j].billNo).indexOf(record[i].chargeNo)!=-1){
										continue;
									}
									var chargeNo = billMap.get(arrea[j].billNo)
											+ "," + record[i].chargeNo;
									billMap.remove(arrea[j].billNo);
									billMap.put(arrea[j].billNo, chargeNo);
								} else {
									billMap.put(arrea[j].billNo,
											record[i].chargeNo);
								}
							}
						}
						
						if(billMap.size()==0){
							layer.alert("不存在欠费！");
							return;
						}else{
							$("#ks-pop-box").css("display", "block");
						}
						
						
						var billList = new Array();
						for ( var i in billMap.keys()) {
							billList.push({
								billNo : billMap.keys()[i],
								chargeNos : billMap.values()[i]
							});
						}
						$scope.$emit("handleEmit", {
							record : record1,
							commVar : commVar,
							arreasAmountTotal : arreasAmountTotal,
							penaltyTotal : penaltyTotal,
							billList : billList
						});
					}

					/**
					 * 到达明细页
					 * 
					 * @param bill
					 */
					$scope.toDetail = function(bill) {
						$state.go('list.listPayCostDetail', {
							bill : $.toJSON(bill)
						});
					};

					/**
					 * 过滤状态查询
					 */
					$scope.filterList = function() {
						$scope.getBillListByPage(3);
					};
				});

/**
 * 下面三个指令暂时用不到
 */
listPayCostModel.filter('paging', function() {
	return function(items, index, pageSize) {
		if (!items)
			return [];
		var offset = (index - 1) * pageSize;
		return items.slice(offset, offset + pageSize);
	};
});

listPayCostModel.filter('size', function() {
	return function(items) {
		if (!items)
			return 0;
		return items.length || 0;
	};
});
listPayCostModel.filter('orderClass', function() {
	return function(direction) {
		if (direction === -1)
			return "glyphicon-chevron-down";
		else
			return "glyphicon-chevron-up";
	};
});
