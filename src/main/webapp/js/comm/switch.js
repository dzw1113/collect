/**
 * 
 * @authors pengyuying
 * @date    2015-08-21 16:11:12
 * @version $1.0.0$
 */

(function () {
    function Tab(elm, obj) {
        if (!elm) {
            return;
        }
        var indexobj = YW.addObj({
            navCls: "ks-switchable-nav", //对其进行轮播的目标列表的class名
            navChildren: "", //navCls子节点class
            contentCls: "ks-switchable-content", //轮播列表所对应的内容列表的class名
            contentChildren: "",
            delay: 1, //延迟加载时间，当前显示图片到切换其他图片动作开始，这中间的停留时间.1 == 100ms 
            triggerType: 'click', //触发方式——mouseover：鼠标经过触发click：鼠标点击触发
            hasTriggers: true, // true/false (默认值：true)  是否设置触发点
            steps: 1, //  自定义数值 (默认值：1)  切换视图内有多少个panels 
            activeIndex: 0, //  自定义数值 (默认值：0)  默认激活的列表项  
            activeTriggerCls: 'active', //  自定义值 (默认值：active)  默认激活列表项的class值 
            autoplay: true, //true/false (默认值：true)  是否自动播放
            prevBtnCls: "prev", //  自定义值  上一页的class值 
            nextBtnCls: "next", //  自定义值  下一页的class值
            BtnCls: "activebtn", //自定义值  激活的上一页或下一页的class
            objName: ""//用对象方式传入参数，输入要传入对象名
        }, obj || {});
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.elm = $(elm);
        this.navNd = this.elm.find("." + this.indexobj.navCls).get(0);
        if (this.navNd) {
            var navCls = this.indexobj.navChildren ? "." + this.indexobj.navChildren : "";
            this.navChildren = $(this.navNd).children(navCls);
        }

        this.contentNds = this.elm.find("." + this.indexobj.contentCls).get(0);

        if (this.contentNds) {
            var contentCls = this.indexobj.contentChildren ? "." + this.indexobj.contentChildren : "";
            this.contentChildren = $(this.contentNds).children(contentCls);
        }

        if (this.navChildren && this.navChildren.get()) {
            var nd = this.navChildren.get();
            for (var i = 0; i < nd.length; i++) {
                nd[i].index = i;
            }
        } else {
            return;
        }
        this.invoke(this.indexobj.activeIndex);
        this.bind();
    }

    Tab.prototype = {
        //    viewcls: function (o, n) { //显示和隐藏class
        //        if (o) {
        //            if (n == 1) {
        //                o.style.display = "none";
        //                Py.Base.Css.delStyle("display", o);
        //            } else {
        //                o.style.display = "block";
        //            }
        //        }
        //    },
        //    start: function () { //开始播放
        //        if (this.indexobj.autoplay == true) {
        //            var _this = this;
        //            _this.stop();
        //            this.timeout = setTimeout(function () {
        //                _this.next();
        //            }, this.time);
        //        }
        //    },
        //    stop: function () { //停止播放
        //        clearTimeout(this.timeout);
        //        this.addnavclass();
        //    },
        //    next: function () { //下一帧
        //        if (this.curCon) {
        //            var nextindex = this.curCon.index + 1;
        //            if (this.indexobj.steps == 1) {
        //                if (nextindex >= this.x) {
        //                    nextindex = 0;
        //                };
        //            } else {
        //                if (nextindex >= this.indexobj.steps) {
        //                    nextindex = 0;
        //                };
        //            };
        //            this.invoke(nextindex);
        //        };
        //    },
        //    prev: function () { //上一帧
        //        var previndex = this.curCon.index - 1;
        //        if (this.indexobj.steps == 1) {
        //            if (previndex < 0) {
        //                previndex = this.conNodes.length - 1;
        //            };
        //        } else {
        //            if (previndex < 0) {
        //                previndex = this.indexobj.steps - 1;
        //            };
        //        };
        //        this.invoke(previndex);
        //    },
        invoke: function (n) { //具体显示哪一帧
            //            this.pcurCon = this.curCon != this.conNodes[n] ? this.curCon : null;
            //            this.curCon = this.conNodes[n];
            //            if (this.navNodes) {
            //                this.pcurNav = this.curNav || null;
            //                this.curNav = this.navNodes[n];
            //                var cNav = Py.Base.Dom.childNodes(this.curNav);
            //                if (cNav && cNav[0]) {
            //                    this.countNav = cNav[0];
            //                }
            //            }
            this.none(n);
            this.addnavclass(n);
        },
        none: function (n) { //none, 最朴素的显示/隐藏效果
            if (this.x < 1) {
                return;
            }
            if (this.contentChildren && this.contentChildren.get(0)) {
                this.contentChildren.css({ "display": "none" });
                $(this.contentChildren.get(n)).css({ "display": "block" });
            }
        },
        addnavclass: function (id) { //设置当前选项的class
            if (!this.navChildren.get(0)) {
                return;
            }
            //            for (var i = 0; i < this.navNodes.length; i++) {
            //                if (id != null) {
            //                    Py.Base.Dom.delClass(this.indexobj.activeTriggerCls, this.navNodes[i]);
            //                }
            //                if (this.indexobj.countdown == true) {
            //                    Py.Base.Dom.delClass(this.indexobj.contentCls, this.navNodes[i].firstChild);
            //                };
            //            };
            //            Py.Base.Dom.addClass(this.indexobj.activeTriggerCls, this.navNodes[id]);
            this.navChildren.removeClass(this.indexobj.activeTriggerCls);
            $(this.navChildren.get(id)).addClass(this.indexobj.activeTriggerCls);
        },
        bind: function () {
            var _this = this;
            this.navChildren.bind(this.indexobj.triggerType, function () {
                //                $(".control-checkbox").get(0).click()
                //                _this.navChildren.removeClass(_this.indexobj.activeTriggerCls);
                //                $(this).addClass(_this.indexobj.activeTriggerCls);
                _this.invoke(this.index);
                //                _this.contentChildren.css({ "display": "none" });
                //                $(_this.contentChildren.get(this.index)).css({ "display": "block" });
            });
        }
    };
    YW.extend("widget.Tab", Tab);
})();
(function () {
    function Popup(elm, obj) {
        if (!elm) {
            return;
        }
        var indexobj = YW.addObj({
            navCls: "ks-pop-nav", //触发的class名
            popClose: "ks-pop-close", //关闭弹出框的class名称
            contentCls: "ks-pop-box", //弹出内容列表的class名
            document: false,
            activeNavCls: 'ks-active', //  自定义值 (默认值：active)  默认激活列表项的class值
            alignCls: "",//例：#ks-alignCls
            contentId: false, //如果为真，则contentCls传入的是ID，如果是ID的话则可以放在页面的任意位置，如果是class则只能在elm的内部
            dropDown: 0,//下拉动画时间
            dataIndexName: "",//对应数据的索引自定义属性名
            dataIndexFix: "",//对应内容的索引前缀
            forTouch: false, //true/false (默认值：true)  再次触发是否隐藏
            triggerType: 'click',//触发方式—mouseover—：鼠标经过触发click：鼠标点击触发
            stopPropagation: true,//阻止事件冒泡
            object: "",//用对象方式传入参数，输入要传入对象名
            keyCode:[27],//退出键
            callback:""//回调
        }, obj || {});
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        //        tcb,lcr
        var _this = this;
        this.indexobj.align = YW.addObj({
            //node: 'ks-pop-nav',//对齐节点class名称
            //nodeId: false,//对齐节点为ID或class
            offset: [0, 0],//微调位置[top , left]
            points: []
        }, obj && obj.align || {});
        if(!document.popup){
            document.popup=[];
        }
        document.popup.push(elm);
        this.elm = $(elm);
        this.triggerNd = this.elm.find("." + this.indexobj.navCls);
        if (this.indexobj.alignCls) {
            if (this.indexobj.alignCls == "body") {
                this.alignNd = $(body);
            } else if (this.indexobj.alignCls == "window") {
                this.alignNd = $(window);
            } else if (this.indexobj.alignCls == "document") {
                this.alignNd = $(document);
            } else {
                this.alignNd = $(this.indexobj.alignCls);
            }
            if (this.alignNd && this.alignNd.get(0)) {
                this.alignNd = $(this.alignNd.get(0));
            } else {
                this.alignNd = false;
            }
        }
        if (!this.triggerNd || !this.triggerNd.get(0)) {
            return;
        }
        this.triggerNd.each(function (k, v) {
            v.index = k;
        });
        if (this.indexobj.contentId) {
            this.contentNd = $("#" + this.indexobj.contentCls);
        } else {
            this.contentNd = this.elm.find("." + this.indexobj.contentCls);
            if (this.contentNd && this.contentNd.get(0)) {
                this.contentNd = $(this.contentNd.get(0));
            } else {
                return;
            }
        }
        if (!this.contentNd.get(0)) {
            return;
        }
        if (this.indexobj.dataIndexName) {
            _this.dataIndexNd_v = {};
            _this.dataIndexNd = [];
            this.triggerNd.each(function (k, v) {
                var _index = $(v).attr(_this.indexobj.dataIndexName);
                var Nd;
                if (_index) {
                    _index = _this.indexobj.dataIndexFix + _index;
                    Nd = _this.contentNd.find("#" + _index + ",." + _index);
                    if (Nd && Nd.get(0)) {
                        v.dataIndex = _index;
                        _this.dataIndexNd_v[_index] = Nd;
                        _this.dataIndexNd = $.merge(_this.dataIndexNd, Nd.get().slice(0));//合并数组

                    }

                }

            });
            if (_this.dataIndexNd.length > 0) {
                _this.dataIndexNd = $.unique(_this.dataIndexNd);//去除数组中的重复
                _this.dataIndexNd = $(_this.dataIndexNd);
            }
        }

        this.bind();
    };

    Popup.prototype = {
        offset: function (o) {//设置位置
            o = this.alignNd || o;
            var w = this.calcPoints(this.calcSize(o, this.indexobj.align.points[0]), this.calcSize(this.contentNd, this.indexobj.align.points[1]));
            var navNdoffset = o.offset();
            this.contentNd.offset({ left: (navNdoffset.left + w.left + this.indexobj.align.offset[1]), top: (navNdoffset.top + w.top + this.indexobj.align.offset[0]) });
        },
        calcPoints: function (one, two) {//计算位置
            var ret = {};
            ret.left = one.x - two.x;
            ret.top = one.y - two.y;
            return ret;
        },
        calcSize: function (o, v) {//计算宽度
            var ret = {}, arr = [];
            ret.y = 0;
            ret.x = 0;
            if (!o || !v) {
                return ret;
            }
            arr = v.split("");
            if (arr.length < 2) { return ret; }
            var w = o.width();
            var h = o.height();
            switch (arr[0]) {
                case "t":
                    ret.y = 0;
                    break;
                case "c":
                    ret.y = h / 2;
                    break;
                case "b":
                    ret.y = h;
                    break;
                default:
            }
            switch (arr[1]) {
                case "l":
                    ret.x = 0;
                    break;
                case "c":
                    ret.x = w / 2;
                    break;
                case "r":
                    ret.x = w;
                    break;
                default:
            }
            return ret;
        },
        display: function (t, o) {
            /// <summary>
            /// 设置显示或隐藏
            /// </summary>
            /// <param name="t">显示或隐藏的类型</param>
            /// <param name="o">对节点对象</param>
            if (t == "block") {
                if(this.indexobj.callback && window[this.indexobj.callback]){//回调
                    window[this.indexobj.callback]();
                }
                if (this.contentNd.css("display") == "block") {
                    if (o != this.contentNd.get(0).nd) {
                        this.contentNd.css({ "display": "none" });
                        //                        YW.delStyle("top", _this.contentNd.get(0));
                        //                        YW.delStyle("left", _this.contentNd.get(0));
                        this.contentNd.slideDown(this.indexobj.dropDown, function () {
                            this.nd = o;
                        });
                        if (this.indexobj.align.points.length == 2) {
                            this.offset($(o));
                        }
                        this.triggerNd.removeClass(this.indexobj.activeNavCls);
                        $(o).addClass(this.indexobj.activeNavCls);
                    } else if (this.indexobj.forTouch) {
                        this.triggerNd.removeClass(this.indexobj.activeNavCls);
                        this.contentNd.slideUp(this.indexobj.dropDown);
                    }

                } else {
                    this.contentNd.slideDown(this.indexobj.dropDown, function () {
                        this.nd = o;
                    });
                    if (this.indexobj.align.points.length == 2) {
                        this.offset($(o));
                    }
                    this.triggerNd.removeClass(this.indexobj.activeNavCls);
                    $(o).addClass(this.indexobj.activeNavCls);
                }
                if (this.dataIndexNd && this.dataIndexNd.get) {
                    this.dataIndexNd.css({ "display": "none" });
                }
                if (this.dataIndexNd_v && o.dataIndex) {
                    if (this.dataIndexNd_v[o.dataIndex]) {
                        this.dataIndexNd_v[o.dataIndex].css({ "display": "block" });
                    }
                }
                if (this.contentNd.get(0)) {
                    this.contentNd.get(0).nd = o;
                }

            } else {
                this.contentNd.get(0).nd = o;
                this.contentNd.slideUp(this.indexobj.dropDown);
                this.triggerNd.removeClass(this.indexobj.activeNavCls);
            }

        },
        bind: function () {
            var _this = this;
            this.triggerNd.bind(this.indexobj.triggerType, function (evt) {
//                if (_this.indexobj.stopPropagation) {
//                    //evt.stopPropagation();
//                }
                _this.elm.get(0).elm=true;
                _this.display("block", this);
            });
            var contClose = this.contentNd.find("." + this.indexobj.popClose);
            contClose && contClose.bind(this.indexobj.triggerType, function (evt) {
                //evt.stopPropagation();
                if ($(evt.target).is("." + _this.indexobj.popClose)) {
                    _this.elm.get(0).elm=false;
                    //                    _this.contentNd.slideUp(_this.indexobj.dropDown);
                    _this.display("none", this);
                }
            });
            this.contentNd.bind(this.indexobj.triggerType, function (evt) {
                _this.elm.get(0).elm=true;
                //alert("dsafsdaf")
                //evt.stopPropagation();
            });
            var elmClose = this.elm.find("." + this.indexobj.popClose);
            elmClose && elmClose.bind(this.indexobj.triggerType, function () {
                _this.elm.get(0).elm=false;
                _this.display("none", this);
            });
            var docmt=$(document);
            if (this.indexobj.document) {
                docmt.bind(this.indexobj.triggerType, function (evt) {
                    var arr=document.popup;
                    var ret=true;
                    $.each(arr,function(k,v){
                        if(v.elm && v==_this.elm.get(0)){
                            ret=false;
                        }
                    });
//                    if (!_this.indexobj.stopPropagation) {
//                        var o = $(evt.target);
//                        if (o.get(0) != _this.contentNd.get(0).nd) {
//                            while (o.get(0) != _this.contentNd.get(0).nd && o.get(0) != document) {
//                                o = o.parent();
//                            }
//                        }
//
//                        if (o.get(0) != _this.contentNd.get(0).nd) {
//                            _this.display("none", this);
//                        }
//                    } else {
//                        _this.display("none", this);
//                    }
                    if(ret){
                        _this.display("none", this);
                    }
                    _this.elm.get(0).elm=false;

                });
            }
            if(_this.indexobj.keyCode.length>0){
                docmt.bind("keydown", function (evt) {//设置快捷键
                //evt.preventDefault();
                var key=false;
                $.each(_this.indexobj.keyCode,function(k,v){
                    if(evt.keyCode==v){
                       key=true; 
                    }
                });
                if(key){
                    _this.display("none", this);
                }
            });
                
            }
        }
    };
    YW.extend("widget.Popup", Popup);
})();



