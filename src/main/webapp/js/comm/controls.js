/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function() {
    function Adjustment(elm, obj) {//上下调整数字框
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            inputCls: "ks-input", //文本框class名称
            hideCls: "ks-hide",
            prevBtnCls: "ks-up-btn", //向上调整按钮class名称
            nextBtnCls: "ks-dn-btn" //向下调整按钮class名称
        }, obj || {});
        this.elm = $(elm);
        this.input = this.elm.find("." + this.indexobj.inputCls);
        this.inputHide = this.elm.find("." + this.indexobj.hideCls);
        this.inputHide.css({"display": "none"});
        this.input.index = 0;
        this.setval(0);
        this.bind();
    }

    Adjustment.prototype = {
        calc: function(a, b) {//计算值
            var ret;
            if (a >= 0) {
                ret = a + (b * 1);
            } else {
                ret = 0;
            }
            if (ret < 0) {
                ret = 0;
            }
            return ret;
        },
        setval: function(i, v) { //设置值
            if (v) {
                this.input.index = v;
            } else {
                this.input.index = this.calc(this.input.index, i);
            }
            var txt = "";
            if (this.input.index == 0) {
                txt = "全部";
            } else {
                txt = this.input.index;
            }
            this.inputHide.val(this.input.index);
            this.input.val(txt);
        },
        bind: function() {//绑定事件
            var _this = this;
            this.input.bind("change", function () {
                var val=this.value.replace(/\s/g, "");
                if (this.value && /^[0-9]+$/.test(val)) {
                    _this.setval(0, val);
                } else {
                    _this.setval(0);
                }
            });
            this.elm.find("." + this.indexobj.prevBtnCls).bind("click", function () {
                _this.setval(1);
            });
            this.elm.find("." + this.indexobj.nextBtnCls).bind("click", function () {
                _this.setval(-1);
            });
        }

    };
    YW.extend("controls.Adjustment", Adjustment);
})();

(function() {
    function Checkbox(elm, obj) { //复选框
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            checkedCls:"ks-checked"
        }, obj || {});
        this.elm = $(elm);
        this.input = this.elm.find("input[type=checkbox]");
        this.input.css({ "display": "none" });
        this.setStyle(this.input.get(0).checked);
        this.bind();
    }
    Checkbox.prototype = {
        setStyle: function (chd) {//设置样式
            if (chd) {
                this.elm.addClass(this.indexobj.checkedCls);
            } else {
                this.elm.removeClass(this.indexobj.checkedCls);
            }
        },
        bind: function () {
            var _this = this;
            var ck = _this.input.get(0);
            this.elm.bind("click", function (evt) {
                if (evt.target != ck && !ck.readOnly) {
                    ck.click();
                    // if (ck.checked) {
                    //     ck.checked = false;

                    // } else {
                    //     ck.checked = true;
                    // }
                }
				_this.setStyle(ck.checked);
            });
        }
    }
    YW.extend("controls.Checkbox", Checkbox);
})();



