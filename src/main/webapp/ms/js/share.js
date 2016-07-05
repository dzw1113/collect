/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

$(function(){
//    'url' : location.href,
//    'desc' : '',/*默认分享理由(可选)*/
//    'summary' : '',/*分享摘要(可选)*/
//    'title' : '',/*分享标题(可选)*/
//    'site' : '',/*分享来源 如：腾讯网(可选)*/
        
        
        
        //location.href,desc:option.desc,summary:option.summary,title:option.title,site:option.site,pics:option.pics
    
    //http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://www.aaa.com&title=wewewewewewewe&pics&summary=21341234312431242314
    
    
//    var _t = encodeURI('${(activity.intro)!}');//'${(activity.intro)!}'这是取得Action穿过来的值，如果想取当前标题改为document.title  
//var _url = encodeURI(document.location);  
//var _appkey = encodeURI("appkey");//你从腾讯获得的appkey  
//var _pic = encodeURI('');//（列如：var _pic='图片url1|图片url2|图片url3....）  
//var _site = '';//你的网站地址  
//var _u = 'http://v.t.qq.com/share/share.php?title='+_t+'&url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pic;  
//window.open( _u,'转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );  
//}  
    var Share=function(elm,obj){
        if (!elm) {
            return;
        }
        var indexobj = YW.addObj({
            attr: "data-action" //对其进行轮播的目标列表的class名
        }, obj || {});
        if(indexobj.objName){
            this.indexobj = YW.addObj(indexobj, window[indexobj.objName]);
        }else{
            this.indexobj=indexobj;
        }
        this.elm = $(elm);
        this.shareNds=this.elm.find("[data-action]");
        $.each(this.shareNds,function(k,v){
            v.dataName=$(v).attr("data-action");
        });
        //console.log(this.shareNds.get(0).dataName)
    }
    Share.prototype={
        shareUrl:function(name){//分享到哪里去
            var obj={
                qqzone:'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',//QQ空间
                friendround:""//微信好友
            };
            return obj[name];
        },
        sharData:function(name){//分享的参数
            
        },
        postData:function(name){
            var url=this.shareUrl(name);
            if(!url){
                return;
            }
            var _t = encodeURI('名称');
            var _url=encodeURI(document.location);//取得当前页地址
            var _appkey = encodeURI("appkey");//你从腾讯获得的appkey
             window.location.href=url+"?"+_t+"&url"+_url+'&appkey='+_appkey;
//                var _t = encodeURI('${(activity.intro)!}');//'${(activity.intro)!}'这是取得Action穿过来的值，如果想取当前标题改为document.title  
//var _url = encodeURI(document.location);  
//var _appkey = encodeURI("appkey");//你从腾讯获得的appkey  
//var _pic = encodeURI('');//（列如：var _pic='图片url1|图片url2|图片url3....）  
//var _site = '';//你的网站地址  
//var _u = 'http://v.t.qq.com/share/share.php?title='+_t+'&url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pic;  
//window.open( _u,'转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );  
//}
        },
        bind:function(){
            var _this=this;
            this.shareNds&&this.shareNds.bind('click',function(){
                //_this.postData(this.dataName);
            })
        }
    }
    YW.extend("Plug.Share",Share);
    new YW.Plug.Share($("#plug-share").get(0),{});
})

/*----------   2015-10-16 14:14:07   ----------*/