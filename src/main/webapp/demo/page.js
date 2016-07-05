/**
 * Created by lenovo on 2015/9/19.
 */

angular.module('scHelper').filter('paging', function() {
    return function (items, index, pageSize) {
        if (!items)
            return [];

        var offset = (index - 1) * pageSize;
        return items.slice(offset, offset + pageSize);
    }
});