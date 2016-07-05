/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function(w){
    var Pay=function(elm){
        if(!elm){
            return;
        }
        this.elm=$(elm);
        this.CFG={
            'cid':YW.request.cid||"",//小区编号
            'cidName':YW.request.cidname||'',//小区名称
            'chargeNo':YW.request.chargeno||'',//费项编号
            'chargeName':YW.request.chargename||'',//费项名称
            'accessToken':YW.request.accesstoken||''
        };
        this.pageLoad();
    };
    Pay.prototype={
        formatobj:function(obj){//去除空属性
            var ret={};
            for(var i in obj){
                if(obj[i]!=="" && obj[i]!==null && obj[i]!==undefined){
                    ret[i]=obj[i];
                }
            }
            return ret;
        },
        request: function(body, serviceCode,callback) {
            var header = new RequestHeader(serviceCode,"", "",this.CFG.accessToken,"PAYMENT","P-H5");
            body=this.formatobj(body);
            var request = packRequest(body, header);
            var back = callService(serviceCode, request,callback);
            //没有信息
            if (!back) {
                //alert("获取数据错误！");
                $('.result-modal').show();
                this.error("获取数据错误！");
//                document.ontouchmove = function (event) {
//                    event.preventDefault();
//                }
                return false;
            } else {
                if (back.response.responseHeader.returnStatus == '0') {
                    $('.result-modal').show();
                    this.error(back.response.responseHeader.returnDesc);
//                    document.ontouchmove = function (event) {
//                        event.preventDefault();
//                    }
                    //alert(back.response.responseHeader.returnDesc);
                    return false;
                }
            }
            return back;
        },
        error: function (message) {//出错
//            document.ontouchmove = function (event) {
//                event.preventDefault();
//            };
            $('.dialog.error').show().find('p').html(message);
        },
        pageLoad:function(){
            this.setConter();
            var body = {
                "chargeNo":this.CFG.chargeNo,
                "plotId":this.CFG.cid,
                "shippingType": "0"
            };
            var back = this.request(body, "BSPayQueryPreInfo",this.getData);
            if (!back) {
                return;
            }
        },
        formatMn:function (num) {  
            num = num.toString().replace(/\$|\,/g,'');  
            if(isNaN(num))  
            num = "0";  
            sign = (num == (num = Math.abs(num)));  
            num = Math.floor(num*10+0.50000000001);  
            cents = num%10;  
            num = Math.floor(num/10).toString();  
            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)  
            num = num.substring(0,num.length-(4*i+3))+','+  
            num.substring(num.length-(4*i+3));  
            return (((sign)?'':'-') + num + '.' + cents);  
        },
        formatRule:function(n,t){
            var ret="";
            if(t==1){
                ret='预缴金额'+this.formatMn(n)+'元';
            }else{
                ret='预缴'+n+'个月';
            }
            return ret;
        },
        formatRate:function(n,t){
            var ret="";
            if(t==1){
                if(n.shippingRate){
                   ret=this.formatMn(n.shippingRate*10)+'折'; 
                }
            }else{
                if(n.shippingAmount){
                    ret=this.formatMn(n.shippingAmount)+'元';
                }
            }
            return ret;
        },
        setConter:function(){
//            {
//            'cid':YW.request.cid||"",//小区编号
//            'cidName':YW.request.cidname||'',//小区名称
//            'chargeNo':YW.request.chargeno||'',//费项编号
//            'chargeName':YW.request.chargename||''//费项名称
//        }
            var _this=this;
            var nd=this.elm.find(".conter-hd-box .box-bd");
            nd.html('在'+this.CFG.cidName+'小区预缴'+this.CFG.chargeName+'，将享受优惠如下：');
            var imgnd=this.elm.find("#car-img");
            if(this.CFG.chargeName=="物业费"){
                imgnd.html('<img src="img/bs_Advance/bs_Advance-img01.png">');
            }
            this.getData=function(data){
                //alert("dsafsaf")
                var nd1=_this.elm.find(".body-table .table-box");
                if(!nd1){
                    return;
                }
                var html="";
                var list=data.response.responseBody.shippingList;
                if(list && list.length>0){
                    $.each(list,function(k,v){
                        html=html+'<tr>'+
                                '<td><span>'+_this.formatRule(v.shippingRule,v.shippingWar)+'</span></td>'+
                                '<td><span class="fold">'+_this.formatRate(v,v.shippingForm)+'</span></td>'+
                            '</tr>';
                    });
                }
                html='<table>'+
                        '<tr>'+
                            '<td><span>优惠规则</span></td>'+
                            '<td><span>优惠金额/优惠折扣</span></td>'+
                        '</tr>'+
                        html+
                    '</table>';
                nd1.html(html);
            };
        }
    };
    w.Pay=Pay;
})(window);
$(function(){
    new Pay($("#bs-pay").get(0));
});

/*----------   2015-10-16 14:14:07   ----------*/