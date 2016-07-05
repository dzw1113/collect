/**
 * Created by lenovo on 2015/9/22. 预缴费用
 */
var goldProPayListModel = angular.module("goldProPayListModel", []);

goldProPayListModel.controller("goldProPayListCtrl", function($rootScope,
		$scope, $http, $state, $stateParams) {
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	$scope.houseInfo = $.evalJSON($stateParams.houseInfo);
	$scope.houseId = $stateParams.houseId;

	/**
	 * 初始化分页参数
	 * 
	 * @type {{}}
	 */
	var vm = $scope.vm = {};
	vm.page = {
		pageNum : "" + 1,
		pageSize : "" + 10
	};

	/**
	 * 分页动作
	 */
	vm.pageChanged = function() {
		$scope.goldQueryList();
	};

	try {
		$scope.plotId = $scope.responseBody.cList[0].cid; // 小区编号
	} catch (e) {
	}
	/**
	 * 查询履约金列表
	 */
	$scope.goldQueryList = function() {
		var body = {
			plotId : $scope.plotId,
			houseId : $scope.houseId,
			pageNum : "" + vm.page.pageNum,
			pageSize : vm.page.pageSize,
		};
		var header = new RequestHeader("BSPayQueryformanceCharge");
		var request = packRequest(body, header);
		$http.post(baseUrl, request).success(function(back) {
			$scope.formanceList = back.response.responseBody.formanceList;
			$scope.responseBody = back.response.responseBody;
		});
	};
	$scope.goldQueryList();

	$scope.toGoldReturn = function(formance) {
		var houseInfo = $scope.houseInfo;
		$state.go("list.goldProReturn", {
			formance : $.toJSON(formance),
			houseInfo : $.toJSON(houseInfo)
		});
	};
});
