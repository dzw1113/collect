var USLoginModel = angular.module("USLoginModel", []);

USLoginModel.config([ '$httpProvider', function($httpProvider) {
	// 默认是json
	// $httpProvider.defaults.headers.post['Content-Type'] =
	// 'application/json;charset=utf-8';
} ]);

/**
 * 登录动作
 */
USLoginModel.controller("USLoginCtrl", function($rootScope, $scope, $http,
		$state, $stateParams) {

	$scope.pwd = null;
	$scope.account = null;
	$scope.usLoginCallBack = function(back) {
		if (back.response.responseHeader.returnStatus == '1') {
			var responseHeader = unPackHeader(back);
			var responseBody = unPackBody(back);
			shareRequestHeader = responseHeader;
			shareRequestBody = responseBody;

			sessionStorage.setItem("shareHeader", JSON
					.stringify(responseHeader));
			sessionStorage.setItem("shareBody", JSON.stringify(responseBody));

			$state.go('list.listPayCost', {
				payCost : 1
			});
		} else {
			layer.alert(back.response.responseHeader.returnDesc);
			return;
		}
	};

	$scope.uSUserIdentity = function(back) {
		if (back.response.responseHeader.returnStatus == '0') {
			layer.alert(back.response.responseHeader.returnDesc);
			return;
		} else {

			var header = new RequestHeader("USLogin");
			var request = packRequest({
				password : $scope.pwd,
				username : $scope.account
			}, header);
			// 登录
			$http.post(baseUrl, request).success(function(back) {
				$scope.usLoginCallBack(back);
			});
		}
	};

	$scope.usLogin = function usLogin(serviceCode, formName) {
		// 员工认证
		$scope.mobileNo = $scope.account;
		var header = new RequestHeader("USUserIdentity");
		var request = packRequest({
			mobileNo : $scope.mobileNo
		}, header);

		// 光标
		tabChange('0');
		tableObj = {
			"activeIndex" : sessionStorage.getItem("tabIndex") ? sessionStorage
					.getItem("tabIndex") : 0
		};

		$http.post(baseUrl, request).success(function(back) {
			$scope.uSUserIdentity(back);
		});
	};
});

/**
 * 头部，退出和跳转
 */
USLoginModel.controller("HeaderCtrl", function($scope, $state, $rootScope) {
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	if($scope.responseBody!=undefined && $scope.responseBody.companyLogo!=null && $scope.responseBody.companyLogo!=undefined){
		angular.element("#logo").css({'background-image':"url('"+$scope.responseBody.companyLogo+"')"});
	}

	$scope.USExit = function() {
		sessionStorage.removeItem("shareBody");
		sessionStorage.removeItem("shareHeader");
		tabChange('0');
		$scope.responseBody = null;
		$scope.responseHeader = null;
		$rootScope.$state.go('index');
	};

});

/**
 * 修改密码
 */
USLoginModel.controller("RePwdCtrl", function($scope, $state, $window) {
	$scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
	$scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

	$scope.rePwd = function usLogin(serviceCode, formName) {
		/**
		 * 修改密码
		 */
		var obj = {
			mobile : $scope.responseBody.mobile,
			oldPassword : $scope.oldPassword,
			password : $scope.password,
			type : "02"
		};
		var requestHeader = new RequestHeader(serviceCode);
		var request = packRequest(obj, requestHeader);

		$http.post(baseUrl, request).success(function(back) {
			if (back && back.response.responseHeader.returnStatus == '1') {
				sessionStorage.removeItem("shareBody");
				sessionStorage.removeItem("shareHeader");
				$scope.responseBody = null;
				$scope.responseHeader = null;
				layer.alert(back.response.responseHeader.returnDesc);

				$state.go('index');
			} else {
				layer.alert(back.response.responseHeader.returnDesc);
			}
		});
		return flag;
	};

	$scope.go_back = function() {
		$window.history.back();
	};
});
