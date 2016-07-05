/**
 * Created by lenovo on 2015/9/29.
 */
var reconcilitationModel = angular.module("reconcilitationModel", []);

reconcilitationModel.controller("reconcilitationCtrl", function ($rootScope, $scope, $http, $state) {
    $scope.responseBody = JSON.parse(sessionStorage.getItem("shareBody"));
    $scope.responseHeader = JSON.parse(sessionStorage.getItem("shareHeader"));

    try {
        $scope.plotId = $scope.responseBody.cList[0].cid;
    } catch (e) {
    }
    $scope.startDate = new Date().FirstDate('yyyyMMdd');
    $scope.endDate = new Date().LastDate('yyyyMMdd');

    $("#startDate").datetimepicker({timepicker: false, format: 'Ymd'});
    $("#endDate").datetimepicker({timepicker: false, format: 'Ymd'});

    /**
     * ��ҳ��ȡ������Ϣ
     * @param flag
     */
    $scope.getRecordList = function () {
        var body = {
            plotId: $scope.plotId,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        };
        var header = new RequestHeader("BSPayQueryReconInfo");
        var request = packRequest(body, header);
        
        $http.post(baseUrl, request).success(function(back) {
        	$scope.reconList = back.response.responseBody.reconList;
            $scope.responseBody = back.response.responseBody;
            var recMap = new Map();
            for (var i in $scope.reconList) {
                var reconrd = $scope.reconList[i];
                if (reconrd.staType == "R001") {
                    recMap.put("R001", reconrd);
                }
                if (reconrd.staType == "R002") {
                    recMap.put("R002", reconrd);
                }
                if (reconrd.staType == "R003") {
                    recMap.put("R003", reconrd);
                }
                if (reconrd.staType == "R004") {
                    recMap.put("R004", reconrd);
                }
                if (reconrd.staType == "R005") {
                    recMap.put("R005", reconrd);
                }
                if (reconrd.staType == "R006") {
                    recMap.put("R006", reconrd);
                }
                if (reconrd.staType == "R007") {
                    recMap.put("R007", reconrd);
                }
                if (reconrd.staType == "R008") {
                    recMap.put("R008", reconrd);
                }
            }
            $scope.recMap = recMap;
		});
    };
    $scope.getRecordList();


    /**
     * ��ҳ��ȡ�����ύ
     * @param flag
     */
    $scope.getRecordSubmit = function () {
        var body = {
            plotId: $scope.plotId,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            reconResult : $scope.reconResult,
            failureReason : $scope.failureReason
        };
        var header = new RequestHeader("BSPayReconSubmit");
        var request = packRequest(body, header);

        $http.post(baseUrl, request).success(function(back) {
        	if (back.response.responseHeader.returnStatus == '0') {
            	layer.alert(back.response.responseHeader.returnDesc==undefined?'对账失败':back.response.responseHeader.returnDesc);
    			return;
    		}else{
    			layer.alert(back.response.responseHeader.returnDesc==undefined?'对账成功':back.response.responseHeader.returnDesc);
    		}
            $scope.reconList = back.response.responseBody.reconList;
            $scope.responseBody = back.response.responseBody;
            $state.go("list.payListHistory");
		});
    }

});