/**
 * Created by lenovo on 2015/9/18.
 */
var app = angular.module('myApp', ['ngGrid']);
app.controller('MyCtrl', function ($scope) {
    $scope.myData = [{name: 'Kyle Hayhurst', age: 25, interest: 'Javascript', id: 1},
        {name: 'Jimmy Hampton', age: 25, interest: 'HTML', id: 3},
        {name: 'Tim Sweet', age: 27, interest: 'HTML', id: 4},
        {name: 'Jonathon Ricaurte', age: 29, interest: 'CSS', id: 6},
        {name: 'Brian Hann', age: 28, interest: 'PHP', id: 2}];


    $scope.gridOptions = {
        data: 'myData',
        showGroupPanel: true,
        columnDefs: [{field: 'name', displayName: 'Name'},
            {field: 'age', displayName: 'Age'},
            {field: 'interest', displayName: 'Interest'},
            {
                field: 'name',
                cellTemplate: '<div>{{row.getProperty(col.name)}}</div>'
            }
        ]
    };
});