(function () {
    function Accordion(cls, obj) {
        if (!cls) { return; }
        this.cls = $(cls);
        var obj = obj || {};
        var indexobj = YW.addObj({
            effect: "accordion", // 加载 accordion 效果 
            navCls: 'ks-switchable-nav',//自定义值  主列表的class值
            contentCls: 'ks-switchable-content',//自定义值  列表所对应的内容列表的class值
            hover: 'ks-hover',//自定义值  内容要被激活的节点
            contentUp: false,//缩放内容在触发点上边
            activeCls:"",//触发点按钮的class值
            activeTriggerCls: 'ks-active', //  自定义值 (默认值：ks-active)  默认激活列表项的class值 
            activeContentCls: 'ks-hover-active', //  自定义值 (默认值：ks-content-active)  默认激活内容的class值 
            triggerType: 'click',//mouseover/click (默认值：click)  触发方式——mouse：鼠标经过触发click：鼠标点击触发
            autoplay: true, //true/false (默认值：true)  是否自动播放,注:启用自动播放时不能支持多面板展开
            forTouch: false, //true/false (默认值：true)  再次触发是否隐藏
            multiple: false,//true/false (默认值：false)  是否同时支持多面板展开
            hasTriggers: true,//true/false (默认值：true)  是否设置触发点
            activeIndex: 0,//  自定义数值 (默认值：0)  默认激活的列表项
            dropDown: 300,//下拉动画时间
            menuCodes: "YW.bmsData._menuCodes",
            object: ""//用对象方式传入参数，输入要传入对象名
        }, obj);
//        if(!document.accordion){
//            document.accordion=[];
//        }
//        document.accordion.push(cls);
        
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.navnode = this.cls.find("." + this.indexobj.navCls);
//        if(this.navnode && this.navnode.get(0)){
//            this.activeBtn=this.navnode.find("." + this.indexobj.activeCls);
//        }
//        if(!this.activeBtn || this.activeBtn && !this.activeBtn.get(0)){
//            this.activeBtn=this.navnode;
//        }
        this.connode = this.cls.find("." + this.indexobj.contentCls);
        this.hoverNd = this.cls.find("." + this.indexobj.hover);
        this.nodes = [];
        var menuCodes = YW.getObj(this.indexobj.menuCodes);
        if (this.indexobj.menuCodes && menuCodes) {
            this.menuCodes = menuCodes;
        }

        if (this.navnode.get().length > 0) {
            this.rank();
            if (this.activeIndex >= 0) {
                this.invoke(this.activeIndex);
                this.hover(this.activeNd);
            } else if (this.activeIndex != -1){
                this.invoke(this.indexobj.activeIndex);
            }
            this.start();
        }
    }
    Accordion.prototype = {
        rank: function () {//排列内容节点
            var _this = this;
            var activeBtnarr=[];

            this.navnode.each(function (k, v) {
                v.index = k;
                var nd;
                if (_this.indexobj.contentUp) {
                    nd = $(v).prev();
                } else {
                    nd = $(v).next();
                }
                if (_this.menuCodes) {
                    if (v.id == _this.menuCodes) {
                        _this.activeIndex = k;
                    }
                }
                
                if (nd.get(0)) {
                    if (_this.menuCodes) {
                        var o = nd.find("#" + _this.menuCodes);
                        if (o && o.get(0)) {
                            _this.activeNd = o.get(0);
                            _this.activeIndex = k;
                        }
                    }
                    if (nd.is("." + _this.indexobj.contentCls)) {
                        _this.nodes.push({ nav: $(v), con: nd });
                    } else if (nd.find("." + _this.indexobj.contentCls)) {
                        _this.nodes.push({ nav: $(v), con: nd.find("." + _this.indexobj.contentCls) });
                    } else {
                        _this.nodes.push({ nav: $(v), con: undefined });
                    }
                } else {
                    _this.nodes.push({ nav: $(v), con: undefined });
                }
                if(_this.indexobj.activeCls){
                    tmp=$(v).find("." + _this.indexobj.activeCls);
                    if(tmp && tmp.get(0)){
                        tmp.get(0).index=k;
                        activeBtnarr.push(tmp.get(0));
                    }
                }
                
                v.index=k;
            });
            if(activeBtnarr.length>0){
                this.activeBtn=$(activeBtnarr);
            }else{
                this.activeBtn=this.navnode;
            }
            this.bind();
        },
        start: function () {
            var _this = this;
            if (!this.indexobj.autoplay) {
                return;
            }
            this.multiple = this.indexobj.multiple;
            this.stop();
            this.interval = setInterval(function () {
                _this.indexobj.multiple = false;
                _this.next();
            }, 3000);
        },
        stop: function () {
            if (!this.indexobj.autoplay) {
                return;
            }
            clearInterval(this.interval);
            this.indexobj.multiple = this.multiple;
        },
        next: function () {
            var n = this.curNav.index + 1;
            if (n >= this.navnode.get().length) {
                n = 0;
            }
            this.invoke(n);
        },
        invoke: function (n) {//具体显示哪一帧
            if (n ==-1) {
                return;
            }else if(n<0){
                var _this=this;
                $.each(this.nodes,function(k,v){
                    v.con.get(0) && v.con.css({"display":"none"});
                    v.nav.get(0) && v.nav.removeClass(_this.indexobj.activeTriggerCls);
                });
                return;
            }
            this.curNav = this.navnode.get(n);
            this.none(n);
        },
        display: function (n, b) {//显示/隐藏
            if (this.nodes && this.nodes[n]) {
                if (this.nodes[n].con) {
                    //this.nodes[n].con.css({ "display": b });
                    if (b == "block") {
                        this.nodes[n].con.slideDown(this.indexobj.dropDown);
                    } else {
                        this.nodes[n].con.slideUp(this.indexobj.dropDown);
                    }
                }
                if (this.nodes[n].nav) {
                    if (b == "none") {
                        this.nodes[n].nav.removeClass(this.indexobj.activeTriggerCls);
                    } else {
                        this.nodes[n].nav.addClass(this.indexobj.activeTriggerCls);
                    }
                }
            }
        },
        none: function (n) {//none, 最朴素的显示/隐藏效果
        	if(!this.nodes[n]){
                return;
        	}
            var b = n<0?false : this.nodes[n].con && this.nodes[n].con.css("display") == "block";
            if (!this.indexobj.multiple) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.display(i, "none");
                }
            }
            
            if (this.indexobj.multiple && this.nodes[n].con && this.nodes[n].con.get(0) && b || this.indexobj.forTouch && b) {
                this.display(n, "none");
            } else {
                this.display(n, "block");
            }

        },
        hover: function (o) {
            var _this = this;
            if (o) {
                _this.hoverNd.removeClass(_this.indexobj.activeContentCls);
                $(o).addClass(_this.indexobj.activeContentCls);
            }

        },
        bind: function () {
            var n=-1;
            if (!this.indexobj.hasTriggers) {
                return;
            }
            var _this = this;
            var mouseout = function (evt) {
                if(n<0){
                    return;
                }
                var o = $(evt.relatedTarget);
                var arr = _this.nodes;
                
                if (evt.relatedTarget) {
                    while (o.get(0) != document && o.get(0) != _this.cls.get(0) && o.get(0) != this && o.get(0) != arr[n].nav.get(0) && o.get(0) != arr[n].con.get(0)) {
                        o = o.parent();
                    }
                }
                if (o.get(0) == _this.nodes[n].con.get(0) && o.get(0) != _this.nodes[n].nav.get(0) || !evt.relatedTarget) {
                    $(this).unbind("mouseout", mouseout);
                    _this.start();
                }
            }
//            var mousemove=function (){
//                _this.cls.get(0).elm=true;
//            }
            //this.cls.bind("mousemove", mousemove);
            this.activeBtn.bind(this.indexobj.triggerType, function () {
                n=this.index;
                if(_this.nodes[n] && _this.nodes[n].nav){
                    _this.stop();
                    _this.invoke(n);
                    if (!_this.indexobj.forTouch) {
//                        $(this).bind("mousemove", mousemove);
//                        _this.nodes[n].con.bind("mousemove", mousemove);
                        $(this).bind("mouseout", mouseout);
                        _this.nodes[n].con.bind("mouseout", mouseout);
                    }
                }
            });
            if (this.hoverNd && this.hoverNd.get(0)) {
                this.hoverNd.bind("click", function () {
                    _this.hover(this);
                    //                    _this.hoverNd.removeClass(_this.indexobj.activeContentCls);
                    //                    $(this).addClass(_this.indexobj.activeContentCls);
                });
            }
        }
    }
    YW.extend("widget.Accordion", Accordion);

})();





