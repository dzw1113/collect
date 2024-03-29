/**
 * Created by lenovo on 2015/9/17.
 */
/**
 *@class index
 *@description App主模块,所有的模块被主模块引用
 *@time 2014-09-20 10:53
 *@author StarZou
 **/


var App = angular.module('App', ['mgcrea.ngStrap', 'App.controllers']);
console.log(App);


var myModule = angular.module('hello', []);
myModule.controller('pagingCtrl', function ($scope, $http) {
    $scope.data = [{
        id: 1,
        name: "a"
    }, {
        id: 2,
        name: "b"
    }];
    $scope.currentPage = 1;
    $scope.numPages = 5;
    $scope.pageSize = 10;
    $scope.pages = [];
    //get first page
    /*$http.get('url',
     {
     method: 'GET',
     params: {
     'pageNo': $scope.currentPage,
     'pageSize': $scope.pageSize
     },
     responseType: "json"
     }).then(function (result) {
     $scope.data = result.data.Data;
     $scope.numPages = Math.ceil(result.data.Total / result.data.PageSize);
     });*/
    $scope.onSelectPage = function (page) {
        //replace your real data
        /*$http.get('url',
         {
         method: 'GET',
         params: {
         'pageNo': page,
         'pageSize': $scope.pageSize
         },
         responseType: "json"
         }).then(function (result) {
         $scope.data = result.data.Data;
         $scope.numPages = Math.ceil(result.data.Total / result.data.PageSize);
         });*/
    };
});

myModule.directive('paging', function () {
    return {
        restrict: 'E',
        //scope: {
        //    numPages: '=',
        //    currentPage: '=',
        //    onSelectPage: '&'
        //},
        template: '',
        replace: true,
        link: function (scope, element, attrs) {
            scope.$watch('numPages', function (value) {
                scope.pages = [];
                for (var i = 1; i <= value; i++) {
                    scope.pages.push(i);
                }
                alert(scope.currentPage)
                if (scope.currentPage > value) {
                    scope.selectPage(value);
                }
            });
            scope.isActive = function (page) {
                return scope.currentPage === page;
            };
            scope.selectPage = function (page) {
                if (!scope.isActive(page)) {
                    scope.currentPage = page;
                    scope.onSelectPage(page);
                }
            };
            scope.selectPrevious = function () {
                if (!scope.noPrevious()) {
                    scope.selectPage(scope.currentPage - 1);
                }
            };
            scope.selectNext = function () {
                if (!scope.noNext()) {
                    scope.selectPage(scope.currentPage + 1);
                }
            };
            scope.noPrevious = function () {
                return scope.currentPage == 1;
            };
            scope.noNext = function () {
                return scope.currentPage == scope.numPages;
            };

        }
    };
});