/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

window.$ && $(function () {
    (function () {
        var cls = $(".JsW").get();
        for (var i = 0; i < cls.length; i++) {
            if ($(cls[i]).attr("data-position-type") == "fixed") {
                new YW.position.Fixed(cls[i], YW.parse($(cls[i]).attr("data-position-config")));
            }
            if ($(cls[i]).attr("data-size-type") == "widescreen") {
                new YW.size.Widescreen(cls[i], YW.parse($(cls[i]).attr("data-size-config")));
            }
            if ($(cls[i]).attr("data-align-type") == "align") {
                new YW.align.Align(cls[i], YW.parse($(cls[i]).attr("data-align-config")));
            }

            switch ($(cls[i]).attr("data-widget-type")) {
                case "tab":
                    new YW.widget.Tab(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
                    break;
                case "popup":
                    new YW.widget.Popup(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
                    break;
                case "accordion":
                    new YW.widget.Accordion(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
                    break;
                case "slide":
                    var slide = new YW.widget.Slide(cls[i], YW.parse($(cls[i]).attr("data-widget-config")));
                    slide.start();
                    break;
                default:
            }


            switch ($(cls[i]).attr("data-ctrlmutual-type")) {
                case "selectswap":
                    new YW.ctrlmutual.SelectSwap(cls[i], YW.parse($(cls[i]).attr("data-ctrlmutual-config")));
                    break;
                case "disabled":
                    new YW.ctrlmutual.Disabled(cls[i], YW.parse($(cls[i]).attr("data-ctrlmutual-config")));
                    break;
                default:
            }



            switch ($(cls[i]).attr("data-control-type")) {
                case "number":
                    new YW.controls.Adjustment(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                case "checkbox":
                    new YW.controls.Checkbox(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                case "checkboxall":
                    new YW.controls.CheckboxAll(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                case "radio":
                    new YW.controls.Radio(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                case "select":
                    new YW.controls.Select(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                case "button":
                    new YW.controls.Button(cls[i], YW.parse($(cls[i]).attr("data-control-config")));
                    break;
                default:
            }
        }
    })();
});





window.$ && $(document).ready(function () {
    var cls = $("[data-bind]").get();
    for (var i = 0; i < cls.length; i++) {
        new YW.Evt.Bind(cls[i], YW.parse($(cls[i]).attr("data-bind")));
    }
});




(function () {
    if(window.angular){
        var widgetMd=angular.module('widget', []);

        widgetMd.directive('fixed',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.position.Fixed(iElm[0], YW.parse(iAttrs.positionConfig));
                }
            };
        });

        widgetMd.directive('widescreen', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.size.Widescreen(iElm[0], YW.parse(iAttrs.sizeConfig));
                }
            };
        });

        widgetMd.directive('align', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.align.Align(iElm[0], YW.parse(iAttrs.alignConfig));
                }
            };
        });



        widgetMd.directive('tab1', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.widget.Tab(iElm[0], YW.parse(iAttrs.widgetConfig));
                }
            };
        });


        widgetMd.directive('popup',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.widget.Popup(iElm[0], YW.parse(iAttrs.widgetConfig));
                }
            };
        });


        widgetMd.directive('accordion',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.widget.Accordion(iElm[0], YW.parse(iAttrs.widgetConfig));
                }
            };
        });

        widgetMd.directive('slide', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.widget.Slide(iElm[0], YW.parse(iAttrs.widgetConfig));
                }
            };
        });


        widgetMd.directive('selectswap',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.ctrlmutual.SelectSwap(iElm[0], YW.parse(iAttrs.ctrlmutualConfig));
                }
            };
        });


        widgetMd.directive('disabled1',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.ctrlmutual.Disabled(iElm[0], YW.parse(iAttrs.ctrlmutualConfig));
                }
            };
        });

        widgetMd.directive('number',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.controls.Adjustment(iElm[0], YW.parse(iAttrs.controlConfig));
                }
            };
        });


        widgetMd.directive('checkbox', function($window){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.controls.Checkbox(iElm[0], YW.parse(iAttrs.controlConfig));
                    $.each($window.document.CheckboxAll,function(k,v){
                        v.forfindInputs();
                    })
                    //forfindInputs
                    //$scope.$apply();
                }
            };
        });


        widgetMd.directive('checkboxall',function($window){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    if(!$window.document.CheckboxAll){
                        $window.document.CheckboxAll=[];
                    }
                    var all=new YW.controls.CheckboxAll(iElm[0], YW.parse(iAttrs.controlConfig));
                    $window.document.CheckboxAll.push(all)
                }
            };
        });


        widgetMd.directive('radio',function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.controls.Radio(iElm[0], YW.parse(iAttrs.controlConfig));
                }
            };
        });


        widgetMd.directive('select', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.controls.Select(iElm[0], YW.parse(iAttrs.controlConfig));
                }
            };
        });

        widgetMd.directive('button', function(){
            return {
                scope: {}, // {} = isolate, true = child, false/undefined = no change
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs) {
                    new YW.controls.Button(iElm[0], YW.parse(iAttrs.controlConfig));
                }
            };
        });

    }

})();

/*----------   2015-10-16 14:14:07   ----------*/