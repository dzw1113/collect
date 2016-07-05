/******************************
* @Authors:penyu              *
* @System:webapp              *
* @Version:v1.0.0             *
* @update:2015-10-16 17:13:52 *
*******************************/

(function(a, b) {
    function c(a) {
        return a.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
    }

    function d(a) {
        return e ? e + a : a.toLowerCase()
    }

    var e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o = "",
        p = {
            Webkit: "webkit",
            Moz: "",
            O: "o"
        },
        
        q = document.createElement("div"),
        r = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        s = {};
    a.each(p, function(a, c) {
        return q.style[a + "TransitionProperty"] !== b ? (o = "-" + a.toLowerCase() + "-", e = c, !1) : void 0
    }), f = o + "transform", s[g = o + "transition-property"] = s[h = o + "transition-duration"] = s[j = o + "transition-delay"] = s[i = o + "transition-timing-function"] = s[k = o + "animation-name"] = s[l = o + "animation-duration"] = s[n = o + "animation-delay"] = s[m = o + "animation-timing-function"] = "", a.fx = {
        off: e === b && q.style.transitionProperty === b,
        speeds: {
            _default: 400,
            fast: 200,
            slow: 600
        },
        cssPrefix: o,
        transitionEnd: d("TransitionEnd"),
        animationEnd: d("AnimationEnd")
    }, a.fn.animate = function(c, d, e, f, g) {
        return a.isFunction(d) && (f = d, e = b, d = b), a.isFunction(e) && (f = e, e = b), a.isPlainObject(d) && (e = d.easing, f = d.complete, g = d.delay, d = d.duration), d && (d = ("number" == typeof d ? d : a.fx.speeds[d] || a.fx.speeds._default) / 1e3), g && (g = parseFloat(g) / 1e3), this.anim(c, d, e, f, g)
    }, a.fn.anim = function(d, e, o, p, q) {
        var t,
            u,
            v,
            w = {},
            x = "",
            y = this,
            z = a.fx.transitionEnd,
            A = !1;
        if (e === b && (e = a.fx.speeds._default / 1e3), q === b && (q = 0), a.fx.off && (e = 0), "string" == typeof d) w[k] = d, w[l] = e + "s", w[n] = q + "s", w[m] = o || "linear", z = a.fx.animationEnd;
        else {
            u = [];
            for (t in d) r.test(t) ? x += t + "(" + d[t] + ") " : (w[t] = d[t], u.push(c(t)));
            x && (w[f] = x, u.push(f)), e > 0 && "object" == typeof d && (w[g] = u.join(", "), w[h] = e + "s", w[j] = q + "s", w[i] = o || "linear")
        }
        return v = function(b) {
            if ("undefined" != typeof b) {
                if (b.target !== b.currentTarget) return;
                a(b.target).unbind(z, v)
            } else a(this).unbind(z, v);
            A = !0, a(this).css(s), p && p.call(this)
        }, e > 0 && (this.bind(z, v), setTimeout(function() {
            A || v.call(y)
        }, 1e3 * (e + q) + 25)), this.size() && this.get(0).clientLeft, this.css(w), 0 >= e && setTimeout(function() {
            y.each(function() {
                v.call(this)
            })
        }, 0), this
    }, q = null
})(Zepto) + function(a) {
    "use strict";
    var b = function(c, d) {
        this.$element = a(c), this.options = a.extend({}, b.defaults, d), this.init();
        return this;
    };
    b.VERSION = "1.0.0", b.prototype = {
        init: function() {
            this.status = "readyStart", this.options.callback.ready && this.options.callback.ready()
        },
        start: function() {
            var _this=this;
            "running" === this.status || "readyStop" === this.status || "readyReset" === this.status ? console.warn("Running!!!") : (this.status = "running", this.options.callback.start && this.options.callback.start(), this.goleft())
        },
        goleft: function () {
//            alert(this.status)
            //alert("sdsd")
            //alert(this.options.myAudio)
            if (this.options.myAudio && this.options.myAudio.readyState!=0) {
                this.options.myAudio.pause();
//                alert(this.options.myAudio.readyState)
                this.options.myAudio.currentTime = 0;
                this.options.myAudio.play();
            }
            
            var a = this;
            this.$element.animate({
                rotate: -this.options.rotate + "deg"
            }, this.options.timing, "ease-in-out", function() {
                a.options.callback.arrivedleft && a.options.callback.arrivedleft(), "readyStop" === a.status || "readyReset" === a.status ? a.rollback() : a.goRight()
            })
        },
        goRight: function () {
            if (this.options.myAudio && this.options.myAudio.readyState!=0) {
                this.options.myAudio.pause();
                this.options.myAudio.currentTime = 0;
                this.options.myAudio.play();
            }
            var a = this;
            this.$element.animate({
                rotate: this.options.rotate + "deg"
            }, this.options.timing, "ease-in-out", function() {
                a.options.callback.arrivedRight && a.options.callback.arrivedRight(), "readyStop" === a.status || "readyReset" === a.status ? a.rollback() : a.goleft()
            })
        },
        rollback: function() {
            var a = this;
            this.$element.animate({
                rotate: this.options.reset + "deg"
            }, this.options.timing, "ease-in-out", function() {
                "readyReset" === a.status ? (a.status = "reset", a.options.callback.reset && a.options.callback.reset()) : "readyStop" === a.status && (a.status = "stop", a.options.callback.stop && a.options.callback.stop())
            })
        },
        reset: function() {
            this.status = "readyReset"
        },
        stop: function () {
            this.status = "readyStop"
            if (this.options.myAudio) {
                this.options.myAudio.pause();
                this.options.myAudio.currentTime = 0;
            }
        }
    }, b.defaults = {
        rotate: 10,
        reset: 0,
        timing: 100,
        callback: {
            ready: function() {
                console.log("Ready")
            },
            start: function() {
                console.log("Starting···")
            },
            arrivedleft: function() {},
            arrivedRight: function() {},
            stop: function() {
                conosle.log("Runned")
            }
        }
    }, window.Shake = b
}(Zepto);

/*----------   2015-10-16 17:13:52   ----------*/