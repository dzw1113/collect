/**
 * 
 * @authors penyuying
 * @date    2015-08-24 11:07:21
 * @version $Id$
 */

//function preview(oper){
//if (oper < 10){
//        pagesetup_null();
//        bdhtml=window.document.body.innerHTML;//获取当前页的html代码
//        sprnstr="<!--startprint"+oper+"-->";//设置打印开始区域
//        eprnstr="<!--endprint"+oper+"-->";//设置打印结束区域
//        prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html
//
//        prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html
//        window.document.body.innerHTML=prnhtml;
//        
//        window.print();
//        window.document.body.innerHTML=bdhtml;
//        } else {
//        window.print();
//    }
//}

//function preview() {
//        bdhtml = window.document.body.innerHTML;//获取当前页的html代码
//        var prnnd = $(".ks-print");
//        prnnd.children().addClass("printreceipt");
//        prnhtml = prnnd.html();
//        window.document.body.innerHTML = prnhtml;
//        window.print();
//        window.document.body.innerHTML = bdhtml;
//}
//
//window.onload=function() {
//    preview();
//}


(function () {
    function PreView(elm, obj) {
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            printCls: "ks-print" //打印样式class名
        }, obj || {});
        this.bdhtml = window.document.body.innerHTML; //获取当前页的html代码
        var prnnd = $(elm);
        prnnd.children().addClass(this.indexobj.printCls);
        var prnhtml = prnnd.html();
        window.document.body.innerHTML = prnhtml;
    }

    PreView.prototype = {
        print: function() {
            window.print();
            window.document.body.innerHTML = this.bdhtml;
        }
    };
    YW.extend("widget.PreView", PreView);
})();
$(window).bind("load", function () {
    (function () {
        var cls = $(".JsW").get();
        for (var i = 0; i < cls.length; i++) {
            switch ($(cls[i]).attr("data-widget-type")) {
                case "print":
                	var print= new YW.widget.PreView(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
                    setTimeout(function () {
                        print.print();
                    }, 0);
                    break;
            }
        }
    })();
});
//window.onload = function () {
//    load();
//}
//$(window).bind("load",load);
//function load() {
//    (function () {
//        var cls = $(".JsW").get();
//        for (var i = 0; i < cls.length; i++) {
//            switch ($(cls[i]).attr("data-widget-type")) {
//                case "print":
//                    new YW.widget.PreView(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
//                    break;
//            }
//        }
//    })();
//};