(function () {
    function CheckboxAll(elm, obj) { //复选框全选
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            inputCls: "", //复选框class名称
            inputAll: "", //全选复选框class名称
            inputAllCls: "ks-inputall", //需要全选的文本框上级节点class名称
            wait:false //是否等待加载完成
        }, obj || {});
        this.elm = $(elm);
        this.input = this.elm.find("input[type=checkbox]");
        var o = this.input;
        while (!o.is("." + this.indexobj.inputAllCls) && o.get(0) != document) {
            o = o.parent();
        }
        this.o=o;
        this.bool=true;
        //var cls = $("[data-bind]").get();
        //this.allND=o.find("[checkboxall]");
        this.chInputs=this.findInputs();
        //this.chInputs = o.find("input[type=checkbox]").not(this.input);
        //console.log(this.chInputs)
        this.setStyle(this.input.get(0).checked);
        this.setChcked(this.chInputs,this.input.get(0).checked,1);
        this.bind();
    }
    CheckboxAll.prototype = {
        findInputs:function(){//查找选择节点
            var cls,clsall;
            if(this.indexobj.inputCls){
                cls="."+this.indexobj.inputCls;
            }else{
                cls="input[type=checkbox]";
            }
            if(this.indexobj.inputAll){
                clsall="."+this.indexobj.inputAll;
            }else{
                clsall="[checkboxall]";
            }

            var checkboxall=this.o.find(clsall).not(this.input.parent());
            
            if(!checkboxall || checkboxall && !checkboxall.get(0)){
                checkboxall = this.o.find(cls).not(this.input);
            }else {
                this.allInput = checkboxall.find("input[type=checkbox]");
                checkboxall = this.o.find(cls).not(this.input).not(this.allInput);
            }
//            checkboxall=checkboxall.find("input[type=checkbox]")
            return checkboxall;
        },
        setStyle: function (chd) {//设置样式
            if (chd) {
                this.elm.addClass("ks-checked");
            } else {
                this.elm.removeClass("ks-checked");
            }
        },
        setChcked: function (inputs, b, n) {//设置选择其它复选框
            if (b===true && n===1 || n!==1) {
                if (this.allInput) {
                    this.allInput.each(function (k, v) {
                        if (v.checked != b) {
                            v.click();
                        }
                    });
                    //this.allInput.prop("checked",!b)
                    //this.allInput.click();
                } else {
                    if (inputs.get && inputs.get().length > 0) {
                        inputs.each(function (k, v) {
                            if (v.checked != b) {
                                v.click();
                            }
                        });
                        //inputs.prop("checked",!b);
                        //inputs.click();

                    }
                }
            }
        },
        inputAllVal:function(){//设置全选自己的样式和值
            var arr=this.chInputs.get();
            var v=true;
            for (var i =0; i <arr.length; i++) {
                if(!arr[i].checked){
                    v=false;
                }
            };
                this.setStyle(v);
                this.input.prop("checked",v);
        },
        forfindInputs:function(){//重新查找节点
            var _this=this;
            chndobj = this.findInputs();//_this.o.find("input[type=checkbox]").not(_this.input).not("[readonly]");
            if(!this.chInputs && chndobj && chndobj.get(0) ||  this.chInputs && this.chInputs.get().length!=chndobj && chndobj.get().length){
                this.chInputs=chndobj;
                this.chInputs.parent().bind("click",function(){
                    _this.inputAllVal()
                });
            }
        },
        bind: function () {
            var _this = this;
            var ck = _this.input.get(0);
            var chndobj={};
            this.elm.bind("click", function (evt) {
                if(_this.indexobj.wait){
                    _this.bool= false;
                    _this.forfindInputs();

                }

                if (evt.target != ck) {
                    ck.click();
                }else{
                    //alert(ck.checked)
                    _this.setStyle(ck.checked);
                    _this.setChcked(_this.chInputs, ck.checked);
                }
                //console.log(_this.chInputs.parent())
            });
            if(!this.indexobj.wait && this.chInputs && this.chInputs.get(0)){
                this.chInputs.parent().bind("click",function() {
                    _this.inputAllVal();
                });
            }
        }
    }
    YW.extend("controls.CheckboxAll", CheckboxAll);
})();

(function () {
    function Radio(elm, obj) { //单选按钮
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            checkedCls: "ks-radio"
        }, obj || {});
        this.elm = $(elm);
        this.input = this.elm.find("input");
        this.input.css({ "display": "none" });
        this.radioGroup = $("input[name='" + this.input.get(0).name + "']");
        this.setStyle(this.input.get(0).checked);
        this.bind();
    }
    Radio.prototype = {
        setStyle: function (chd) {//设置样式
            if (chd) {
                this.elm.addClass(this.indexobj.checkedCls);
            } else {
                this.elm.removeClass(this.indexobj.checkedCls);
            }
        },
        bind: function () {
            var _this = this;
            var ck = _this.input.get(0);
            this.elm.bind("click", function (evt) {
                _this.radioGroup.prop("checked", false);
                _this.radioGroup.parent().removeClass(_this.indexobj.checkedCls);
                if (ck.checked) {
                    ck.checked = false;
                } else {
                    ck.checked = true;
                }
                _this.setStyle(ck.checked);
            });
        }
    }
    YW.extend("controls.Radio", Radio);
})();

