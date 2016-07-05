angular.module('myApp', []).controller('MessageController', function ($scope) {

    $scope.getMessage = function() {
        setTimeout(function() {
            $scope.$apply(function() {
                //wrapped this within $apply
                $scope.message = 'Fetched after 3 seconds';
                console.log('message:' + $scope.message);
            });
        }, 2000);
    }

    $scope.getMessage();

});