(function () {
    function Floatfixed(cls, obj) {//浮动定位
        if (!cls) {
            return;
        }
        this.cls = $(cls);
        obj = obj || {};
        var _this = this,indexobj = YW.addObj({
            fixed: true, //是否启用浮动
            occupied: false, //当移动时是否保留位置
            retainTop: 0, //顶部触发事件保留高度
            top: null, //顶部默认高度
            left: null, //左边默认宽度
            right: null, //右边默认宽度
            bottom: null,//右边默认宽度
            object: ""//用对象方式传入参数，输入要传入对象名
        },obj);
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.lframe = $("." + obj.lframe);
        if (this.lframe) {
            this.lframe = this.lframe.get(0);
        }
        if (!this.lframe) {
            this.lframe = document.documentElement && document.documentElement.scrollTop >= document.body.scrollTop ? document.documentElement : document.body;
            if (this.lframe == document.documentElement) {
                this.lframe = document.documentElement && document.documentElement.scrollLeft >= document.body.scrollLeft ? document.documentElement : document.body;
            }
        }
        if (this.lframe != document.documentElement && this.lframe != document.body) {
            this.loffset = $(this.lframe).offset();
        } else {
            this.loffset = {
                left: 0, top: 0
            };
        }
        //        if (this.cls.offsetParent != document.documentElement && this.cls.offsetParent != document.body) {
        //            this.poffset = Py.Base.Seat.getOffset(this.cls.offsetParent);
        //        } else {
        //            this.poffset = {
        //                left: 0, top: 0
        //            };
        //        }
        this.window = $(window);
        this.windowSize = {
            height: this.window.height(),
            width: this.window.width()
        };
        this.cls.height = this.cls.height();
        this.cls.width = this.cls.width();
        this.cloff = this.cls.offset();
        this.getSest1(this.cls);
        this.fixed();
        if (this.indexobj.fixed) {
            this.bind();
        }
    }
    Floatfixed.prototype = {
        getSest1: function (o) {
            var s = this.getSest(o);
            //            if (this.indexobj.bottom != null) {
            //                this.bottom = (this.indexobj.bottom)||0;
            //            } else {
            this.bottom = (this.indexobj.bottom) || 0;
            this.top = (this.indexobj.top != null ? this.indexobj.top : s.top) || 0;
            //            }
            //            if (this.indexobj.right != null) {
            //                this.right = (this.indexobj.right)||0;
            //            } else {
            this.right = (this.indexobj.right) || 0;
            this.left = (this.indexobj.left != null ? this.indexobj.left : s.left) || 0;
            //            }
        },
        getSest: function (o) { //读取位置
            if (this.indexobj.occupied) {
                var poffset = o.offsetParent().offset();
                var poff = o.parent().offset();
                var cloff = o.offset();
                var top = parseInt(o.offset().top) || "undefined";
                var left = parseInt(o.offset().left) || "undefined";
                var bottom = parseInt(o.offset().bottom) || "undefined";
                var right = parseInt(o.offset().right) || "undefined";
                if (right == "undefined") {
                    if (left == "undefined") {
                        left = (cloff.left - (poffset.left != 0 ? poffset.left : poff.left)) || 0;
                    }
                }
                if (bottom == "undefined") {
                    if (top == "undefined") {
                        top = (cloff.top - (poffset.top != 0 ? poffset.top : poff.top)) || 0;
                    }
                }
            }
            return {
                top: (top - (parseInt(o.parent().css("border-top-width")) || 0)) || 0,
                left: (left - (parseInt(o.parent().css("border-left-width")) || 0)) || 0,
                bottom: (bottom - (parseInt(o.parent().css("border-bottom-width")) || 0)) || 0,
                right: (right - (parseInt(o.parent().css("border-right-width")) || 0)) || 0
            };
        },
        fixed: function () {
            var lframe = document.documentElement && document.documentElement.scrollTop >= document.body.scrollTop ? document.documentElement : document.body;//所在的移动区域
            if (lframe == document.documentElement) {
                lframe = document.documentElement && document.documentElement.scrollLeft >= document.body.scrollLeft ? document.documentElement : document.body;
            }
            var t = lframe.scrollTop;
            var l = lframe.scrollLeft;
            var tof, lof;
            if (this.lframe == lframe) {
                tof = t;
                lof = l;
            } else {
                tof = this.loffset.top;
                lof = this.loffset.left;
            }
            var mt = Math.max(Math.max(this.indexobj.retainTop - (this.indexobj.top || 0) - t, 0), Math.max(this.loffset.top - (this.indexobj.top || 0) - t, 0));
            var ml = Math.max(this.loffset.left - l, 0);
            if (mt == 0 || this.indexobj.occupied) {
                var tt, lf, bt, rh;
                if (!this.position) {
                    if (this.indexobj.occupied && !this.newItem) {
                        //                        this.newItem = document.createElement("div");//新建节点
                        //                        this.newItem.style.visibility = "hidden";
                        //                        this.newItem.style.width = this.cls.clientWidth + "px";
                        //                        this.newItem.style.height = this.cls.clientHeight + "px";
                        //                        this.newItem.className = this.cls.className;
                        //                        Py.Base.Dom.insNode(this.newItem, this.cls, 1);//把新节点插入到原节点后面
                    }
                    if (this.cls.css("position") == "fixed" || this.cls.css("position") == "absolute") {
                        this.position = this.cls.css("position");
                    } else {
                        this.position = this.position1(this.cls, this.top + 5, this.left + 5); // "absolute"; //
                    }
                    //this.position = "absolute";
                    this.cls.css({ "position": this.position });
                }

                if (this.position == "fixed" || this.cls.css("position") == "fixed") {
                    if (lframe != document.documentElement && lframe != document.body) {
                        tt = Math.min((tof + $(this.lframe).height() - this.cls.height() - 5) - (t + this.top), 0);
                        lf = Math.min((lof + $(this.lframe).width() - this.cls.width() - 5) - (l + this.left), 0);
                    } else {
                        tt = this.top;
                        lf = this.left;
                    }

                    if (this.indexobj.bottom != null) {
                        this.cls.css({ "bottom": this.bottom + "px" });
                    } else {
                        this.cls.css({ "top": tt + "px" });
                    }
                    if (this.indexobj.right != null) {
                        this.cls.css({ "right": this.right + "px" });
                    } else {
                        this.cls.css({ "left": lf + "px" });
                    }
                } else {
                    poffset = this.cls.offsetParent().offset();
                    if (this.lframe != document.documentElement && this.lframe != document.body) {
                        tt = Math.min(this.top - poffset.top + t, tof + $(this.lframe).height() - this.cls.height() - 5);
                        lf = Math.min(this.left - poffset.left + l + ml, $(this.lframe).width() + lof - this.cls.width() - 5);
                        if (this.indexobj.bottom != null) {
                            this.cls.css({ "bottom": this.bottom + "px" });
                        } else {
                            this.cls.css({ "top": (tt) + "px" });
                        }
                        if (this.indexobj.right != null) {
                            this.cls.css({ "right": this.right + "px" });
                        } else {
                            this.cls.css({ "left": (lf - l) + "px" });
                        }
                    } else {
                        if (this.indexobj.bottom != null) {
                            this.cls.css({ "top": (t + this.window.height() - this.cls.height - this.bottom - this.top - poffset.top - 1) + "px" });
                        } else {
                            this.cls.css({ "top": (this.top - poffset.top + t) + "px" });
                        }
                        if (this.indexobj.right != null) {
                            this.cls.css({ "right": (l + this.window.width() - this.cls.width - this.right - this.left) + "px" });
                        } else {
                            this.cls.css({ "left": (this.left - poffset.left + l + ml) + "px" });
                        }
                    }

                }
                this.windowSize.height = this.window.height();
                this.windowSize.width = this.window.width();
            } else if (this.cls.css("position") && this.cls.css("position") == this.position) {
                //                if (this.newItem) {
                //                    Py.Base.Dom.delNodes(this.newItem);
                //                    this.newItem = undefined;
                //                }
                this.cls.css({ "position": "static" });
                this.cls.css({ "top": this.cloff.top + "px", "left": this.cloff.left + "px" });
            }
        },
        position1: function (o, t, l) {
            /// <summary>作用：设置fixed如果不支持fixed则用absolute</summary>
            /// <param name="o">需要设置position的节点</param>
            /// <param name="t">需要设置position的节点上边距</param>
            /// <param name="l">需要设置position的节点左边距</param>
            ///<returns type="返回设置的position值"></returns>
            if (!o.get(0)) {
                return;
            }
            t = parseInt(t) || 1;
            l = parseInt(l) || 1;
            var r = "absolute";
            //            var offset = o.offset();
            //            var c1 = { left: offset.left, top: offset.top, positon: o.css("position") };
            var nd = o.get(0);
            var c1 = { left: nd.style.left, top: nd.style.top, position: nd.style.position };
            o.css({ "position": "static" });
            var offset1 = o.offset();
            var b = { left: offset1.left, top: offset1.top };
            o.css({ "position": "fixed" });
            o.css({ "top": t + "px", "left": l + "px" });
            offset1 = o.offset();
            var c = { left: offset1.left, top: offset1.top };
            if (c.top != b.top || c.left != b.left) {
                r = "fixed";
            }

            if (!c1.left) {
                YW.delStyle("left", nd);
            } else {
                nd.style.left = c1.left;
            }
            if (!c1.top) {
                YW.delStyle("top", nd);
            } else {
                nd.style.top = c1.top;
            }
            if (!c1.positon) {
                YW.delStyle("position", nd);
            } else {
                nd.style.position = c1.position;
            }
            //            o.css({ "top": c1.top + "px", "left": c1.left + "px" });
            //            o.css({ "positon": c1.positon });
            //console.log({ "top": c1.top + "px", "left": c1.left + "px" })
            return r;
        },
        bind: function () {
            var _this = this;
            $(window).bind("scroll", function () {
                _this.fixed();
            });

            $(window).bind("resize", function () {
                if (_this.newItem) {
                    _this.getSest1(_this.newItem);
                } else {
                    _this.getSest1(_this.cls);
                }
                _this.fixed();
            });
        }
    }
    //window.Floatfixed = Floatfixed;
    YW.extend("position.Fixed", Floatfixed);
})();