(function () {
    function Button(elm, obj) { //单选按钮
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            buttonCls:"",//按钮的的class名称
            hoverCls: "ks-hover",//鼠标移入时候的class名称
            downCls: "ks-down"//鼠标点下时候的class名称
        }, obj || {});
        this.elm = $(elm);
        if (this.elm.children().length > 0) {
            this.button =this.elm.find("." + this.indexobj.buttonCls);
        }
        if (!this.button) {
            this.button = this.elm;
        }
        this.bind();
    }
    Button.prototype = {
        setStyle: function (chd,cls,o) {//设置样式
            if (chd) {
                o.addClass(cls);
            } else {
                o.removeClass(cls);
            }
        },
        bind: function () {
            var _this = this;
            this.button.bind(YW.mous.mousedown, function () {
                _this.setStyle(true, _this.indexobj.downCls, $(this));
            }).bind(YW.mous.mouseup, function() {
                _this.setStyle(false, _this.indexobj.downCls, $(this));
            });
            this.button.bind("mouseover", function () {
                _this.setStyle(true, _this.indexobj.hoverCls, $(this));
            }).bind("mouseout", function () {
                _this.setStyle(false, _this.indexobj.hoverCls, $(this));
            });
            $(document).bind("mouseup", function() {
                _this.setStyle(false, _this.indexobj.downCls, _this.button);
            });
        }
    }
    YW.extend("controls.Button", Button);
})();

(function () {
    function Select(elm, obj) { //下拉列表框
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            valueCls: "ks-select-value",//设置值的input的class名称
            txtCls: "ks-select-txt",//显示文本的input的class名称
            btnCls: "ks-select-btn",//下拉箭头的class名称
            popBtnCls: "ks-select-pop",//弹出下拉框后下拉箭头的class名称
            selectCls: "ks-select-input",
            optionBoxCls: "ks-option-box",//下拉框的class名称
            optionCls: "ks-option",//下拉框内选项的class名称
            optionHoverCls: "ks-hover"//下拉框内选项鼠标移入的class名称
        }, obj || {});
        this.elm = $(elm);
        this.input = this.elm.find("."+this.indexobj.selectCls);
        this.btn = this.elm.find("." + this.indexobj.btnCls);
        this.selecTxtNd = this.input.find("." + this.indexobj.txtCls);
        this.selecValueNd = this.input.find("." + this.indexobj.valueCls);
        this.optionbox = this.elm.find("." + this.indexobj.optionBoxCls);
        this.optionList = this.optionbox.find("." + this.indexobj.optionCls);
        if (this.selecValueNd.val()) {
            this.selectNd = this.selecValueNd.val(this.selecValueNd.val());
        } else {
            var nd = $(this.optionList.get(0));
            this.selecTxtNd.val(nd.text());
            this.selecValueNd.val(nd.val());
        };
        this.bind();
    }
    Select.prototype = {
        setStyle: function (chd) {//设置样式
            if (chd) {
                this.btn.addClass(this.indexobj.popBtnCls);
                this.optionbox.css({ "display": "block","position": "absolute", "z-index": "9999", "left": ((parseInt(this.elm.css("left")) || 0) - 2) + "px", "top": (parseInt(this.elm.css("top")) + this.elm.height()) + "px" });
            } else {
                this.btn.removeClass(this.indexobj.popBtnCls);
                this.optionList.removeClass(this.indexobj.optionHoverCls);
                this.optionbox.css({ "display": "none" });
            }
        },
        bind: function () {
            var _this = this;
            this.input.bind("click", function (evt) {
                if (_this.optionbox.css("display") == "none") {
                    _this.setStyle(true);
                } else {
                    _this.setStyle(false);
                }
            });
            this.optionList.bind("mouseover", function () {
                _this.optionList.removeClass(_this.indexobj.optionHoverCls);
                $(this).addClass(_this.indexobj.optionHoverCls);
            }).bind("mouseout", function () {
                _this.optionList.removeClass(_this.indexobj.optionHoverCls);
            }).bind("click", function () {
                var nd = $(this);
                _this.setStyle(false);
                _this.selecTxtNd.val(nd.text());
                _this.selecValueNd.val(nd.val());
            });
            $(document).bind("click", function (evt) {
                var o = $(evt.target);
                while (o.get(0) != document && o.get(0) != _this.elm.get(0)) {
                    o = o.parent();
                }
                if (o.get(0) != _this.elm.get(0)) {
                    _this.setStyle(false);
                }
            });
        }
    }
    YW.extend("controls.Select", Select);
})();

