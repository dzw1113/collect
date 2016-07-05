/**
 * Created by lenovo on 2015/9/19.
 */
'use strict';

angular.module('scHelper').filter('orderClass', function() {
    return function (direction) {
        if (direction === -1)
            return "glyphicon-chevron-down";
        else
            return "glyphicon-chevron-up";
    }
});