(function () {
    function Widescreen(cls, obj) {//设置全屏宽度
        if (!cls) {
            return;
        }
        this.cls = $(cls);
        obj = obj || {};
        var indexobj = YW.addObj({
            client: [0, 0], //微调的距离
            width: true, //是否设置宽度
            height: true, //是否设置高度
            min: false,//最小高宽
            max: false,//最大高宽
            scale:[0],//比例[高,宽]
            object: ""//用对象方式传入参数，输入要传入对象名
        }, obj);
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.lframe = $("." + obj.lframe);
        if (this.lframe) {
            this.lframe = this.lframe.get(0);
        }
        if (!this.lframe) {
            this.lframe = window;
        }
        this.lframe = $(this.lframe);
        if (obj.screen == "screen") {
            this.screen = {
                height: function () {
                    return window.screen.availHeight;
                },
                width: function () {
                    return window.screen.availWidth;
                }
            }
        } else {
            this.bind();
        }


        this.setSize();
    }
    Widescreen.prototype = {
        setSize: function () {
            var size = {};
            if (this.screen) {
                if (this.indexobj.width) {
                    size.width = Math.max((this.screen.width() + this.indexobj.client[1]), this.lframe.width()) + "px";
                }
                if (this.indexobj.height) {
                    size.height = Math.max((this.screen.height() + this.indexobj.client[0]), this.lframe.height());
                    if (this.indexobj.scale && this.indexobj.scale.length > 1) {
                        //console.log((parseInt(size.width) * (this.indexobj.scale[0] / this.indexobj.scale[1])))
                        size.height = (parseInt(Math.max((this.screen.width() + this.indexobj.client[1]), this.lframe.width())) * (this.indexobj.scale[0] / this.indexobj.scale[1])) + "px";
                    } else {
                        size.height = size.height + "px";
                    }
                }

            } else {
                if (this.indexobj.width) {
                    size.width = (this.lframe.width() + this.indexobj.client[1]) + "px";
                }
                if (this.indexobj.height) {
                    size.height = (this.lframe.height() + +this.indexobj.client[0]) + "px";
                }
            }
            
            var o = {};
            if (this.indexobj.min) {
                if (size.width) {
                    o["min-width"] = size.width;
                } else {
                    o["min-height"] = size.height;
                }
            } else if (this.indexobj.max) {
                if (size.width) {
                    o["max-width"] = size.width;
                } else {
                    o["max-height"] = size.height;
                }
            } else {
                o = size;
            }
            this.cls.css(o);
        },
        bind: function () {
            var _this = this;
            $(window).bind("resize", function () {
                _this.setSize();
            });
        }
    }
    YW.extend("size.Widescreen", Widescreen);
})();


