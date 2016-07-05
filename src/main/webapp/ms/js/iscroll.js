/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function () {
    function Iscroll(elm, obj) {
        this.elm = $(elm);
        this.indexObj = YW.addObj({
            upelm: "",
            dnelm: ""
        }, obj || {});
        this.indexObj.callback = YW.addObj({
            updrag: function() { //向下拉回调

            },
            dndrag: function() { //向上拉回调

            },
            endupdrag: function() { //停止向下拉动

            },
            enddndrag: function() { //停止向下拉动

            }
        }, obj && obj.callback || {});
        this.upelm = $(this.indexObj.upelm);
        //this.dnelm=$(this.indexObj.dnelm);
        this.lframe = function () {
            return document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
        }

        this.rawY = 0;
        this.minuph=0;
        this.mindnh=0;
        this.jilu=0;
        this.mous = {
            mousemove: "mousemove",
            mouseup: "mouseup",
            mousedown: "mousedown"
        };
        if ("createTouch" in document) { //判断是否支持触摸屏
            this.mous = {
                mousemove: "touchmove",
                mouseup: "touchend",
                mousedown: "touchstart"
            };
        }
        this.mous = {
                mousemove: "touchmove",
                mouseup: "touchend",
                mousedown: "touchstart"
            };
        this.bind();
    }
    Iscroll.prototype = {
        updrag: function (evt) {//下拉
            $(".top-arrow-box .arrow").removeClass("load-icon");
            $(".top-arrow-box .text").html("下拉可以刷新");
            evt = this.fixEvt(evt);
            if (this.jilu - this.minuph > -100) {
                this.minuph = evt.pageY - this.rawY;
                console.log(this.jilu - this.minuph)
                $(".top-arrow-box").css({
                    "height":(-(this.jilu - this.minuph)) + "px"
                });
                this.elm.css({
                    "transform": "translate3d(0px, " + (-(this.jilu - this.minuph)) + "px, 0px)"
                });
                //transform: translate3d(0px, 0px, 0px); height: 29118.4px;
                if (YW.isFunction(this.indexObj.callback.updrag)) {
                    this.indexObj.callback.updrag();
                }
            } else {
                $(".top-arrow-box .text").html("松开立即刷新");
                $(".top-arrow-box .arrow").addClass("arrow_1");
            }
        },
        dndrag: function (evt) {//上拉
            var _evt=evt;
//            console.log("上拉")
            var lframe = this.lframe();
            $(".bottom-arrow-box .arrow").removeClass("load-icon");
            $(".bottom-arrow-box .text").html("上拉可以加载更多");
            evt = this.fixEvt(evt);
            var wBottom=$(window).height()-this.elm.get(0).getBoundingClientRect().bottom;
            if (wBottom < 100) {
                this.mindnh = this.rawY - evt.pageY;
//                $(".bottom-arrow-box").css({
//                    "height": (this.jilu + this.mindnh) + "px"
                //                });
                if (wBottom >0) {
                    $(".bottom-arrow-box").css({
                        "height": wBottom + "px"
                    });
                }
                this.elm.css({
                    "transform": "translate3d(0px, " + (-(this.jilu + this.mindnh)) + "px, 0px)"
                });
                if (this.mindnh >= 80 && YW.isFunction(this.indexObj.callback.dndrag)) {
                    this.indexObj.callback.dndrag();
                }
            } else {
                $(".bottom-arrow-box .text").html("松开立即加载更多");
                $(".bottom-arrow-box .arrow").addClass("arrow_2");
            }
            
        },           
        fixEvt: function (evt) {
//            this.restoreEvent(evt);
           // evt.preventDefault();//阻止默认事件
            var touch = evt.touches || evt.targetTouches || evt.originalEvent && evt.originalEvent.touches;
            if (touch && touch.length > 0) {
                evt = touch[0]; // 把元素放在手指所在的位置
            }
            return evt;
        },
        bind: function () {
            var _this = this;
            this.msUp = function (evt) { //停止拉动
                if (_this.elm.get(0).releaseCapture) { //释放IE移出窗口捕获事件
                    $(window).unbind("losecapture", _this.msUp);
                    _this.elm.get(0).releaseCapture(true);
                } else if (window.releaseEvents) {
                    window.releaseEvents(_this.elm.get(0));
                }
                var b = _this.minuph / 200;
                var i = _this.minuph;
                var time = 0;
                if (_this.jilu >= -100) {
//                    var n = 0;
//                    var wBottom = $(window).height() - _this.elm.get(0).getBoundingClientRect().bottom;
//                    alert(wBottom);
//                    if (wBottom>0) {
//                        n = wBottom;
//                    }
                    _this.jilu=_this.jilu-_this.minuph*1; 
                } else {
//                    var wBottom=$(window).height()-_this.elm.get(0).getBoundingClientRect().bottom;
//                    alert(wBottom);
                   _this.jilu=-100; 
                }
                _this.upInterval && clearInterval(_this.upInterval);
                if (_this.minuph > 0 && _this.jilu<0) {
//                    console.log("下拉动")
                    var up = _this.minuph;
                    _this.minuph = 0;
                    var stim = 0;
                    if (up >= 100) {
                        $(".top-arrow-box .text").html("正在刷新数据中...");
                        $(".top-arrow-box .arrow").addClass("load-icon");
                        stim = 500;
                    }
                    $(".top-arrow-box .arrow").removeClass("arrow_1");
                    setTimeout(function() {
                        _this.upInterval = setInterval(function() {
                            //i = i - (b * 10);
                            time = time + 10;
                            if (_this.jilu < 0) {
                                _this.jilu = _this.jilu + (b * 10);
                            } else {
                                _this.jilu = 0;
                            }
                            $(".top-arrow-box").css({
                                "height": _this.jilu + "px"
                            });
                            _this.elm.css({
                                "transform": "translate3d(0px, " + _this.jilu + "px, 0px)"
                            });
                            //                        _this.upelm.css({
                            //                            display: "block",
                            //                            height: i + "px"
                            //                        });
                            if (time >= 200 || _this.jilu <= 0) {
                                _this.upInterval && clearInterval(_this.upInterval);
                                _this.jilu = 0;
                                _this.elm.css({
                                    "transform": "translate3d(0px,0px, 0px)"
                                });
                                if (up >= 100) {
                                    if (YW.isFunction(_this.indexObj.callback.endupdrag)) {
                                        _this.indexObj.callback.endupdrag();
                                    }
                                }
                                _this.minuph = 0;
                            }

                        }, 10);
                    }, stim);
                }


            };
            this.dnmsUp = function () { //停止向上拉动
                if (_this.elm.get(0).releaseCapture) { //释放IE移出窗口捕获事件
                    $(window).unbind("losecapture", _this.msUp);
                    _this.elm.get(0).releaseCapture(true);
                } else if (window.releaseEvents) {
                    window.releaseEvents(_this.elm.get(0));
                }
//                if (_this.mindnh>50 && YW.isFunction(_this.indexObj.callback.enddndrag)) {
//                    _this.indexObj.callback.enddndrag();
//                }
                var wBottom=$(window).height()-_this.elm.get(0).getBoundingClientRect().bottom;
                var i = 0;
                var time = 0;
                _this.upInterval1 && clearInterval(_this.upInterval1);
                if(_this.jilu>=0){
                   _this.jilu=_this.jilu+_this.mindnh*1; 
                }else{
                   _this.jilu=0; 
                }
                
                //console.log(b)
                if (wBottom > 0) {
                    var b = wBottom / 200;
                    _this.jilu = _this.jilu - wBottom;
                    _this.mindnh = 0;
                    var stim = 0;
                    if (wBottom >= 100) {
                        if (YW.isFunction(_this.indexObj.callback.enddndrag)) {
                            _this.indexObj.callback.enddndrag();
                        }
                        $(".bottom-arrow-box .text").html("正在加载更多数据...");
                        $(".bottom-arrow-box .arrow").addClass("load-icon");
                        stim = 1000;
                    }
                    $(".bottom-arrow-box .arrow").removeClass("arrow_2");
                    _this.upInterval1 && clearInterval(_this.upInterval1);
                    setTimeout(function() {
                        _this.upInterval1 = setInterval(function () {
                            i = i + (b * 10);
                            time = time + 10;

                            //                        if (_this.jilu >= 0) {
                            ////                            alert(_this.jilu)
                            //                            _this.jilu=_this.jilu- (b * 10);
                            //                        }else{
                            //                            _this.jilu=0;
                            //                        }
                            $(".bottom-arrow-box").css({
                                "height": parseInt(wBottom) - i + "px"
                            });
                            _this.elm.css({
                                "transform": "translate3d(0px, -" + (_this.jilu + parseInt(wBottom) - i) + "px, 0px)"
                            });
                            if (time >= 200 || parseInt(wBottom) - i <= 0 || _this.jilu <= 0) {
                                //                            if(_this.jilu>=0){
                                //                                _this.jilu=_this.jilu- (b * 10);
                                //                            }else{
                                //                                _this.jilu=0;
                                //                            }
                                if (_this.jilu <= 0) {
                                    _this.jilu = 0;
                                }
                                _this.upInterval1 && clearInterval(_this.upInterval1);
                                $(".bottom-arrow-box").css({
                                    "height": "0px"
                                });
                                _this.elm.css({
                                    "transform": "translate3d(0px, -" + _this.jilu + "px, 0px)"
                                });
                            }

                        }, 10);
                    }, stim);
                }
            };

            this.move = function (evt) { //向下拉动
                var _evt = evt;
                evt.preventDefault(); //阻止默认事件
                evt = _this.fixEvt(evt);
                if (_this.elm.get(0).setCapture) { //设置IE移出窗口捕获事件
                    _this.elm.get(0).setCapture(true);
                    $(window).bind("losecapture", _this.msUp);
                } else if (window.captureEvents) {
                    window.captureEvents(_this.elm.get(0));
                }
                if (evt.pageY - _this.rawY > 0) {
                    _this.updrag(_evt); //下拉刷新 
                }else {
                    _this.dndrag(_evt);//上拉
                }
            }

            $(document).bind(_this.mous.mouseup, _this.dnmsUp); //停止上拉加载

            $(document).bind(_this.mous.mouseup, _this.msUp); //停止下拉刷新
            
            $(document).bind(_this.mous.mousemove, _this.move);
            
            $(document).bind(_this.mous.mousedown, function (evt) {
                evt = _this.fixEvt(evt);
                _this.rawY = evt.pageY;
//                var lframe = _this.lframe();
            })
        }
    }
    YW.extend("Iscroll",Iscroll);
})()

/*----------   2015-10-16 14:14:07   ----------*/