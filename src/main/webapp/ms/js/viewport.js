/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function(){
    if (/Android (d+.d+)/.test(navigator.userAgent)) {
        var version = parseFloat(RegExp.$1);
        if (version > 2.3) {
            var phoneScale = parseInt(window.screen.width) / 640;
            document.write('<meta name="viewport" content="width=640, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
        } else {
            document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
        }
    } else {
        document.write('<meta name="viewport" content="width=640,user-scalable=no,target-densitydpi=device-dpi">');
    }
})();

/*----------   2015-10-16 14:14:07   ----------*/