(function () {
    function Align(cls, obj) {//设置居中
        if (!cls) {
            return;
        }
        this.cls = $(cls);
        obj = obj || {};
        var indexobj = YW.addObj({
            plane: true,//水平是否居中
            vertical: true,//垂直是否居中
            offset: [0, 0],//微调位置[top , left]
            object: ""//用对象方式传入参数，输入要传入对象名
        }, obj);
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.lframe = $("." + obj.lframe);
        if (this.lframe) {
            this.lframe = this.lframe.get(0);
        }
        if (!this.lframe) {
            this.lframe = window;
        }

        this.lframe = $(this.lframe);
        this.setAlign();
        this.bind();
    }
    Align.prototype = {
        setAlign: function () {
            var lframe = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;//所在的移动区域
            var t = lframe.scrollTop;
            var l = lframe.scrollLeft;
            var o = {};
            if (this.indexobj.plane) {
                o.left = (this.lframe.width() - this.cls.width()) / 2 - l + this.indexobj.offset[1];
            } else {
                o.left = this.indexobj.offset[1];
            }
            if (this.indexobj.vertical) {
                o.top = (this.lframe.height() - this.cls.height()) / 2 - t + this.indexobj.offset[0];
            } else {
                o.top = this.indexobj.offset[0];
            }
            //this.cls.offset({ "left": (this.lframe.width() - this.cls.width()) / 2 +l, "top": (this.lframe.height() - this.cls.height()) / 2 + t });
            //this.cls.offset(o);
            this.cls.css(o);
        },
        bind: function () {
            var _this = this;
            $(window).bind("resize", function () {
                _this.setAlign();
            });
            $(window).bind("scroll", function () {
                _this.setAlign();
            });
        }
    }
    YW.extend("align.Align", Align);
})();

