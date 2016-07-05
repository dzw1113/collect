/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function () {
    // JavaScript Document
    var Py_Ease = {
        //最简单的线性变化,即匀速运动
        Linear: function (start, alter, curTime, dur) { return start + curTime / dur * alter; },
        //二次方缓动
        easeInQuad: function (start, alter, curTime, dur) {
            return start + Math.pow(curTime / dur, 2) * alter;
        },
        easeOutQuad: function (start, alter, curTime, dur) {
            var progress = curTime / dur;
            return start + (Math.pow(progress, 2) - 2 * progress) * alter;
        },
        easeInOutQuad: function (start, alter, curTime, dur) {
            var progress = curTime / dur * 2;
            return (progress < 1 ? Math.pow(progress, 2) : -((--progress) * (progress - 2) - 1)) * alter / 2 + start;
        },
        //三次方缓动
        easeInCubic: function (start, alter, curTime, dur) {
            return start + Math.pow(curTime / dur, 3) * alter;
        },
        easeOutCubic: function (start, alter, curTime, dur) {
            var progress = curTime / dur;
            return start + (Math.pow(progress, 3) - Math.pow(progress, 2) + 1) * alter;
        },
        easeInOutCubic: function (start, alter, curTime, dur) {
            var progress = curTime / dur * 2;
            return (progress < 1 ? Math.pow(progress, 3) : ((progress -= 2) * Math.pow(progress, 2) + 2)) * alter / 2 + start;
        },
        //四次方缓动
        easeInQuart: function (start, alter, curTime, dur) {
            return start + Math.pow(curTime / dur, 4) * alter;
        },
        easeOutQuart: function (start, alter, curTime, dur) {
            var progress = curTime / dur;
            return start + (Math.pow(progress, 4) - Math.pow(progress, 3) - 1) * alter;
        },
        easeInOutQuart: function (start, alter, curTime, dur) {
            var progress = curTime / dur * 2;
            return (progress < 1 ? Math.pow(progress, 4) : -((progress -= 2) * Math.pow(progress, 3) - 2)) * alter / 2 + start;
        },
        //五次方缓动
        easeInQuint: function (start, alter, curTime, dur) {
            return start + Math.pow(curTime / dur, 5) * alter;
        },
        easeOutQuint: function (start, alter, curTime, dur) {
            var progress = curTime / dur;
            return start + (Math.pow(progress, 5) - Math.pow(progress, 4) + 1) * alter;
        },
        easeInOutQuint: function (start, alter, curTime, dur) {
            var progress = curTime / dur * 2;
            return (progress < 1 ? Math.pow(progress, 5) : ((progress -= 2) * Math.pow(progress, 4) + 2)) * alter / 2 + start;
        },
        //正弦曲线缓动
        easeInSine: function (start, alter, curTime, dur) {
            return start + (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter;
        },
        easeOutSine: function (start, alter, curTime, dur) {
            return start + Math.sin(curTime / dur * Math.PI / 2) * alter;
        },
        easeInOutSine: function (start, alter, curTime, dur) {
            return start + (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter / 2;
        },
        //指数曲线缓动
        easeInExpo: function (start, alter, curTime, dur) {
            return curTime ? (start + alter * Math.pow(2, 10 * (curTime / dur - 1))) : start;
        },
        easeOutExpo: function (start, alter, curTime, dur) {
            return (curTime == dur) ? (start + alter) : (start + (Math.pow(2, -10 * curTime / dur) + 1) * alter);
        },
        easeInOutExpo: function (start, alter, curTime, dur) {
            if (!curTime) { return start; }
            if (curTime == dur) { return start + alter; }
            var progress = curTime / dur * 2;
            if (progress < 1) {
                return alter / 2 * Math.pow(2, 10 * (progress - 1)) + start;
            } else {
                return alter / 2 * (-Math.pow(2, -10 * --progress) + 2) + start;
            }
        },
        //圆形曲线缓动
        easeInCirc: function (start, alter, curTime, dur) {
            return start + alter * Math.sqrt(-Math.pow(curTime / dur, 2));
        },
        easeOutCirc: function (start, alter, curTime, dur) {
            return start + alter * Math.sqrt(1 - Math.pow(curTime / dur - 1));
        },
        easeInOutCirc: function (start, alter, curTime, dur) {
            var progress = curTime / dur * 2;
            return (progress < 1 ? 1 - Math.sqrt(1 - Math.pow(progress, 2)) : (Math.sqrt(1 - Math.pow(progress - 2, 2)) + 1)) * alter / 2 + start;
        },
        //指数衰减的正弦曲线缓动
        easeInElastic: function (start, alter, curTime, dur, extent, cycle) {
            if (!curTime) { return start; }
            if ((curTime == dur) == 1) { return start + alter; }
            if (!cycle) { cycle = dur * 0.3; }
            var s;
            if (!extent || extent < Math.abs(alter)) {
                extent = alter;
                s = cycle / 4;
            } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
            return start + extent * Math.pow(2, 10 * (curTime / dur - 1)) * Math.sin((curTime - dur - s) * (2 * Math.PI) / cycle);
        },
        easeOutElastic: function (start, alter, curTime, dur, extent, cycle) {
            if (!curTime) { return start; }
            if (curTime == dur) { return start + alter; }
            if (!cycle) { cycle = dur * 0.3; }
            var s;
            if (!extent || extent < Math.abs(alter)) {
                extent = alter;
                s = cycle / 4;
            } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
            return start + alter + extent * Math.pow(2, -curTime / dur * 10) * Math.sin((curTime - s) * (2 * Math.PI) / cycle);
        },
        easeInOutElastic: function (start, alter, curTime, dur, extent, cycle) {
            if (!curTime) { return start; }
            if (curTime == dur) { return start + alter; }
            if (!cycle) { cycle = dur * 0.45; }
            var s;
            if (!extent || extent < Math.abs(alter)) {
                extent = alter;
                s = cycle / 4;
            } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
            var progress = curTime / dur * 2;
            if (progress < 1) {
                return start + 0.5 * extent * Math.pow(2, 10 * (progress -= 1)) * Math.sin((progress * dur - s) * (2 * Math.PI) / cycle);
            } else {
                return start + alter + 0.5 * extent * Math.pow(2, -10 * (progress -= 1)) * Math.sin((progress * dur - s) * (2 * Math.PI) / cycle);
            }
        },
        //Back
        easeInBack: function (start, alter, curTime, dur, s) {
            if (typeof s == "undefined") { s = 1.70158; }
            return start + alter * (curTime /= dur) * curTime * ((s + 1) * curTime - s);
        },
        easeOutBack: function (start, alter, curTime, dur, s) {
            if (typeof s == "undefined") { s = 1.70158; }
            return start + alter * ((curTime = curTime / dur - 1) * curTime * ((s + 1) * curTime + s) + 1);
        },
        easeInOutBack: function (start, alter, curTime, dur, s) {
            if (typeof s == "undefined") { s = 1.70158; }
            if ((curTime /= dur / 2) < 1) {
                return start + alter / 2 * (Math.pow(curTime, 2) * (((s *= (1.525)) + 1) * curTime - s));
            }
            return start + alter / 2 * ((curTime -= 2) * curTime * (((s *= (1.525)) + 1) * curTime + s) + 2);
        },
        //Bounce
        easeInBounce: function (start, alter, curTime, dur) {
            return start + alter - this.easeOutBounce(0, alter, dur - curTime, dur);
        },
        easeOutBounce: function (start, alter, curTime, dur) {
            if ((curTime /= dur) < (1 / 2.75)) {
                return alter * (7.5625 * Math.pow(curTime, 2)) + start;
            } else if (curTime < (2 / 2.75)) {
                return alter * (7.5625 * (curTime -= (1.5 / 2.75)) * curTime + .75) + start;
            } else if (curTime < (2.5 / 2.75)) {
                return alter * (7.5625 * (curTime -= (2.25 / 2.75)) * curTime + .9375) + start;
            } else {
                return alter * (7.5625 * (curTime -= (2.625 / 2.75)) * curTime + .984375) + start;
            }
        },
        easeInOutBounce: function (start, alter, curTime, dur) {
            if (curTime < dur / 2) {
                return this.easeInBounce(0, alter, curTime * 2, dur) * 0.5 + start;
            } else {
                return this.easeOutBounce(0, alter, curTime * 2 - dur, dur) * 0.5 + alter * 0.5 + start;
            }
        }
    };
    /* 图片轮播开始*/
    function Slide(cls, obj) {
        /// <param name="cls" type="节点">节点</param>
        if (!cls) { return; }
        this.obj = obj || {};
        this.cls = $(cls);
        var _this = this;
        var dfboj = {
            effect: 'none', //值为:scrollx切换时的动画方向水平方向,scrolly切换时的动画方向垂直方向
            //none, 最朴素的显示/隐藏效果||fade, 可实现淡隐淡现的效果
            countdown: false, //是否开启倒计时样式 true/false (默认值：false)
            countCls: "ks-switchable-down", //设定倒计时样式Class名称可先在CSS里对样式进行定义
            navCls: "ks-switchable-nav", //对其进行轮播的目标列表的class名
            contentCls: "ks-switchable-content", //轮播列表所对应的内容列表的class名
            contentWidth: null, //轮播列表所对应的内容列表的宽度
            delay: 3, //延迟加载时间，当前显示图片到切换其他图片动作开始，这中间的停留时间.1 == 100ms 
            triggerType: 'mouseover', //触发方式——mouse：鼠标经过触发click：鼠标点击触发
            hasTriggers: true, // true/false (默认值：true)  是否设置触发点
            steps: 1, //  自定义数值 (默认值：1)  切换视图内有多少个panels 
            viewSize: null, //切换视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            activeIndex: 0, //  自定义数值 (默认值：0)  默认激活的列表项  
            activeTriggerCls: 'active', //  自定义值 (默认值：active)  默认激活列表项的class值 
            autoplay: true, //true/false (默认值：true)  是否自动播放
            flipButton: true,//是否存在上一页下一页按钮
            pnview: false,//未获取焦点时是否显示上一页，下一页按钮(true为显示/false为不显示)
            prevBtnCls: "prev", //自定义值  上一页的class值  
            nextBtnCls: "next", //自定义值  下一页的class值
            BtnCls: "activebtn", //自定义值  激活的上一页或下一页的class
            duration: 0.01, //  自定义值(默认：0.03)  动画时长,一张图片开始切换到另一张图片显示的时间.1 == 100ms
            durationtim: 0.5, //动画时长;
			carousel:true,//到最后一页是否能无缝轮播
            zIndex: 1,//z轴高度
            object: ""//用对象方式传入参数，输入要传入对象名
        };
        var indexobj = YW.addObj(dfboj, this.obj);
        this.indexobj = YW.addObj(indexobj, indexobj.object);
        this.time = this.gettime(this.indexobj.delay, this.indexobj.durationtim, this.indexobj.duration);
        this.indexobj.fade = Py_Ease[this.obj.fade || "Linear"];//透明动画方式，effect的值为fade时才启用
        this.indexobj.easing = Py_Ease[this.obj.easing || "Linear"];//'easeOutStrong',//滚动的动画效果方式easeBoth
        if (this.indexobj.effect == "scrollx") {
            this.weizi = { left: "Left", Height: "Width" };
        } else {
            this.weizi = { left: "Top", Height: "Height" };
        };


        var objclass = "."+this.indexobj.countCls + ",." + this.indexobj.navCls + ",." + this.indexobj.contentCls + ",." + this.indexobj.activeTriggerCls + ",." + this.indexobj.prevBtnCls + ",." + this.indexobj.nextBtnCls; //过滤的class名称




        this.clsNodes0 = this.reNodes(objclass, this.indexobj.contentCls);
        //this.cls.css({ "width": this.cls.width() + "px", "height": this.cls.height() + "px" });
        this.conNodes = this.clsNodes0 && this.clsNodes0.children();
        this.conNodes.css({ "width": this.cls.width() + "px", "height": this.cls.height() + "px" });
        this.conlength = this.conNodes.get().length;
        this.clsNodes1 = this.reNodes(objclass, this.indexobj.navCls);
        this.navNodes = this.clsNodes1 && this.clsNodes1.children();
        if (this.clsNodes1) { this.clsNodes1.get(0).style.zIndex = 1 + this.indexobj.zIndex; };
        if (this.indexobj.flipButton) {//上一页下一页
            this.prevNodes = this.reNodes(objclass, this.indexobj.prevBtnCls);
            if (this.prevNodes && this.prevNodes.get(0)) {

                this.prevNodes.css({ "position": "absolute","z-Index":(2 + this.indexobj.zIndex) });
                if (!this.indexobj.pnview) {
                    this.prevNodes.css({ "display": "none" });
                }
            };
            this.nextNodes = this.reNodes(objclass, this.indexobj.nextBtnCls);
            if (this.nextNodes && this.nextNodes.get(0)) {
                this.nextNodes.css({ "position": "absolute", "z-Index": (2 + this.indexobj.zIndex) });
                if (!this.indexobj.pnview) {
                    this.nextNodes.css({ "display": "none" });
                }
            };
        };
        this.cls.css({ "position": "relative" });
        if (this.clsNodes0) { this.clsNodes0.css({ "position": "absolute" }); }
        if (this.conNodes) {
//            YW.each(this.conNodes.get(), function (v, i, o) {
//                if (this.indexobj.effect == "scrollx") {
//                    $(v).css({ "float": this.weizi["left"].toLowerCase() });
//                    this.clsNodes0.get(0).style[_this.weizi.Height.toLowerCase()] = v["client" + _this.weizi.Height] * (k + 1) + "px";
//                } else if (this.indexobj.effect == "fade") {
//                    $(v).css({ "position": "absolute" });
//                    if (i != this.indexobj.activeIndex) {
//                        v.style.zIndex = -1 + this.indexobj.zIndex;
//                        this.fade1(0, v);
//                    };
//                }
//                if (this.navNodes && this.navNodes.get().length > i) {
//                    this.navNodes.get(i).index = i;
//                    this.countNodes(this.navNodes.get(i));
//                };
//                if (o && o.length > i) {
//                    v.index = i;
//                }
//            }, this);
            this.conNodes.each(function (k, v) {
                if (_this.indexobj.effect == "scrollx") {
                    $(v).css({ "float": _this.weizi["left"].toLowerCase() });
                    _this.clsNodes0.get(0).style[_this.weizi.Height.toLowerCase()] = v["client" + _this.weizi.Height] * (k + 1) + "px";
                } else if (_this.indexobj.effect == "fade") {
                    $(v).css({ "float": _this.weizi["left"].toLowerCase() });
                    $(v).css({ "position": "absolute" });
                    if (k != _this.indexobj.activeIndex) {
                        v.style.zIndex = -1 + _this.indexobj.zIndex;
                        _this.fade1(0, v);
                    };
                }
                if (_this.navNodes && _this.navNodes.get().length > k) {
                    _this.navNodes.get(k).index = k;
                    _this.countNodes(_this.navNodes.get(k));
                };
                if (_this.conNodes && _this.conNodes.length > k) {
                    v.index = k;
                }
            });
            if (this.indexobj.hasTriggers == true) {
                this.bind(); //绑定事件
            }
        }
        if (this.conNodes) {
            this.curCon = this.conNodes.get(0);
            if (this.indexobj.effect == "fade") {
                this.curCon.style.zIndex = 0 + this.indexobj.zIndex;
            }
        };
        if (this.navNodes) {
            this.curNav = this.navNodes.get(0);
        };
        if (this.conNodes && this.conNodes.length > this.indexobj.activeIndex) {
            this.invoke(this.indexobj.activeIndex);
        } else if (this.conNodes && this.conNodes.length > 0) {
            this.invoke(0);
        };
    };
    Slide.prototype = {
        reNodes: function (objcla, contentCls) {//读取节点
            var clsnode;
            var nds = this.cls.find("."+contentCls);
            if (nds.get().length > 0) {// Py.Base.Has.className(contentCls, this.cls)
                clsnode = nds.get(0);
                return $(clsnode);
            } else {
                var clsN0 = this.cls.children().get();
                for (var i = 0; i < clsN0.length; i++) {
                    var nd = $(clsN0[i]);
                    if (nd.find(objcla).get().length < 1 && !nd.is(objcla)) {
                        
                        clsnode = nd;
                        nd.addClass(contentCls);
                        return clsnode;
                    }
                }
            };
        },
        viewcls: function (o, n) {//显示和隐藏class
            if (o) {
                o = $(o);
                if (n == 1) { o.css({ "display": "none" }); } else {
                    o.css({ "display": "block" });
                }
            }
        },
        gettime: function (z, t, j) {//取得时间
            /// <param name="tl" type="数字">等待时间秒</param>
            /// <param name="t" type="数字">总时间秒</param>
            /// <param name="j" type="数字">间隔时间秒</param>
            z *= 1000, t *= 1000, j *= 1000;
            var zc = (t / j).toFixed(0);
            return { j: Math.ceil(t / zc), t: j * zc, z: z }
        },
        start: function () {//开始播放
            
            if (this.indexobj.autoplay == true) {
                var _this = this;
                this.stop();
                if (this.indexobj.countdown) {
                    this.countstart();
                } else {
                    this.timeout = setTimeout(function () {
                        _this.stopeas = false;
                        _this.next();
                    }, this.time.z);
                };
            }
        },
        stop: function () {//停止播放
            //this.stopeas = false;
            clearTimeout(this.timeout);
            this.countstop();
            this.addnavclass();
        },
        next: function () {//下一帧
            if (this.curCon) {
                var nextindex = this.curCon.index + 1;
                if (this.indexobj.steps == 1) {
                    if (nextindex >= this.conNodes.length) {
                        nextindex = 0;
                    };
                } else {
                    if (nextindex >= this.indexobj.steps) {
                        nextindex = 0;
                    };
                };
				if(!this.indexobj.carousel && nextindex != 0 || this.indexobj.carousel){
					this.invoke(nextindex);
				}
            };
        },
        prev: function () {//上一帧
//            var previndex = this.curCon.index - 1;
//            if (this.indexobj.steps == 1) {
//                if (previndex < 0) {
//                    previndex = this.conNodes.length - 1;
//                };
//            } else {
//                if (previndex < 0) {
//                    previndex = this.indexobj.steps - 1;
//                };
            //            };
			var ndn=1;
			if(this.indexobj.steps == 1){
				ndn=this.conNodes.length;
			}else{
				ndn=this.indexobj.steps;
			}
            var previndex = this.curCon.index - 1;
//            if (this.indexobj.steps == 1) {
//                if (previndex < 0) {
//                    previndex = this.conNodes.length - 1;
//                };
//            } else {
//                if (previndex < 0) {
//                    previndex = this.indexobj.steps - 1;
//                };
//            };
			if (previndex < 0) {
                    previndex = ndn - 1;
                };
			if(!this.indexobj.carousel && previndex != (ndn - 1)||this.indexobj.carousel){
					this.invoke(previndex);
				}
        },
        invoke: function (n) {//具体显示哪一帧
            this.pcurCon = this.curCon != this.conNodes[n] ? this.curCon : null;
            this.curCon = this.conNodes[n];
            if (this.navNodes) {
                this.pcurNav = this.curNav || null;
                this.curNav = this.navNodes[n];
                var cNav = $(this.curNav).children();
                if (cNav && cNav.get(0)) {
                    this.countNav = cNav.get(0);
                }
            }
            if (this.indexobj.effect == "fade" && this.pcurCon) { this.fade(); this.fadestart(); };
            if (this.indexobj.effect === "none") {
                this.none(n);
            } else {
                var ht, top;
                this.forrank(n);
                if (this.t && n < 1) {
                    top = this.clsNodes0.get(0)["offset" + this.weizi.left];
                    ht = (this.indexobj.viewSize || this.conNodes.get(n)["client" + this.weizi.Height]) * (n + 1);
                } else if (this.t && n == this.conNodes.get().length-1) {
                    top =0;
                    ht = -(this.indexobj.viewSize || this.conNodes.get(0)["client" + this.weizi.Height]);
                    
                } else {
                    top = this.clsNodes0.get(0)["offset" + this.weizi.left];
                    ht = (this.indexobj.viewSize || this.conNodes.get(n)["client" + this.weizi.Height]) * n;
                    if (n == 0) {
                        ht = top;
                        this.t = false;
                    } else {
                        ht += top;
                        this.t = false;
                    }
                }
                this.up = n;
                this.easing(top, -ht,n); //Py_Ease.Cubic.easeInOut);
                

            }
            this.addnavclass(n);
        },
        forrank: function (n,i) {//还原排列
            var nd = this.conNodes.get(0), up;
            if (i === 1) {
                if (n == 0 && this.t && this.indexobj.effect != "fade" || n == this.conlength - 1 && this.t && this.indexobj.effect != "fade") {
                    this.forrank1(n);
                    this.clsNodes0.get(0).style[this.weizi["left"].toLowerCase()] = (-(nd["client" + this.weizi.Height]) * n) + "px";
                    this.t = false;
                }
            } else {
                if (n > 0 && n < this.conlength - 1 && this.t && this.indexobj.effect != "fade") {
                    if (this.up - n > 0) {
                        up = -1;
                    } else {
                        up = 1;
                    }
                    this.forrank1(n);
                    this.clsNodes0.get(0).style[this.weizi["left"].toLowerCase()] = (-(nd["client" + this.weizi.Height]) * (n - up)) + "px";
                    this.t = false;
                }
            }
        },
        forrank1: function (n) {
            var nd = this.conNodes.get(0);
            var nd1 = this.conNodes.get(this.conlength - 1);
            if (n < this.conlength - 1 && this.indexobj.effect != "fade") {
                nd.style[this.weizi["left"].toLowerCase()] = 0 + "px";
                nd.style.position = "static";
            }
            if (n > 0 && this.indexobj.effect != "fade") {
                nd1.style[this.weizi["left"].toLowerCase()] = nd1["client" + this.weizi.Height] * (this.conlength - 1) + "px";
                nd1.style.position = "static";
            }
        },
        rank: function (n) {//排列内容
            var nd = this.conNodes.get(0);
            var nd1 = this.conNodes.get(this.conlength - 1);
            if (n == 0 && this.indexobj.effect != "fade") {
                var left1 = (nd["client" + this.weizi.Height]) * this.conlength;
                this.t = true;
                this.conNodes.get(this.conlength - 1).style[this.weizi["left"].toLowerCase()] = -left1 + "px";
                this.conNodes.get(this.conlength - 1).style.position = "relative";
            }
            if (this.conlength - 1 == n && this.indexobj.effect != "fade") {
                var left = (this.conNodes.get(n)["client" + this.weizi.Height]) * (n + 1);
                this.t = true;
                nd.style[this.weizi["left"].toLowerCase()] = left + "px";
                nd.style.position = "relative";
            }
        },
        fadestart: function () {//实现淡隐淡现的效果
            var _this = this;
            var fdTim = 0;
            var start = 0, alter = 100;
            var jTim = this.time.j, zTim = this.time.t;
            this.animate && clearInterval(this.fademate);
            this.fadezindex();
            this.curCon.style.zIndex = 0 + this.indexobj.zIndex;
            this.fademate = setInterval(function () {
                var stTim = Math.ceil(_this.indexobj.fade(start, alter, fdTim, zTim));
                var stTim1 = Math.ceil(_this.indexobj.fade(start, alter, fdTim, zTim / 2));
                _this.fade1(stTim, _this.curCon, stTim1);
                if (fdTim >= zTim) { clearInterval(_this.fademate); }
                fdTim += jTim;
            }, jTim);
        },
        fadezindex: function () {//设置所有层的z-index为-1
            if (!this.conNodes) { return this.conNodes; };
            for (var i = 0; i < this.conNodes.length; i++) {
                this.conNodes[i].style.zIndex = -1 + this.indexobj.zIndex;
            }
        },
        fade: function () {//设置除当前层和上一层以外的所有层为透明
            if (!this.conNodes) { return this.conNodes; }
            var _this = this;
            this.conNodes.each(function (i,v) {
                if (_this.pcurCon != null && v != _this.pcurCon) {
                    _this.fade1(0, v, 0);
                } else if (_this.pcurCon != null && v == _this.pcurCon) {
                    _this.fade1(100, v, 100);
                };
            });
        },
        fade1: function (a, o, a1) {
            /// <param name="a" type="长整型">透明度值1</param>
            /// <param name="o" type="节点">节点</param>
            /// <param name="a1" type="长整型">透明度值2</param>
            if (!o) {
                return;
            }
            if (!("opacity" in o.style)) {
                if ((parseInt(a) || 0) > 0) {
                    o.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=2,opacity=" + a1 + ",finishOpacity=" + a + ")";
                } else {
                    o.style.filter = "alpha(opacity=" + a + ")";
                }
            } else {
                o.style.opacity = a / 100 + "";
            }
            return o;
        },
        none: function (n) {//none, 最朴素的显示/隐藏效果
            if (!this.conNodes) { return; }
            var _this = this;
            this.conNodes.each(function (i,v) {
                if (i == n) {
                    _this.viewcls(v, 0);
                    _this.start();
                } else {
                    _this.viewcls(v, 1);
                }
            });
        },
        easing: function (start, alter,n) {//切换时效果
            if (!this.clsNodes0) { return this.clsNodes0; }
            var curTime = 0;
            var _this = this;
            this.animate && clearInterval(this.animate);
            this.animate = setInterval(function () {
                if (_this.indexobj.effect != "fade") {
                    _this.clsNodes0.get(0).style[_this.weizi["left"].toLowerCase()] = Math.ceil(_this.indexobj.easing(start, alter, curTime, _this.time.t)) + "px";
                    if (curTime >= _this.time.t) {
                        clearInterval(_this.animate);
                        _this.forrank(n,1);
                        _this.rank(n);
                        if (_this.indexobj.countdown != true && _this.stopeas == false) {
                            _this.start();
                        }
                    };
                    curTime += _this.time.j;
                };
            }, this.time.j);
        },
        addnavclass: function (id) {//设置当前选项的class
            if (!this.navNodes) { return this.navNodes; }
            for (var i = 0; i < this.navNodes.get().length; i++) {
                
                if (id != null) {
                    $(this.navNodes.get(i)).removeClass(this.indexobj.activeTriggerCls);
                    //Py.Base.Dom.delClass(this.indexobj.activeTriggerCls, this.navNodes[i]);
                }
                if (this.indexobj.countdown == true) {
                    $(this.navNodes.get(i).firstChild).removeClass(this.indexobj.countCls);
                   // Py.Base.Dom.delClass(this.indexobj.countCls, );
                };
            }
            if (id >= 0) {
                $(this.navNodes.get(id)).addClass(this.indexobj.activeTriggerCls);
            }
            //Py.Base.Dom.addClass(this.indexobj.activeTriggerCls, this.navNodes[id]);
        },
        countstart: function () {//进度条开始
            if (this.indexobj.countdown == true) {
                if (this.curNav && this.countNav) {
                    this.countNav.style.width = (this.indexobj.contentWidth || this.curNav.clientWidth) + "px";
                    var wd = this.countNav.clientWidth;
                }
                var curT = 0, _this = this;
                this.countstop();
                $(this.countNav).addClass(this.indexobj.countCls);
//                Py.Base.Dom.addClass(this.indexobj.countCls, this.countNav);
                //计算进度条时间
                var jg = 0.05;
                var jsjj = this.gettime(this.indexobj.delay, this.indexobj.delay + this.indexobj.durationtim, jg);
                this.countinterval = setInterval(function () {
                    if (_this.countNav) {
                        if ("width" in _this.countNav.style) {
                            _this.countNav.style.width = Math.ceil(Py_Ease.Linear(wd, -wd, curT, jsjj.t)) + "px";
                        }
                    }
                    if (curT >= (jsjj.t)) { _this.countstop(); _this.next(); _this.start(); }
                    curT += jsjj.j;
                }, jsjj.j);
            };
        },
        countstop: function () {//进度条停止
            clearInterval(this.countinterval);
        },
        countNodes: function (obj) {//删除/创建进度条节点
            if (!obj) { return obj; }
            if (this.indexobj.countdown == true) {
                var odiv = document.createElement("div");
                if (obj.firstChild) {
                    obj.insertBefore(odiv, obj.firstChild);
                } else if (obj.tagName) {
                    obj.appendChild(odiv);
                }
            }
        },
        bind: function () {
            var _this = this;
            this.navNodes && this.navNodes.bind(this.indexobj.triggerType, function () {
                _this.invoke(this.index);
            });
            this.prevNodes && this.prevNodes.bind("click touchend", function () { _this.prev(); });
            this.nextNodes && this.nextNodes.bind("click touchend", function () { _this.next(); });
            this.prevNodes && this.prevNodes.bind("mouseover", function () { $(this).addClass(_this.indexobj.BtnCls); });
            this.nextNodes && this.nextNodes.bind("mouseover", function () { $(this).addClass(_this.indexobj.BtnCls); });
            this.prevNodes && this.prevNodes.bind("mouseout", function () { $(this).removeClass(_this.indexobj.BtnCls); });
            this.nextNodes && this.nextNodes.bind("mouseout", function () { $(this).removeClass(_this.indexobj.BtnCls); });
            this.cls.bind(this.indexobj.triggerType + " touchstart", function (evt) {//暂停动画
                _this.stopeas = true;
                _this.stop();
                _this.viewcls(_this.prevNodes, 0);
                _this.viewcls(_this.nextNodes, 0);
            });
            this.clsNodes1 && this.clsNodes1.bind(this.indexobj.triggerType + " touchstart", function (evt) {
                evt.preventDefault(); //取消浏览器默认事件
            });
            this.cls.bind("mouseout touchend touchmove", function (evt) {//开始动画
                var o = $(evt.relatedTarget);
                if (evt.relatedTarget) {
                    while (o.get(0) != document && o.get(0) != _this.cls.get(0)) {
                        o = o.parent();
                    }
                }

                if (o.get(0) != _this.cls.get(0)) {
                    if (!_this.indexobj.pnview) {
                        _this.viewcls(_this.prevNodes, 1);
                        _this.viewcls(_this.nextNodes, 1);
                    }
                    _this.stopeas = false;
                    _this.start();
                }
            });
//            //touchstart事件  
//            function touchSatrtFunc(e) {
//                //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
//                var touch = e.touches[0]; //获取第一个触点  
//                var x = Number(touch.pageX); //页面触点X坐标  
//                var y = Number(touch.pageY); //页面触点Y坐标  
//                //记录触点初始位置  
//                startX = x;
//                startY = y;
//            }
            function touchmove(evt) {//touchmove事件 
                var touch = evt.touches || evt.targetTouches || evt.originalEvent.touches;
                touch = touch[0];//获取第一个触点 
                var x = Number(touch.pageX); //页面触点X坐标  
                var y = Number(touch.pageY); //页面触点Y坐标 
                //var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
                //判断滑动方向 
				if(_this.indexobj.effect=="scrolly"){
					if (y - _this.startY > 100) {
						_this.prev();
						_this.cls.unbind("touchmove", touchmove);
						return;
						//左右滑动  
					}
					if (y - _this.startY < -100) {
						_this.next();
						_this.cls.unbind("touchmove", touchmove);
						return;
					}
				}else{
					evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
					if (x - _this.startX > 20) {
						_this.prev();
						_this.cls.unbind("touchmove", touchmove);
						return;
						//左右滑动  
					}
					if (x - _this.startX < -20) {
						_this.next();
						_this.cls.unbind("touchmove", touchmove);
						return;
					}
					//                if (y - startY != 0) {
					//                    //上下滑动  
					//                }
				}
            }
            this.cls.bind("touchstart", function(evt) {
                evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
                var touch = evt.touches || evt.targetTouches || evt.originalEvent.touches; 
                touch = touch[0];//获取第一个触点
                var x = Number(touch.pageX); //页面触点X坐标  
                var y = Number(touch.pageY); //页面触点Y坐标  
                //记录触点初始位置  
                _this.startX = x;
                _this.startY = y;
                _this.cls.bind("touchmove", touchmove);
                
            });

        }
    };
    YW.extend("widget.Slide", Slide);
    //    window.WidgetSlide = WidgetSlide; /*图片轮播结束*/
})();

/*----------   2015-10-16 14:14:07   ----------*/