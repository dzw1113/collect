(function () {
    // JavaScript Document
    var Py_Ease = {
        //��򵥵����Ա仯,�������˶�
        Linear: function (start, alter, curTime, dur) { return start + curTime / dur * alter; },
        //���η�����
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
        //���η�����
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
        //�Ĵη�����
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
        //��η�����
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
        //�������߻���
        easeInSine: function (start, alter, curTime, dur) {
            return start + (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter;
        },
        easeOutSine: function (start, alter, curTime, dur) {
            return start + Math.sin(curTime / dur * Math.PI / 2) * alter;
        },
        easeInOutSine: function (start, alter, curTime, dur) {
            return start + (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter / 2;
        },
        //ָ�����߻���
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
        //Բ�����߻���
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
        //ָ��˥�����������߻���
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
    /* ͼƬ�ֲ���ʼ*/
    function Slide(cls, obj) {
        /// <param name="cls" type="�ڵ�">�ڵ�</param>
        if (!cls) { return; }
        this.obj = obj || {};
        this.cls = $(cls);
        var _this = this;
        var dfboj = {
            effect: 'none', //ֵΪ:scrollx�л�ʱ�Ķ�������ˮƽ����,scrolly�л�ʱ�Ķ�������ֱ����
            //none, �����ص���ʾ/����Ч��||fade, ��ʵ�ֵ������ֵ�Ч��
            countdown: false, //�Ƿ������ʱ��ʽ true/false (Ĭ��ֵ��false)
            countCls: "ks-switchable-down", //�趨����ʱ��ʽClass���ƿ�����CSS�����ʽ���ж���
            navCls: "ks-switchable-nav", //��������ֲ���Ŀ���б��class��
            contentCls: "ks-switchable-content", //�ֲ��б�����Ӧ�������б��class��
            contentWidth: null, //�ֲ��б�����Ӧ�������б�Ŀ��
            delay: 3, //�ӳټ���ʱ�䣬��ǰ��ʾͼƬ���л�����ͼƬ������ʼ�����м��ͣ��ʱ��.1 == 100ms 
            triggerType: 'mouseover', //������ʽ����mouse����꾭������click�����������
            hasTriggers: true, // true/false (Ĭ��ֵ��true)  �Ƿ����ô�����
            steps: 1, //  �Զ�����ֵ (Ĭ��ֵ��1)  �л���ͼ���ж��ٸ�panels 
            viewSize: null, //�л���ͼ����Ĵ�С��һ�㲻��Ҫ�趨��ֵ��������ȡֵ����ȷʱ�������ֹ�ָ����С
            activeIndex: 0, //  �Զ�����ֵ (Ĭ��ֵ��0)  Ĭ�ϼ�����б���  
            activeTriggerCls: 'active', //  �Զ���ֵ (Ĭ��ֵ��active)  Ĭ�ϼ����б����classֵ 
            autoplay: true, //true/false (Ĭ��ֵ��true)  �Ƿ��Զ�����
            flipButton: true,//�Ƿ������һҳ��һҳ��ť
            pnview: false,//δ��ȡ����ʱ�Ƿ���ʾ��һҳ����һҳ��ť(trueΪ��ʾ/falseΪ����ʾ)
            prevBtnCls: "prev", //�Զ���ֵ  ��һҳ��classֵ  
            nextBtnCls: "next", //�Զ���ֵ  ��һҳ��classֵ
            BtnCls: "activebtn", //�Զ���ֵ  �������һҳ����һҳ��class
            duration: 0.01, //  �Զ���ֵ(Ĭ�ϣ�0.03)  ����ʱ��,һ��ͼƬ��ʼ�л�����һ��ͼƬ��ʾ��ʱ��.1 == 100ms
            durationtim: 0.5, //����ʱ��;
            zIndex: 1//z��߶�
        };
        this.indexobj = YW.addObj(dfboj, this.obj);
        this.time = this.gettime(this.indexobj.delay, this.indexobj.durationtim, this.indexobj.duration);
        this.indexobj.fade = Py_Ease[this.obj.fade || "Linear"];//͸��������ʽ��effect��ֵΪfadeʱ������
        this.indexobj.easing = Py_Ease[this.obj.easing || "Linear"];//'easeOutStrong',//�����Ķ���Ч����ʽeaseBoth
        if (this.indexobj.effect == "scrollx") {
            this.weizi = { left: "Left", Height: "Width" };
        } else {
            this.weizi = { left: "Top", Height: "Height" };
        };


        var objclass = "."+this.indexobj.countCls + ",." + this.indexobj.navCls + ",." + this.indexobj.contentCls + ",." + this.indexobj.activeTriggerCls + ",." + this.indexobj.prevBtnCls + ",." + this.indexobj.nextBtnCls; //���˵�class����




        this.clsNodes0 = this.reNodes(objclass, this.indexobj.contentCls);
        //this.cls.css({ "width": this.cls.width() + "px", "height": this.cls.height() + "px" });
        this.conNodes = this.clsNodes0 && this.clsNodes0.children();
        this.conNodes.css({ "width": this.cls.width() + "px", "height": this.cls.height() + "px" });
        this.conlength = this.conNodes.get().length;
        this.clsNodes1 = this.reNodes(objclass, this.indexobj.navCls);
        this.navNodes = this.clsNodes1 && this.clsNodes1.children();
        if (this.clsNodes1) { this.clsNodes1.get(0).style.zIndex = 1 + this.indexobj.zIndex; };
        if (this.indexobj.flipButton) {//��һҳ��һҳ
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
                this.bind(); //���¼�
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
        reNodes: function (objcla, contentCls) {//��ȡ�ڵ�
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
        viewcls: function (o, n) {//��ʾ������class
            if (o) {
                o = $(o);
                if (n == 1) { o.css({ "display": "none" }); } else {
                    o.css({ "display": "block" });
                }
            }
        },
        gettime: function (z, t, j) {//ȡ��ʱ��
            /// <param name="tl" type="����">�ȴ�ʱ����</param>
            /// <param name="t" type="����">��ʱ����</param>
            /// <param name="j" type="����">���ʱ����</param>
            z *= 1000, t *= 1000, j *= 1000;
            var zc = (t / j).toFixed(0);
            return { j: Math.ceil(t / zc), t: j * zc, z: z }
        },
        start: function () {//��ʼ����
            
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
        stop: function () {//ֹͣ����
            //this.stopeas = false;
            clearTimeout(this.timeout);
            this.countstop();
            this.addnavclass();
        },
        next: function () {//��һ֡
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
                this.invoke(nextindex);
            };
        },
        prev: function () {//��һ֡
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
            var previndex = this.curCon.index - 1;
            if (this.indexobj.steps == 1) {
                if (previndex < 0) {
                    previndex = this.conNodes.length - 1;
                };
            } else {
                if (previndex < 0) {
                    previndex = this.indexobj.steps - 1;
                };
            };
            this.invoke(previndex);
        },
        invoke: function (n) {//������ʾ��һ֡
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
        forrank: function (n,i) {//��ԭ����
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
        rank: function (n) {//��������
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
        fadestart: function () {//ʵ�ֵ������ֵ�Ч��
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
        fadezindex: function () {//�������в��z-indexΪ-1
            if (!this.conNodes) { return this.conNodes; };
            for (var i = 0; i < this.conNodes.length; i++) {
                this.conNodes[i].style.zIndex = -1 + this.indexobj.zIndex;
            }
        },
        fade: function () {//���ó���ǰ�����һ����������в�Ϊ͸��
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
            /// <param name="a" type="������">͸����ֵ1</param>
            /// <param name="o" type="�ڵ�">�ڵ�</param>
            /// <param name="a1" type="������">͸����ֵ2</param>
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
        none: function (n) {//none, �����ص���ʾ/����Ч��
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
        easing: function (start, alter,n) {//�л�ʱЧ��
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
        addnavclass: function (id) {//���õ�ǰѡ���class
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
        countstart: function () {//��������ʼ
            if (this.indexobj.countdown == true) {
                if (this.curNav && this.countNav) {
                    this.countNav.style.width = (this.indexobj.contentWidth || this.curNav.clientWidth) + "px";
                    var wd = this.countNav.clientWidth;
                }
                var curT = 0, _this = this;
                this.countstop();
                $(this.countNav).addClass(this.indexobj.countCls);
//                Py.Base.Dom.addClass(this.indexobj.countCls, this.countNav);
                //���������ʱ��
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
        countstop: function () {//������ֹͣ
            clearInterval(this.countinterval);
        },
        countNodes: function (obj) {//ɾ��/�����������ڵ�
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
            this.cls.bind(this.indexobj.triggerType + " touchstart", function (evt) {//��ͣ����
                _this.stopeas = true;
                _this.stop();
                _this.viewcls(_this.prevNodes, 0);
                _this.viewcls(_this.nextNodes, 0);
            });
            this.clsNodes1 && this.clsNodes1.bind(this.indexobj.triggerType + " touchstart", function (evt) {
                evt.preventDefault(); //ȡ�������Ĭ���¼�
            });
            this.cls.bind("mouseout touchend touchmove", function (evt) {//��ʼ����
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
//            //touchstart�¼�  
//            function touchSatrtFunc(e) {
//                //evt.preventDefault(); //��ֹ����ʱ����������š�������������  
//                var touch = e.touches[0]; //��ȡ��һ������  
//                var x = Number(touch.pageX); //ҳ�津��X����  
//                var y = Number(touch.pageY); //ҳ�津��Y����  
//                //��¼�����ʼλ��  
//                startX = x;
//                startY = y;
//            }
            function touchmove(evt) {//touchmove�¼� 
                evt.preventDefault(); //��ֹ����ʱ����������š�������������  
                var touch = evt.touches || evt.targetTouches || evt.originalEvent.touches;
                touch = touch[0];//��ȡ��һ������ 
                var x = Number(touch.pageX); //ҳ�津��X����  
                var y = Number(touch.pageY); //ҳ�津��Y���� 
                //var text = 'TouchMove�¼���������' + x + ', ' + y + '��';
                //�жϻ�������  
                if (x - _this.startX > 20) {
                    _this.prev();
                    _this.cls.unbind("touchmove", touchmove);
                    return;
                    //���һ���  
                }
                if (x - _this.startX < -20) {
                    _this.next();
                    _this.cls.unbind("touchmove", touchmove);
                    return;
                }
                //                if (y - startY != 0) {
                //                    //���»���  
                //                }
            }
            this.cls.bind("touchstart", function(evt) {
                evt.preventDefault(); //��ֹ����ʱ����������š�������������  
                var touch = evt.touches || evt.targetTouches || evt.originalEvent.touches; 
                touch = touch[0];//��ȡ��һ������
                var x = Number(touch.pageX); //ҳ�津��X����  
                var y = Number(touch.pageY); //ҳ�津��Y����  
                //��¼�����ʼλ��  
                _this.startX = x;
                _this.startY = y;
                _this.cls.bind("touchmove", touchmove);
                
            });

        }
    };
    YW.extend("widget.Slide", Slide);
    //    window.WidgetSlide = WidgetSlide; /*ͼƬ�ֲ�����*/
})();