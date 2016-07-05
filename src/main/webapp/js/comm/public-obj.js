/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 14:14:07 *
*******************************/

(function () {
	Date.prototype.format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	};
    var deletedIds = [];

    var slice = deletedIds.slice;

    var concat = deletedIds.concat;

    var push = deletedIds.push;

    var indexOf = deletedIds.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var support = {};

    var Py = {
		mous:function(){
			var mous = {
				mousemove: "mousemove",
				mouseup: "mouseup",
				mousedown: "mousedown"
			};
			if ("createTouch" in document) { //判断是否支持触摸屏
				mous = {
					mousemove: "touchmove",
					mouseup: "touchend",
					mousedown: "touchstart"
				};
			}
			return mous;
		}(),
		Browser: {
			versions:function(){
				var u = navigator.userAgent, app = navigator.appVersion;
				return {//移动终端浏览器版本信息
					trident: u.indexOf("Trident") > -1, //IE内核
					presto: u.indexOf("Presto") > -1, //opera内核
					webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
					gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
					iPhone: u.indexOf("iPhone") > -1 , //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf("iPad") > -1, //是否iPad
					weixin:(u.match(/MicroMessenger/i))=='MicroMessenger', //微信
					webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
				};
			}(),
			device:function(){
				var ret={},os=this.versions;
                ret.mobile=false;
                ret.pc=false;
                ret.ios=false;
				ret.weixin=false;
				if(os.mobile || os.ios || os.android || os.iPhone || os.iPad){
					ret.mobile=true;
				}else{
					ret.pc=true;
				}
				if(os.ios || os.iPhone || os.iPad){
					ret.ios=true;
				}
				if(os.weixin){
					ret.weixin=true;
				}
				return ret;
			},
			language:(navigator.browserLanguage || navigator.language).toLowerCase(), 
            isIE: !!window.ActiveXObject,
            isOpera: window.opera + "" == "[object Opera]"
        },
        getObj: function (o) {
            if (!o) {
                return ;
            }
            var objtmp=false;
            if(Py.isString(o)){
                var arr=o.split('.');
                for (var i =0 ;i<arr.length; i++) {
                    objtmp=objtmp?objtmp:window;
                    if (typeof objtmp[arr[i]] != "undefined") {
                        objtmp = objtmp[arr[i]];
                    }else{
                        return;
                    }
                }
                o=objtmp;
            }
            return o;
        },
        addObj:function (d, o) { //合并对象
            /// <summary>作用：
            /// 合并对象
            /// </summary>
            /// <param name="d" type="对象">默认的对象</param>
            /// <param name="o" type="对象">要合并的对象</param>
            var r = {},objtmp=false;
            if (!o) {
                return d;
            }
            if(Py.isString(o)){
                var arr=o.split('.');
                for (var i =0 ;i<arr.length; i++) {
                    objtmp=objtmp?objtmp:window;
                    if(Py.isObject(objtmp[arr[i]])){
                        objtmp=objtmp[arr[i]];
                    }else{
                        return;
                    }
                }
                o=objtmp;
            }
            for (var j in d) {
                if (typeof o[j] != "undefined") {
                    r[j] = o[j];
                } else {
                    r[j] = d[j];
                }
            }
            return r;
        },
        parse: function (t) { //转成JSON对象
            /// <summary>作用：
            /// 字符串转成JSON对象
            /// </summary>
            /// <param name="t" type="文本">JSON字符串</param>
            var obj;
            if (t) {
                //t = t.match(/\{[\s\S]*\}/g);//取得{任意字符}
                var regexp = /\{[\s\S]*\}/g;
                t = regexp.exec(t);
                if (t) {
                    //t = t.join("").replace(/\'/gi, "\"");
                    t = t[0].replace(/\'/gi, "\"");
                    try {
                        if (window.JSON && JSON.parse) {
                            obj = JSON.parse(t);
                        } else {
                            obj = eval("(" + t + ")");
                        }
                    } catch (e) {
                        alert("格式转换错误：" + e.message);
                        return obj;
                        //throw new Error("dataTypeErr",e.message) 
                    }

                }
            }
            return obj;
        },
        extend: function () {//创建and合并对象
            /// <summary>
            /// 把对象添加到当前对象
            /// 第一个参数如果是boolean并且为true则为深拷贝那么第二个为要添加的对象
            /// （第一个参数如果是string则表示对象路径名或者如果是Object有两个以上的参数则表示要向Object添加内容），第二个参数如果是boolean并且为true则为深拷贝那么第三个为要添加的对象,第四个为boolean并且为true则表示创建新对象否则添加到当前对象
            /// </summary>
            var src, copyIsArray, copy, name, options, clone, objArr = [], objtmp = false, add, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, obj;

            // Handle a deep copy situation
            if (Py.isString(target)) {
                objArr = target.split('.');
                target = arguments[i] || {};
                i++;
            } else if (Py.isObject(target) && arguments.length > 1) {
                obj = target;
                target = arguments[i] || {};
                i++;
            }
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }
            if (i === length - 1 && typeof arguments[i] === "boolean") {
                add = arguments[i];
                length--;
            }
            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !Py.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (i === length) {
                if (obj) {
                    target = obj;
                } else {
                    target = this;
                }

                i--;
            }
            if (objArr.length > 0) {
                var tmparr = arguments[i];
                for (var j = 0; j < objArr.length; j++) {
                    if (!objtmp) { objtmp = add === true ? window : this; }
                    objtmp = objtmp[objArr[j]] ? objtmp[objArr[j]] : objtmp[objArr[j]] = (j == objArr.length - 1) && Py.isArray(tmparr) ? [] : (j == objArr.length - 1) && Py.isFunction(tmparr) ? tmparr : {};

                }
                if (Py.isFunction(tmparr)) {
                    target = objtmp;
                    return target;
                } else {
                    target = objtmp;
                }

            }
            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) !== null) {
                    // Extend the base object
                    if (Py.isString(options)) {
                        target = copy;
                    } else {
                        for (name in options) {
                            src = target[name];
                            copy = options[name];
                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }
                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (Py.isObject(copy) || (copyIsArray = Py.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && Py.isArray(src) ? src : [];

                                } else {
                                    clone = src && Py.isObject(src) ? src : {};
                                }
                                // Never move original objects, clone them
                                target[name] = Py.addObj(deep, clone, copy);
                                // Don't bring in undefined values
                            } else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        type: function (obj) {
            if (obj === null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ?
                Object[toString.call(obj)] || "object" :
                typeof obj;
        },
        each: function (obj, iterator, context) {
            /// <summary>
            /// 用给定的迭代器遍历数组或类数组对象
            /// </summary>
            /// <param name="obj" >需要遍历的数组或者类数组</param>
            /// <param name="iterator">迭代器， 该方法接受三个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key,第三个参数为对象本身</param>
            /// <param name="context">对象指针(默认为自身对象)</param>
            if (!obj) { return; }
            if (obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context || obj[i], obj[i], i, obj) === false) {
                        return false;
                    }
                }
            } else {
                for (var j in obj) {
                    if (obj.hasOwnProperty(j)) {
                        if (iterator.call(context || obj[j], obj[j], j, obj) === false) {
                            return false;
                        }
                    }
                }
            }
        },
        camelize: function (s) { //转换成驼峰式命名
            /// <summary>作用：加（－）的CSS样式属性名转换成驼峰式命名
            /// </summary>
            /// <param name="s" type="文本">需要转换的字符串</param>
            if (s != "undefined" && typeof s == "string") {
                return s.replace(/-[a-z]/gi, function (c) {
                    return c.charAt(1).toUpperCase();
                });
            } else {
                return s;
            }
        },
        delStyle: function (n, o) {
            /// <summary>作用：删除style属性</summary>
            /// <param name="n" type="文本">需要删除的style属性名称</param>
            /// <param name="o" type="节点对象">style对应该的节点</param>
            ///<returns type="返回boolean"></returns>
            if (!o || !o.style) {
                return;
            }
            var ret = [];
            var s = o.style.cssText; //$bu("style", obj)+"";
            if (!s) {
                return;
            }
            s = s.replace(/\;$/gi, "").replace(/\;/gi, "','");
            if (!s) {
                return;
            }
            s = "{'" + s.toLowerCase().replace(/\:/gi, "':'").replace(/\,\'$/gi, "").replace(/\'\s/gi, "'").replace(/\s\'/gi, "'") + "'}";
            s = s.replace(/\,\'\'/gi, ""); //手机端
            s = eval("(" + s + ")");
            if(o.removeAttribute){
				o.removeAttribute("style");
			}
			//删除style属性
            for (var i in s) {
                if (this.camelize(i).toLowerCase().indexOf(n) == -1) {
                    if (s[i]) {
                        o.style[this.camelize(i)] = s[i];
                    }
                }
            }
            return true;
        },
        request:function(){
          var url = document.location.href.toString();
          var u = url.split("?");
          if(typeof(u[1]) == "string"){
              u = u[1].split("&");
              var get = {};
              for(var i in u){
                  if(typeof(u[i]) == "string"){
                      var j = u[i].split("=");
					  //alert(decodeURI(j[1]))
                      get[j[0].toLowerCase()] = decodeURI(j[1]);   
                  }
              }
              return get;
          } else {
              return {};
          }
      }()
    };
    Py.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'], function (v) {
        Py['is' + v] = function (obj) {
            if (v == "Window") {
                return obj !== null && obj == obj.window;
            } else {
                return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
            }
        };
    });
    var YW_Cookie = {
        add: function (name, value, days) {
            /// <summary>
            /// 添加cookie
            /// </summary>
            /// <param name="name">需要添加的cookie名</param>
            /// <param name="value">需要添加的cookie值</param>
            /// <param name="days">cookie保留的时间</param>
			var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + days);//(days * 24 * 60 * 60 * 1000)
                expires = "; expires=" + date.toGMTString();
            }else {
				expires = "";
			}
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        get: function (name) {
            /// <summary>
            /// 获取Cookie值。
            /// </summary>
            /// <param name="name">需要获取的Cookie名称</param>
            ///<returns type="返回要读取的Cookie值或false"></returns>
            var arr=document.cookie.match(reg), reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr) {
                return unescape(arr[2]);
            } else {
                return "";
            }
        },
        //        get: function (name) {
        //            /// <summary>
        //            /// 获取Cookie值。
        //            /// </summary>
        //            /// <param name="name">需要获取的Cookie名称</param>
        //            ///<returns type="返回要读取的Cookie值或false"></returns>
        //            var nameEQ = name + "=";
        //            var ca = document.cookie.split(';');
        //            for (var i = 0; i < ca.length; i++) {
        //                var c = ca[i];
        //                while (c.charAt(0) == ' ') {
        //                    c = c.substring(1, c.length);
        //                }
        //                if (c.indexOf(nameEQ) == 0) {
        //                    return c.substring(nameEQ.length, c.length);
        //                };
        //            }
        //            return false;
        //        },
        del: function (name) {
            /// <summary>
            /// 删除Cookie
            /// </summary>
            /// <param name="name">要删除的Cookie名</param>
            var cval = this.get(name);
            if (cval !== null) {
                document.cookie = this.add(name, "", -1);
            }
        }
    };
    Py.extend({Cookie:YW_Cookie});
    window.YW = Py;
})(window);
$(function(){
    // alert(YW.Browser.device().ios)
    if(YW && YW.Browser && YW.Browser.device().ios){
        // alert($("#ui-ios"))
        // console.log($("#ui-ios"))
        $("#ui-ios").show();
    }
});

/*----------   2015-10-16 14:14:07   ----------*/