(function () {
    function SelectSwap(cls, obj) {//根据下拉列表框交换显示
        if (!cls) {
            return;
        }
        this.elm = $(cls);
        obj = obj || {};
        this.indexobj = YW.addObj({
            swapCls: "ks-swap",
            content: { "1": "ks-swap-cont1" },//需要显示的内容，值为1，class名为ks-swap-cont1注：多个class名之间用空格分隔
            defaultId: "",//默认显示的class内容
            duration: 0//动画时长
        }, obj);
        var o = this.elm;
        var _this = this;
        while (!o.is("." + this.indexobj.swapCls) && o.get(0) != document) {
            o = o.parent();
        }
        this.contentNdobj = {};

        $.each(this.indexobj.content, function (k, v) {
            var arr = v.split(" ");
            _this.contentNd = [];
            for (var i = 0; i < arr.length; i++) {
                var nd = o.find("." + arr[i]);
//                if (!_this.contentNd && nd && nd.get(0)) {
//                    _this.contentNd = nd;
//                    _this.contentNdobj[arr[i]] = nd;
//                } else if (nd && nd.get(0)) {
//                    _this.contentNd = $.merge(_this.contentNd, nd.get());//合并数组
//                    _this.contentNdobj[arr[i]] = nd;
//                }
                if (nd && nd.get(0)) {
                    _this.contentNd = $.merge(_this.contentNd, nd.get().slice(0));//合并数组
                    _this.contentNdobj[arr[i]] = nd;
                }
            }
        });
        if (this.contentNd.length > 0) {
            this.contentNd = $.unique(this.contentNd);//去除数组中的重复
            this.contentNd = $(this.contentNd);
        } else {
            return;
        }
        this.bind();
    }

    SelectSwap.prototype = {
        setStyle: function (n) {//设置显示样式
            var nd;
            this.contentNd.css({ "display": "none" });
            //            console.log(this.contentNd)
            if (this.indexobj.content[this.indexobj.defaultId] && !this.indexobj.content[n]) {
                n = this.indexobj.defaultId;
            }
            var cls = this.indexobj.content[n];
            if (!cls) {
                return;
            }
            var arr = this.indexobj.content[n].split(" ");
            for (var i = 0; i < arr.length; i++) {
                nd = this.contentNdobj[arr[i]];
                if (nd) {
                    this.contentNdobj[arr[i]].slideDown(this.indexobj.duration);
                }
            }
        },
        bind: function () {//绑定事件
            var _this = this;
            this.setStyle(this.elm.val());
            this.elm.bind("change", function () {
                _this.setStyle(this.value);
            });
        }
    };
    YW.extend("ctrlmutual.SelectSwap", SelectSwap);
})();
(function () {
    function Disabled(elm, obj) { //设置锁定
        if (!elm) {
            return;
        }
        this.indexobj = YW.addObj({
            disabledCls: "ks-disabled",
            disabledCtrl: "ks-disabled-cont",
            value: null
        }, obj || {});
        this.elm = $(elm);
        var o = this.elm;
        while (!o.is("." + this.indexobj.disabledCls) && o.get(0) != document) {
            o = o.parent();
        }
        
        this.disabledInput = o.find("." + this.indexobj.disabledCtrl);
        
        if (!this.disabledInput || this.disabledInput && !this.disabledInput.get(0)) {
            return;
        }
        if (elm.tagName != "input") {
            this.input = this.elm.find("input");
        }
        //this.setStyle(this.input.get(0).checked);
        this.bind();
    }
    Disabled.prototype = {
        setValue: function (b) {
            if (this.indexobj.value != null) {
                b = this.indexobj.value;
            }
            if (!b) {
                this.disabledInput.prop("disabled", false);
            } else {
                //this.disabledInput.val(this.disabledInput.get(0).defaultValue);
                this.disabledInput.prop("disabled", true);
                var arrnd = this.disabledInput.get();
                if (!arrnd) {
                    return;
                }
                //锁定时还原默认值
                for (var i = 0; i < arrnd.length; i++) {
                    switch (arrnd[i].type) {
                        case "select-one":
                            var tmp = $(arrnd[i]);
                            tmp.val(tmp.find("option[selected]").val());
                            break;
                        default:
                    }
                }
            }
            
        },
        bind: function () {
            var _this = this;
            var ck = _this.input.get(0);
            this.setValue(!ck.checked);
            this.elm.bind("click", function (evt) {
                if (evt.target != ck && !ck.readOnly) {
                    _this.setValue(!ck.checked);
                } else if (evt.target == ck && !ck.readOnly) {
                    _this.setValue(ck.checked);
                }
            });
            
        }
    }
    YW.extend("ctrlmutual.Disabled", Disabled);
})();

/*----------   2015-10-16 14:14:07   ----------*/