(function() {
    function ShowTime(cls, obj) {
        if (!cls) {
            return;
        }
        this.cls = $(cls);
        obj = obj || {};
        var indexobj = YW.addObj({
            day: "", //天的class名称
            hour: "", //时的class名称
            minute: "", //分的class名称
            second: "", //秒的class名称
            timestart: "",
            timeend:""
        }, obj);
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        var _this = this;

//        var time_start = new Date().getTime(); //设定当前时间
//        var time_end = new Date("2015/10/01 00:00:00").getTime(); //设定目标时间
        // 计算时间差 
//        this.time_distance = time_end - time_start;
        if (this.indexobj.day) {
            this.day = this.cls.find("." + this.indexobj.day);
        }
        if (this.indexobj.hour) {
            this.hour = this.cls.find("." + this.indexobj.hour);
        }
        if (this.indexobj.minute) {
            this.minute = this.cls.find("." + this.indexobj.minute);
        }
        if (this.indexobj.second) {
            this.second = this.cls.find("." + this.indexobj.second);
        }
        var time=new Date().getTime(); //设定当前时间
        var server = new Date(this.indexobj.timestart).getTime();
        this.badTime = server - time;
        // 设置定时器
        this.show();
        setInterval(function() {
            _this.show();
        }, 1000);
    }
    ShowTime.prototype = {
        show: function() {//显示时间
            // 显示时间 
//            if (day && day.get(0)) {
//                    day.val(this.time.d);
            //                }
            this.calc();
            if (this.day && this.day.get(0)) {
                this.day.text(this.format(this.time.d));
            }
            if (this.hour && this.hour.get(0)) {
                this.hour.text(this.format(this.time.h));
            }
            if (this.minute && this.minute.get(0)) {
                this.minute.text(this.format(this.time.m));
            }
            if (this.second && this.second.get(0)) {
                this.second.text(this.format(this.time.s));
            }
        },
        format: function (n) {//格式化时间(前面加零) 
            var ret=n;
            if (n < 10) {
                ret = "0" + n;
            }
            return ret;
        },
        calc: function () {//计算时间
            var time = {
                d:0,
                h: 0,
                m: 0,
                s:0
            };
            var time_start = new Date().getTime();;
            if (this.indexobj.timestart) {
                time_start = time_start + this.badTime;//补相差时间
            }
            var time_end = new Date(this.indexobj.timeend).getTime(); //设定目标时间
            this.time_distance = time_end - time_start;
            if (this.time_distance > 0) {
                // 天
                time.d = Math.floor(this.time_distance / 86400000);
                this.time_distance = this.time_distance-time.d * 86400000;
                // 时
                time.h = Math.floor(this.time_distance / 3600000);
                this.time_distance -= time.h * 3600000;
                // 分
                time.m = Math.floor(this.time_distance / 60000);
                this.time_distance -= time.m * 60000;
                // 秒 
                time.s = Math.floor(this.time_distance / 1000);
            }
            this.time = time;
        }
    }
    YW.extend("date.ShowTime", ShowTime);
})()