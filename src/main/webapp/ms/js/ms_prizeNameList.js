/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
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

$(function() {
    var shakePrize = function(elm) {
        if (!elm) {
            return;
        }
        var _this = this;
        this.elm = $(elm);
        this.list = this.elm.find("ul.list");
        this.pageNum = '1'; //当前页
        this.pageSize = '10'; //每页几条
        this.custNo = YW.request.custno;
        this.pid = YW.request.pid || null;
        this.pageLoad();
        var iscroll = new YW.Iscroll($("#namelist-content").get(0), {
            upelm: $("#updrag").get(0),
            dnelm: $("#dndrag").get(0),
            callback: {
                endupdrag: function () { //向下拉回调
                    window.location.reload();
                },

                enddndrag: function() { //向上拉回调
                    _this.pageLoad();
                }
            }
        });
        if (YW.request.isinapp != 1) { //显示标题
            $("#namelist-content .namelist-content-hd").show();
        }
        this.bind();
    };
    shakePrize.prototype = {
        formatobj: function(obj) { //去除空属性
            var ret = {};
            for (var i in obj) {
                if (obj[i] !== "" && obj[i] !== null && obj[i] !== undefined) {
                    ret[i] = obj[i];
                }
            }
            return ret;
        },
        request: function(body, serviceCode, callBack) {
            var _this = this;
            var header = new RequestHeader(serviceCode, this.pid, this.custNo, "", "PAYMENT", "P-H5");
            body = this.formatobj(body);
            var request = packRequest(body, header);
            callService(serviceCode, request, function(back) {
                //没有信息
                if (!back) {
                    //alert("获取数据错误！");
                    $('.result-modal').show();
                    _this.error("获取数据错误！");
                    //                document.ontouchmove = function (event) {
                    //                    event.preventDefault();
                    //                }
                    return false;
                } else {
                    if (back.response.responseHeader.returnStatus == '0') {
                        $('.result-modal').show();
                        _this.error(back.response.responseHeader.returnDesc);
                        //                    document.ontouchmove = function (event) {
                        //                        event.preventDefault();
                        //                    }
                        //alert(back.response.responseHeader.returnDesc);
                        return false;
                    }
                }
                if ($.isFunction(callBack)) {
                    callBack(back);
                }
            });
//            //没有信息
//            if (!back) {
//                //alert("获取数据错误！");
//                $('.result-modal').show();
//                this.error("获取数据错误！")
////                document.ontouchmove = function (event) {
////                    event.preventDefault();
////                }
//                return false;
//            } else {
//                if (back.response.responseHeader.returnStatus == '0') {
//                    $('.result-modal').show();
//                    this.error(back.response.responseHeader.returnDesc);
////                    document.ontouchmove = function (event) {
////                        event.preventDefault();
////                    }
//                    //alert(back.response.responseHeader.returnDesc);
//                    return false;
//                }
//            }
//            return back;
        },
        error: function(message) { //出错
            document.ontouchmove = function(event) {
                event.preventDefault();
            };
            $('.dialog.error').show().find('p').html(message);
        },
//        request: function (body, serviceCode) {
//            var header = new RequestHeader(this.pid, serviceCode, null, this.custNo,"PAYMENT");
//            var request = packRequest(body, header);
//            var back = callService(serviceCode, request);
//            //没有信息
//            if (!back) {
//                alert("获取中奖名单接口出错！");
//                return false;
//            } else {
//                if (back.response.responseHeader.returnStatus == '0') {
//                    alert(back.response.responseHeader.returnDesc);
//                    return false;
//                }
//            }
//            return back;
//        },
        formatDate: function(txt) { //格式化日期时间
            if (!txt) {
                return "";
            }
            var ret;
            var d = /(^\d{4})+(\d{2})+(\d{2})+(\d{2})+(\d{2})+(\d{2})$/.exec(txt);
            var arr;
            if (d.length > 4) {
                d.splice(0, 1);
                var t1 = d.slice(0, 3),
                    t2 = d.slice(3);
                ret = new Date(t1.join("/") + " " + t2.join(":")).format("yyyy-MM-dd hh:mm");
            }
            return ret;
        },
        getNameNist: function(json) { //获取数据
            var loadjson;
            if (json && $.isString(json)) {
                loadjson = $.parseJSON(json);
            } else {
                loadjson = json || {};
            }
            if (!loadjson.recordList) {
                return;
            }
            this.update(loadjson.recordList);
        },
        formatmobile: function(n) { //格式化手机号码
            if (!n) {
                return "";
            }
            return n.replace(n.substr(3, 5), '*****');
        },
        update: function(data) { //更新数据
            var html = this.list.html();
            var _this = this;
            $.each(data, function(k, v) {
                html = html + '<li class="list-item">' +
                    '<div class="item-mobile">' + _this.formatmobile(v.mobile) + '</div>' +
                    '<div class="item-goods">' +
                    '<div class="left">' +
                    '<span class="">获得</span><span class="red">' + v.prizeName + "：" + v.prizeDesc + '</span>' +
                    '</div>' +
                    '<div class="right"><span>' + _this.formatDate(v.dateTime) + '</span></div>' +
                    '</div>' +
                    '</li>';
            });

            this.list.html(html);
        },
        pageLoad: function() {
            var _this = this;
            var body = {
                promotionId: YW.request.promotionid || "890030",
                pageNum: this.pageNum, //当前页
                pageSize: this.pageSize //每页几条
            };
            this.request(body, "MSQueryWinRecords", function(back) {
                if (!back) {
                    return;
                }
                _this.getNameNist(back.response.responseBody);
                _this.pageNum = (_this.pageNum * 1 + 1) + ""; //当前页
            });
//            if (!back) {
//                return;
//            }
//            this.getNameNist(back.response.responseBody);
//            this.pageNum=(this.pageNum*1+1)+"";//当前页
        },
        bind: function () {
            //alert("dsfsafds")
            $('.close,.cancel').bind('click', function () {
                $('.result-modal,.dialog').hide();
                document.ontouchmove = null;
            });
        }
    };


    var listobj = new shakePrize($("#namelist-content").get(0));
});

/*----------   2015-10-16 14:14:07   ----------*/