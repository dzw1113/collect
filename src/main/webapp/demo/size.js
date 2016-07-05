/**
 * Created by lenovo on 2015/9/19.
 */
angular.module('scHelper').filter('size', function() {
    return function (items) {
        if (!items)
            return 0;

        return items.length || 0
    }
});