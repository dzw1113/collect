/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

$(function () {
    function GetCode(o,obj) {
        if (!o) {
            return;
        }
        this.indexobj = YW.addObj({
            time: 60//重发时间
        }, obj || {});
        o.reset();
        this.form = $(o);
        this.codeNd = this.form.find(".getcodedir");
        this.time = this.indexobj.time;
        this.bind();
        this.mobile = this.form.find(".mobile");
//        this.mobile.val(null);
        this.smscode = this.form.find(".smscode");
//        this.smscode.val("");
        this.unifiedpassword = this.form.find(".unifiedpassword");
//        this.unifiedpassword.val(null);
        this.invitemobile = YW.request["invitemobile"];
        this.invitecertno = YW.request["invitecertno"];
        this.inviteemail = YW.request["inviteemail"];
    };
    GetCode.prototype = {
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
            var header = new RequestHeader(serviceCode,"", "","","PAYMENT","P-H5");
            body=this.formatobj(body);
            var request = packRequest(body, header);
            var _this = this;
            //var back =
            callService(serviceCode, request, function (back) {
                if (!back) {
                    //alert("获取数据错误！");
                    //$('.result-modal').show();
                    _this.error("获取数据错误！");
                    //                document.ontouchmove = function (event) {
                    //                    event.preventDefault();
                    //                }
                    return false;
                } else {
                    if (back.response.responseHeader.returnStatus == '0') {
                        //$('.result-modal').show();
                        _this.error(back.response.responseHeader.returnDesc);
                        //                    document.ontouchmove = function (event) {
                        //                        event.preventDefault();
                        //                    }
                        //alert(back.response.responseHeader.returnDesc);
                        return false;
                    }
                };
                if ($.isFunction(callBack)) {
                    callBack(back);
                };
            });
            //没有信息
//            if (!back) {
//                //alert("获取数据错误！");
//                $('.result-modal').show();
//                this.error("获取数据错误！");
////                document.ontouchmove = function (event) {
////                    event.preventDefault();
////                }
//                return false;
//            } else {
//                if (back.response.responseHeader.returnStatus == '0') {
//                    $('.result-modal').show();
//                    this.error(back.response.responseHeader.returnDesc)
////                    document.ontouchmove = function (event) {
////                        event.preventDefault();
////                    }
//                    //alert(back.response.responseHeader.returnDesc);
//                    return false;
//                }
//            }
//            return back;
        },
        success: function() {//注册成功浮层
            document.ontouchmove = function (event) {
                event.preventDefault();
            }
            $('.result-modal').show();
            $('.dialog.success').show();//.find('p').html(message);
        },
        error: function (message) {//出错
            document.ontouchmove = function (event) {
                event.preventDefault();
            }
            $('.result-modal').show();
            $('.dialog.error').show().find('p').html(message);
        },
        format: function (n) {
            if (n < 10) {
                return '0' + n + 's后重新获取';
            } else {
                return n + 's后重新获取';
            }
        },
        fnmobile: function () {//验证手机号
            if (this.mobile && this.mobile.get(0)) {
                if (this.mobile.val()) {
                    if (!/^1\d{10}$/.test(this.mobile.val())) {
                        this.error("手机号由11位数字组成，第一个数字必须为1");
                        return false;
                    }
                } else if (!this.mobile.val()) {
                    this.error('手机号不能为空');
                    return false;
                }
                return this.mobile.val();
            } else {
                this.error('未找到手机号输入框');
                return false;
            }
        },
        attestation: function () {//验证短信验证码和密码
            var mb = this.fnmobile();
            if (!mb) {
                return false;
            }
            if (this.smscode && this.smscode.get(0)) {
                if (this.smscode.val()) {
                    if (!/^[a-zA-Z0-9]{6}$/.test(this.smscode.val())) {
                        this.error("短信验证码由6位数字或字母组成，不能包含特殊符号");
                        return false;
                    }
                } else if (!this.smscode.val()) {
                    this.error('短信验证码不能为空');
                    return false;
                }
            } else {
                this.error('未找到短信验证码输入框');
                return false;
            }

            if (this.unifiedpassword && this.unifiedpassword.get(0)) {
                if (this.unifiedpassword.val()) {
                    if (!/^[a-zA-Z0-9]{6,20}$/.test(this.unifiedpassword.val())) {
                        this.error("密码由6-20位数字或字母组成，不能包含特殊符号");
                        return false;
                    }
                } else if (!this.unifiedpassword.val()) {
                    this.error('密码不能为空');
                    return false;
                }
                return true;
            } else {
                this.error('未找到密码码输入框');
                return false;
            }

        },
        bind: function () {
            var time = this.time;
            var smsCode = "";
            var _this = this;
            
            //关闭弹窗
            
            $('.close,.cancel').bind('click', function () {
                $('.result-modal,.dialog').hide();
                document.ontouchmove = null;
            });
            
            
            var evtClick = function () {
                var nd = $(this);
                var mobile = _this.fnmobile();
                if (!mobile) {
                    return false;
                }
                // 获取验证码  
                var body = {mobile:mobile,condition:'02',SMSCodeType:'IICIPBCC00023'};
//        		var header = new RequestHeader(1, "BCCGetSMSCode", 1, 1,"PAYMENT");//accessToken未确定
//                var request = packRequest(body, header);
//                var response = callService("BCCGetSMSCode", request);
                //var back =
                _this.request(body, "BCCGetSMSCode", function (back) {
                    if (back) {
                        smsCode = back.response.responseBody.code;
                    } else {
                        return false;
                    }
                });
                nd.addClass("disable");
                _this.codeNd.unbind("click", evtClick);
                nd.text(_this.format(_this.time));
                _this.interval = setInterval(function () {
                    _this.time -= 1;
                    nd.text(_this.format(_this.time));
                    if (_this.time <= 0) {
                        clearInterval(_this.interval);
                        nd.removeClass("disable");
                        _this.time = time;
                        nd.text("获取验证码");
                        _this.codeNd.bind("click", evtClick);
                    }
                }, 1000);
            }

            this.codeNd.bind("click", evtClick);
            this.form.bind('submit', function (evt) {
                evt.preventDefault();
                var attestation = _this.attestation();
                if (!attestation) {
                    return false;
                }
             // 提交信息
              var inputSmsCode= $("#smsCode").val();
                if (smsCode == inputSmsCode) {
                    var body = {};
                    body.mobile = $("#mobile").val();
                    body.smsCode = $("#smsCode").val();
                    body.unifiedPassword = md5.hex_md5($("#unifiedPassword").val());
                    if (_this.invitemobile) {
                        body.inviteMobile = _this.invitemobile;
                    }
                    if (_this.invitecertno) {
                        body.inviteCertNo = _this.invitecertno;
                    }
                    if (_this.inviteemail) {
                        body.inviteEmail = _this.inviteemail;
                    }
//                _this.invitemobile && body.inviteMobile=_this.invitemobile;
//                _this.invitecertno && body.inviteCertNo=_this.invitecertno;
//                _this.inviteemail &&  body.inviteEmail=_this.inviteemail;

//        		var header = new RequestHeader(1, "USRegister", 1, 1,"PAYMENT");//accessToken未确定
//                var request = packRequest(body, header);
//                var response = callService("USRegister", request);
                    //var back =
                    _this.request(body, "USRegister", function (back) {
                        if (!back) {
                            return false;
                        }
                        if (back) {
                            var status = back.response.responseHeader;
                            //alert(status.returnDesc);
        	                if(status.returnStatus==1){
        	                    _this.success(status.returnDesc);
        	                }else{
        	                    _this.error(status.returnDesc); //alert("注册失败！");
        	                }
                            //window.close();
                        }
                    });
                } else {
                    //alert("dfadsf");
                    
                    _this.error("验证码有误！");
                }
//                if(response){
//                    var status=	response.response.responseHeader;
//                    alert(status.returnDesc);
////	                if(status.returnStatus==1){
////	                	alert("注册成功！");
////	                }else{
////	                	alert("注册失败！");
////	                }
//                    window.close()
//                }else{
//                	alert("注册接口有误！");
//                }
//              } else{
//            	  alert("验证码有误！");
//              }


//                window.sendService && sendService('USRegister', _this.form.get(0), function (responseHeader, responseBody) {
//                    if (responseHeader && !responseHeader.returnStatus == 1) {
//                        if (typeof responseHeader.returnDesc != "undefined") {
//                            alert(responseHeader.returnDesc);
//                        }
//                        return false;
//                    }
//                    return true;
//                });
                    return false;
            });
        }
    }
    YW.extend('Reg.GetCode', GetCode);
    new YW.Reg.GetCode($("#reg-form").get(0));
})



