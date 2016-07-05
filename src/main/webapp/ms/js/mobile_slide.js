/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function (window) {
    var pfx = (function () {
        var style = document.createElement('dummy').style,
            prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
            memory = {};

        function _pfx(prop) {
            if (typeof memory[prop] === "undefined") {
                var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = [prop].concat(prefixes.map(function (prefix) {
                        return prefix + ucProp;
                    }));
                memory[prop] = null;
                for (var i in props) {
                    if (style[props[i]] !== undefined) {
                        memory[prop] = props[i];
                        break;
                    }
                }
            }
            return memory[prop];
        }

        return _pfx;
    })();

    function css(el, props) {
        for (var key in props) {
            var pkey = pfx(key);
            if (pkey !== null) el.style[pkey] = props[key];
        }
        return el;
    }
    var MobileSlide = function (elm, obj) {
        if (!elm) { return; }
        this.obj = obj || {};
        this.elm = $(elm);
        var _this = this;
        var dfboj = {
            effect: 'scrolly',// 'none', //值为:scrollx切换时的动画方向水平方向,scrolly切换时的动画方向垂直方向
            //none, 最朴素的显示/隐藏效果||fade, 可实现淡隐淡现的效果
//            countdown: false, //是否开启倒计时样式 true/false (默认值：false)
//            countCls: "ks-switchable-down", //设定倒计时样式Class名称可先在CSS里对样式进行定义
//            navCls: "ks-switchable-nav", //对其进行轮播的目标列表的class名
              contentCls: "slide-item",//"ks-switchable-content"//, //轮播列表所对应的内容列表的class名
//            contentWidth: null, //轮播列表所对应的内容列表的宽度
//            delay: 3, //延迟加载时间，当前显示图片到切换其他图片动作开始，这中间的停留时间.1 == 100ms 
//            triggerType: 'mouseover', //触发方式——mouse：鼠标经过触发click：鼠标点击触发
//            hasTriggers: true, // true/false (默认值：true)  是否设置触发点
//            steps: 1, //  自定义数值 (默认值：1)  切换视图内有多少个panels 
//            viewSize: null, //切换视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
//            activeIndex: 0, //  自定义数值 (默认值：0)  默认激活的列表项  
//            activeTriggerCls: 'active', //  自定义值 (默认值：active)  默认激活列表项的class值 
//            autoplay: true, //true/false (默认值：true)  是否自动播放
//            flipButton: true,//是否存在上一页下一页按钮
//            pnview: false,//未获取焦点时是否显示上一页，下一页按钮(true为显示/false为不显示)
//            prevBtnCls: "prev", //自定义值  上一页的class值  
//            nextBtnCls: "next", //自定义值  下一页的class值
//            BtnCls: "activebtn", //自定义值  激活的上一页或下一页的class
              duration: 10, //  自定义值(默认：0.03)  动画时长,一张图片开始切换到另一张图片显示的时间10 == 10ms
              durationtim:1000, //动画时长;
              carousel: false//,//到最后一页点下一面是否转到第一页
//            zIndex: 1,//z轴高度
//            object: ""//用对象方式传入参数，输入要传入对象名
        };
        var indexobj = YW.addObj(dfboj, this.obj);
        this.indexobj = YW.addObj(indexobj, indexobj.object);
        this.mous = {
            mousemove: "touchmove",
            mouseup: "touchend",
            mousedown: "touchstart"
        };
        this.startX = 0;
        this.startY = 0;
        this.pageX = 0;
        this.pageY = 0;
        this.before = 0;//当前显示
        this.transform = this.formatStyle("transform");
        this.initialize();
        this.invoke(0);
        this.start();
        this.bind();
    }
    MobileSlide.prototype = {
        formatStyle: function (text) {//格式化CSS3属性名
            var prefixes = ['-webkit-', '-moz-', '-O-', '-ms-', 'khtml'];
            var ret = "";
            var _this = this;
            YW.each(prefixes, function(v, k) {
                if (typeof _this.elm.get(0).style[v + text] !== "undefined") {
                    ret = v;
                }
                //this.elm.get(0).style[v+text] = props[key]
            });
            //typeof memory[prop] === "undefined"
            return ret + text;
        },
        initialize: function() {//初始化
            this.contentCls = this.elm.find("." + this.indexobj.contentCls);
            var _this = this;
            if (this.contentCls.length > 0) {
                YW.each(this.contentCls.get(), function (v, k) {
                    v.index = k;
                    v.Y = (_this.elm.height() * k);
                    v.style[_this.transform] = "translate3d(0px, " + (_this.elm.height() *k) + "px, 0px)";
//                    v.getBoundingClientRect()
                });
            }
        },
        setTranslate: function (n,n1) {//初始化
            var _this = this;
            n1 = n1 || 0;
//            if (n === 0 && n1 < 0 || n >= this.contentCls.length && n1 > 0) {
//                return;
//            }
            //var y = _this.elm.height() * n - n1;
            //_this.Y = n1;
            //var ctx = _this.indexobj.durationtim / _this.indexobj.duration;
            var h = _this.elm.height() - _this.pageY;
            _this.interval && clearInterval(_this.interval);
            //alert(n)
            //console.log(_this.pageY)
            YW.each(_this.contentCls.get(), function (v, k) {
                var y = _this.elm.height() * (k - n);
                //var Y = _this.elm.height() * (k - _this.before) + _this.pageY + h;
                v.style[_this.transform] = "translate3d(0px, " + y + "px, 0px)";
                _this.before = n;
                //v.Y = v.Y + a;
            });
            _this.pageY = 0;
            return;
            if (this.contentCls.length > 0) {
                var i = 0;
                var tim = 0;
                _this.interval = setInterval(function () {
                    tim = tim + _this.indexobj.duration;
                    i = i + a;
                    YW.each(_this.contentCls.get(), function (v, k) {
                        var y = _this.elm.height() * (k - n) - _this.pageY;
                        v.style[_this.transform] = "translate3d(0px, " + y + "px, 0px)";
                        //v.Y = v.Y + a;

                    });
                    if (y<0) {
                        if (i <= y) {
                            _this.interval && clearInterval(_this.interval);
                            _this.before = n;
                            _this.pageY=0
                        }
                    } else if (y>0) {
                        if (i >= y) {
                            _this.interval && clearInterval(_this.interval);
                            _this.before = n;
                            _this.pageY = 0;
                        }
                    } 
//                    if (i < y && i >= y || i > y && i <= y || y == 0) {
//                        console.log(i + "==" + y + "tttttttttttttttttttttttt")
//                        _this.interval && clearInterval(_this.interval);
//                        _this.before = n;
//                    }
                }, _this.indexobj.duration);
                
            }
        },
        start: function() {//开始
            
        },
        stop: function() {//停止
            
        },
        next: function () {//下一帧
            var n = this.before||0;
            if (n + 1 < this.contentCls.length) {
                n = n + 1;
            } else {
                if (this.indexobj.carousel) {
                    n = 0;
                }
            }
            this.invoke(n);
        },
        prev: function () {//上一帧
            var n = this.before||0;
            if (n === 0) {
                if (this.indexobj.carousel) {
                    n = this.contentCls.length - 1;
                }
            } else {
                n = n - 1;
            }
            this.invoke(n);
        },
        invoke: function (n,y) {//具体显示哪一帧
            this.setTranslate(n);
        },
        move: function(n) {
            
        },
        fixEvt: function (evt) {//取得第一个手指位置
            //            this.restoreEvent(evt);
            //evt.preventDefault();//阻止默认事件
            var ret;
            var touch = evt.touches || evt.targetTouches || evt.originalEvent && evt.originalEvent.touches;
            if (touch && touch.length > 0) {
                ret = touch[0]; // 把元素放在手指所在的位置
            }
            return ret;
        },
        bind: function () {//绑定事件
            var _this = this;
            

            var msUp=function (evt) {//松开手指
//                var touch = _this.fixEvt(evt);
                var x = Number(_this.pageX); //页面触点X坐标  
//                var y = Number(_this.pageY); //页面触点Y坐标 
                //var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
                //判断滑动方向 
                if (_this.indexobj.effect == "scrolly") {
                    //alert(_this.pageY)
                    //_this.setTranslate(_this.before, _this.pageY);
                    if (_this.pageY < -100) {
                        _this.prev();
                        //_this.elm.unbind("touchmove", touchmove);
                        return;
                        //左右滑动  
                    } else if (_this.pageY >100) {
                        _this.next();
                        //_this.elm.unbind("touchmove", touchmove);
                        return;
                    }
                } else {
                    //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
                    if (x - _this.startX > 20) {
                        _this.prev();
                        //_this.elm.unbind("touchmove", touchmove);
                        return;
                        //左右滑动  
                    }
                    if (x - _this.startX < -20) {
                        _this.next();
                        //_this.elm.unbind("touchmove", touchmove);
                        return;
                    }
                    //                if (y - startY != 0) {
                    //                    //上下滑动  
                    //                }
                }
            }

            var touchmove = function (evt) {//手指手动
                evt.preventDefault();
                var touch = _this.fixEvt(evt);
                var x = Number(touch.pageX); //页面触点X坐标  
                var y = Number(touch.pageY); //页面触点Y坐标 
                _this.pageX = x;
                //_this.pageY = y;

                //var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
                //判断滑动方向 
                if (_this.indexobj.effect == "scrolly") {
                    if (_this.before == 0 && _this.startY - y < 0 || _this.before + 1 == _this.contentCls.length && _this.startY - y > 0) {
                        return;
                    }
                    YW.each(_this.contentCls.get(), function (v, k) {
                        var Y = _this.elm.height() * (k - _this.before);
                        
                        //console.log(Y)
                        v.style[_this.transform] = "translate3d(0px, " + (Y - (_this.startY - y)) + "px, 0px)";
                        //alert(v.style[_this.transform]);
                        //v.Y = v.Y - (_this.startY - y);
                    });
                    _this.pageY = (_this.startY - y);
                    //_this.setTranslate(_this.before, -(y - _this.startY));
                }
            }


            $(document).bind("touchmove", touchmove);
            $(document).bind("touchend", msUp); //松开手指
            $(document).bind("touchstart", function (evt) {
                var touch = _this.fixEvt(evt);
                var x = Number(touch.pageX); //页面触点X坐标  
                var y = Number(touch.pageY); //页面触点Y坐标  
                //记录触点初始位置  
                _this.startX = x;
                _this.startY = y;
            });
        }
    }
    window.MobileSlide = MobileSlide;
})(window)


/*----------   2015-10-16 14:14:07   ----------*/