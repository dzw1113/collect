/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 16:22:36 *
*******************************/

$(function () {
    function Download() {
        this.bind();
        
        if (YW.Browser.device().weixin) {
            $(".download").bind("click",this.weixinalert);
            //$(".download").attr("href", "https://itunes.apple.com/cn/app/zhong-guo-yin-xing-shou-ji/id399608199?mt=8");
        } else if (YW && YW.Browser && YW.Browser.device().ios) {
            $(".download").attr("href", "https://itunes.apple.com/cn/app/ye-zhu-bei-bei/id1032934267?mt=8");
            //window.location.href = "https://itunes.apple.com/cn/app/zhong-guo-yin-xing-shou-ji/id399608199?mt=8";
        } else{
            $(".download").attr("href", "http://112.74.65.244/ifs/client/yezhubeibei.apk");
        }
    }
    Download.prototype= {
        bind: function () {
            var _this=this;
            $('.close,.cancel').bind('click', function () {
                $('.result-modal,.dialog').hide();
                document.ontouchmove = null;
            });
            this.weixinalert=function(){
                document.ontouchmove = function (event) {
                    event.preventDefault();
                }
                $('.result-modal').bind('click', _this.resultModal);
                $('.dialog.weixinalert,.result-modal').show();
            }
            this.resultModal=function () {
                $('.result-modal,.dialog').hide();
                $('.result-modal').unbind('click', _this.resultModal);
                document.ontouchmove = null;
            }
        }
        
    }
    new Download();
    new MobileSlide($(".slide-content").get(0));
});

/*----------   2015-10-16 16:22:36   ----------*/