// (function () {
//     var regmod=angular.module('reg-mod', []);
//     regmod.controller('getcodectrl', ['$scope','$http', function($scope,$http){
//       $scope.time=5;
//       $scope.request = (function(){
//           var url = document.location.href.toString();
//           var u = url.split("?");
//           if(typeof(u[1]) == "string"){
//               u = u[1].split("&");
//               var get = {};
//               for(var i in u){
//                   var j = u[i].split("=");
//                   get[j[0].toLowerCase()] = j[1].toLowerCase();
//               }
//               return get;
//           } else {
//               return {};
//           }
//       })();
//       $scope.fnmobile=function(scope){
//         if(scope.mobile){
//             if(!/^1\d{10}$/.test(scope.mobile)){
//               alert("手机号由11位数字组成，第一个数字必须为1");
//               return false;
//             }
//           }else if(!scope.mobile){
//             alert('手机号不能为空');
//             return false;
//           }
//           return true;
//       }
//       $scope.fnAttestation=function(scope){

//           var mb=scope.fnmobile(scope)
//           if(!mb){
//             return false;
//           }
//           if(scope.smsCode){
//             if(!/^[a-zA-Z0-9]{6}$/.test(scope.smsCode)){
//               alert("短信验证码由6位数字或字母组成，不能包含特殊符号");
//               return false;
//             }
//           }else if(!scope.smsCode){
//             alert('短信验证码不能为空');
//             return false;
//           }

