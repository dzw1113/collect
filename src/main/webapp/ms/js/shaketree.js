/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 17:26:54 *
*******************************/

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'], function (k, v) {
    $['is' + v] = function(obj) {
        if (v == "Window") {
            return obj != null && obj == obj.window;
        } else {
            return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
        }
    };
});
var tree;
$(function () {
    var shakeTree = function() {
        this.SHAKE_THRESHOLD = 1500; //摇动阀值
        this.last_update = 0;
        this.x = this.y = this.z = this.last_x = this.last_y = this.last_z = 0;
        this.CFG = {
            promotionId: YW.request.promotionid || "890030", ////抽奖编号
            mobile: YW.request.mobile, //手机号
            cid: YW.request.cid, //小区编号
            useFlag: YW.request.useFlag, //使用标识
            custNo: YW.request.custno, //客户号
            pid: YW.request.pid || null, //公司编号
            promotionTitle: "", //活动标题
            prizeId: "",
            getStatus: "", //领取状态
            activityType: "free", //credits:积分模式，free:自由模式
            login: true, //是否已登录
            activityId: 1, //活动ID
            open: true, //活动开启状态
            limitType: 'day', //限制抽奖的次数类型  all:永久,day:每天
            leaveCount: '', //剩余抽奖次数
            enoughCredits: true, //积分是否足够
            free: 3, //剩余免费次数
            needCredits: 100, //活动需要积分
            unitName: '积分', //积分单位
            lotteryId: 0, //抽奖编号
            start: true, //是否开始
            descriptionTitle: "", //分享标题
            result: -1 //是否中奖 (-1订单处理中;0未中奖;1再来一次;2中奖了)
        };
        this.againTag = null; //再来一次
        this.resultjson = {};
        var _this = this;
        if (YW.request.isinapp == 1) { //分享按钮
            var uibutton = $("#ui-button");
            uibutton.show();
            uibutton.bind("click", function() {
                window.sharePromotion && sharePromotion(_this.CFG.promotionId) || window.jiao && jiao.sharePromotion && jiao.sharePromotion(_this.CFG.promotionId);
            });
            $("#isinapp").hide();
        }
        var myad = document.getElementById("myaudio");

        function mPlay() {
            $(document).unbind("touchstart", mPlay);
            myad.play();
            myad.pause();
            myad.currentTime = 0;
        }

        $(document).bind("touchstart", mPlay);
        //myad.currentTime = 0;
        this.tree = new Shake(document.getElementsByClassName('tree')[0], {
            rotate: 15,
            timing: 150,
            myAudio: myad,
            callback: {
                start: function() {
                    _this.timeout = setTimeout(function() {
                        _this.dealResult({
                            success: true,
                            result: _this.CFG.result,
                            lottery: {
                                title: _this.resultjson.prizeName,
                                imgurl: _this.resultjson.prizeUrl + _this.resultjson.prizeId + ".png"
                            }
                        });
                    }, 4000);
                },
                stop: function() {
                    //alert(_this.timeout)
                    _this.timeout && clearTimeout(_this.timeout);
                    $('.result-modal').show();
                }
            }
        });
        //this.tree.start();
        this.credits = $('.credits');
        this.pageLoad(this.CFG);
        this.bind();

    };
    shakeTree.prototype = {
        formatobj: function(obj) { //去除空属性
            var ret = {};
            for (var i in obj) {
                if (obj[i] !== "" && obj[i] != null && obj[i] != undefined) {
                    ret[i] = obj[i];
                }
            }
            return ret;
        },
        request: function(body, serviceCode, callBack) {
            var header = new RequestHeader(serviceCode, this.CFG.pid, null, this.CFG.custNo || "", "PAYMENT", "P-H5");
            body = this.formatobj(body);
            var request = packRequest(body, header);
            var _this = this;
            callService(serviceCode, request, function(back) {
                //没有信息
                if (!back) {
                    //alert("获取数据错误！");
                    $('.result-modal').show();
                    _this.error("获取数据错误！");
                    document.ontouchmove = function(event) {
                        event.preventDefault();
                    };
                    return false;
                } else {
                    if (back.response.responseHeader.returnStatus == '0') {
                        $('.result-modal').show();
                        _this.error(back.response.responseHeader.returnDesc);
                        document.ontouchmove = function(event) {
                            event.preventDefault();
                        };
                        //alert(back.response.responseHeader.returnDesc);
                        return false;
                    }
                }
                if ($.isFunction(callBack)) {
                    callBack(back);
                }
                //return back;
            });

        },
        pageLoad: function(CFG) {
            var body = {
                promotionId: CFG.promotionId || "", //"890030"
                cid: CFG.cid || "" //"CID2015091700000011"                
            };
            var _this = this;
            this.request(body, "MSQueryPrmotionDetailWithPrize", function(back) {
                _this.loadData(back && back.response.responseBody || {});
            });

//            if (!back) {
//                return;
//            }
            //this.loadData(back && back.response.responseBody||{});
        },
        loadData: function(json) { //加载页面 json为当前抽奖详情信息
            //tmp_jsondata.response.responseBody.promotionList
            if (json && $.isString(json)) {
                tmp_loadjson = $.parseJSON(json);
            } else {
                tmp_loadjson = json || {};
            }
            loadjson = tmp_loadjson.promotionList && tmp_loadjson.promotionList[0] || {};
//            if (tmp_loadjson.promotionList) {
//                loadjson = tmp_loadjson.promotionList[0];
//            } else {
//                return;
//            }
            this.setFcg({ promotionId: loadjson.promotionId, promotionTitle: loadjson.promotionTitle }); //设置this.CFG对象的值
            this.prizeList(loadjson.prizeList); //奖品列表
            this.description(loadjson.promotionContent, loadjson.promotionRule); //规则
            this.lotteryStatus(this.CFG);
        },
        prizeList: function(arr) { //奖品列表
            var item = "",
                html = "";
            var _this = this;
            if (!arr) {
                return;
            }
            $.each(arr, function(k, v) {
                item = '<li>' + v.prizeName + '：' + v.prizeExplantion + '</li>';
                item = item + '<li>价值' + v.price + '元</li>';
                item = item + '<li class="list-bt"><span class="span">还剩</span><span class="span-box">' + v.prizeCount + '</span><span class="span">份</span></li>';
                html = html + '<div class="description-item">' +
                    '<div class="description-item-main"><ul class="description-item-txt">' + item +
                    '</ul></div>' +
                    '<div class="description-item-img"><img src="' + v.prizeUrl + v.prizeId + '.png"/></div>' +
                    '</div>';
            });
            html = '<div class="description"><h4>本期奖品<a class="namelist" href="ms_prizeNameList.html?promotionId=' + _this.CFG.promotionId + '&isinapp=' + (YW.request.isinapp || "") + '">中奖名单>></a></h4>' + html + '</div>';
//              target="view_window"
            $('#prizeList').html(html);
        },
        joinLottery: function(obj) { //查询奖品
            if (!obj.promotionId) {
                alert('亲！活动已结束');
            }

            var body = {
                'promotionId': obj.promotionId, //抽奖活动编号
                'mobile': obj.mobile, //手机号
                'cid': obj.cid, //小区编号
                'useFlag': obj.useFlag //使用标识
            };
            var _this = this;
            this.request(body, "MSJoinStartLottery", function(back) {
                if (!back) {
                    //alert("dsafsdafsa")
                    //$(".result-modal").show();
                    //this.error("获取数据错误！")
                    _this.tree.stop();
                    _this.CFG.result = -2;
                    return;
                }
                _this.showLotteryResult(back.response.responseBody);
            });
//            if (!back) {
//                //alert("dsafsdafsa")
//                //$(".result-modal").show();
//                //this.error("获取数据错误！")
//                this.tree.stop();
//                this.CFG.result=-2;
//                return;
//            }
//            this.showLotteryResult(back.response.responseBody);
        },

        showLotteryResult: function(json) { //json为参加抽奖返回报文信息
            var tmp_Resultjson;
            if (json && $.isString(json)) {
                tmp_Resultjson = $.parseJSON(json);
            } else {
                tmp_Resultjson = json || {};
            }
            if (tmp_Resultjson) {
                this.resultjson = tmp_Resultjson;
            } else {
                return;
            }

            var CFG = this.setFcg(this.resultjson);
            if (this.resultjson.lotteryStatus == 0) {
                CFG.result = 0; //是否中奖 (-1订单处理中;0未中奖;1再来一次;2中奖了)
            } else {
                CFG.result = 2; //是否中奖 (-1订单处理中;0未中奖;1再来一次;2中奖了)
            }
        },

        description: function(text1, text2) { //添加活动规则
            var html = "", html1 = "";
            if (!text1 && !text2) {
                return;
            }
            if (text1) {
                $.each(text1.split('\\n'), function(i, v1) {
                    html = html + '<div class="p">' + v1 + '</div>';
                });
            }
            if (text2) {
                $.each(text2.split('\\n'), function(i, v2) {
                    html1 = html1 + '<li>' + v2 + '</li>';
                });
            }
            html = '<div class="description description-foot"><h4>活动规则</h4>' + html + '<ul>' + html1 + '</ul></div>';
            $('#description').html(html);
        },
        tomorrow: function(days) { //计算时间
            var my_date = new Date();
            var time_start = my_date.getTime();
            var txtdate = my_date.getFullYear() + "/" + (my_date.getMonth() + 1) + "/" + my_date.getDate();
            var time_end = new Date(txtdate).getTime() + (days * 24 * 60 * 60 * 1000); //设定目标时间
            var time_distance = time_end - time_start; //计算相差时间
            return {
                getDate: new Date(time_end), //目标时间
                getDistance: time_distance //计算相差时间
            };
        },
        setFcg: function(obj) { //设置CFG对象的值
            var distance = this.tomorrow(1).getDistance;
            if (obj.useFlag) {
                YW.Cookie.add('useFlag', obj.useFlag, distance);
            }
            obj.useFlag = YW.Cookie.get('useFlag');
            this.CFG = YW.addObj(this.CFG, obj);
            return this.CFG;
        },
        lotteryStatus: function(CFG) { //计算次数、状态
            if (CFG.activityType == 'credits') {
                if (CFG.limitType == 'day') {

                    if (CFG.leaveCount > 0 || CFG.leaveCount === '') {
                        if (CFG.free > 0) {
                            this.credits.html('<strong>摇一摇活动预览</strong>');
                        } else {
                            this.credits.html('<strong>' + CFG.needCredits + '</strong>' + '<span>' + CFG.unitName + '/每次</span>');
                        }
                    } else {
                        this.credits.html('<strong>今日已抽完</strong>');
                    }
                } else {
                    if (CFG.leaveCount > 0 || CFG.leaveCount === '') {
                        if (CFG.free > 0) {
                            this.credits.html('<strong>本次免费</strong>');
                        } else {
                            this.credits.html('<strong>' + CFG.needCredits + '</strong>' + '<span>' + CFG.unitName + '/每次</span>');
                        }
                    } else {
                        this.credits.html('<strong>没有抽奖机会了！</strong>');
                    }
                }
            } else {
                if (CFG.limitType == 'day') {
                    if (CFG.free > 0) {
                        this.credits.html('<strong>今日剩余' + CFG.free + '次抽奖机会</strong>');
                    } else {
                        this.credits.html('<strong>今日已抽完</strong>');
                    }
                } else {
                    if (CFG.free > 0) {
                        this.credits.html('<strong>剩余' + CFG.free + '次抽奖机会</strong>');
                    } else {
                        this.credits.html('<strong>没有抽奖机会了！</strong>');
                    }
                }
            }
        },

        deviceMotionHandler: function(eventData) { //检测摇动速度
            var acceleration = eventData.accelerationIncludingGravity;
//            acceleration = { //测试
//                x: 1000,
//                y: 1000,
//                z: 1000
//            }
            var CFG = this.CFG;
            var curTime = new Date().getTime();
            if ((curTime - this.last_update) > 100) {
                var diffTime = curTime - this.last_update;
                this.last_update = curTime;
                this.x = acceleration.x;
                this.y = acceleration.y;
                this.z = acceleration.z;
                var speed = Math.abs(this.x + this.y + this.z - this.last_x - this.last_y - this.last_z) / diffTime * 10000;
                this.last_x = this.x;
                this.last_y = this.y;
                this.last_z = this.z;
                if (speed > this.SHAKE_THRESHOLD) {
                    //this.x = this.y = this.z = this.last_x = this.last_y = this.last_z =0;
                    //$(document).unbind('click', this.motionHandler); //测试解除监听摇动
                    //window.removeEventListener('devicemotion', this.motionHandler); //解除监听摇动
                    // || this.tree.status === 'readyStop'
//                    alert("dsafdasfasd")
                    if ($('.popup').hasClass('show') || this.tree.status === 'running' || this.tree.status === 'readyStop' || $('.result-modal').css('display') == 'block' && $('.again.dialog').css('display') != 'block') {
//                        console.log(this.tree.status === 'readyStop');
                        //this.tree.status="readyStart";
                        return;
                    }
                    
//                    alert("CFG.start")
                    if (!CFG.login) {
                        this.gameover('还未登录', '请先登录再来吧~');
                        document.ontouchmove = function(event) {
                            event.preventDefault();
                        };
                        return;
                    }
                    if (!CFG.open) {
                        this.gameover('活动已结束');
                        document.ontouchmove = function(event) {
                            event.preventDefault();
                        };
                        return;
                    }
                    
                    if (CFG.leaveCount <= 0 && CFG.leaveCount !== '') {
                        if (CFG.limitType == 'all') {
                            this.gameover('没有抽奖次数了');
                        } else {
                            this.gameover('今日已抽完', '明天再来吧~');
                        }
                        document.ontouchmove = function(event) {
                            event.preventDefault();
                        };
                        return;
                    }
                    if (CFG.free <= 0 && !CFG.enoughCredits) {
                        $('.dialog.noCredits,.result-modal').show();
                        document.ontouchmove = function(event) {
                            event.preventDefault();
                        };
                        return;
                    }
                    
                    if ($('.result-modal').css('display') == 'block') {
                        if ($('.dialog.again').css('display') == 'block') {
                            $('.result-modal,.dialog.again').hide();
                            this.tree.start();
                        }
                    } else {
                        //alert(this.tree.start)
                        this.tree.start();
                    }
                    
                    
                    this.joinLottery({
                        promotionId: CFG.promotionId,
                        cid: CFG.cid,
                        useFlag: CFG.useFlag,
                        mobile: CFG.mobile
                    });
                }
            }
        },
        fnmobile: function() { //验证手机号
            var mobile = $('.dialog.win').find("#mobileTxt");
            if (mobile && mobile.get(0)) {
                if (mobile.val()) {
                    if (!/^1\d{10}$/.test(mobile.val())) {
                        alert("手机号由11位数字组成，第一个数字必须为1");
                        return false;
                    }
                } else if (!mobile.val()) {
                    alert('手机号不能为空');
                    return false;
                }
                return mobile.val();
            } else {
                alert('未找到手机号输入框');
                return false;
            }
            return mobile.val();
        },
        format: function(n) { //格式化时间
            if (n < 10) {
                return '0' + n + 's后重新获取';
            } else {
                return n + 's后重新获取';
            }
        },

        dealResult: function(result, orderid) { //处理摇奖结果
            var CFG = this.CFG;
            var _this = this;
            if (result.success) {
                switch (result.result) {
                case -2:
                    break;
                case -1: //订单处理中
                    //postOrder(orderid);
                    break;
                case 0: //未中奖
                    var title = this.MyRound(new Array('苍天啊，大地啊~<br/>中个奖咋就这么难捏！', '木有奖品？木有关系。<br/>摇一摇可以减肥呦！！'));
                    var face = this.MyRound(new Array('cry', 'crow'));
                    $('.dialog.failed').find('p').html(title);
                    if (face == 'cry') {
                        $('.dialog.failed').children('i').removeClass('crow');
                    } else {
                        $('.dialog.failed').children('i').addClass('crow');
                    }
                    $('.dialog.failed').show();
                    break;
                case 1: //再来一次
                    $('.dialog.again').show();
                    this.againTag = result.againTag;
                    break;
                case 2: //中奖了
                    var enterBtn = $('.dialog.win').find('.btn.orange');
                    $("#status").hide();
                    $("#mobilecode").hide();
                    enterBtn.css({ display: 'none' });
                    $('.winsome').children('img').attr('src', result.lottery.imgurl);
                    $('.winsome').children('p').html(result.lottery.title);
                    if (CFG.getStatus == 1) {
                        $("#status").show();
                    } else {
                        $("#mobilecode").val("");
                        $("#mobilecode").show();
                        //$('#help').html("奖品领取开始时间:" + loadjson.prizeStartDate + "<br/>奖品领取结束时间:" + loadjson.prizeEndDate);
                        //                        $('.dialog.win').find('.btn.cancel').bind("click", function () {
                        //                            window.addEventListener('devicemotion', this.motionHandler,false); //监听摇动
                        //                        });
                        enterBtn.css({ display: 'inline-block' });
                        $(".dialog.win .getCode-btn").bind("click", this.evtClick);
                        enterBtn.bind("click", this.getprize);
                    }
                    $('.dialog.win').show();
                    break;
                }

                if (result.result !== -1) {
                    if (((_this.CFG.free || 0) + (_this.CFG.leaveCount || 0)) > 0) {
//                        alert(_this.motionHandler)
//                        $(document).bind("click",_this.motionHandler)
                        CFG.start = true;
                        // window.addEventListener('devicemotion', _this.motionHandler, false); //监听摇动
                    }
                    this.tree.stop();
                    document.ontouchmove = function(event) {
                        event.preventDefault();
                    };
                }
                if (result.result === 1) {
                    this.againTag = result.againTag;
                } else {
                    this.againTag = null;
                }
                if (result.result !== -1 && result.result !== 1) {
                    //更新状态
                    result.open !== undefined && (CFG.open = result.open);
                    result.limitType !== undefined && (CFG.limitType = result.limitType);
                    result.leaveCount !== undefined && (CFG.leaveCount = result.leaveCount);
                    result.enoughCredits !== undefined && (CFG.enoughCredits = result.enoughCredits);
                    result.free !== undefined && (CFG.free = result.free);
                    this.lotteryStatus(CFG);
                }
            } else {
                CFG.start = true;
                //window.addEventListener('devicemotion', _this.motionHandler, false); //监听摇动
                this.tree.stop();
                this.gameover(result.message);
            }
        },
        getPrize: function() { //验证领取奖品信息
            var mobile = this.fnmobile();
            if (!mobile) {
                return false;
            }
            var codeTxt = $("#codeTxt");
            if (codeTxt && codeTxt.get(0)) {
                codeTxt = codeTxt.val();
            }
//            if (back.response.responseBody.getStatus == '0' && back.response.responseBody.userStatus == '0') {
//                //alert("请输入短信验证码！");
//                $(".dialog.win .getCode-btn").show();
//                $(".dialog.win .code").show();
//                $(".dialog.win .getCode-btn").bind("click", this.evtClick);
//                return false;
//            }

            if (!this.smsCode || this.smsCode && this.smsCode != codeTxt) {
                alert("输入的验证错误，请重新输入");
                return false;
            }
            this.takePrize({ SMSCode: this.smsCode, mobile: mobile, prizeId: this.resultjson.prizeId, useFlag: this.resultjson.useFlag });

        },
        takePrize: function(obj) { //领取奖品
            var body = {
                prizeId: obj.prizeId, //中奖编号
                mobile: obj.mobile, //手机号
                SMSCode: obj.SMSCode, //验证码
                useFlag: obj.useFlag
            };
//            var header = new RequestHeader(1, "MSGetLotteryPrize", 1, "");
//            var request = packRequest(body, header);

            //callService
            var _this = this;
            this.request(body, "MSGetLotteryPrize", function(back) {
                if (!back) {
                    return false;
                }
                //没有信息
                if (back.response.responseHeader.returnStatus == '0') {
                    alert('亲！你的奖品未取成功，请重新领取哦！');
                    return false;
                }


                if (back.response.responseBody.getStatus == '1') {
                    alert("奖品领取成功");
                    _this.smsCode = "";
                    $(".dialog.win .getCode-btn").hide();
                    $(".dialog.win .code").hide();
                    $('.result-modal,.dialog').hide();
                    $(".dialog.win .getCode-btn").unbind("click", this.evtClick);
                    $('.dialog.win').find('.btn.orange').unbind("click", this.getprize);
                }
            });
//            if (!back) {
//                return false;
//            }
//            //没有信息
//            if (back.response.responseHeader.returnStatus == '0') {
//                alert('亲！你的奖品未取成功，请重新领取哦！');
//                return false;
//            }
//
//
//            if (back.response.responseBody.getStatus == '1') {
//                alert("奖品领取成功");
//                this.smsCode = "";
//                $(".dialog.win .getCode-btn").hide();
//                $(".dialog.win .code").hide();
//                $('.result-modal,.dialog').hide();
//                $(".dialog.win .getCode-btn").unbind("click", this.evtClick);
//                $('.dialog.win').find('.btn.orange').unbind("click", this.getprize);
//            }
        },

        MyRound: function(array) { //随机
            var r = Math.round(Math.random() * (array.length - 1));
            return array[r];
        },

        error: function(message) { //出错
            this.tree.stop();
            $('.dialog.error').show().find('p').html(message);
        },

        gameover: function(title, content) { //结束
            $('.gameover.dialog').children('div').children('h2').html(title);
            $('.gameover.dialog').children('div').children('p').html(content);
            if (!content) {
                $('.gameover.dialog').children('div').css('top', 112);
            } else {
                $('.gameover.dialog').children('div').css('top', 86);
            }
            $('.result-modal,.dialog.gameover').show();
        },
        bind: function() {
            var _this = this;
            this.getprize = function() {
                _this.getPrize();
            };
            this.evtClick = function() {
                var nd = $(this);
                var mobile = _this.fnmobile();
                if (!mobile) {
                    return false;
                }
                var body = { mobile: mobile, condition: '', SMSCodeType: 'IICIPBCC00035' };
                //            var header = new RequestHeader(1, "BCCGetSMSCode", 1, 1);//accessToken未确定
                //            var request = packRequest(body, header);
                //            var response = callService("BCCGetSMSCode", request);
                //var response =
                _this.request(body, "BCCGetSMSCode", function (response) {
                    if (!response) {
                        return;
                    }
                    _this.smsCode = response.response.responseBody.code;
                });
                var my_time = 60;
                nd.addClass("disable");
                $(".dialog .getCode-btn").unbind("click", _this.evtClick);
                nd.text(_this.format(my_time));
                var my_interval = setInterval(function () {
                    my_time -= 1;
                    nd.text(_this.format(my_time));
                    if (my_time <= 0) {
                        clearInterval(my_interval);
                        nd.removeClass("disable");
                        nd.text("获取验证码");
                        $(".dialog .getCode-btn").bind("click", _this.evtClick);
                    }
                }, 1000);
            };
            //关闭弹窗

            $('.close,.cancel').bind('click', function() {
                $('.result-modal,.dialog').hide();
                document.ontouchmove = null;
            });

            if (this.CFG.promotionTitle) {
                $("title").html(this.CFG.promotionTitle);
            }
            //摇动事件
            this.motionHandler = function(evt) {
                _this.deviceMotionHandler(evt);
            };
            //var evttype = "devicemotion";//"devicemotion";


            if (_this.CFG.promotionTitle) {
                _this.CFG.descriptionTitle = '"' + _this.CFG.promotionTitle + '"';
            }

//            $(document).bind("click",this.motionHandler); //测试
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', this.motionHandler, false); //监听摇动
            } else {
                alert('你的手机弱爆了，不支持重力感应，o(>﹏<)o');
            }
            //console.log($('.popup-slidedn'))
            $('.popup-slidedn').bind('click', function() { //下一页//touchstart
                window.removeEventListener("devicemotion", _this.motionHandler); //解除监听摇动
                $('.main').slideUp(1000);
                $('.main1').slideDown(1000);
            });
            $('.popup-slideup').bind('click', function() { //上一页//touchstart
                window.addEventListener("devicemotion", _this.motionHandler, false); //监听摇动
                $('.main').slideDown(1000);
                $('.main1').slideUp(1000);

            });
        }

    };
    YW.extend("shakeTree", shakeTree);
    tree=new YW.shakeTree();
});

/*----------   2015-10-16 17:26:54   ----------*/