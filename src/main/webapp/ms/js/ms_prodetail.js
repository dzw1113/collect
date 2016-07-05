/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'], function (k, v) {
    $['is' + v] = function (obj) {
        if (v == "Window") {
            return obj != null && obj == obj.window;
        } else {
            return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
        }
    }
});
(function(){

	function Prodetail(){
        this.CFG={
            promotionId:YW.request.promotionid||"890030"////抽奖编号
        }
        this.pageLoad(this.CFG);
        this.bind();
	}
	Prodetail.prototype={
        formatobj:function(obj){//去除空属性
            var ret={}
            for(var i in obj){
                if(obj[i]!="" && obj[i]!=null && obj[i]!=undefined){
                    ret[i]=obj[i];
                }
            }
            return ret;
        },
        request: function (body, serviceCode,callBack) {
            var header = new RequestHeader(serviceCode,null, null,"","PAYMENT","P-H5");
            body=this.formatobj(body);
            var request = packRequest(body, header);
            //var back =
            callService(serviceCode, request, function (back) {
                    //没有信息
                    if (!back) {
                        //alert("获取数据错误！");
                        $('.result-modal').show();
                        this.error("获取数据错误！")
                        document.ontouchmove = function (event) {
                            event.preventDefault();
                        }
                        return false;
                    } else {
                        if (back.response.responseHeader.returnStatus == '0') {
                            $('.result-modal').show();
                            this.error(back.response.responseHeader.returnDesc)
                            document.ontouchmove = function (event) {
                                event.preventDefault();
                            }
                            //alert(back.response.responseHeader.returnDesc);
                            return false;
                        }
                    }
                    if ($.isFunction(callBack)) {
                        callBack(back);
                    };
                    //return back;
                });
//            //没有信息
//            if (!back) {
//                //alert("获取数据错误！");
//                $('.result-modal').show();
//                this.error("获取数据错误！")
//                document.ontouchmove = function (event) {
//                    event.preventDefault();
//                }
//                return false;
//            } else {
//                if (back.response.responseHeader.returnStatus == '0') {
//                    $('.result-modal').show();
//                    this.error(back.response.responseHeader.returnDesc)
//                    document.ontouchmove = function (event) {
//                        event.preventDefault();
//                    }
//                    //alert(back.response.responseHeader.returnDesc);
//                    return false;
//                }
//            }
//            return back;
        },
        pageLoad: function (CFG) {
            var body = {
                promotionId:CFG.promotionId||""//"890030"              
            }
            var _this = this;
            //var back =
            this.request(body, "MSQueryPrmotionDetailWithPrize", function (back) {
                _this.loadData(back && back.response.responseBody || {});
            });
            
//            if (!back) {
//                return;
//            }
//            this.loadData(back && back.response.responseBody||{});
        },
        loadData: function (json) { //加载页面 json为当前抽奖详情信息
            //tmp_jsondata.response.responseBody.promotionList
            if (json && $.isString(json)) {
                tmp_loadjson = $.parseJSON(json);
            } else {
                tmp_loadjson = json || {};
            }
            loadjson = tmp_loadjson.promotionList&&tmp_loadjson.promotionList[0];
            this.banner(loadjson);
            this.dateitem(loadjson);
            this.promotionTitle(loadjson);
            this.promotionContent(loadjson);
            this.promotionRule(loadjson);
//            this.prizeList(loadjson.prizeList); //奖品列表
//            this.description(loadjson.promotionContent,loadjson.promotionRule); //规则
        },
        banner:function(json){
            var html="";
            if(json){
                var img=json.imageUrl+'L'+json.promotionId+'.png';
                html='<img src="'+img+'">';
            }
            
            $(".head-banner .item-img").html(html);
        },
        dateitem:function(d){//活动日期
            var html="";
            if(d){
                if(loadjson.startDate && loadjson.endDate){
                    html='<span class="spancont">活动日期：'+this.formatDate(loadjson.startDate)+'至'+this.formatDate(loadjson.endDate)+'</span>';
                }
            }
            

            $(".date-item").html(html);
            
        },
        promotionTitle:function(t){//活动标题
            var html="";
            if(t){
                html=t.promotionTitle;
            }

            $(".item-title").html(html);
        },
        promotionContent:function(t){//活动内容
            var html="";
            if(t){
                if(t.promotionContent){
                    html=t.promotionContent+'特举行物业费大酬宾活动！满100减50，你妈喊你缴物业费啦亲爱滴小伙伴们，值此中秋之际';
                }
            }
            var nd=$("#promotion-bd");
            nd.find("#promotionContent").html(html);
            if(nd.height()<(nd.find("#promotionContent").height()-10)){
                nd.removeClass("describe");
            	nd.addClass("expand");
            	nd.find(".more").bind("click",function(){
                    nd.removeClass("expand");
            	});
            }
        },
        promotionRule:function (text) {//添加活动规则
            var html = "";
            if(text){
                var text1=text.promotionRule;
                if(text1){
                    $.each(text1.split('\\n'), function(i, v2) {
                        html = html + '<li>' + v2 + '</li>';
                    });
                    html = '<ul class="list-tab">' + html + '</ul>';
                }
            }
            $('.tab-cont-box').html(html);
        },
        formatDate:function(txt){//格式化日期时间
            if(!txt){
                return "";
            }
            var ret;
            var d=/(^\d{4})+(\d{2})+(\d{2})+$/.exec(txt);
            var arr;
            if(d.length>4){
                d.splice(0,1);
                var t1=d.slice(0,3);
                var t2=d.slice(3)
                ret=new Date(t1.join("/")+" "+t2.join(":")).format("yyyy-MM-dd hh:mm");
            }else if(d.length>3){
                d.splice(0,1);
                var t1=d.slice(0,3);
                ret=new Date(t1.join("/")).format("yyyy-MM-dd");
            }
            return ret;
        },
        error: function (message) {//出错
            $('.dialog.error').show().find('p').html(message);
        },
        bind:function(){
            $('.close,.cancel').bind('click', function () {
                $('.result-modal,.dialog').hide();
                document.ontouchmove = null;
            });
        }
    }
    YW.extend("Prodetail", Prodetail);
})();
$(function(){
    new YW.Prodetail();
});


/*----------   2015-10-16 14:14:07   ----------*/