//           if(scope.unifiedPassword){
//             if(!/^[a-zA-Z0-9]{6,20}$/.test(scope.unifiedPassword)){
//               alert("密码由6-20位数字或字母组成，不能包含特殊符号");
//               return false;
//             }
//           }else if(!scope.unifiedPassword){
//             alert('密码不能为空');
//             return false;
//           }
//           return true;
//       }
//       $scope.fnBCCGetSMSCode=function(url,data){
//         var axj=$http.post(url,data),ret;
//         axj.success(function(data){
//           ret=data;
//         });
//         return ret;
//       }
//     }])


//     regmod.directive('getcodedir', function(){
//       var format=function (n) {
//            if (n < 10) {
//                return '0' + n + 's后重新获取';
//            } else {
//                return n + 's后重新获取';
//            }
//        }
//       return {
//         restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
//         link: function ($scope, iElm) {
//           var time=$scope.time;
//           var evt=function() {
//                 var mb=$scope.fnmobile($scope)
//                 if(!mb){
//                   return false;
//                 }
//                 iElm.addClass("disable");
//                 $scope.fnBCCGetSMSCode('/物业贝贝/html/json.json',{//取验证码
//                     smsCodeType:'IICIPBCC00023',
//                     mobile:$scope.mobile//手机号
//                 });

//                 iElm.text(format($scope.time));

//                 var interval=setInterval(function(){
//                   iElm.unbind('click', evt);
//                   $scope.time-=1;
//                   iElm.text(format($scope.time));
//                   if($scope.time<=0){
//                     iElm.removeClass("disable");
//                     clearInterval(interval);
//                     iElm.text("获取验证码");
//                     iElm.bind('click', evt);
//                     $scope.time=time;
//                   }
//                 },1000);

//             }
//             iElm.bind('click', evt);
//         }
//       };
//     });

//   regmod.directive('submit', function(){
//       return {
//           restrict: 'AE',
//           link: function ($scope, iElm) {
//               iElm.bind('submit',function(){
//                 var attestation=$scope.fnAttestation($scope);
//                 if(!attestation){
//                   return false;
//                 }
//                 $scope.fnBCCGetSMSCode('/物业贝贝/html/json.json',{//提交
//                   verifyChannel:'01',// 验证渠道
//                   mobile:$scope.mobile,//手机号
//                   SMSCode:$scope.smsCode,//短信验证码
//                   unifiedPassword:$scope.unifiedPassword,//密码
//                   inviteMobile:$scope.request['inviteMobile']||'',//邀请人手机号
//                   inviteCertNo:$scope.request['inviteCertNo']||'',//邀请人证件号
//                   inviteEmail:$scope.request[' inviteEmail']||''//邀请人邮箱
//                 });
//               });
//           }
//       }
//   })
// })()


/*----------   2015-10-16 14:14:07   ----------*/