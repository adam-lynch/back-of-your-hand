var wc = (e, n) => () => (n || e((n = { exports: {} }).exports, n), n.exports);
var am = wc((cm, Yu) => {
  (function () {
    const n = document.createElement("link").relList;
    if (n && n.supports && n.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]'))
      s(a);
    new MutationObserver((a) => {
      for (const l of a)
        if (l.type === "childList")
          for (const h of l.addedNodes)
            h.tagName === "LINK" && h.rel === "modulepreload" && s(h);
    }).observe(document, { childList: !0, subtree: !0 });
    function r(a) {
      const l = {};
      return (
        a.integrity && (l.integrity = a.integrity),
        a.referrerPolicy && (l.referrerPolicy = a.referrerPolicy),
        a.crossOrigin === "use-credentials"
          ? (l.credentials = "include")
          : a.crossOrigin === "anonymous"
            ? (l.credentials = "omit")
            : (l.credentials = "same-origin"),
        l
      );
    }
    function s(a) {
      if (a.ep) return;
      a.ep = !0;
      const l = r(a);
      fetch(a.href, l);
    }
  })();
  window.goatcounter = { endpoint: "https://count.backofyourhand.com/count" };
  window.goatcounter && window.goatcounter.vars
    ? (window.goatcounter = window.goatcounter.vars)
    : (window.goatcounter = window.goatcounter || {});
  var bc = function (e) {
      var n = {
          p: e.path === void 0 ? goatcounter.path : e.path,
          r: e.referrer === void 0 ? goatcounter.referrer : e.referrer,
          t: e.title === void 0 ? goatcounter.title : e.title,
          e: !!(e.event || goatcounter.event),
          s: [
            window.screen.width,
            window.screen.height,
            window.devicePixelRatio || 1,
          ],
          b: Sc(),
          q: location.search,
        },
        r,
        s,
        a;
      return (
        typeof n.r == "function" && (r = n.r),
        typeof n.t == "function" && (a = n.t),
        typeof n.p == "function" && (s = n.p),
        Tr(n.r) && (n.r = document.referrer),
        Tr(n.t) && (n.t = document.title),
        Tr(n.p) && (n.p = Va()),
        r && (n.r = r(n.r)),
        a && (n.t = a(n.t)),
        s && (n.p = s(n.p)),
        n
      );
    },
    Tr = function (e) {
      return e == null || typeof e == "function";
    },
    Sc = function () {
      var e = window,
        n = document;
      return e.callPhantom || e._phantom || e.phantom
        ? 150
        : e.__nightmare
          ? 151
          : n.__selenium_unwrapped ||
              n.__webdriver_evaluate ||
              n.__driver_evaluate
            ? 152
            : navigator.webdriver
              ? 153
              : 0;
    },
    Pc = function (e) {
      var n = [];
      for (var r in e)
        e[r] !== "" &&
          e[r] !== null &&
          e[r] !== void 0 &&
          e[r] !== !1 &&
          n.push(encodeURIComponent(r) + "=" + encodeURIComponent(e[r]));
      return "?" + n.join("&");
    },
    Wn = function (e) {
      console && "warn" in console && console.warn("goatcounter: " + e);
    },
    Ga = function () {
      var e = document.querySelector("script[data-goatcounter]");
      return e && e.dataset.goatcounter
        ? e.dataset.goatcounter
        : goatcounter.endpoint || window.counter;
    },
    Va = function () {
      var e = location,
        n = document.querySelector('link[rel="canonical"][href]');
      if (n) {
        var r = document.createElement("a");
        (r.href = n.href),
          r.hostname.replace(/^www\./, "") ===
            location.hostname.replace(/^www\./, "") && (e = r);
      }
      return e.pathname + e.search || "/";
    };
  goatcounter.filter = function () {
    return "visibilityState" in document &&
      (document.visibilityState === "prerender" ||
        document.visibilityState === "hidden")
      ? "visibilityState"
      : !goatcounter.allow_frame && location !== parent.location
        ? "frame"
        : !goatcounter.allow_local &&
            location.hostname.match(
              /(localhost$|^127\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\.)/,
            )
          ? "localhost"
          : !goatcounter.allow_local && location.protocol === "file:"
            ? "localfile"
            : localStorage && localStorage.getItem("skipgc") === "t"
              ? "disabled with #toggle-goatcounter"
              : !1;
  };
  window.goatcounter.url = function (e) {
    var n = bc(e || {});
    if (n.p !== null) {
      n.rnd = Math.random().toString(36).substr(2, 5);
      var r = Ga();
      return r ? r + Pc(n) : Wn("no endpoint found");
    }
  };
  window.goatcounter.count = function (e) {
    var n = goatcounter.filter();
    if (n) return Wn("not counting because of: " + n);
    var r = goatcounter.url(e);
    if (!r) return Wn("not counting because path callback returned null");
    var s = document.createElement("img");
    (s.src = r),
      (s.style.position = "absolute"),
      s.setAttribute("alt", ""),
      s.setAttribute("aria-hidden", "true");
    var a = function () {
      s && s.parentNode && s.parentNode.removeChild(s);
    };
    setTimeout(a, 3e3),
      s.addEventListener("load", a, !1),
      document.body.appendChild(s);
  };
  window.goatcounter.get_query = function (e) {
    for (var n = location.search.substr(1).split("&"), r = 0; r < n.length; r++)
      if (n[r].toLowerCase().indexOf(e.toLowerCase() + "=") === 0)
        return n[r].substr(e.length + 1);
  };
  window.goatcounter.bind_events = function () {
    if (document.querySelectorAll) {
      var e = function (n) {
        return function () {
          goatcounter.count({
            event: !0,
            path: n.dataset.goatcounterClick || n.name || n.id || "",
            title:
              n.dataset.goatcounterTitle ||
              n.title ||
              (n.innerHTML || "").substr(0, 200) ||
              "",
            referrer:
              n.dataset.goatcounterReferrer ||
              n.dataset.goatcounterReferral ||
              "",
          });
        };
      };
      Array.prototype.slice
        .call(document.querySelectorAll("*[data-goatcounter-click]"))
        .forEach(function (n) {
          if (!n.dataset.goatcounterBound) {
            var r = e(n);
            n.addEventListener("click", r, !1),
              n.addEventListener("auxclick", r, !1),
              (n.dataset.goatcounterBound = "true");
          }
        });
    }
  };
  window.goatcounter.visit_count = function (e) {
    (e = e || {}),
      (e.type = e.type || "html"),
      (e.append = e.append || "body"),
      (e.path = e.path || Va()),
      (e.attr = e.attr || {
        width: "200",
        height: e.no_branding ? "60" : "80",
      }),
      (e.attr.src =
        Ga() + "er/" + encodeURIComponent(e.path) + "." + e.type + "?"),
      e.no_branding && (e.attr.src += "&no_branding=1"),
      e.style && (e.attr.src += "&style=" + encodeURIComponent(e.style));
    var n = { png: "img", svg: "img", html: "iframe" }[e.type];
    if (!n) return Wn("visit_count: unknown type: " + e.type);
    e.type === "html" &&
      ((e.attr.frameborder = "0"), (e.attr.scrolling = "no"));
    var r = document.createElement(n);
    for (var s in e.attr) r.setAttribute(s, e.attr[s]);
    var a = document.querySelector(e.append);
    if (!a) return Wn("visit_count: append not found: " + e.append);
    a.appendChild(r);
  };
  location.hash === "#toggle-goatcounter" &&
    (localStorage.getItem("skipgc") === "t"
      ? (localStorage.removeItem("skipgc", "t"),
        alert("GoatCounter tracking is now ENABLED in this browser."))
      : (localStorage.setItem("skipgc", "t"),
        alert(
          "GoatCounter tracking is now DISABLED in this browser until " +
            location +
            " is loaded again.",
        )));
  if (!goatcounter.no_onload) {
    var js = function () {
      goatcounter.count(), goatcounter.no_events || goatcounter.bind_events();
    };
    document.body === null
      ? document.addEventListener(
          "DOMContentLoaded",
          function () {
            js();
          },
          !1,
        )
      : js();
  }
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var Hr =
    function (e, n) {
      return (
        (Hr =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (r, s) {
              r.__proto__ = s;
            }) ||
          function (r, s) {
            for (var a in s) s.hasOwnProperty(a) && (r[a] = s[a]);
          }),
        Hr(e, n)
      );
    };
  function Ri(e, n) {
    Hr(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype =
      n === null ? Object.create(n) : ((r.prototype = n.prototype), new r());
  }
  var _t = function () {
    return (
      (_t =
        Object.assign ||
        function (n) {
          for (var r, s = 1, a = arguments.length; s < a; s++) {
            r = arguments[s];
            for (var l in r)
              Object.prototype.hasOwnProperty.call(r, l) && (n[l] = r[l]);
          }
          return n;
        }),
      _t.apply(this, arguments)
    );
  };
  function vn(e, n) {
    var r = typeof Symbol == "function" && e[Symbol.iterator];
    if (!r) return e;
    var s = r.call(e),
      a,
      l = [],
      h;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = s.next()).done; )
        l.push(a.value);
    } catch (f) {
      h = { error: f };
    } finally {
      try {
        a && !a.done && (r = s.return) && r.call(s);
      } finally {
        if (h) throw h.error;
      }
    }
    return l;
  }
  function $a() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e = e.concat(vn(arguments[n]));
    return e;
  }
  var ce;
  (function (e) {
    (e.Fatal = "fatal"),
      (e.Error = "error"),
      (e.Warning = "warning"),
      (e.Log = "log"),
      (e.Info = "info"),
      (e.Debug = "debug"),
      (e.Critical = "critical");
  })(ce || (ce = {}));
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function xc(
    e,
    n,
  ) {
    var r = typeof Symbol == "function" && e[Symbol.iterator];
    if (!r) return e;
    var s = r.call(e),
      a,
      l = [],
      h;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = s.next()).done; )
        l.push(a.value);
    } catch (f) {
      h = { error: f };
    } finally {
      try {
        a && !a.done && (r = s.return) && r.call(s);
      } finally {
        if (h) throw h.error;
      }
    }
    return l;
  }
  function Lc() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e = e.concat(xc(arguments[n]));
    return e;
  }
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var $ =
    function () {
      return (
        ($ =
          Object.assign ||
          function (n) {
            for (var r, s = 1, a = arguments.length; s < a; s++) {
              r = arguments[s];
              for (var l in r)
                Object.prototype.hasOwnProperty.call(r, l) && (n[l] = r[l]);
            }
            return n;
          }),
        $.apply(this, arguments)
      );
    };
  function Tc(e, n) {
    var r = typeof Symbol == "function" && e[Symbol.iterator];
    if (!r) return e;
    var s = r.call(e),
      a,
      l = [],
      h;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = s.next()).done; )
        l.push(a.value);
    } catch (f) {
      h = { error: f };
    } finally {
      try {
        a && !a.done && (r = s.return) && r.call(s);
      } finally {
        if (h) throw h.error;
      }
    }
    return l;
  }
  function sn() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e = e.concat(Tc(arguments[n]));
    return e;
  }
  function Ec(e) {
    e.then(null, function (n) {
      console.error(n);
    });
  }
  function kc() {
    return (
      typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__
    );
  }
  function oo() {
    return (
      !kc() &&
      Object.prototype.toString.call(typeof process < "u" ? process : 0) ===
        "[object process]"
    );
  }
  function Cc(e, n) {
    return e.require(n);
  }
  var Oc = {};
  function yt() {
    return oo()
      ? global
      : typeof window < "u"
        ? window
        : typeof self < "u"
          ? self
          : Oc;
  }
  function so(e, n, r) {
    var s = r || yt(),
      a = (s.__SENTRY__ = s.__SENTRY__ || {}),
      l = a[e] || (a[e] = n());
    return l;
  }
  var Ya = Object.prototype.toString;
  function ao(e) {
    switch (Ya.call(e)) {
      case "[object Error]":
      case "[object Exception]":
      case "[object DOMException]":
        return !0;
      default:
        return Le(e, Error);
    }
  }
  function yn(e, n) {
    return Ya.call(e) === "[object " + n + "]";
  }
  function Ka(e) {
    return yn(e, "ErrorEvent");
  }
  function Ws(e) {
    return yn(e, "DOMError");
  }
  function Mc(e) {
    return yn(e, "DOMException");
  }
  function dn(e) {
    return yn(e, "String");
  }
  function uo(e) {
    return e === null || (typeof e != "object" && typeof e != "function");
  }
  function pn(e) {
    return yn(e, "Object");
  }
  function Ai(e) {
    return typeof Event < "u" && Le(e, Event);
  }
  function Ic(e) {
    return typeof Element < "u" && Le(e, Element);
  }
  function zc(e) {
    return yn(e, "RegExp");
  }
  function lo(e) {
    return !!(e && e.then && typeof e.then == "function");
  }
  function Rc(e) {
    return (
      pn(e) &&
      "nativeEvent" in e &&
      "preventDefault" in e &&
      "stopPropagation" in e
    );
  }
  function Ac(e) {
    return typeof e == "number" && e !== e;
  }
  function Le(e, n) {
    try {
      return e instanceof n;
    } catch {
      return !1;
    }
  }
  function Ur(e, n) {
    try {
      for (
        var r = e,
          s = 5,
          a = 80,
          l = [],
          h = 0,
          f = 0,
          p = " > ",
          _ = p.length,
          v = void 0;
        r &&
        h++ < s &&
        ((v = Bc(r, n)),
        !(v === "html" || (h > 1 && f + l.length * _ + v.length >= a)));

      )
        l.push(v), (f += v.length), (r = r.parentNode);
      return l.reverse().join(p);
    } catch {
      return "<unknown>";
    }
  }
  function Bc(e, n) {
    var r = e,
      s = [],
      a,
      l,
      h,
      f,
      p;
    if (!r || !r.tagName) return "";
    s.push(r.tagName.toLowerCase());
    var _ =
      n && n.length
        ? n
            .filter(function (m) {
              return r.getAttribute(m);
            })
            .map(function (m) {
              return [m, r.getAttribute(m)];
            })
        : null;
    if (_ && _.length)
      _.forEach(function (m) {
        s.push("[" + m[0] + '="' + m[1] + '"]');
      });
    else if ((r.id && s.push("#" + r.id), (a = r.className), a && dn(a)))
      for (l = a.split(/\s+/), p = 0; p < l.length; p++) s.push("." + l[p]);
    var v = ["type", "name", "title", "alt"];
    for (p = 0; p < v.length; p++)
      (h = v[p]),
        (f = r.getAttribute(h)),
        f && s.push("[" + h + '="' + f + '"]');
    return s.join("");
  }
  function Nc() {
    var e = yt();
    try {
      return e.document.location.href;
    } catch {
      return "";
    }
  }
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var jr =
    function (e, n) {
      return (
        (jr =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (r, s) {
              r.__proto__ = s;
            }) ||
          function (r, s) {
            for (var a in s) s.hasOwnProperty(a) && (r[a] = s[a]);
          }),
        jr(e, n)
      );
    };
  function Dc(e, n) {
    jr(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype =
      n === null ? Object.create(n) : ((r.prototype = n.prototype), new r());
  }
  var Rt = function () {
    return (
      (Rt =
        Object.assign ||
        function (n) {
          for (var r, s = 1, a = arguments.length; s < a; s++) {
            r = arguments[s];
            for (var l in r)
              Object.prototype.hasOwnProperty.call(r, l) && (n[l] = r[l]);
          }
          return n;
        }),
      Rt.apply(this, arguments)
    );
  };
  function _n(e) {
    var n = typeof Symbol == "function" && Symbol.iterator,
      r = n && e[n],
      s = 0;
    if (r) return r.call(e);
    if (e && typeof e.length == "number")
      return {
        next: function () {
          return (
            e && s >= e.length && (e = void 0), { value: e && e[s++], done: !e }
          );
        },
      };
    throw new TypeError(
      n ? "Object is not iterable." : "Symbol.iterator is not defined.",
    );
  }
  function Pe(e, n) {
    var r = typeof Symbol == "function" && e[Symbol.iterator];
    if (!r) return e;
    var s = r.call(e),
      a,
      l = [],
      h;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = s.next()).done; )
        l.push(a.value);
    } catch (f) {
      h = { error: f };
    } finally {
      try {
        a && !a.done && (r = s.return) && r.call(s);
      } finally {
        if (h) throw h.error;
      }
    }
    return l;
  }
  function Zc() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e = e.concat(Pe(arguments[n]));
    return e;
  }
  var Fc =
    Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? Hc : Uc);
  function Hc(e, n) {
    return (e.__proto__ = n), e;
  }
  function Uc(e, n) {
    for (var r in n)
      Object.prototype.hasOwnProperty.call(e, r) || (e[r] = n[r]);
    return e;
  }
  var Mt = (function (e) {
      Dc(n, e);
      function n(r) {
        var s = this.constructor,
          a = e.call(this, r) || this;
        return (
          (a.message = r),
          (a.name = s.prototype.constructor.name),
          Fc(a, s.prototype),
          a
        );
      }
      return n;
    })(Error),
    wn = typeof __SENTRY_DEBUG__ > "u" ? !0 : __SENTRY_DEBUG__,
    jc = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;
  function Wc(e) {
    return e === "http" || e === "https";
  }
  function Xn(e, n) {
    n === void 0 && (n = !1);
    var r = e.host,
      s = e.path,
      a = e.pass,
      l = e.port,
      h = e.projectId,
      f = e.protocol,
      p = e.publicKey;
    return (
      f +
      "://" +
      p +
      (n && a ? ":" + a : "") +
      ("@" + r + (l ? ":" + l : "") + "/" + (s && s + "/") + h)
    );
  }
  function qc(e) {
    var n = jc.exec(e);
    if (!n) throw new Mt("Invalid Sentry Dsn: " + e);
    var r = Pe(n.slice(1), 6),
      s = r[0],
      a = r[1],
      l = r[2],
      h = l === void 0 ? "" : l,
      f = r[3],
      p = r[4],
      _ = p === void 0 ? "" : p,
      v = r[5],
      m = "",
      w = v,
      S = w.split("/");
    if ((S.length > 1 && ((m = S.slice(0, -1).join("/")), (w = S.pop())), w)) {
      var P = w.match(/^\d+/);
      P && (w = P[0]);
    }
    return Xa({
      host: f,
      pass: h,
      path: m,
      projectId: w,
      port: _,
      protocol: s,
      publicKey: a,
    });
  }
  function Xa(e) {
    return (
      "user" in e && !("publicKey" in e) && (e.publicKey = e.user),
      {
        user: e.publicKey || "",
        protocol: e.protocol,
        publicKey: e.publicKey || "",
        pass: e.pass || "",
        host: e.host,
        port: e.port || "",
        path: e.path || "",
        projectId: e.projectId,
      }
    );
  }
  function Gc(e) {
    if (wn) {
      var n = e.port,
        r = e.projectId,
        s = e.protocol,
        a = ["protocol", "publicKey", "host", "projectId"];
      if (
        (a.forEach(function (l) {
          if (!e[l]) throw new Mt("Invalid Sentry Dsn: " + l + " missing");
        }),
        !r.match(/^\d+$/))
      )
        throw new Mt("Invalid Sentry Dsn: Invalid projectId " + r);
      if (!Wc(s)) throw new Mt("Invalid Sentry Dsn: Invalid protocol " + s);
      if (n && isNaN(parseInt(n, 10)))
        throw new Mt("Invalid Sentry Dsn: Invalid port " + n);
      return !0;
    }
  }
  function co(e) {
    var n = typeof e == "string" ? qc(e) : Xa(e);
    return Gc(n), n;
  }
  var Vc = ["fatal", "error", "warning", "log", "info", "debug", "critical"],
    $c = yt(),
    Yc = "Sentry Logger ",
    ki = ["debug", "info", "warn", "error", "log", "assert"];
  function Ja(e) {
    var n = yt();
    if (!("console" in n)) return e();
    var r = n.console,
      s = {};
    ki.forEach(function (a) {
      var l = r[a] && r[a].__sentry_original__;
      a in n.console && l && ((s[a] = r[a]), (r[a] = l));
    });
    try {
      return e();
    } finally {
      Object.keys(s).forEach(function (a) {
        r[a] = s[a];
      });
    }
  }
  function qs() {
    var e = !1,
      n = {
        enable: function () {
          e = !0;
        },
        disable: function () {
          e = !1;
        },
      };
    return (
      wn
        ? ki.forEach(function (r) {
            n[r] = function () {
              for (var s = [], a = 0; a < arguments.length; a++)
                s[a] = arguments[a];
              e &&
                Ja(function () {
                  var l;
                  (l = $c.console)[r].apply(l, Zc([Yc + "[" + r + "]:"], s));
                });
            };
          })
        : ki.forEach(function (r) {
            n[r] = function () {};
          }),
      n
    );
  }
  var rt;
  wn ? (rt = so("logger", qs)) : (rt = qs());
  function Fn(e, n) {
    return (
      n === void 0 && (n = 0),
      typeof e != "string" || n === 0 || e.length <= n
        ? e
        : e.substr(0, n) + "..."
    );
  }
  function Gs(e, n) {
    if (!Array.isArray(e)) return "";
    for (var r = [], s = 0; s < e.length; s++) {
      var a = e[s];
      try {
        r.push(String(a));
      } catch {
        r.push("[value cannot be serialized]");
      }
    }
    return r.join(n);
  }
  function ho(e, n) {
    return dn(e)
      ? zc(n)
        ? n.test(e)
        : typeof n == "string"
          ? e.indexOf(n) !== -1
          : !1
      : !1;
  }
  function At(e, n, r) {
    if (n in e) {
      var s = e[n],
        a = r(s);
      if (typeof a == "function")
        try {
          Qa(a, s);
        } catch {}
      e[n] = a;
    }
  }
  function Bi(e, n, r) {
    Object.defineProperty(e, n, { value: r, writable: !0, configurable: !0 });
  }
  function Qa(e, n) {
    var r = n.prototype || {};
    (e.prototype = n.prototype = r), Bi(e, "__sentry_original__", n);
  }
  function fo(e) {
    return e.__sentry_original__;
  }
  function Kc(e) {
    return Object.keys(e)
      .map(function (n) {
        return encodeURIComponent(n) + "=" + encodeURIComponent(e[n]);
      })
      .join("&");
  }
  function tu(e) {
    var n = e;
    if (ao(e))
      n = Rt({ message: e.message, name: e.name, stack: e.stack }, $s(e));
    else if (Ai(e)) {
      var r = e;
      (n = Rt(
        {
          type: r.type,
          target: Vs(r.target),
          currentTarget: Vs(r.currentTarget),
        },
        $s(r),
      )),
        typeof CustomEvent < "u" && Le(e, CustomEvent) && (n.detail = r.detail);
    }
    return n;
  }
  function Vs(e) {
    try {
      return Ic(e) ? Ur(e) : Object.prototype.toString.call(e);
    } catch {
      return "<unknown>";
    }
  }
  function $s(e) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]);
    return n;
  }
  function Xc(e, n) {
    n === void 0 && (n = 40);
    var r = Object.keys(tu(e));
    if ((r.sort(), !r.length)) return "[object has no keys]";
    if (r[0].length >= n) return Fn(r[0], n);
    for (var s = r.length; s > 0; s--) {
      var a = r.slice(0, s).join(", ");
      if (!(a.length > n)) return s === r.length ? a : Fn(a, n);
    }
    return "";
  }
  function Wr(e) {
    var n, r;
    if (pn(e)) {
      var s = {};
      try {
        for (var a = _n(Object.keys(e)), l = a.next(); !l.done; l = a.next()) {
          var h = l.value;
          typeof e[h] < "u" && (s[h] = Wr(e[h]));
        }
      } catch (f) {
        n = { error: f };
      } finally {
        try {
          l && !l.done && (r = a.return) && r.call(a);
        } finally {
          if (n) throw n.error;
        }
      }
      return s;
    }
    return Array.isArray(e) ? e.map(Wr) : e;
  }
  var Jc = 50;
  function Qc() {
    for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
    var r = e
      .sort(function (s, a) {
        return s[0] - a[0];
      })
      .map(function (s) {
        return s[1];
      });
    return function (s, a) {
      var l, h, f, p;
      a === void 0 && (a = 0);
      var _ = [];
      try {
        for (
          var v = _n(
              s
                .split(
                  `
`,
                )
                .slice(a),
            ),
            m = v.next();
          !m.done;
          m = v.next()
        ) {
          var w = m.value;
          try {
            for (
              var S = ((f = void 0), _n(r)), P = S.next();
              !P.done;
              P = S.next()
            ) {
              var O = P.value,
                I = O(w);
              if (I) {
                _.push(I);
                break;
              }
            }
          } catch (z) {
            f = { error: z };
          } finally {
            try {
              P && !P.done && (p = S.return) && p.call(S);
            } finally {
              if (f) throw f.error;
            }
          }
        }
      } catch (z) {
        l = { error: z };
      } finally {
        try {
          m && !m.done && (h = v.return) && h.call(v);
        } finally {
          if (l) throw l.error;
        }
      }
      return th(_);
    };
  }
  function th(e) {
    if (!e.length) return [];
    var n = e,
      r = n[0].function || "",
      s = n[n.length - 1].function || "";
    return (
      (r.indexOf("captureMessage") !== -1 ||
        r.indexOf("captureException") !== -1) &&
        (n = n.slice(1)),
      s.indexOf("sentryWrapped") !== -1 && (n = n.slice(0, -1)),
      n
        .slice(0, Jc)
        .map(function (a) {
          return Rt(Rt({}, a), {
            filename: a.filename || n[0].filename,
            function: a.function || "?",
          });
        })
        .reverse()
    );
  }
  var Er = "<anonymous>";
  function xe(e) {
    try {
      return !e || typeof e != "function" ? Er : e.name || Er;
    } catch {
      return Er;
    }
  }
  function Ni() {
    if (!("fetch" in yt())) return !1;
    try {
      return new Headers(), new Request(""), new Response(), !0;
    } catch {
      return !1;
    }
  }
  function qr(e) {
    return (
      e && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
    );
  }
  function eh() {
    if (!Ni()) return !1;
    var e = yt();
    if (qr(e.fetch)) return !0;
    var n = !1,
      r = e.document;
    if (r && typeof r.createElement == "function")
      try {
        var s = r.createElement("iframe");
        (s.hidden = !0),
          r.head.appendChild(s),
          s.contentWindow &&
            s.contentWindow.fetch &&
            (n = qr(s.contentWindow.fetch)),
          r.head.removeChild(s);
      } catch (a) {
        wn &&
          rt.warn(
            "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
            a,
          );
      }
    return n;
  }
  function nh() {
    if (!Ni()) return !1;
    try {
      return new Request("_", { referrerPolicy: "origin" }), !0;
    } catch {
      return !1;
    }
  }
  function ih() {
    var e = yt(),
      n = e.chrome,
      r = n && n.app && n.app.runtime,
      s = "history" in e && !!e.history.pushState && !!e.history.replaceState;
    return !r && s;
  }
  var mt = yt(),
    Hn = {},
    Ys = {};
  function rh(e) {
    if (!Ys[e])
      switch (((Ys[e] = !0), e)) {
        case "console":
          oh();
          break;
        case "dom":
          ph();
          break;
        case "xhr":
          lh();
          break;
        case "fetch":
          sh();
          break;
        case "history":
          ch();
          break;
        case "error":
          _h();
          break;
        case "unhandledrejection":
          mh();
          break;
        default:
          wn && rt.warn("unknown instrumentation type:", e);
          return;
      }
  }
  function ye(e, n) {
    (Hn[e] = Hn[e] || []), Hn[e].push(n), rh(e);
  }
  function te(e, n) {
    var r, s;
    if (!(!e || !Hn[e]))
      try {
        for (var a = _n(Hn[e] || []), l = a.next(); !l.done; l = a.next()) {
          var h = l.value;
          try {
            h(n);
          } catch (f) {
            wn &&
              rt.error(
                `Error while triggering instrumentation handler.
Type: ` +
                  e +
                  `
Name: ` +
                  xe(h) +
                  `
Error:`,
                f,
              );
          }
        }
      } catch (f) {
        r = { error: f };
      } finally {
        try {
          l && !l.done && (s = a.return) && s.call(a);
        } finally {
          if (r) throw r.error;
        }
      }
  }
  function oh() {
    "console" in mt &&
      ki.forEach(function (e) {
        e in mt.console &&
          At(mt.console, e, function (n) {
            return function () {
              for (var r = [], s = 0; s < arguments.length; s++)
                r[s] = arguments[s];
              te("console", { args: r, level: e }), n && n.apply(mt.console, r);
            };
          });
      });
  }
  function sh() {
    eh() &&
      At(mt, "fetch", function (e) {
        return function () {
          for (var n = [], r = 0; r < arguments.length; r++)
            n[r] = arguments[r];
          var s = {
            args: n,
            fetchData: { method: ah(n), url: uh(n) },
            startTimestamp: Date.now(),
          };
          return (
            te("fetch", Rt({}, s)),
            e.apply(mt, n).then(
              function (a) {
                return (
                  te(
                    "fetch",
                    Rt(Rt({}, s), { endTimestamp: Date.now(), response: a }),
                  ),
                  a
                );
              },
              function (a) {
                throw (
                  (te(
                    "fetch",
                    Rt(Rt({}, s), { endTimestamp: Date.now(), error: a }),
                  ),
                  a)
                );
              },
            )
          );
        };
      });
  }
  function ah(e) {
    return (
      e === void 0 && (e = []),
      "Request" in mt && Le(e[0], Request) && e[0].method
        ? String(e[0].method).toUpperCase()
        : e[1] && e[1].method
          ? String(e[1].method).toUpperCase()
          : "GET"
    );
  }
  function uh(e) {
    return (
      e === void 0 && (e = []),
      typeof e[0] == "string"
        ? e[0]
        : "Request" in mt && Le(e[0], Request)
          ? e[0].url
          : String(e[0])
    );
  }
  function lh() {
    if ("XMLHttpRequest" in mt) {
      var e = XMLHttpRequest.prototype;
      At(e, "open", function (n) {
        return function () {
          for (var r = [], s = 0; s < arguments.length; s++)
            r[s] = arguments[s];
          var a = this,
            l = r[1],
            h = (a.__sentry_xhr__ = {
              method: dn(r[0]) ? r[0].toUpperCase() : r[0],
              url: r[1],
            });
          dn(l) &&
            h.method === "POST" &&
            l.match(/sentry_key/) &&
            (a.__sentry_own_request__ = !0);
          var f = function () {
            if (a.readyState === 4) {
              try {
                h.status_code = a.status;
              } catch {}
              te("xhr", {
                args: r,
                endTimestamp: Date.now(),
                startTimestamp: Date.now(),
                xhr: a,
              });
            }
          };
          return (
            "onreadystatechange" in a &&
            typeof a.onreadystatechange == "function"
              ? At(a, "onreadystatechange", function (p) {
                  return function () {
                    for (var _ = [], v = 0; v < arguments.length; v++)
                      _[v] = arguments[v];
                    return f(), p.apply(a, _);
                  };
                })
              : a.addEventListener("readystatechange", f),
            n.apply(a, r)
          );
        };
      }),
        At(e, "send", function (n) {
          return function () {
            for (var r = [], s = 0; s < arguments.length; s++)
              r[s] = arguments[s];
            return (
              this.__sentry_xhr__ &&
                r[0] !== void 0 &&
                (this.__sentry_xhr__.body = r[0]),
              te("xhr", { args: r, startTimestamp: Date.now(), xhr: this }),
              n.apply(this, r)
            );
          };
        });
    }
  }
  var vi;
  function ch() {
    if (!ih()) return;
    var e = mt.onpopstate;
    mt.onpopstate = function () {
      for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
      var a = mt.location.href,
        l = vi;
      if (((vi = a), te("history", { from: l, to: a }), e))
        try {
          return e.apply(this, r);
        } catch {}
    };
    function n(r) {
      return function () {
        for (var s = [], a = 0; a < arguments.length; a++) s[a] = arguments[a];
        var l = s.length > 2 ? s[2] : void 0;
        if (l) {
          var h = vi,
            f = String(l);
          (vi = f), te("history", { from: h, to: f });
        }
        return r.apply(this, s);
      };
    }
    At(mt.history, "pushState", n), At(mt.history, "replaceState", n);
  }
  var hh = 1e3,
    yi,
    wi;
  function fh(e, n) {
    if (!e || e.type !== n.type) return !0;
    try {
      if (e.target !== n.target) return !0;
    } catch {}
    return !1;
  }
  function dh(e) {
    if (e.type !== "keypress") return !1;
    try {
      var n = e.target;
      if (!n || !n.tagName) return !0;
      if (
        n.tagName === "INPUT" ||
        n.tagName === "TEXTAREA" ||
        n.isContentEditable
      )
        return !1;
    } catch {}
    return !0;
  }
  function Ks(e, n) {
    return (
      n === void 0 && (n = !1),
      function (r) {
        if (!(!r || wi === r) && !dh(r)) {
          var s = r.type === "keypress" ? "input" : r.type;
          yi === void 0
            ? (e({ event: r, name: s, global: n }), (wi = r))
            : fh(wi, r) && (e({ event: r, name: s, global: n }), (wi = r)),
            clearTimeout(yi),
            (yi = mt.setTimeout(function () {
              yi = void 0;
            }, hh));
        }
      }
    );
  }
  function ph() {
    if ("document" in mt) {
      var e = te.bind(null, "dom"),
        n = Ks(e, !0);
      mt.document.addEventListener("click", n, !1),
        mt.document.addEventListener("keypress", n, !1),
        ["EventTarget", "Node"].forEach(function (r) {
          var s = mt[r] && mt[r].prototype;
          !s ||
            !s.hasOwnProperty ||
            !s.hasOwnProperty("addEventListener") ||
            (At(s, "addEventListener", function (a) {
              return function (l, h, f) {
                if (l === "click" || l == "keypress")
                  try {
                    var p = this,
                      _ = (p.__sentry_instrumentation_handlers__ =
                        p.__sentry_instrumentation_handlers__ || {}),
                      v = (_[l] = _[l] || { refCount: 0 });
                    if (!v.handler) {
                      var m = Ks(e);
                      (v.handler = m), a.call(this, l, m, f);
                    }
                    v.refCount += 1;
                  } catch {}
                return a.call(this, l, h, f);
              };
            }),
            At(s, "removeEventListener", function (a) {
              return function (l, h, f) {
                if (l === "click" || l == "keypress")
                  try {
                    var p = this,
                      _ = p.__sentry_instrumentation_handlers__ || {},
                      v = _[l];
                    v &&
                      ((v.refCount -= 1),
                      v.refCount <= 0 &&
                        (a.call(this, l, v.handler, f),
                        (v.handler = void 0),
                        delete _[l]),
                      Object.keys(_).length === 0 &&
                        delete p.__sentry_instrumentation_handlers__);
                  } catch {}
                return a.call(this, l, h, f);
              };
            }));
        });
    }
  }
  var kr = null;
  function _h() {
    (kr = mt.onerror),
      (mt.onerror = function (e, n, r, s, a) {
        return (
          te("error", { column: s, error: a, line: r, msg: e, url: n }),
          kr ? kr.apply(this, arguments) : !1
        );
      });
  }
  var Cr = null;
  function mh() {
    (Cr = mt.onunhandledrejection),
      (mt.onunhandledrejection = function (e) {
        return te("unhandledrejection", e), Cr ? Cr.apply(this, arguments) : !0;
      });
  }
  function gh() {
    var e = typeof WeakSet == "function",
      n = e ? new WeakSet() : [];
    function r(a) {
      if (e) return n.has(a) ? !0 : (n.add(a), !1);
      for (var l = 0; l < n.length; l++) {
        var h = n[l];
        if (h === a) return !0;
      }
      return n.push(a), !1;
    }
    function s(a) {
      if (e) n.delete(a);
      else
        for (var l = 0; l < n.length; l++)
          if (n[l] === a) {
            n.splice(l, 1);
            break;
          }
    }
    return [r, s];
  }
  function cn() {
    var e = yt(),
      n = e.crypto || e.msCrypto;
    if (n !== void 0 && n.getRandomValues) {
      var r = new Uint16Array(8);
      n.getRandomValues(r),
        (r[3] = (r[3] & 4095) | 16384),
        (r[4] = (r[4] & 16383) | 32768);
      var s = function (a) {
        for (var l = a.toString(16); l.length < 4; ) l = "0" + l;
        return l;
      };
      return (
        s(r[0]) +
        s(r[1]) +
        s(r[2]) +
        s(r[3]) +
        s(r[4]) +
        s(r[5]) +
        s(r[6]) +
        s(r[7])
      );
    }
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (a) {
      var l = (Math.random() * 16) | 0,
        h = a === "x" ? l : (l & 3) | 8;
      return h.toString(16);
    });
  }
  function Or(e) {
    if (!e) return {};
    var n = e.match(
      /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
    );
    if (!n) return {};
    var r = n[6] || "",
      s = n[8] || "";
    return { host: n[4], path: n[5], protocol: n[2], relative: n[5] + r + s };
  }
  function eu(e) {
    return e.exception && e.exception.values ? e.exception.values[0] : void 0;
  }
  function Ne(e) {
    var n = e.message,
      r = e.event_id;
    if (n) return n;
    var s = eu(e);
    return s
      ? s.type && s.value
        ? s.type + ": " + s.value
        : s.type || s.value || r || "<unknown>"
      : r || "<unknown>";
  }
  function Gr(e, n, r) {
    var s = (e.exception = e.exception || {}),
      a = (s.values = s.values || []),
      l = (a[0] = a[0] || {});
    l.value || (l.value = n || ""), l.type || (l.type = "Error");
  }
  function qn(e, n) {
    var r = eu(e);
    if (r) {
      var s = { type: "generic", handled: !0 },
        a = r.mechanism;
      if (((r.mechanism = Rt(Rt(Rt({}, s), a), n)), n && "data" in n)) {
        var l = Rt(Rt({}, a && a.data), n.data);
        r.mechanism.data = l;
      }
    }
  }
  function Xs(e) {
    if (e && e.__sentry_captured__) return !0;
    try {
      Bi(e, "__sentry_captured__", !0);
    } catch {}
    return !1;
  }
  function Be(e, n, r) {
    n === void 0 && (n = 1 / 0), r === void 0 && (r = 1 / 0);
    try {
      return iu("", e, n, r);
    } catch (s) {
      return { ERROR: "**non-serializable** (" + s + ")" };
    }
  }
  function nu(e, n, r) {
    n === void 0 && (n = 3), r === void 0 && (r = 100 * 1024);
    var s = Be(e, n);
    return wh(s) > r ? nu(e, n - 1, r) : s;
  }
  function iu(e, n, r, s, a) {
    r === void 0 && (r = 1 / 0),
      s === void 0 && (s = 1 / 0),
      a === void 0 && (a = gh());
    var l = Pe(a, 2),
      h = l[0],
      f = l[1],
      p = n;
    if (p && typeof p.toJSON == "function")
      try {
        return p.toJSON();
      } catch {}
    if (
      n === null ||
      (["number", "boolean", "string"].includes(typeof n) && !Ac(n))
    )
      return n;
    var _ = vh(e, n);
    if (!_.startsWith("[object ")) return _;
    if (r === 0) return _.replace("object ", "");
    if (h(n)) return "[Circular ~]";
    var v = Array.isArray(n) ? [] : {},
      m = 0,
      w = ao(n) || Ai(n) ? tu(n) : n;
    for (var S in w)
      if (Object.prototype.hasOwnProperty.call(w, S)) {
        if (m >= s) {
          v[S] = "[MaxProperties ~]";
          break;
        }
        var P = w[S];
        (v[S] = iu(S, P, r - 1, s, a)), (m += 1);
      }
    return f(n), v;
  }
  function vh(e, n) {
    try {
      return e === "domain" && n && typeof n == "object" && n._events
        ? "[Domain]"
        : e === "domainEmitter"
          ? "[DomainEmitter]"
          : typeof global < "u" && n === global
            ? "[Global]"
            : typeof window < "u" && n === window
              ? "[Window]"
              : typeof document < "u" && n === document
                ? "[Document]"
                : Rc(n)
                  ? "[SyntheticEvent]"
                  : typeof n == "number" && n !== n
                    ? "[NaN]"
                    : n === void 0
                      ? "[undefined]"
                      : typeof n == "function"
                        ? "[Function: " + xe(n) + "]"
                        : typeof n == "symbol"
                          ? "[" + String(n) + "]"
                          : typeof n == "bigint"
                            ? "[BigInt: " + String(n) + "]"
                            : "[object " +
                              Object.getPrototypeOf(n).constructor.name +
                              "]";
    } catch (r) {
      return "**non-serializable** (" + r + ")";
    }
  }
  function yh(e) {
    return ~-encodeURI(e).split(/%..|./).length;
  }
  function wh(e) {
    return yh(JSON.stringify(e));
  }
  function We(e) {
    return new Te(function (n) {
      n(e);
    });
  }
  function Gn(e) {
    return new Te(function (n, r) {
      r(e);
    });
  }
  var Te = (function () {
    function e(n) {
      var r = this;
      (this._state = 0),
        (this._handlers = []),
        (this._resolve = function (s) {
          r._setResult(1, s);
        }),
        (this._reject = function (s) {
          r._setResult(2, s);
        }),
        (this._setResult = function (s, a) {
          if (r._state === 0) {
            if (lo(a)) {
              a.then(r._resolve, r._reject);
              return;
            }
            (r._state = s), (r._value = a), r._executeHandlers();
          }
        }),
        (this._executeHandlers = function () {
          if (r._state !== 0) {
            var s = r._handlers.slice();
            (r._handlers = []),
              s.forEach(function (a) {
                a[0] ||
                  (r._state === 1 && a[1](r._value),
                  r._state === 2 && a[2](r._value),
                  (a[0] = !0));
              });
          }
        });
      try {
        n(this._resolve, this._reject);
      } catch (s) {
        this._reject(s);
      }
    }
    return (
      (e.prototype.then = function (n, r) {
        var s = this;
        return new e(function (a, l) {
          s._handlers.push([
            !1,
            function (h) {
              if (!n) a(h);
              else
                try {
                  a(n(h));
                } catch (f) {
                  l(f);
                }
            },
            function (h) {
              if (!r) l(h);
              else
                try {
                  a(r(h));
                } catch (f) {
                  l(f);
                }
            },
          ]),
            s._executeHandlers();
        });
      }),
      (e.prototype.catch = function (n) {
        return this.then(function (r) {
          return r;
        }, n);
      }),
      (e.prototype.finally = function (n) {
        var r = this;
        return new e(function (s, a) {
          var l, h;
          return r
            .then(
              function (f) {
                (h = !1), (l = f), n && n();
              },
              function (f) {
                (h = !0), (l = f), n && n();
              },
            )
            .then(function () {
              if (h) {
                a(l);
                return;
              }
              s(l);
            });
        });
      }),
      e
    );
  })();
  function ru(e) {
    var n = [];
    function r() {
      return e === void 0 || n.length < e;
    }
    function s(h) {
      return n.splice(n.indexOf(h), 1)[0];
    }
    function a(h) {
      if (!r())
        return Gn(new Mt("Not adding Promise due to buffer limit reached."));
      var f = h();
      return (
        n.indexOf(f) === -1 && n.push(f),
        f
          .then(function () {
            return s(f);
          })
          .then(null, function () {
            return s(f).then(null, function () {});
          }),
        f
      );
    }
    function l(h) {
      return new Te(function (f, p) {
        var _ = n.length;
        if (!_) return f(!0);
        var v = setTimeout(function () {
          h && h > 0 && f(!1);
        }, h);
        n.forEach(function (m) {
          We(m).then(function () {
            --_ || (clearTimeout(v), f(!0));
          }, p);
        });
      });
    }
    return { $: n, add: a, drain: l };
  }
  function bh(e) {
    return Vc.indexOf(e) !== -1;
  }
  function Sh(e) {
    return e === "warn" ? ce.Warning : bh(e) ? e : ce.Log;
  }
  function ou(e) {
    return e >= 200 && e < 300
      ? "success"
      : e === 429
        ? "rate_limit"
        : e >= 400 && e < 500
          ? "invalid"
          : e >= 500
            ? "failed"
            : "unknown";
  }
  var Vr = {
    nowSeconds: function () {
      return Date.now() / 1e3;
    },
  };
  function Ph() {
    var e = yt().performance;
    if (!(!e || !e.now)) {
      var n = Date.now() - e.now();
      return {
        now: function () {
          return e.now();
        },
        timeOrigin: n,
      };
    }
  }
  function xh() {
    try {
      var e = Cc(Yu, "perf_hooks");
      return e.performance;
    } catch {
      return;
    }
  }
  var Mr = oo() ? xh() : Ph(),
    Js =
      Mr === void 0
        ? Vr
        : {
            nowSeconds: function () {
              return (Mr.timeOrigin + Mr.now()) / 1e3;
            },
          },
    Di = Vr.nowSeconds.bind(Vr),
    Qs = Js.nowSeconds.bind(Js);
  (function () {
    var e = yt().performance;
    if (!(!e || !e.now)) {
      var n = 3600 * 1e3,
        r = e.now(),
        s = Date.now(),
        a = e.timeOrigin ? Math.abs(e.timeOrigin + r - s) : n,
        l = a < n,
        h = e.timing && e.timing.navigationStart,
        f = typeof h == "number",
        p = f ? Math.abs(h + r - s) : n,
        _ = p < n;
      return l || _ ? (a <= p ? e.timeOrigin : h) : s;
    }
  })();
  function Zi(e, n) {
    return n === void 0 && (n = []), [e, n];
  }
  function Lh(e) {
    var n = Pe(e, 2),
      r = Pe(n[1], 1),
      s = Pe(r[0], 1),
      a = s[0];
    return a.type;
  }
  function Fi(e) {
    var n = Pe(e, 2),
      r = n[0],
      s = n[1],
      a = JSON.stringify(r);
    return s.reduce(function (l, h) {
      var f = Pe(h, 2),
        p = f[0],
        _ = f[1],
        v = uo(_) ? String(_) : JSON.stringify(_);
      return (
        l +
        `
` +
        JSON.stringify(p) +
        `
` +
        v
      );
    }, a);
  }
  function Th(e, n, r) {
    var s = [
      { type: "client_report" },
      { timestamp: Di(), discarded_events: e },
    ];
    return Zi(n ? { dsn: n } : {}, [s]);
  }
  var Eh = 60 * 1e3;
  function kh(e, n) {
    n === void 0 && (n = Date.now());
    var r = parseInt("" + e, 10);
    if (!isNaN(r)) return r * 1e3;
    var s = Date.parse("" + e);
    return isNaN(s) ? Eh : s - n;
  }
  function po(e, n) {
    return e[n] || e.all || 0;
  }
  function su(e, n, r) {
    return r === void 0 && (r = Date.now()), po(e, n) > r;
  }
  function au(e, n, r) {
    var s, a, l, h;
    r === void 0 && (r = Date.now());
    var f = Rt({}, e),
      p = n["x-sentry-rate-limits"],
      _ = n["retry-after"];
    if (p)
      try {
        for (
          var v = _n(p.trim().split(",")), m = v.next();
          !m.done;
          m = v.next()
        ) {
          var w = m.value,
            S = w.split(":", 2),
            P = parseInt(S[0], 10),
            O = (isNaN(P) ? 60 : P) * 1e3;
          if (!S[1]) f.all = r + O;
          else
            try {
              for (
                var I = ((l = void 0), _n(S[1].split(";"))), z = I.next();
                !z.done;
                z = I.next()
              ) {
                var M = z.value;
                f[M] = r + O;
              }
            } catch (C) {
              l = { error: C };
            } finally {
              try {
                z && !z.done && (h = I.return) && h.call(I);
              } finally {
                if (l) throw l.error;
              }
            }
        }
      } catch (C) {
        s = { error: C };
      } finally {
        try {
          m && !m.done && (a = v.return) && a.call(v);
        } finally {
          if (s) throw s.error;
        }
      }
    else _ && (f.all = r + kh(_, r));
    return f;
  }
  var ta = 100,
    Ci = (function () {
      function e() {
        (this._notifyingListeners = !1),
          (this._scopeListeners = []),
          (this._eventProcessors = []),
          (this._breadcrumbs = []),
          (this._user = {}),
          (this._tags = {}),
          (this._extra = {}),
          (this._contexts = {}),
          (this._sdkProcessingMetadata = {});
      }
      return (
        (e.clone = function (n) {
          var r = new e();
          return (
            n &&
              ((r._breadcrumbs = sn(n._breadcrumbs)),
              (r._tags = $({}, n._tags)),
              (r._extra = $({}, n._extra)),
              (r._contexts = $({}, n._contexts)),
              (r._user = n._user),
              (r._level = n._level),
              (r._span = n._span),
              (r._session = n._session),
              (r._transactionName = n._transactionName),
              (r._fingerprint = n._fingerprint),
              (r._eventProcessors = sn(n._eventProcessors)),
              (r._requestSession = n._requestSession)),
            r
          );
        }),
        (e.prototype.addScopeListener = function (n) {
          this._scopeListeners.push(n);
        }),
        (e.prototype.addEventProcessor = function (n) {
          return this._eventProcessors.push(n), this;
        }),
        (e.prototype.setUser = function (n) {
          return (
            (this._user = n || {}),
            this._session && this._session.update({ user: n }),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.getUser = function () {
          return this._user;
        }),
        (e.prototype.getRequestSession = function () {
          return this._requestSession;
        }),
        (e.prototype.setRequestSession = function (n) {
          return (this._requestSession = n), this;
        }),
        (e.prototype.setTags = function (n) {
          return (
            (this._tags = $($({}, this._tags), n)),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.setTag = function (n, r) {
          var s;
          return (
            (this._tags = $($({}, this._tags), ((s = {}), (s[n] = r), s))),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.setExtras = function (n) {
          return (
            (this._extra = $($({}, this._extra), n)),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.setExtra = function (n, r) {
          var s;
          return (
            (this._extra = $($({}, this._extra), ((s = {}), (s[n] = r), s))),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.setFingerprint = function (n) {
          return (this._fingerprint = n), this._notifyScopeListeners(), this;
        }),
        (e.prototype.setLevel = function (n) {
          return (this._level = n), this._notifyScopeListeners(), this;
        }),
        (e.prototype.setTransactionName = function (n) {
          return (
            (this._transactionName = n), this._notifyScopeListeners(), this
          );
        }),
        (e.prototype.setTransaction = function (n) {
          return this.setTransactionName(n);
        }),
        (e.prototype.setContext = function (n, r) {
          var s;
          return (
            r === null
              ? delete this._contexts[n]
              : (this._contexts = $(
                  $({}, this._contexts),
                  ((s = {}), (s[n] = r), s),
                )),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.setSpan = function (n) {
          return (this._span = n), this._notifyScopeListeners(), this;
        }),
        (e.prototype.getSpan = function () {
          return this._span;
        }),
        (e.prototype.getTransaction = function () {
          var n = this.getSpan();
          return n && n.transaction;
        }),
        (e.prototype.setSession = function (n) {
          return (
            n ? (this._session = n) : delete this._session,
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.getSession = function () {
          return this._session;
        }),
        (e.prototype.update = function (n) {
          if (!n) return this;
          if (typeof n == "function") {
            var r = n(this);
            return r instanceof e ? r : this;
          }
          return (
            n instanceof e
              ? ((this._tags = $($({}, this._tags), n._tags)),
                (this._extra = $($({}, this._extra), n._extra)),
                (this._contexts = $($({}, this._contexts), n._contexts)),
                n._user &&
                  Object.keys(n._user).length &&
                  (this._user = n._user),
                n._level && (this._level = n._level),
                n._fingerprint && (this._fingerprint = n._fingerprint),
                n._requestSession && (this._requestSession = n._requestSession))
              : pn(n) &&
                ((n = n),
                (this._tags = $($({}, this._tags), n.tags)),
                (this._extra = $($({}, this._extra), n.extra)),
                (this._contexts = $($({}, this._contexts), n.contexts)),
                n.user && (this._user = n.user),
                n.level && (this._level = n.level),
                n.fingerprint && (this._fingerprint = n.fingerprint),
                n.requestSession && (this._requestSession = n.requestSession)),
            this
          );
        }),
        (e.prototype.clear = function () {
          return (
            (this._breadcrumbs = []),
            (this._tags = {}),
            (this._extra = {}),
            (this._user = {}),
            (this._contexts = {}),
            (this._level = void 0),
            (this._transactionName = void 0),
            (this._fingerprint = void 0),
            (this._requestSession = void 0),
            (this._span = void 0),
            (this._session = void 0),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.addBreadcrumb = function (n, r) {
          var s = typeof r == "number" ? Math.min(r, ta) : ta;
          if (s <= 0) return this;
          var a = $({ timestamp: Di() }, n);
          return (
            (this._breadcrumbs = sn(this._breadcrumbs, [a]).slice(-s)),
            this._notifyScopeListeners(),
            this
          );
        }),
        (e.prototype.clearBreadcrumbs = function () {
          return (this._breadcrumbs = []), this._notifyScopeListeners(), this;
        }),
        (e.prototype.applyToEvent = function (n, r) {
          if (
            (this._extra &&
              Object.keys(this._extra).length &&
              (n.extra = $($({}, this._extra), n.extra)),
            this._tags &&
              Object.keys(this._tags).length &&
              (n.tags = $($({}, this._tags), n.tags)),
            this._user &&
              Object.keys(this._user).length &&
              (n.user = $($({}, this._user), n.user)),
            this._contexts &&
              Object.keys(this._contexts).length &&
              (n.contexts = $($({}, this._contexts), n.contexts)),
            this._level && (n.level = this._level),
            this._transactionName && (n.transaction = this._transactionName),
            this._span)
          ) {
            n.contexts = $({ trace: this._span.getTraceContext() }, n.contexts);
            var s = this._span.transaction && this._span.transaction.name;
            s && (n.tags = $({ transaction: s }, n.tags));
          }
          return (
            this._applyFingerprint(n),
            (n.breadcrumbs = sn(n.breadcrumbs || [], this._breadcrumbs)),
            (n.breadcrumbs = n.breadcrumbs.length > 0 ? n.breadcrumbs : void 0),
            (n.sdkProcessingMetadata = this._sdkProcessingMetadata),
            this._notifyEventProcessors(sn(uu(), this._eventProcessors), n, r)
          );
        }),
        (e.prototype.setSDKProcessingMetadata = function (n) {
          return (
            (this._sdkProcessingMetadata = $(
              $({}, this._sdkProcessingMetadata),
              n,
            )),
            this
          );
        }),
        (e.prototype._notifyEventProcessors = function (n, r, s, a) {
          var l = this;
          return (
            a === void 0 && (a = 0),
            new Te(function (h, f) {
              var p = n[a];
              if (r === null || typeof p != "function") h(r);
              else {
                var _ = p($({}, r), s);
                lo(_)
                  ? _.then(function (v) {
                      return l._notifyEventProcessors(n, v, s, a + 1).then(h);
                    }).then(null, f)
                  : l
                      ._notifyEventProcessors(n, _, s, a + 1)
                      .then(h)
                      .then(null, f);
              }
            })
          );
        }),
        (e.prototype._notifyScopeListeners = function () {
          var n = this;
          this._notifyingListeners ||
            ((this._notifyingListeners = !0),
            this._scopeListeners.forEach(function (r) {
              r(n);
            }),
            (this._notifyingListeners = !1));
        }),
        (e.prototype._applyFingerprint = function (n) {
          (n.fingerprint = n.fingerprint
            ? Array.isArray(n.fingerprint)
              ? n.fingerprint
              : [n.fingerprint]
            : []),
            this._fingerprint &&
              (n.fingerprint = n.fingerprint.concat(this._fingerprint)),
            n.fingerprint && !n.fingerprint.length && delete n.fingerprint;
        }),
        e
      );
    })();
  function uu() {
    return so("globalEventProcessors", function () {
      return [];
    });
  }
  function _o(e) {
    uu().push(e);
  }
  var Ch = (function () {
      function e(n) {
        (this.errors = 0),
          (this.sid = cn()),
          (this.duration = 0),
          (this.status = "ok"),
          (this.init = !0),
          (this.ignoreDuration = !1);
        var r = Qs();
        (this.timestamp = r), (this.started = r), n && this.update(n);
      }
      return (
        (e.prototype.update = function (n) {
          if (
            (n === void 0 && (n = {}),
            n.user &&
              (!this.ipAddress &&
                n.user.ip_address &&
                (this.ipAddress = n.user.ip_address),
              !this.did &&
                !n.did &&
                (this.did = n.user.id || n.user.email || n.user.username)),
            (this.timestamp = n.timestamp || Qs()),
            n.ignoreDuration && (this.ignoreDuration = n.ignoreDuration),
            n.sid && (this.sid = n.sid.length === 32 ? n.sid : cn()),
            n.init !== void 0 && (this.init = n.init),
            !this.did && n.did && (this.did = "" + n.did),
            typeof n.started == "number" && (this.started = n.started),
            this.ignoreDuration)
          )
            this.duration = void 0;
          else if (typeof n.duration == "number") this.duration = n.duration;
          else {
            var r = this.timestamp - this.started;
            this.duration = r >= 0 ? r : 0;
          }
          n.release && (this.release = n.release),
            n.environment && (this.environment = n.environment),
            !this.ipAddress && n.ipAddress && (this.ipAddress = n.ipAddress),
            !this.userAgent && n.userAgent && (this.userAgent = n.userAgent),
            typeof n.errors == "number" && (this.errors = n.errors),
            n.status && (this.status = n.status);
        }),
        (e.prototype.close = function (n) {
          n
            ? this.update({ status: n })
            : this.status === "ok"
              ? this.update({ status: "exited" })
              : this.update();
        }),
        (e.prototype.toJSON = function () {
          return Wr({
            sid: "" + this.sid,
            init: this.init,
            started: new Date(this.started * 1e3).toISOString(),
            timestamp: new Date(this.timestamp * 1e3).toISOString(),
            status: this.status,
            errors: this.errors,
            did:
              typeof this.did == "number" || typeof this.did == "string"
                ? "" + this.did
                : void 0,
            duration: this.duration,
            attrs: {
              release: this.release,
              environment: this.environment,
              ip_address: this.ipAddress,
              user_agent: this.userAgent,
            },
          });
        }),
        e
      );
    })(),
    ea = typeof __SENTRY_DEBUG__ > "u" ? !0 : __SENTRY_DEBUG__,
    mo = 4,
    Oh = 100,
    go = (function () {
      function e(n, r, s) {
        r === void 0 && (r = new Ci()),
          s === void 0 && (s = mo),
          (this._version = s),
          (this._stack = [{}]),
          (this.getStackTop().scope = r),
          n && this.bindClient(n);
      }
      return (
        (e.prototype.isOlderThan = function (n) {
          return this._version < n;
        }),
        (e.prototype.bindClient = function (n) {
          var r = this.getStackTop();
          (r.client = n), n && n.setupIntegrations && n.setupIntegrations();
        }),
        (e.prototype.pushScope = function () {
          var n = Ci.clone(this.getScope());
          return (
            this.getStack().push({ client: this.getClient(), scope: n }), n
          );
        }),
        (e.prototype.popScope = function () {
          return this.getStack().length <= 1 ? !1 : !!this.getStack().pop();
        }),
        (e.prototype.withScope = function (n) {
          var r = this.pushScope();
          try {
            n(r);
          } finally {
            this.popScope();
          }
        }),
        (e.prototype.getClient = function () {
          return this.getStackTop().client;
        }),
        (e.prototype.getScope = function () {
          return this.getStackTop().scope;
        }),
        (e.prototype.getStack = function () {
          return this._stack;
        }),
        (e.prototype.getStackTop = function () {
          return this._stack[this._stack.length - 1];
        }),
        (e.prototype.captureException = function (n, r) {
          var s = (this._lastEventId = r && r.event_id ? r.event_id : cn()),
            a = r;
          if (!r) {
            var l = void 0;
            try {
              throw new Error("Sentry syntheticException");
            } catch (h) {
              l = h;
            }
            a = { originalException: n, syntheticException: l };
          }
          return (
            this._invokeClient(
              "captureException",
              n,
              $($({}, a), { event_id: s }),
            ),
            s
          );
        }),
        (e.prototype.captureMessage = function (n, r, s) {
          var a = (this._lastEventId = s && s.event_id ? s.event_id : cn()),
            l = s;
          if (!s) {
            var h = void 0;
            try {
              throw new Error(n);
            } catch (f) {
              h = f;
            }
            l = { originalException: n, syntheticException: h };
          }
          return (
            this._invokeClient(
              "captureMessage",
              n,
              r,
              $($({}, l), { event_id: a }),
            ),
            a
          );
        }),
        (e.prototype.captureEvent = function (n, r) {
          var s = r && r.event_id ? r.event_id : cn();
          return (
            n.type !== "transaction" && (this._lastEventId = s),
            this._invokeClient("captureEvent", n, $($({}, r), { event_id: s })),
            s
          );
        }),
        (e.prototype.lastEventId = function () {
          return this._lastEventId;
        }),
        (e.prototype.addBreadcrumb = function (n, r) {
          var s = this.getStackTop(),
            a = s.scope,
            l = s.client;
          if (!(!a || !l)) {
            var h = (l.getOptions && l.getOptions()) || {},
              f = h.beforeBreadcrumb,
              p = f === void 0 ? null : f,
              _ = h.maxBreadcrumbs,
              v = _ === void 0 ? Oh : _;
            if (!(v <= 0)) {
              var m = Di(),
                w = $({ timestamp: m }, n),
                S = p
                  ? Ja(function () {
                      return p(w, r);
                    })
                  : w;
              S !== null && a.addBreadcrumb(S, v);
            }
          }
        }),
        (e.prototype.setUser = function (n) {
          var r = this.getScope();
          r && r.setUser(n);
        }),
        (e.prototype.setTags = function (n) {
          var r = this.getScope();
          r && r.setTags(n);
        }),
        (e.prototype.setExtras = function (n) {
          var r = this.getScope();
          r && r.setExtras(n);
        }),
        (e.prototype.setTag = function (n, r) {
          var s = this.getScope();
          s && s.setTag(n, r);
        }),
        (e.prototype.setExtra = function (n, r) {
          var s = this.getScope();
          s && s.setExtra(n, r);
        }),
        (e.prototype.setContext = function (n, r) {
          var s = this.getScope();
          s && s.setContext(n, r);
        }),
        (e.prototype.configureScope = function (n) {
          var r = this.getStackTop(),
            s = r.scope,
            a = r.client;
          s && a && n(s);
        }),
        (e.prototype.run = function (n) {
          var r = na(this);
          try {
            n(this);
          } finally {
            na(r);
          }
        }),
        (e.prototype.getIntegration = function (n) {
          var r = this.getClient();
          if (!r) return null;
          try {
            return r.getIntegration(n);
          } catch {
            return (
              ea &&
                rt.warn(
                  "Cannot retrieve integration " +
                    n.id +
                    " from the current Hub",
                ),
              null
            );
          }
        }),
        (e.prototype.startSpan = function (n) {
          return this._callExtensionMethod("startSpan", n);
        }),
        (e.prototype.startTransaction = function (n, r) {
          return this._callExtensionMethod("startTransaction", n, r);
        }),
        (e.prototype.traceHeaders = function () {
          return this._callExtensionMethod("traceHeaders");
        }),
        (e.prototype.captureSession = function (n) {
          if ((n === void 0 && (n = !1), n)) return this.endSession();
          this._sendSessionUpdate();
        }),
        (e.prototype.endSession = function () {
          var n = this.getStackTop(),
            r = n && n.scope,
            s = r && r.getSession();
          s && s.close(), this._sendSessionUpdate(), r && r.setSession();
        }),
        (e.prototype.startSession = function (n) {
          var r = this.getStackTop(),
            s = r.scope,
            a = r.client,
            l = (a && a.getOptions()) || {},
            h = l.release,
            f = l.environment,
            p = yt(),
            _ = (p.navigator || {}).userAgent,
            v = new Ch(
              $(
                $(
                  $({ release: h, environment: f }, s && { user: s.getUser() }),
                  _ && { userAgent: _ },
                ),
                n,
              ),
            );
          if (s) {
            var m = s.getSession && s.getSession();
            m && m.status === "ok" && m.update({ status: "exited" }),
              this.endSession(),
              s.setSession(v);
          }
          return v;
        }),
        (e.prototype._sendSessionUpdate = function () {
          var n = this.getStackTop(),
            r = n.scope,
            s = n.client;
          if (r) {
            var a = r.getSession && r.getSession();
            a && s && s.captureSession && s.captureSession(a);
          }
        }),
        (e.prototype._invokeClient = function (n) {
          for (var r, s = [], a = 1; a < arguments.length; a++)
            s[a - 1] = arguments[a];
          var l = this.getStackTop(),
            h = l.scope,
            f = l.client;
          f && f[n] && (r = f)[n].apply(r, sn(s, [h]));
        }),
        (e.prototype._callExtensionMethod = function (n) {
          for (var r = [], s = 1; s < arguments.length; s++)
            r[s - 1] = arguments[s];
          var a = Hi(),
            l = a.__SENTRY__;
          if (l && l.extensions && typeof l.extensions[n] == "function")
            return l.extensions[n].apply(this, r);
          ea &&
            rt.warn(
              "Extension method " + n + " couldn't be found, doing nothing.",
            );
        }),
        e
      );
    })();
  function Hi() {
    var e = yt();
    return (e.__SENTRY__ = e.__SENTRY__ || { extensions: {}, hub: void 0 }), e;
  }
  function na(e) {
    var n = Hi(),
      r = we(n);
    return vo(n, e), r;
  }
  function Zt() {
    var e = Hi();
    return (
      (!lu(e) || we(e).isOlderThan(mo)) && vo(e, new go()), oo() ? Mh(e) : we(e)
    );
  }
  function Mh(e) {
    try {
      var n = Hi().__SENTRY__,
        r =
          n &&
          n.extensions &&
          n.extensions.domain &&
          n.extensions.domain.active;
      if (!r) return we(e);
      if (!lu(r) || we(r).isOlderThan(mo)) {
        var s = we(e).getStackTop();
        vo(r, new go(s.client, Ci.clone(s.scope)));
      }
      return we(r);
    } catch {
      return we(e);
    }
  }
  function lu(e) {
    return !!(e && e.__SENTRY__ && e.__SENTRY__.hub);
  }
  function we(e) {
    return so(
      "hub",
      function () {
        return new go();
      },
      e,
    );
  }
  function vo(e, n) {
    if (!e) return !1;
    var r = (e.__SENTRY__ = e.__SENTRY__ || {});
    return (r.hub = n), !0;
  }
  function cu(e) {
    for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
    var s = Zt();
    if (s && s[e]) return s[e].apply(s, Lc(n));
    throw new Error(
      "No hub defined or " +
        e +
        " was not found on the hub, please open a bug report.",
    );
  }
  function Ih(e, n) {
    var r = new Error("Sentry syntheticException");
    return cu("captureException", e, {
      captureContext: n,
      originalException: e,
      syntheticException: r,
    });
  }
  function zh(e) {
    cu("withScope", e);
  }
  var Rh = "7";
  function Oi(e, n, r) {
    return { initDsn: e, metadata: n || {}, dsn: co(e), tunnel: r };
  }
  function hu(e) {
    var n = e.protocol ? e.protocol + ":" : "",
      r = e.port ? ":" + e.port : "";
    return n + "//" + e.host + r + (e.path ? "/" + e.path : "") + "/api/";
  }
  function fu(e, n) {
    return "" + hu(e) + e.projectId + "/" + n + "/";
  }
  function du(e) {
    return Kc({ sentry_key: e.publicKey, sentry_version: Rh });
  }
  function Ah(e) {
    return fu(e, "store");
  }
  function pu(e) {
    return Ah(e) + "?" + du(e);
  }
  function Bh(e) {
    return fu(e, "envelope");
  }
  function Ui(e, n) {
    return n || Bh(e) + "?" + du(e);
  }
  function Nh(e, n) {
    var r = co(e),
      s = hu(r) + "embed/error-page/",
      a = "dsn=" + Xn(r);
    for (var l in n)
      if (l !== "dsn")
        if (l === "user") {
          if (!n.user) continue;
          n.user.name && (a += "&name=" + encodeURIComponent(n.user.name)),
            n.user.email && (a += "&email=" + encodeURIComponent(n.user.email));
        } else
          a += "&" + encodeURIComponent(l) + "=" + encodeURIComponent(n[l]);
    return s + "?" + a;
  }
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var vt =
    function () {
      return (
        (vt =
          Object.assign ||
          function (n) {
            for (var r, s = 1, a = arguments.length; s < a; s++) {
              r = arguments[s];
              for (var l in r)
                Object.prototype.hasOwnProperty.call(r, l) && (n[l] = r[l]);
            }
            return n;
          }),
        vt.apply(this, arguments)
      );
    };
  function Dh(e) {
    var n = typeof Symbol == "function" && Symbol.iterator,
      r = n && e[n],
      s = 0;
    if (r) return r.call(e);
    if (e && typeof e.length == "number")
      return {
        next: function () {
          return (
            e && s >= e.length && (e = void 0), { value: e && e[s++], done: !e }
          );
        },
      };
    throw new TypeError(
      n ? "Object is not iterable." : "Symbol.iterator is not defined.",
    );
  }
  function yo(e, n) {
    var r = typeof Symbol == "function" && e[Symbol.iterator];
    if (!r) return e;
    var s = r.call(e),
      a,
      l = [],
      h;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = s.next()).done; )
        l.push(a.value);
    } catch (f) {
      h = { error: f };
    } finally {
      try {
        a && !a.done && (r = s.return) && r.call(s);
      } finally {
        if (h) throw h.error;
      }
    }
    return l;
  }
  function ae() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e = e.concat(yo(arguments[n]));
    return e;
  }
  var kt = typeof __SENTRY_DEBUG__ > "u" ? !0 : __SENTRY_DEBUG__,
    ia = [];
  function ra(e) {
    return e.reduce(function (n, r) {
      return (
        n.every(function (s) {
          return r.name !== s.name;
        }) && n.push(r),
        n
      );
    }, []);
  }
  function Zh(e) {
    var n = (e.defaultIntegrations && ae(e.defaultIntegrations)) || [],
      r = e.integrations,
      s = ae(ra(n));
    Array.isArray(r)
      ? (s = ae(
          s.filter(function (h) {
            return r.every(function (f) {
              return f.name !== h.name;
            });
          }),
          ra(r),
        ))
      : typeof r == "function" &&
        ((s = r(s)), (s = Array.isArray(s) ? s : [s]));
    var a = s.map(function (h) {
        return h.name;
      }),
      l = "Debug";
    return (
      a.indexOf(l) !== -1 && s.push.apply(s, ae(s.splice(a.indexOf(l), 1))), s
    );
  }
  function Fh(e) {
    ia.indexOf(e.name) === -1 &&
      (e.setupOnce(_o, Zt),
      ia.push(e.name),
      kt && rt.log("Integration installed: " + e.name));
  }
  function Hh(e) {
    var n = {};
    return (
      Zh(e).forEach(function (r) {
        (n[r.name] = r), Fh(r);
      }),
      Bi(n, "initialized", !0),
      n
    );
  }
  var oa = "Not capturing exception because it's already been captured.",
    Uh = (function () {
      function e(n, r) {
        (this._integrations = {}),
          (this._numProcessing = 0),
          (this._backend = new n(r)),
          (this._options = r),
          r.dsn && (this._dsn = co(r.dsn));
      }
      return (
        (e.prototype.captureException = function (n, r, s) {
          var a = this;
          if (Xs(n)) {
            kt && rt.log(oa);
            return;
          }
          var l = r && r.event_id;
          return (
            this._process(
              this._getBackend()
                .eventFromException(n, r)
                .then(function (h) {
                  return a._captureEvent(h, r, s);
                })
                .then(function (h) {
                  l = h;
                }),
            ),
            l
          );
        }),
        (e.prototype.captureMessage = function (n, r, s, a) {
          var l = this,
            h = s && s.event_id,
            f = uo(n)
              ? this._getBackend().eventFromMessage(String(n), r, s)
              : this._getBackend().eventFromException(n, s);
          return (
            this._process(
              f
                .then(function (p) {
                  return l._captureEvent(p, s, a);
                })
                .then(function (p) {
                  h = p;
                }),
            ),
            h
          );
        }),
        (e.prototype.captureEvent = function (n, r, s) {
          if (r && r.originalException && Xs(r.originalException)) {
            kt && rt.log(oa);
            return;
          }
          var a = r && r.event_id;
          return (
            this._process(
              this._captureEvent(n, r, s).then(function (l) {
                a = l;
              }),
            ),
            a
          );
        }),
        (e.prototype.captureSession = function (n) {
          if (!this._isEnabled()) {
            kt && rt.warn("SDK not enabled, will not capture session.");
            return;
          }
          typeof n.release != "string"
            ? kt &&
              rt.warn(
                "Discarded session because of missing or non-string release",
              )
            : (this._sendSession(n), n.update({ init: !1 }));
        }),
        (e.prototype.getDsn = function () {
          return this._dsn;
        }),
        (e.prototype.getOptions = function () {
          return this._options;
        }),
        (e.prototype.getTransport = function () {
          return this._getBackend().getTransport();
        }),
        (e.prototype.flush = function (n) {
          var r = this;
          return this._isClientDoneProcessing(n).then(function (s) {
            return r
              .getTransport()
              .close(n)
              .then(function (a) {
                return s && a;
              });
          });
        }),
        (e.prototype.close = function (n) {
          var r = this;
          return this.flush(n).then(function (s) {
            return (r.getOptions().enabled = !1), s;
          });
        }),
        (e.prototype.setupIntegrations = function () {
          this._isEnabled() &&
            !this._integrations.initialized &&
            (this._integrations = Hh(this._options));
        }),
        (e.prototype.getIntegration = function (n) {
          try {
            return this._integrations[n.id] || null;
          } catch {
            return (
              kt &&
                rt.warn(
                  "Cannot retrieve integration " +
                    n.id +
                    " from the current Client",
                ),
              null
            );
          }
        }),
        (e.prototype._updateSessionFromEvent = function (n, r) {
          var s,
            a,
            l = !1,
            h = !1,
            f = r.exception && r.exception.values;
          if (f) {
            h = !0;
            try {
              for (var p = Dh(f), _ = p.next(); !_.done; _ = p.next()) {
                var v = _.value,
                  m = v.mechanism;
                if (m && m.handled === !1) {
                  l = !0;
                  break;
                }
              }
            } catch (P) {
              s = { error: P };
            } finally {
              try {
                _ && !_.done && (a = p.return) && a.call(p);
              } finally {
                if (s) throw s.error;
              }
            }
          }
          var w = n.status === "ok",
            S = (w && n.errors === 0) || (w && l);
          S &&
            (n.update(
              vt(vt({}, l && { status: "crashed" }), {
                errors: n.errors || Number(h || l),
              }),
            ),
            this.captureSession(n));
        }),
        (e.prototype._sendSession = function (n) {
          this._getBackend().sendSession(n);
        }),
        (e.prototype._isClientDoneProcessing = function (n) {
          var r = this;
          return new Te(function (s) {
            var a = 0,
              l = 1,
              h = setInterval(function () {
                r._numProcessing == 0
                  ? (clearInterval(h), s(!0))
                  : ((a += l), n && a >= n && (clearInterval(h), s(!1)));
              }, l);
          });
        }),
        (e.prototype._getBackend = function () {
          return this._backend;
        }),
        (e.prototype._isEnabled = function () {
          return this.getOptions().enabled !== !1 && this._dsn !== void 0;
        }),
        (e.prototype._prepareEvent = function (n, r, s) {
          var a = this,
            l = this.getOptions(),
            h = l.normalizeDepth,
            f = h === void 0 ? 3 : h,
            p = l.normalizeMaxBreadth,
            _ = p === void 0 ? 1e3 : p,
            v = vt(vt({}, n), {
              event_id: n.event_id || (s && s.event_id ? s.event_id : cn()),
              timestamp: n.timestamp || Di(),
            });
          this._applyClientOptions(v), this._applyIntegrationsMetadata(v);
          var m = r;
          s && s.captureContext && (m = Ci.clone(m).update(s.captureContext));
          var w = We(v);
          return (
            m && (w = m.applyToEvent(v, s)),
            w.then(function (S) {
              return (
                S &&
                  (S.sdkProcessingMetadata = vt(
                    vt({}, S.sdkProcessingMetadata),
                    { normalizeDepth: Be(f) + " (" + typeof f + ")" },
                  )),
                typeof f == "number" && f > 0 ? a._normalizeEvent(S, f, _) : S
              );
            })
          );
        }),
        (e.prototype._normalizeEvent = function (n, r, s) {
          if (!n) return null;
          var a = vt(
            vt(
              vt(
                vt(
                  vt({}, n),
                  n.breadcrumbs && {
                    breadcrumbs: n.breadcrumbs.map(function (l) {
                      return vt(
                        vt({}, l),
                        l.data && { data: Be(l.data, r, s) },
                      );
                    }),
                  },
                ),
                n.user && { user: Be(n.user, r, s) },
              ),
              n.contexts && { contexts: Be(n.contexts, r, s) },
            ),
            n.extra && { extra: Be(n.extra, r, s) },
          );
          return (
            n.contexts &&
              n.contexts.trace &&
              (a.contexts.trace = n.contexts.trace),
            (a.sdkProcessingMetadata = vt(vt({}, a.sdkProcessingMetadata), {
              baseClientNormalized: !0,
            })),
            a
          );
        }),
        (e.prototype._applyClientOptions = function (n) {
          var r = this.getOptions(),
            s = r.environment,
            a = r.release,
            l = r.dist,
            h = r.maxValueLength,
            f = h === void 0 ? 250 : h;
          "environment" in n ||
            (n.environment = "environment" in r ? s : "production"),
            n.release === void 0 && a !== void 0 && (n.release = a),
            n.dist === void 0 && l !== void 0 && (n.dist = l),
            n.message && (n.message = Fn(n.message, f));
          var p = n.exception && n.exception.values && n.exception.values[0];
          p && p.value && (p.value = Fn(p.value, f));
          var _ = n.request;
          _ && _.url && (_.url = Fn(_.url, f));
        }),
        (e.prototype._applyIntegrationsMetadata = function (n) {
          var r = Object.keys(this._integrations);
          r.length > 0 &&
            ((n.sdk = n.sdk || {}),
            (n.sdk.integrations = ae(n.sdk.integrations || [], r)));
        }),
        (e.prototype._sendEvent = function (n) {
          this._getBackend().sendEvent(n);
        }),
        (e.prototype._captureEvent = function (n, r, s) {
          return this._processEvent(n, r, s).then(
            function (a) {
              return a.event_id;
            },
            function (a) {
              kt && rt.error(a);
            },
          );
        }),
        (e.prototype._processEvent = function (n, r, s) {
          var a = this,
            l = this.getOptions(),
            h = l.beforeSend,
            f = l.sampleRate,
            p = this.getTransport();
          function _(m, w) {
            p.recordLostEvent && p.recordLostEvent(m, w);
          }
          if (!this._isEnabled())
            return Gn(new Mt("SDK not enabled, will not capture event."));
          var v = n.type === "transaction";
          return !v && typeof f == "number" && Math.random() > f
            ? (_("sample_rate", "event"),
              Gn(
                new Mt(
                  "Discarding event because it's not included in the random sample (sampling rate = " +
                    f +
                    ")",
                ),
              ))
            : this._prepareEvent(n, s, r)
                .then(function (m) {
                  if (m === null)
                    throw (
                      (_("event_processor", n.type || "event"),
                      new Mt(
                        "An event processor returned null, will not send event.",
                      ))
                    );
                  var w = r && r.data && r.data.__sentry__ === !0;
                  if (w || v || !h) return m;
                  var S = h(m, r);
                  return jh(S);
                })
                .then(function (m) {
                  if (m === null)
                    throw (
                      (_("before_send", n.type || "event"),
                      new Mt(
                        "`beforeSend` returned `null`, will not send event.",
                      ))
                    );
                  var w = s && s.getSession && s.getSession();
                  return (
                    !v && w && a._updateSessionFromEvent(w, m),
                    a._sendEvent(m),
                    m
                  );
                })
                .then(null, function (m) {
                  throw m instanceof Mt
                    ? m
                    : (a.captureException(m, {
                        data: { __sentry__: !0 },
                        originalException: m,
                      }),
                      new Mt(
                        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ` + m,
                      ));
                });
        }),
        (e.prototype._process = function (n) {
          var r = this;
          (this._numProcessing += 1),
            n.then(
              function (s) {
                return (r._numProcessing -= 1), s;
              },
              function (s) {
                return (r._numProcessing -= 1), s;
              },
            );
        }),
        e
      );
    })();
  function jh(e) {
    var n = "`beforeSend` method has to return `null` or a valid event.";
    if (lo(e))
      return e.then(
        function (r) {
          if (!(pn(r) || r === null)) throw new Mt(n);
          return r;
        },
        function (r) {
          throw new Mt("beforeSend rejected with " + r);
        },
      );
    if (!(pn(e) || e === null)) throw new Mt(n);
    return e;
  }
  function wo(e) {
    if (!(!e.metadata || !e.metadata.sdk)) {
      var n = e.metadata.sdk,
        r = n.name,
        s = n.version;
      return { name: r, version: s };
    }
  }
  function _u(e, n) {
    return (
      n &&
        ((e.sdk = e.sdk || {}),
        (e.sdk.name = e.sdk.name || n.name),
        (e.sdk.version = e.sdk.version || n.version),
        (e.sdk.integrations = ae(
          e.sdk.integrations || [],
          n.integrations || [],
        )),
        (e.sdk.packages = ae(e.sdk.packages || [], n.packages || []))),
      e
    );
  }
  function mu(e, n) {
    var r = wo(n),
      s = vt(
        vt({ sent_at: new Date().toISOString() }, r && { sdk: r }),
        !!n.tunnel && { dsn: Xn(n.dsn) },
      ),
      a = "aggregates" in e ? "sessions" : "session",
      l = [{ type: a }, e],
      h = Zi(s, [l]);
    return [h, a];
  }
  function Wh(e, n) {
    var r = yo(mu(e, n), 2),
      s = r[0],
      a = r[1];
    return { body: Fi(s), type: a, url: Ui(n.dsn, n.tunnel) };
  }
  function qh(e, n) {
    var r = wo(n),
      s = e.type || "event",
      a = (e.sdkProcessingMetadata || {}).transactionSampling,
      l = a || {},
      h = l.method,
      f = l.rate;
    _u(e, n.metadata.sdk),
      (e.tags = e.tags || {}),
      (e.extra = e.extra || {}),
      (e.sdkProcessingMetadata &&
        e.sdkProcessingMetadata.baseClientNormalized) ||
        ((e.tags.skippedNormalization = !0),
        (e.extra.normalizeDepth = e.sdkProcessingMetadata
          ? e.sdkProcessingMetadata.normalizeDepth
          : "unset")),
      delete e.sdkProcessingMetadata;
    var p = vt(
        vt(
          { event_id: e.event_id, sent_at: new Date().toISOString() },
          r && { sdk: r },
        ),
        !!n.tunnel && { dsn: Xn(n.dsn) },
      ),
      _ = [{ type: s, sample_rates: [{ id: h, rate: f }] }, e];
    return Zi(p, [_]);
  }
  function Gh(e, n) {
    var r = wo(n),
      s = e.type || "event",
      a = s === "transaction" || !!n.tunnel,
      l = (e.sdkProcessingMetadata || {}).transactionSampling,
      h = l || {},
      f = h.method,
      p = h.rate;
    _u(e, n.metadata.sdk),
      (e.tags = e.tags || {}),
      (e.extra = e.extra || {}),
      (e.sdkProcessingMetadata &&
        e.sdkProcessingMetadata.baseClientNormalized) ||
        ((e.tags.skippedNormalization = !0),
        (e.extra.normalizeDepth = e.sdkProcessingMetadata
          ? e.sdkProcessingMetadata.normalizeDepth
          : "unset")),
      delete e.sdkProcessingMetadata;
    var _;
    try {
      _ = JSON.stringify(e);
    } catch (O) {
      (e.tags.JSONStringifyError = !0), (e.extra.JSONStringifyError = O);
      try {
        _ = JSON.stringify(Be(e));
      } catch (I) {
        var v = I;
        _ = JSON.stringify({
          message: "JSON.stringify error after renormalization",
          extra: { message: v.message, stack: v.stack },
        });
      }
    }
    var m = { body: _, type: s, url: a ? Ui(n.dsn, n.tunnel) : pu(n.dsn) };
    if (a) {
      var w = vt(
          vt(
            { event_id: e.event_id, sent_at: new Date().toISOString() },
            r && { sdk: r },
          ),
          !!n.tunnel && { dsn: Xn(n.dsn) },
        ),
        S = [{ type: s, sample_rates: [{ id: f, rate: p }] }, m.body],
        P = Zi(w, [S]);
      m.body = Fi(P);
    }
    return m;
  }
  var Vh = (function () {
      function e() {}
      return (
        (e.prototype.sendEvent = function (n) {
          return We({
            reason:
              "NoopTransport: Event has been skipped because no Dsn is configured.",
            status: "skipped",
          });
        }),
        (e.prototype.close = function (n) {
          return We(!0);
        }),
        e
      );
    })(),
    $h = (function () {
      function e(n) {
        (this._options = n),
          this._options.dsn ||
            (kt && rt.warn("No DSN provided, backend will not do anything.")),
          (this._transport = this._setupTransport());
      }
      return (
        (e.prototype.eventFromException = function (n, r) {
          throw new Mt("Backend has to implement `eventFromException` method");
        }),
        (e.prototype.eventFromMessage = function (n, r, s) {
          throw new Mt("Backend has to implement `eventFromMessage` method");
        }),
        (e.prototype.sendEvent = function (n) {
          if (
            this._newTransport &&
            this._options.dsn &&
            this._options._experiments &&
            this._options._experiments.newTransport
          ) {
            var r = Oi(
                this._options.dsn,
                this._options._metadata,
                this._options.tunnel,
              ),
              s = qh(n, r);
            this._newTransport.send(s).then(null, function (a) {
              kt && rt.error("Error while sending event:", a);
            });
          } else
            this._transport.sendEvent(n).then(null, function (a) {
              kt && rt.error("Error while sending event:", a);
            });
        }),
        (e.prototype.sendSession = function (n) {
          if (!this._transport.sendSession) {
            kt &&
              rt.warn(
                "Dropping session because custom transport doesn't implement sendSession",
              );
            return;
          }
          if (
            this._newTransport &&
            this._options.dsn &&
            this._options._experiments &&
            this._options._experiments.newTransport
          ) {
            var r = Oi(
                this._options.dsn,
                this._options._metadata,
                this._options.tunnel,
              ),
              s = yo(mu(n, r), 1),
              a = s[0];
            this._newTransport.send(a).then(null, function (l) {
              kt && rt.error("Error while sending session:", l);
            });
          } else
            this._transport.sendSession(n).then(null, function (l) {
              kt && rt.error("Error while sending session:", l);
            });
        }),
        (e.prototype.getTransport = function () {
          return this._transport;
        }),
        (e.prototype._setupTransport = function () {
          return new Vh();
        }),
        e
      );
    })();
  function Yh(e, n) {
    n.debug === !0 &&
      (kt
        ? rt.enable()
        : console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.",
          ));
    var r = Zt(),
      s = r.getScope();
    s && s.update(n.initialScope);
    var a = new e(n);
    r.bindClient(a);
  }
  var Kh = 30;
  function gu(e, n, r) {
    r === void 0 && (r = ru(e.bufferSize || Kh));
    var s = {},
      a = function (h) {
        return r.drain(h);
      };
    function l(h) {
      var f = Lh(h),
        p = f === "event" ? "error" : f,
        _ = { category: p, body: Fi(h) };
      if (su(s, p)) return Gn({ status: "rate_limit", reason: sa(s, p) });
      var v = function () {
        return n(_).then(function (m) {
          var w = m.body,
            S = m.headers,
            P = m.reason,
            O = m.statusCode,
            I = ou(O);
          return (
            S && (s = au(s, S)),
            I === "success"
              ? We({ status: I, reason: P })
              : Gn({
                  status: I,
                  reason:
                    P ||
                    w ||
                    (I === "rate_limit" ? sa(s, p) : "Unknown transport error"),
                })
          );
        });
      };
      return r.add(v);
    }
    return { send: l, flush: a };
  }
  function sa(e, n) {
    return (
      "Too many " +
      n +
      " requests, backing off until: " +
      new Date(po(e, n)).toISOString()
    );
  }
  var aa = "6.19.7",
    ua,
    Xh = (function () {
      function e() {
        this.name = e.id;
      }
      return (
        (e.prototype.setupOnce = function () {
          (ua = Function.prototype.toString),
            (Function.prototype.toString = function () {
              for (var n = [], r = 0; r < arguments.length; r++)
                n[r] = arguments[r];
              var s = fo(this) || this;
              return ua.apply(s, n);
            });
        }),
        (e.id = "FunctionToString"),
        e
      );
    })(),
    Jh = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/],
    Qh = (function () {
      function e(n) {
        n === void 0 && (n = {}), (this._options = n), (this.name = e.id);
      }
      return (
        (e.prototype.setupOnce = function (n, r) {
          n(function (s) {
            var a = r();
            if (a) {
              var l = a.getIntegration(e);
              if (l) {
                var h = a.getClient(),
                  f = h ? h.getOptions() : {},
                  p = tf(l._options, f);
                return ef(s, p) ? null : s;
              }
            }
            return s;
          });
        }),
        (e.id = "InboundFilters"),
        e
      );
    })();
  function tf(e, n) {
    return (
      e === void 0 && (e = {}),
      n === void 0 && (n = {}),
      {
        allowUrls: ae(
          e.whitelistUrls || [],
          e.allowUrls || [],
          n.whitelistUrls || [],
          n.allowUrls || [],
        ),
        denyUrls: ae(
          e.blacklistUrls || [],
          e.denyUrls || [],
          n.blacklistUrls || [],
          n.denyUrls || [],
        ),
        ignoreErrors: ae(e.ignoreErrors || [], n.ignoreErrors || [], Jh),
        ignoreInternal: e.ignoreInternal !== void 0 ? e.ignoreInternal : !0,
      }
    );
  }
  function ef(e, n) {
    return n.ignoreInternal && af(e)
      ? (kt &&
          rt.warn(
            `Event dropped due to being internal Sentry Error.
Event: ` + Ne(e),
          ),
        !0)
      : nf(e, n.ignoreErrors)
        ? (kt &&
            rt.warn(
              "Event dropped due to being matched by `ignoreErrors` option.\nEvent: " +
                Ne(e),
            ),
          !0)
        : rf(e, n.denyUrls)
          ? (kt &&
              rt.warn(
                "Event dropped due to being matched by `denyUrls` option.\nEvent: " +
                  Ne(e) +
                  `.
Url: ` +
                  Mi(e),
              ),
            !0)
          : of(e, n.allowUrls)
            ? !1
            : (kt &&
                rt.warn(
                  "Event dropped due to not being matched by `allowUrls` option.\nEvent: " +
                    Ne(e) +
                    `.
Url: ` +
                    Mi(e),
                ),
              !0);
  }
  function nf(e, n) {
    return !n || !n.length
      ? !1
      : sf(e).some(function (r) {
          return n.some(function (s) {
            return ho(r, s);
          });
        });
  }
  function rf(e, n) {
    if (!n || !n.length) return !1;
    var r = Mi(e);
    return r
      ? n.some(function (s) {
          return ho(r, s);
        })
      : !1;
  }
  function of(e, n) {
    if (!n || !n.length) return !0;
    var r = Mi(e);
    return r
      ? n.some(function (s) {
          return ho(r, s);
        })
      : !0;
  }
  function sf(e) {
    if (e.message) return [e.message];
    if (e.exception)
      try {
        var n = (e.exception.values && e.exception.values[0]) || {},
          r = n.type,
          s = r === void 0 ? "" : r,
          a = n.value,
          l = a === void 0 ? "" : a;
        return ["" + l, s + ": " + l];
      } catch {
        return kt && rt.error("Cannot extract message for event " + Ne(e)), [];
      }
    return [];
  }
  function af(e) {
    try {
      return e.exception.values[0].type === "SentryError";
    } catch {}
    return !1;
  }
  function la(e) {
    e === void 0 && (e = []);
    for (var n = e.length - 1; n >= 0; n--) {
      var r = e[n];
      if (r && r.filename !== "<anonymous>" && r.filename !== "[native code]")
        return r.filename || null;
    }
    return null;
  }
  function Mi(e) {
    try {
      if (e.stacktrace) return la(e.stacktrace.frames);
      var n;
      try {
        n = e.exception.values[0].stacktrace.frames;
      } catch {}
      return n ? la(n) : null;
    } catch {
      return kt && rt.error("Cannot extract url for event " + Ne(e)), null;
    }
  }
  var bn = "?",
    uf = 10,
    lf = 20,
    cf = 30,
    hf = 40,
    ff = 50;
  function Jn(e, n, r, s) {
    var a = { filename: e, function: n, in_app: !0 };
    return r !== void 0 && (a.lineno = r), s !== void 0 && (a.colno = s), a;
  }
  var df =
      /^\s*at (?:(.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    pf = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    _f = function (e) {
      var n = df.exec(e);
      if (n) {
        var r = n[2] && n[2].indexOf("eval") === 0;
        if (r) {
          var s = pf.exec(n[2]);
          s && ((n[2] = s[1]), (n[3] = s[2]), (n[4] = s[3]));
        }
        var a = vn(vu(n[1] || bn, n[2]), 2),
          l = a[0],
          h = a[1];
        return Jn(h, l, n[3] ? +n[3] : void 0, n[4] ? +n[4] : void 0);
      }
    },
    mf = [cf, _f],
    gf =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|capacitor).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
    vf = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    yf = function (e) {
      var n,
        r = gf.exec(e);
      if (r) {
        var s = r[3] && r[3].indexOf(" > eval") > -1;
        if (s) {
          var a = vf.exec(r[3]);
          a &&
            ((r[1] = r[1] || "eval"),
            (r[3] = a[1]),
            (r[4] = a[2]),
            (r[5] = ""));
        }
        var l = r[3],
          h = r[1] || bn;
        return (
          (n = vn(vu(h, l), 2)),
          (h = n[0]),
          (l = n[1]),
          Jn(l, h, r[4] ? +r[4] : void 0, r[5] ? +r[5] : void 0)
        );
      }
    },
    wf = [ff, yf],
    bf =
      /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    Sf = function (e) {
      var n = bf.exec(e);
      return n ? Jn(n[2], n[1] || bn, +n[3], n[4] ? +n[4] : void 0) : void 0;
    },
    Pf = [hf, Sf],
    xf = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
    Lf = function (e) {
      var n = xf.exec(e);
      return n ? Jn(n[2], n[3] || bn, +n[1]) : void 0;
    },
    Tf = [uf, Lf],
    Ef =
      / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
    kf = function (e) {
      var n = Ef.exec(e);
      return n ? Jn(n[5], n[3] || n[4] || bn, +n[1], +n[2]) : void 0;
    },
    Cf = [lf, kf],
    vu = function (e, n) {
      var r = e.indexOf("safari-extension") !== -1,
        s = e.indexOf("safari-web-extension") !== -1;
      return r || s
        ? [
            e.indexOf("@") !== -1 ? e.split("@")[0] : bn,
            r ? "safari-extension:" + n : "safari-web-extension:" + n,
          ]
        : [e, n];
    };
  function yu(e) {
    var n = bo(e),
      r = { type: e && e.name, value: zf(e) };
    return (
      n.length && (r.stacktrace = { frames: n }),
      r.type === void 0 &&
        r.value === "" &&
        (r.value = "Unrecoverable error caught"),
      r
    );
  }
  function Of(e, n, r) {
    var s = {
      exception: {
        values: [
          {
            type: Ai(e)
              ? e.constructor.name
              : r
                ? "UnhandledRejection"
                : "Error",
            value:
              "Non-Error " +
              (r ? "promise rejection" : "exception") +
              " captured with keys: " +
              Xc(e),
          },
        ],
      },
      extra: { __serialized__: nu(e) },
    };
    if (n) {
      var a = bo(n);
      a.length && (s.stacktrace = { frames: a });
    }
    return s;
  }
  function Ir(e) {
    return { exception: { values: [yu(e)] } };
  }
  function bo(e) {
    var n = e.stacktrace || e.stack || "",
      r = If(e);
    try {
      return Qc(Tf, Cf, mf, Pf, wf)(n, r);
    } catch {}
    return [];
  }
  var Mf = /Minified React error #\d+;/i;
  function If(e) {
    if (e) {
      if (typeof e.framesToPop == "number") return e.framesToPop;
      if (Mf.test(e.message)) return 1;
    }
    return 0;
  }
  function zf(e) {
    var n = e && e.message;
    return n
      ? n.error && typeof n.error.message == "string"
        ? n.error.message
        : n
      : "No error message";
  }
  function Rf(e, n, r) {
    var s = (n && n.syntheticException) || void 0,
      a = So(e, s, r);
    return (
      qn(a),
      (a.level = ce.Error),
      n && n.event_id && (a.event_id = n.event_id),
      We(a)
    );
  }
  function Af(e, n, r, s) {
    n === void 0 && (n = ce.Info);
    var a = (r && r.syntheticException) || void 0,
      l = $r(e, a, s);
    return (l.level = n), r && r.event_id && (l.event_id = r.event_id), We(l);
  }
  function So(e, n, r, s) {
    var a;
    if (Ka(e) && e.error) {
      var l = e;
      return Ir(l.error);
    }
    if (Ws(e) || Mc(e)) {
      var h = e;
      if ("stack" in e) a = Ir(e);
      else {
        var f = h.name || (Ws(h) ? "DOMError" : "DOMException"),
          p = h.message ? f + ": " + h.message : f;
        (a = $r(p, n, r)), Gr(a, p);
      }
      return (
        "code" in h &&
          (a.tags = _t(_t({}, a.tags), { "DOMException.code": "" + h.code })),
        a
      );
    }
    if (ao(e)) return Ir(e);
    if (pn(e) || Ai(e)) {
      var _ = e;
      return (a = Of(_, n, s)), qn(a, { synthetic: !0 }), a;
    }
    return (a = $r(e, n, r)), Gr(a, "" + e), qn(a, { synthetic: !0 }), a;
  }
  function $r(e, n, r) {
    var s = { message: e };
    if (r && n) {
      var a = bo(n);
      a.length && (s.stacktrace = { frames: a });
    }
    return s;
  }
  var $t = typeof __SENTRY_DEBUG__ > "u" ? !0 : __SENTRY_DEBUG__,
    Jt = yt(),
    bi;
  function Po() {
    if (bi) return bi;
    if (qr(Jt.fetch)) return (bi = Jt.fetch.bind(Jt));
    var e = Jt.document,
      n = Jt.fetch;
    if (e && typeof e.createElement == "function")
      try {
        var r = e.createElement("iframe");
        (r.hidden = !0), e.head.appendChild(r);
        var s = r.contentWindow;
        s && s.fetch && (n = s.fetch), e.head.removeChild(r);
      } catch (a) {
        $t &&
          rt.warn(
            "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
            a,
          );
      }
    return (bi = n.bind(Jt));
  }
  function Bf(e, n) {
    var r =
        Object.prototype.toString.call(Jt && Jt.navigator) ===
        "[object Navigator]",
      s = r && typeof Jt.navigator.sendBeacon == "function";
    if (s) {
      var a = Jt.navigator.sendBeacon.bind(Jt.navigator);
      return a(e, n);
    }
    if (Ni()) {
      var l = Po();
      return Ec(
        l(e, { body: n, method: "POST", credentials: "omit", keepalive: !0 }),
      );
    }
  }
  function zr(e) {
    var n = e;
    return n === "event" ? "error" : n;
  }
  var Rr = yt(),
    wu = (function () {
      function e(n) {
        var r = this;
        (this.options = n),
          (this._buffer = ru(30)),
          (this._rateLimits = {}),
          (this._outcomes = {}),
          (this._api = Oi(n.dsn, n._metadata, n.tunnel)),
          (this.url = pu(this._api.dsn)),
          this.options.sendClientReports &&
            Rr.document &&
            Rr.document.addEventListener("visibilitychange", function () {
              Rr.document.visibilityState === "hidden" && r._flushOutcomes();
            });
      }
      return (
        (e.prototype.sendEvent = function (n) {
          return this._sendRequest(Gh(n, this._api), n);
        }),
        (e.prototype.sendSession = function (n) {
          return this._sendRequest(Wh(n, this._api), n);
        }),
        (e.prototype.close = function (n) {
          return this._buffer.drain(n);
        }),
        (e.prototype.recordLostEvent = function (n, r) {
          var s;
          if (this.options.sendClientReports) {
            var a = zr(r) + ":" + n;
            $t && rt.log("Adding outcome: " + a),
              (this._outcomes[a] = ((s = this._outcomes[a]), (s ?? 0) + 1));
          }
        }),
        (e.prototype._flushOutcomes = function () {
          if (this.options.sendClientReports) {
            var n = this._outcomes;
            if (((this._outcomes = {}), !Object.keys(n).length)) {
              $t && rt.log("No outcomes to flush");
              return;
            }
            $t &&
              rt.log(
                `Flushing outcomes:
` + JSON.stringify(n, null, 2),
              );
            var r = Ui(this._api.dsn, this._api.tunnel),
              s = Object.keys(n).map(function (l) {
                var h = vn(l.split(":"), 2),
                  f = h[0],
                  p = h[1];
                return { reason: p, category: f, quantity: n[l] };
              }),
              a = Th(s, this._api.tunnel && Xn(this._api.dsn));
            try {
              Bf(r, Fi(a));
            } catch (l) {
              $t && rt.error(l);
            }
          }
        }),
        (e.prototype._handleResponse = function (n) {
          var r = n.requestType,
            s = n.response,
            a = n.headers,
            l = n.resolve,
            h = n.reject,
            f = ou(s.status);
          if (
            ((this._rateLimits = au(this._rateLimits, a)),
            this._isRateLimited(r) &&
              $t &&
              rt.warn(
                "Too many " +
                  r +
                  " requests, backing off until: " +
                  this._disabledUntil(r),
              ),
            f === "success")
          ) {
            l({ status: f });
            return;
          }
          h(s);
        }),
        (e.prototype._disabledUntil = function (n) {
          var r = zr(n);
          return new Date(po(this._rateLimits, r));
        }),
        (e.prototype._isRateLimited = function (n) {
          var r = zr(n);
          return su(this._rateLimits, r);
        }),
        e
      );
    })(),
    Nf = (function (e) {
      Ri(n, e);
      function n(r, s) {
        s === void 0 && (s = Po());
        var a = e.call(this, r) || this;
        return (a._fetch = s), a;
      }
      return (
        (n.prototype._sendRequest = function (r, s) {
          var a = this;
          if (this._isRateLimited(r.type))
            return (
              this.recordLostEvent("ratelimit_backoff", r.type),
              Promise.reject({
                event: s,
                type: r.type,
                reason:
                  "Transport for " +
                  r.type +
                  " requests locked till " +
                  this._disabledUntil(r.type) +
                  " due to too many requests.",
                status: 429,
              })
            );
          var l = {
            body: r.body,
            method: "POST",
            referrerPolicy: nh() ? "origin" : "",
          };
          return (
            this.options.fetchParameters !== void 0 &&
              Object.assign(l, this.options.fetchParameters),
            this.options.headers !== void 0 &&
              (l.headers = this.options.headers),
            this._buffer
              .add(function () {
                return new Te(function (h, f) {
                  a._fetch(r.url, l)
                    .then(function (p) {
                      var _ = {
                        "x-sentry-rate-limits": p.headers.get(
                          "X-Sentry-Rate-Limits",
                        ),
                        "retry-after": p.headers.get("Retry-After"),
                      };
                      a._handleResponse({
                        requestType: r.type,
                        response: p,
                        headers: _,
                        resolve: h,
                        reject: f,
                      });
                    })
                    .catch(f);
                });
              })
              .then(void 0, function (h) {
                throw (
                  (h instanceof Mt
                    ? a.recordLostEvent("queue_overflow", r.type)
                    : a.recordLostEvent("network_error", r.type),
                  h)
                );
              })
          );
        }),
        n
      );
    })(wu),
    Df = (function (e) {
      Ri(n, e);
      function n() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      return (
        (n.prototype._sendRequest = function (r, s) {
          var a = this;
          return this._isRateLimited(r.type)
            ? (this.recordLostEvent("ratelimit_backoff", r.type),
              Promise.reject({
                event: s,
                type: r.type,
                reason:
                  "Transport for " +
                  r.type +
                  " requests locked till " +
                  this._disabledUntil(r.type) +
                  " due to too many requests.",
                status: 429,
              }))
            : this._buffer
                .add(function () {
                  return new Te(function (l, h) {
                    var f = new XMLHttpRequest();
                    (f.onreadystatechange = function () {
                      if (f.readyState === 4) {
                        var _ = {
                          "x-sentry-rate-limits": f.getResponseHeader(
                            "X-Sentry-Rate-Limits",
                          ),
                          "retry-after": f.getResponseHeader("Retry-After"),
                        };
                        a._handleResponse({
                          requestType: r.type,
                          response: f,
                          headers: _,
                          resolve: l,
                          reject: h,
                        });
                      }
                    }),
                      f.open("POST", r.url);
                    for (var p in a.options.headers)
                      Object.prototype.hasOwnProperty.call(
                        a.options.headers,
                        p,
                      ) && f.setRequestHeader(p, a.options.headers[p]);
                    f.send(r.body);
                  });
                })
                .then(void 0, function (l) {
                  throw (
                    (l instanceof Mt
                      ? a.recordLostEvent("queue_overflow", r.type)
                      : a.recordLostEvent("network_error", r.type),
                    l)
                  );
                });
        }),
        n
      );
    })(wu);
  function Zf(e, n) {
    n === void 0 && (n = Po());
    function r(s) {
      var a = _t(
        { body: s.body, method: "POST", referrerPolicy: "origin" },
        e.requestOptions,
      );
      return n(e.url, a).then(function (l) {
        return l.text().then(function (h) {
          return {
            body: h,
            headers: {
              "x-sentry-rate-limits": l.headers.get("X-Sentry-Rate-Limits"),
              "retry-after": l.headers.get("Retry-After"),
            },
            reason: l.statusText,
            statusCode: l.status,
          };
        });
      });
    }
    return gu({ bufferSize: e.bufferSize }, r);
  }
  var Ff = 4;
  function Hf(e) {
    function n(r) {
      return new Te(function (s, a) {
        var l = new XMLHttpRequest();
        (l.onreadystatechange = function () {
          if (l.readyState === Ff) {
            var f = {
              body: l.response,
              headers: {
                "x-sentry-rate-limits": l.getResponseHeader(
                  "X-Sentry-Rate-Limits",
                ),
                "retry-after": l.getResponseHeader("Retry-After"),
              },
              reason: l.statusText,
              statusCode: l.status,
            };
            s(f);
          }
        }),
          l.open("POST", e.url);
        for (var h in e.headers)
          Object.prototype.hasOwnProperty.call(e.headers, h) &&
            l.setRequestHeader(h, e.headers[h]);
        l.send(r.body);
      });
    }
    return gu({ bufferSize: e.bufferSize }, n);
  }
  var Uf = (function (e) {
      Ri(n, e);
      function n() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      return (
        (n.prototype.eventFromException = function (r, s) {
          return Rf(r, s, this._options.attachStacktrace);
        }),
        (n.prototype.eventFromMessage = function (r, s, a) {
          return (
            s === void 0 && (s = ce.Info),
            Af(r, s, a, this._options.attachStacktrace)
          );
        }),
        (n.prototype._setupTransport = function () {
          if (!this._options.dsn) return e.prototype._setupTransport.call(this);
          var r = _t(_t({}, this._options.transportOptions), {
              dsn: this._options.dsn,
              tunnel: this._options.tunnel,
              sendClientReports: this._options.sendClientReports,
              _metadata: this._options._metadata,
            }),
            s = Oi(r.dsn, r._metadata, r.tunnel),
            a = Ui(s.dsn, s.tunnel);
          if (this._options.transport) return new this._options.transport(r);
          if (Ni()) {
            var l = _t({}, r.fetchParameters);
            return (
              (this._newTransport = Zf({ requestOptions: l, url: a })),
              new Nf(r)
            );
          }
          return (
            (this._newTransport = Hf({ url: a, headers: r.headers })), new Df(r)
          );
        }),
        n
      );
    })($h),
    Si = yt(),
    Yr = 0;
  function bu() {
    return Yr > 0;
  }
  function jf() {
    (Yr += 1),
      setTimeout(function () {
        Yr -= 1;
      });
  }
  function mn(e, n, r) {
    if ((n === void 0 && (n = {}), typeof e != "function")) return e;
    try {
      var s = e.__sentry_wrapped__;
      if (s) return s;
      if (fo(e)) return e;
    } catch {
      return e;
    }
    var a = function () {
      var f = Array.prototype.slice.call(arguments);
      try {
        var p = f.map(function (_) {
          return mn(_, n);
        });
        return e.apply(this, p);
      } catch (_) {
        throw (
          (jf(),
          zh(function (v) {
            v.addEventProcessor(function (m) {
              return (
                n.mechanism && (Gr(m, void 0), qn(m, n.mechanism)),
                (m.extra = _t(_t({}, m.extra), { arguments: f })),
                m
              );
            }),
              Ih(_);
          }),
          _)
        );
      }
    };
    try {
      for (var l in e)
        Object.prototype.hasOwnProperty.call(e, l) && (a[l] = e[l]);
    } catch {}
    Qa(a, e), Bi(e, "__sentry_wrapped__", a);
    try {
      var h = Object.getOwnPropertyDescriptor(a, "name");
      h.configurable &&
        Object.defineProperty(a, "name", {
          get: function () {
            return e.name;
          },
        });
    } catch {}
    return a;
  }
  function Wf(e) {
    if ((e === void 0 && (e = {}), !!Si.document)) {
      if (!e.eventId) {
        $t && rt.error("Missing eventId option in showReportDialog call");
        return;
      }
      if (!e.dsn) {
        $t && rt.error("Missing dsn option in showReportDialog call");
        return;
      }
      var n = Si.document.createElement("script");
      (n.async = !0), (n.src = Nh(e.dsn, e)), e.onLoad && (n.onload = e.onLoad);
      var r = Si.document.head || Si.document.body;
      r && r.appendChild(n);
    }
  }
  var xo = (function () {
    function e(n) {
      (this.name = e.id),
        (this._installFunc = { onerror: qf, onunhandledrejection: Gf }),
        (this._options = _t({ onerror: !0, onunhandledrejection: !0 }, n));
    }
    return (
      (e.prototype.setupOnce = function () {
        Error.stackTraceLimit = 50;
        var n = this._options;
        for (var r in n) {
          var s = this._installFunc[r];
          s && n[r] && (Yf(r), s(), (this._installFunc[r] = void 0));
        }
      }),
      (e.id = "GlobalHandlers"),
      e
    );
  })();
  function qf() {
    ye("error", function (e) {
      var n = vn(xu(), 2),
        r = n[0],
        s = n[1];
      if (r.getIntegration(xo)) {
        var a = e.msg,
          l = e.url,
          h = e.line,
          f = e.column,
          p = e.error;
        if (!(bu() || (p && p.__sentry_own_request__))) {
          var _ =
            p === void 0 && dn(a)
              ? $f(a, l, h, f)
              : Su(So(p || a, void 0, s, !1), l, h, f);
          (_.level = ce.Error), Pu(r, p, _, "onerror");
        }
      }
    });
  }
  function Gf() {
    ye("unhandledrejection", function (e) {
      var n = vn(xu(), 2),
        r = n[0],
        s = n[1];
      if (r.getIntegration(xo)) {
        var a = e;
        try {
          "reason" in e
            ? (a = e.reason)
            : "detail" in e && "reason" in e.detail && (a = e.detail.reason);
        } catch {}
        if (bu() || (a && a.__sentry_own_request__)) return !0;
        var l = uo(a) ? Vf(a) : So(a, void 0, s, !0);
        (l.level = ce.Error), Pu(r, a, l, "onunhandledrejection");
      }
    });
  }
  function Vf(e) {
    return {
      exception: {
        values: [
          {
            type: "UnhandledRejection",
            value:
              "Non-Error promise rejection captured with value: " + String(e),
          },
        ],
      },
    };
  }
  function $f(e, n, r, s) {
    var a =
        /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i,
      l = Ka(e) ? e.message : e,
      h = "Error",
      f = l.match(a);
    f && ((h = f[1]), (l = f[2]));
    var p = { exception: { values: [{ type: h, value: l }] } };
    return Su(p, n, r, s);
  }
  function Su(e, n, r, s) {
    var a = (e.exception = e.exception || {}),
      l = (a.values = a.values || []),
      h = (l[0] = l[0] || {}),
      f = (h.stacktrace = h.stacktrace || {}),
      p = (f.frames = f.frames || []),
      _ = isNaN(parseInt(s, 10)) ? void 0 : s,
      v = isNaN(parseInt(r, 10)) ? void 0 : r,
      m = dn(n) && n.length > 0 ? n : Nc();
    return (
      p.length === 0 &&
        p.push({ colno: _, filename: m, function: "?", in_app: !0, lineno: v }),
      e
    );
  }
  function Yf(e) {
    $t && rt.log("Global Handler attached: " + e);
  }
  function Pu(e, n, r, s) {
    qn(r, { handled: !1, type: s }),
      e.captureEvent(r, { originalException: n });
  }
  function xu() {
    var e = Zt(),
      n = e.getClient(),
      r = n && n.getOptions().attachStacktrace;
    return [e, r];
  }
  var Kf = [
      "EventTarget",
      "Window",
      "Node",
      "ApplicationCache",
      "AudioTrackList",
      "ChannelMergerNode",
      "CryptoOperation",
      "EventSource",
      "FileReader",
      "HTMLUnknownElement",
      "IDBDatabase",
      "IDBRequest",
      "IDBTransaction",
      "KeyOperation",
      "MediaController",
      "MessagePort",
      "ModalWindow",
      "Notification",
      "SVGElementInstance",
      "Screen",
      "TextTrack",
      "TextTrackCue",
      "TextTrackList",
      "WebSocket",
      "WebSocketWorker",
      "Worker",
      "XMLHttpRequest",
      "XMLHttpRequestEventTarget",
      "XMLHttpRequestUpload",
    ],
    Xf = (function () {
      function e(n) {
        (this.name = e.id),
          (this._options = _t(
            {
              XMLHttpRequest: !0,
              eventTarget: !0,
              requestAnimationFrame: !0,
              setInterval: !0,
              setTimeout: !0,
            },
            n,
          ));
      }
      return (
        (e.prototype.setupOnce = function () {
          var n = yt();
          this._options.setTimeout && At(n, "setTimeout", ca),
            this._options.setInterval && At(n, "setInterval", ca),
            this._options.requestAnimationFrame &&
              At(n, "requestAnimationFrame", Jf),
            this._options.XMLHttpRequest &&
              "XMLHttpRequest" in n &&
              At(XMLHttpRequest.prototype, "send", Qf);
          var r = this._options.eventTarget;
          if (r) {
            var s = Array.isArray(r) ? r : Kf;
            s.forEach(td);
          }
        }),
        (e.id = "TryCatch"),
        e
      );
    })();
  function ca(e) {
    return function () {
      for (var n = [], r = 0; r < arguments.length; r++) n[r] = arguments[r];
      var s = n[0];
      return (
        (n[0] = mn(s, {
          mechanism: {
            data: { function: xe(e) },
            handled: !0,
            type: "instrument",
          },
        })),
        e.apply(this, n)
      );
    };
  }
  function Jf(e) {
    return function (n) {
      return e.apply(this, [
        mn(n, {
          mechanism: {
            data: { function: "requestAnimationFrame", handler: xe(e) },
            handled: !0,
            type: "instrument",
          },
        }),
      ]);
    };
  }
  function Qf(e) {
    return function () {
      for (var n = [], r = 0; r < arguments.length; r++) n[r] = arguments[r];
      var s = this,
        a = ["onload", "onerror", "onprogress", "onreadystatechange"];
      return (
        a.forEach(function (l) {
          l in s &&
            typeof s[l] == "function" &&
            At(s, l, function (h) {
              var f = {
                  mechanism: {
                    data: { function: l, handler: xe(h) },
                    handled: !0,
                    type: "instrument",
                  },
                },
                p = fo(h);
              return p && (f.mechanism.data.handler = xe(p)), mn(h, f);
            });
        }),
        e.apply(this, n)
      );
    };
  }
  function td(e) {
    var n = yt(),
      r = n[e] && n[e].prototype;
    !r ||
      !r.hasOwnProperty ||
      !r.hasOwnProperty("addEventListener") ||
      (At(r, "addEventListener", function (s) {
        return function (a, l, h) {
          try {
            typeof l.handleEvent == "function" &&
              (l.handleEvent = mn(l.handleEvent.bind(l), {
                mechanism: {
                  data: { function: "handleEvent", handler: xe(l), target: e },
                  handled: !0,
                  type: "instrument",
                },
              }));
          } catch {}
          return s.apply(this, [
            a,
            mn(l, {
              mechanism: {
                data: {
                  function: "addEventListener",
                  handler: xe(l),
                  target: e,
                },
                handled: !0,
                type: "instrument",
              },
            }),
            h,
          ]);
        };
      }),
      At(r, "removeEventListener", function (s) {
        return function (a, l, h) {
          var f = l;
          try {
            var p = f && f.__sentry_wrapped__;
            p && s.call(this, a, p, h);
          } catch {}
          return s.call(this, a, f, h);
        };
      }));
  }
  var Lu = (function () {
    function e(n) {
      (this.name = e.id),
        (this._options = _t(
          { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0 },
          n,
        ));
    }
    return (
      (e.prototype.addSentryBreadcrumb = function (n) {
        this._options.sentry &&
          Zt().addBreadcrumb(
            {
              category:
                "sentry." +
                (n.type === "transaction" ? "transaction" : "event"),
              event_id: n.event_id,
              level: n.level,
              message: Ne(n),
            },
            { event: n },
          );
      }),
      (e.prototype.setupOnce = function () {
        this._options.console && ye("console", nd),
          this._options.dom && ye("dom", ed(this._options.dom)),
          this._options.xhr && ye("xhr", id),
          this._options.fetch && ye("fetch", rd),
          this._options.history && ye("history", od);
      }),
      (e.id = "Breadcrumbs"),
      e
    );
  })();
  function ed(e) {
    function n(r) {
      var s,
        a = typeof e == "object" ? e.serializeAttribute : void 0;
      typeof a == "string" && (a = [a]);
      try {
        s = r.event.target ? Ur(r.event.target, a) : Ur(r.event, a);
      } catch {
        s = "<unknown>";
      }
      s.length !== 0 &&
        Zt().addBreadcrumb(
          { category: "ui." + r.name, message: s },
          { event: r.event, name: r.name, global: r.global },
        );
    }
    return n;
  }
  function nd(e) {
    var n = {
      category: "console",
      data: { arguments: e.args, logger: "console" },
      level: Sh(e.level),
      message: Gs(e.args, " "),
    };
    if (e.level === "assert")
      if (e.args[0] === !1)
        (n.message =
          "Assertion failed: " +
          (Gs(e.args.slice(1), " ") || "console.assert")),
          (n.data.arguments = e.args.slice(1));
      else return;
    Zt().addBreadcrumb(n, { input: e.args, level: e.level });
  }
  function id(e) {
    if (e.endTimestamp) {
      if (e.xhr.__sentry_own_request__) return;
      var n = e.xhr.__sentry_xhr__ || {},
        r = n.method,
        s = n.url,
        a = n.status_code,
        l = n.body;
      Zt().addBreadcrumb(
        {
          category: "xhr",
          data: { method: r, url: s, status_code: a },
          type: "http",
        },
        { xhr: e.xhr, input: l },
      );
      return;
    }
  }
  function rd(e) {
    e.endTimestamp &&
      ((e.fetchData.url.match(/sentry_key/) && e.fetchData.method === "POST") ||
        (e.error
          ? Zt().addBreadcrumb(
              {
                category: "fetch",
                data: e.fetchData,
                level: ce.Error,
                type: "http",
              },
              { data: e.error, input: e.args },
            )
          : Zt().addBreadcrumb(
              {
                category: "fetch",
                data: _t(_t({}, e.fetchData), {
                  status_code: e.response.status,
                }),
                type: "http",
              },
              { input: e.args, response: e.response },
            )));
  }
  function od(e) {
    var n = yt(),
      r = e.from,
      s = e.to,
      a = Or(n.location.href),
      l = Or(r),
      h = Or(s);
    l.path || (l = a),
      a.protocol === h.protocol && a.host === h.host && (s = h.relative),
      a.protocol === l.protocol && a.host === l.host && (r = l.relative),
      Zt().addBreadcrumb({ category: "navigation", data: { from: r, to: s } });
  }
  var sd = "cause",
    ad = 5,
    ud = (function () {
      function e(n) {
        n === void 0 && (n = {}),
          (this.name = e.id),
          (this._key = n.key || sd),
          (this._limit = n.limit || ad);
      }
      return (
        (e.prototype.setupOnce = function () {
          _o(function (n, r) {
            var s = Zt().getIntegration(e);
            return s ? ld(s._key, s._limit, n, r) : n;
          });
        }),
        (e.id = "LinkedErrors"),
        e
      );
    })();
  function ld(e, n, r, s) {
    if (
      !r.exception ||
      !r.exception.values ||
      !s ||
      !Le(s.originalException, Error)
    )
      return r;
    var a = Tu(n, s.originalException, e);
    return (r.exception.values = $a(a, r.exception.values)), r;
  }
  function Tu(e, n, r, s) {
    if ((s === void 0 && (s = []), !Le(n[r], Error) || s.length + 1 >= e))
      return s;
    var a = yu(n[r]);
    return Tu(e, n[r], r, $a([a], s));
  }
  var Ae = yt(),
    cd = (function () {
      function e() {
        this.name = e.id;
      }
      return (
        (e.prototype.setupOnce = function () {
          _o(function (n) {
            if (Zt().getIntegration(e)) {
              if (!Ae.navigator && !Ae.location && !Ae.document) return n;
              var r =
                  (n.request && n.request.url) ||
                  (Ae.location && Ae.location.href),
                s = (Ae.document || {}).referrer,
                a = (Ae.navigator || {}).userAgent,
                l = _t(
                  _t(
                    _t({}, n.request && n.request.headers),
                    s && { Referer: s },
                  ),
                  a && { "User-Agent": a },
                ),
                h = _t(_t({}, r && { url: r }), { headers: l });
              return _t(_t({}, n), { request: h });
            }
            return n;
          });
        }),
        (e.id = "UserAgent"),
        e
      );
    })(),
    hd = (function () {
      function e() {
        this.name = e.id;
      }
      return (
        (e.prototype.setupOnce = function (n, r) {
          n(function (s) {
            var a = r().getIntegration(e);
            if (a) {
              try {
                if (fd(s, a._previousEvent))
                  return (
                    $t &&
                      rt.warn(
                        "Event dropped due to being a duplicate of previously captured event.",
                      ),
                    null
                  );
              } catch {
                return (a._previousEvent = s);
              }
              return (a._previousEvent = s);
            }
            return s;
          });
        }),
        (e.id = "Dedupe"),
        e
      );
    })();
  function fd(e, n) {
    return n ? !!(dd(e, n) || pd(e, n)) : !1;
  }
  function dd(e, n) {
    var r = e.message,
      s = n.message;
    return !(
      (!r && !s) ||
      (r && !s) ||
      (!r && s) ||
      r !== s ||
      !ku(e, n) ||
      !Eu(e, n)
    );
  }
  function pd(e, n) {
    var r = ha(n),
      s = ha(e);
    return !(
      !r ||
      !s ||
      r.type !== s.type ||
      r.value !== s.value ||
      !ku(e, n) ||
      !Eu(e, n)
    );
  }
  function Eu(e, n) {
    var r = fa(e),
      s = fa(n);
    if (!r && !s) return !0;
    if ((r && !s) || (!r && s) || ((r = r), (s = s), s.length !== r.length))
      return !1;
    for (var a = 0; a < s.length; a++) {
      var l = s[a],
        h = r[a];
      if (
        l.filename !== h.filename ||
        l.lineno !== h.lineno ||
        l.colno !== h.colno ||
        l.function !== h.function
      )
        return !1;
    }
    return !0;
  }
  function ku(e, n) {
    var r = e.fingerprint,
      s = n.fingerprint;
    if (!r && !s) return !0;
    if ((r && !s) || (!r && s)) return !1;
    (r = r), (s = s);
    try {
      return r.join("") === s.join("");
    } catch {
      return !1;
    }
  }
  function ha(e) {
    return e.exception && e.exception.values && e.exception.values[0];
  }
  function fa(e) {
    var n = e.exception;
    if (n)
      try {
        return n.values[0].stacktrace.frames;
      } catch {
        return;
      }
    else if (e.stacktrace) return e.stacktrace.frames;
  }
  var _d = (function (e) {
      Ri(n, e);
      function n(r) {
        r === void 0 && (r = {});
        var s = this;
        return (
          (r._metadata = r._metadata || {}),
          (r._metadata.sdk = r._metadata.sdk || {
            name: "sentry.javascript.browser",
            packages: [{ name: "npm:@sentry/browser", version: aa }],
            version: aa,
          }),
          (s = e.call(this, Uf, r) || this),
          s
        );
      }
      return (
        (n.prototype.showReportDialog = function (r) {
          r === void 0 && (r = {});
          var s = yt().document;
          if (s) {
            if (!this._isEnabled()) {
              $t &&
                rt.error(
                  "Trying to call showReportDialog with Sentry Client disabled",
                );
              return;
            }
            Wf(_t(_t({}, r), { dsn: r.dsn || this.getDsn() }));
          }
        }),
        (n.prototype._prepareEvent = function (r, s, a) {
          return (
            (r.platform = r.platform || "javascript"),
            e.prototype._prepareEvent.call(this, r, s, a)
          );
        }),
        (n.prototype._sendEvent = function (r) {
          var s = this.getIntegration(Lu);
          s && s.addSentryBreadcrumb(r), e.prototype._sendEvent.call(this, r);
        }),
        n
      );
    })(Uh),
    md = [
      new Qh(),
      new Xh(),
      new Xf(),
      new Lu(),
      new xo(),
      new ud(),
      new hd(),
      new cd(),
    ];
  function gd(e) {
    if (
      (e === void 0 && (e = {}),
      e.defaultIntegrations === void 0 && (e.defaultIntegrations = md),
      e.release === void 0)
    ) {
      var n = yt();
      n.SENTRY_RELEASE &&
        n.SENTRY_RELEASE.id &&
        (e.release = n.SENTRY_RELEASE.id);
    }
    e.autoSessionTracking === void 0 && (e.autoSessionTracking = !0),
      e.sendClientReports === void 0 && (e.sendClientReports = !0),
      Yh(_d, e),
      e.autoSessionTracking && vd();
  }
  function da(e) {
    e.startSession({ ignoreDuration: !0 }), e.captureSession();
  }
  function vd() {
    var e = yt(),
      n = e.document;
    if (typeof n > "u") {
      $t &&
        rt.warn(
          "Session tracking in non-browser environment with @sentry/browser is not supported.",
        );
      return;
    }
    var r = Zt();
    r.captureSession &&
      (da(r),
      ye("history", function (s) {
        var a = s.from,
          l = s.to;
        a === void 0 || a === l || da(Zt());
      }));
  }
  const pt = (e) => {
      try {
        return e();
      } catch {}
    },
    yd = () => {
      pt(() =>
        gd({
          autoSessionTracking: !1,
          beforeSend(e) {
            return e.exception ? e : null;
          },
          dsn: "https://5218ea8159eb46fe953d19a4e7530e94@o1226957.ingest.sentry.io/6372553",
          environment: "production",
          release: "260265a0383d3e3cd75269b699ed05e42080f37c",
          tracesSampleRate: 0,
        }),
      );
    };
  function ut() {}
  function Cu(e) {
    return e();
  }
  function pa() {
    return Object.create(null);
  }
  function Ft(e) {
    e.forEach(Cu);
  }
  function Vn(e) {
    return typeof e == "function";
  }
  function Ee(e, n) {
    return e != e
      ? n == n
      : e !== n || (e && typeof e == "object") || typeof e == "function";
  }
  function wd(e) {
    return Object.keys(e).length === 0;
  }
  function ji(e, ...n) {
    if (e == null) {
      for (const s of n) s(void 0);
      return ut;
    }
    const r = e.subscribe(...n);
    return r.unsubscribe ? () => r.unsubscribe() : r;
  }
  function Ou(e) {
    let n;
    return ji(e, (r) => (n = r))(), n;
  }
  function it(e, n, r) {
    e.$$.on_destroy.push(ji(n, r));
  }
  function b(e, n) {
    e.appendChild(n);
  }
  function D(e, n, r) {
    e.insertBefore(n, r || null);
  }
  function N(e) {
    e.parentNode && e.parentNode.removeChild(e);
  }
  function bd(e, n) {
    for (let r = 0; r < e.length; r += 1) e[r] && e[r].d(n);
  }
  function k(e) {
    return document.createElement(e);
  }
  function K(e) {
    return document.createTextNode(e);
  }
  function U() {
    return K(" ");
  }
  function Lo() {
    return K("");
  }
  function ht(e, n, r, s) {
    return e.addEventListener(n, r, s), () => e.removeEventListener(n, r, s);
  }
  function T(e, n, r) {
    r == null
      ? e.removeAttribute(n)
      : e.getAttribute(n) !== r && e.setAttribute(n, r);
  }
  function Sd(e) {
    let n;
    return {
      p(...r) {
        (n = r), n.forEach((s) => e.push(s));
      },
      r() {
        n.forEach((r) => e.splice(e.indexOf(r), 1));
      },
    };
  }
  function Pd(e) {
    return Array.from(e.childNodes);
  }
  function Pt(e, n) {
    (n = "" + n), e.data !== n && (e.data = n);
  }
  function Ar(e, n) {
    e.value = n ?? "";
  }
  function se(e, n, r) {
    e.classList.toggle(n, !!r);
  }
  let $n;
  function Un(e) {
    $n = e;
  }
  function xd() {
    if (!$n)
      throw new Error("Function called outside component initialization");
    return $n;
  }
  function Ld(e) {
    xd().$$.on_mount.push(e);
  }
  const an = [],
    Ii = [];
  let hn = [];
  const Kr = [],
    Td = Promise.resolve();
  let Xr = !1;
  function Ed() {
    Xr || ((Xr = !0), Td.then(Mu));
  }
  function Jr(e) {
    hn.push(e);
  }
  function kd(e) {
    Kr.push(e);
  }
  const Br = new Set();
  let rn = 0;
  function Mu() {
    if (rn !== 0) return;
    const e = $n;
    do {
      try {
        for (; rn < an.length; ) {
          const n = an[rn];
          rn++, Un(n), Cd(n.$$);
        }
      } catch (n) {
        throw ((an.length = 0), (rn = 0), n);
      }
      for (Un(null), an.length = 0, rn = 0; Ii.length; ) Ii.pop()();
      for (let n = 0; n < hn.length; n += 1) {
        const r = hn[n];
        Br.has(r) || (Br.add(r), r());
      }
      hn.length = 0;
    } while (an.length);
    for (; Kr.length; ) Kr.pop()();
    (Xr = !1), Br.clear(), Un(e);
  }
  function Cd(e) {
    if (e.fragment !== null) {
      e.update(), Ft(e.before_update);
      const n = e.dirty;
      (e.dirty = [-1]),
        e.fragment && e.fragment.p(e.ctx, n),
        e.after_update.forEach(Jr);
    }
  }
  function Od(e) {
    const n = [],
      r = [];
    hn.forEach((s) => (e.indexOf(s) === -1 ? n.push(s) : r.push(s))),
      r.forEach((s) => s()),
      (hn = n);
  }
  const Pi = new Set();
  let De;
  function Iu() {
    De = { r: 0, c: [], p: De };
  }
  function zu() {
    De.r || Ft(De.c), (De = De.p);
  }
  function Qt(e, n) {
    e && e.i && (Pi.delete(e), e.i(n));
  }
  function ue(e, n, r, s) {
    if (e && e.o) {
      if (Pi.has(e)) return;
      Pi.add(e),
        De.c.push(() => {
          Pi.delete(e), s && (r && e.d(1), s());
        }),
        e.o(n);
    } else s && s();
  }
  function _a(e) {
    return e?.length !== void 0 ? e : Array.from(e);
  }
  function Md(e, n, r) {
    const s = e.$$.props[n];
    s !== void 0 && ((e.$$.bound[s] = r), r(e.$$.ctx[s]));
  }
  function ln(e) {
    e && e.c();
  }
  function Ze(e, n, r) {
    const { fragment: s, after_update: a } = e.$$;
    s && s.m(n, r),
      Jr(() => {
        const l = e.$$.on_mount.map(Cu).filter(Vn);
        e.$$.on_destroy ? e.$$.on_destroy.push(...l) : Ft(l),
          (e.$$.on_mount = []);
      }),
      a.forEach(Jr);
  }
  function Fe(e, n) {
    const r = e.$$;
    r.fragment !== null &&
      (Od(r.after_update),
      Ft(r.on_destroy),
      r.fragment && r.fragment.d(n),
      (r.on_destroy = r.fragment = null),
      (r.ctx = []));
  }
  function Id(e, n) {
    e.$$.dirty[0] === -1 && (an.push(e), Ed(), e.$$.dirty.fill(0)),
      (e.$$.dirty[(n / 31) | 0] |= 1 << n % 31);
  }
  function Ge(e, n, r, s, a, l, h = null, f = [-1]) {
    const p = $n;
    Un(e);
    const _ = (e.$$ = {
      fragment: null,
      ctx: [],
      props: l,
      update: ut,
      not_equal: a,
      bound: pa(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(n.context || (p ? p.$$.context : [])),
      callbacks: pa(),
      dirty: f,
      skip_bound: !1,
      root: n.target || p.$$.root,
    });
    h && h(_.root);
    let v = !1;
    if (
      ((_.ctx = r
        ? r(e, n.props || {}, (m, w, ...S) => {
            const P = S.length ? S[0] : w;
            return (
              _.ctx &&
                a(_.ctx[m], (_.ctx[m] = P)) &&
                (!_.skip_bound && _.bound[m] && _.bound[m](P), v && Id(e, m)),
              w
            );
          })
        : []),
      _.update(),
      (v = !0),
      Ft(_.before_update),
      (_.fragment = s ? s(_.ctx) : !1),
      n.target)
    ) {
      if (n.hydrate) {
        const m = Pd(n.target);
        _.fragment && _.fragment.l(m), m.forEach(N);
      } else _.fragment && _.fragment.c();
      n.intro && Qt(e.$$.fragment), Ze(e, n.target, n.anchor), Mu();
    }
    Un(p);
  }
  class Ve {
    $$ = void 0;
    $$set = void 0;
    $destroy() {
      Fe(this, 1), (this.$destroy = ut);
    }
    $on(n, r) {
      if (!Vn(r)) return ut;
      const s = this.$$.callbacks[n] || (this.$$.callbacks[n] = []);
      return (
        s.push(r),
        () => {
          const a = s.indexOf(r);
          a !== -1 && s.splice(a, 1);
        }
      );
    }
    $set(n) {
      this.$$set &&
        !wd(n) &&
        ((this.$$.skip_bound = !0), this.$$set(n), (this.$$.skip_bound = !1));
    }
  }
  const zd = "4";
  typeof window < "u" &&
    (window.__svelte || (window.__svelte = { v: new Set() })).v.add(zd);
  var Zn =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {};
  function Sn(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  function Rd(e) {
    var n = typeof e;
    return e != null && (n == "object" || n == "function");
  }
  var Ru = Rd,
    Ad = typeof Zn == "object" && Zn && Zn.Object === Object && Zn,
    Bd = Ad,
    Nd = Bd,
    Dd = typeof self == "object" && self && self.Object === Object && self,
    Zd = Nd || Dd || Function("return this")(),
    Au = Zd,
    Fd = Au,
    Hd = function () {
      return Fd.Date.now();
    },
    Ud = Hd,
    jd = /\s/;
  function Wd(e) {
    for (var n = e.length; n-- && jd.test(e.charAt(n)); );
    return n;
  }
  var qd = Wd,
    Gd = qd,
    Vd = /^\s+/;
  function $d(e) {
    return e && e.slice(0, Gd(e) + 1).replace(Vd, "");
  }
  var Yd = $d,
    Kd = Au,
    Xd = Kd.Symbol,
    Bu = Xd,
    ma = Bu,
    Nu = Object.prototype,
    Jd = Nu.hasOwnProperty,
    Qd = Nu.toString,
    Dn = ma ? ma.toStringTag : void 0;
  function tp(e) {
    var n = Jd.call(e, Dn),
      r = e[Dn];
    try {
      e[Dn] = void 0;
      var s = !0;
    } catch {}
    var a = Qd.call(e);
    return s && (n ? (e[Dn] = r) : delete e[Dn]), a;
  }
  var ep = tp,
    np = Object.prototype,
    ip = np.toString;
  function rp(e) {
    return ip.call(e);
  }
  var op = rp,
    ga = Bu,
    sp = ep,
    ap = op,
    up = "[object Null]",
    lp = "[object Undefined]",
    va = ga ? ga.toStringTag : void 0;
  function cp(e) {
    return e == null
      ? e === void 0
        ? lp
        : up
      : va && va in Object(e)
        ? sp(e)
        : ap(e);
  }
  var hp = cp;
  function fp(e) {
    return e != null && typeof e == "object";
  }
  var dp = fp,
    pp = hp,
    _p = dp,
    mp = "[object Symbol]";
  function gp(e) {
    return typeof e == "symbol" || (_p(e) && pp(e) == mp);
  }
  var vp = gp,
    yp = Yd,
    ya = Ru,
    wp = vp,
    wa = NaN,
    bp = /^[-+]0x[0-9a-f]+$/i,
    Sp = /^0b[01]+$/i,
    Pp = /^0o[0-7]+$/i,
    xp = parseInt;
  function Lp(e) {
    if (typeof e == "number") return e;
    if (wp(e)) return wa;
    if (ya(e)) {
      var n = typeof e.valueOf == "function" ? e.valueOf() : e;
      e = ya(n) ? n + "" : n;
    }
    if (typeof e != "string") return e === 0 ? e : +e;
    e = yp(e);
    var r = Sp.test(e);
    return r || Pp.test(e) ? xp(e.slice(2), r ? 2 : 8) : bp.test(e) ? wa : +e;
  }
  var Tp = Lp,
    Ep = Ru,
    Nr = Ud,
    ba = Tp,
    kp = "Expected a function",
    Cp = Math.max,
    Op = Math.min;
  function Mp(e, n, r) {
    var s,
      a,
      l,
      h,
      f,
      p,
      _ = 0,
      v = !1,
      m = !1,
      w = !0;
    if (typeof e != "function") throw new TypeError(kp);
    (n = ba(n) || 0),
      Ep(r) &&
        ((v = !!r.leading),
        (m = "maxWait" in r),
        (l = m ? Cp(ba(r.maxWait) || 0, n) : l),
        (w = "trailing" in r ? !!r.trailing : w));
    function S(Z) {
      var V = s,
        st = a;
      return (s = a = void 0), (_ = Z), (h = e.apply(st, V)), h;
    }
    function P(Z) {
      return (_ = Z), (f = setTimeout(z, n)), v ? S(Z) : h;
    }
    function O(Z) {
      var V = Z - p,
        st = Z - _,
        xt = n - V;
      return m ? Op(xt, l - st) : xt;
    }
    function I(Z) {
      var V = Z - p,
        st = Z - _;
      return p === void 0 || V >= n || V < 0 || (m && st >= l);
    }
    function z() {
      var Z = Nr();
      if (I(Z)) return M(Z);
      f = setTimeout(z, O(Z));
    }
    function M(Z) {
      return (f = void 0), w && s ? S(Z) : ((s = a = void 0), h);
    }
    function C() {
      f !== void 0 && clearTimeout(f), (_ = 0), (s = p = a = f = void 0);
    }
    function F() {
      return f === void 0 ? h : M(Nr());
    }
    function B() {
      var Z = Nr(),
        V = I(Z);
      if (((s = arguments), (a = this), (p = Z), V)) {
        if (f === void 0) return P(p);
        if (m) return clearTimeout(f), (f = setTimeout(z, n)), S(p);
      }
      return f === void 0 && (f = setTimeout(z, n)), h;
    }
    return (B.cancel = C), (B.flush = F), B;
  }
  var Ip = Mp;
  const Qr = Sn(Ip),
    on = [];
  function zp(e, n) {
    return { subscribe: bt(e, n).subscribe };
  }
  function bt(e, n = ut) {
    let r;
    const s = new Set();
    function a(f) {
      if (Ee(e, f) && ((e = f), r)) {
        const p = !on.length;
        for (const _ of s) _[1](), on.push(_, e);
        if (p) {
          for (let _ = 0; _ < on.length; _ += 2) on[_][0](on[_ + 1]);
          on.length = 0;
        }
      }
    }
    function l(f) {
      a(f(e));
    }
    function h(f, p = ut) {
      const _ = [f, p];
      return (
        s.add(_),
        s.size === 1 && (r = n(a, l) || ut),
        f(e),
        () => {
          s.delete(_), s.size === 0 && r && (r(), (r = null));
        }
      );
    }
    return { set: a, update: l, subscribe: h };
  }
  function ke(e, n, r) {
    const s = !Array.isArray(e),
      a = s ? [e] : e;
    if (!a.every(Boolean))
      throw new Error("derived() expects stores as input, got a falsy value");
    const l = n.length < 2;
    return zp(r, (h, f) => {
      let p = !1;
      const _ = [];
      let v = 0,
        m = ut;
      const w = () => {
          if (v) return;
          m();
          const P = n(s ? _[0] : _, h, f);
          l ? h(P) : (m = Vn(P) ? P : ut);
        },
        S = a.map((P, O) =>
          ji(
            P,
            (I) => {
              (_[O] = I), (v &= ~(1 << O)), p && w();
            },
            () => {
              v |= 1 << O;
            },
          ),
        );
      return (
        (p = !0),
        w(),
        function () {
          Ft(S), m(), (p = !1);
        }
      );
    });
  }
  const Rp = (e, n, r) => {
      let s = e;
      const a = r - n;
      for (; s < n; ) s += a;
      for (; s > r; ) s -= a;
      return s;
    },
    Ue = (e) => Rp(e, -180, 180),
    Sa = (e, n) => {
      if (e.has("lat") && e.has("lng")) {
        const l = e.get("lat"),
          h = e.get("lng");
        return l === null ||
          h === null ||
          !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/.test(l) ||
          !/[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(h)
          ? void 0
          : pt(() => ({ lat: parseFloat(l), lng: parseFloat(h) }));
      }
      let r = window.location.pathname;
      n && (r = r.replace(n, ""));
      const a = r.split("/").filter(Boolean)[0];
      if (a) {
        const l = a.split(","),
          h = l[0],
          f = l[1];
        if (h && f) {
          const p = h + "," + f;
          if (p === "51.89863,-8.47039") return;
          if (
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
              p,
            )
          ) {
            const _ = p.split(",");
            if (_.length)
              return pt(() => ({
                lat: parseFloat(_[0]),
                lng: parseFloat(_[1]),
              }));
          }
        }
      }
    },
    Ap = () => {
      const e = pt(() => localStorage.getItem("centerLatLng"));
      if (e) {
        const n = pt(() => JSON.parse(e));
        if (n.lat && n.lng) return n;
      }
    },
    Bp = (e) => {
      const n = Sa(e, /^(?!\/?geo-lookup-done)/) ||
        Ap() ||
        Sa(e, /^\/?geo-lookup-done/) || { lat: 51.89863, lng: -8.47039 };
      return (n.lng = Ue(n.lng)), n;
    };
  function Np({ name: e, parse: n, urlSearchParams: r }) {
    if (r.has(e)) {
      const s = pt(() => r.get(e));
      if (s !== null) return n(s);
    }
  }
  function Dp({ name: e, parse: n }) {
    const r = pt(() => localStorage.getItem(e));
    if (r !== null) return n(r);
  }
  const To = ({
      defaultValue: e,
      name: n,
      parse: r = (l) => l,
      postProcess: s = (l) => l,
      urlSearchParams: a = new URLSearchParams(window.location.search),
    }) => {
      const l = (h) => pt(() => r(h));
      return s(
        Np({ name: n, parse: l, urlSearchParams: a }) ||
          Dp({ name: n, parse: l }) ||
          e,
      );
    },
    Du = (e, n = Math.random) => e[Math.floor(n() * e.length)],
    Zp = () => {
      let e = "";
      for (let n = 0; n < 6; n++)
        e += Du("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
      return e;
    },
    Fp = () => {
      if (
        "ontouchstart" in window ||
        window.TouchEvent ||
        (window.DocumentTouch && document instanceof DocumentTouch)
      )
        return !0;
      const n = ["", "-webkit-", "-moz-", "-o-", "-ms-"].map(
        (r) => `(${r}touch-enabled)`,
      );
      return window.matchMedia(n.join(",")).matches;
    };
  var Ot = ((e) => (
    (e.Tourist = "tourist"),
    (e.Resident = "resident"),
    (e.TaxiDriver = "taxi-driver"),
    e
  ))(Ot || {});
  const Pn = new URLSearchParams(window.location.search),
    to = bt(null),
    je = bt(Bp(Pn)),
    qe = bt(
      To({
        defaultValue: 2e3,
        name: "radius",
        parse: (e) => {
          if (e) return parseInt(e);
        },
        urlSearchParams: Pn,
      }),
    ),
    Yn = bt(
      To({
        defaultValue: Ot.TaxiDriver,
        name: "difficulty",
        parse: (e) => {
          if (e && Object.values(Ot).includes(e)) return e;
        },
        urlSearchParams: Pn,
      }),
    ),
    Kn = bt(
      To({
        defaultValue: 5,
        name: "numberOfQuestions",
        parse: (e) => {
          if (e) return parseInt(e);
        },
        urlSearchParams: Pn,
      }),
    ),
    Pa = bt(
      pt(() => {
        const e = localStorage.getItem("settingsLastOpenedAt");
        if (e) return parseInt(e);
      }) || null,
    ),
    be = bt(null),
    xi = bt(
      parseInt(
        pt(() => {
          const e = localStorage.getItem("deviceBestScore");
          if (!e) return;
          let n = parseInt(e, 10);
          return (
            n > 100 &&
              ((n = Math.round(n / 5)),
              pt(() => localStorage.setItem("deviceBestScore", n.toString()))),
            n
          );
        }),
      ) || null,
    ),
    fn = bt(null),
    Eo = Pn.get("sharedSeed");
  Eo && Pn.delete("sharedSeed");
  const zi = bt(!!Eo),
    Se = bt(!1),
    jn = bt(!1),
    ko = bt(Fp() ? "Tap" : "Click"),
    Li = bt(!1),
    eo = bt(0),
    xa = ke(eo, (e) => e > 0),
    un = bt("default"),
    Wt = bt(null),
    Co = bt((zi && Eo) || Zp()),
    Zu = ke([je, qe, Yn, Kn], ([e, n, r, s]) => {
      const a = new URL(window.location.origin);
      return (
        (a.pathname = "/game"),
        a.searchParams.set("difficulty", r),
        a.searchParams.set("lat", e.lat.toString()),
        a.searchParams.set("lng", e.lng.toString()),
        a.searchParams.set("numberOfQuestions", s.toString()),
        a.searchParams.set("radius", n.toString()),
        a.toString()
      );
    }),
    Hp = ke([Zu, Co], ([e, n]) => `${e}&sharedSeed=${n}`),
    Oo = ke(Wt, (e) =>
      !e || !e.questions || !e.questions.length
        ? null
        : e.questions.sort((n, r) => n.index - r.index),
    ),
    Wi = ke(Oo, (e) =>
      !e || !e.length
        ? null
        : e.find(({ status: n }) => n === "ongoing") ||
          e
            .filter(({ status: n }) => n === "complete")
            .reverse()
            .find(Boolean),
    ),
    Up = ke(Wi, (e) => {
      if (e) return e.index;
    }),
    Fu = ke(Oo, (e) =>
      !e || !e.length ? null : e.find(({ status: n }) => n === "pending"),
    ),
    Hu = ke(Wt, (e) =>
      e ? e.questions.reduce((n, r) => n + (r.score ?? 0), 0) : null,
    ),
    jp = async () =>
      new Promise((e, n) => {
        navigator.geolocation.getCurrentPosition(
          (r) => {
            const s = { lat: r.coords.latitude, lng: Ue(r.coords.longitude) };
            e(s);
          },
          (r) => {
            pt(() =>
              localStorage.removeItem("lastKnownWebGeolocationPermissionState"),
            ),
              n(r);
          },
          { enableHighAccuracy: !0 },
        );
      }),
    Uu = async () => {
      const e = await jp();
      je.set(e);
    },
    Dt = ({ name: e, title: n }) => {
      pt(() => {
        window.goatcounter.count({ path: e, title: n, event: !0 });
      });
    };
  function La(e) {
    let n;
    function r(l, h) {
      if (l[0] === "pre-prompt") return Gp;
      if (l[0] === "prompted") return qp;
      if (l[0] === "denied") return Wp;
    }
    let s = r(e),
      a = s && s(e);
    return {
      c() {
        (n = k("div")),
          a && a.c(),
          T(n, "class", "geolocation-requester__inner svelte-1ggrm7i");
      },
      m(l, h) {
        D(l, n, h), a && a.m(n, null);
      },
      p(l, h) {
        s === (s = r(l)) && a
          ? a.p(l, h)
          : (a && a.d(1), (a = s && s(l)), a && (a.c(), a.m(n, null)));
      },
      d(l) {
        l && N(n), a && a.d();
      },
    };
  }
  function Wp(e) {
    let n, r, s, a, l, h, f, p, _, v;
    return {
      c() {
        (n = k("h2")),
          (n.textContent = "Move circle to your current location?"),
          (r = U()),
          (s = k("div")),
          (s.innerHTML = `<p class="svelte-1ggrm7i"><i>Back Of Your Hand</i> needs permission to access your GPS location
            in this web browser.</p> <p class="svelte-1ggrm7i">You previously blocked this. To proceed:</p><p class="svelte-1ggrm7i"></p><ol class="svelte-1ggrm7i"><li class="svelte-1ggrm7i">Reset all permissions for backofyourhand.com in your web browser
              settings.</li> <li class="svelte-1ggrm7i">Click &quot;Retry&quot; below.</li></ol>`),
          (a = U()),
          (l = k("div")),
          (h = k("button")),
          (h.textContent = "Retry"),
          (f = U()),
          (p = k("button")),
          (p.textContent = "Cancel"),
          T(n, "class", "geolocation-requester__heading svelte-1ggrm7i"),
          T(s, "class", "geolocation-requester__instructions svelte-1ggrm7i"),
          T(h, "class", "button--primary"),
          T(l, "class", "button-group");
      },
      m(m, w) {
        D(m, n, w),
          D(m, r, w),
          D(m, s, w),
          D(m, a, w),
          D(m, l, w),
          b(l, h),
          b(l, f),
          b(l, p),
          _ || ((v = [ht(h, "click", e[4]), ht(p, "click", e[3])]), (_ = !0));
      },
      p: ut,
      d(m) {
        m && (N(n), N(r), N(s), N(a), N(l)), (_ = !1), Ft(v);
      },
    };
  }
  function qp(e) {
    let n, r, s;
    return {
      c() {
        (n = k("p")), (r = K(e[1])), (s = K(' "Allow"'));
      },
      m(a, l) {
        D(a, n, l), b(n, r), b(n, s);
      },
      p(a, l) {
        l & 2 && Pt(r, a[1]);
      },
      d(a) {
        a && N(n);
      },
    };
  }
  function Gp(e) {
    let n, r, s, a, l, h, f, p, _, v, m, w, S, P, O, I, z, M, C, F, B, Z;
    return {
      c() {
        (n = k("h2")),
          (n.textContent = "Move circle to your current location?"),
          (r = U()),
          (s = k("div")),
          (a = k("p")),
          (a.innerHTML = `<i>Back Of Your Hand</i> needs permission to access your GPS location
            in this web browser.`),
          (l = U()),
          (h = k("p")),
          (h.textContent = "To proceed:"),
          (f = U()),
          (p = k("ol")),
          (_ = k("li")),
          (v = K(e[1])),
          (m = K(' "Continue".')),
          (w = U()),
          (S = k("li")),
          (P = K(e[1])),
          (O = K(' "Allow" when prompted by your browser.')),
          (I = U()),
          (z = k("div")),
          (M = k("button")),
          (M.textContent = "Continue"),
          (C = U()),
          (F = k("button")),
          (F.textContent = "Cancel"),
          T(n, "class", "geolocation-requester__heading svelte-1ggrm7i"),
          T(a, "class", "svelte-1ggrm7i"),
          T(h, "class", "svelte-1ggrm7i"),
          T(_, "class", "svelte-1ggrm7i"),
          T(S, "class", "svelte-1ggrm7i"),
          T(p, "class", "svelte-1ggrm7i"),
          T(s, "class", "geolocation-requester__instructions svelte-1ggrm7i"),
          T(M, "class", "button--primary"),
          T(z, "class", "button-group");
      },
      m(V, st) {
        D(V, n, st),
          D(V, r, st),
          D(V, s, st),
          b(s, a),
          b(s, l),
          b(s, h),
          b(s, f),
          b(s, p),
          b(p, _),
          b(_, v),
          b(_, m),
          b(p, w),
          b(p, S),
          b(S, P),
          b(S, O),
          D(V, I, st),
          D(V, z, st),
          b(z, M),
          b(z, C),
          b(z, F),
          B || ((Z = [ht(M, "click", e[2]), ht(F, "click", e[3])]), (B = !0));
      },
      p(V, st) {
        st & 2 && Pt(v, V[1]), st & 2 && Pt(P, V[1]);
      },
      d(V) {
        V && (N(n), N(r), N(s), N(I), N(z)), (B = !1), Ft(Z);
      },
    };
  }
  function Vp(e) {
    let n,
      r,
      s = e[0] !== null && La(e);
    return {
      c() {
        (n = k("div")),
          s && s.c(),
          T(
            n,
            "class",
            (r =
              "geolocation-requester " +
              (e[0] ? `geolocation-requester--${e[0]}` : "") +
              " svelte-1ggrm7i"),
          );
      },
      m(a, l) {
        D(a, n, l), s && s.m(n, null);
      },
      p(a, [l]) {
        a[0] !== null
          ? s
            ? s.p(a, l)
            : ((s = La(a)), s.c(), s.m(n, null))
          : s && (s.d(1), (s = null)),
          l & 1 &&
            r !==
              (r =
                "geolocation-requester " +
                (a[0] ? `geolocation-requester--${a[0]}` : "") +
                " svelte-1ggrm7i") &&
            T(n, "class", r);
      },
      i: ut,
      o: ut,
      d(a) {
        a && N(n), s && s.d();
      },
    };
  }
  function $p(e, n, r) {
    let s, a;
    return (
      it(e, be, (p) => r(0, (s = p))),
      it(e, ko, (p) => r(1, (a = p))),
      [
        s,
        a,
        async () => {
          be.set("prompted");
          try {
            await Uu(),
              be.set(null),
              pt(() =>
                localStorage.setItem(
                  "lastKnownWebGeolocationPermissionState",
                  "granted",
                ),
              ),
              Dt({
                name: "web-geolocation-prompt-flow-complete",
                title: "Web geolocation prompt flow complete",
              });
          } catch (p) {
            if (!(p instanceof window.GeolocationPositionError))
              throw (
                (pt(() =>
                  localStorage.removeItem(
                    "lastKnownWebGeolocationPermissionState",
                  ),
                ),
                p)
              );
            pt(() =>
              localStorage.setItem(
                "lastKnownWebGeolocationPermissionState",
                "denied",
              ),
            ),
              be.set(null),
              Dt({
                name: "web-geolocation-prompt-rejected",
                title: "Web geolocation prompt rejected",
              });
          }
        },
        async () => {
          be.set(null),
            Dt({
              name: `geolocation-requester-cancelled--${s}`,
              title: `GeolocationRequester cancelled (status was ${s})`,
            });
        },
        () => {
          pt(() =>
            localStorage.removeItem("lastKnownWebGeolocationPermissionState"),
          ),
            (window.location = window.location.href);
        },
      ]
    );
  }
  class Yp extends Ve {
    constructor(n) {
      super(), Ge(this, n, $p, Vp, Ee, {});
    }
  }
  function Kp(e) {
    let n, r;
    return {
      c() {
        (n = k("div")),
          (r = k("div")),
          (r.innerHTML = `<div class="svelte-wcufdo">Loading
      
      <div id="fountainG" class="svelte-wcufdo"><div id="fountainG_1" class="fountainG svelte-wcufdo"></div> <div id="fountainG_2" class="fountainG svelte-wcufdo"></div> <div id="fountainG_3" class="fountainG svelte-wcufdo"></div> <div id="fountainG_4" class="fountainG svelte-wcufdo"></div> <div id="fountainG_5" class="fountainG svelte-wcufdo"></div> <div id="fountainG_6" class="fountainG svelte-wcufdo"></div> <div id="fountainG_7" class="fountainG svelte-wcufdo"></div> <div id="fountainG_8" class="fountainG svelte-wcufdo"></div></div></div>`),
          T(r, "class", "loading-indicator svelte-wcufdo"),
          se(r, "loading-indicator--shown", e[0]),
          T(n, "id", "hud"),
          T(n, "class", "svelte-wcufdo");
      },
      m(s, a) {
        D(s, n, a), b(n, r);
      },
      p(s, [a]) {
        a & 1 && se(r, "loading-indicator--shown", s[0]);
      },
      i: ut,
      o: ut,
      d(s) {
        s && N(n);
      },
    };
  }
  function Xp(e, n, r) {
    let s;
    return it(e, Li, (a) => r(0, (s = a))), [s];
  }
  class Jp extends Ve {
    constructor(n) {
      super(), Ge(this, n, Xp, Kp, Ee, {});
    }
  }
  const no = (e, n) => Math.round(e / n.questions.length);
  function Ta(e, n, r) {
    const s = e.slice();
    return (s[5] = n[r]), s;
  }
  function Ea(e) {
    let n,
      r,
      s,
      a = no(e[3], e[2]) + "",
      l,
      h,
      f,
      p = e[2].didSetNewDeviceBestScore && ka();
    return {
      c() {
        (n = k("p")),
          (r = k("span")),
          (s = K("Overall score: ")),
          (l = K(a)),
          (h = K("%")),
          (f = U()),
          p && p.c(),
          T(r, "class", "svelte-vah7bx"),
          T(n, "class", "points-total svelte-vah7bx");
      },
      m(_, v) {
        D(_, n, v),
          b(n, r),
          b(r, s),
          b(r, l),
          b(r, h),
          b(n, f),
          p && p.m(n, null);
      },
      p(_, v) {
        v & 12 && a !== (a = no(_[3], _[2]) + "") && Pt(l, a),
          _[2].didSetNewDeviceBestScore
            ? p || ((p = ka()), p.c(), p.m(n, null))
            : p && (p.d(1), (p = null));
      },
      d(_) {
        _ && N(n), p && p.d();
      },
    };
  }
  function ka(e) {
    let n;
    return {
      c() {
        (n = k("span")),
          (n.textContent = "New personal best!"),
          T(n, "class", "tada svelte-vah7bx");
      },
      m(r, s) {
        D(r, n, s);
      },
      d(r) {
        r && N(n);
      },
    };
  }
  function Ca(e) {
    let n,
      r = e[5].target.alternativeName + "",
      s,
      a;
    return {
      c() {
        (n = K("(")), (s = K(r)), (a = K(")"));
      },
      m(l, h) {
        D(l, n, h), D(l, s, h), D(l, a, h);
      },
      p(l, h) {
        h & 16 && r !== (r = l[5].target.alternativeName + "") && Pt(s, r);
      },
      d(l) {
        l && (N(n), N(s), N(a));
      },
    };
  }
  function Oa(e) {
    let n,
      r,
      s = e[5].target.name + "",
      a,
      l,
      h,
      f,
      p,
      _,
      v = e[5].score + "",
      m,
      w,
      S,
      P,
      O,
      I = e[5].target.alternativeName && Ca(e);
    return {
      c() {
        (n = k("li")),
          (r = k("span")),
          (a = K(s)),
          (l = U()),
          I && I.c(),
          (h = U()),
          (f = k("span")),
          (f.textContent = "(Score:"),
          (p = U()),
          (_ = k("span")),
          (m = K(v)),
          (w = K("%")),
          (S = U()),
          (P = k("span")),
          (P.textContent = ")"),
          (O = U()),
          T(
            r,
            "class",
            "results-list__street-name single-line-text-overflow svelte-vah7bx",
          ),
          T(f, "class", "hide-accessibly"),
          T(P, "class", "hide-accessibly"),
          T(n, "class", "svelte-vah7bx");
      },
      m(z, M) {
        D(z, n, M),
          b(n, r),
          b(r, a),
          b(r, l),
          I && I.m(r, null),
          b(n, h),
          b(n, f),
          b(n, p),
          b(n, _),
          b(_, m),
          b(_, w),
          b(n, S),
          b(n, P),
          b(n, O);
      },
      p(z, M) {
        M & 16 && s !== (s = z[5].target.name + "") && Pt(a, s),
          z[5].target.alternativeName
            ? I
              ? I.p(z, M)
              : ((I = Ca(z)), I.c(), I.m(r, null))
            : I && (I.d(1), (I = null)),
          M & 16 && v !== (v = z[5].score + "") && Pt(m, v);
      },
      d(z) {
        z && N(n), I && I.d();
      },
    };
  }
  function Qp(e) {
    let n,
      r,
      s,
      a,
      l,
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S = e[2] && e[3] && Ea(e),
      P = _a(e[4] ?? []),
      O = [];
    for (let I = 0; I < P.length; I += 1) O[I] = Oa(Ta(e, P, I));
    return {
      c() {
        (n = k("div")),
          (r = k("h2")),
          (r.textContent = "Summary"),
          (s = U()),
          S && S.c(),
          (a = U()),
          (l = k("ol"));
        for (let I = 0; I < O.length; I += 1) O[I].c();
        (h = U()),
          (f = k("div")),
          (p = k("button")),
          (p.textContent = "Start a new round"),
          (_ = U()),
          (v = k("button")),
          (v.textContent = "Reset"),
          T(r, "class", "hide-accessibly svelte-vah7bx"),
          T(l, "class", "results-list svelte-vah7bx"),
          T(p, "class", "button--primary"),
          T(f, "class", "call-to-action svelte-vah7bx"),
          T(n, "class", "summary svelte-vah7bx");
      },
      m(I, z) {
        D(I, n, z), b(n, r), b(n, s), S && S.m(n, null), b(n, a), b(n, l);
        for (let M = 0; M < O.length; M += 1) O[M] && O[M].m(l, null);
        b(n, h),
          b(n, f),
          b(f, p),
          b(f, _),
          b(f, v),
          m ||
            ((w = [
              ht(p, "click", function () {
                Vn(e[0]) && e[0].apply(this, arguments);
              }),
              ht(v, "click", function () {
                Vn(e[1]) && e[1].apply(this, arguments);
              }),
            ]),
            (m = !0));
      },
      p(I, [z]) {
        if (
          ((e = I),
          e[2] && e[3]
            ? S
              ? S.p(e, z)
              : ((S = Ea(e)), S.c(), S.m(n, a))
            : S && (S.d(1), (S = null)),
          z & 16)
        ) {
          P = _a(e[4] ?? []);
          let M;
          for (M = 0; M < P.length; M += 1) {
            const C = Ta(e, P, M);
            O[M] ? O[M].p(C, z) : ((O[M] = Oa(C)), O[M].c(), O[M].m(l, null));
          }
          for (; M < O.length; M += 1) O[M].d(1);
          O.length = P.length;
        }
      },
      i: ut,
      o: ut,
      d(I) {
        I && N(n), S && S.d(), bd(O, I), (m = !1), Ft(w);
      },
    };
  }
  function t_(e, n, r) {
    let s, a, l;
    it(e, Wt, (p) => r(2, (s = p))),
      it(e, Hu, (p) => r(3, (a = p))),
      it(e, Oo, (p) => r(4, (l = p)));
    let { onRestartClicked: h } = n,
      { reset: f } = n;
    return (
      (e.$$set = (p) => {
        "onRestartClicked" in p && r(0, (h = p.onRestartClicked)),
          "reset" in p && r(1, (f = p.reset));
      }),
      [h, f, s, a, l]
    );
  }
  class e_ extends Ve {
    constructor(n) {
      super(), Ge(this, n, t_, Qp, Ee, { onRestartClicked: 0, reset: 1 });
    }
  }
  const Mo = async () => {
    Ou(xa) &&
      (await new Promise((e) => {
        const n = xa.subscribe((r) => {
          if (r) return;
          const s = () => {
            if (!n) {
              setTimeout(s);
              return;
            }
            n(), setTimeout(e, 50);
          };
          s();
        });
      }));
  };
  function n_(e) {
    let n,
      r,
      s,
      a,
      l = e[8].toLowerCase() + "",
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S,
      P,
      O,
      I,
      z = e[9] && Ma(e);
    function M(Z, V) {
      return Z[10] ? a_ : s_;
    }
    let C = M(e),
      F = C(e),
      B = e[12] && za(e);
    return {
      c() {
        (n = k("p")),
          (n.textContent =
            "How well do you know your area? Test your knowledge by locating streets."),
          (r = U()),
          (s = k("p")),
          (a = K("To select a different area, you can zoom out and ")),
          (h = K(l)),
          (f = K(`
        anywhere on the map`)),
          (p = U()),
          z && z.c(),
          (_ = U()),
          (v = k("div")),
          F.c(),
          (m = U()),
          (w = k("a")),
          (S = K(`Learn more
          `)),
          (P = k("span")),
          (P.textContent = "(how to play, etc)"),
          (O = U()),
          B && B.c(),
          (I = Lo()),
          T(n, "class", "svelte-a39h9l"),
          T(s, "class", "hide-accessibly svelte-a39h9l"),
          T(P, "class", "hide-accessibly"),
          T(
            w,
            "href",
            "/learn-more?continue=" +
              encodeURIComponent(
                window.location.pathname +
                  window.location.search +
                  window.location.hash,
              ),
          ),
          T(w, "class", "svelte-a39h9l"),
          T(v, "class", "call-to-action svelte-a39h9l"),
          T(v, "id", "start-call-to-action");
      },
      m(Z, V) {
        D(Z, n, V),
          D(Z, r, V),
          D(Z, s, V),
          b(s, a),
          b(s, h),
          b(s, f),
          D(Z, p, V),
          z && z.m(Z, V),
          D(Z, _, V),
          D(Z, v, V),
          F.m(v, null),
          b(v, m),
          b(v, w),
          b(w, S),
          b(w, P),
          D(Z, O, V),
          B && B.m(Z, V),
          D(Z, I, V);
      },
      p(Z, V) {
        V[0] & 256 && l !== (l = Z[8].toLowerCase() + "") && Pt(h, l),
          Z[9]
            ? z
              ? z.p(Z, V)
              : ((z = Ma(Z)), z.c(), z.m(_.parentNode, _))
            : z && (z.d(1), (z = null)),
          C === (C = M(Z)) && F
            ? F.p(Z, V)
            : (F.d(1), (F = C(Z)), F && (F.c(), F.m(v, m))),
          Z[12]
            ? B
              ? B.p(Z, V)
              : ((B = za(Z)), B.c(), B.m(I.parentNode, I))
            : B && (B.d(1), (B = null));
      },
      i: ut,
      o: ut,
      d(Z) {
        Z && (N(n), N(r), N(s), N(p), N(_), N(v), N(O), N(I)),
          z && z.d(Z),
          F.d(),
          B && B.d(Z);
      },
    };
  }
  function i_(e) {
    let n,
      r,
      s = e[6] && Ra(e);
    function a(f, p) {
      if (f[6] && f[6].status === "ongoing") return l_;
      if (f[7]) return u_;
    }
    let l = a(e),
      h = l && l(e);
    return {
      c() {
        s && s.c(),
          (n = U()),
          (r = k("div")),
          h && h.c(),
          T(r, "class", "call-to-action svelte-a39h9l");
      },
      m(f, p) {
        s && s.m(f, p), D(f, n, p), D(f, r, p), h && h.m(r, null);
      },
      p(f, p) {
        f[6]
          ? s
            ? s.p(f, p)
            : ((s = Ra(f)), s.c(), s.m(n.parentNode, n))
          : s && (s.d(1), (s = null)),
          l === (l = a(f)) && h
            ? h.p(f, p)
            : (h && h.d(1), (h = l && l(f)), h && (h.c(), h.m(r, null)));
      },
      i: ut,
      o: ut,
      d(f) {
        f && (N(n), N(r)), s && s.d(f), h && h.d();
      },
    };
  }
  function r_(e) {
    let n,
      r,
      s,
      a,
      l,
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S,
      P,
      O,
      I,
      z,
      M,
      C,
      F,
      B,
      Z,
      V,
      st,
      xt,
      Ct = "share" in navigator && f_(e);
    return {
      c() {
        (n = k("h2")),
          (n.textContent = "Create multiplayer session"),
          (r = U()),
          (s = k("p")),
          (s.textContent = `Your friends can play along on their own devices, just give them the
        URL below:`),
          (a = U()),
          (l = k("div")),
          (h = k("span")),
          (f = k("span")),
          (p = K(e[2])),
          (_ = U()),
          (v = k("div")),
          (m = k("button")),
          (m.textContent = "Copy"),
          (w = U()),
          Ct && Ct.c(),
          (S = U()),
          (P = k("p")),
          (P.textContent =
            "They will be given the same set of streets to find as you."),
          (O = U()),
          (I = k("div")),
          (z = k("button")),
          (z.textContent = "Start"),
          (M = U()),
          (C = k("button")),
          (C.textContent = "Reset"),
          (F = U()),
          (B = k("a")),
          (Z = K(`Learn more
          `)),
          (V = k("span")),
          (V.textContent = "(how to play, etc)"),
          T(n, "class", "hide-accessibly svelte-a39h9l"),
          T(s, "class", "svelte-a39h9l"),
          T(f, "class", "multiplayer-link-url svelte-a39h9l"),
          T(h, "class", "multiplayer-link-url-wrapper svelte-a39h9l"),
          T(
            m,
            "class",
            "multiplayer-link-button button--secondary svelte-a39h9l",
          ),
          T(v, "class", "multiplayer-link-buttons svelte-a39h9l"),
          T(l, "class", "multiplayer-link-wrapper svelte-a39h9l"),
          T(P, "class", "svelte-a39h9l"),
          T(z, "class", "button--primary svelte-a39h9l"),
          T(C, "class", "svelte-a39h9l"),
          T(V, "class", "hide-accessibly"),
          T(
            B,
            "href",
            "/learn-more?continue=" +
              encodeURIComponent(
                window.location.pathname +
                  window.location.search +
                  window.location.hash,
              ),
          ),
          T(B, "class", "svelte-a39h9l"),
          T(I, "class", "call-to-action svelte-a39h9l"),
          T(I, "id", "start-call-to-action");
      },
      m(tt, J) {
        D(tt, n, J),
          D(tt, r, J),
          D(tt, s, J),
          D(tt, a, J),
          D(tt, l, J),
          b(l, h),
          b(h, f),
          b(f, p),
          b(l, _),
          b(l, v),
          b(v, m),
          b(v, w),
          Ct && Ct.m(v, null),
          D(tt, S, J),
          D(tt, P, J),
          D(tt, O, J),
          D(tt, I, J),
          b(I, z),
          b(I, M),
          b(I, C),
          b(I, F),
          b(I, B),
          b(B, Z),
          b(B, V),
          st ||
            ((xt = [
              ht(m, "click", e[24]),
              ht(z, "click", e[22]),
              ht(C, "click", e[21]),
            ]),
            (st = !0));
      },
      p(tt, J) {
        J[0] & 4 && Pt(p, tt[2]), "share" in navigator && Ct.p(tt, J);
      },
      i: ut,
      o: ut,
      d(tt) {
        tt && (N(n), N(r), N(s), N(a), N(l), N(S), N(P), N(O), N(I)),
          Ct && Ct.d(),
          (st = !1),
          Ft(xt);
      },
    };
  }
  function o_(e) {
    let n, r;
    return (
      (n = new e_({ props: { onRestartClicked: e[19], reset: e[21] } })),
      {
        c() {
          ln(n.$$.fragment);
        },
        m(s, a) {
          Ze(n, s, a), (r = !0);
        },
        p: ut,
        i(s) {
          r || (Qt(n.$$.fragment, s), (r = !0));
        },
        o(s) {
          ue(n.$$.fragment, s), (r = !1);
        },
        d(s) {
          Fe(n, s);
        },
      }
    );
  }
  function Ma(e) {
    let n, r, s, a;
    return {
      c() {
        (n = k("p")),
          (r = K("Personal best score: ")),
          (s = K(e[9])),
          (a = K("%")),
          T(n, "class", "subtext svelte-a39h9l");
      },
      m(l, h) {
        D(l, n, h), b(n, r), b(n, s), b(n, a);
      },
      p(l, h) {
        h[0] & 512 && Pt(s, l[9]);
      },
      d(l) {
        l && N(n);
      },
    };
  }
  function s_(e) {
    let n,
      r,
      s,
      a,
      l,
      h,
      f,
      p,
      _ = e[12] && Ia();
    return {
      c() {
        (n = k("button")),
          (n.textContent = "Play solo"),
          (r = U()),
          (s = k("button")),
          (s.textContent = "Play with friends"),
          (a = U()),
          (l = k("button")),
          (h = K("Settings ")),
          _ && _.c(),
          T(n, "class", "button--primary svelte-a39h9l"),
          T(s, "class", "button--secondary svelte-a39h9l"),
          T(l, "class", "settings-button svelte-a39h9l"),
          se(l, "hasUnseenSetting", !e[11] || e[11] < Na);
      },
      m(v, m) {
        D(v, n, m),
          D(v, r, m),
          D(v, s, m),
          D(v, a, m),
          D(v, l, m),
          b(l, h),
          _ && _.m(l, null),
          f ||
            ((p = [
              ht(n, "click", e[22]),
              ht(s, "click", e[23]),
              ht(l, "click", e[26]),
            ]),
            (f = !0));
      },
      p(v, m) {
        v[12]
          ? _ || ((_ = Ia()), _.c(), _.m(l, null))
          : _ && (_.d(1), (_ = null)),
          m[0] & 2048 && se(l, "hasUnseenSetting", !v[11] || v[11] < Na);
      },
      d(v) {
        v && (N(n), N(r), N(s), N(a), N(l)), _ && _.d(), (f = !1), Ft(p);
      },
    };
  }
  function a_(e) {
    let n, r, s, a, l;
    return {
      c() {
        (n = k("button")),
          (n.textContent = "Play (multiplayer mode)"),
          (r = U()),
          (s = k("button")),
          (s.textContent = "Reset"),
          T(n, "class", "button--primary svelte-a39h9l"),
          T(s, "class", "svelte-a39h9l");
      },
      m(h, f) {
        D(h, n, f),
          D(h, r, f),
          D(h, s, f),
          a || ((l = [ht(n, "click", e[22]), ht(s, "click", e[21])]), (a = !0));
      },
      p: ut,
      d(h) {
        h && (N(n), N(r), N(s)), (a = !1), Ft(l);
      },
    };
  }
  function Ia(e) {
    let n;
    return {
      c() {
        (n = k("span")), (n.textContent = "×"), T(n, "class", "svelte-a39h9l");
      },
      m(r, s) {
        D(r, n, s);
      },
      d(r) {
        r && N(n);
      },
    };
  }
  function za(e) {
    let n,
      r,
      s,
      a,
      l,
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S,
      P,
      O,
      I,
      z,
      M,
      C,
      F,
      B,
      Z,
      V,
      st,
      xt,
      Ct,
      tt,
      J,
      he,
      wt,
      ee,
      Lt,
      Ht,
      j,
      fe,
      W,
      ct,
      A,
      X;
    return (
      (ct = Sd(e[29][0])),
      {
        c() {
          (n = k("div")),
            (r = k("div")),
            (s = k("p")),
            (s.textContent = "Difficulty"),
            (a = U()),
            (l = k("fieldset")),
            (h = k("label")),
            (f = k("input")),
            (p = U()),
            (_ = k("span")),
            (_.innerHTML =
              '<span class="difficultyLabelMainText svelte-a39h9l">Tourist</span> <span class="difficultyLabelDescription svelte-a39h9l">Main streets and landmarks only</span>'),
            (v = U()),
            (m = k("label")),
            (w = k("input")),
            (S = U()),
            (P = k("span")),
            (P.innerHTML =
              '<span class="difficultyLabelMainText svelte-a39h9l">Resident</span> <span class="difficultyLabelDescription svelte-a39h9l">&quot;Tourist&quot; plus some smaller streets</span>'),
            (O = U()),
            (I = k("label")),
            (z = k("input")),
            (M = U()),
            (C = k("span")),
            (C.innerHTML =
              '<span class="difficultyLabelMainText svelte-a39h9l">Taxi driver</span> <span class="difficultyLabelDescription svelte-a39h9l">Every nook and cranny</span>'),
            (F = U()),
            (B = k("div")),
            (Z = k("label")),
            (Z.textContent = "Radius of area"),
            (V = U()),
            (st = k("div")),
            (xt = K(e[13])),
            (Ct = K(" m")),
            (tt = U()),
            (J = k("input")),
            (he = U()),
            (wt = k("div")),
            (ee = k("label")),
            (ee.textContent = "Questions per round"),
            (Lt = U()),
            (Ht = k("div")),
            (j = K(e[14])),
            (fe = U()),
            (W = k("input")),
            T(s, "class", "radioButtonGroupTitle svelte-a39h9l"),
            T(f, "type", "radio"),
            (f.__value = Ot.Tourist),
            Ar(f, f.__value),
            T(_, "class", "difficultyLabelTextWrapper svelte-a39h9l"),
            T(h, "class", "svelte-a39h9l"),
            se(h, "selectedRadioButtonLabel", e[1] === Ot.Tourist),
            T(w, "type", "radio"),
            (w.__value = Ot.Resident),
            Ar(w, w.__value),
            T(P, "class", "difficultyLabelTextWrapper svelte-a39h9l"),
            T(m, "class", "svelte-a39h9l"),
            se(m, "selectedRadioButtonLabel", e[1] === Ot.Resident),
            T(z, "type", "radio"),
            (z.__value = Ot.TaxiDriver),
            Ar(z, z.__value),
            T(C, "class", "difficultyLabelTextWrapper svelte-a39h9l"),
            T(I, "class", "svelte-a39h9l"),
            se(I, "selectedRadioButtonLabel", e[1] === Ot.TaxiDriver),
            T(l, "class", "difficultyRadioButtonGroup svelte-a39h9l"),
            T(r, "class", "wideSetting svelte-a39h9l"),
            T(Z, "for", "radiusSlider"),
            T(st, "class", "subtext svelte-a39h9l"),
            T(J, "type", "range"),
            T(J, "min", "100"),
            T(J, "max", "5000"),
            (J.value = e[13]),
            T(J, "step", "100"),
            T(J, "class", "slider"),
            T(J, "id", "radiusSlider"),
            T(B, "class", "svelte-a39h9l"),
            T(ee, "for", "numberOfQuestionsInput"),
            T(Ht, "class", "subtext svelte-a39h9l"),
            T(W, "type", "range"),
            T(W, "min", "5"),
            T(W, "max", "50"),
            (W.value = e[14]),
            T(W, "step", "5"),
            T(W, "class", "slider"),
            T(W, "id", "numberOfQuestionsInput"),
            T(wt, "class", "svelte-a39h9l"),
            T(n, "class", "settings svelte-a39h9l"),
            ct.p(f, w, z);
        },
        m(E, q) {
          D(E, n, q),
            b(n, r),
            b(r, s),
            b(r, a),
            b(r, l),
            b(l, h),
            b(h, f),
            (f.checked = f.__value === e[1]),
            b(h, p),
            b(h, _),
            b(l, v),
            b(l, m),
            b(m, w),
            (w.checked = w.__value === e[1]),
            b(m, S),
            b(m, P),
            b(l, O),
            b(l, I),
            b(I, z),
            (z.checked = z.__value === e[1]),
            b(I, M),
            b(I, C),
            b(n, F),
            b(n, B),
            b(B, Z),
            b(B, V),
            b(B, st),
            b(st, xt),
            b(st, Ct),
            b(B, tt),
            b(B, J),
            b(n, he),
            b(n, wt),
            b(wt, ee),
            b(wt, Lt),
            b(wt, Ht),
            b(Ht, j),
            b(wt, fe),
            b(wt, W),
            A ||
              ((X = [
                ht(f, "change", e[28]),
                ht(f, "input", e[27]),
                ht(w, "change", e[30]),
                ht(w, "input", e[27]),
                ht(z, "change", e[31]),
                ht(z, "input", e[27]),
                ht(J, "input", e[16]),
                ht(W, "input", e[15]),
              ]),
              (A = !0));
        },
        p(E, q) {
          q[0] & 2 && (f.checked = f.__value === E[1]),
            q[0] & 2 && se(h, "selectedRadioButtonLabel", E[1] === Ot.Tourist),
            q[0] & 2 && (w.checked = w.__value === E[1]),
            q[0] & 2 && se(m, "selectedRadioButtonLabel", E[1] === Ot.Resident),
            q[0] & 2 && (z.checked = z.__value === E[1]),
            q[0] & 2 &&
              se(I, "selectedRadioButtonLabel", E[1] === Ot.TaxiDriver),
            q[0] & 8192 && Pt(xt, E[13]),
            q[0] & 8192 && (J.value = E[13]),
            q[0] & 16384 && Pt(j, E[14]),
            q[0] & 16384 && (W.value = E[14]);
        },
        d(E) {
          E && N(n), ct.r(), (A = !1), Ft(X);
        },
      }
    );
  }
  function Ra(e) {
    let n,
      r,
      s = e[6].index + 1 + "",
      a,
      l,
      h = e[5].questions.length + "",
      f,
      p,
      _,
      v,
      m,
      w,
      S = e[6].target.name + "",
      P,
      O,
      I,
      z,
      M,
      C = e[6].target.alternativeName && Aa(e),
      F = e[6].status === "complete" && e[6].distance && Ba(e);
    return {
      c() {
        (n = k("p")),
          (r = k("span")),
          (a = K(s)),
          (l = K(" / ")),
          (f = K(h)),
          (p = K(" Find the following:")),
          (_ = U()),
          (v = k("div")),
          (m = k("div")),
          (w = k("span")),
          (P = K(S)),
          (O = U()),
          C && C.c(),
          (z = U()),
          F && F.c(),
          (M = Lo()),
          T(r, "class", "question-index svelte-a39h9l"),
          T(n, "class", "svelte-a39h9l"),
          T(w, "class", "street-name svelte-a39h9l"),
          T(
            m,
            "class",
            (I =
              "street-sign " +
              (e[6].target.alternativeNameLanguageCode === "ga"
                ? "street-sign--alternative-name-on-top"
                : "") +
              " svelte-a39h9l"),
          ),
          T(v, "class", "street-sign-wrapper svelte-a39h9l");
      },
      m(B, Z) {
        D(B, n, Z),
          b(n, r),
          b(r, a),
          b(r, l),
          b(r, f),
          b(n, p),
          D(B, _, Z),
          D(B, v, Z),
          b(v, m),
          b(m, w),
          b(w, P),
          b(m, O),
          C && C.m(m, null),
          D(B, z, Z),
          F && F.m(B, Z),
          D(B, M, Z);
      },
      p(B, Z) {
        Z[0] & 64 && s !== (s = B[6].index + 1 + "") && Pt(a, s),
          Z[0] & 32 && h !== (h = B[5].questions.length + "") && Pt(f, h),
          Z[0] & 64 && S !== (S = B[6].target.name + "") && Pt(P, S),
          B[6].target.alternativeName
            ? C
              ? C.p(B, Z)
              : ((C = Aa(B)), C.c(), C.m(m, null))
            : C && (C.d(1), (C = null)),
          Z[0] & 64 &&
            I !==
              (I =
                "street-sign " +
                (B[6].target.alternativeNameLanguageCode === "ga"
                  ? "street-sign--alternative-name-on-top"
                  : "") +
                " svelte-a39h9l") &&
            T(m, "class", I),
          B[6].status === "complete" && B[6].distance
            ? F
              ? F.p(B, Z)
              : ((F = Ba(B)), F.c(), F.m(M.parentNode, M))
            : F && (F.d(1), (F = null));
      },
      d(B) {
        B && (N(n), N(_), N(v), N(z), N(M)), C && C.d(), F && F.d(B);
      },
    };
  }
  function Aa(e) {
    let n,
      r,
      s = e[6].target.alternativeName + "",
      a,
      l;
    return {
      c() {
        (n = k("span")),
          (r = k("span")),
          (r.textContent = "("),
          (a = K(s)),
          (l = k("span")),
          (l.textContent = ")"),
          T(r, "class", "hide-accessibly svelte-a39h9l"),
          T(l, "class", "hide-accessibly svelte-a39h9l"),
          T(n, "class", "street-name-alternative svelte-a39h9l");
      },
      m(h, f) {
        D(h, n, f), b(n, r), b(n, a), b(n, l);
      },
      p(h, f) {
        f[0] & 64 && s !== (s = h[6].target.alternativeName + "") && Pt(a, s);
      },
      d(h) {
        h && N(n);
      },
    };
  }
  function Ba(e) {
    let n,
      r,
      s,
      a,
      l,
      h = Math.round(e[6].distance.amount).toLocaleString() + "",
      f,
      p,
      _ = e[6].distance.unit + "",
      v,
      m,
      w,
      S,
      P = e[6].score + "",
      O,
      I,
      z,
      M;
    return {
      c() {
        (n = k("div")),
          (r = k("h2")),
          (r.textContent = "Result"),
          (s = U()),
          (a = k("p")),
          (l = K("Distance: ")),
          (f = K(h)),
          (p = U()),
          (v = K(_)),
          (m = U()),
          (w = k("p")),
          (S = K("Score: ")),
          (O = K(P)),
          (I = K("%")),
          (z = U()),
          (M = k("p")),
          (M.textContent = "Feel free to zoom in and explore"),
          T(M, "class", "subtext svelte-a39h9l"),
          T(n, "class", "svelte-a39h9l");
      },
      m(C, F) {
        D(C, n, F),
          b(n, r),
          b(n, s),
          b(n, a),
          b(a, l),
          b(a, f),
          b(a, p),
          b(a, v),
          b(n, m),
          b(n, w),
          b(w, S),
          b(w, O),
          b(w, I),
          b(n, z),
          b(n, M);
      },
      p(C, F) {
        F[0] & 64 &&
          h !== (h = Math.round(C[6].distance.amount).toLocaleString() + "") &&
          Pt(f, h),
          F[0] & 64 && _ !== (_ = C[6].distance.unit + "") && Pt(v, _),
          F[0] & 64 && P !== (P = C[6].score + "") && Pt(O, P);
      },
      d(C) {
        C && N(n);
      },
    };
  }
  function u_(e) {
    let n;
    function r(l, h) {
      return l[3] ? h_ : c_;
    }
    let s = r(e),
      a = s(e);
    return {
      c() {
        a.c(), (n = Lo());
      },
      m(l, h) {
        a.m(l, h), D(l, n, h);
      },
      p(l, h) {
        s === (s = r(l)) && a
          ? a.p(l, h)
          : (a.d(1), (a = s(l)), a && (a.c(), a.m(n.parentNode, n)));
      },
      d(l) {
        l && N(n), a.d(l);
      },
    };
  }
  function l_(e) {
    let n, r, s, a, l, h, f, p, _, v, m;
    return {
      c() {
        (n = k("button")),
          (r = K("Confirm")),
          (a = U()),
          (l = k("p")),
          (h = K(e[8])),
          (f = K(` the
            `)),
          (p = k("a")),
          (p.textContent = "map"),
          (_ = K(" to drop a pin on a street")),
          T(n, "class", "button--primary svelte-a39h9l"),
          (n.disabled = s = !e[7]),
          T(p, "href", "#map"),
          T(p, "class", "unstyled-link svelte-a39h9l"),
          T(l, "class", "subtext svelte-a39h9l");
      },
      m(w, S) {
        D(w, n, S),
          b(n, r),
          D(w, a, S),
          D(w, l, S),
          b(l, h),
          b(l, f),
          b(l, p),
          b(l, _),
          v || ((m = ht(n, "click", e[17])), (v = !0));
      },
      p(w, S) {
        S[0] & 128 && s !== (s = !w[7]) && (n.disabled = s),
          S[0] & 256 && Pt(h, w[8]);
      },
      d(w) {
        w && (N(n), N(a), N(l)), (v = !1), m();
      },
    };
  }
  function c_(e) {
    let n, r, s, a, l, h, f;
    return {
      c() {
        (n = k("button")),
          (n.textContent = "Start a new round"),
          (r = U()),
          (s = k("button")),
          (s.textContent = "View summary"),
          (a = U()),
          (l = k("button")),
          (l.textContent = "Reset"),
          T(n, "class", "button--primary svelte-a39h9l"),
          T(s, "class", "button--secondary svelte-a39h9l"),
          T(l, "class", "svelte-a39h9l");
      },
      m(p, _) {
        D(p, n, _),
          D(p, r, _),
          D(p, s, _),
          D(p, a, _),
          D(p, l, _),
          h ||
            ((f = [
              ht(n, "click", e[19]),
              ht(s, "click", e[20]),
              ht(l, "click", e[21]),
            ]),
            (h = !0));
      },
      p: ut,
      d(p) {
        p && (N(n), N(r), N(s), N(a), N(l)), (h = !1), Ft(f);
      },
    };
  }
  function h_(e) {
    let n, r, s;
    return {
      c() {
        (n = k("button")),
          (n.textContent = "Next"),
          T(n, "class", "button--primary svelte-a39h9l");
      },
      m(a, l) {
        D(a, n, l), r || ((s = ht(n, "click", e[18])), (r = !0));
      },
      p: ut,
      d(a) {
        a && N(n), (r = !1), s();
      },
    };
  }
  function f_(e) {
    let n, r, s;
    return {
      c() {
        (n = k("button")),
          (n.textContent = "Share"),
          T(n, "class", "multiplayer-link-button svelte-a39h9l");
      },
      m(a, l) {
        D(a, n, l), r || ((s = ht(n, "click", e[25])), (r = !0));
      },
      p: ut,
      d(a) {
        a && N(n), (r = !1), s();
      },
    };
  }
  function d_(e) {
    let n, r, s, a, l, h, f, p;
    const _ = [o_, r_, i_, n_],
      v = [];
    function m(w, S) {
      return (
        S[0] & 32 && (l = null),
        w[4] === "summary"
          ? 0
          : w[4] === "creating-multiplayer-session"
            ? 1
            : (l == null &&
                (l = !!(
                  w[5]?.status && ["ongoing", "complete"].includes(w[5].status)
                )),
              l ? 2 : w[5] ? -1 : 3)
      );
    }
    return (
      ~(h = m(e, [-1, -1])) && (f = v[h] = _[h](e)),
      {
        c() {
          (n = k("div")),
            (r = k("div")),
            (s = k("h1")),
            (s.innerHTML =
              '<svg viewBox="-10 -8 20 16" xmlns="http://www.w3.org/2000/svg" class="svelte-a39h9l"><g fill="#FFF"><path d="M-4.551 3.954a.27.27 0 11-.146-.52c.21-.06.443-.148.718-.273a4.319 4.319 0 01.295-.112V-7.88L-9.9-5.604V8.039l6.216-2.275V3.6c0-.01-.043.04-.073.054a5.611 5.611 0 01-.794.3zm-3.307-5.518c-.147.046-.289.094-.424.14l-.346.114a.271.271 0 01-.34-.176.27.27 0 01.175-.34c.107-.033.22-.071.34-.111.137-.046.282-.095.431-.142a.27.27 0 11.164.515zm.965-.53a.27.27 0 01.248-.292c.33-.026.642-.001.904.08a.27.27 0 01-.159.516 1.927 1.927 0 00-.702-.057.27.27 0 01-.291-.247zm1.185 5.823a.27.27 0 01-.382.011c-.207-.195-.354-.481-.438-.85A.27.27 0 01-6 2.77c.059.263.154.457.281.577a.27.27 0 01.011.382zm.414-2.708l-.064.094c-.134.197-.26.383-.37.57a.27.27 0 01-.37.097.27.27 0 01-.097-.37c.12-.203.257-.406.39-.601l.064-.093a.27.27 0 11.447.303zm.332-1.081a.27.27 0 01-.195-.329c.027-.107.04-.21.04-.31 0-.115-.017-.225-.054-.337a.27.27 0 01.514-.169c.054.165.082.335.082.506 0 .145-.02.294-.058.444a.27.27 0 01-.329.195zm9.116-5.544V2.24c0 .036.106.07.154.107a.27.27 0 01.049.378c-.05.065-.203.099-.203.104v5.209L10.1 5.764V-7.88L4.154-5.604zm1.995 9.56a.27.27 0 01-.37.094 10.622 10.622 0 01-.696-.458.27.27 0 01-.064-.377.27.27 0 01.377-.064 9.847 9.847 0 00.66.434c.128.077.17.243.093.371zM6.44-1.04a.27.27 0 01-.232-.409l.676-1.14-1.416-.603a.27.27 0 11.212-.497l1.481.631.65-1.096a.27.27 0 11.465.275l-.613 1.035 1.067.455a.27.27 0 11-.212.497l-1.133-.483-.713 1.202a.268.268 0 01-.232.133zm1.593 5.612c-.164.047-.33.077-.515.07a2.235 2.235 0 01-.41-.04.27.27 0 01.1-.531c.108.02.207.027.313.03.127 0 .25-.016.365-.049a.27.27 0 01.147.52zm.134-4.884a.27.27 0 01-.373-.082 11.902 11.902 0 00-.451-.654.27.27 0 11.434-.321 12.518 12.518 0 01.472.683.27.27 0 01-.082.374zm.27 1.068a.27.27 0 01.488-.23 7.17 7.17 0 01.316.782.27.27 0 01-.513.17 6.594 6.594 0 00-.292-.722zm.808 2.865a.27.27 0 11-.483-.24c.097-.197.153-.424.166-.675a.27.27 0 11.54.028 2.233 2.233 0 01-.223.887zM3.244 1.928c.034-.048.1-.077.1-.095v-7.437L-2.874-7.88V2.706c0-.064.173-.12.237-.156.158-.088.375-.179.535-.27l.254-.127c.13-.073.309-.027.382.103s.034.295-.096.368l-.222.127c-.162.092-.322.183-.482.272a.264.264 0 01-.13.034c-.095 0-.297-.05-.347-.14-.011-.02-.131-.116-.131-.138v2.986l6.216 2.274V2.355c0-.016-.028-.034-.051-.05-.122-.086-.134-.255-.048-.377zm-2.9-.255a8.46 8.46 0 00-.719.319.27.27 0 01-.361-.123.27.27 0 01.123-.362 9.148 9.148 0 01.764-.339.272.272 0 01.35.156.27.27 0 01-.157.35zm2.242-.17a.27.27 0 01-.357.138 2.285 2.285 0 00-.693-.2.27.27 0 01-.242-.296.272.272 0 01.297-.242c.267.027.548.107.857.244a.27.27 0 01.138.357zm-5.995 1.71v.386a.268.268 0 00.06-.303.274.274 0 00-.06-.084zm.536-.434v-.073.073z"></path><path d="M7.777-1.37a.27.27 0 10-.434.322 11.902 11.902 0 01.45.654.27.27 0 10.456-.292 12.627 12.627 0 00-.472-.683z"></path></g></svg> <svg viewBox="-626.081 0 1252.162 100" xmlns="http://www.w3.org/2000/svg" class="svelte-a39h9l"><g fill="#FFF"><path d="M-604.619 83.515c-1.14 0-1.71-.57-1.71-1.711V58.32c0-1.14.57-1.71 1.71-1.71h17.107c3.525 0 6.066.674 7.62 2.021 1.556 1.348 2.334 3.63 2.334 6.843v9.02c0 3.215-.752 5.522-2.255 6.921-1.504 1.4-3.966 2.1-7.388 2.1zm0-42.924c-1.14 0-1.71-.57-1.71-1.71V18.195c0-1.14.57-1.71 1.71-1.71h16.019c3.317 0 5.728.7 7.231 2.099 1.504 1.4 2.255 3.706 2.255 6.92v6.066c0 3.214-.777 5.52-2.332 6.92-1.556 1.4-3.992 2.1-7.31 2.1zm-21.462 56.143c0 2.177 1.089 3.266 3.266 3.266h38.88c8.087 0 14.36-2.177 18.818-6.532 4.459-4.354 6.688-10.575 6.688-18.662v-9.332c0-5.08-1.244-8.994-3.733-11.741-2.488-2.748-5.806-4.433-9.953-5.055 8.19-2.592 12.286-8.294 12.286-17.107v-6.377c0-8.087-2.23-14.308-6.687-18.662C-570.975 2.177-577.3 0-585.49 0h-37.325c-2.177 0-3.266 1.089-3.266 3.266zM-530.762 100c1.037 0 1.789-.233 2.255-.7.467-.466.804-1.322 1.011-2.566l4.355-17.107h30.327l4.354 17.107c.207 1.244.518 2.1.933 2.566.415.467 1.193.7 2.333.7h14.93c1.866 0 2.488-1.089 1.866-3.266L-492.97 3.266C-493.488 1.089-495.044 0-497.636 0h-20.684c-2.385 0-3.94 1.089-4.666 3.266l-24.572 93.468c-.622 2.177 0 3.266 1.866 3.266zm22.55-81.182h.623l11.198 44.946h-23.018zM-414.914 100c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74v-7.31c0-2.28-1.14-3.42-3.421-3.42h-13.064c-2.177 0-3.266 1.14-3.266 3.42v6.377c0 3.318-.7 5.676-2.1 7.076-1.399 1.4-3.758 2.1-7.076 2.1h-10.575c-3.214 0-5.521-.7-6.92-2.1-1.4-1.4-2.1-3.758-2.1-7.076V26.283c0-3.318.7-5.676 2.1-7.076 1.399-1.4 3.706-2.1 6.92-2.1h10.575c3.318 0 5.677.7 7.077 2.1 1.4 1.4 2.1 3.758 2.1 7.076v6.376c0 2.281 1.088 3.422 3.265 3.422h13.064c2.28 0 3.421-1.14 3.421-3.422v-7.31c0-8.086-2.255-14.333-6.765-18.74C-400.528 2.204-406.827 0-414.914 0h-16.951c-8.191 0-14.516 2.177-18.974 6.532-4.458 4.354-6.687 10.627-6.687 18.818v49.3c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532zM-357.233 100c2.178 0 3.266-1.089 3.266-3.266V70.14l9.798-11.509 23.795 38.103c1.244 2.177 3.68 3.266 7.31 3.266h11.352c1.452 0 2.411-.337 2.878-1.01.466-.675.337-1.634-.39-2.878l-32.97-51.633 29.55-40.902c.829-1.037 1.114-1.892.855-2.566-.26-.674-.96-1.011-2.1-1.011h-15.24c-2.697 0-4.718 1.089-6.066 3.266l-23.64 34.681c-2.384 3.94-3.991 7.154-4.82 9.642h-.312V3.266c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zM-228.336 82.893c-3.318 0-5.65-.7-6.998-2.1-1.348-1.4-2.022-3.758-2.022-7.076V26.283c0-3.318.674-5.676 2.022-7.076 1.347-1.4 3.68-2.1 6.998-2.1h11.042c3.318 0 5.677.7 7.076 2.1 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.758 2.1-7.076 2.1zM-214.028 100c8.19 0 14.515-2.177 18.974-6.532 4.458-4.354 6.687-10.627 6.687-18.818v-49.3c0-8.19-2.23-14.464-6.687-18.818C-199.513 2.177-205.837 0-214.028 0h-17.418c-8.191 0-14.516 2.177-18.974 6.532-4.458 4.354-6.687 10.627-6.687 18.818v49.3c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532zM-154.634 100c2.177 0 3.266-1.089 3.266-3.266V63.608c0-1.14.622-1.71 1.866-1.71h26.594c2.177 0 3.266-1.141 3.266-3.422v-10.42c0-2.177-1.089-3.266-3.266-3.266h-26.594c-1.244 0-1.866-.622-1.866-1.866V18.818c0-1.14.622-1.71 1.866-1.71h31.26c2.073 0 3.11-1.09 3.11-3.267V3.266c0-2.177-1.037-3.266-3.11-3.266h-49.611c-2.178 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.088 3.266 3.266 3.266zM-33.05 100c2.178 0 3.267-1.089 3.267-3.266V63.453L-1.323 3.42c.519-1.036.545-1.866.078-2.488C-1.712.311-2.463 0-3.5 0h-16.485c-1.763 0-3.007 1.089-3.733 3.266l-15.24 37.792h-1.09L-55.6 3.266C-56.43 1.089-57.673 0-59.332 0h-16.485c-.933 0-1.633.337-2.1 1.01-.466.675-.492 1.478-.078 2.411l28.46 60.032v33.281c0 2.177 1.09 3.266 3.267 3.266zM36.454 82.893c-3.318 0-5.65-.7-6.999-2.1-1.348-1.4-2.022-3.758-2.022-7.076V26.283c0-3.318.674-5.676 2.022-7.076 1.348-1.4 3.68-2.1 6.999-2.1h11.042c3.317 0 5.676.7 7.076 2.1 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.759 2.1-7.076 2.1zM50.762 100c8.19 0 14.515-2.177 18.973-6.532 4.458-4.354 6.688-10.627 6.688-18.818v-49.3c0-8.19-2.23-14.464-6.688-18.818C65.277 2.177 58.952 0 50.762 0H33.343c-8.19 0-14.515 2.177-18.973 6.532C9.91 10.886 7.682 17.159 7.682 25.35v49.3c0 8.19 2.23 14.464 6.688 18.818C18.828 97.823 25.152 100 33.343 100zM144.837 0c-2.178 0-3.266 1.089-3.266 3.266v70.451c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.758 2.1-7.076 2.1h-10.73c-3.215 0-5.522-.7-6.922-2.1-1.4-1.4-2.1-3.758-2.1-7.076V3.266c0-2.177-1.088-3.266-3.265-3.266h-13.22c-2.177 0-3.265 1.089-3.265 3.266V74.65c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532h17.107c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74V3.11c0-2.073-1.14-3.11-3.422-3.11zM195.832 100c2.178 0 3.266-1.089 3.266-3.266V64.852c0-1.14.622-1.71 1.867-1.71h10.42l15.552 33.592c.518 1.348 1.192 2.23 2.021 2.644.83.415 2.178.622 4.044.622h12.597c2.696 0 3.577-1.244 2.644-3.733l-16.64-34.68v-.623c9.227-3.836 13.84-11.612 13.84-23.328v-12.13c0-8.088-2.28-14.36-6.842-18.819C234.039 2.23 227.714 0 219.627 0h-37.014c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zm4.977-52.722c-1.14 0-1.71-.57-1.71-1.71v-26.75c0-1.14.57-1.71 1.71-1.71h15.241c3.318 0 5.754.725 7.31 2.177 1.555 1.451 2.333 3.784 2.333 6.998v12.13c0 3.111-.778 5.366-2.333 6.766-1.556 1.4-3.992 2.1-7.31 2.1zM312.285 100c2.178 0 3.266-1.089 3.266-3.266V60.342c0-1.14.622-1.71 1.866-1.71h26.284c1.14 0 1.71.57 1.71 1.71v36.392c0 2.177 1.089 3.266 3.266 3.266h13.22c2.177 0 3.265-1.089 3.265-3.266V3.266c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v36.547c0 1.14-.57 1.711-1.71 1.711h-26.284c-1.244 0-1.866-.57-1.866-1.71V3.265c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zM394.385 100c1.037 0 1.789-.233 2.255-.7.467-.466.804-1.322 1.011-2.566l4.355-17.107h30.326l4.355 17.107c.207 1.244.518 2.1.933 2.566.415.467 1.192.7 2.333.7h14.93c1.866 0 2.488-1.089 1.866-3.266L432.177 3.266C431.658 1.089 430.103 0 427.51 0h-20.684c-2.385 0-3.94 1.089-4.666 3.266L377.59 96.734c-.622 2.177 0 3.266 1.866 3.266zm22.55-81.182h.623l11.197 44.946h-23.017zM485.35 100c2.177 0 3.266-1.089 3.266-3.266V39.036h.622l31.104 57.854c1.037 2.073 2.696 3.11 4.977 3.11h11.353c2.177 0 3.266-1.089 3.266-3.266V3.266c0-2.177-1.089-3.266-3.266-3.266h-12.908c-2.178 0-3.266 1.089-3.266 3.266V61.12h-.622L488.46 2.177C487.735.726 486.283 0 484.106 0h-11.664c-2.178 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.088 3.266 3.266 3.266zM580.203 82.893c-1.14 0-1.711-.57-1.711-1.711V18.818c0-1.14.57-1.71 1.71-1.71h16.952c3.318 0 5.677.7 7.077 2.099 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.759 2.1-7.077 2.1zM558.74 96.734c0 2.177 1.088 3.266 3.266 3.266h38.413c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74v-49.3c0-8.087-2.255-14.334-6.765-18.74C614.806 2.203 608.507 0 600.42 0h-38.413c-2.178 0-3.266 1.089-3.266 3.266z"></path></g></svg> <span class="hide-accessibly">Back Of Your Hand</span>'),
            (a = U()),
            f && f.c(),
            T(s, "class", "svelte-a39h9l"),
            T(r, "class", "context-panel svelte-a39h9l"),
            T(r, "id", "context-panel"),
            T(n, "class", "context-panel-wrapper svelte-a39h9l");
        },
        m(w, S) {
          D(w, n, S),
            b(n, r),
            b(r, s),
            b(r, a),
            ~h && v[h].m(r, null),
            (p = !0);
        },
        p(w, S) {
          let P = h;
          (h = m(w, S)),
            h === P
              ? ~h && v[h].p(w, S)
              : (f &&
                  (Iu(),
                  ue(v[P], 1, 1, () => {
                    v[P] = null;
                  }),
                  zu()),
                ~h
                  ? ((f = v[h]),
                    f ? f.p(w, S) : ((f = v[h] = _[h](w)), f.c()),
                    Qt(f, 1),
                    f.m(r, null))
                  : (f = null));
        },
        i(w) {
          p || (Qt(f), (p = !0));
        },
        o(w) {
          ue(f), (p = !1);
        },
        d(w) {
          w && N(n), ~h && v[h].d();
        },
      }
    );
  }
  const Na = 1679088005110;
  function p_(e, n, r) {
    let s,
      a,
      l,
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S,
      P,
      O,
      I = ut,
      z = () => (I(), (I = ji(F, (E) => r(12, (O = E)))), F),
      M,
      C;
    it(e, Yn, (E) => r(32, (s = E))),
      it(e, Hp, (E) => r(2, (a = E))),
      it(e, Co, (E) => r(33, (l = E))),
      it(e, Fu, (E) => r(3, (h = E))),
      it(e, un, (E) => r(4, (f = E))),
      it(e, Wt, (E) => r(5, (p = E))),
      it(e, Wi, (E) => r(6, (_ = E))),
      it(e, fn, (E) => r(7, (v = E))),
      it(e, ko, (E) => r(8, (m = E))),
      it(e, xi, (E) => r(9, (w = E))),
      it(e, zi, (E) => r(10, (S = E))),
      it(e, Pa, (E) => r(11, (P = E))),
      it(e, qe, (E) => r(13, (M = E))),
      it(e, Kn, (E) => r(14, (C = E))),
      e.$$.on_destroy.push(() => I());
    let { areSettingsShown: F = bt(!1) } = n;
    z();
    const B = (E) => {
        const q = parseInt(E.target.value);
        Kn.update(() => q);
      },
      Z = () => {
        const E = parseInt(document.getElementById("radiusSlider").value);
        qe.update(() => E);
      },
      V = () => {
        jn.set(!0);
      },
      st = () => {
        Wt.update((E) => {
          if (!E) throw new Error("round is falsy");
          return {
            ...E,
            questions: E.questions.map((q) =>
              q === h ? { ...h, status: "ongoing" } : q,
            ),
          };
        }),
          fn.set(null),
          jn.set(!1);
      },
      xt = () => (
        Dt({ name: "restart", title: "Restart" }), tt(), Se.set(!0), J()
      ),
      Ct = () => {
        un.set("summary"), Dt({ name: "view-summary", title: "View summary" });
      },
      tt = () => {
        F.set(!1),
          fn.set(null),
          jn.set(!1),
          Se.set(!1),
          Wt.set(null),
          zi.set(!1),
          un.set("default");
      },
      J = async () => {
        un.set("default"), await Mo(), Se.set(!0), F.set(!1);
      },
      he = async () => {
        await J(), Dt({ name: "start", title: "Start" });
      },
      wt = async () => {
        un.set("creating-multiplayer-session");
      },
      ee = () => {
        if (window.location.protocol === "http:") {
          alert(`Only supported on HTTPS (seed: ${l})`);
          return;
        }
        navigator.clipboard.writeText(a);
      },
      Lt = async () => {
        try {
          await navigator.share({
            text: "How well do you know your area? Join my game and test your knowledge by locating streets.",
            title: "Back Of Your Hand",
            url: a,
          });
        } catch {}
      };
    F.subscribe((E) => {
      E &&
        setTimeout(() => {
          document.getElementById("start-call-to-action").scrollIntoView(!0);
        }, 10);
    }),
      Se.subscribe(() => {
        F.set(!1);
      });
    const Ht = () => {
      F.update((q) => !q);
      const E = Date.now();
      Pa.set(E), localStorage.setItem("settingsLastOpenedAt", E.toString());
    };
    let j = s;
    function fe(E) {
      Dt({
        name: `difficulty-updated-to-${E.currentTarget.value}`,
        title: `difficulty-updated-to-${E.currentTarget.value}`,
      }),
        Yn.set(E.currentTarget.value);
    }
    const W = [[]];
    function ct() {
      (j = this.__value), r(1, j);
    }
    function A() {
      (j = this.__value), r(1, j);
    }
    function X() {
      (j = this.__value), r(1, j);
    }
    return (
      (e.$$set = (E) => {
        "areSettingsShown" in E && z(r(0, (F = E.areSettingsShown)));
      }),
      [
        F,
        j,
        a,
        h,
        f,
        p,
        _,
        v,
        m,
        w,
        S,
        P,
        O,
        M,
        C,
        B,
        Z,
        V,
        st,
        xt,
        Ct,
        tt,
        he,
        wt,
        ee,
        Lt,
        Ht,
        fe,
        ct,
        W,
        A,
        X,
      ]
    );
  }
  class __ extends Ve {
    constructor(n) {
      super(), Ge(this, n, p_, d_, Ee, { areSettingsShown: 0 }, null, [-1, -1]);
    }
  }
  function Da(e) {
    let n,
      r,
      s,
      a,
      l,
      h =
        e[0].message +
        `
` +
        e[0].stack,
      f,
      p;
    return {
      c() {
        (n = k("h2")),
          (n.textContent = "Error details"),
          (r = U()),
          (s = k("pre")),
          (a = K("        ")),
          (l = k("code")),
          (f = K(h)),
          (p = K(`
      `));
      },
      m(_, v) {
        D(_, n, v), D(_, r, v), D(_, s, v), b(s, a), b(s, l), b(l, f), b(s, p);
      },
      p(_, v) {
        v & 1 &&
          h !==
            (h =
              _[0].message +
              `
` +
              _[0].stack) &&
          Pt(f, h);
      },
      d(_) {
        _ && (N(n), N(r), N(s));
      },
    };
  }
  function m_(e) {
    let n,
      r,
      s,
      a,
      l,
      h,
      f,
      p,
      _,
      v,
      m,
      w,
      S = e[0] && Da(e);
    return {
      c() {
        (n = k("div")),
          (r = k("div")),
          (s = k("h1")),
          (s.textContent = "Something broke"),
          (a = U()),
          (l = k("p")),
          (l.textContent = "There was an unexpected error. Sorry about this."),
          (h = U()),
          (f = k("button")),
          (f.textContent = "Reset"),
          (p = U()),
          (_ = k("button")),
          (_.textContent = "Send feedback"),
          (v = U()),
          S && S.c(),
          T(f, "class", "button--primary"),
          T(_, "class", "button"),
          T(r, "class", "full-screen-display__inner"),
          T(n, "class", "full-screen-display");
      },
      m(P, O) {
        D(P, n, O),
          b(n, r),
          b(r, s),
          b(r, a),
          b(r, l),
          b(r, h),
          b(r, f),
          b(r, p),
          b(r, _),
          b(r, v),
          S && S.m(r, null),
          m || ((w = [ht(f, "click", e[2]), ht(_, "click", e[1])]), (m = !0));
      },
      p(P, [O]) {
        P[0]
          ? S
            ? S.p(P, O)
            : ((S = Da(P)), S.c(), S.m(r, null))
          : S && (S.d(1), (S = null));
      },
      i: ut,
      o: ut,
      d(P) {
        P && N(n), S && S.d(), (m = !1), Ft(w);
      },
    };
  }
  function g_(e, n, r) {
    let { error: s = null } = n;
    const a = () => {
        window.location = window.location.origin + "/learn-more#feedback";
      },
      l = () => {
        window.location = window.location.origin;
      };
    return (
      (e.$$set = (h) => {
        "error" in h && r(0, (s = h.error));
      }),
      [s, a, l]
    );
  }
  class ju extends Ve {
    constructor(n) {
      super(), Ge(this, n, g_, m_, Ee, { error: 0 });
    }
  }
  var io = { exports: {} };
  /* @preserve
   * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
   * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
   */ (function (e, n) {
    (function (r, s) {
      s(n);
    })(Zn, function (r) {
      var s = "1.9.4";
      function a(t) {
        var i, o, u, c;
        for (o = 1, u = arguments.length; o < u; o++) {
          c = arguments[o];
          for (i in c) t[i] = c[i];
        }
        return t;
      }
      var l =
        Object.create ||
        (function () {
          function t() {}
          return function (i) {
            return (t.prototype = i), new t();
          };
        })();
      function h(t, i) {
        var o = Array.prototype.slice;
        if (t.bind) return t.bind.apply(t, o.call(arguments, 1));
        var u = o.call(arguments, 2);
        return function () {
          return t.apply(i, u.length ? u.concat(o.call(arguments)) : arguments);
        };
      }
      var f = 0;
      function p(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++f), t._leaflet_id;
      }
      function _(t, i, o) {
        var u, c, d, g;
        return (
          (g = function () {
            (u = !1), c && (d.apply(o, c), (c = !1));
          }),
          (d = function () {
            u
              ? (c = arguments)
              : (t.apply(o, arguments), setTimeout(g, i), (u = !0));
          }),
          d
        );
      }
      function v(t, i, o) {
        var u = i[1],
          c = i[0],
          d = u - c;
        return t === u && o ? t : ((((t - c) % d) + d) % d) + c;
      }
      function m() {
        return !1;
      }
      function w(t, i) {
        if (i === !1) return t;
        var o = Math.pow(10, i === void 0 ? 6 : i);
        return Math.round(t * o) / o;
      }
      function S(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function P(t) {
        return S(t).split(/\s+/);
      }
      function O(t, i) {
        Object.prototype.hasOwnProperty.call(t, "options") ||
          (t.options = t.options ? l(t.options) : {});
        for (var o in i) t.options[o] = i[o];
        return t.options;
      }
      function I(t, i, o) {
        var u = [];
        for (var c in t)
          u.push(
            encodeURIComponent(o ? c.toUpperCase() : c) +
              "=" +
              encodeURIComponent(t[c]),
          );
        return (!i || i.indexOf("?") === -1 ? "?" : "&") + u.join("&");
      }
      var z = /\{ *([\w_ -]+) *\}/g;
      function M(t, i) {
        return t.replace(z, function (o, u) {
          var c = i[u];
          if (c === void 0)
            throw new Error("No value provided for variable " + o);
          return typeof c == "function" && (c = c(i)), c;
        });
      }
      var C =
        Array.isArray ||
        function (t) {
          return Object.prototype.toString.call(t) === "[object Array]";
        };
      function F(t, i) {
        for (var o = 0; o < t.length; o++) if (t[o] === i) return o;
        return -1;
      }
      var B = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Z(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var V = 0;
      function st(t) {
        var i = +new Date(),
          o = Math.max(0, 16 - (i - V));
        return (V = i + o), window.setTimeout(t, o);
      }
      var xt = window.requestAnimationFrame || Z("RequestAnimationFrame") || st,
        Ct =
          window.cancelAnimationFrame ||
          Z("CancelAnimationFrame") ||
          Z("CancelRequestAnimationFrame") ||
          function (t) {
            window.clearTimeout(t);
          };
      function tt(t, i, o) {
        if (o && xt === st) t.call(i);
        else return xt.call(window, h(t, i));
      }
      function J(t) {
        t && Ct.call(window, t);
      }
      var he = {
        __proto__: null,
        extend: a,
        create: l,
        bind: h,
        get lastId() {
          return f;
        },
        stamp: p,
        throttle: _,
        wrapNum: v,
        falseFn: m,
        formatNum: w,
        trim: S,
        splitWords: P,
        setOptions: O,
        getParamString: I,
        template: M,
        isArray: C,
        indexOf: F,
        emptyImageUrl: B,
        requestFn: xt,
        cancelFn: Ct,
        requestAnimFrame: tt,
        cancelAnimFrame: J,
      };
      function wt() {}
      (wt.extend = function (t) {
        var i = function () {
            O(this),
              this.initialize && this.initialize.apply(this, arguments),
              this.callInitHooks();
          },
          o = (i.__super__ = this.prototype),
          u = l(o);
        (u.constructor = i), (i.prototype = u);
        for (var c in this)
          Object.prototype.hasOwnProperty.call(this, c) &&
            c !== "prototype" &&
            c !== "__super__" &&
            (i[c] = this[c]);
        return (
          t.statics && a(i, t.statics),
          t.includes && (ee(t.includes), a.apply(null, [u].concat(t.includes))),
          a(u, t),
          delete u.statics,
          delete u.includes,
          u.options &&
            ((u.options = o.options ? l(o.options) : {}),
            a(u.options, t.options)),
          (u._initHooks = []),
          (u.callInitHooks = function () {
            if (!this._initHooksCalled) {
              o.callInitHooks && o.callInitHooks.call(this),
                (this._initHooksCalled = !0);
              for (var d = 0, g = u._initHooks.length; d < g; d++)
                u._initHooks[d].call(this);
            }
          }),
          i
        );
      }),
        (wt.include = function (t) {
          var i = this.prototype.options;
          return (
            a(this.prototype, t),
            t.options &&
              ((this.prototype.options = i), this.mergeOptions(t.options)),
            this
          );
        }),
        (wt.mergeOptions = function (t) {
          return a(this.prototype.options, t), this;
        }),
        (wt.addInitHook = function (t) {
          var i = Array.prototype.slice.call(arguments, 1),
            o =
              typeof t == "function"
                ? t
                : function () {
                    this[t].apply(this, i);
                  };
          return (
            (this.prototype._initHooks = this.prototype._initHooks || []),
            this.prototype._initHooks.push(o),
            this
          );
        });
      function ee(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = C(t) ? t : [t];
          for (var i = 0; i < t.length; i++)
            t[i] === L.Mixin.Events &&
              console.warn(
                "Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",
                new Error().stack,
              );
        }
      }
      var Lt = {
        on: function (t, i, o) {
          if (typeof t == "object") for (var u in t) this._on(u, t[u], i);
          else {
            t = P(t);
            for (var c = 0, d = t.length; c < d; c++) this._on(t[c], i, o);
          }
          return this;
        },
        off: function (t, i, o) {
          if (!arguments.length) delete this._events;
          else if (typeof t == "object") for (var u in t) this._off(u, t[u], i);
          else {
            t = P(t);
            for (
              var c = arguments.length === 1, d = 0, g = t.length;
              d < g;
              d++
            )
              c ? this._off(t[d]) : this._off(t[d], i, o);
          }
          return this;
        },
        _on: function (t, i, o, u) {
          if (typeof i != "function") {
            console.warn("wrong listener type: " + typeof i);
            return;
          }
          if (this._listens(t, i, o) === !1) {
            o === this && (o = void 0);
            var c = { fn: i, ctx: o };
            u && (c.once = !0),
              (this._events = this._events || {}),
              (this._events[t] = this._events[t] || []),
              this._events[t].push(c);
          }
        },
        _off: function (t, i, o) {
          var u, c, d;
          if (this._events && ((u = this._events[t]), !!u)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (c = 0, d = u.length; c < d; c++) u[c].fn = m;
              delete this._events[t];
              return;
            }
            if (typeof i != "function") {
              console.warn("wrong listener type: " + typeof i);
              return;
            }
            var g = this._listens(t, i, o);
            if (g !== !1) {
              var y = u[g];
              this._firingCount &&
                ((y.fn = m), (this._events[t] = u = u.slice())),
                u.splice(g, 1);
            }
          }
        },
        fire: function (t, i, o) {
          if (!this.listens(t, o)) return this;
          var u = a({}, i, {
            type: t,
            target: this,
            sourceTarget: (i && i.sourceTarget) || this,
          });
          if (this._events) {
            var c = this._events[t];
            if (c) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var d = 0, g = c.length; d < g; d++) {
                var y = c[d],
                  x = y.fn;
                y.once && this.off(t, x, y.ctx), x.call(y.ctx || this, u);
              }
              this._firingCount--;
            }
          }
          return o && this._propagateEvent(u), this;
        },
        listens: function (t, i, o, u) {
          typeof t != "string" &&
            console.warn('"string" type argument expected');
          var c = i;
          typeof i != "function" && ((u = !!i), (c = void 0), (o = void 0));
          var d = this._events && this._events[t];
          if (d && d.length && this._listens(t, c, o) !== !1) return !0;
          if (u) {
            for (var g in this._eventParents)
              if (this._eventParents[g].listens(t, i, o, u)) return !0;
          }
          return !1;
        },
        _listens: function (t, i, o) {
          if (!this._events) return !1;
          var u = this._events[t] || [];
          if (!i) return !!u.length;
          o === this && (o = void 0);
          for (var c = 0, d = u.length; c < d; c++)
            if (u[c].fn === i && u[c].ctx === o) return c;
          return !1;
        },
        once: function (t, i, o) {
          if (typeof t == "object") for (var u in t) this._on(u, t[u], i, !0);
          else {
            t = P(t);
            for (var c = 0, d = t.length; c < d; c++) this._on(t[c], i, o, !0);
          }
          return this;
        },
        addEventParent: function (t) {
          return (
            (this._eventParents = this._eventParents || {}),
            (this._eventParents[p(t)] = t),
            this
          );
        },
        removeEventParent: function (t) {
          return this._eventParents && delete this._eventParents[p(t)], this;
        },
        _propagateEvent: function (t) {
          for (var i in this._eventParents)
            this._eventParents[i].fire(
              t.type,
              a({ layer: t.target, propagatedFrom: t.target }, t),
              !0,
            );
        },
      };
      (Lt.addEventListener = Lt.on),
        (Lt.removeEventListener = Lt.clearAllEventListeners = Lt.off),
        (Lt.addOneTimeEventListener = Lt.once),
        (Lt.fireEvent = Lt.fire),
        (Lt.hasEventListeners = Lt.listens);
      var Ht = wt.extend(Lt);
      function j(t, i, o) {
        (this.x = o ? Math.round(t) : t), (this.y = o ? Math.round(i) : i);
      }
      var fe =
        Math.trunc ||
        function (t) {
          return t > 0 ? Math.floor(t) : Math.ceil(t);
        };
      j.prototype = {
        clone: function () {
          return new j(this.x, this.y);
        },
        add: function (t) {
          return this.clone()._add(W(t));
        },
        _add: function (t) {
          return (this.x += t.x), (this.y += t.y), this;
        },
        subtract: function (t) {
          return this.clone()._subtract(W(t));
        },
        _subtract: function (t) {
          return (this.x -= t.x), (this.y -= t.y), this;
        },
        divideBy: function (t) {
          return this.clone()._divideBy(t);
        },
        _divideBy: function (t) {
          return (this.x /= t), (this.y /= t), this;
        },
        multiplyBy: function (t) {
          return this.clone()._multiplyBy(t);
        },
        _multiplyBy: function (t) {
          return (this.x *= t), (this.y *= t), this;
        },
        scaleBy: function (t) {
          return new j(this.x * t.x, this.y * t.y);
        },
        unscaleBy: function (t) {
          return new j(this.x / t.x, this.y / t.y);
        },
        round: function () {
          return this.clone()._round();
        },
        _round: function () {
          return (
            (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this
          );
        },
        floor: function () {
          return this.clone()._floor();
        },
        _floor: function () {
          return (
            (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this
          );
        },
        ceil: function () {
          return this.clone()._ceil();
        },
        _ceil: function () {
          return (
            (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this
          );
        },
        trunc: function () {
          return this.clone()._trunc();
        },
        _trunc: function () {
          return (this.x = fe(this.x)), (this.y = fe(this.y)), this;
        },
        distanceTo: function (t) {
          t = W(t);
          var i = t.x - this.x,
            o = t.y - this.y;
          return Math.sqrt(i * i + o * o);
        },
        equals: function (t) {
          return (t = W(t)), t.x === this.x && t.y === this.y;
        },
        contains: function (t) {
          return (
            (t = W(t)),
            Math.abs(t.x) <= Math.abs(this.x) &&
              Math.abs(t.y) <= Math.abs(this.y)
          );
        },
        toString: function () {
          return "Point(" + w(this.x) + ", " + w(this.y) + ")";
        },
      };
      function W(t, i, o) {
        return t instanceof j
          ? t
          : C(t)
            ? new j(t[0], t[1])
            : t == null
              ? t
              : typeof t == "object" && "x" in t && "y" in t
                ? new j(t.x, t.y)
                : new j(t, i, o);
      }
      function ct(t, i) {
        if (t)
          for (var o = i ? [t, i] : t, u = 0, c = o.length; u < c; u++)
            this.extend(o[u]);
      }
      ct.prototype = {
        extend: function (t) {
          var i, o;
          if (!t) return this;
          if (t instanceof j || typeof t[0] == "number" || "x" in t)
            i = o = W(t);
          else if (((t = A(t)), (i = t.min), (o = t.max), !i || !o))
            return this;
          return (
            !this.min && !this.max
              ? ((this.min = i.clone()), (this.max = o.clone()))
              : ((this.min.x = Math.min(i.x, this.min.x)),
                (this.max.x = Math.max(o.x, this.max.x)),
                (this.min.y = Math.min(i.y, this.min.y)),
                (this.max.y = Math.max(o.y, this.max.y))),
            this
          );
        },
        getCenter: function (t) {
          return W(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t,
          );
        },
        getBottomLeft: function () {
          return W(this.min.x, this.max.y);
        },
        getTopRight: function () {
          return W(this.max.x, this.min.y);
        },
        getTopLeft: function () {
          return this.min;
        },
        getBottomRight: function () {
          return this.max;
        },
        getSize: function () {
          return this.max.subtract(this.min);
        },
        contains: function (t) {
          var i, o;
          return (
            typeof t[0] == "number" || t instanceof j ? (t = W(t)) : (t = A(t)),
            t instanceof ct ? ((i = t.min), (o = t.max)) : (i = o = t),
            i.x >= this.min.x &&
              o.x <= this.max.x &&
              i.y >= this.min.y &&
              o.y <= this.max.y
          );
        },
        intersects: function (t) {
          t = A(t);
          var i = this.min,
            o = this.max,
            u = t.min,
            c = t.max,
            d = c.x >= i.x && u.x <= o.x,
            g = c.y >= i.y && u.y <= o.y;
          return d && g;
        },
        overlaps: function (t) {
          t = A(t);
          var i = this.min,
            o = this.max,
            u = t.min,
            c = t.max,
            d = c.x > i.x && u.x < o.x,
            g = c.y > i.y && u.y < o.y;
          return d && g;
        },
        isValid: function () {
          return !!(this.min && this.max);
        },
        pad: function (t) {
          var i = this.min,
            o = this.max,
            u = Math.abs(i.x - o.x) * t,
            c = Math.abs(i.y - o.y) * t;
          return A(W(i.x - u, i.y - c), W(o.x + u, o.y + c));
        },
        equals: function (t) {
          return t
            ? ((t = A(t)),
              this.min.equals(t.getTopLeft()) &&
                this.max.equals(t.getBottomRight()))
            : !1;
        },
      };
      function A(t, i) {
        return !t || t instanceof ct ? t : new ct(t, i);
      }
      function X(t, i) {
        if (t)
          for (var o = i ? [t, i] : t, u = 0, c = o.length; u < c; u++)
            this.extend(o[u]);
      }
      X.prototype = {
        extend: function (t) {
          var i = this._southWest,
            o = this._northEast,
            u,
            c;
          if (t instanceof q) (u = t), (c = t);
          else if (t instanceof X) {
            if (((u = t._southWest), (c = t._northEast), !u || !c)) return this;
          } else return t ? this.extend(nt(t) || E(t)) : this;
          return (
            !i && !o
              ? ((this._southWest = new q(u.lat, u.lng)),
                (this._northEast = new q(c.lat, c.lng)))
              : ((i.lat = Math.min(u.lat, i.lat)),
                (i.lng = Math.min(u.lng, i.lng)),
                (o.lat = Math.max(c.lat, o.lat)),
                (o.lng = Math.max(c.lng, o.lng))),
            this
          );
        },
        pad: function (t) {
          var i = this._southWest,
            o = this._northEast,
            u = Math.abs(i.lat - o.lat) * t,
            c = Math.abs(i.lng - o.lng) * t;
          return new X(
            new q(i.lat - u, i.lng - c),
            new q(o.lat + u, o.lng + c),
          );
        },
        getCenter: function () {
          return new q(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2,
          );
        },
        getSouthWest: function () {
          return this._southWest;
        },
        getNorthEast: function () {
          return this._northEast;
        },
        getNorthWest: function () {
          return new q(this.getNorth(), this.getWest());
        },
        getSouthEast: function () {
          return new q(this.getSouth(), this.getEast());
        },
        getWest: function () {
          return this._southWest.lng;
        },
        getSouth: function () {
          return this._southWest.lat;
        },
        getEast: function () {
          return this._northEast.lng;
        },
        getNorth: function () {
          return this._northEast.lat;
        },
        contains: function (t) {
          typeof t[0] == "number" || t instanceof q || "lat" in t
            ? (t = nt(t))
            : (t = E(t));
          var i = this._southWest,
            o = this._northEast,
            u,
            c;
          return (
            t instanceof X
              ? ((u = t.getSouthWest()), (c = t.getNorthEast()))
              : (u = c = t),
            u.lat >= i.lat && c.lat <= o.lat && u.lng >= i.lng && c.lng <= o.lng
          );
        },
        intersects: function (t) {
          t = E(t);
          var i = this._southWest,
            o = this._northEast,
            u = t.getSouthWest(),
            c = t.getNorthEast(),
            d = c.lat >= i.lat && u.lat <= o.lat,
            g = c.lng >= i.lng && u.lng <= o.lng;
          return d && g;
        },
        overlaps: function (t) {
          t = E(t);
          var i = this._southWest,
            o = this._northEast,
            u = t.getSouthWest(),
            c = t.getNorthEast(),
            d = c.lat > i.lat && u.lat < o.lat,
            g = c.lng > i.lng && u.lng < o.lng;
          return d && g;
        },
        toBBoxString: function () {
          return [
            this.getWest(),
            this.getSouth(),
            this.getEast(),
            this.getNorth(),
          ].join(",");
        },
        equals: function (t, i) {
          return t
            ? ((t = E(t)),
              this._southWest.equals(t.getSouthWest(), i) &&
                this._northEast.equals(t.getNorthEast(), i))
            : !1;
        },
        isValid: function () {
          return !!(this._southWest && this._northEast);
        },
      };
      function E(t, i) {
        return t instanceof X ? t : new X(t, i);
      }
      function q(t, i, o) {
        if (isNaN(t) || isNaN(i))
          throw new Error("Invalid LatLng object: (" + t + ", " + i + ")");
        (this.lat = +t), (this.lng = +i), o !== void 0 && (this.alt = +o);
      }
      q.prototype = {
        equals: function (t, i) {
          if (!t) return !1;
          t = nt(t);
          var o = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng),
          );
          return o <= (i === void 0 ? 1e-9 : i);
        },
        toString: function (t) {
          return "LatLng(" + w(this.lat, t) + ", " + w(this.lng, t) + ")";
        },
        distanceTo: function (t) {
          return Bt.distance(this, nt(t));
        },
        wrap: function () {
          return Bt.wrapLatLng(this);
        },
        toBounds: function (t) {
          var i = (180 * t) / 40075017,
            o = i / Math.cos((Math.PI / 180) * this.lat);
          return E([this.lat - i, this.lng - o], [this.lat + i, this.lng + o]);
        },
        clone: function () {
          return new q(this.lat, this.lng, this.alt);
        },
      };
      function nt(t, i, o) {
        return t instanceof q
          ? t
          : C(t) && typeof t[0] != "object"
            ? t.length === 3
              ? new q(t[0], t[1], t[2])
              : t.length === 2
                ? new q(t[0], t[1])
                : null
            : t == null
              ? t
              : typeof t == "object" && "lat" in t
                ? new q(t.lat, "lng" in t ? t.lng : t.lon, t.alt)
                : i === void 0
                  ? null
                  : new q(t, i, o);
      }
      var Yt = {
          latLngToPoint: function (t, i) {
            var o = this.projection.project(t),
              u = this.scale(i);
            return this.transformation._transform(o, u);
          },
          pointToLatLng: function (t, i) {
            var o = this.scale(i),
              u = this.transformation.untransform(t, o);
            return this.projection.unproject(u);
          },
          project: function (t) {
            return this.projection.project(t);
          },
          unproject: function (t) {
            return this.projection.unproject(t);
          },
          scale: function (t) {
            return 256 * Math.pow(2, t);
          },
          zoom: function (t) {
            return Math.log(t / 256) / Math.LN2;
          },
          getProjectedBounds: function (t) {
            if (this.infinite) return null;
            var i = this.projection.bounds,
              o = this.scale(t),
              u = this.transformation.transform(i.min, o),
              c = this.transformation.transform(i.max, o);
            return new ct(u, c);
          },
          infinite: !1,
          wrapLatLng: function (t) {
            var i = this.wrapLng ? v(t.lng, this.wrapLng, !0) : t.lng,
              o = this.wrapLat ? v(t.lat, this.wrapLat, !0) : t.lat,
              u = t.alt;
            return new q(o, i, u);
          },
          wrapLatLngBounds: function (t) {
            var i = t.getCenter(),
              o = this.wrapLatLng(i),
              u = i.lat - o.lat,
              c = i.lng - o.lng;
            if (u === 0 && c === 0) return t;
            var d = t.getSouthWest(),
              g = t.getNorthEast(),
              y = new q(d.lat - u, d.lng - c),
              x = new q(g.lat - u, g.lng - c);
            return new X(y, x);
          },
        },
        Bt = a({}, Yt, {
          wrapLng: [-180, 180],
          R: 6371e3,
          distance: function (t, i) {
            var o = Math.PI / 180,
              u = t.lat * o,
              c = i.lat * o,
              d = Math.sin(((i.lat - t.lat) * o) / 2),
              g = Math.sin(((i.lng - t.lng) * o) / 2),
              y = d * d + Math.cos(u) * Math.cos(c) * g * g,
              x = 2 * Math.atan2(Math.sqrt(y), Math.sqrt(1 - y));
            return this.R * x;
          },
        }),
        Gi = 6378137,
        Ce = {
          R: Gi,
          MAX_LATITUDE: 85.0511287798,
          project: function (t) {
            var i = Math.PI / 180,
              o = this.MAX_LATITUDE,
              u = Math.max(Math.min(o, t.lat), -o),
              c = Math.sin(u * i);
            return new j(
              this.R * t.lng * i,
              (this.R * Math.log((1 + c) / (1 - c))) / 2,
            );
          },
          unproject: function (t) {
            var i = 180 / Math.PI;
            return new q(
              (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * i,
              (t.x * i) / this.R,
            );
          },
          bounds: (function () {
            var t = Gi * Math.PI;
            return new ct([-t, -t], [t, t]);
          })(),
        };
      function Vi(t, i, o, u) {
        if (C(t)) {
          (this._a = t[0]),
            (this._b = t[1]),
            (this._c = t[2]),
            (this._d = t[3]);
          return;
        }
        (this._a = t), (this._b = i), (this._c = o), (this._d = u);
      }
      Vi.prototype = {
        transform: function (t, i) {
          return this._transform(t.clone(), i);
        },
        _transform: function (t, i) {
          return (
            (i = i || 1),
            (t.x = i * (this._a * t.x + this._b)),
            (t.y = i * (this._c * t.y + this._d)),
            t
          );
        },
        untransform: function (t, i) {
          return (
            (i = i || 1),
            new j((t.x / i - this._b) / this._a, (t.y / i - this._d) / this._c)
          );
        },
      };
      function xn(t, i, o, u) {
        return new Vi(t, i, o, u);
      }
      var $i = a({}, Bt, {
          code: "EPSG:3857",
          projection: Ce,
          transformation: (function () {
            var t = 0.5 / (Math.PI * Ce.R);
            return xn(t, 0.5, -t, 0.5);
          })(),
        }),
        Ku = a({}, $i, { code: "EPSG:900913" });
      function Ro(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function Ao(t, i) {
        var o = "",
          u,
          c,
          d,
          g,
          y,
          x;
        for (u = 0, d = t.length; u < d; u++) {
          for (y = t[u], c = 0, g = y.length; c < g; c++)
            (x = y[c]), (o += (c ? "L" : "M") + x.x + " " + x.y);
          o += i ? (G.svg ? "z" : "x") : "";
        }
        return o || "M0 0";
      }
      var Yi = document.documentElement.style,
        Qn = "ActiveXObject" in window,
        Xu = Qn && !document.addEventListener,
        Bo = "msLaunchUri" in navigator && !("documentMode" in document),
        Ki = ne("webkit"),
        No = ne("android"),
        Do = ne("android 2") || ne("android 3"),
        Ju = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
        Qu = No && ne("Google") && Ju < 537 && !("AudioNode" in window),
        Xi = !!window.opera,
        Zo = !Bo && ne("chrome"),
        Fo = ne("gecko") && !Ki && !Xi && !Qn,
        tl = !Zo && ne("safari"),
        Ho = ne("phantom"),
        Uo = "OTransition" in Yi,
        el = navigator.platform.indexOf("Win") === 0,
        jo = Qn && "transition" in Yi,
        Ji =
          "WebKitCSSMatrix" in window &&
          "m11" in new window.WebKitCSSMatrix() &&
          !Do,
        Wo = "MozPerspective" in Yi,
        nl = !window.L_DISABLE_3D && (jo || Ji || Wo) && !Uo && !Ho,
        Ln = typeof orientation < "u" || ne("mobile"),
        il = Ln && Ki,
        rl = Ln && Ji,
        qo = !window.PointerEvent && window.MSPointerEvent,
        Go = !!(window.PointerEvent || qo),
        Vo = "ontouchstart" in window || !!window.TouchEvent,
        ol = !window.L_NO_TOUCH && (Vo || Go),
        sl = Ln && Xi,
        al = Ln && Fo,
        ul =
          (window.devicePixelRatio ||
            window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,
        ll = (function () {
          var t = !1;
          try {
            var i = Object.defineProperty({}, "passive", {
              get: function () {
                t = !0;
              },
            });
            window.addEventListener("testPassiveEventSupport", m, i),
              window.removeEventListener("testPassiveEventSupport", m, i);
          } catch {}
          return t;
        })(),
        cl = (function () {
          return !!document.createElement("canvas").getContext;
        })(),
        Qi = !!(document.createElementNS && Ro("svg").createSVGRect),
        hl =
          !!Qi &&
          (function () {
            var t = document.createElement("div");
            return (
              (t.innerHTML = "<svg/>"),
              (t.firstChild && t.firstChild.namespaceURI) ===
                "http://www.w3.org/2000/svg"
            );
          })(),
        fl =
          !Qi &&
          (function () {
            try {
              var t = document.createElement("div");
              t.innerHTML = '<v:shape adj="1"/>';
              var i = t.firstChild;
              return (
                (i.style.behavior = "url(#default#VML)"),
                i && typeof i.adj == "object"
              );
            } catch {
              return !1;
            }
          })(),
        dl = navigator.platform.indexOf("Mac") === 0,
        pl = navigator.platform.indexOf("Linux") === 0;
      function ne(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var G = {
          ie: Qn,
          ielt9: Xu,
          edge: Bo,
          webkit: Ki,
          android: No,
          android23: Do,
          androidStock: Qu,
          opera: Xi,
          chrome: Zo,
          gecko: Fo,
          safari: tl,
          phantom: Ho,
          opera12: Uo,
          win: el,
          ie3d: jo,
          webkit3d: Ji,
          gecko3d: Wo,
          any3d: nl,
          mobile: Ln,
          mobileWebkit: il,
          mobileWebkit3d: rl,
          msPointer: qo,
          pointer: Go,
          touch: ol,
          touchNative: Vo,
          mobileOpera: sl,
          mobileGecko: al,
          retina: ul,
          passiveEvents: ll,
          canvas: cl,
          svg: Qi,
          vml: fl,
          inlineSvg: hl,
          mac: dl,
          linux: pl,
        },
        $o = G.msPointer ? "MSPointerDown" : "pointerdown",
        Yo = G.msPointer ? "MSPointerMove" : "pointermove",
        Ko = G.msPointer ? "MSPointerUp" : "pointerup",
        Xo = G.msPointer ? "MSPointerCancel" : "pointercancel",
        tr = { touchstart: $o, touchmove: Yo, touchend: Ko, touchcancel: Xo },
        Jo = { touchstart: wl, touchmove: ti, touchend: ti, touchcancel: ti },
        $e = {},
        Qo = !1;
      function _l(t, i, o) {
        return (
          i === "touchstart" && yl(),
          Jo[i]
            ? ((o = Jo[i].bind(this, o)), t.addEventListener(tr[i], o, !1), o)
            : (console.warn("wrong event specified:", i), m)
        );
      }
      function ml(t, i, o) {
        if (!tr[i]) {
          console.warn("wrong event specified:", i);
          return;
        }
        t.removeEventListener(tr[i], o, !1);
      }
      function gl(t) {
        $e[t.pointerId] = t;
      }
      function vl(t) {
        $e[t.pointerId] && ($e[t.pointerId] = t);
      }
      function ts(t) {
        delete $e[t.pointerId];
      }
      function yl() {
        Qo ||
          (document.addEventListener($o, gl, !0),
          document.addEventListener(Yo, vl, !0),
          document.addEventListener(Ko, ts, !0),
          document.addEventListener(Xo, ts, !0),
          (Qo = !0));
      }
      function ti(t, i) {
        if (i.pointerType !== (i.MSPOINTER_TYPE_MOUSE || "mouse")) {
          i.touches = [];
          for (var o in $e) i.touches.push($e[o]);
          (i.changedTouches = [i]), t(i);
        }
      }
      function wl(t, i) {
        i.MSPOINTER_TYPE_TOUCH &&
          i.pointerType === i.MSPOINTER_TYPE_TOUCH &&
          zt(i),
          ti(t, i);
      }
      function bl(t) {
        var i = {},
          o,
          u;
        for (u in t) (o = t[u]), (i[u] = o && o.bind ? o.bind(t) : o);
        return (
          (t = i),
          (i.type = "dblclick"),
          (i.detail = 2),
          (i.isTrusted = !1),
          (i._simulated = !0),
          i
        );
      }
      var Sl = 200;
      function Pl(t, i) {
        t.addEventListener("dblclick", i);
        var o = 0,
          u;
        function c(d) {
          if (d.detail !== 1) {
            u = d.detail;
            return;
          }
          if (
            !(
              d.pointerType === "mouse" ||
              (d.sourceCapabilities && !d.sourceCapabilities.firesTouchEvents)
            )
          ) {
            var g = os(d);
            if (
              !(
                g.some(function (x) {
                  return x instanceof HTMLLabelElement && x.attributes.for;
                }) &&
                !g.some(function (x) {
                  return (
                    x instanceof HTMLInputElement ||
                    x instanceof HTMLSelectElement
                  );
                })
              )
            ) {
              var y = Date.now();
              y - o <= Sl ? (u++, u === 2 && i(bl(d))) : (u = 1), (o = y);
            }
          }
        }
        return t.addEventListener("click", c), { dblclick: i, simDblclick: c };
      }
      function xl(t, i) {
        t.removeEventListener("dblclick", i.dblclick),
          t.removeEventListener("click", i.simDblclick);
      }
      var er = ii([
          "transform",
          "webkitTransform",
          "OTransform",
          "MozTransform",
          "msTransform",
        ]),
        Tn = ii([
          "webkitTransition",
          "transition",
          "OTransition",
          "MozTransition",
          "msTransition",
        ]),
        es =
          Tn === "webkitTransition" || Tn === "OTransition"
            ? Tn + "End"
            : "transitionend";
      function ns(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function En(t, i) {
        var o = t.style[i] || (t.currentStyle && t.currentStyle[i]);
        if ((!o || o === "auto") && document.defaultView) {
          var u = document.defaultView.getComputedStyle(t, null);
          o = u ? u[i] : null;
        }
        return o === "auto" ? null : o;
      }
      function lt(t, i, o) {
        var u = document.createElement(t);
        return (u.className = i || ""), o && o.appendChild(u), u;
      }
      function gt(t) {
        var i = t.parentNode;
        i && i.removeChild(t);
      }
      function ei(t) {
        for (; t.firstChild; ) t.removeChild(t.firstChild);
      }
      function Ye(t) {
        var i = t.parentNode;
        i && i.lastChild !== t && i.appendChild(t);
      }
      function Ke(t) {
        var i = t.parentNode;
        i && i.firstChild !== t && i.insertBefore(t, i.firstChild);
      }
      function nr(t, i) {
        if (t.classList !== void 0) return t.classList.contains(i);
        var o = ni(t);
        return o.length > 0 && new RegExp("(^|\\s)" + i + "(\\s|$)").test(o);
      }
      function et(t, i) {
        if (t.classList !== void 0)
          for (var o = P(i), u = 0, c = o.length; u < c; u++)
            t.classList.add(o[u]);
        else if (!nr(t, i)) {
          var d = ni(t);
          ir(t, (d ? d + " " : "") + i);
        }
      }
      function St(t, i) {
        t.classList !== void 0
          ? t.classList.remove(i)
          : ir(t, S((" " + ni(t) + " ").replace(" " + i + " ", " ")));
      }
      function ir(t, i) {
        t.className.baseVal === void 0
          ? (t.className = i)
          : (t.className.baseVal = i);
      }
      function ni(t) {
        return (
          t.correspondingElement && (t = t.correspondingElement),
          t.className.baseVal === void 0 ? t.className : t.className.baseVal
        );
      }
      function qt(t, i) {
        "opacity" in t.style
          ? (t.style.opacity = i)
          : "filter" in t.style && Ll(t, i);
      }
      function Ll(t, i) {
        var o = !1,
          u = "DXImageTransform.Microsoft.Alpha";
        try {
          o = t.filters.item(u);
        } catch {
          if (i === 1) return;
        }
        (i = Math.round(i * 100)),
          o
            ? ((o.Enabled = i !== 100), (o.Opacity = i))
            : (t.style.filter += " progid:" + u + "(opacity=" + i + ")");
      }
      function ii(t) {
        for (var i = document.documentElement.style, o = 0; o < t.length; o++)
          if (t[o] in i) return t[o];
        return !1;
      }
      function Oe(t, i, o) {
        var u = i || new j(0, 0);
        t.style[er] =
          (G.ie3d
            ? "translate(" + u.x + "px," + u.y + "px)"
            : "translate3d(" + u.x + "px," + u.y + "px,0)") +
          (o ? " scale(" + o + ")" : "");
      }
      function Tt(t, i) {
        (t._leaflet_pos = i),
          G.any3d
            ? Oe(t, i)
            : ((t.style.left = i.x + "px"), (t.style.top = i.y + "px"));
      }
      function Me(t) {
        return t._leaflet_pos || new j(0, 0);
      }
      var kn, Cn, rr;
      if ("onselectstart" in document)
        (kn = function () {
          Q(window, "selectstart", zt);
        }),
          (Cn = function () {
            dt(window, "selectstart", zt);
          });
      else {
        var On = ii([
          "userSelect",
          "WebkitUserSelect",
          "OUserSelect",
          "MozUserSelect",
          "msUserSelect",
        ]);
        (kn = function () {
          if (On) {
            var t = document.documentElement.style;
            (rr = t[On]), (t[On] = "none");
          }
        }),
          (Cn = function () {
            On && ((document.documentElement.style[On] = rr), (rr = void 0));
          });
      }
      function or() {
        Q(window, "dragstart", zt);
      }
      function sr() {
        dt(window, "dragstart", zt);
      }
      var ri, ar;
      function ur(t) {
        for (; t.tabIndex === -1; ) t = t.parentNode;
        t.style &&
          (oi(),
          (ri = t),
          (ar = t.style.outlineStyle),
          (t.style.outlineStyle = "none"),
          Q(window, "keydown", oi));
      }
      function oi() {
        ri &&
          ((ri.style.outlineStyle = ar),
          (ri = void 0),
          (ar = void 0),
          dt(window, "keydown", oi));
      }
      function is(t) {
        do t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function lr(t) {
        var i = t.getBoundingClientRect();
        return {
          x: i.width / t.offsetWidth || 1,
          y: i.height / t.offsetHeight || 1,
          boundingClientRect: i,
        };
      }
      var Tl = {
        __proto__: null,
        TRANSFORM: er,
        TRANSITION: Tn,
        TRANSITION_END: es,
        get: ns,
        getStyle: En,
        create: lt,
        remove: gt,
        empty: ei,
        toFront: Ye,
        toBack: Ke,
        hasClass: nr,
        addClass: et,
        removeClass: St,
        setClass: ir,
        getClass: ni,
        setOpacity: qt,
        testProp: ii,
        setTransform: Oe,
        setPosition: Tt,
        getPosition: Me,
        get disableTextSelection() {
          return kn;
        },
        get enableTextSelection() {
          return Cn;
        },
        disableImageDrag: or,
        enableImageDrag: sr,
        preventOutline: ur,
        restoreOutline: oi,
        getSizedParentNode: is,
        getScale: lr,
      };
      function Q(t, i, o, u) {
        if (i && typeof i == "object") for (var c in i) hr(t, c, i[c], o);
        else {
          i = P(i);
          for (var d = 0, g = i.length; d < g; d++) hr(t, i[d], o, u);
        }
        return this;
      }
      var ie = "_leaflet_events";
      function dt(t, i, o, u) {
        if (arguments.length === 1) rs(t), delete t[ie];
        else if (i && typeof i == "object") for (var c in i) fr(t, c, i[c], o);
        else if (((i = P(i)), arguments.length === 2))
          rs(t, function (y) {
            return F(i, y) !== -1;
          });
        else for (var d = 0, g = i.length; d < g; d++) fr(t, i[d], o, u);
        return this;
      }
      function rs(t, i) {
        for (var o in t[ie]) {
          var u = o.split(/\d/)[0];
          (!i || i(u)) && fr(t, u, null, null, o);
        }
      }
      var cr = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel",
      };
      function hr(t, i, o, u) {
        var c = i + p(o) + (u ? "_" + p(u) : "");
        if (t[ie] && t[ie][c]) return this;
        var d = function (y) {
            return o.call(u || t, y || window.event);
          },
          g = d;
        !G.touchNative && G.pointer && i.indexOf("touch") === 0
          ? (d = _l(t, i, d))
          : G.touch && i === "dblclick"
            ? (d = Pl(t, d))
            : "addEventListener" in t
              ? i === "touchstart" ||
                i === "touchmove" ||
                i === "wheel" ||
                i === "mousewheel"
                ? t.addEventListener(
                    cr[i] || i,
                    d,
                    G.passiveEvents ? { passive: !1 } : !1,
                  )
                : i === "mouseenter" || i === "mouseleave"
                  ? ((d = function (y) {
                      (y = y || window.event), pr(t, y) && g(y);
                    }),
                    t.addEventListener(cr[i], d, !1))
                  : t.addEventListener(i, g, !1)
              : t.attachEvent("on" + i, d),
          (t[ie] = t[ie] || {}),
          (t[ie][c] = d);
      }
      function fr(t, i, o, u, c) {
        c = c || i + p(o) + (u ? "_" + p(u) : "");
        var d = t[ie] && t[ie][c];
        if (!d) return this;
        !G.touchNative && G.pointer && i.indexOf("touch") === 0
          ? ml(t, i, d)
          : G.touch && i === "dblclick"
            ? xl(t, d)
            : "removeEventListener" in t
              ? t.removeEventListener(cr[i] || i, d, !1)
              : t.detachEvent("on" + i, d),
          (t[ie][c] = null);
      }
      function Ie(t) {
        return (
          t.stopPropagation
            ? t.stopPropagation()
            : t.originalEvent
              ? (t.originalEvent._stopped = !0)
              : (t.cancelBubble = !0),
          this
        );
      }
      function dr(t) {
        return hr(t, "wheel", Ie), this;
      }
      function Mn(t) {
        return (
          Q(t, "mousedown touchstart dblclick contextmenu", Ie),
          (t._leaflet_disable_click = !0),
          this
        );
      }
      function zt(t) {
        return (
          t.preventDefault ? t.preventDefault() : (t.returnValue = !1), this
        );
      }
      function ze(t) {
        return zt(t), Ie(t), this;
      }
      function os(t) {
        if (t.composedPath) return t.composedPath();
        for (var i = [], o = t.target; o; ) i.push(o), (o = o.parentNode);
        return i;
      }
      function ss(t, i) {
        if (!i) return new j(t.clientX, t.clientY);
        var o = lr(i),
          u = o.boundingClientRect;
        return new j(
          (t.clientX - u.left) / o.x - i.clientLeft,
          (t.clientY - u.top) / o.y - i.clientTop,
        );
      }
      var El =
        G.linux && G.chrome
          ? window.devicePixelRatio
          : G.mac
            ? window.devicePixelRatio * 3
            : window.devicePixelRatio > 0
              ? 2 * window.devicePixelRatio
              : 1;
      function as(t) {
        return G.edge
          ? t.wheelDeltaY / 2
          : t.deltaY && t.deltaMode === 0
            ? -t.deltaY / El
            : t.deltaY && t.deltaMode === 1
              ? -t.deltaY * 20
              : t.deltaY && t.deltaMode === 2
                ? -t.deltaY * 60
                : t.deltaX || t.deltaZ
                  ? 0
                  : t.wheelDelta
                    ? (t.wheelDeltaY || t.wheelDelta) / 2
                    : t.detail && Math.abs(t.detail) < 32765
                      ? -t.detail * 20
                      : t.detail
                        ? (t.detail / -32765) * 60
                        : 0;
      }
      function pr(t, i) {
        var o = i.relatedTarget;
        if (!o) return !0;
        try {
          for (; o && o !== t; ) o = o.parentNode;
        } catch {
          return !1;
        }
        return o !== t;
      }
      var kl = {
          __proto__: null,
          on: Q,
          off: dt,
          stopPropagation: Ie,
          disableScrollPropagation: dr,
          disableClickPropagation: Mn,
          preventDefault: zt,
          stop: ze,
          getPropagationPath: os,
          getMousePosition: ss,
          getWheelDelta: as,
          isExternalTarget: pr,
          addListener: Q,
          removeListener: dt,
        },
        us = Ht.extend({
          run: function (t, i, o, u) {
            this.stop(),
              (this._el = t),
              (this._inProgress = !0),
              (this._duration = o || 0.25),
              (this._easeOutPower = 1 / Math.max(u || 0.5, 0.2)),
              (this._startPos = Me(t)),
              (this._offset = i.subtract(this._startPos)),
              (this._startTime = +new Date()),
              this.fire("start"),
              this._animate();
          },
          stop: function () {
            this._inProgress && (this._step(!0), this._complete());
          },
          _animate: function () {
            (this._animId = tt(this._animate, this)), this._step();
          },
          _step: function (t) {
            var i = +new Date() - this._startTime,
              o = this._duration * 1e3;
            i < o
              ? this._runFrame(this._easeOut(i / o), t)
              : (this._runFrame(1), this._complete());
          },
          _runFrame: function (t, i) {
            var o = this._startPos.add(this._offset.multiplyBy(t));
            i && o._round(), Tt(this._el, o), this.fire("step");
          },
          _complete: function () {
            J(this._animId), (this._inProgress = !1), this.fire("end");
          },
          _easeOut: function (t) {
            return 1 - Math.pow(1 - t, this._easeOutPower);
          },
        }),
        at = Ht.extend({
          options: {
            crs: $i,
            center: void 0,
            zoom: void 0,
            minZoom: void 0,
            maxZoom: void 0,
            layers: [],
            maxBounds: void 0,
            renderer: void 0,
            zoomAnimation: !0,
            zoomAnimationThreshold: 4,
            fadeAnimation: !0,
            markerZoomAnimation: !0,
            transform3DLimit: 8388608,
            zoomSnap: 1,
            zoomDelta: 1,
            trackResize: !0,
          },
          initialize: function (t, i) {
            (i = O(this, i)),
              (this._handlers = []),
              (this._layers = {}),
              (this._zoomBoundLayers = {}),
              (this._sizeChanged = !0),
              this._initContainer(t),
              this._initLayout(),
              (this._onResize = h(this._onResize, this)),
              this._initEvents(),
              i.maxBounds && this.setMaxBounds(i.maxBounds),
              i.zoom !== void 0 && (this._zoom = this._limitZoom(i.zoom)),
              i.center &&
                i.zoom !== void 0 &&
                this.setView(nt(i.center), i.zoom, { reset: !0 }),
              this.callInitHooks(),
              (this._zoomAnimated =
                Tn && G.any3d && !G.mobileOpera && this.options.zoomAnimation),
              this._zoomAnimated &&
                (this._createAnimProxy(),
                Q(this._proxy, es, this._catchTransitionEnd, this)),
              this._addLayers(this.options.layers);
          },
          setView: function (t, i, o) {
            if (
              ((i = i === void 0 ? this._zoom : this._limitZoom(i)),
              (t = this._limitCenter(nt(t), i, this.options.maxBounds)),
              (o = o || {}),
              this._stop(),
              this._loaded && !o.reset && o !== !0)
            ) {
              o.animate !== void 0 &&
                ((o.zoom = a({ animate: o.animate }, o.zoom)),
                (o.pan = a(
                  { animate: o.animate, duration: o.duration },
                  o.pan,
                )));
              var u =
                this._zoom !== i
                  ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, i, o.zoom)
                  : this._tryAnimatedPan(t, o.pan);
              if (u) return clearTimeout(this._sizeTimer), this;
            }
            return this._resetView(t, i, o.pan && o.pan.noMoveStart), this;
          },
          setZoom: function (t, i) {
            return this._loaded
              ? this.setView(this.getCenter(), t, { zoom: i })
              : ((this._zoom = t), this);
          },
          zoomIn: function (t, i) {
            return (
              (t = t || (G.any3d ? this.options.zoomDelta : 1)),
              this.setZoom(this._zoom + t, i)
            );
          },
          zoomOut: function (t, i) {
            return (
              (t = t || (G.any3d ? this.options.zoomDelta : 1)),
              this.setZoom(this._zoom - t, i)
            );
          },
          setZoomAround: function (t, i, o) {
            var u = this.getZoomScale(i),
              c = this.getSize().divideBy(2),
              d = t instanceof j ? t : this.latLngToContainerPoint(t),
              g = d.subtract(c).multiplyBy(1 - 1 / u),
              y = this.containerPointToLatLng(c.add(g));
            return this.setView(y, i, { zoom: o });
          },
          _getBoundsCenterZoom: function (t, i) {
            (i = i || {}), (t = t.getBounds ? t.getBounds() : E(t));
            var o = W(i.paddingTopLeft || i.padding || [0, 0]),
              u = W(i.paddingBottomRight || i.padding || [0, 0]),
              c = this.getBoundsZoom(t, !1, o.add(u));
            if (
              ((c = typeof i.maxZoom == "number" ? Math.min(i.maxZoom, c) : c),
              c === 1 / 0)
            )
              return { center: t.getCenter(), zoom: c };
            var d = u.subtract(o).divideBy(2),
              g = this.project(t.getSouthWest(), c),
              y = this.project(t.getNorthEast(), c),
              x = this.unproject(g.add(y).divideBy(2).add(d), c);
            return { center: x, zoom: c };
          },
          fitBounds: function (t, i) {
            if (((t = E(t)), !t.isValid()))
              throw new Error("Bounds are not valid.");
            var o = this._getBoundsCenterZoom(t, i);
            return this.setView(o.center, o.zoom, i);
          },
          fitWorld: function (t) {
            return this.fitBounds(
              [
                [-90, -180],
                [90, 180],
              ],
              t,
            );
          },
          panTo: function (t, i) {
            return this.setView(t, this._zoom, { pan: i });
          },
          panBy: function (t, i) {
            if (((t = W(t).round()), (i = i || {}), !t.x && !t.y))
              return this.fire("moveend");
            if (i.animate !== !0 && !this.getSize().contains(t))
              return (
                this._resetView(
                  this.unproject(this.project(this.getCenter()).add(t)),
                  this.getZoom(),
                ),
                this
              );
            if (
              (this._panAnim ||
                ((this._panAnim = new us()),
                this._panAnim.on(
                  {
                    step: this._onPanTransitionStep,
                    end: this._onPanTransitionEnd,
                  },
                  this,
                )),
              i.noMoveStart || this.fire("movestart"),
              i.animate !== !1)
            ) {
              et(this._mapPane, "leaflet-pan-anim");
              var o = this._getMapPanePos().subtract(t).round();
              this._panAnim.run(
                this._mapPane,
                o,
                i.duration || 0.25,
                i.easeLinearity,
              );
            } else this._rawPanBy(t), this.fire("move").fire("moveend");
            return this;
          },
          flyTo: function (t, i, o) {
            if (((o = o || {}), o.animate === !1 || !G.any3d))
              return this.setView(t, i, o);
            this._stop();
            var u = this.project(this.getCenter()),
              c = this.project(t),
              d = this.getSize(),
              g = this._zoom;
            (t = nt(t)), (i = i === void 0 ? g : i);
            var y = Math.max(d.x, d.y),
              x = y * this.getZoomScale(g, i),
              R = c.distanceTo(u) || 1,
              H = 1.42,
              Y = H * H;
            function ot(Et) {
              var gi = Et ? -1 : 1,
                mc = Et ? x : y,
                gc = x * x - y * y + gi * Y * Y * R * R,
                vc = 2 * mc * Y * R,
                Lr = gc / vc,
                Us = Math.sqrt(Lr * Lr + 1) - Lr,
                yc = Us < 1e-9 ? -18 : Math.log(Us);
              return yc;
            }
            function Nt(Et) {
              return (Math.exp(Et) - Math.exp(-Et)) / 2;
            }
            function It(Et) {
              return (Math.exp(Et) + Math.exp(-Et)) / 2;
            }
            function Vt(Et) {
              return Nt(Et) / It(Et);
            }
            var Ut = ot(0);
            function nn(Et) {
              return y * (It(Ut) / It(Ut + H * Et));
            }
            function fc(Et) {
              return (y * (It(Ut) * Vt(Ut + H * Et) - Nt(Ut))) / Y;
            }
            function dc(Et) {
              return 1 - Math.pow(1 - Et, 1.5);
            }
            var pc = Date.now(),
              Fs = (ot(1) - Ut) / H,
              _c = o.duration ? 1e3 * o.duration : 1e3 * Fs * 0.8;
            function Hs() {
              var Et = (Date.now() - pc) / _c,
                gi = dc(Et) * Fs;
              Et <= 1
                ? ((this._flyToFrame = tt(Hs, this)),
                  this._move(
                    this.unproject(
                      u.add(c.subtract(u).multiplyBy(fc(gi) / R)),
                      g,
                    ),
                    this.getScaleZoom(y / nn(gi), g),
                    { flyTo: !0 },
                  ))
                : this._move(t, i)._moveEnd(!0);
            }
            return this._moveStart(!0, o.noMoveStart), Hs.call(this), this;
          },
          flyToBounds: function (t, i) {
            var o = this._getBoundsCenterZoom(t, i);
            return this.flyTo(o.center, o.zoom, i);
          },
          setMaxBounds: function (t) {
            return (
              (t = E(t)),
              this.listens("moveend", this._panInsideMaxBounds) &&
                this.off("moveend", this._panInsideMaxBounds),
              t.isValid()
                ? ((this.options.maxBounds = t),
                  this._loaded && this._panInsideMaxBounds(),
                  this.on("moveend", this._panInsideMaxBounds))
                : ((this.options.maxBounds = null), this)
            );
          },
          setMinZoom: function (t) {
            var i = this.options.minZoom;
            return (
              (this.options.minZoom = t),
              this._loaded &&
              i !== t &&
              (this.fire("zoomlevelschange"),
              this.getZoom() < this.options.minZoom)
                ? this.setZoom(t)
                : this
            );
          },
          setMaxZoom: function (t) {
            var i = this.options.maxZoom;
            return (
              (this.options.maxZoom = t),
              this._loaded &&
              i !== t &&
              (this.fire("zoomlevelschange"),
              this.getZoom() > this.options.maxZoom)
                ? this.setZoom(t)
                : this
            );
          },
          panInsideBounds: function (t, i) {
            this._enforcingBounds = !0;
            var o = this.getCenter(),
              u = this._limitCenter(o, this._zoom, E(t));
            return (
              o.equals(u) || this.panTo(u, i),
              (this._enforcingBounds = !1),
              this
            );
          },
          panInside: function (t, i) {
            i = i || {};
            var o = W(i.paddingTopLeft || i.padding || [0, 0]),
              u = W(i.paddingBottomRight || i.padding || [0, 0]),
              c = this.project(this.getCenter()),
              d = this.project(t),
              g = this.getPixelBounds(),
              y = A([g.min.add(o), g.max.subtract(u)]),
              x = y.getSize();
            if (!y.contains(d)) {
              this._enforcingBounds = !0;
              var R = d.subtract(y.getCenter()),
                H = y.extend(d).getSize().subtract(x);
              (c.x += R.x < 0 ? -H.x : H.x),
                (c.y += R.y < 0 ? -H.y : H.y),
                this.panTo(this.unproject(c), i),
                (this._enforcingBounds = !1);
            }
            return this;
          },
          invalidateSize: function (t) {
            if (!this._loaded) return this;
            t = a({ animate: !1, pan: !0 }, t === !0 ? { animate: !0 } : t);
            var i = this.getSize();
            (this._sizeChanged = !0), (this._lastCenter = null);
            var o = this.getSize(),
              u = i.divideBy(2).round(),
              c = o.divideBy(2).round(),
              d = u.subtract(c);
            return !d.x && !d.y
              ? this
              : (t.animate && t.pan
                  ? this.panBy(d)
                  : (t.pan && this._rawPanBy(d),
                    this.fire("move"),
                    t.debounceMoveend
                      ? (clearTimeout(this._sizeTimer),
                        (this._sizeTimer = setTimeout(
                          h(this.fire, this, "moveend"),
                          200,
                        )))
                      : this.fire("moveend")),
                this.fire("resize", { oldSize: i, newSize: o }));
          },
          stop: function () {
            return (
              this.setZoom(this._limitZoom(this._zoom)),
              this.options.zoomSnap || this.fire("viewreset"),
              this._stop()
            );
          },
          locate: function (t) {
            if (
              ((t = this._locateOptions = a({ timeout: 1e4, watch: !1 }, t)),
              !("geolocation" in navigator))
            )
              return (
                this._handleGeolocationError({
                  code: 0,
                  message: "Geolocation not supported.",
                }),
                this
              );
            var i = h(this._handleGeolocationResponse, this),
              o = h(this._handleGeolocationError, this);
            return (
              t.watch
                ? (this._locationWatchId = navigator.geolocation.watchPosition(
                    i,
                    o,
                    t,
                  ))
                : navigator.geolocation.getCurrentPosition(i, o, t),
              this
            );
          },
          stopLocate: function () {
            return (
              navigator.geolocation &&
                navigator.geolocation.clearWatch &&
                navigator.geolocation.clearWatch(this._locationWatchId),
              this._locateOptions && (this._locateOptions.setView = !1),
              this
            );
          },
          _handleGeolocationError: function (t) {
            if (this._container._leaflet_id) {
              var i = t.code,
                o =
                  t.message ||
                  (i === 1
                    ? "permission denied"
                    : i === 2
                      ? "position unavailable"
                      : "timeout");
              this._locateOptions.setView && !this._loaded && this.fitWorld(),
                this.fire("locationerror", {
                  code: i,
                  message: "Geolocation error: " + o + ".",
                });
            }
          },
          _handleGeolocationResponse: function (t) {
            if (this._container._leaflet_id) {
              var i = t.coords.latitude,
                o = t.coords.longitude,
                u = new q(i, o),
                c = u.toBounds(t.coords.accuracy * 2),
                d = this._locateOptions;
              if (d.setView) {
                var g = this.getBoundsZoom(c);
                this.setView(u, d.maxZoom ? Math.min(g, d.maxZoom) : g);
              }
              var y = { latlng: u, bounds: c, timestamp: t.timestamp };
              for (var x in t.coords)
                typeof t.coords[x] == "number" && (y[x] = t.coords[x]);
              this.fire("locationfound", y);
            }
          },
          addHandler: function (t, i) {
            if (!i) return this;
            var o = (this[t] = new i(this));
            return this._handlers.push(o), this.options[t] && o.enable(), this;
          },
          remove: function () {
            if (
              (this._initEvents(!0),
              this.options.maxBounds &&
                this.off("moveend", this._panInsideMaxBounds),
              this._containerId !== this._container._leaflet_id)
            )
              throw new Error(
                "Map container is being reused by another instance",
              );
            try {
              delete this._container._leaflet_id, delete this._containerId;
            } catch {
              (this._container._leaflet_id = void 0),
                (this._containerId = void 0);
            }
            this._locationWatchId !== void 0 && this.stopLocate(),
              this._stop(),
              gt(this._mapPane),
              this._clearControlPos && this._clearControlPos(),
              this._resizeRequest &&
                (J(this._resizeRequest), (this._resizeRequest = null)),
              this._clearHandlers(),
              this._loaded && this.fire("unload");
            var t;
            for (t in this._layers) this._layers[t].remove();
            for (t in this._panes) gt(this._panes[t]);
            return (
              (this._layers = []),
              (this._panes = []),
              delete this._mapPane,
              delete this._renderer,
              this
            );
          },
          createPane: function (t, i) {
            var o =
                "leaflet-pane" +
                (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""),
              u = lt("div", o, i || this._mapPane);
            return t && (this._panes[t] = u), u;
          },
          getCenter: function () {
            return (
              this._checkIfLoaded(),
              this._lastCenter && !this._moved()
                ? this._lastCenter.clone()
                : this.layerPointToLatLng(this._getCenterLayerPoint())
            );
          },
          getZoom: function () {
            return this._zoom;
          },
          getBounds: function () {
            var t = this.getPixelBounds(),
              i = this.unproject(t.getBottomLeft()),
              o = this.unproject(t.getTopRight());
            return new X(i, o);
          },
          getMinZoom: function () {
            return this.options.minZoom === void 0
              ? this._layersMinZoom || 0
              : this.options.minZoom;
          },
          getMaxZoom: function () {
            return this.options.maxZoom === void 0
              ? this._layersMaxZoom === void 0
                ? 1 / 0
                : this._layersMaxZoom
              : this.options.maxZoom;
          },
          getBoundsZoom: function (t, i, o) {
            (t = E(t)), (o = W(o || [0, 0]));
            var u = this.getZoom() || 0,
              c = this.getMinZoom(),
              d = this.getMaxZoom(),
              g = t.getNorthWest(),
              y = t.getSouthEast(),
              x = this.getSize().subtract(o),
              R = A(this.project(y, u), this.project(g, u)).getSize(),
              H = G.any3d ? this.options.zoomSnap : 1,
              Y = x.x / R.x,
              ot = x.y / R.y,
              Nt = i ? Math.max(Y, ot) : Math.min(Y, ot);
            return (
              (u = this.getScaleZoom(Nt, u)),
              H &&
                ((u = Math.round(u / (H / 100)) * (H / 100)),
                (u = i ? Math.ceil(u / H) * H : Math.floor(u / H) * H)),
              Math.max(c, Math.min(d, u))
            );
          },
          getSize: function () {
            return (
              (!this._size || this._sizeChanged) &&
                ((this._size = new j(
                  this._container.clientWidth || 0,
                  this._container.clientHeight || 0,
                )),
                (this._sizeChanged = !1)),
              this._size.clone()
            );
          },
          getPixelBounds: function (t, i) {
            var o = this._getTopLeftPoint(t, i);
            return new ct(o, o.add(this.getSize()));
          },
          getPixelOrigin: function () {
            return this._checkIfLoaded(), this._pixelOrigin;
          },
          getPixelWorldBounds: function (t) {
            return this.options.crs.getProjectedBounds(
              t === void 0 ? this.getZoom() : t,
            );
          },
          getPane: function (t) {
            return typeof t == "string" ? this._panes[t] : t;
          },
          getPanes: function () {
            return this._panes;
          },
          getContainer: function () {
            return this._container;
          },
          getZoomScale: function (t, i) {
            var o = this.options.crs;
            return (i = i === void 0 ? this._zoom : i), o.scale(t) / o.scale(i);
          },
          getScaleZoom: function (t, i) {
            var o = this.options.crs;
            i = i === void 0 ? this._zoom : i;
            var u = o.zoom(t * o.scale(i));
            return isNaN(u) ? 1 / 0 : u;
          },
          project: function (t, i) {
            return (
              (i = i === void 0 ? this._zoom : i),
              this.options.crs.latLngToPoint(nt(t), i)
            );
          },
          unproject: function (t, i) {
            return (
              (i = i === void 0 ? this._zoom : i),
              this.options.crs.pointToLatLng(W(t), i)
            );
          },
          layerPointToLatLng: function (t) {
            var i = W(t).add(this.getPixelOrigin());
            return this.unproject(i);
          },
          latLngToLayerPoint: function (t) {
            var i = this.project(nt(t))._round();
            return i._subtract(this.getPixelOrigin());
          },
          wrapLatLng: function (t) {
            return this.options.crs.wrapLatLng(nt(t));
          },
          wrapLatLngBounds: function (t) {
            return this.options.crs.wrapLatLngBounds(E(t));
          },
          distance: function (t, i) {
            return this.options.crs.distance(nt(t), nt(i));
          },
          containerPointToLayerPoint: function (t) {
            return W(t).subtract(this._getMapPanePos());
          },
          layerPointToContainerPoint: function (t) {
            return W(t).add(this._getMapPanePos());
          },
          containerPointToLatLng: function (t) {
            var i = this.containerPointToLayerPoint(W(t));
            return this.layerPointToLatLng(i);
          },
          latLngToContainerPoint: function (t) {
            return this.layerPointToContainerPoint(
              this.latLngToLayerPoint(nt(t)),
            );
          },
          mouseEventToContainerPoint: function (t) {
            return ss(t, this._container);
          },
          mouseEventToLayerPoint: function (t) {
            return this.containerPointToLayerPoint(
              this.mouseEventToContainerPoint(t),
            );
          },
          mouseEventToLatLng: function (t) {
            return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
          },
          _initContainer: function (t) {
            var i = (this._container = ns(t));
            if (i) {
              if (i._leaflet_id)
                throw new Error("Map container is already initialized.");
            } else throw new Error("Map container not found.");
            Q(i, "scroll", this._onScroll, this), (this._containerId = p(i));
          },
          _initLayout: function () {
            var t = this._container;
            (this._fadeAnimated = this.options.fadeAnimation && G.any3d),
              et(
                t,
                "leaflet-container" +
                  (G.touch ? " leaflet-touch" : "") +
                  (G.retina ? " leaflet-retina" : "") +
                  (G.ielt9 ? " leaflet-oldie" : "") +
                  (G.safari ? " leaflet-safari" : "") +
                  (this._fadeAnimated ? " leaflet-fade-anim" : ""),
              );
            var i = En(t, "position");
            i !== "absolute" &&
              i !== "relative" &&
              i !== "fixed" &&
              i !== "sticky" &&
              (t.style.position = "relative"),
              this._initPanes(),
              this._initControlPos && this._initControlPos();
          },
          _initPanes: function () {
            var t = (this._panes = {});
            (this._paneRenderers = {}),
              (this._mapPane = this.createPane("mapPane", this._container)),
              Tt(this._mapPane, new j(0, 0)),
              this.createPane("tilePane"),
              this.createPane("overlayPane"),
              this.createPane("shadowPane"),
              this.createPane("markerPane"),
              this.createPane("tooltipPane"),
              this.createPane("popupPane"),
              this.options.markerZoomAnimation ||
                (et(t.markerPane, "leaflet-zoom-hide"),
                et(t.shadowPane, "leaflet-zoom-hide"));
          },
          _resetView: function (t, i, o) {
            Tt(this._mapPane, new j(0, 0));
            var u = !this._loaded;
            (this._loaded = !0),
              (i = this._limitZoom(i)),
              this.fire("viewprereset");
            var c = this._zoom !== i;
            this._moveStart(c, o)._move(t, i)._moveEnd(c),
              this.fire("viewreset"),
              u && this.fire("load");
          },
          _moveStart: function (t, i) {
            return (
              t && this.fire("zoomstart"), i || this.fire("movestart"), this
            );
          },
          _move: function (t, i, o, u) {
            i === void 0 && (i = this._zoom);
            var c = this._zoom !== i;
            return (
              (this._zoom = i),
              (this._lastCenter = t),
              (this._pixelOrigin = this._getNewPixelOrigin(t)),
              u
                ? o && o.pinch && this.fire("zoom", o)
                : ((c || (o && o.pinch)) && this.fire("zoom", o),
                  this.fire("move", o)),
              this
            );
          },
          _moveEnd: function (t) {
            return t && this.fire("zoomend"), this.fire("moveend");
          },
          _stop: function () {
            return (
              J(this._flyToFrame), this._panAnim && this._panAnim.stop(), this
            );
          },
          _rawPanBy: function (t) {
            Tt(this._mapPane, this._getMapPanePos().subtract(t));
          },
          _getZoomSpan: function () {
            return this.getMaxZoom() - this.getMinZoom();
          },
          _panInsideMaxBounds: function () {
            this._enforcingBounds ||
              this.panInsideBounds(this.options.maxBounds);
          },
          _checkIfLoaded: function () {
            if (!this._loaded)
              throw new Error("Set map center and zoom first.");
          },
          _initEvents: function (t) {
            (this._targets = {}), (this._targets[p(this._container)] = this);
            var i = t ? dt : Q;
            i(
              this._container,
              "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",
              this._handleDOMEvent,
              this,
            ),
              this.options.trackResize &&
                i(window, "resize", this._onResize, this),
              G.any3d &&
                this.options.transform3DLimit &&
                (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
          },
          _onResize: function () {
            J(this._resizeRequest),
              (this._resizeRequest = tt(function () {
                this.invalidateSize({ debounceMoveend: !0 });
              }, this));
          },
          _onScroll: function () {
            (this._container.scrollTop = 0), (this._container.scrollLeft = 0);
          },
          _onMoveEnd: function () {
            var t = this._getMapPanePos();
            Math.max(Math.abs(t.x), Math.abs(t.y)) >=
              this.options.transform3DLimit &&
              this._resetView(this.getCenter(), this.getZoom());
          },
          _findEventTargets: function (t, i) {
            for (
              var o = [],
                u,
                c = i === "mouseout" || i === "mouseover",
                d = t.target || t.srcElement,
                g = !1;
              d;

            ) {
              if (
                ((u = this._targets[p(d)]),
                u &&
                  (i === "click" || i === "preclick") &&
                  this._draggableMoved(u))
              ) {
                g = !0;
                break;
              }
              if (
                (u &&
                  u.listens(i, !0) &&
                  ((c && !pr(d, t)) || (o.push(u), c))) ||
                d === this._container
              )
                break;
              d = d.parentNode;
            }
            return (
              !o.length && !g && !c && this.listens(i, !0) && (o = [this]), o
            );
          },
          _isClickDisabled: function (t) {
            for (; t && t !== this._container; ) {
              if (t._leaflet_disable_click) return !0;
              t = t.parentNode;
            }
          },
          _handleDOMEvent: function (t) {
            var i = t.target || t.srcElement;
            if (
              !(
                !this._loaded ||
                i._leaflet_disable_events ||
                (t.type === "click" && this._isClickDisabled(i))
              )
            ) {
              var o = t.type;
              o === "mousedown" && ur(i), this._fireDOMEvent(t, o);
            }
          },
          _mouseEvents: [
            "click",
            "dblclick",
            "mouseover",
            "mouseout",
            "contextmenu",
          ],
          _fireDOMEvent: function (t, i, o) {
            if (t.type === "click") {
              var u = a({}, t);
              (u.type = "preclick"), this._fireDOMEvent(u, u.type, o);
            }
            var c = this._findEventTargets(t, i);
            if (o) {
              for (var d = [], g = 0; g < o.length; g++)
                o[g].listens(i, !0) && d.push(o[g]);
              c = d.concat(c);
            }
            if (c.length) {
              i === "contextmenu" && zt(t);
              var y = c[0],
                x = { originalEvent: t };
              if (
                t.type !== "keypress" &&
                t.type !== "keydown" &&
                t.type !== "keyup"
              ) {
                var R = y.getLatLng && (!y._radius || y._radius <= 10);
                (x.containerPoint = R
                  ? this.latLngToContainerPoint(y.getLatLng())
                  : this.mouseEventToContainerPoint(t)),
                  (x.layerPoint = this.containerPointToLayerPoint(
                    x.containerPoint,
                  )),
                  (x.latlng = R
                    ? y.getLatLng()
                    : this.layerPointToLatLng(x.layerPoint));
              }
              for (g = 0; g < c.length; g++)
                if (
                  (c[g].fire(i, x, !0),
                  x.originalEvent._stopped ||
                    (c[g].options.bubblingMouseEvents === !1 &&
                      F(this._mouseEvents, i) !== -1))
                )
                  return;
            }
          },
          _draggableMoved: function (t) {
            return (
              (t = t.dragging && t.dragging.enabled() ? t : this),
              (t.dragging && t.dragging.moved()) ||
                (this.boxZoom && this.boxZoom.moved())
            );
          },
          _clearHandlers: function () {
            for (var t = 0, i = this._handlers.length; t < i; t++)
              this._handlers[t].disable();
          },
          whenReady: function (t, i) {
            return (
              this._loaded
                ? t.call(i || this, { target: this })
                : this.on("load", t, i),
              this
            );
          },
          _getMapPanePos: function () {
            return Me(this._mapPane) || new j(0, 0);
          },
          _moved: function () {
            var t = this._getMapPanePos();
            return t && !t.equals([0, 0]);
          },
          _getTopLeftPoint: function (t, i) {
            var o =
              t && i !== void 0
                ? this._getNewPixelOrigin(t, i)
                : this.getPixelOrigin();
            return o.subtract(this._getMapPanePos());
          },
          _getNewPixelOrigin: function (t, i) {
            var o = this.getSize()._divideBy(2);
            return this.project(t, i)
              ._subtract(o)
              ._add(this._getMapPanePos())
              ._round();
          },
          _latLngToNewLayerPoint: function (t, i, o) {
            var u = this._getNewPixelOrigin(o, i);
            return this.project(t, i)._subtract(u);
          },
          _latLngBoundsToNewLayerBounds: function (t, i, o) {
            var u = this._getNewPixelOrigin(o, i);
            return A([
              this.project(t.getSouthWest(), i)._subtract(u),
              this.project(t.getNorthWest(), i)._subtract(u),
              this.project(t.getSouthEast(), i)._subtract(u),
              this.project(t.getNorthEast(), i)._subtract(u),
            ]);
          },
          _getCenterLayerPoint: function () {
            return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
          },
          _getCenterOffset: function (t) {
            return this.latLngToLayerPoint(t).subtract(
              this._getCenterLayerPoint(),
            );
          },
          _limitCenter: function (t, i, o) {
            if (!o) return t;
            var u = this.project(t, i),
              c = this.getSize().divideBy(2),
              d = new ct(u.subtract(c), u.add(c)),
              g = this._getBoundsOffset(d, o, i);
            return Math.abs(g.x) <= 1 && Math.abs(g.y) <= 1
              ? t
              : this.unproject(u.add(g), i);
          },
          _limitOffset: function (t, i) {
            if (!i) return t;
            var o = this.getPixelBounds(),
              u = new ct(o.min.add(t), o.max.add(t));
            return t.add(this._getBoundsOffset(u, i));
          },
          _getBoundsOffset: function (t, i, o) {
            var u = A(
                this.project(i.getNorthEast(), o),
                this.project(i.getSouthWest(), o),
              ),
              c = u.min.subtract(t.min),
              d = u.max.subtract(t.max),
              g = this._rebound(c.x, -d.x),
              y = this._rebound(c.y, -d.y);
            return new j(g, y);
          },
          _rebound: function (t, i) {
            return t + i > 0
              ? Math.round(t - i) / 2
              : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(i));
          },
          _limitZoom: function (t) {
            var i = this.getMinZoom(),
              o = this.getMaxZoom(),
              u = G.any3d ? this.options.zoomSnap : 1;
            return (
              u && (t = Math.round(t / u) * u), Math.max(i, Math.min(o, t))
            );
          },
          _onPanTransitionStep: function () {
            this.fire("move");
          },
          _onPanTransitionEnd: function () {
            St(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
          },
          _tryAnimatedPan: function (t, i) {
            var o = this._getCenterOffset(t)._trunc();
            return (i && i.animate) !== !0 && !this.getSize().contains(o)
              ? !1
              : (this.panBy(o, i), !0);
          },
          _createAnimProxy: function () {
            var t = (this._proxy = lt(
              "div",
              "leaflet-proxy leaflet-zoom-animated",
            ));
            this._panes.mapPane.appendChild(t),
              this.on(
                "zoomanim",
                function (i) {
                  var o = er,
                    u = this._proxy.style[o];
                  Oe(
                    this._proxy,
                    this.project(i.center, i.zoom),
                    this.getZoomScale(i.zoom, 1),
                  ),
                    u === this._proxy.style[o] &&
                      this._animatingZoom &&
                      this._onZoomTransitionEnd();
                },
                this,
              ),
              this.on("load moveend", this._animMoveEnd, this),
              this._on("unload", this._destroyAnimProxy, this);
          },
          _destroyAnimProxy: function () {
            gt(this._proxy),
              this.off("load moveend", this._animMoveEnd, this),
              delete this._proxy;
          },
          _animMoveEnd: function () {
            var t = this.getCenter(),
              i = this.getZoom();
            Oe(this._proxy, this.project(t, i), this.getZoomScale(i, 1));
          },
          _catchTransitionEnd: function (t) {
            this._animatingZoom &&
              t.propertyName.indexOf("transform") >= 0 &&
              this._onZoomTransitionEnd();
          },
          _nothingToAnimate: function () {
            return !this._container.getElementsByClassName(
              "leaflet-zoom-animated",
            ).length;
          },
          _tryAnimatedZoom: function (t, i, o) {
            if (this._animatingZoom) return !0;
            if (
              ((o = o || {}),
              !this._zoomAnimated ||
                o.animate === !1 ||
                this._nothingToAnimate() ||
                Math.abs(i - this._zoom) > this.options.zoomAnimationThreshold)
            )
              return !1;
            var u = this.getZoomScale(i),
              c = this._getCenterOffset(t)._divideBy(1 - 1 / u);
            return o.animate !== !0 && !this.getSize().contains(c)
              ? !1
              : (tt(function () {
                  this._moveStart(!0, o.noMoveStart || !1)._animateZoom(
                    t,
                    i,
                    !0,
                  );
                }, this),
                !0);
          },
          _animateZoom: function (t, i, o, u) {
            this._mapPane &&
              (o &&
                ((this._animatingZoom = !0),
                (this._animateToCenter = t),
                (this._animateToZoom = i),
                et(this._mapPane, "leaflet-zoom-anim")),
              this.fire("zoomanim", { center: t, zoom: i, noUpdate: u }),
              this._tempFireZoomEvent ||
                (this._tempFireZoomEvent = this._zoom !== this._animateToZoom),
              this._move(
                this._animateToCenter,
                this._animateToZoom,
                void 0,
                !0,
              ),
              setTimeout(h(this._onZoomTransitionEnd, this), 250));
          },
          _onZoomTransitionEnd: function () {
            this._animatingZoom &&
              (this._mapPane && St(this._mapPane, "leaflet-zoom-anim"),
              (this._animatingZoom = !1),
              this._move(
                this._animateToCenter,
                this._animateToZoom,
                void 0,
                !0,
              ),
              this._tempFireZoomEvent && this.fire("zoom"),
              delete this._tempFireZoomEvent,
              this.fire("move"),
              this._moveEnd(!0));
          },
        });
      function Cl(t, i) {
        return new at(t, i);
      }
      var Kt = wt.extend({
          options: { position: "topright" },
          initialize: function (t) {
            O(this, t);
          },
          getPosition: function () {
            return this.options.position;
          },
          setPosition: function (t) {
            var i = this._map;
            return (
              i && i.removeControl(this),
              (this.options.position = t),
              i && i.addControl(this),
              this
            );
          },
          getContainer: function () {
            return this._container;
          },
          addTo: function (t) {
            this.remove(), (this._map = t);
            var i = (this._container = this.onAdd(t)),
              o = this.getPosition(),
              u = t._controlCorners[o];
            return (
              et(i, "leaflet-control"),
              o.indexOf("bottom") !== -1
                ? u.insertBefore(i, u.firstChild)
                : u.appendChild(i),
              this._map.on("unload", this.remove, this),
              this
            );
          },
          remove: function () {
            return this._map
              ? (gt(this._container),
                this.onRemove && this.onRemove(this._map),
                this._map.off("unload", this.remove, this),
                (this._map = null),
                this)
              : this;
          },
          _refocusOnMap: function (t) {
            this._map &&
              t &&
              t.screenX > 0 &&
              t.screenY > 0 &&
              this._map.getContainer().focus();
          },
        }),
        In = function (t) {
          return new Kt(t);
        };
      at.include({
        addControl: function (t) {
          return t.addTo(this), this;
        },
        removeControl: function (t) {
          return t.remove(), this;
        },
        _initControlPos: function () {
          var t = (this._controlCorners = {}),
            i = "leaflet-",
            o = (this._controlContainer = lt(
              "div",
              i + "control-container",
              this._container,
            ));
          function u(c, d) {
            var g = i + c + " " + i + d;
            t[c + d] = lt("div", g, o);
          }
          u("top", "left"),
            u("top", "right"),
            u("bottom", "left"),
            u("bottom", "right");
        },
        _clearControlPos: function () {
          for (var t in this._controlCorners) gt(this._controlCorners[t]);
          gt(this._controlContainer),
            delete this._controlCorners,
            delete this._controlContainer;
        },
      });
      var ls = Kt.extend({
          options: {
            collapsed: !0,
            position: "topright",
            autoZIndex: !0,
            hideSingleBase: !1,
            sortLayers: !1,
            sortFunction: function (t, i, o, u) {
              return o < u ? -1 : u < o ? 1 : 0;
            },
          },
          initialize: function (t, i, o) {
            O(this, o),
              (this._layerControlInputs = []),
              (this._layers = []),
              (this._lastZIndex = 0),
              (this._handlingClick = !1),
              (this._preventClick = !1);
            for (var u in t) this._addLayer(t[u], u);
            for (u in i) this._addLayer(i[u], u, !0);
          },
          onAdd: function (t) {
            this._initLayout(),
              this._update(),
              (this._map = t),
              t.on("zoomend", this._checkDisabledLayers, this);
            for (var i = 0; i < this._layers.length; i++)
              this._layers[i].layer.on("add remove", this._onLayerChange, this);
            return this._container;
          },
          addTo: function (t) {
            return (
              Kt.prototype.addTo.call(this, t), this._expandIfNotCollapsed()
            );
          },
          onRemove: function () {
            this._map.off("zoomend", this._checkDisabledLayers, this);
            for (var t = 0; t < this._layers.length; t++)
              this._layers[t].layer.off(
                "add remove",
                this._onLayerChange,
                this,
              );
          },
          addBaseLayer: function (t, i) {
            return this._addLayer(t, i), this._map ? this._update() : this;
          },
          addOverlay: function (t, i) {
            return this._addLayer(t, i, !0), this._map ? this._update() : this;
          },
          removeLayer: function (t) {
            t.off("add remove", this._onLayerChange, this);
            var i = this._getLayer(p(t));
            return (
              i && this._layers.splice(this._layers.indexOf(i), 1),
              this._map ? this._update() : this
            );
          },
          expand: function () {
            et(this._container, "leaflet-control-layers-expanded"),
              (this._section.style.height = null);
            var t = this._map.getSize().y - (this._container.offsetTop + 50);
            return (
              t < this._section.clientHeight
                ? (et(this._section, "leaflet-control-layers-scrollbar"),
                  (this._section.style.height = t + "px"))
                : St(this._section, "leaflet-control-layers-scrollbar"),
              this._checkDisabledLayers(),
              this
            );
          },
          collapse: function () {
            return St(this._container, "leaflet-control-layers-expanded"), this;
          },
          _initLayout: function () {
            var t = "leaflet-control-layers",
              i = (this._container = lt("div", t)),
              o = this.options.collapsed;
            i.setAttribute("aria-haspopup", !0), Mn(i), dr(i);
            var u = (this._section = lt("section", t + "-list"));
            o &&
              (this._map.on("click", this.collapse, this),
              Q(
                i,
                { mouseenter: this._expandSafely, mouseleave: this.collapse },
                this,
              ));
            var c = (this._layersLink = lt("a", t + "-toggle", i));
            (c.href = "#"),
              (c.title = "Layers"),
              c.setAttribute("role", "button"),
              Q(
                c,
                {
                  keydown: function (d) {
                    d.keyCode === 13 && this._expandSafely();
                  },
                  click: function (d) {
                    zt(d), this._expandSafely();
                  },
                },
                this,
              ),
              o || this.expand(),
              (this._baseLayersList = lt("div", t + "-base", u)),
              (this._separator = lt("div", t + "-separator", u)),
              (this._overlaysList = lt("div", t + "-overlays", u)),
              i.appendChild(u);
          },
          _getLayer: function (t) {
            for (var i = 0; i < this._layers.length; i++)
              if (this._layers[i] && p(this._layers[i].layer) === t)
                return this._layers[i];
          },
          _addLayer: function (t, i, o) {
            this._map && t.on("add remove", this._onLayerChange, this),
              this._layers.push({ layer: t, name: i, overlay: o }),
              this.options.sortLayers &&
                this._layers.sort(
                  h(function (u, c) {
                    return this.options.sortFunction(
                      u.layer,
                      c.layer,
                      u.name,
                      c.name,
                    );
                  }, this),
                ),
              this.options.autoZIndex &&
                t.setZIndex &&
                (this._lastZIndex++, t.setZIndex(this._lastZIndex)),
              this._expandIfNotCollapsed();
          },
          _update: function () {
            if (!this._container) return this;
            ei(this._baseLayersList),
              ei(this._overlaysList),
              (this._layerControlInputs = []);
            var t,
              i,
              o,
              u,
              c = 0;
            for (o = 0; o < this._layers.length; o++)
              (u = this._layers[o]),
                this._addItem(u),
                (i = i || u.overlay),
                (t = t || !u.overlay),
                (c += u.overlay ? 0 : 1);
            return (
              this.options.hideSingleBase &&
                ((t = t && c > 1),
                (this._baseLayersList.style.display = t ? "" : "none")),
              (this._separator.style.display = i && t ? "" : "none"),
              this
            );
          },
          _onLayerChange: function (t) {
            this._handlingClick || this._update();
            var i = this._getLayer(p(t.target)),
              o = i.overlay
                ? t.type === "add"
                  ? "overlayadd"
                  : "overlayremove"
                : t.type === "add"
                  ? "baselayerchange"
                  : null;
            o && this._map.fire(o, i);
          },
          _createRadioElement: function (t, i) {
            var o =
                '<input type="radio" class="leaflet-control-layers-selector" name="' +
                t +
                '"' +
                (i ? ' checked="checked"' : "") +
                "/>",
              u = document.createElement("div");
            return (u.innerHTML = o), u.firstChild;
          },
          _addItem: function (t) {
            var i = document.createElement("label"),
              o = this._map.hasLayer(t.layer),
              u;
            t.overlay
              ? ((u = document.createElement("input")),
                (u.type = "checkbox"),
                (u.className = "leaflet-control-layers-selector"),
                (u.defaultChecked = o))
              : (u = this._createRadioElement(
                  "leaflet-base-layers_" + p(this),
                  o,
                )),
              this._layerControlInputs.push(u),
              (u.layerId = p(t.layer)),
              Q(u, "click", this._onInputClick, this);
            var c = document.createElement("span");
            c.innerHTML = " " + t.name;
            var d = document.createElement("span");
            i.appendChild(d), d.appendChild(u), d.appendChild(c);
            var g = t.overlay ? this._overlaysList : this._baseLayersList;
            return g.appendChild(i), this._checkDisabledLayers(), i;
          },
          _onInputClick: function () {
            if (!this._preventClick) {
              var t = this._layerControlInputs,
                i,
                o,
                u = [],
                c = [];
              this._handlingClick = !0;
              for (var d = t.length - 1; d >= 0; d--)
                (i = t[d]),
                  (o = this._getLayer(i.layerId).layer),
                  i.checked ? u.push(o) : i.checked || c.push(o);
              for (d = 0; d < c.length; d++)
                this._map.hasLayer(c[d]) && this._map.removeLayer(c[d]);
              for (d = 0; d < u.length; d++)
                this._map.hasLayer(u[d]) || this._map.addLayer(u[d]);
              (this._handlingClick = !1), this._refocusOnMap();
            }
          },
          _checkDisabledLayers: function () {
            for (
              var t = this._layerControlInputs,
                i,
                o,
                u = this._map.getZoom(),
                c = t.length - 1;
              c >= 0;
              c--
            )
              (i = t[c]),
                (o = this._getLayer(i.layerId).layer),
                (i.disabled =
                  (o.options.minZoom !== void 0 && u < o.options.minZoom) ||
                  (o.options.maxZoom !== void 0 && u > o.options.maxZoom));
          },
          _expandIfNotCollapsed: function () {
            return this._map && !this.options.collapsed && this.expand(), this;
          },
          _expandSafely: function () {
            var t = this._section;
            (this._preventClick = !0), Q(t, "click", zt), this.expand();
            var i = this;
            setTimeout(function () {
              dt(t, "click", zt), (i._preventClick = !1);
            });
          },
        }),
        Ol = function (t, i, o) {
          return new ls(t, i, o);
        },
        _r = Kt.extend({
          options: {
            position: "topleft",
            zoomInText: '<span aria-hidden="true">+</span>',
            zoomInTitle: "Zoom in",
            zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
            zoomOutTitle: "Zoom out",
          },
          onAdd: function (t) {
            var i = "leaflet-control-zoom",
              o = lt("div", i + " leaflet-bar"),
              u = this.options;
            return (
              (this._zoomInButton = this._createButton(
                u.zoomInText,
                u.zoomInTitle,
                i + "-in",
                o,
                this._zoomIn,
              )),
              (this._zoomOutButton = this._createButton(
                u.zoomOutText,
                u.zoomOutTitle,
                i + "-out",
                o,
                this._zoomOut,
              )),
              this._updateDisabled(),
              t.on("zoomend zoomlevelschange", this._updateDisabled, this),
              o
            );
          },
          onRemove: function (t) {
            t.off("zoomend zoomlevelschange", this._updateDisabled, this);
          },
          disable: function () {
            return (this._disabled = !0), this._updateDisabled(), this;
          },
          enable: function () {
            return (this._disabled = !1), this._updateDisabled(), this;
          },
          _zoomIn: function (t) {
            !this._disabled &&
              this._map._zoom < this._map.getMaxZoom() &&
              this._map.zoomIn(
                this._map.options.zoomDelta * (t.shiftKey ? 3 : 1),
              );
          },
          _zoomOut: function (t) {
            !this._disabled &&
              this._map._zoom > this._map.getMinZoom() &&
              this._map.zoomOut(
                this._map.options.zoomDelta * (t.shiftKey ? 3 : 1),
              );
          },
          _createButton: function (t, i, o, u, c) {
            var d = lt("a", o, u);
            return (
              (d.innerHTML = t),
              (d.href = "#"),
              (d.title = i),
              d.setAttribute("role", "button"),
              d.setAttribute("aria-label", i),
              Mn(d),
              Q(d, "click", ze),
              Q(d, "click", c, this),
              Q(d, "click", this._refocusOnMap, this),
              d
            );
          },
          _updateDisabled: function () {
            var t = this._map,
              i = "leaflet-disabled";
            St(this._zoomInButton, i),
              St(this._zoomOutButton, i),
              this._zoomInButton.setAttribute("aria-disabled", "false"),
              this._zoomOutButton.setAttribute("aria-disabled", "false"),
              (this._disabled || t._zoom === t.getMinZoom()) &&
                (et(this._zoomOutButton, i),
                this._zoomOutButton.setAttribute("aria-disabled", "true")),
              (this._disabled || t._zoom === t.getMaxZoom()) &&
                (et(this._zoomInButton, i),
                this._zoomInButton.setAttribute("aria-disabled", "true"));
          },
        });
      at.mergeOptions({ zoomControl: !0 }),
        at.addInitHook(function () {
          this.options.zoomControl &&
            ((this.zoomControl = new _r()), this.addControl(this.zoomControl));
        });
      var Ml = function (t) {
          return new _r(t);
        },
        cs = Kt.extend({
          options: {
            position: "bottomleft",
            maxWidth: 100,
            metric: !0,
            imperial: !0,
          },
          onAdd: function (t) {
            var i = "leaflet-control-scale",
              o = lt("div", i),
              u = this.options;
            return (
              this._addScales(u, i + "-line", o),
              t.on(u.updateWhenIdle ? "moveend" : "move", this._update, this),
              t.whenReady(this._update, this),
              o
            );
          },
          onRemove: function (t) {
            t.off(
              this.options.updateWhenIdle ? "moveend" : "move",
              this._update,
              this,
            );
          },
          _addScales: function (t, i, o) {
            t.metric && (this._mScale = lt("div", i, o)),
              t.imperial && (this._iScale = lt("div", i, o));
          },
          _update: function () {
            var t = this._map,
              i = t.getSize().y / 2,
              o = t.distance(
                t.containerPointToLatLng([0, i]),
                t.containerPointToLatLng([this.options.maxWidth, i]),
              );
            this._updateScales(o);
          },
          _updateScales: function (t) {
            this.options.metric && t && this._updateMetric(t),
              this.options.imperial && t && this._updateImperial(t);
          },
          _updateMetric: function (t) {
            var i = this._getRoundNum(t),
              o = i < 1e3 ? i + " m" : i / 1e3 + " km";
            this._updateScale(this._mScale, o, i / t);
          },
          _updateImperial: function (t) {
            var i = t * 3.2808399,
              o,
              u,
              c;
            i > 5280
              ? ((o = i / 5280),
                (u = this._getRoundNum(o)),
                this._updateScale(this._iScale, u + " mi", u / o))
              : ((c = this._getRoundNum(i)),
                this._updateScale(this._iScale, c + " ft", c / i));
          },
          _updateScale: function (t, i, o) {
            (t.style.width = Math.round(this.options.maxWidth * o) + "px"),
              (t.innerHTML = i);
          },
          _getRoundNum: function (t) {
            var i = Math.pow(10, (Math.floor(t) + "").length - 1),
              o = t / i;
            return (
              (o = o >= 10 ? 10 : o >= 5 ? 5 : o >= 3 ? 3 : o >= 2 ? 2 : 1),
              i * o
            );
          },
        }),
        Il = function (t) {
          return new cs(t);
        },
        zl =
          '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',
        mr = Kt.extend({
          options: {
            position: "bottomright",
            prefix:
              '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' +
              (G.inlineSvg ? zl + " " : "") +
              "Leaflet</a>",
          },
          initialize: function (t) {
            O(this, t), (this._attributions = {});
          },
          onAdd: function (t) {
            (t.attributionControl = this),
              (this._container = lt("div", "leaflet-control-attribution")),
              Mn(this._container);
            for (var i in t._layers)
              t._layers[i].getAttribution &&
                this.addAttribution(t._layers[i].getAttribution());
            return (
              this._update(),
              t.on("layeradd", this._addAttribution, this),
              this._container
            );
          },
          onRemove: function (t) {
            t.off("layeradd", this._addAttribution, this);
          },
          _addAttribution: function (t) {
            t.layer.getAttribution &&
              (this.addAttribution(t.layer.getAttribution()),
              t.layer.once(
                "remove",
                function () {
                  this.removeAttribution(t.layer.getAttribution());
                },
                this,
              ));
          },
          setPrefix: function (t) {
            return (this.options.prefix = t), this._update(), this;
          },
          addAttribution: function (t) {
            return t
              ? (this._attributions[t] || (this._attributions[t] = 0),
                this._attributions[t]++,
                this._update(),
                this)
              : this;
          },
          removeAttribution: function (t) {
            return t
              ? (this._attributions[t] &&
                  (this._attributions[t]--, this._update()),
                this)
              : this;
          },
          _update: function () {
            if (this._map) {
              var t = [];
              for (var i in this._attributions)
                this._attributions[i] && t.push(i);
              var o = [];
              this.options.prefix && o.push(this.options.prefix),
                t.length && o.push(t.join(", ")),
                (this._container.innerHTML = o.join(
                  ' <span aria-hidden="true">|</span> ',
                ));
            }
          },
        });
      at.mergeOptions({ attributionControl: !0 }),
        at.addInitHook(function () {
          this.options.attributionControl && new mr().addTo(this);
        });
      var Rl = function (t) {
        return new mr(t);
      };
      (Kt.Layers = ls),
        (Kt.Zoom = _r),
        (Kt.Scale = cs),
        (Kt.Attribution = mr),
        (In.layers = Ol),
        (In.zoom = Ml),
        (In.scale = Il),
        (In.attribution = Rl);
      var re = wt.extend({
        initialize: function (t) {
          this._map = t;
        },
        enable: function () {
          return this._enabled
            ? this
            : ((this._enabled = !0), this.addHooks(), this);
        },
        disable: function () {
          return this._enabled
            ? ((this._enabled = !1), this.removeHooks(), this)
            : this;
        },
        enabled: function () {
          return !!this._enabled;
        },
      });
      re.addTo = function (t, i) {
        return t.addHandler(i, this), this;
      };
      var Al = { Events: Lt },
        hs = G.touch ? "touchstart mousedown" : "mousedown",
        ge = Ht.extend({
          options: { clickTolerance: 3 },
          initialize: function (t, i, o, u) {
            O(this, u),
              (this._element = t),
              (this._dragStartTarget = i || t),
              (this._preventOutline = o);
          },
          enable: function () {
            this._enabled ||
              (Q(this._dragStartTarget, hs, this._onDown, this),
              (this._enabled = !0));
          },
          disable: function () {
            this._enabled &&
              (ge._dragging === this && this.finishDrag(!0),
              dt(this._dragStartTarget, hs, this._onDown, this),
              (this._enabled = !1),
              (this._moved = !1));
          },
          _onDown: function (t) {
            if (
              this._enabled &&
              ((this._moved = !1), !nr(this._element, "leaflet-zoom-anim"))
            ) {
              if (t.touches && t.touches.length !== 1) {
                ge._dragging === this && this.finishDrag();
                return;
              }
              if (
                !(
                  ge._dragging ||
                  t.shiftKey ||
                  (t.which !== 1 && t.button !== 1 && !t.touches)
                ) &&
                ((ge._dragging = this),
                this._preventOutline && ur(this._element),
                or(),
                kn(),
                !this._moving)
              ) {
                this.fire("down");
                var i = t.touches ? t.touches[0] : t,
                  o = is(this._element);
                (this._startPoint = new j(i.clientX, i.clientY)),
                  (this._startPos = Me(this._element)),
                  (this._parentScale = lr(o));
                var u = t.type === "mousedown";
                Q(document, u ? "mousemove" : "touchmove", this._onMove, this),
                  Q(
                    document,
                    u ? "mouseup" : "touchend touchcancel",
                    this._onUp,
                    this,
                  );
              }
            }
          },
          _onMove: function (t) {
            if (this._enabled) {
              if (t.touches && t.touches.length > 1) {
                this._moved = !0;
                return;
              }
              var i = t.touches && t.touches.length === 1 ? t.touches[0] : t,
                o = new j(i.clientX, i.clientY)._subtract(this._startPoint);
              (!o.x && !o.y) ||
                Math.abs(o.x) + Math.abs(o.y) < this.options.clickTolerance ||
                ((o.x /= this._parentScale.x),
                (o.y /= this._parentScale.y),
                zt(t),
                this._moved ||
                  (this.fire("dragstart"),
                  (this._moved = !0),
                  et(document.body, "leaflet-dragging"),
                  (this._lastTarget = t.target || t.srcElement),
                  window.SVGElementInstance &&
                    this._lastTarget instanceof window.SVGElementInstance &&
                    (this._lastTarget =
                      this._lastTarget.correspondingUseElement),
                  et(this._lastTarget, "leaflet-drag-target")),
                (this._newPos = this._startPos.add(o)),
                (this._moving = !0),
                (this._lastEvent = t),
                this._updatePosition());
            }
          },
          _updatePosition: function () {
            var t = { originalEvent: this._lastEvent };
            this.fire("predrag", t),
              Tt(this._element, this._newPos),
              this.fire("drag", t);
          },
          _onUp: function () {
            this._enabled && this.finishDrag();
          },
          finishDrag: function (t) {
            St(document.body, "leaflet-dragging"),
              this._lastTarget &&
                (St(this._lastTarget, "leaflet-drag-target"),
                (this._lastTarget = null)),
              dt(document, "mousemove touchmove", this._onMove, this),
              dt(document, "mouseup touchend touchcancel", this._onUp, this),
              sr(),
              Cn();
            var i = this._moved && this._moving;
            (this._moving = !1),
              (ge._dragging = !1),
              i &&
                this.fire("dragend", {
                  noInertia: t,
                  distance: this._newPos.distanceTo(this._startPos),
                });
          },
        });
      function fs(t, i, o) {
        var u,
          c = [1, 4, 2, 8],
          d,
          g,
          y,
          x,
          R,
          H,
          Y,
          ot;
        for (d = 0, H = t.length; d < H; d++) t[d]._code = Re(t[d], i);
        for (y = 0; y < 4; y++) {
          for (Y = c[y], u = [], d = 0, H = t.length, g = H - 1; d < H; g = d++)
            (x = t[d]),
              (R = t[g]),
              x._code & Y
                ? R._code & Y ||
                  ((ot = si(R, x, Y, i, o)), (ot._code = Re(ot, i)), u.push(ot))
                : (R._code & Y &&
                    ((ot = si(R, x, Y, i, o)),
                    (ot._code = Re(ot, i)),
                    u.push(ot)),
                  u.push(x));
          t = u;
        }
        return t;
      }
      function ds(t, i) {
        var o, u, c, d, g, y, x, R, H;
        if (!t || t.length === 0) throw new Error("latlngs not passed");
        Gt(t) ||
          (console.warn(
            "latlngs are not flat! Only the first ring will be used",
          ),
          (t = t[0]));
        var Y = nt([0, 0]),
          ot = E(t),
          Nt =
            ot.getNorthWest().distanceTo(ot.getSouthWest()) *
            ot.getNorthEast().distanceTo(ot.getNorthWest());
        Nt < 1700 && (Y = gr(t));
        var It = t.length,
          Vt = [];
        for (o = 0; o < It; o++) {
          var Ut = nt(t[o]);
          Vt.push(i.project(nt([Ut.lat - Y.lat, Ut.lng - Y.lng])));
        }
        for (y = x = R = 0, o = 0, u = It - 1; o < It; u = o++)
          (c = Vt[o]),
            (d = Vt[u]),
            (g = c.y * d.x - d.y * c.x),
            (x += (c.x + d.x) * g),
            (R += (c.y + d.y) * g),
            (y += g * 3);
        y === 0 ? (H = Vt[0]) : (H = [x / y, R / y]);
        var nn = i.unproject(W(H));
        return nt([nn.lat + Y.lat, nn.lng + Y.lng]);
      }
      function gr(t) {
        for (var i = 0, o = 0, u = 0, c = 0; c < t.length; c++) {
          var d = nt(t[c]);
          (i += d.lat), (o += d.lng), u++;
        }
        return nt([i / u, o / u]);
      }
      var Bl = {
        __proto__: null,
        clipPolygon: fs,
        polygonCenter: ds,
        centroid: gr,
      };
      function ps(t, i) {
        if (!i || !t.length) return t.slice();
        var o = i * i;
        return (t = Zl(t, o)), (t = Dl(t, o)), t;
      }
      function _s(t, i, o) {
        return Math.sqrt(zn(t, i, o, !0));
      }
      function Nl(t, i, o) {
        return zn(t, i, o);
      }
      function Dl(t, i) {
        var o = t.length,
          u = typeof Uint8Array < "u" ? Uint8Array : Array,
          c = new u(o);
        (c[0] = c[o - 1] = 1), vr(t, c, i, 0, o - 1);
        var d,
          g = [];
        for (d = 0; d < o; d++) c[d] && g.push(t[d]);
        return g;
      }
      function vr(t, i, o, u, c) {
        var d = 0,
          g,
          y,
          x;
        for (y = u + 1; y <= c - 1; y++)
          (x = zn(t[y], t[u], t[c], !0)), x > d && ((g = y), (d = x));
        d > o && ((i[g] = 1), vr(t, i, o, u, g), vr(t, i, o, g, c));
      }
      function Zl(t, i) {
        for (var o = [t[0]], u = 1, c = 0, d = t.length; u < d; u++)
          Fl(t[u], t[c]) > i && (o.push(t[u]), (c = u));
        return c < d - 1 && o.push(t[d - 1]), o;
      }
      var ms;
      function gs(t, i, o, u, c) {
        var d = u ? ms : Re(t, o),
          g = Re(i, o),
          y,
          x,
          R;
        for (ms = g; ; ) {
          if (!(d | g)) return [t, i];
          if (d & g) return !1;
          (y = d || g),
            (x = si(t, i, y, o, c)),
            (R = Re(x, o)),
            y === d ? ((t = x), (d = R)) : ((i = x), (g = R));
        }
      }
      function si(t, i, o, u, c) {
        var d = i.x - t.x,
          g = i.y - t.y,
          y = u.min,
          x = u.max,
          R,
          H;
        return (
          o & 8
            ? ((R = t.x + (d * (x.y - t.y)) / g), (H = x.y))
            : o & 4
              ? ((R = t.x + (d * (y.y - t.y)) / g), (H = y.y))
              : o & 2
                ? ((R = x.x), (H = t.y + (g * (x.x - t.x)) / d))
                : o & 1 && ((R = y.x), (H = t.y + (g * (y.x - t.x)) / d)),
          new j(R, H, c)
        );
      }
      function Re(t, i) {
        var o = 0;
        return (
          t.x < i.min.x ? (o |= 1) : t.x > i.max.x && (o |= 2),
          t.y < i.min.y ? (o |= 4) : t.y > i.max.y && (o |= 8),
          o
        );
      }
      function Fl(t, i) {
        var o = i.x - t.x,
          u = i.y - t.y;
        return o * o + u * u;
      }
      function zn(t, i, o, u) {
        var c = i.x,
          d = i.y,
          g = o.x - c,
          y = o.y - d,
          x = g * g + y * y,
          R;
        return (
          x > 0 &&
            ((R = ((t.x - c) * g + (t.y - d) * y) / x),
            R > 1
              ? ((c = o.x), (d = o.y))
              : R > 0 && ((c += g * R), (d += y * R))),
          (g = t.x - c),
          (y = t.y - d),
          u ? g * g + y * y : new j(c, d)
        );
      }
      function Gt(t) {
        return !C(t[0]) || (typeof t[0][0] != "object" && typeof t[0][0] < "u");
      }
      function vs(t) {
        return (
          console.warn(
            "Deprecated use of _flat, please use L.LineUtil.isFlat instead.",
          ),
          Gt(t)
        );
      }
      function ys(t, i) {
        var o, u, c, d, g, y, x, R;
        if (!t || t.length === 0) throw new Error("latlngs not passed");
        Gt(t) ||
          (console.warn(
            "latlngs are not flat! Only the first ring will be used",
          ),
          (t = t[0]));
        var H = nt([0, 0]),
          Y = E(t),
          ot =
            Y.getNorthWest().distanceTo(Y.getSouthWest()) *
            Y.getNorthEast().distanceTo(Y.getNorthWest());
        ot < 1700 && (H = gr(t));
        var Nt = t.length,
          It = [];
        for (o = 0; o < Nt; o++) {
          var Vt = nt(t[o]);
          It.push(i.project(nt([Vt.lat - H.lat, Vt.lng - H.lng])));
        }
        for (o = 0, u = 0; o < Nt - 1; o++)
          u += It[o].distanceTo(It[o + 1]) / 2;
        if (u === 0) R = It[0];
        else
          for (o = 0, d = 0; o < Nt - 1; o++)
            if (
              ((g = It[o]),
              (y = It[o + 1]),
              (c = g.distanceTo(y)),
              (d += c),
              d > u)
            ) {
              (x = (d - u) / c),
                (R = [y.x - x * (y.x - g.x), y.y - x * (y.y - g.y)]);
              break;
            }
        var Ut = i.unproject(W(R));
        return nt([Ut.lat + H.lat, Ut.lng + H.lng]);
      }
      var Hl = {
          __proto__: null,
          simplify: ps,
          pointToSegmentDistance: _s,
          closestPointOnSegment: Nl,
          clipSegment: gs,
          _getEdgeIntersection: si,
          _getBitCode: Re,
          _sqClosestPointOnSegment: zn,
          isFlat: Gt,
          _flat: vs,
          polylineCenter: ys,
        },
        yr = {
          project: function (t) {
            return new j(t.lng, t.lat);
          },
          unproject: function (t) {
            return new q(t.y, t.x);
          },
          bounds: new ct([-180, -90], [180, 90]),
        },
        wr = {
          R: 6378137,
          R_MINOR: 6356752314245179e-9,
          bounds: new ct(
            [-2003750834279e-5, -1549657073972e-5],
            [2003750834279e-5, 1876465623138e-5],
          ),
          project: function (t) {
            var i = Math.PI / 180,
              o = this.R,
              u = t.lat * i,
              c = this.R_MINOR / o,
              d = Math.sqrt(1 - c * c),
              g = d * Math.sin(u),
              y =
                Math.tan(Math.PI / 4 - u / 2) /
                Math.pow((1 - g) / (1 + g), d / 2);
            return (
              (u = -o * Math.log(Math.max(y, 1e-10))), new j(t.lng * i * o, u)
            );
          },
          unproject: function (t) {
            for (
              var i = 180 / Math.PI,
                o = this.R,
                u = this.R_MINOR / o,
                c = Math.sqrt(1 - u * u),
                d = Math.exp(-t.y / o),
                g = Math.PI / 2 - 2 * Math.atan(d),
                y = 0,
                x = 0.1,
                R;
              y < 15 && Math.abs(x) > 1e-7;
              y++
            )
              (R = c * Math.sin(g)),
                (R = Math.pow((1 - R) / (1 + R), c / 2)),
                (x = Math.PI / 2 - 2 * Math.atan(d * R) - g),
                (g += x);
            return new q(g * i, (t.x * i) / o);
          },
        },
        Ul = {
          __proto__: null,
          LonLat: yr,
          Mercator: wr,
          SphericalMercator: Ce,
        },
        jl = a({}, Bt, {
          code: "EPSG:3395",
          projection: wr,
          transformation: (function () {
            var t = 0.5 / (Math.PI * wr.R);
            return xn(t, 0.5, -t, 0.5);
          })(),
        }),
        ws = a({}, Bt, {
          code: "EPSG:4326",
          projection: yr,
          transformation: xn(1 / 180, 1, -1 / 180, 0.5),
        }),
        Wl = a({}, Yt, {
          projection: yr,
          transformation: xn(1, 0, -1, 0),
          scale: function (t) {
            return Math.pow(2, t);
          },
          zoom: function (t) {
            return Math.log(t) / Math.LN2;
          },
          distance: function (t, i) {
            var o = i.lng - t.lng,
              u = i.lat - t.lat;
            return Math.sqrt(o * o + u * u);
          },
          infinite: !0,
        });
      (Yt.Earth = Bt),
        (Yt.EPSG3395 = jl),
        (Yt.EPSG3857 = $i),
        (Yt.EPSG900913 = Ku),
        (Yt.EPSG4326 = ws),
        (Yt.Simple = Wl);
      var Xt = Ht.extend({
        options: {
          pane: "overlayPane",
          attribution: null,
          bubblingMouseEvents: !0,
        },
        addTo: function (t) {
          return t.addLayer(this), this;
        },
        remove: function () {
          return this.removeFrom(this._map || this._mapToAdd);
        },
        removeFrom: function (t) {
          return t && t.removeLayer(this), this;
        },
        getPane: function (t) {
          return this._map.getPane(
            t ? this.options[t] || t : this.options.pane,
          );
        },
        addInteractiveTarget: function (t) {
          return (this._map._targets[p(t)] = this), this;
        },
        removeInteractiveTarget: function (t) {
          return delete this._map._targets[p(t)], this;
        },
        getAttribution: function () {
          return this.options.attribution;
        },
        _layerAdd: function (t) {
          var i = t.target;
          if (i.hasLayer(this)) {
            if (
              ((this._map = i),
              (this._zoomAnimated = i._zoomAnimated),
              this.getEvents)
            ) {
              var o = this.getEvents();
              i.on(o, this),
                this.once(
                  "remove",
                  function () {
                    i.off(o, this);
                  },
                  this,
                );
            }
            this.onAdd(i),
              this.fire("add"),
              i.fire("layeradd", { layer: this });
          }
        },
      });
      at.include({
        addLayer: function (t) {
          if (!t._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var i = p(t);
          return this._layers[i]
            ? this
            : ((this._layers[i] = t),
              (t._mapToAdd = this),
              t.beforeAdd && t.beforeAdd(this),
              this.whenReady(t._layerAdd, t),
              this);
        },
        removeLayer: function (t) {
          var i = p(t);
          return this._layers[i]
            ? (this._loaded && t.onRemove(this),
              delete this._layers[i],
              this._loaded &&
                (this.fire("layerremove", { layer: t }), t.fire("remove")),
              (t._map = t._mapToAdd = null),
              this)
            : this;
        },
        hasLayer: function (t) {
          return p(t) in this._layers;
        },
        eachLayer: function (t, i) {
          for (var o in this._layers) t.call(i, this._layers[o]);
          return this;
        },
        _addLayers: function (t) {
          t = t ? (C(t) ? t : [t]) : [];
          for (var i = 0, o = t.length; i < o; i++) this.addLayer(t[i]);
        },
        _addZoomLimit: function (t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) &&
            ((this._zoomBoundLayers[p(t)] = t), this._updateZoomLevels());
        },
        _removeZoomLimit: function (t) {
          var i = p(t);
          this._zoomBoundLayers[i] &&
            (delete this._zoomBoundLayers[i], this._updateZoomLevels());
        },
        _updateZoomLevels: function () {
          var t = 1 / 0,
            i = -1 / 0,
            o = this._getZoomSpan();
          for (var u in this._zoomBoundLayers) {
            var c = this._zoomBoundLayers[u].options;
            (t = c.minZoom === void 0 ? t : Math.min(t, c.minZoom)),
              (i = c.maxZoom === void 0 ? i : Math.max(i, c.maxZoom));
          }
          (this._layersMaxZoom = i === -1 / 0 ? void 0 : i),
            (this._layersMinZoom = t === 1 / 0 ? void 0 : t),
            o !== this._getZoomSpan() && this.fire("zoomlevelschange"),
            this.options.maxZoom === void 0 &&
              this._layersMaxZoom &&
              this.getZoom() > this._layersMaxZoom &&
              this.setZoom(this._layersMaxZoom),
            this.options.minZoom === void 0 &&
              this._layersMinZoom &&
              this.getZoom() < this._layersMinZoom &&
              this.setZoom(this._layersMinZoom);
        },
      });
      var Xe = Xt.extend({
          initialize: function (t, i) {
            O(this, i), (this._layers = {});
            var o, u;
            if (t) for (o = 0, u = t.length; o < u; o++) this.addLayer(t[o]);
          },
          addLayer: function (t) {
            var i = this.getLayerId(t);
            return (
              (this._layers[i] = t), this._map && this._map.addLayer(t), this
            );
          },
          removeLayer: function (t) {
            var i = t in this._layers ? t : this.getLayerId(t);
            return (
              this._map &&
                this._layers[i] &&
                this._map.removeLayer(this._layers[i]),
              delete this._layers[i],
              this
            );
          },
          hasLayer: function (t) {
            var i = typeof t == "number" ? t : this.getLayerId(t);
            return i in this._layers;
          },
          clearLayers: function () {
            return this.eachLayer(this.removeLayer, this);
          },
          invoke: function (t) {
            var i = Array.prototype.slice.call(arguments, 1),
              o,
              u;
            for (o in this._layers)
              (u = this._layers[o]), u[t] && u[t].apply(u, i);
            return this;
          },
          onAdd: function (t) {
            this.eachLayer(t.addLayer, t);
          },
          onRemove: function (t) {
            this.eachLayer(t.removeLayer, t);
          },
          eachLayer: function (t, i) {
            for (var o in this._layers) t.call(i, this._layers[o]);
            return this;
          },
          getLayer: function (t) {
            return this._layers[t];
          },
          getLayers: function () {
            var t = [];
            return this.eachLayer(t.push, t), t;
          },
          setZIndex: function (t) {
            return this.invoke("setZIndex", t);
          },
          getLayerId: function (t) {
            return p(t);
          },
        }),
        ql = function (t, i) {
          return new Xe(t, i);
        },
        de = Xe.extend({
          addLayer: function (t) {
            return this.hasLayer(t)
              ? this
              : (t.addEventParent(this),
                Xe.prototype.addLayer.call(this, t),
                this.fire("layeradd", { layer: t }));
          },
          removeLayer: function (t) {
            return this.hasLayer(t)
              ? (t in this._layers && (t = this._layers[t]),
                t.removeEventParent(this),
                Xe.prototype.removeLayer.call(this, t),
                this.fire("layerremove", { layer: t }))
              : this;
          },
          setStyle: function (t) {
            return this.invoke("setStyle", t);
          },
          bringToFront: function () {
            return this.invoke("bringToFront");
          },
          bringToBack: function () {
            return this.invoke("bringToBack");
          },
          getBounds: function () {
            var t = new X();
            for (var i in this._layers) {
              var o = this._layers[i];
              t.extend(o.getBounds ? o.getBounds() : o.getLatLng());
            }
            return t;
          },
        }),
        Gl = function (t, i) {
          return new de(t, i);
        },
        Je = wt.extend({
          options: {
            popupAnchor: [0, 0],
            tooltipAnchor: [0, 0],
            crossOrigin: !1,
          },
          initialize: function (t) {
            O(this, t);
          },
          createIcon: function (t) {
            return this._createIcon("icon", t);
          },
          createShadow: function (t) {
            return this._createIcon("shadow", t);
          },
          _createIcon: function (t, i) {
            var o = this._getIconUrl(t);
            if (!o) {
              if (t === "icon")
                throw new Error(
                  "iconUrl not set in Icon options (see the docs).",
                );
              return null;
            }
            var u = this._createImg(o, i && i.tagName === "IMG" ? i : null);
            return (
              this._setIconStyles(u, t),
              (this.options.crossOrigin || this.options.crossOrigin === "") &&
                (u.crossOrigin =
                  this.options.crossOrigin === !0
                    ? ""
                    : this.options.crossOrigin),
              u
            );
          },
          _setIconStyles: function (t, i) {
            var o = this.options,
              u = o[i + "Size"];
            typeof u == "number" && (u = [u, u]);
            var c = W(u),
              d = W(
                (i === "shadow" && o.shadowAnchor) ||
                  o.iconAnchor ||
                  (c && c.divideBy(2, !0)),
              );
            (t.className = "leaflet-marker-" + i + " " + (o.className || "")),
              d &&
                ((t.style.marginLeft = -d.x + "px"),
                (t.style.marginTop = -d.y + "px")),
              c &&
                ((t.style.width = c.x + "px"), (t.style.height = c.y + "px"));
          },
          _createImg: function (t, i) {
            return (i = i || document.createElement("img")), (i.src = t), i;
          },
          _getIconUrl: function (t) {
            return (
              (G.retina && this.options[t + "RetinaUrl"]) ||
              this.options[t + "Url"]
            );
          },
        });
      function Vl(t) {
        return new Je(t);
      }
      var Rn = Je.extend({
          options: {
            iconUrl: "marker-icon.png",
            iconRetinaUrl: "marker-icon-2x.png",
            shadowUrl: "marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
          },
          _getIconUrl: function (t) {
            return (
              typeof Rn.imagePath != "string" &&
                (Rn.imagePath = this._detectIconPath()),
              (this.options.imagePath || Rn.imagePath) +
                Je.prototype._getIconUrl.call(this, t)
            );
          },
          _stripUrl: function (t) {
            var i = function (o, u, c) {
              var d = u.exec(o);
              return d && d[c];
            };
            return (
              (t = i(t, /^url\((['"])?(.+)\1\)$/, 2)),
              t && i(t, /^(.*)marker-icon\.png$/, 1)
            );
          },
          _detectIconPath: function () {
            var t = lt("div", "leaflet-default-icon-path", document.body),
              i = En(t, "background-image") || En(t, "backgroundImage");
            if ((document.body.removeChild(t), (i = this._stripUrl(i)), i))
              return i;
            var o = document.querySelector('link[href$="leaflet.css"]');
            return o ? o.href.substring(0, o.href.length - 11 - 1) : "";
          },
        }),
        bs = re.extend({
          initialize: function (t) {
            this._marker = t;
          },
          addHooks: function () {
            var t = this._marker._icon;
            this._draggable || (this._draggable = new ge(t, t, !0)),
              this._draggable
                .on(
                  {
                    dragstart: this._onDragStart,
                    predrag: this._onPreDrag,
                    drag: this._onDrag,
                    dragend: this._onDragEnd,
                  },
                  this,
                )
                .enable(),
              et(t, "leaflet-marker-draggable");
          },
          removeHooks: function () {
            this._draggable
              .off(
                {
                  dragstart: this._onDragStart,
                  predrag: this._onPreDrag,
                  drag: this._onDrag,
                  dragend: this._onDragEnd,
                },
                this,
              )
              .disable(),
              this._marker._icon &&
                St(this._marker._icon, "leaflet-marker-draggable");
          },
          moved: function () {
            return this._draggable && this._draggable._moved;
          },
          _adjustPan: function (t) {
            var i = this._marker,
              o = i._map,
              u = this._marker.options.autoPanSpeed,
              c = this._marker.options.autoPanPadding,
              d = Me(i._icon),
              g = o.getPixelBounds(),
              y = o.getPixelOrigin(),
              x = A(g.min._subtract(y).add(c), g.max._subtract(y).subtract(c));
            if (!x.contains(d)) {
              var R = W(
                (Math.max(x.max.x, d.x) - x.max.x) / (g.max.x - x.max.x) -
                  (Math.min(x.min.x, d.x) - x.min.x) / (g.min.x - x.min.x),
                (Math.max(x.max.y, d.y) - x.max.y) / (g.max.y - x.max.y) -
                  (Math.min(x.min.y, d.y) - x.min.y) / (g.min.y - x.min.y),
              ).multiplyBy(u);
              o.panBy(R, { animate: !1 }),
                this._draggable._newPos._add(R),
                this._draggable._startPos._add(R),
                Tt(i._icon, this._draggable._newPos),
                this._onDrag(t),
                (this._panRequest = tt(this._adjustPan.bind(this, t)));
            }
          },
          _onDragStart: function () {
            (this._oldLatLng = this._marker.getLatLng()),
              this._marker.closePopup && this._marker.closePopup(),
              this._marker.fire("movestart").fire("dragstart");
          },
          _onPreDrag: function (t) {
            this._marker.options.autoPan &&
              (J(this._panRequest),
              (this._panRequest = tt(this._adjustPan.bind(this, t))));
          },
          _onDrag: function (t) {
            var i = this._marker,
              o = i._shadow,
              u = Me(i._icon),
              c = i._map.layerPointToLatLng(u);
            o && Tt(o, u),
              (i._latlng = c),
              (t.latlng = c),
              (t.oldLatLng = this._oldLatLng),
              i.fire("move", t).fire("drag", t);
          },
          _onDragEnd: function (t) {
            J(this._panRequest),
              delete this._oldLatLng,
              this._marker.fire("moveend").fire("dragend", t);
          },
        }),
        ai = Xt.extend({
          options: {
            icon: new Rn(),
            interactive: !0,
            keyboard: !0,
            title: "",
            alt: "Marker",
            zIndexOffset: 0,
            opacity: 1,
            riseOnHover: !1,
            riseOffset: 250,
            pane: "markerPane",
            shadowPane: "shadowPane",
            bubblingMouseEvents: !1,
            autoPanOnFocus: !0,
            draggable: !1,
            autoPan: !1,
            autoPanPadding: [50, 50],
            autoPanSpeed: 10,
          },
          initialize: function (t, i) {
            O(this, i), (this._latlng = nt(t));
          },
          onAdd: function (t) {
            (this._zoomAnimated =
              this._zoomAnimated && t.options.markerZoomAnimation),
              this._zoomAnimated && t.on("zoomanim", this._animateZoom, this),
              this._initIcon(),
              this.update();
          },
          onRemove: function (t) {
            this.dragging &&
              this.dragging.enabled() &&
              ((this.options.draggable = !0), this.dragging.removeHooks()),
              delete this.dragging,
              this._zoomAnimated && t.off("zoomanim", this._animateZoom, this),
              this._removeIcon(),
              this._removeShadow();
          },
          getEvents: function () {
            return { zoom: this.update, viewreset: this.update };
          },
          getLatLng: function () {
            return this._latlng;
          },
          setLatLng: function (t) {
            var i = this._latlng;
            return (
              (this._latlng = nt(t)),
              this.update(),
              this.fire("move", { oldLatLng: i, latlng: this._latlng })
            );
          },
          setZIndexOffset: function (t) {
            return (this.options.zIndexOffset = t), this.update();
          },
          getIcon: function () {
            return this.options.icon;
          },
          setIcon: function (t) {
            return (
              (this.options.icon = t),
              this._map && (this._initIcon(), this.update()),
              this._popup && this.bindPopup(this._popup, this._popup.options),
              this
            );
          },
          getElement: function () {
            return this._icon;
          },
          update: function () {
            if (this._icon && this._map) {
              var t = this._map.latLngToLayerPoint(this._latlng).round();
              this._setPos(t);
            }
            return this;
          },
          _initIcon: function () {
            var t = this.options,
              i = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
              o = t.icon.createIcon(this._icon),
              u = !1;
            o !== this._icon &&
              (this._icon && this._removeIcon(),
              (u = !0),
              t.title && (o.title = t.title),
              o.tagName === "IMG" && (o.alt = t.alt || "")),
              et(o, i),
              t.keyboard &&
                ((o.tabIndex = "0"), o.setAttribute("role", "button")),
              (this._icon = o),
              t.riseOnHover &&
                this.on({
                  mouseover: this._bringToFront,
                  mouseout: this._resetZIndex,
                }),
              this.options.autoPanOnFocus &&
                Q(o, "focus", this._panOnFocus, this);
            var c = t.icon.createShadow(this._shadow),
              d = !1;
            c !== this._shadow && (this._removeShadow(), (d = !0)),
              c && (et(c, i), (c.alt = "")),
              (this._shadow = c),
              t.opacity < 1 && this._updateOpacity(),
              u && this.getPane().appendChild(this._icon),
              this._initInteraction(),
              c && d && this.getPane(t.shadowPane).appendChild(this._shadow);
          },
          _removeIcon: function () {
            this.options.riseOnHover &&
              this.off({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex,
              }),
              this.options.autoPanOnFocus &&
                dt(this._icon, "focus", this._panOnFocus, this),
              gt(this._icon),
              this.removeInteractiveTarget(this._icon),
              (this._icon = null);
          },
          _removeShadow: function () {
            this._shadow && gt(this._shadow), (this._shadow = null);
          },
          _setPos: function (t) {
            this._icon && Tt(this._icon, t),
              this._shadow && Tt(this._shadow, t),
              (this._zIndex = t.y + this.options.zIndexOffset),
              this._resetZIndex();
          },
          _updateZIndex: function (t) {
            this._icon && (this._icon.style.zIndex = this._zIndex + t);
          },
          _animateZoom: function (t) {
            var i = this._map
              ._latLngToNewLayerPoint(this._latlng, t.zoom, t.center)
              .round();
            this._setPos(i);
          },
          _initInteraction: function () {
            if (
              this.options.interactive &&
              (et(this._icon, "leaflet-interactive"),
              this.addInteractiveTarget(this._icon),
              bs)
            ) {
              var t = this.options.draggable;
              this.dragging &&
                ((t = this.dragging.enabled()), this.dragging.disable()),
                (this.dragging = new bs(this)),
                t && this.dragging.enable();
            }
          },
          setOpacity: function (t) {
            return (
              (this.options.opacity = t),
              this._map && this._updateOpacity(),
              this
            );
          },
          _updateOpacity: function () {
            var t = this.options.opacity;
            this._icon && qt(this._icon, t),
              this._shadow && qt(this._shadow, t);
          },
          _bringToFront: function () {
            this._updateZIndex(this.options.riseOffset);
          },
          _resetZIndex: function () {
            this._updateZIndex(0);
          },
          _panOnFocus: function () {
            var t = this._map;
            if (t) {
              var i = this.options.icon.options,
                o = i.iconSize ? W(i.iconSize) : W(0, 0),
                u = i.iconAnchor ? W(i.iconAnchor) : W(0, 0);
              t.panInside(this._latlng, {
                paddingTopLeft: u,
                paddingBottomRight: o.subtract(u),
              });
            }
          },
          _getPopupAnchor: function () {
            return this.options.icon.options.popupAnchor;
          },
          _getTooltipAnchor: function () {
            return this.options.icon.options.tooltipAnchor;
          },
        });
      function $l(t, i) {
        return new ai(t, i);
      }
      var ve = Xt.extend({
          options: {
            stroke: !0,
            color: "#3388ff",
            weight: 3,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
            dashArray: null,
            dashOffset: null,
            fill: !1,
            fillColor: null,
            fillOpacity: 0.2,
            fillRule: "evenodd",
            interactive: !0,
            bubblingMouseEvents: !0,
          },
          beforeAdd: function (t) {
            this._renderer = t.getRenderer(this);
          },
          onAdd: function () {
            this._renderer._initPath(this),
              this._reset(),
              this._renderer._addPath(this);
          },
          onRemove: function () {
            this._renderer._removePath(this);
          },
          redraw: function () {
            return this._map && this._renderer._updatePath(this), this;
          },
          setStyle: function (t) {
            return (
              O(this, t),
              this._renderer &&
                (this._renderer._updateStyle(this),
                this.options.stroke &&
                  t &&
                  Object.prototype.hasOwnProperty.call(t, "weight") &&
                  this._updateBounds()),
              this
            );
          },
          bringToFront: function () {
            return this._renderer && this._renderer._bringToFront(this), this;
          },
          bringToBack: function () {
            return this._renderer && this._renderer._bringToBack(this), this;
          },
          getElement: function () {
            return this._path;
          },
          _reset: function () {
            this._project(), this._update();
          },
          _clickTolerance: function () {
            return (
              (this.options.stroke ? this.options.weight / 2 : 0) +
              (this._renderer.options.tolerance || 0)
            );
          },
        }),
        ui = ve.extend({
          options: { fill: !0, radius: 10 },
          initialize: function (t, i) {
            O(this, i),
              (this._latlng = nt(t)),
              (this._radius = this.options.radius);
          },
          setLatLng: function (t) {
            var i = this._latlng;
            return (
              (this._latlng = nt(t)),
              this.redraw(),
              this.fire("move", { oldLatLng: i, latlng: this._latlng })
            );
          },
          getLatLng: function () {
            return this._latlng;
          },
          setRadius: function (t) {
            return (this.options.radius = this._radius = t), this.redraw();
          },
          getRadius: function () {
            return this._radius;
          },
          setStyle: function (t) {
            var i = (t && t.radius) || this._radius;
            return ve.prototype.setStyle.call(this, t), this.setRadius(i), this;
          },
          _project: function () {
            (this._point = this._map.latLngToLayerPoint(this._latlng)),
              this._updateBounds();
          },
          _updateBounds: function () {
            var t = this._radius,
              i = this._radiusY || t,
              o = this._clickTolerance(),
              u = [t + o, i + o];
            this._pxBounds = new ct(
              this._point.subtract(u),
              this._point.add(u),
            );
          },
          _update: function () {
            this._map && this._updatePath();
          },
          _updatePath: function () {
            this._renderer._updateCircle(this);
          },
          _empty: function () {
            return (
              this._radius && !this._renderer._bounds.intersects(this._pxBounds)
            );
          },
          _containsPoint: function (t) {
            return (
              t.distanceTo(this._point) <= this._radius + this._clickTolerance()
            );
          },
        });
      function Yl(t, i) {
        return new ui(t, i);
      }
      var br = ui.extend({
        initialize: function (t, i, o) {
          if (
            (typeof i == "number" && (i = a({}, o, { radius: i })),
            O(this, i),
            (this._latlng = nt(t)),
            isNaN(this.options.radius))
          )
            throw new Error("Circle radius cannot be NaN");
          this._mRadius = this.options.radius;
        },
        setRadius: function (t) {
          return (this._mRadius = t), this.redraw();
        },
        getRadius: function () {
          return this._mRadius;
        },
        getBounds: function () {
          var t = [this._radius, this._radiusY || this._radius];
          return new X(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t)),
          );
        },
        setStyle: ve.prototype.setStyle,
        _project: function () {
          var t = this._latlng.lng,
            i = this._latlng.lat,
            o = this._map,
            u = o.options.crs;
          if (u.distance === Bt.distance) {
            var c = Math.PI / 180,
              d = this._mRadius / Bt.R / c,
              g = o.project([i + d, t]),
              y = o.project([i - d, t]),
              x = g.add(y).divideBy(2),
              R = o.unproject(x).lat,
              H =
                Math.acos(
                  (Math.cos(d * c) - Math.sin(i * c) * Math.sin(R * c)) /
                    (Math.cos(i * c) * Math.cos(R * c)),
                ) / c;
            (isNaN(H) || H === 0) && (H = d / Math.cos((Math.PI / 180) * i)),
              (this._point = x.subtract(o.getPixelOrigin())),
              (this._radius = isNaN(H) ? 0 : x.x - o.project([R, t - H]).x),
              (this._radiusY = x.y - g.y);
          } else {
            var Y = u.unproject(
              u.project(this._latlng).subtract([this._mRadius, 0]),
            );
            (this._point = o.latLngToLayerPoint(this._latlng)),
              (this._radius = this._point.x - o.latLngToLayerPoint(Y).x);
          }
          this._updateBounds();
        },
      });
      function Kl(t, i, o) {
        return new br(t, i, o);
      }
      var pe = ve.extend({
        options: { smoothFactor: 1, noClip: !1 },
        initialize: function (t, i) {
          O(this, i), this._setLatLngs(t);
        },
        getLatLngs: function () {
          return this._latlngs;
        },
        setLatLngs: function (t) {
          return this._setLatLngs(t), this.redraw();
        },
        isEmpty: function () {
          return !this._latlngs.length;
        },
        closestLayerPoint: function (t) {
          for (
            var i = 1 / 0,
              o = null,
              u = zn,
              c,
              d,
              g = 0,
              y = this._parts.length;
            g < y;
            g++
          )
            for (var x = this._parts[g], R = 1, H = x.length; R < H; R++) {
              (c = x[R - 1]), (d = x[R]);
              var Y = u(t, c, d, !0);
              Y < i && ((i = Y), (o = u(t, c, d)));
            }
          return o && (o.distance = Math.sqrt(i)), o;
        },
        getCenter: function () {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return ys(this._defaultShape(), this._map.options.crs);
        },
        getBounds: function () {
          return this._bounds;
        },
        addLatLng: function (t, i) {
          return (
            (i = i || this._defaultShape()),
            (t = nt(t)),
            i.push(t),
            this._bounds.extend(t),
            this.redraw()
          );
        },
        _setLatLngs: function (t) {
          (this._bounds = new X()), (this._latlngs = this._convertLatLngs(t));
        },
        _defaultShape: function () {
          return Gt(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        _convertLatLngs: function (t) {
          for (var i = [], o = Gt(t), u = 0, c = t.length; u < c; u++)
            o
              ? ((i[u] = nt(t[u])), this._bounds.extend(i[u]))
              : (i[u] = this._convertLatLngs(t[u]));
          return i;
        },
        _project: function () {
          var t = new ct();
          (this._rings = []),
            this._projectLatlngs(this._latlngs, this._rings, t),
            this._bounds.isValid() &&
              t.isValid() &&
              ((this._rawPxBounds = t), this._updateBounds());
        },
        _updateBounds: function () {
          var t = this._clickTolerance(),
            i = new j(t, t);
          this._rawPxBounds &&
            (this._pxBounds = new ct([
              this._rawPxBounds.min.subtract(i),
              this._rawPxBounds.max.add(i),
            ]));
        },
        _projectLatlngs: function (t, i, o) {
          var u = t[0] instanceof q,
            c = t.length,
            d,
            g;
          if (u) {
            for (g = [], d = 0; d < c; d++)
              (g[d] = this._map.latLngToLayerPoint(t[d])), o.extend(g[d]);
            i.push(g);
          } else for (d = 0; d < c; d++) this._projectLatlngs(t[d], i, o);
        },
        _clipPoints: function () {
          var t = this._renderer._bounds;
          if (
            ((this._parts = []),
            !(!this._pxBounds || !this._pxBounds.intersects(t)))
          ) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var i = this._parts,
              o,
              u,
              c,
              d,
              g,
              y,
              x;
            for (o = 0, c = 0, d = this._rings.length; o < d; o++)
              for (x = this._rings[o], u = 0, g = x.length; u < g - 1; u++)
                (y = gs(x[u], x[u + 1], t, u, !0)),
                  y &&
                    ((i[c] = i[c] || []),
                    i[c].push(y[0]),
                    (y[1] !== x[u + 1] || u === g - 2) &&
                      (i[c].push(y[1]), c++));
          }
        },
        _simplifyPoints: function () {
          for (
            var t = this._parts,
              i = this.options.smoothFactor,
              o = 0,
              u = t.length;
            o < u;
            o++
          )
            t[o] = ps(t[o], i);
        },
        _update: function () {
          this._map &&
            (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function () {
          this._renderer._updatePoly(this);
        },
        _containsPoint: function (t, i) {
          var o,
            u,
            c,
            d,
            g,
            y,
            x = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;
          for (o = 0, d = this._parts.length; o < d; o++)
            for (
              y = this._parts[o], u = 0, g = y.length, c = g - 1;
              u < g;
              c = u++
            )
              if (!(!i && u === 0) && _s(t, y[c], y[u]) <= x) return !0;
          return !1;
        },
      });
      function Xl(t, i) {
        return new pe(t, i);
      }
      pe._flat = vs;
      var Qe = pe.extend({
        options: { fill: !0 },
        isEmpty: function () {
          return !this._latlngs.length || !this._latlngs[0].length;
        },
        getCenter: function () {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return ds(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function (t) {
          var i = pe.prototype._convertLatLngs.call(this, t),
            o = i.length;
          return (
            o >= 2 && i[0] instanceof q && i[0].equals(i[o - 1]) && i.pop(), i
          );
        },
        _setLatLngs: function (t) {
          pe.prototype._setLatLngs.call(this, t),
            Gt(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function () {
          return Gt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function () {
          var t = this._renderer._bounds,
            i = this.options.weight,
            o = new j(i, i);
          if (
            ((t = new ct(t.min.subtract(o), t.max.add(o))),
            (this._parts = []),
            !(!this._pxBounds || !this._pxBounds.intersects(t)))
          ) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var u = 0, c = this._rings.length, d; u < c; u++)
              (d = fs(this._rings[u], t, !0)), d.length && this._parts.push(d);
          }
        },
        _updatePath: function () {
          this._renderer._updatePoly(this, !0);
        },
        _containsPoint: function (t) {
          var i = !1,
            o,
            u,
            c,
            d,
            g,
            y,
            x,
            R;
          if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;
          for (d = 0, x = this._parts.length; d < x; d++)
            for (
              o = this._parts[d], g = 0, R = o.length, y = R - 1;
              g < R;
              y = g++
            )
              (u = o[g]),
                (c = o[y]),
                u.y > t.y != c.y > t.y &&
                  t.x < ((c.x - u.x) * (t.y - u.y)) / (c.y - u.y) + u.x &&
                  (i = !i);
          return i || pe.prototype._containsPoint.call(this, t, !0);
        },
      });
      function Jl(t, i) {
        return new Qe(t, i);
      }
      var _e = de.extend({
        initialize: function (t, i) {
          O(this, i), (this._layers = {}), t && this.addData(t);
        },
        addData: function (t) {
          var i = C(t) ? t : t.features,
            o,
            u,
            c;
          if (i) {
            for (o = 0, u = i.length; o < u; o++)
              (c = i[o]),
                (c.geometries || c.geometry || c.features || c.coordinates) &&
                  this.addData(c);
            return this;
          }
          var d = this.options;
          if (d.filter && !d.filter(t)) return this;
          var g = li(t, d);
          return g
            ? ((g.feature = fi(t)),
              (g.defaultOptions = g.options),
              this.resetStyle(g),
              d.onEachFeature && d.onEachFeature(t, g),
              this.addLayer(g))
            : this;
        },
        resetStyle: function (t) {
          return t === void 0
            ? this.eachLayer(this.resetStyle, this)
            : ((t.options = a({}, t.defaultOptions)),
              this._setLayerStyle(t, this.options.style),
              this);
        },
        setStyle: function (t) {
          return this.eachLayer(function (i) {
            this._setLayerStyle(i, t);
          }, this);
        },
        _setLayerStyle: function (t, i) {
          t.setStyle &&
            (typeof i == "function" && (i = i(t.feature)), t.setStyle(i));
        },
      });
      function li(t, i) {
        var o = t.type === "Feature" ? t.geometry : t,
          u = o ? o.coordinates : null,
          c = [],
          d = i && i.pointToLayer,
          g = (i && i.coordsToLatLng) || Sr,
          y,
          x,
          R,
          H;
        if (!u && !o) return null;
        switch (o.type) {
          case "Point":
            return (y = g(u)), Ss(d, t, y, i);
          case "MultiPoint":
            for (R = 0, H = u.length; R < H; R++)
              (y = g(u[R])), c.push(Ss(d, t, y, i));
            return new de(c);
          case "LineString":
          case "MultiLineString":
            return (
              (x = ci(u, o.type === "LineString" ? 0 : 1, g)), new pe(x, i)
            );
          case "Polygon":
          case "MultiPolygon":
            return (x = ci(u, o.type === "Polygon" ? 1 : 2, g)), new Qe(x, i);
          case "GeometryCollection":
            for (R = 0, H = o.geometries.length; R < H; R++) {
              var Y = li(
                {
                  geometry: o.geometries[R],
                  type: "Feature",
                  properties: t.properties,
                },
                i,
              );
              Y && c.push(Y);
            }
            return new de(c);
          case "FeatureCollection":
            for (R = 0, H = o.features.length; R < H; R++) {
              var ot = li(o.features[R], i);
              ot && c.push(ot);
            }
            return new de(c);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function Ss(t, i, o, u) {
        return t ? t(i, o) : new ai(o, u && u.markersInheritOptions && u);
      }
      function Sr(t) {
        return new q(t[1], t[0], t[2]);
      }
      function ci(t, i, o) {
        for (var u = [], c = 0, d = t.length, g; c < d; c++)
          (g = i ? ci(t[c], i - 1, o) : (o || Sr)(t[c])), u.push(g);
        return u;
      }
      function Pr(t, i) {
        return (
          (t = nt(t)),
          t.alt !== void 0
            ? [w(t.lng, i), w(t.lat, i), w(t.alt, i)]
            : [w(t.lng, i), w(t.lat, i)]
        );
      }
      function hi(t, i, o, u) {
        for (var c = [], d = 0, g = t.length; d < g; d++)
          c.push(i ? hi(t[d], Gt(t[d]) ? 0 : i - 1, o, u) : Pr(t[d], u));
        return !i && o && c.length > 0 && c.push(c[0].slice()), c;
      }
      function tn(t, i) {
        return t.feature ? a({}, t.feature, { geometry: i }) : fi(i);
      }
      function fi(t) {
        return t.type === "Feature" || t.type === "FeatureCollection"
          ? t
          : { type: "Feature", properties: {}, geometry: t };
      }
      var xr = {
        toGeoJSON: function (t) {
          return tn(this, {
            type: "Point",
            coordinates: Pr(this.getLatLng(), t),
          });
        },
      };
      ai.include(xr),
        br.include(xr),
        ui.include(xr),
        pe.include({
          toGeoJSON: function (t) {
            var i = !Gt(this._latlngs),
              o = hi(this._latlngs, i ? 1 : 0, !1, t);
            return tn(this, {
              type: (i ? "Multi" : "") + "LineString",
              coordinates: o,
            });
          },
        }),
        Qe.include({
          toGeoJSON: function (t) {
            var i = !Gt(this._latlngs),
              o = i && !Gt(this._latlngs[0]),
              u = hi(this._latlngs, o ? 2 : i ? 1 : 0, !0, t);
            return (
              i || (u = [u]),
              tn(this, { type: (o ? "Multi" : "") + "Polygon", coordinates: u })
            );
          },
        }),
        Xe.include({
          toMultiPoint: function (t) {
            var i = [];
            return (
              this.eachLayer(function (o) {
                i.push(o.toGeoJSON(t).geometry.coordinates);
              }),
              tn(this, { type: "MultiPoint", coordinates: i })
            );
          },
          toGeoJSON: function (t) {
            var i =
              this.feature &&
              this.feature.geometry &&
              this.feature.geometry.type;
            if (i === "MultiPoint") return this.toMultiPoint(t);
            var o = i === "GeometryCollection",
              u = [];
            return (
              this.eachLayer(function (c) {
                if (c.toGeoJSON) {
                  var d = c.toGeoJSON(t);
                  if (o) u.push(d.geometry);
                  else {
                    var g = fi(d);
                    g.type === "FeatureCollection"
                      ? u.push.apply(u, g.features)
                      : u.push(g);
                  }
                }
              }),
              o
                ? tn(this, { geometries: u, type: "GeometryCollection" })
                : { type: "FeatureCollection", features: u }
            );
          },
        });
      function Ps(t, i) {
        return new _e(t, i);
      }
      var Ql = Ps,
        di = Xt.extend({
          options: {
            opacity: 1,
            alt: "",
            interactive: !1,
            crossOrigin: !1,
            errorOverlayUrl: "",
            zIndex: 1,
            className: "",
          },
          initialize: function (t, i, o) {
            (this._url = t), (this._bounds = E(i)), O(this, o);
          },
          onAdd: function () {
            this._image ||
              (this._initImage(),
              this.options.opacity < 1 && this._updateOpacity()),
              this.options.interactive &&
                (et(this._image, "leaflet-interactive"),
                this.addInteractiveTarget(this._image)),
              this.getPane().appendChild(this._image),
              this._reset();
          },
          onRemove: function () {
            gt(this._image),
              this.options.interactive &&
                this.removeInteractiveTarget(this._image);
          },
          setOpacity: function (t) {
            return (
              (this.options.opacity = t),
              this._image && this._updateOpacity(),
              this
            );
          },
          setStyle: function (t) {
            return t.opacity && this.setOpacity(t.opacity), this;
          },
          bringToFront: function () {
            return this._map && Ye(this._image), this;
          },
          bringToBack: function () {
            return this._map && Ke(this._image), this;
          },
          setUrl: function (t) {
            return (this._url = t), this._image && (this._image.src = t), this;
          },
          setBounds: function (t) {
            return (this._bounds = E(t)), this._map && this._reset(), this;
          },
          getEvents: function () {
            var t = { zoom: this._reset, viewreset: this._reset };
            return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
          },
          setZIndex: function (t) {
            return (this.options.zIndex = t), this._updateZIndex(), this;
          },
          getBounds: function () {
            return this._bounds;
          },
          getElement: function () {
            return this._image;
          },
          _initImage: function () {
            var t = this._url.tagName === "IMG",
              i = (this._image = t ? this._url : lt("img"));
            if (
              (et(i, "leaflet-image-layer"),
              this._zoomAnimated && et(i, "leaflet-zoom-animated"),
              this.options.className && et(i, this.options.className),
              (i.onselectstart = m),
              (i.onmousemove = m),
              (i.onload = h(this.fire, this, "load")),
              (i.onerror = h(this._overlayOnError, this, "error")),
              (this.options.crossOrigin || this.options.crossOrigin === "") &&
                (i.crossOrigin =
                  this.options.crossOrigin === !0
                    ? ""
                    : this.options.crossOrigin),
              this.options.zIndex && this._updateZIndex(),
              t)
            ) {
              this._url = i.src;
              return;
            }
            (i.src = this._url), (i.alt = this.options.alt);
          },
          _animateZoom: function (t) {
            var i = this._map.getZoomScale(t.zoom),
              o = this._map._latLngBoundsToNewLayerBounds(
                this._bounds,
                t.zoom,
                t.center,
              ).min;
            Oe(this._image, o, i);
          },
          _reset: function () {
            var t = this._image,
              i = new ct(
                this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
              ),
              o = i.getSize();
            Tt(t, i.min),
              (t.style.width = o.x + "px"),
              (t.style.height = o.y + "px");
          },
          _updateOpacity: function () {
            qt(this._image, this.options.opacity);
          },
          _updateZIndex: function () {
            this._image &&
              this.options.zIndex !== void 0 &&
              this.options.zIndex !== null &&
              (this._image.style.zIndex = this.options.zIndex);
          },
          _overlayOnError: function () {
            this.fire("error");
            var t = this.options.errorOverlayUrl;
            t && this._url !== t && ((this._url = t), (this._image.src = t));
          },
          getCenter: function () {
            return this._bounds.getCenter();
          },
        }),
        tc = function (t, i, o) {
          return new di(t, i, o);
        },
        xs = di.extend({
          options: {
            autoplay: !0,
            loop: !0,
            keepAspectRatio: !0,
            muted: !1,
            playsInline: !0,
          },
          _initImage: function () {
            var t = this._url.tagName === "VIDEO",
              i = (this._image = t ? this._url : lt("video"));
            if (
              (et(i, "leaflet-image-layer"),
              this._zoomAnimated && et(i, "leaflet-zoom-animated"),
              this.options.className && et(i, this.options.className),
              (i.onselectstart = m),
              (i.onmousemove = m),
              (i.onloadeddata = h(this.fire, this, "load")),
              t)
            ) {
              for (
                var o = i.getElementsByTagName("source"), u = [], c = 0;
                c < o.length;
                c++
              )
                u.push(o[c].src);
              this._url = o.length > 0 ? u : [i.src];
              return;
            }
            C(this._url) || (this._url = [this._url]),
              !this.options.keepAspectRatio &&
                Object.prototype.hasOwnProperty.call(i.style, "objectFit") &&
                (i.style.objectFit = "fill"),
              (i.autoplay = !!this.options.autoplay),
              (i.loop = !!this.options.loop),
              (i.muted = !!this.options.muted),
              (i.playsInline = !!this.options.playsInline);
            for (var d = 0; d < this._url.length; d++) {
              var g = lt("source");
              (g.src = this._url[d]), i.appendChild(g);
            }
          },
        });
      function ec(t, i, o) {
        return new xs(t, i, o);
      }
      var Ls = di.extend({
        _initImage: function () {
          var t = (this._image = this._url);
          et(t, "leaflet-image-layer"),
            this._zoomAnimated && et(t, "leaflet-zoom-animated"),
            this.options.className && et(t, this.options.className),
            (t.onselectstart = m),
            (t.onmousemove = m);
        },
      });
      function nc(t, i, o) {
        return new Ls(t, i, o);
      }
      var oe = Xt.extend({
        options: {
          interactive: !1,
          offset: [0, 0],
          className: "",
          pane: void 0,
          content: "",
        },
        initialize: function (t, i) {
          t && (t instanceof q || C(t))
            ? ((this._latlng = nt(t)), O(this, i))
            : (O(this, t), (this._source = i)),
            this.options.content && (this._content = this.options.content);
        },
        openOn: function (t) {
          return (
            (t = arguments.length ? t : this._source._map),
            t.hasLayer(this) || t.addLayer(this),
            this
          );
        },
        close: function () {
          return this._map && this._map.removeLayer(this), this;
        },
        toggle: function (t) {
          return (
            this._map
              ? this.close()
              : (arguments.length ? (this._source = t) : (t = this._source),
                this._prepareOpen(),
                this.openOn(t._map)),
            this
          );
        },
        onAdd: function (t) {
          (this._zoomAnimated = t._zoomAnimated),
            this._container || this._initLayout(),
            t._fadeAnimated && qt(this._container, 0),
            clearTimeout(this._removeTimeout),
            this.getPane().appendChild(this._container),
            this.update(),
            t._fadeAnimated && qt(this._container, 1),
            this.bringToFront(),
            this.options.interactive &&
              (et(this._container, "leaflet-interactive"),
              this.addInteractiveTarget(this._container));
        },
        onRemove: function (t) {
          t._fadeAnimated
            ? (qt(this._container, 0),
              (this._removeTimeout = setTimeout(
                h(gt, void 0, this._container),
                200,
              )))
            : gt(this._container),
            this.options.interactive &&
              (St(this._container, "leaflet-interactive"),
              this.removeInteractiveTarget(this._container));
        },
        getLatLng: function () {
          return this._latlng;
        },
        setLatLng: function (t) {
          return (
            (this._latlng = nt(t)),
            this._map && (this._updatePosition(), this._adjustPan()),
            this
          );
        },
        getContent: function () {
          return this._content;
        },
        setContent: function (t) {
          return (this._content = t), this.update(), this;
        },
        getElement: function () {
          return this._container;
        },
        update: function () {
          this._map &&
            ((this._container.style.visibility = "hidden"),
            this._updateContent(),
            this._updateLayout(),
            this._updatePosition(),
            (this._container.style.visibility = ""),
            this._adjustPan());
        },
        getEvents: function () {
          var t = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition,
          };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        isOpen: function () {
          return !!this._map && this._map.hasLayer(this);
        },
        bringToFront: function () {
          return this._map && Ye(this._container), this;
        },
        bringToBack: function () {
          return this._map && Ke(this._container), this;
        },
        _prepareOpen: function (t) {
          var i = this._source;
          if (!i._map) return !1;
          if (i instanceof de) {
            i = null;
            var o = this._source._layers;
            for (var u in o)
              if (o[u]._map) {
                i = o[u];
                break;
              }
            if (!i) return !1;
            this._source = i;
          }
          if (!t)
            if (i.getCenter) t = i.getCenter();
            else if (i.getLatLng) t = i.getLatLng();
            else if (i.getBounds) t = i.getBounds().getCenter();
            else throw new Error("Unable to get source layer LatLng.");
          return this.setLatLng(t), this._map && this.update(), !0;
        },
        _updateContent: function () {
          if (this._content) {
            var t = this._contentNode,
              i =
                typeof this._content == "function"
                  ? this._content(this._source || this)
                  : this._content;
            if (typeof i == "string") t.innerHTML = i;
            else {
              for (; t.hasChildNodes(); ) t.removeChild(t.firstChild);
              t.appendChild(i);
            }
            this.fire("contentupdate");
          }
        },
        _updatePosition: function () {
          if (this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng),
              i = W(this.options.offset),
              o = this._getAnchor();
            this._zoomAnimated
              ? Tt(this._container, t.add(o))
              : (i = i.add(t).add(o));
            var u = (this._containerBottom = -i.y),
              c = (this._containerLeft =
                -Math.round(this._containerWidth / 2) + i.x);
            (this._container.style.bottom = u + "px"),
              (this._container.style.left = c + "px");
          }
        },
        _getAnchor: function () {
          return [0, 0];
        },
      });
      at.include({
        _initOverlay: function (t, i, o, u) {
          var c = i;
          return (
            c instanceof t || (c = new t(u).setContent(i)),
            o && c.setLatLng(o),
            c
          );
        },
      }),
        Xt.include({
          _initOverlay: function (t, i, o, u) {
            var c = o;
            return (
              c instanceof t
                ? (O(c, u), (c._source = this))
                : ((c = i && !u ? i : new t(u, this)), c.setContent(o)),
              c
            );
          },
        });
      var pi = oe.extend({
          options: {
            pane: "popupPane",
            offset: [0, 7],
            maxWidth: 300,
            minWidth: 50,
            maxHeight: null,
            autoPan: !0,
            autoPanPaddingTopLeft: null,
            autoPanPaddingBottomRight: null,
            autoPanPadding: [5, 5],
            keepInView: !1,
            closeButton: !0,
            autoClose: !0,
            closeOnEscapeKey: !0,
            className: "",
          },
          openOn: function (t) {
            return (
              (t = arguments.length ? t : this._source._map),
              !t.hasLayer(this) &&
                t._popup &&
                t._popup.options.autoClose &&
                t.removeLayer(t._popup),
              (t._popup = this),
              oe.prototype.openOn.call(this, t)
            );
          },
          onAdd: function (t) {
            oe.prototype.onAdd.call(this, t),
              t.fire("popupopen", { popup: this }),
              this._source &&
                (this._source.fire("popupopen", { popup: this }, !0),
                this._source instanceof ve || this._source.on("preclick", Ie));
          },
          onRemove: function (t) {
            oe.prototype.onRemove.call(this, t),
              t.fire("popupclose", { popup: this }),
              this._source &&
                (this._source.fire("popupclose", { popup: this }, !0),
                this._source instanceof ve || this._source.off("preclick", Ie));
          },
          getEvents: function () {
            var t = oe.prototype.getEvents.call(this);
            return (
              (this.options.closeOnClick !== void 0
                ? this.options.closeOnClick
                : this._map.options.closePopupOnClick) &&
                (t.preclick = this.close),
              this.options.keepInView && (t.moveend = this._adjustPan),
              t
            );
          },
          _initLayout: function () {
            var t = "leaflet-popup",
              i = (this._container = lt(
                "div",
                t +
                  " " +
                  (this.options.className || "") +
                  " leaflet-zoom-animated",
              )),
              o = (this._wrapper = lt("div", t + "-content-wrapper", i));
            if (
              ((this._contentNode = lt("div", t + "-content", o)),
              Mn(i),
              dr(this._contentNode),
              Q(i, "contextmenu", Ie),
              (this._tipContainer = lt("div", t + "-tip-container", i)),
              (this._tip = lt("div", t + "-tip", this._tipContainer)),
              this.options.closeButton)
            ) {
              var u = (this._closeButton = lt("a", t + "-close-button", i));
              u.setAttribute("role", "button"),
                u.setAttribute("aria-label", "Close popup"),
                (u.href = "#close"),
                (u.innerHTML = '<span aria-hidden="true">&#215;</span>'),
                Q(
                  u,
                  "click",
                  function (c) {
                    zt(c), this.close();
                  },
                  this,
                );
            }
          },
          _updateLayout: function () {
            var t = this._contentNode,
              i = t.style;
            (i.width = ""), (i.whiteSpace = "nowrap");
            var o = t.offsetWidth;
            (o = Math.min(o, this.options.maxWidth)),
              (o = Math.max(o, this.options.minWidth)),
              (i.width = o + 1 + "px"),
              (i.whiteSpace = ""),
              (i.height = "");
            var u = t.offsetHeight,
              c = this.options.maxHeight,
              d = "leaflet-popup-scrolled";
            c && u > c ? ((i.height = c + "px"), et(t, d)) : St(t, d),
              (this._containerWidth = this._container.offsetWidth);
          },
          _animateZoom: function (t) {
            var i = this._map._latLngToNewLayerPoint(
                this._latlng,
                t.zoom,
                t.center,
              ),
              o = this._getAnchor();
            Tt(this._container, i.add(o));
          },
          _adjustPan: function () {
            if (this.options.autoPan) {
              if (
                (this._map._panAnim && this._map._panAnim.stop(),
                this._autopanning)
              ) {
                this._autopanning = !1;
                return;
              }
              var t = this._map,
                i = parseInt(En(this._container, "marginBottom"), 10) || 0,
                o = this._container.offsetHeight + i,
                u = this._containerWidth,
                c = new j(this._containerLeft, -o - this._containerBottom);
              c._add(Me(this._container));
              var d = t.layerPointToContainerPoint(c),
                g = W(this.options.autoPanPadding),
                y = W(this.options.autoPanPaddingTopLeft || g),
                x = W(this.options.autoPanPaddingBottomRight || g),
                R = t.getSize(),
                H = 0,
                Y = 0;
              d.x + u + x.x > R.x && (H = d.x + u - R.x + x.x),
                d.x - H - y.x < 0 && (H = d.x - y.x),
                d.y + o + x.y > R.y && (Y = d.y + o - R.y + x.y),
                d.y - Y - y.y < 0 && (Y = d.y - y.y),
                (H || Y) &&
                  (this.options.keepInView && (this._autopanning = !0),
                  t.fire("autopanstart").panBy([H, Y]));
            }
          },
          _getAnchor: function () {
            return W(
              this._source && this._source._getPopupAnchor
                ? this._source._getPopupAnchor()
                : [0, 0],
            );
          },
        }),
        ic = function (t, i) {
          return new pi(t, i);
        };
      at.mergeOptions({ closePopupOnClick: !0 }),
        at.include({
          openPopup: function (t, i, o) {
            return this._initOverlay(pi, t, i, o).openOn(this), this;
          },
          closePopup: function (t) {
            return (
              (t = arguments.length ? t : this._popup), t && t.close(), this
            );
          },
        }),
        Xt.include({
          bindPopup: function (t, i) {
            return (
              (this._popup = this._initOverlay(pi, this._popup, t, i)),
              this._popupHandlersAdded ||
                (this.on({
                  click: this._openPopup,
                  keypress: this._onKeyPress,
                  remove: this.closePopup,
                  move: this._movePopup,
                }),
                (this._popupHandlersAdded = !0)),
              this
            );
          },
          unbindPopup: function () {
            return (
              this._popup &&
                (this.off({
                  click: this._openPopup,
                  keypress: this._onKeyPress,
                  remove: this.closePopup,
                  move: this._movePopup,
                }),
                (this._popupHandlersAdded = !1),
                (this._popup = null)),
              this
            );
          },
          openPopup: function (t) {
            return (
              this._popup &&
                (this instanceof de || (this._popup._source = this),
                this._popup._prepareOpen(t || this._latlng) &&
                  this._popup.openOn(this._map)),
              this
            );
          },
          closePopup: function () {
            return this._popup && this._popup.close(), this;
          },
          togglePopup: function () {
            return this._popup && this._popup.toggle(this), this;
          },
          isPopupOpen: function () {
            return this._popup ? this._popup.isOpen() : !1;
          },
          setPopupContent: function (t) {
            return this._popup && this._popup.setContent(t), this;
          },
          getPopup: function () {
            return this._popup;
          },
          _openPopup: function (t) {
            if (!(!this._popup || !this._map)) {
              ze(t);
              var i = t.layer || t.target;
              if (this._popup._source === i && !(i instanceof ve)) {
                this._map.hasLayer(this._popup)
                  ? this.closePopup()
                  : this.openPopup(t.latlng);
                return;
              }
              (this._popup._source = i), this.openPopup(t.latlng);
            }
          },
          _movePopup: function (t) {
            this._popup.setLatLng(t.latlng);
          },
          _onKeyPress: function (t) {
            t.originalEvent.keyCode === 13 && this._openPopup(t);
          },
        });
      var _i = oe.extend({
          options: {
            pane: "tooltipPane",
            offset: [0, 0],
            direction: "auto",
            permanent: !1,
            sticky: !1,
            opacity: 0.9,
          },
          onAdd: function (t) {
            oe.prototype.onAdd.call(this, t),
              this.setOpacity(this.options.opacity),
              t.fire("tooltipopen", { tooltip: this }),
              this._source &&
                (this.addEventParent(this._source),
                this._source.fire("tooltipopen", { tooltip: this }, !0));
          },
          onRemove: function (t) {
            oe.prototype.onRemove.call(this, t),
              t.fire("tooltipclose", { tooltip: this }),
              this._source &&
                (this.removeEventParent(this._source),
                this._source.fire("tooltipclose", { tooltip: this }, !0));
          },
          getEvents: function () {
            var t = oe.prototype.getEvents.call(this);
            return this.options.permanent || (t.preclick = this.close), t;
          },
          _initLayout: function () {
            var t = "leaflet-tooltip",
              i =
                t +
                " " +
                (this.options.className || "") +
                " leaflet-zoom-" +
                (this._zoomAnimated ? "animated" : "hide");
            (this._contentNode = this._container = lt("div", i)),
              this._container.setAttribute("role", "tooltip"),
              this._container.setAttribute("id", "leaflet-tooltip-" + p(this));
          },
          _updateLayout: function () {},
          _adjustPan: function () {},
          _setPosition: function (t) {
            var i,
              o,
              u = this._map,
              c = this._container,
              d = u.latLngToContainerPoint(u.getCenter()),
              g = u.layerPointToContainerPoint(t),
              y = this.options.direction,
              x = c.offsetWidth,
              R = c.offsetHeight,
              H = W(this.options.offset),
              Y = this._getAnchor();
            y === "top"
              ? ((i = x / 2), (o = R))
              : y === "bottom"
                ? ((i = x / 2), (o = 0))
                : y === "center"
                  ? ((i = x / 2), (o = R / 2))
                  : y === "right"
                    ? ((i = 0), (o = R / 2))
                    : y === "left"
                      ? ((i = x), (o = R / 2))
                      : g.x < d.x
                        ? ((y = "right"), (i = 0), (o = R / 2))
                        : ((y = "left"),
                          (i = x + (H.x + Y.x) * 2),
                          (o = R / 2)),
              (t = t
                .subtract(W(i, o, !0))
                .add(H)
                .add(Y)),
              St(c, "leaflet-tooltip-right"),
              St(c, "leaflet-tooltip-left"),
              St(c, "leaflet-tooltip-top"),
              St(c, "leaflet-tooltip-bottom"),
              et(c, "leaflet-tooltip-" + y),
              Tt(c, t);
          },
          _updatePosition: function () {
            var t = this._map.latLngToLayerPoint(this._latlng);
            this._setPosition(t);
          },
          setOpacity: function (t) {
            (this.options.opacity = t),
              this._container && qt(this._container, t);
          },
          _animateZoom: function (t) {
            var i = this._map._latLngToNewLayerPoint(
              this._latlng,
              t.zoom,
              t.center,
            );
            this._setPosition(i);
          },
          _getAnchor: function () {
            return W(
              this._source &&
                this._source._getTooltipAnchor &&
                !this.options.sticky
                ? this._source._getTooltipAnchor()
                : [0, 0],
            );
          },
        }),
        rc = function (t, i) {
          return new _i(t, i);
        };
      at.include({
        openTooltip: function (t, i, o) {
          return this._initOverlay(_i, t, i, o).openOn(this), this;
        },
        closeTooltip: function (t) {
          return t.close(), this;
        },
      }),
        Xt.include({
          bindTooltip: function (t, i) {
            return (
              this._tooltip && this.isTooltipOpen() && this.unbindTooltip(),
              (this._tooltip = this._initOverlay(_i, this._tooltip, t, i)),
              this._initTooltipInteractions(),
              this._tooltip.options.permanent &&
                this._map &&
                this._map.hasLayer(this) &&
                this.openTooltip(),
              this
            );
          },
          unbindTooltip: function () {
            return (
              this._tooltip &&
                (this._initTooltipInteractions(!0),
                this.closeTooltip(),
                (this._tooltip = null)),
              this
            );
          },
          _initTooltipInteractions: function (t) {
            if (!(!t && this._tooltipHandlersAdded)) {
              var i = t ? "off" : "on",
                o = { remove: this.closeTooltip, move: this._moveTooltip };
              this._tooltip.options.permanent
                ? (o.add = this._openTooltip)
                : ((o.mouseover = this._openTooltip),
                  (o.mouseout = this.closeTooltip),
                  (o.click = this._openTooltip),
                  this._map
                    ? this._addFocusListeners()
                    : (o.add = this._addFocusListeners)),
                this._tooltip.options.sticky &&
                  (o.mousemove = this._moveTooltip),
                this[i](o),
                (this._tooltipHandlersAdded = !t);
            }
          },
          openTooltip: function (t) {
            return (
              this._tooltip &&
                (this instanceof de || (this._tooltip._source = this),
                this._tooltip._prepareOpen(t) &&
                  (this._tooltip.openOn(this._map),
                  this.getElement
                    ? this._setAriaDescribedByOnLayer(this)
                    : this.eachLayer &&
                      this.eachLayer(this._setAriaDescribedByOnLayer, this))),
              this
            );
          },
          closeTooltip: function () {
            if (this._tooltip) return this._tooltip.close();
          },
          toggleTooltip: function () {
            return this._tooltip && this._tooltip.toggle(this), this;
          },
          isTooltipOpen: function () {
            return this._tooltip.isOpen();
          },
          setTooltipContent: function (t) {
            return this._tooltip && this._tooltip.setContent(t), this;
          },
          getTooltip: function () {
            return this._tooltip;
          },
          _addFocusListeners: function () {
            this.getElement
              ? this._addFocusListenersOnLayer(this)
              : this.eachLayer &&
                this.eachLayer(this._addFocusListenersOnLayer, this);
          },
          _addFocusListenersOnLayer: function (t) {
            var i = typeof t.getElement == "function" && t.getElement();
            i &&
              (Q(
                i,
                "focus",
                function () {
                  (this._tooltip._source = t), this.openTooltip();
                },
                this,
              ),
              Q(i, "blur", this.closeTooltip, this));
          },
          _setAriaDescribedByOnLayer: function (t) {
            var i = typeof t.getElement == "function" && t.getElement();
            i &&
              i.setAttribute("aria-describedby", this._tooltip._container.id);
          },
          _openTooltip: function (t) {
            if (!(!this._tooltip || !this._map)) {
              if (
                this._map.dragging &&
                this._map.dragging.moving() &&
                !this._openOnceFlag
              ) {
                this._openOnceFlag = !0;
                var i = this;
                this._map.once("moveend", function () {
                  (i._openOnceFlag = !1), i._openTooltip(t);
                });
                return;
              }
              (this._tooltip._source = t.layer || t.target),
                this.openTooltip(
                  this._tooltip.options.sticky ? t.latlng : void 0,
                );
            }
          },
          _moveTooltip: function (t) {
            var i = t.latlng,
              o,
              u;
            this._tooltip.options.sticky &&
              t.originalEvent &&
              ((o = this._map.mouseEventToContainerPoint(t.originalEvent)),
              (u = this._map.containerPointToLayerPoint(o)),
              (i = this._map.layerPointToLatLng(u))),
              this._tooltip.setLatLng(i);
          },
        });
      var Ts = Je.extend({
        options: {
          iconSize: [12, 12],
          html: !1,
          bgPos: null,
          className: "leaflet-div-icon",
        },
        createIcon: function (t) {
          var i = t && t.tagName === "DIV" ? t : document.createElement("div"),
            o = this.options;
          if (
            (o.html instanceof Element
              ? (ei(i), i.appendChild(o.html))
              : (i.innerHTML = o.html !== !1 ? o.html : ""),
            o.bgPos)
          ) {
            var u = W(o.bgPos);
            i.style.backgroundPosition = -u.x + "px " + -u.y + "px";
          }
          return this._setIconStyles(i, "icon"), i;
        },
        createShadow: function () {
          return null;
        },
      });
      function oc(t) {
        return new Ts(t);
      }
      Je.Default = Rn;
      var An = Xt.extend({
        options: {
          tileSize: 256,
          opacity: 1,
          updateWhenIdle: G.mobile,
          updateWhenZooming: !0,
          updateInterval: 200,
          zIndex: 1,
          bounds: null,
          minZoom: 0,
          maxZoom: void 0,
          maxNativeZoom: void 0,
          minNativeZoom: void 0,
          noWrap: !1,
          pane: "tilePane",
          className: "",
          keepBuffer: 2,
        },
        initialize: function (t) {
          O(this, t);
        },
        onAdd: function () {
          this._initContainer(),
            (this._levels = {}),
            (this._tiles = {}),
            this._resetView();
        },
        beforeAdd: function (t) {
          t._addZoomLimit(this);
        },
        onRemove: function (t) {
          this._removeAllTiles(),
            gt(this._container),
            t._removeZoomLimit(this),
            (this._container = null),
            (this._tileZoom = void 0);
        },
        bringToFront: function () {
          return (
            this._map && (Ye(this._container), this._setAutoZIndex(Math.max)),
            this
          );
        },
        bringToBack: function () {
          return (
            this._map && (Ke(this._container), this._setAutoZIndex(Math.min)),
            this
          );
        },
        getContainer: function () {
          return this._container;
        },
        setOpacity: function (t) {
          return (this.options.opacity = t), this._updateOpacity(), this;
        },
        setZIndex: function (t) {
          return (this.options.zIndex = t), this._updateZIndex(), this;
        },
        isLoading: function () {
          return this._loading;
        },
        redraw: function () {
          if (this._map) {
            this._removeAllTiles();
            var t = this._clampZoom(this._map.getZoom());
            t !== this._tileZoom &&
              ((this._tileZoom = t), this._updateLevels()),
              this._update();
          }
          return this;
        },
        getEvents: function () {
          var t = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd,
          };
          return (
            this.options.updateWhenIdle ||
              (this._onMove ||
                (this._onMove = _(
                  this._onMoveEnd,
                  this.options.updateInterval,
                  this,
                )),
              (t.move = this._onMove)),
            this._zoomAnimated && (t.zoomanim = this._animateZoom),
            t
          );
        },
        createTile: function () {
          return document.createElement("div");
        },
        getTileSize: function () {
          var t = this.options.tileSize;
          return t instanceof j ? t : new j(t, t);
        },
        _updateZIndex: function () {
          this._container &&
            this.options.zIndex !== void 0 &&
            this.options.zIndex !== null &&
            (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function (t) {
          for (
            var i = this.getPane().children,
              o = -t(-1 / 0, 1 / 0),
              u = 0,
              c = i.length,
              d;
            u < c;
            u++
          )
            (d = i[u].style.zIndex),
              i[u] !== this._container && d && (o = t(o, +d));
          isFinite(o) &&
            ((this.options.zIndex = o + t(-1, 1)), this._updateZIndex());
        },
        _updateOpacity: function () {
          if (this._map && !G.ielt9) {
            qt(this._container, this.options.opacity);
            var t = +new Date(),
              i = !1,
              o = !1;
            for (var u in this._tiles) {
              var c = this._tiles[u];
              if (!(!c.current || !c.loaded)) {
                var d = Math.min(1, (t - c.loaded) / 200);
                qt(c.el, d),
                  d < 1
                    ? (i = !0)
                    : (c.active ? (o = !0) : this._onOpaqueTile(c),
                      (c.active = !0));
              }
            }
            o && !this._noPrune && this._pruneTiles(),
              i &&
                (J(this._fadeFrame),
                (this._fadeFrame = tt(this._updateOpacity, this)));
          }
        },
        _onOpaqueTile: m,
        _initContainer: function () {
          this._container ||
            ((this._container = lt(
              "div",
              "leaflet-layer " + (this.options.className || ""),
            )),
            this._updateZIndex(),
            this.options.opacity < 1 && this._updateOpacity(),
            this.getPane().appendChild(this._container));
        },
        _updateLevels: function () {
          var t = this._tileZoom,
            i = this.options.maxZoom;
          if (t !== void 0) {
            for (var o in this._levels)
              (o = Number(o)),
                this._levels[o].el.children.length || o === t
                  ? ((this._levels[o].el.style.zIndex = i - Math.abs(t - o)),
                    this._onUpdateLevel(o))
                  : (gt(this._levels[o].el),
                    this._removeTilesAtZoom(o),
                    this._onRemoveLevel(o),
                    delete this._levels[o]);
            var u = this._levels[t],
              c = this._map;
            return (
              u ||
                ((u = this._levels[t] = {}),
                (u.el = lt(
                  "div",
                  "leaflet-tile-container leaflet-zoom-animated",
                  this._container,
                )),
                (u.el.style.zIndex = i),
                (u.origin = c
                  .project(c.unproject(c.getPixelOrigin()), t)
                  .round()),
                (u.zoom = t),
                this._setZoomTransform(u, c.getCenter(), c.getZoom()),
                m(u.el.offsetWidth),
                this._onCreateLevel(u)),
              (this._level = u),
              u
            );
          }
        },
        _onUpdateLevel: m,
        _onRemoveLevel: m,
        _onCreateLevel: m,
        _pruneTiles: function () {
          if (this._map) {
            var t,
              i,
              o = this._map.getZoom();
            if (o > this.options.maxZoom || o < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (t in this._tiles) (i = this._tiles[t]), (i.retain = i.current);
            for (t in this._tiles)
              if (((i = this._tiles[t]), i.current && !i.active)) {
                var u = i.coords;
                this._retainParent(u.x, u.y, u.z, u.z - 5) ||
                  this._retainChildren(u.x, u.y, u.z, u.z + 2);
              }
            for (t in this._tiles) this._tiles[t].retain || this._removeTile(t);
          }
        },
        _removeTilesAtZoom: function (t) {
          for (var i in this._tiles)
            this._tiles[i].coords.z === t && this._removeTile(i);
        },
        _removeAllTiles: function () {
          for (var t in this._tiles) this._removeTile(t);
        },
        _invalidateAll: function () {
          for (var t in this._levels)
            gt(this._levels[t].el),
              this._onRemoveLevel(Number(t)),
              delete this._levels[t];
          this._removeAllTiles(), (this._tileZoom = void 0);
        },
        _retainParent: function (t, i, o, u) {
          var c = Math.floor(t / 2),
            d = Math.floor(i / 2),
            g = o - 1,
            y = new j(+c, +d);
          y.z = +g;
          var x = this._tileCoordsToKey(y),
            R = this._tiles[x];
          return R && R.active
            ? ((R.retain = !0), !0)
            : (R && R.loaded && (R.retain = !0),
              g > u ? this._retainParent(c, d, g, u) : !1);
        },
        _retainChildren: function (t, i, o, u) {
          for (var c = 2 * t; c < 2 * t + 2; c++)
            for (var d = 2 * i; d < 2 * i + 2; d++) {
              var g = new j(c, d);
              g.z = o + 1;
              var y = this._tileCoordsToKey(g),
                x = this._tiles[y];
              if (x && x.active) {
                x.retain = !0;
                continue;
              } else x && x.loaded && (x.retain = !0);
              o + 1 < u && this._retainChildren(c, d, o + 1, u);
            }
        },
        _resetView: function (t) {
          var i = t && (t.pinch || t.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), i, i);
        },
        _animateZoom: function (t) {
          this._setView(t.center, t.zoom, !0, t.noUpdate);
        },
        _clampZoom: function (t) {
          var i = this.options;
          return i.minNativeZoom !== void 0 && t < i.minNativeZoom
            ? i.minNativeZoom
            : i.maxNativeZoom !== void 0 && i.maxNativeZoom < t
              ? i.maxNativeZoom
              : t;
        },
        _setView: function (t, i, o, u) {
          var c = Math.round(i);
          (this.options.maxZoom !== void 0 && c > this.options.maxZoom) ||
          (this.options.minZoom !== void 0 && c < this.options.minZoom)
            ? (c = void 0)
            : (c = this._clampZoom(c));
          var d = this.options.updateWhenZooming && c !== this._tileZoom;
          (!u || d) &&
            ((this._tileZoom = c),
            this._abortLoading && this._abortLoading(),
            this._updateLevels(),
            this._resetGrid(),
            c !== void 0 && this._update(t),
            o || this._pruneTiles(),
            (this._noPrune = !!o)),
            this._setZoomTransforms(t, i);
        },
        _setZoomTransforms: function (t, i) {
          for (var o in this._levels)
            this._setZoomTransform(this._levels[o], t, i);
        },
        _setZoomTransform: function (t, i, o) {
          var u = this._map.getZoomScale(o, t.zoom),
            c = t.origin
              .multiplyBy(u)
              .subtract(this._map._getNewPixelOrigin(i, o))
              .round();
          G.any3d ? Oe(t.el, c, u) : Tt(t.el, c);
        },
        _resetGrid: function () {
          var t = this._map,
            i = t.options.crs,
            o = (this._tileSize = this.getTileSize()),
            u = this._tileZoom,
            c = this._map.getPixelWorldBounds(this._tileZoom);
          c && (this._globalTileRange = this._pxBoundsToTileRange(c)),
            (this._wrapX = i.wrapLng &&
              !this.options.noWrap && [
                Math.floor(t.project([0, i.wrapLng[0]], u).x / o.x),
                Math.ceil(t.project([0, i.wrapLng[1]], u).x / o.y),
              ]),
            (this._wrapY = i.wrapLat &&
              !this.options.noWrap && [
                Math.floor(t.project([i.wrapLat[0], 0], u).y / o.x),
                Math.ceil(t.project([i.wrapLat[1], 0], u).y / o.y),
              ]);
        },
        _onMoveEnd: function () {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function (t) {
          var i = this._map,
            o = i._animatingZoom
              ? Math.max(i._animateToZoom, i.getZoom())
              : i.getZoom(),
            u = i.getZoomScale(o, this._tileZoom),
            c = i.project(t, this._tileZoom).floor(),
            d = i.getSize().divideBy(u * 2);
          return new ct(c.subtract(d), c.add(d));
        },
        _update: function (t) {
          var i = this._map;
          if (i) {
            var o = this._clampZoom(i.getZoom());
            if (
              (t === void 0 && (t = i.getCenter()), this._tileZoom !== void 0)
            ) {
              var u = this._getTiledPixelBounds(t),
                c = this._pxBoundsToTileRange(u),
                d = c.getCenter(),
                g = [],
                y = this.options.keepBuffer,
                x = new ct(
                  c.getBottomLeft().subtract([y, -y]),
                  c.getTopRight().add([y, -y]),
                );
              if (
                !(
                  isFinite(c.min.x) &&
                  isFinite(c.min.y) &&
                  isFinite(c.max.x) &&
                  isFinite(c.max.y)
                )
              )
                throw new Error(
                  "Attempted to load an infinite number of tiles",
                );
              for (var R in this._tiles) {
                var H = this._tiles[R].coords;
                (H.z !== this._tileZoom || !x.contains(new j(H.x, H.y))) &&
                  (this._tiles[R].current = !1);
              }
              if (Math.abs(o - this._tileZoom) > 1) {
                this._setView(t, o);
                return;
              }
              for (var Y = c.min.y; Y <= c.max.y; Y++)
                for (var ot = c.min.x; ot <= c.max.x; ot++) {
                  var Nt = new j(ot, Y);
                  if (((Nt.z = this._tileZoom), !!this._isValidTile(Nt))) {
                    var It = this._tiles[this._tileCoordsToKey(Nt)];
                    It ? (It.current = !0) : g.push(Nt);
                  }
                }
              if (
                (g.sort(function (Ut, nn) {
                  return Ut.distanceTo(d) - nn.distanceTo(d);
                }),
                g.length !== 0)
              ) {
                this._loading || ((this._loading = !0), this.fire("loading"));
                var Vt = document.createDocumentFragment();
                for (ot = 0; ot < g.length; ot++) this._addTile(g[ot], Vt);
                this._level.el.appendChild(Vt);
              }
            }
          }
        },
        _isValidTile: function (t) {
          var i = this._map.options.crs;
          if (!i.infinite) {
            var o = this._globalTileRange;
            if (
              (!i.wrapLng && (t.x < o.min.x || t.x > o.max.x)) ||
              (!i.wrapLat && (t.y < o.min.y || t.y > o.max.y))
            )
              return !1;
          }
          if (!this.options.bounds) return !0;
          var u = this._tileCoordsToBounds(t);
          return E(this.options.bounds).overlaps(u);
        },
        _keyToBounds: function (t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function (t) {
          var i = this._map,
            o = this.getTileSize(),
            u = t.scaleBy(o),
            c = u.add(o),
            d = i.unproject(u, t.z),
            g = i.unproject(c, t.z);
          return [d, g];
        },
        _tileCoordsToBounds: function (t) {
          var i = this._tileCoordsToNwSe(t),
            o = new X(i[0], i[1]);
          return this.options.noWrap || (o = this._map.wrapLatLngBounds(o)), o;
        },
        _tileCoordsToKey: function (t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        _keyToTileCoords: function (t) {
          var i = t.split(":"),
            o = new j(+i[0], +i[1]);
          return (o.z = +i[2]), o;
        },
        _removeTile: function (t) {
          var i = this._tiles[t];
          i &&
            (gt(i.el),
            delete this._tiles[t],
            this.fire("tileunload", {
              tile: i.el,
              coords: this._keyToTileCoords(t),
            }));
        },
        _initTile: function (t) {
          et(t, "leaflet-tile");
          var i = this.getTileSize();
          (t.style.width = i.x + "px"),
            (t.style.height = i.y + "px"),
            (t.onselectstart = m),
            (t.onmousemove = m),
            G.ielt9 && this.options.opacity < 1 && qt(t, this.options.opacity);
        },
        _addTile: function (t, i) {
          var o = this._getTilePos(t),
            u = this._tileCoordsToKey(t),
            c = this.createTile(
              this._wrapCoords(t),
              h(this._tileReady, this, t),
            );
          this._initTile(c),
            this.createTile.length < 2 &&
              tt(h(this._tileReady, this, t, null, c)),
            Tt(c, o),
            (this._tiles[u] = { el: c, coords: t, current: !0 }),
            i.appendChild(c),
            this.fire("tileloadstart", { tile: c, coords: t });
        },
        _tileReady: function (t, i, o) {
          i && this.fire("tileerror", { error: i, tile: o, coords: t });
          var u = this._tileCoordsToKey(t);
          (o = this._tiles[u]),
            o &&
              ((o.loaded = +new Date()),
              this._map._fadeAnimated
                ? (qt(o.el, 0),
                  J(this._fadeFrame),
                  (this._fadeFrame = tt(this._updateOpacity, this)))
                : ((o.active = !0), this._pruneTiles()),
              i ||
                (et(o.el, "leaflet-tile-loaded"),
                this.fire("tileload", { tile: o.el, coords: t })),
              this._noTilesToLoad() &&
                ((this._loading = !1),
                this.fire("load"),
                G.ielt9 || !this._map._fadeAnimated
                  ? tt(this._pruneTiles, this)
                  : setTimeout(h(this._pruneTiles, this), 250)));
        },
        _getTilePos: function (t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function (t) {
          var i = new j(
            this._wrapX ? v(t.x, this._wrapX) : t.x,
            this._wrapY ? v(t.y, this._wrapY) : t.y,
          );
          return (i.z = t.z), i;
        },
        _pxBoundsToTileRange: function (t) {
          var i = this.getTileSize();
          return new ct(
            t.min.unscaleBy(i).floor(),
            t.max.unscaleBy(i).ceil().subtract([1, 1]),
          );
        },
        _noTilesToLoad: function () {
          for (var t in this._tiles) if (!this._tiles[t].loaded) return !1;
          return !0;
        },
      });
      function sc(t) {
        return new An(t);
      }
      var en = An.extend({
        options: {
          minZoom: 0,
          maxZoom: 18,
          subdomains: "abc",
          errorTileUrl: "",
          zoomOffset: 0,
          tms: !1,
          zoomReverse: !1,
          detectRetina: !1,
          crossOrigin: !1,
          referrerPolicy: !1,
        },
        initialize: function (t, i) {
          (this._url = t),
            (i = O(this, i)),
            i.detectRetina && G.retina && i.maxZoom > 0
              ? ((i.tileSize = Math.floor(i.tileSize / 2)),
                i.zoomReverse
                  ? (i.zoomOffset--,
                    (i.minZoom = Math.min(i.maxZoom, i.minZoom + 1)))
                  : (i.zoomOffset++,
                    (i.maxZoom = Math.max(i.minZoom, i.maxZoom - 1))),
                (i.minZoom = Math.max(0, i.minZoom)))
              : i.zoomReverse
                ? (i.minZoom = Math.min(i.maxZoom, i.minZoom))
                : (i.maxZoom = Math.max(i.minZoom, i.maxZoom)),
            typeof i.subdomains == "string" &&
              (i.subdomains = i.subdomains.split("")),
            this.on("tileunload", this._onTileRemove);
        },
        setUrl: function (t, i) {
          return (
            this._url === t && i === void 0 && (i = !0),
            (this._url = t),
            i || this.redraw(),
            this
          );
        },
        createTile: function (t, i) {
          var o = document.createElement("img");
          return (
            Q(o, "load", h(this._tileOnLoad, this, i, o)),
            Q(o, "error", h(this._tileOnError, this, i, o)),
            (this.options.crossOrigin || this.options.crossOrigin === "") &&
              (o.crossOrigin =
                this.options.crossOrigin === !0
                  ? ""
                  : this.options.crossOrigin),
            typeof this.options.referrerPolicy == "string" &&
              (o.referrerPolicy = this.options.referrerPolicy),
            (o.alt = ""),
            (o.src = this.getTileUrl(t)),
            o
          );
        },
        getTileUrl: function (t) {
          var i = {
            r: G.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl(),
          };
          if (this._map && !this._map.options.crs.infinite) {
            var o = this._globalTileRange.max.y - t.y;
            this.options.tms && (i.y = o), (i["-y"] = o);
          }
          return M(this._url, a(i, this.options));
        },
        _tileOnLoad: function (t, i) {
          G.ielt9 ? setTimeout(h(t, this, null, i), 0) : t(null, i);
        },
        _tileOnError: function (t, i, o) {
          var u = this.options.errorTileUrl;
          u && i.getAttribute("src") !== u && (i.src = u), t(o, i);
        },
        _onTileRemove: function (t) {
          t.tile.onload = null;
        },
        _getZoomForUrl: function () {
          var t = this._tileZoom,
            i = this.options.maxZoom,
            o = this.options.zoomReverse,
            u = this.options.zoomOffset;
          return o && (t = i - t), t + u;
        },
        _getSubdomain: function (t) {
          var i = Math.abs(t.x + t.y) % this.options.subdomains.length;
          return this.options.subdomains[i];
        },
        _abortLoading: function () {
          var t, i;
          for (t in this._tiles)
            if (
              this._tiles[t].coords.z !== this._tileZoom &&
              ((i = this._tiles[t].el),
              (i.onload = m),
              (i.onerror = m),
              !i.complete)
            ) {
              i.src = B;
              var o = this._tiles[t].coords;
              gt(i),
                delete this._tiles[t],
                this.fire("tileabort", { tile: i, coords: o });
            }
        },
        _removeTile: function (t) {
          var i = this._tiles[t];
          if (i)
            return (
              i.el.setAttribute("src", B),
              An.prototype._removeTile.call(this, t)
            );
        },
        _tileReady: function (t, i, o) {
          if (!(!this._map || (o && o.getAttribute("src") === B)))
            return An.prototype._tileReady.call(this, t, i, o);
        },
      });
      function Es(t, i) {
        return new en(t, i);
      }
      var ks = en.extend({
        defaultWmsParams: {
          service: "WMS",
          request: "GetMap",
          layers: "",
          styles: "",
          format: "image/jpeg",
          transparent: !1,
          version: "1.1.1",
        },
        options: { crs: null, uppercase: !1 },
        initialize: function (t, i) {
          this._url = t;
          var o = a({}, this.defaultWmsParams);
          for (var u in i) u in this.options || (o[u] = i[u]);
          i = O(this, i);
          var c = i.detectRetina && G.retina ? 2 : 1,
            d = this.getTileSize();
          (o.width = d.x * c), (o.height = d.y * c), (this.wmsParams = o);
        },
        onAdd: function (t) {
          (this._crs = this.options.crs || t.options.crs),
            (this._wmsVersion = parseFloat(this.wmsParams.version));
          var i = this._wmsVersion >= 1.3 ? "crs" : "srs";
          (this.wmsParams[i] = this._crs.code),
            en.prototype.onAdd.call(this, t);
        },
        getTileUrl: function (t) {
          var i = this._tileCoordsToNwSe(t),
            o = this._crs,
            u = A(o.project(i[0]), o.project(i[1])),
            c = u.min,
            d = u.max,
            g = (
              this._wmsVersion >= 1.3 && this._crs === ws
                ? [c.y, c.x, d.y, d.x]
                : [c.x, c.y, d.x, d.y]
            ).join(","),
            y = en.prototype.getTileUrl.call(this, t);
          return (
            y +
            I(this.wmsParams, y, this.options.uppercase) +
            (this.options.uppercase ? "&BBOX=" : "&bbox=") +
            g
          );
        },
        setParams: function (t, i) {
          return a(this.wmsParams, t), i || this.redraw(), this;
        },
      });
      function ac(t, i) {
        return new ks(t, i);
      }
      (en.WMS = ks), (Es.wms = ac);
      var me = Xt.extend({
          options: { padding: 0.1 },
          initialize: function (t) {
            O(this, t), p(this), (this._layers = this._layers || {});
          },
          onAdd: function () {
            this._container ||
              (this._initContainer(),
              et(this._container, "leaflet-zoom-animated")),
              this.getPane().appendChild(this._container),
              this._update(),
              this.on("update", this._updatePaths, this);
          },
          onRemove: function () {
            this.off("update", this._updatePaths, this),
              this._destroyContainer();
          },
          getEvents: function () {
            var t = {
              viewreset: this._reset,
              zoom: this._onZoom,
              moveend: this._update,
              zoomend: this._onZoomEnd,
            };
            return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
          },
          _onAnimZoom: function (t) {
            this._updateTransform(t.center, t.zoom);
          },
          _onZoom: function () {
            this._updateTransform(this._map.getCenter(), this._map.getZoom());
          },
          _updateTransform: function (t, i) {
            var o = this._map.getZoomScale(i, this._zoom),
              u = this._map.getSize().multiplyBy(0.5 + this.options.padding),
              c = this._map.project(this._center, i),
              d = u
                .multiplyBy(-o)
                .add(c)
                .subtract(this._map._getNewPixelOrigin(t, i));
            G.any3d ? Oe(this._container, d, o) : Tt(this._container, d);
          },
          _reset: function () {
            this._update(), this._updateTransform(this._center, this._zoom);
            for (var t in this._layers) this._layers[t]._reset();
          },
          _onZoomEnd: function () {
            for (var t in this._layers) this._layers[t]._project();
          },
          _updatePaths: function () {
            for (var t in this._layers) this._layers[t]._update();
          },
          _update: function () {
            var t = this.options.padding,
              i = this._map.getSize(),
              o = this._map
                .containerPointToLayerPoint(i.multiplyBy(-t))
                .round();
            (this._bounds = new ct(o, o.add(i.multiplyBy(1 + t * 2)).round())),
              (this._center = this._map.getCenter()),
              (this._zoom = this._map.getZoom());
          },
        }),
        Cs = me.extend({
          options: { tolerance: 0 },
          getEvents: function () {
            var t = me.prototype.getEvents.call(this);
            return (t.viewprereset = this._onViewPreReset), t;
          },
          _onViewPreReset: function () {
            this._postponeUpdatePaths = !0;
          },
          onAdd: function () {
            me.prototype.onAdd.call(this), this._draw();
          },
          _initContainer: function () {
            var t = (this._container = document.createElement("canvas"));
            Q(t, "mousemove", this._onMouseMove, this),
              Q(
                t,
                "click dblclick mousedown mouseup contextmenu",
                this._onClick,
                this,
              ),
              Q(t, "mouseout", this._handleMouseOut, this),
              (t._leaflet_disable_events = !0),
              (this._ctx = t.getContext("2d"));
          },
          _destroyContainer: function () {
            J(this._redrawRequest),
              delete this._ctx,
              gt(this._container),
              dt(this._container),
              delete this._container;
          },
          _updatePaths: function () {
            if (!this._postponeUpdatePaths) {
              var t;
              this._redrawBounds = null;
              for (var i in this._layers) (t = this._layers[i]), t._update();
              this._redraw();
            }
          },
          _update: function () {
            if (!(this._map._animatingZoom && this._bounds)) {
              me.prototype._update.call(this);
              var t = this._bounds,
                i = this._container,
                o = t.getSize(),
                u = G.retina ? 2 : 1;
              Tt(i, t.min),
                (i.width = u * o.x),
                (i.height = u * o.y),
                (i.style.width = o.x + "px"),
                (i.style.height = o.y + "px"),
                G.retina && this._ctx.scale(2, 2),
                this._ctx.translate(-t.min.x, -t.min.y),
                this.fire("update");
            }
          },
          _reset: function () {
            me.prototype._reset.call(this),
              this._postponeUpdatePaths &&
                ((this._postponeUpdatePaths = !1), this._updatePaths());
          },
          _initPath: function (t) {
            this._updateDashArray(t), (this._layers[p(t)] = t);
            var i = (t._order = { layer: t, prev: this._drawLast, next: null });
            this._drawLast && (this._drawLast.next = i),
              (this._drawLast = i),
              (this._drawFirst = this._drawFirst || this._drawLast);
          },
          _addPath: function (t) {
            this._requestRedraw(t);
          },
          _removePath: function (t) {
            var i = t._order,
              o = i.next,
              u = i.prev;
            o ? (o.prev = u) : (this._drawLast = u),
              u ? (u.next = o) : (this._drawFirst = o),
              delete t._order,
              delete this._layers[p(t)],
              this._requestRedraw(t);
          },
          _updatePath: function (t) {
            this._extendRedrawBounds(t),
              t._project(),
              t._update(),
              this._requestRedraw(t);
          },
          _updateStyle: function (t) {
            this._updateDashArray(t), this._requestRedraw(t);
          },
          _updateDashArray: function (t) {
            if (typeof t.options.dashArray == "string") {
              var i = t.options.dashArray.split(/[, ]+/),
                o = [],
                u,
                c;
              for (c = 0; c < i.length; c++) {
                if (((u = Number(i[c])), isNaN(u))) return;
                o.push(u);
              }
              t.options._dashArray = o;
            } else t.options._dashArray = t.options.dashArray;
          },
          _requestRedraw: function (t) {
            this._map &&
              (this._extendRedrawBounds(t),
              (this._redrawRequest =
                this._redrawRequest || tt(this._redraw, this)));
          },
          _extendRedrawBounds: function (t) {
            if (t._pxBounds) {
              var i = (t.options.weight || 0) + 1;
              (this._redrawBounds = this._redrawBounds || new ct()),
                this._redrawBounds.extend(t._pxBounds.min.subtract([i, i])),
                this._redrawBounds.extend(t._pxBounds.max.add([i, i]));
            }
          },
          _redraw: function () {
            (this._redrawRequest = null),
              this._redrawBounds &&
                (this._redrawBounds.min._floor(),
                this._redrawBounds.max._ceil()),
              this._clear(),
              this._draw(),
              (this._redrawBounds = null);
          },
          _clear: function () {
            var t = this._redrawBounds;
            if (t) {
              var i = t.getSize();
              this._ctx.clearRect(t.min.x, t.min.y, i.x, i.y);
            } else
              this._ctx.save(),
                this._ctx.setTransform(1, 0, 0, 1, 0, 0),
                this._ctx.clearRect(
                  0,
                  0,
                  this._container.width,
                  this._container.height,
                ),
                this._ctx.restore();
          },
          _draw: function () {
            var t,
              i = this._redrawBounds;
            if ((this._ctx.save(), i)) {
              var o = i.getSize();
              this._ctx.beginPath(),
                this._ctx.rect(i.min.x, i.min.y, o.x, o.y),
                this._ctx.clip();
            }
            this._drawing = !0;
            for (var u = this._drawFirst; u; u = u.next)
              (t = u.layer),
                (!i || (t._pxBounds && t._pxBounds.intersects(i))) &&
                  t._updatePath();
            (this._drawing = !1), this._ctx.restore();
          },
          _updatePoly: function (t, i) {
            if (this._drawing) {
              var o,
                u,
                c,
                d,
                g = t._parts,
                y = g.length,
                x = this._ctx;
              if (y) {
                for (x.beginPath(), o = 0; o < y; o++) {
                  for (u = 0, c = g[o].length; u < c; u++)
                    (d = g[o][u]), x[u ? "lineTo" : "moveTo"](d.x, d.y);
                  i && x.closePath();
                }
                this._fillStroke(x, t);
              }
            }
          },
          _updateCircle: function (t) {
            if (!(!this._drawing || t._empty())) {
              var i = t._point,
                o = this._ctx,
                u = Math.max(Math.round(t._radius), 1),
                c = (Math.max(Math.round(t._radiusY), 1) || u) / u;
              c !== 1 && (o.save(), o.scale(1, c)),
                o.beginPath(),
                o.arc(i.x, i.y / c, u, 0, Math.PI * 2, !1),
                c !== 1 && o.restore(),
                this._fillStroke(o, t);
            }
          },
          _fillStroke: function (t, i) {
            var o = i.options;
            o.fill &&
              ((t.globalAlpha = o.fillOpacity),
              (t.fillStyle = o.fillColor || o.color),
              t.fill(o.fillRule || "evenodd")),
              o.stroke &&
                o.weight !== 0 &&
                (t.setLineDash &&
                  t.setLineDash((i.options && i.options._dashArray) || []),
                (t.globalAlpha = o.opacity),
                (t.lineWidth = o.weight),
                (t.strokeStyle = o.color),
                (t.lineCap = o.lineCap),
                (t.lineJoin = o.lineJoin),
                t.stroke());
          },
          _onClick: function (t) {
            for (
              var i = this._map.mouseEventToLayerPoint(t),
                o,
                u,
                c = this._drawFirst;
              c;
              c = c.next
            )
              (o = c.layer),
                o.options.interactive &&
                  o._containsPoint(i) &&
                  (!(t.type === "click" || t.type === "preclick") ||
                    !this._map._draggableMoved(o)) &&
                  (u = o);
            this._fireEvent(u ? [u] : !1, t);
          },
          _onMouseMove: function (t) {
            if (
              !(
                !this._map ||
                this._map.dragging.moving() ||
                this._map._animatingZoom
              )
            ) {
              var i = this._map.mouseEventToLayerPoint(t);
              this._handleMouseHover(t, i);
            }
          },
          _handleMouseOut: function (t) {
            var i = this._hoveredLayer;
            i &&
              (St(this._container, "leaflet-interactive"),
              this._fireEvent([i], t, "mouseout"),
              (this._hoveredLayer = null),
              (this._mouseHoverThrottled = !1));
          },
          _handleMouseHover: function (t, i) {
            if (!this._mouseHoverThrottled) {
              for (var o, u, c = this._drawFirst; c; c = c.next)
                (o = c.layer),
                  o.options.interactive && o._containsPoint(i) && (u = o);
              u !== this._hoveredLayer &&
                (this._handleMouseOut(t),
                u &&
                  (et(this._container, "leaflet-interactive"),
                  this._fireEvent([u], t, "mouseover"),
                  (this._hoveredLayer = u))),
                this._fireEvent(
                  this._hoveredLayer ? [this._hoveredLayer] : !1,
                  t,
                ),
                (this._mouseHoverThrottled = !0),
                setTimeout(
                  h(function () {
                    this._mouseHoverThrottled = !1;
                  }, this),
                  32,
                );
            }
          },
          _fireEvent: function (t, i, o) {
            this._map._fireDOMEvent(i, o || i.type, t);
          },
          _bringToFront: function (t) {
            var i = t._order;
            if (i) {
              var o = i.next,
                u = i.prev;
              if (o) o.prev = u;
              else return;
              u ? (u.next = o) : o && (this._drawFirst = o),
                (i.prev = this._drawLast),
                (this._drawLast.next = i),
                (i.next = null),
                (this._drawLast = i),
                this._requestRedraw(t);
            }
          },
          _bringToBack: function (t) {
            var i = t._order;
            if (i) {
              var o = i.next,
                u = i.prev;
              if (u) u.next = o;
              else return;
              o ? (o.prev = u) : u && (this._drawLast = u),
                (i.prev = null),
                (i.next = this._drawFirst),
                (this._drawFirst.prev = i),
                (this._drawFirst = i),
                this._requestRedraw(t);
            }
          },
        });
      function Os(t) {
        return G.canvas ? new Cs(t) : null;
      }
      var Bn = (function () {
          try {
            return (
              document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
              function (t) {
                return document.createElement("<lvml:" + t + ' class="lvml">');
              }
            );
          } catch {}
          return function (t) {
            return document.createElement(
              "<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">',
            );
          };
        })(),
        uc = {
          _initContainer: function () {
            this._container = lt("div", "leaflet-vml-container");
          },
          _update: function () {
            this._map._animatingZoom ||
              (me.prototype._update.call(this), this.fire("update"));
          },
          _initPath: function (t) {
            var i = (t._container = Bn("shape"));
            et(i, "leaflet-vml-shape " + (this.options.className || "")),
              (i.coordsize = "1 1"),
              (t._path = Bn("path")),
              i.appendChild(t._path),
              this._updateStyle(t),
              (this._layers[p(t)] = t);
          },
          _addPath: function (t) {
            var i = t._container;
            this._container.appendChild(i),
              t.options.interactive && t.addInteractiveTarget(i);
          },
          _removePath: function (t) {
            var i = t._container;
            gt(i), t.removeInteractiveTarget(i), delete this._layers[p(t)];
          },
          _updateStyle: function (t) {
            var i = t._stroke,
              o = t._fill,
              u = t.options,
              c = t._container;
            (c.stroked = !!u.stroke),
              (c.filled = !!u.fill),
              u.stroke
                ? (i || (i = t._stroke = Bn("stroke")),
                  c.appendChild(i),
                  (i.weight = u.weight + "px"),
                  (i.color = u.color),
                  (i.opacity = u.opacity),
                  u.dashArray
                    ? (i.dashStyle = C(u.dashArray)
                        ? u.dashArray.join(" ")
                        : u.dashArray.replace(/( *, *)/g, " "))
                    : (i.dashStyle = ""),
                  (i.endcap = u.lineCap.replace("butt", "flat")),
                  (i.joinstyle = u.lineJoin))
                : i && (c.removeChild(i), (t._stroke = null)),
              u.fill
                ? (o || (o = t._fill = Bn("fill")),
                  c.appendChild(o),
                  (o.color = u.fillColor || u.color),
                  (o.opacity = u.fillOpacity))
                : o && (c.removeChild(o), (t._fill = null));
          },
          _updateCircle: function (t) {
            var i = t._point.round(),
              o = Math.round(t._radius),
              u = Math.round(t._radiusY || o);
            this._setPath(
              t,
              t._empty()
                ? "M0 0"
                : "AL " +
                    i.x +
                    "," +
                    i.y +
                    " " +
                    o +
                    "," +
                    u +
                    " 0," +
                    65535 * 360,
            );
          },
          _setPath: function (t, i) {
            t._path.v = i;
          },
          _bringToFront: function (t) {
            Ye(t._container);
          },
          _bringToBack: function (t) {
            Ke(t._container);
          },
        },
        mi = G.vml ? Bn : Ro,
        Nn = me.extend({
          _initContainer: function () {
            (this._container = mi("svg")),
              this._container.setAttribute("pointer-events", "none"),
              (this._rootGroup = mi("g")),
              this._container.appendChild(this._rootGroup);
          },
          _destroyContainer: function () {
            gt(this._container),
              dt(this._container),
              delete this._container,
              delete this._rootGroup,
              delete this._svgSize;
          },
          _update: function () {
            if (!(this._map._animatingZoom && this._bounds)) {
              me.prototype._update.call(this);
              var t = this._bounds,
                i = t.getSize(),
                o = this._container;
              (!this._svgSize || !this._svgSize.equals(i)) &&
                ((this._svgSize = i),
                o.setAttribute("width", i.x),
                o.setAttribute("height", i.y)),
                Tt(o, t.min),
                o.setAttribute(
                  "viewBox",
                  [t.min.x, t.min.y, i.x, i.y].join(" "),
                ),
                this.fire("update");
            }
          },
          _initPath: function (t) {
            var i = (t._path = mi("path"));
            t.options.className && et(i, t.options.className),
              t.options.interactive && et(i, "leaflet-interactive"),
              this._updateStyle(t),
              (this._layers[p(t)] = t);
          },
          _addPath: function (t) {
            this._rootGroup || this._initContainer(),
              this._rootGroup.appendChild(t._path),
              t.addInteractiveTarget(t._path);
          },
          _removePath: function (t) {
            gt(t._path),
              t.removeInteractiveTarget(t._path),
              delete this._layers[p(t)];
          },
          _updatePath: function (t) {
            t._project(), t._update();
          },
          _updateStyle: function (t) {
            var i = t._path,
              o = t.options;
            i &&
              (o.stroke
                ? (i.setAttribute("stroke", o.color),
                  i.setAttribute("stroke-opacity", o.opacity),
                  i.setAttribute("stroke-width", o.weight),
                  i.setAttribute("stroke-linecap", o.lineCap),
                  i.setAttribute("stroke-linejoin", o.lineJoin),
                  o.dashArray
                    ? i.setAttribute("stroke-dasharray", o.dashArray)
                    : i.removeAttribute("stroke-dasharray"),
                  o.dashOffset
                    ? i.setAttribute("stroke-dashoffset", o.dashOffset)
                    : i.removeAttribute("stroke-dashoffset"))
                : i.setAttribute("stroke", "none"),
              o.fill
                ? (i.setAttribute("fill", o.fillColor || o.color),
                  i.setAttribute("fill-opacity", o.fillOpacity),
                  i.setAttribute("fill-rule", o.fillRule || "evenodd"))
                : i.setAttribute("fill", "none"));
          },
          _updatePoly: function (t, i) {
            this._setPath(t, Ao(t._parts, i));
          },
          _updateCircle: function (t) {
            var i = t._point,
              o = Math.max(Math.round(t._radius), 1),
              u = Math.max(Math.round(t._radiusY), 1) || o,
              c = "a" + o + "," + u + " 0 1,0 ",
              d = t._empty()
                ? "M0 0"
                : "M" +
                  (i.x - o) +
                  "," +
                  i.y +
                  c +
                  o * 2 +
                  ",0 " +
                  c +
                  -o * 2 +
                  ",0 ";
            this._setPath(t, d);
          },
          _setPath: function (t, i) {
            t._path.setAttribute("d", i);
          },
          _bringToFront: function (t) {
            Ye(t._path);
          },
          _bringToBack: function (t) {
            Ke(t._path);
          },
        });
      G.vml && Nn.include(uc);
      function Ms(t) {
        return G.svg || G.vml ? new Nn(t) : null;
      }
      at.include({
        getRenderer: function (t) {
          var i =
            t.options.renderer ||
            this._getPaneRenderer(t.options.pane) ||
            this.options.renderer ||
            this._renderer;
          return (
            i || (i = this._renderer = this._createRenderer()),
            this.hasLayer(i) || this.addLayer(i),
            i
          );
        },
        _getPaneRenderer: function (t) {
          if (t === "overlayPane" || t === void 0) return !1;
          var i = this._paneRenderers[t];
          return (
            i === void 0 &&
              ((i = this._createRenderer({ pane: t })),
              (this._paneRenderers[t] = i)),
            i
          );
        },
        _createRenderer: function (t) {
          return (this.options.preferCanvas && Os(t)) || Ms(t);
        },
      });
      var Is = Qe.extend({
        initialize: function (t, i) {
          Qe.prototype.initialize.call(this, this._boundsToLatLngs(t), i);
        },
        setBounds: function (t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function (t) {
          return (
            (t = E(t)),
            [
              t.getSouthWest(),
              t.getNorthWest(),
              t.getNorthEast(),
              t.getSouthEast(),
            ]
          );
        },
      });
      function lc(t, i) {
        return new Is(t, i);
      }
      (Nn.create = mi),
        (Nn.pointsToPath = Ao),
        (_e.geometryToLayer = li),
        (_e.coordsToLatLng = Sr),
        (_e.coordsToLatLngs = ci),
        (_e.latLngToCoords = Pr),
        (_e.latLngsToCoords = hi),
        (_e.getFeature = tn),
        (_e.asFeature = fi),
        at.mergeOptions({ boxZoom: !0 });
      var zs = re.extend({
        initialize: function (t) {
          (this._map = t),
            (this._container = t._container),
            (this._pane = t._panes.overlayPane),
            (this._resetStateTimeout = 0),
            t.on("unload", this._destroy, this);
        },
        addHooks: function () {
          Q(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function () {
          dt(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function () {
          return this._moved;
        },
        _destroy: function () {
          gt(this._pane), delete this._pane;
        },
        _resetState: function () {
          (this._resetStateTimeout = 0), (this._moved = !1);
        },
        _clearDeferredResetState: function () {
          this._resetStateTimeout !== 0 &&
            (clearTimeout(this._resetStateTimeout),
            (this._resetStateTimeout = 0));
        },
        _onMouseDown: function (t) {
          if (!t.shiftKey || (t.which !== 1 && t.button !== 1)) return !1;
          this._clearDeferredResetState(),
            this._resetState(),
            kn(),
            or(),
            (this._startPoint = this._map.mouseEventToContainerPoint(t)),
            Q(
              document,
              {
                contextmenu: ze,
                mousemove: this._onMouseMove,
                mouseup: this._onMouseUp,
                keydown: this._onKeyDown,
              },
              this,
            );
        },
        _onMouseMove: function (t) {
          this._moved ||
            ((this._moved = !0),
            (this._box = lt("div", "leaflet-zoom-box", this._container)),
            et(this._container, "leaflet-crosshair"),
            this._map.fire("boxzoomstart")),
            (this._point = this._map.mouseEventToContainerPoint(t));
          var i = new ct(this._point, this._startPoint),
            o = i.getSize();
          Tt(this._box, i.min),
            (this._box.style.width = o.x + "px"),
            (this._box.style.height = o.y + "px");
        },
        _finish: function () {
          this._moved &&
            (gt(this._box), St(this._container, "leaflet-crosshair")),
            Cn(),
            sr(),
            dt(
              document,
              {
                contextmenu: ze,
                mousemove: this._onMouseMove,
                mouseup: this._onMouseUp,
                keydown: this._onKeyDown,
              },
              this,
            );
        },
        _onMouseUp: function (t) {
          if (
            !(t.which !== 1 && t.button !== 1) &&
            (this._finish(), !!this._moved)
          ) {
            this._clearDeferredResetState(),
              (this._resetStateTimeout = setTimeout(
                h(this._resetState, this),
                0,
              ));
            var i = new X(
              this._map.containerPointToLatLng(this._startPoint),
              this._map.containerPointToLatLng(this._point),
            );
            this._map.fitBounds(i).fire("boxzoomend", { boxZoomBounds: i });
          }
        },
        _onKeyDown: function (t) {
          t.keyCode === 27 &&
            (this._finish(),
            this._clearDeferredResetState(),
            this._resetState());
        },
      });
      at.addInitHook("addHandler", "boxZoom", zs),
        at.mergeOptions({ doubleClickZoom: !0 });
      var Rs = re.extend({
        addHooks: function () {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function () {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function (t) {
          var i = this._map,
            o = i.getZoom(),
            u = i.options.zoomDelta,
            c = t.originalEvent.shiftKey ? o - u : o + u;
          i.options.doubleClickZoom === "center"
            ? i.setZoom(c)
            : i.setZoomAround(t.containerPoint, c);
        },
      });
      at.addInitHook("addHandler", "doubleClickZoom", Rs),
        at.mergeOptions({
          dragging: !0,
          inertia: !0,
          inertiaDeceleration: 3400,
          inertiaMaxSpeed: 1 / 0,
          easeLinearity: 0.2,
          worldCopyJump: !1,
          maxBoundsViscosity: 0,
        });
      var As = re.extend({
        addHooks: function () {
          if (!this._draggable) {
            var t = this._map;
            (this._draggable = new ge(t._mapPane, t._container)),
              this._draggable.on(
                {
                  dragstart: this._onDragStart,
                  drag: this._onDrag,
                  dragend: this._onDragEnd,
                },
                this,
              ),
              this._draggable.on("predrag", this._onPreDragLimit, this),
              t.options.worldCopyJump &&
                (this._draggable.on("predrag", this._onPreDragWrap, this),
                t.on("zoomend", this._onZoomEnd, this),
                t.whenReady(this._onZoomEnd, this));
          }
          et(this._map._container, "leaflet-grab leaflet-touch-drag"),
            this._draggable.enable(),
            (this._positions = []),
            (this._times = []);
        },
        removeHooks: function () {
          St(this._map._container, "leaflet-grab"),
            St(this._map._container, "leaflet-touch-drag"),
            this._draggable.disable();
        },
        moved: function () {
          return this._draggable && this._draggable._moved;
        },
        moving: function () {
          return this._draggable && this._draggable._moving;
        },
        _onDragStart: function () {
          var t = this._map;
          if (
            (t._stop(),
            this._map.options.maxBounds && this._map.options.maxBoundsViscosity)
          ) {
            var i = E(this._map.options.maxBounds);
            (this._offsetLimit = A(
              this._map.latLngToContainerPoint(i.getNorthWest()).multiplyBy(-1),
              this._map
                .latLngToContainerPoint(i.getSouthEast())
                .multiplyBy(-1)
                .add(this._map.getSize()),
            )),
              (this._viscosity = Math.min(
                1,
                Math.max(0, this._map.options.maxBoundsViscosity),
              ));
          } else this._offsetLimit = null;
          t.fire("movestart").fire("dragstart"),
            t.options.inertia && ((this._positions = []), (this._times = []));
        },
        _onDrag: function (t) {
          if (this._map.options.inertia) {
            var i = (this._lastTime = +new Date()),
              o = (this._lastPos =
                this._draggable._absPos || this._draggable._newPos);
            this._positions.push(o),
              this._times.push(i),
              this._prunePositions(i);
          }
          this._map.fire("move", t).fire("drag", t);
        },
        _prunePositions: function (t) {
          for (; this._positions.length > 1 && t - this._times[0] > 50; )
            this._positions.shift(), this._times.shift();
        },
        _onZoomEnd: function () {
          var t = this._map.getSize().divideBy(2),
            i = this._map.latLngToLayerPoint([0, 0]);
          (this._initialWorldOffset = i.subtract(t).x),
            (this._worldWidth = this._map.getPixelWorldBounds().getSize().x);
        },
        _viscousLimit: function (t, i) {
          return t - (t - i) * this._viscosity;
        },
        _onPreDragLimit: function () {
          if (!(!this._viscosity || !this._offsetLimit)) {
            var t = this._draggable._newPos.subtract(this._draggable._startPos),
              i = this._offsetLimit;
            t.x < i.min.x && (t.x = this._viscousLimit(t.x, i.min.x)),
              t.y < i.min.y && (t.y = this._viscousLimit(t.y, i.min.y)),
              t.x > i.max.x && (t.x = this._viscousLimit(t.x, i.max.x)),
              t.y > i.max.y && (t.y = this._viscousLimit(t.y, i.max.y)),
              (this._draggable._newPos = this._draggable._startPos.add(t));
          }
        },
        _onPreDragWrap: function () {
          var t = this._worldWidth,
            i = Math.round(t / 2),
            o = this._initialWorldOffset,
            u = this._draggable._newPos.x,
            c = ((u - i + o) % t) + i - o,
            d = ((u + i + o) % t) - i - o,
            g = Math.abs(c + o) < Math.abs(d + o) ? c : d;
          (this._draggable._absPos = this._draggable._newPos.clone()),
            (this._draggable._newPos.x = g);
        },
        _onDragEnd: function (t) {
          var i = this._map,
            o = i.options,
            u = !o.inertia || t.noInertia || this._times.length < 2;
          if ((i.fire("dragend", t), u)) i.fire("moveend");
          else {
            this._prunePositions(+new Date());
            var c = this._lastPos.subtract(this._positions[0]),
              d = (this._lastTime - this._times[0]) / 1e3,
              g = o.easeLinearity,
              y = c.multiplyBy(g / d),
              x = y.distanceTo([0, 0]),
              R = Math.min(o.inertiaMaxSpeed, x),
              H = y.multiplyBy(R / x),
              Y = R / (o.inertiaDeceleration * g),
              ot = H.multiplyBy(-Y / 2).round();
            !ot.x && !ot.y
              ? i.fire("moveend")
              : ((ot = i._limitOffset(ot, i.options.maxBounds)),
                tt(function () {
                  i.panBy(ot, {
                    duration: Y,
                    easeLinearity: g,
                    noMoveStart: !0,
                    animate: !0,
                  });
                }));
          }
        },
      });
      at.addInitHook("addHandler", "dragging", As),
        at.mergeOptions({ keyboard: !0, keyboardPanDelta: 80 });
      var Bs = re.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173],
        },
        initialize: function (t) {
          (this._map = t),
            this._setPanDelta(t.options.keyboardPanDelta),
            this._setZoomDelta(t.options.zoomDelta);
        },
        addHooks: function () {
          var t = this._map._container;
          t.tabIndex <= 0 && (t.tabIndex = "0"),
            Q(
              t,
              {
                focus: this._onFocus,
                blur: this._onBlur,
                mousedown: this._onMouseDown,
              },
              this,
            ),
            this._map.on(
              { focus: this._addHooks, blur: this._removeHooks },
              this,
            );
        },
        removeHooks: function () {
          this._removeHooks(),
            dt(
              this._map._container,
              {
                focus: this._onFocus,
                blur: this._onBlur,
                mousedown: this._onMouseDown,
              },
              this,
            ),
            this._map.off(
              { focus: this._addHooks, blur: this._removeHooks },
              this,
            );
        },
        _onMouseDown: function () {
          if (!this._focused) {
            var t = document.body,
              i = document.documentElement,
              o = t.scrollTop || i.scrollTop,
              u = t.scrollLeft || i.scrollLeft;
            this._map._container.focus(), window.scrollTo(u, o);
          }
        },
        _onFocus: function () {
          (this._focused = !0), this._map.fire("focus");
        },
        _onBlur: function () {
          (this._focused = !1), this._map.fire("blur");
        },
        _setPanDelta: function (t) {
          var i = (this._panKeys = {}),
            o = this.keyCodes,
            u,
            c;
          for (u = 0, c = o.left.length; u < c; u++) i[o.left[u]] = [-1 * t, 0];
          for (u = 0, c = o.right.length; u < c; u++) i[o.right[u]] = [t, 0];
          for (u = 0, c = o.down.length; u < c; u++) i[o.down[u]] = [0, t];
          for (u = 0, c = o.up.length; u < c; u++) i[o.up[u]] = [0, -1 * t];
        },
        _setZoomDelta: function (t) {
          var i = (this._zoomKeys = {}),
            o = this.keyCodes,
            u,
            c;
          for (u = 0, c = o.zoomIn.length; u < c; u++) i[o.zoomIn[u]] = t;
          for (u = 0, c = o.zoomOut.length; u < c; u++) i[o.zoomOut[u]] = -t;
        },
        _addHooks: function () {
          Q(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function () {
          dt(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function (t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var i = t.keyCode,
              o = this._map,
              u;
            if (i in this._panKeys) {
              if (!o._panAnim || !o._panAnim._inProgress)
                if (
                  ((u = this._panKeys[i]),
                  t.shiftKey && (u = W(u).multiplyBy(3)),
                  o.options.maxBounds &&
                    (u = o._limitOffset(W(u), o.options.maxBounds)),
                  o.options.worldCopyJump)
                ) {
                  var c = o.wrapLatLng(
                    o.unproject(o.project(o.getCenter()).add(u)),
                  );
                  o.panTo(c);
                } else o.panBy(u);
            } else if (i in this._zoomKeys)
              o.setZoom(o.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[i]);
            else if (i === 27 && o._popup && o._popup.options.closeOnEscapeKey)
              o.closePopup();
            else return;
            ze(t);
          }
        },
      });
      at.addInitHook("addHandler", "keyboard", Bs),
        at.mergeOptions({
          scrollWheelZoom: !0,
          wheelDebounceTime: 40,
          wheelPxPerZoomLevel: 60,
        });
      var Ns = re.extend({
        addHooks: function () {
          Q(this._map._container, "wheel", this._onWheelScroll, this),
            (this._delta = 0);
        },
        removeHooks: function () {
          dt(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function (t) {
          var i = as(t),
            o = this._map.options.wheelDebounceTime;
          (this._delta += i),
            (this._lastMousePos = this._map.mouseEventToContainerPoint(t)),
            this._startTime || (this._startTime = +new Date());
          var u = Math.max(o - (+new Date() - this._startTime), 0);
          clearTimeout(this._timer),
            (this._timer = setTimeout(h(this._performZoom, this), u)),
            ze(t);
        },
        _performZoom: function () {
          var t = this._map,
            i = t.getZoom(),
            o = this._map.options.zoomSnap || 0;
          t._stop();
          var u = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
            c = (4 * Math.log(2 / (1 + Math.exp(-Math.abs(u))))) / Math.LN2,
            d = o ? Math.ceil(c / o) * o : c,
            g = t._limitZoom(i + (this._delta > 0 ? d : -d)) - i;
          (this._delta = 0),
            (this._startTime = null),
            g &&
              (t.options.scrollWheelZoom === "center"
                ? t.setZoom(i + g)
                : t.setZoomAround(this._lastMousePos, i + g));
        },
      });
      at.addInitHook("addHandler", "scrollWheelZoom", Ns);
      var cc = 600;
      at.mergeOptions({
        tapHold: G.touchNative && G.safari && G.mobile,
        tapTolerance: 15,
      });
      var Ds = re.extend({
        addHooks: function () {
          Q(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function () {
          dt(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function (t) {
          if ((clearTimeout(this._holdTimeout), t.touches.length === 1)) {
            var i = t.touches[0];
            (this._startPos = this._newPos = new j(i.clientX, i.clientY)),
              (this._holdTimeout = setTimeout(
                h(function () {
                  this._cancel(),
                    this._isTapValid() &&
                      (Q(document, "touchend", zt),
                      Q(
                        document,
                        "touchend touchcancel",
                        this._cancelClickPrevent,
                      ),
                      this._simulateEvent("contextmenu", i));
                }, this),
                cc,
              )),
              Q(
                document,
                "touchend touchcancel contextmenu",
                this._cancel,
                this,
              ),
              Q(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          dt(document, "touchend", zt), dt(document, "touchend touchcancel", t);
        },
        _cancel: function () {
          clearTimeout(this._holdTimeout),
            dt(
              document,
              "touchend touchcancel contextmenu",
              this._cancel,
              this,
            ),
            dt(document, "touchmove", this._onMove, this);
        },
        _onMove: function (t) {
          var i = t.touches[0];
          this._newPos = new j(i.clientX, i.clientY);
        },
        _isTapValid: function () {
          return (
            this._newPos.distanceTo(this._startPos) <=
            this._map.options.tapTolerance
          );
        },
        _simulateEvent: function (t, i) {
          var o = new MouseEvent(t, {
            bubbles: !0,
            cancelable: !0,
            view: window,
            screenX: i.screenX,
            screenY: i.screenY,
            clientX: i.clientX,
            clientY: i.clientY,
          });
          (o._simulated = !0), i.target.dispatchEvent(o);
        },
      });
      at.addInitHook("addHandler", "tapHold", Ds),
        at.mergeOptions({ touchZoom: G.touch, bounceAtZoomLimits: !0 });
      var Zs = re.extend({
        addHooks: function () {
          et(this._map._container, "leaflet-touch-zoom"),
            Q(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function () {
          St(this._map._container, "leaflet-touch-zoom"),
            dt(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function (t) {
          var i = this._map;
          if (
            !(
              !t.touches ||
              t.touches.length !== 2 ||
              i._animatingZoom ||
              this._zooming
            )
          ) {
            var o = i.mouseEventToContainerPoint(t.touches[0]),
              u = i.mouseEventToContainerPoint(t.touches[1]);
            (this._centerPoint = i.getSize()._divideBy(2)),
              (this._startLatLng = i.containerPointToLatLng(this._centerPoint)),
              i.options.touchZoom !== "center" &&
                (this._pinchStartLatLng = i.containerPointToLatLng(
                  o.add(u)._divideBy(2),
                )),
              (this._startDist = o.distanceTo(u)),
              (this._startZoom = i.getZoom()),
              (this._moved = !1),
              (this._zooming = !0),
              i._stop(),
              Q(document, "touchmove", this._onTouchMove, this),
              Q(document, "touchend touchcancel", this._onTouchEnd, this),
              zt(t);
          }
        },
        _onTouchMove: function (t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var i = this._map,
              o = i.mouseEventToContainerPoint(t.touches[0]),
              u = i.mouseEventToContainerPoint(t.touches[1]),
              c = o.distanceTo(u) / this._startDist;
            if (
              ((this._zoom = i.getScaleZoom(c, this._startZoom)),
              !i.options.bounceAtZoomLimits &&
                ((this._zoom < i.getMinZoom() && c < 1) ||
                  (this._zoom > i.getMaxZoom() && c > 1)) &&
                (this._zoom = i._limitZoom(this._zoom)),
              i.options.touchZoom === "center")
            ) {
              if (((this._center = this._startLatLng), c === 1)) return;
            } else {
              var d = o._add(u)._divideBy(2)._subtract(this._centerPoint);
              if (c === 1 && d.x === 0 && d.y === 0) return;
              this._center = i.unproject(
                i.project(this._pinchStartLatLng, this._zoom).subtract(d),
                this._zoom,
              );
            }
            this._moved || (i._moveStart(!0, !1), (this._moved = !0)),
              J(this._animRequest);
            var g = h(
              i._move,
              i,
              this._center,
              this._zoom,
              { pinch: !0, round: !1 },
              void 0,
            );
            (this._animRequest = tt(g, this, !0)), zt(t);
          }
        },
        _onTouchEnd: function () {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          (this._zooming = !1),
            J(this._animRequest),
            dt(document, "touchmove", this._onTouchMove, this),
            dt(document, "touchend touchcancel", this._onTouchEnd, this),
            this._map.options.zoomAnimation
              ? this._map._animateZoom(
                  this._center,
                  this._map._limitZoom(this._zoom),
                  !0,
                  this._map.options.zoomSnap,
                )
              : this._map._resetView(
                  this._center,
                  this._map._limitZoom(this._zoom),
                );
        },
      });
      at.addInitHook("addHandler", "touchZoom", Zs),
        (at.BoxZoom = zs),
        (at.DoubleClickZoom = Rs),
        (at.Drag = As),
        (at.Keyboard = Bs),
        (at.ScrollWheelZoom = Ns),
        (at.TapHold = Ds),
        (at.TouchZoom = Zs),
        (r.Bounds = ct),
        (r.Browser = G),
        (r.CRS = Yt),
        (r.Canvas = Cs),
        (r.Circle = br),
        (r.CircleMarker = ui),
        (r.Class = wt),
        (r.Control = Kt),
        (r.DivIcon = Ts),
        (r.DivOverlay = oe),
        (r.DomEvent = kl),
        (r.DomUtil = Tl),
        (r.Draggable = ge),
        (r.Evented = Ht),
        (r.FeatureGroup = de),
        (r.GeoJSON = _e),
        (r.GridLayer = An),
        (r.Handler = re),
        (r.Icon = Je),
        (r.ImageOverlay = di),
        (r.LatLng = q),
        (r.LatLngBounds = X),
        (r.Layer = Xt),
        (r.LayerGroup = Xe),
        (r.LineUtil = Hl),
        (r.Map = at),
        (r.Marker = ai),
        (r.Mixin = Al),
        (r.Path = ve),
        (r.Point = j),
        (r.PolyUtil = Bl),
        (r.Polygon = Qe),
        (r.Polyline = pe),
        (r.Popup = pi),
        (r.PosAnimation = us),
        (r.Projection = Ul),
        (r.Rectangle = Is),
        (r.Renderer = me),
        (r.SVG = Nn),
        (r.SVGOverlay = Ls),
        (r.TileLayer = en),
        (r.Tooltip = _i),
        (r.Transformation = Vi),
        (r.Util = he),
        (r.VideoOverlay = xs),
        (r.bind = h),
        (r.bounds = A),
        (r.canvas = Os),
        (r.circle = Kl),
        (r.circleMarker = Yl),
        (r.control = In),
        (r.divIcon = oc),
        (r.extend = a),
        (r.featureGroup = Gl),
        (r.geoJSON = Ps),
        (r.geoJson = Ql),
        (r.gridLayer = sc),
        (r.icon = Vl),
        (r.imageOverlay = tc),
        (r.latLng = nt),
        (r.latLngBounds = E),
        (r.layerGroup = ql),
        (r.map = Cl),
        (r.marker = $l),
        (r.point = W),
        (r.polygon = Jl),
        (r.polyline = Xl),
        (r.popup = ic),
        (r.rectangle = lc),
        (r.setOptions = O),
        (r.stamp = p),
        (r.svg = Ms),
        (r.svgOverlay = nc),
        (r.tileLayer = Es),
        (r.tooltip = rc),
        (r.transformation = xn),
        (r.version = s),
        (r.videoOverlay = ec);
      var hc = window.L;
      (r.noConflict = function () {
        return (window.L = hc), this;
      }),
        (window.L = r);
    });
  })(io, io.exports);
  var v_ = io.exports;
  const ft = Sn(v_),
    Ti = () =>
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
      );
  let He = null,
    jt;
  const Za = async () => {
      let e;
      if ("permissions" in navigator && "query" in navigator.permissions)
        e = (await navigator.permissions.query({ name: "geolocation" })).state;
      else
        try {
          const n = localStorage.getItem(
            "lastKnownWebGeolocationPermissionState",
          );
          n && (e = n);
        } catch {}
      if (!e) {
        be.set("pre-prompt"),
          Dt({
            name: "locate--no-permissions-query-support",
            title:
              "Locate button clicked (no support for querying permissions)",
          });
        return;
      }
      if (e === "granted") {
        Dt({
          name: "locate--already-granted",
          title:
            "Locate button clicked (web geolocation persmission state: granted)",
        });
        try {
          await Uu();
        } catch (n) {
          throw (
            (pt(() =>
              localStorage.removeItem("lastKnownWebGeolocationPermissionState"),
            ),
            n)
          );
        }
        return;
      }
      if (e === "prompt") {
        Dt({
          name: "locate--pre-prompt",
          title:
            "Locate button clicked (web geolocation persmission state: prompt)",
        }),
          pt(() =>
            localStorage.removeItem("lastKnownWebGeolocationPermissionState"),
          ),
          be.set("pre-prompt");
        return;
      }
      if (e === "denied") {
        Dt({
          name: "locate--denied",
          title:
            "Locate button clicked (web geolocation persmission state: denied)",
        }),
          pt(() =>
            localStorage.setItem(
              "lastKnownWebGeolocationPermissionState",
              "denied",
            ),
          ),
          be.set("denied");
        return;
      }
    },
    Fa = (e) => {
      if (!He) {
        if (
          ("Locate" in ft.Control ||
            (ft.Control.Locate = ft.Control.extend({
              version: "1.0.1",
              options: { position: "topright" },
              container: null,
              onAdd() {
                return (
                  (jt = ft.DomUtil.create("div")),
                  (jt.className =
                    "leaflet-bar leaflet-control leaflet-locate-control"),
                  (jt.id = "locate-control"),
                  (jt.title = "Move area center to your current location"),
                  (jt.innerHTML = `<button>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 297 297" xml:space="preserve"><path d="M148.5,0C66.653,0,0.067,66.616,0.067,148.499C0.067,230.383,66.653,297,148.5,297s148.433-66.617,148.433-148.501 C296.933,66.616,230.347,0,148.5,0z M158.597,276.411v-61.274c0-5.575-4.521-10.097-10.097-10.097s-10.097,4.521-10.097,10.097 v61.274c-62.68-4.908-112.845-55.102-117.747-117.814h61.207c5.575,0,10.097-4.521,10.097-10.097s-4.522-10.097-10.097-10.097 H20.656C25.558,75.69,75.723,25.497,138.403,20.589v61.274c0,5.575,4.521,10.097,10.097,10.097s10.097-4.521,10.097-10.097V20.589 c62.681,4.908,112.846,55.102,117.747,117.814h-61.207c-5.575,0-10.097,4.521-10.097,10.097s4.521,10.097,10.097,10.097h61.207 C271.441,221.31,221.276,271.503,158.597,276.411z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
          <span>${Ti() > 800 ? "Find me" : ""}</span>
        </button>`),
                  ft.DomEvent.disableClickPropagation(jt),
                  ft.DomEvent.on(jt, "contextmenu", (n) => {
                    ft.DomEvent.stopPropagation(n);
                  }),
                  ft.DomEvent.disableScrollPropagation(jt),
                  ft.DomEvent.on(jt, "click", Za, jt),
                  jt
                );
              },
              onRemove() {
                ft.DomEvent.off(jt, "click", Za, jt);
              },
            })),
          (He = new ft.Control.Locate()),
          !He)
        )
          throw new Error("Locate control creation failed");
        e.addControl(He);
      }
    },
    y_ = (e) => {
      He && (e.removeControl(He), (He = null));
    };
  function w_(e, n, r) {
    r === void 0 && (r = {});
    var s = { type: "Feature" };
    return (
      (r.id === 0 || r.id) && (s.id = r.id),
      r.bbox && (s.bbox = r.bbox),
      (s.properties = n || {}),
      (s.geometry = e),
      s
    );
  }
  function b_(e, n, r) {
    if ((r === void 0 && (r = {}), !e))
      throw new Error("coordinates is required");
    if (!Array.isArray(e)) throw new Error("coordinates must be an Array");
    if (e.length < 2)
      throw new Error("coordinates must be at least 2 numbers long");
    if (!Ha(e[0]) || !Ha(e[1]))
      throw new Error("coordinates must contain numbers");
    var s = { type: "Point", coordinates: e };
    return w_(s, n, r);
  }
  function Ha(e) {
    return !isNaN(e) && e !== null && !Array.isArray(e);
  }
  function Wu(e, n, r) {
    if (e !== null)
      for (
        var s,
          a,
          l,
          h,
          f,
          p,
          _,
          v = 0,
          m = 0,
          w,
          S = e.type,
          P = S === "FeatureCollection",
          O = S === "Feature",
          I = P ? e.features.length : 1,
          z = 0;
        z < I;
        z++
      ) {
        (_ = P ? e.features[z].geometry : O ? e.geometry : e),
          (w = _ ? _.type === "GeometryCollection" : !1),
          (f = w ? _.geometries.length : 1);
        for (var M = 0; M < f; M++) {
          var C = 0,
            F = 0;
          if (((h = w ? _.geometries[M] : _), h !== null)) {
            p = h.coordinates;
            var B = h.type;
            switch (((v = 0), B)) {
              case null:
                break;
              case "Point":
                if (n(p, m, z, C, F) === !1) return !1;
                m++, C++;
                break;
              case "LineString":
              case "MultiPoint":
                for (s = 0; s < p.length; s++) {
                  if (n(p[s], m, z, C, F) === !1) return !1;
                  m++, B === "MultiPoint" && C++;
                }
                B === "LineString" && C++;
                break;
              case "Polygon":
              case "MultiLineString":
                for (s = 0; s < p.length; s++) {
                  for (a = 0; a < p[s].length - v; a++) {
                    if (n(p[s][a], m, z, C, F) === !1) return !1;
                    m++;
                  }
                  B === "MultiLineString" && C++, B === "Polygon" && F++;
                }
                B === "Polygon" && C++;
                break;
              case "MultiPolygon":
                for (s = 0; s < p.length; s++) {
                  for (F = 0, a = 0; a < p[s].length; a++) {
                    for (l = 0; l < p[s][a].length - v; l++) {
                      if (n(p[s][a][l], m, z, C, F) === !1) return !1;
                      m++;
                    }
                    F++;
                  }
                  C++;
                }
                break;
              case "GeometryCollection":
                for (s = 0; s < h.geometries.length; s++)
                  if (Wu(h.geometries[s], n) === !1) return !1;
                break;
              default:
                throw new Error("Unknown Geometry Type");
            }
          }
        }
      }
  }
  function ro(e) {
    var n = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
    return (
      Wu(e, function (r) {
        n[0] > r[0] && (n[0] = r[0]),
          n[1] > r[1] && (n[1] = r[1]),
          n[2] < r[0] && (n[2] = r[0]),
          n[3] < r[1] && (n[3] = r[1]);
      }),
      n
    );
  }
  ro.default = ro;
  function S_(e, n) {
    n === void 0 && (n = {});
    var r = ro(e),
      s = (r[0] + r[2]) / 2,
      a = (r[1] + r[3]) / 2;
    return b_([s, a], n.properties, n);
  }
  var P_ = function (e) {
    return { type: "FeatureCollection", features: e };
  };
  const x_ = Sn(P_);
  var L_ =
      Array.isArray ||
      function (e) {
        return Object.prototype.toString.call(e) === "[object Array]";
      },
    T_ = function (e, n) {
      if (!L_(e)) throw new Error("Coordinates must be an array");
      if (e.length < 2)
        throw new Error("Coordinates must be at least 2 numbers long");
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: e },
        properties: n || {},
      };
    };
  const E_ = Sn(T_);
  var k_ = Array.isArray,
    C_ = k_;
  const O_ = Sn(C_),
    Io = (e) => [e.lat, Ue(e.lng)],
    qu = (e) => {
      const n = [];
      for (const r of e) O_(r) ? n.push(qu(r)) : n.push(Io(r));
      return n;
    },
    M_ = (e) => (e > 1e3 ? "red" : e > 300 ? "orange" : "green"),
    Ua = ({ color: e, layer: n, question: r, shouldDrawCircle: s }) => {
      if (!r.distance) throw new Error("question.distance does not exist");
      const a = e || M_(r.distance.amount);
      let l;
      r.target.isEnclosedArea
        ? (l = ft.polygon(r.target.points, {
            color: a,
            fillColor: a,
            fillOpacity: 0.1,
            opacity: 1,
            weight: 3,
          }))
        : (l = ft.polyline(r.target.points, {
            color: a,
            fillColor: "white",
            fillOpacity: 1,
            weight: Math.max(Math.ceil(r.target.width || 0), 10),
          })),
        l.addTo(n);
      const h = l.getBounds(),
        f = r.target.points.reduce(
          (_, v) => [..._, ...v.map((m) => E_(Io(m)))],
          [],
        );
      let p;
      if (!r.target.isEnclosedArea && s) {
        const _ = S_(x_(f)).geometry.coordinates;
        p = ft
          .circle(_, {
            color: a,
            fillOpacity: 0.1,
            opacity: 0.2,
            radius:
              Math.max(
                h.getNorthWest().distanceTo(h.getSouthEast()),
                h.getNorthEast().distanceTo(h.getSouthWest()),
              ) * 0.8,
            weight: 1,
          })
          .addTo(n);
      }
      return { circle: p, targetLayer: l };
    },
    Dr = async (e, n) => (await Mo(), n.latLngToLayerPoint(e));
  var qi = { exports: {} },
    I_ = function (n, r, s, a) {
      var l = n[0],
        h = n[1],
        f = !1;
      s === void 0 && (s = 0), a === void 0 && (a = r.length);
      for (var p = (a - s) / 2, _ = 0, v = p - 1; _ < p; v = _++) {
        var m = r[s + _ * 2 + 0],
          w = r[s + _ * 2 + 1],
          S = r[s + v * 2 + 0],
          P = r[s + v * 2 + 1],
          O = w > h != P > h && l < ((S - m) * (h - w)) / (P - w) + m;
        O && (f = !f);
      }
      return f;
    },
    z_ = function (n, r, s, a) {
      var l = n[0],
        h = n[1],
        f = !1;
      s === void 0 && (s = 0), a === void 0 && (a = r.length);
      for (var p = a - s, _ = 0, v = p - 1; _ < p; v = _++) {
        var m = r[_ + s][0],
          w = r[_ + s][1],
          S = r[v + s][0],
          P = r[v + s][1],
          O = w > h != P > h && l < ((S - m) * (h - w)) / (P - w) + m;
        O && (f = !f);
      }
      return f;
    },
    Gu = I_,
    Vu = z_;
  qi.exports = function (n, r, s, a) {
    return r.length > 0 && Array.isArray(r[0])
      ? Vu(n, r, s, a)
      : Gu(n, r, s, a);
  };
  qi.exports.nested = Vu;
  qi.exports.flat = Gu;
  var R_ = qi.exports;
  const A_ = Sn(R_),
    B_ = (e, n) => {
      const r = qu(n);
      let s;
      r.length === 1 && typeof r[0] != "number" ? (s = r[0]) : (s = r);
      try {
        return A_(Io(e), s);
      } catch {
        return !1;
      }
    },
    N_ = async (e, n, r) => {
      if (B_(n, r)) return { distance: 0 };
      const s = await Dr(n, e),
        a = r.flat(1);
      let l, h;
      for (let f = 1; f < a.length; f++) {
        const [p, _] = await Promise.all([Dr(a[f - 1], e), Dr(a[f], e)]),
          v = ft.LineUtil.closestPointOnSegment(s, p, _),
          m = e.layerPointToLatLng(v).distanceTo(n);
        (!l || typeof h > "u" || m < h) && ((l = v), (h = m));
      }
      if (!l || !h) throw new Error("No nearest point found");
      if (typeof h != "number")
        throw new Error(`distance is not a number (${typeof h})`);
      return { distance: h / 1e3, latLng: e.layerPointToLatLng(l) };
    },
    le = (e, n) => parseFloat(Math.round(parseFloat(e + "e+" + n)) + "e-" + n),
    D_ = ({ lat: e, lng: n }) => ({ lat: le(e, 5), lng: le(n, 5) }),
    $u = (e = 0) => new Promise((n) => setTimeout(() => n(), e));
  function Z_(e) {
    let n, r, s;
    return {
      c() {
        (n = k("div")), T(n, "id", "map");
      },
      m(a, l) {
        D(a, n, l), e[3](n), r || ((s = ht(n, "pointerdown", e[1])), (r = !0));
      },
      p: ut,
      i: ut,
      o: ut,
      d(a) {
        a && N(n), e[3](null), (r = !1), s();
      },
    };
  }
  const ja = 3.5,
    Wa = 23;
  function F_(e, n, r) {
    let s, a, l, h, f, p, _, v, m;
    it(e, Se, (A) => r(12, (s = A))),
      it(e, Wt, (A) => r(13, (a = A))),
      it(e, to, (A) => r(14, (l = A))),
      it(e, qe, (A) => r(15, (h = A))),
      it(e, je, (A) => r(16, (f = A))),
      it(e, jn, (A) => r(17, (p = A))),
      it(e, zi, (A) => r(18, (_ = A))),
      it(e, Wi, (A) => r(19, (v = A))),
      it(e, ko, (A) => r(20, (m = A)));
    const w = () => (Ti() >= 800 ? 0.2 : 0);
    let { areSettingsShown: S = bt(!1) } = n,
      P,
      O;
    const I = { shouldShowAreaBoundsPopup: !0 };
    let z, M, C, F, B;
    const Z = ft.TileLayer.extend({
        createTile(A, X) {
          const E = document.createElement("sharp-img");
          return (
            (E.onload = ft.bind(this._tileOnLoad, this, X, E)),
            (E.onerror = ft.bind(this._tileOnError, this, X, E)),
            (E.alt = ""),
            (E.src = this.getTileUrl(A)),
            E.setAttribute("role", "presentation"),
            E
          );
        },
      }),
      V = (A) => {
        const X = {
          base: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
          labels:
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
        };
        return new Z(X[A], {
          attribution:
            '<a href="https://carto.com/legal/" target="_blank">&copy; Carto</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
          maxNativeZoom: 18,
          maxZoom: Wa,
        });
      },
      st = { base: V("base"), labels: V("labels") };
    let xt = !0;
    const Ct = {
        color: "#ff2882",
        fillColor: "#ff2882",
        fillOpacity: 0.05,
        interactive: !1,
        weight: 5,
        opacity: 0.5,
      },
      tt = ({ shouldShowAreaBoundsPopup: A }) => {
        const X = ft.circle(f, { ...Ct, radius: h }).addTo(C),
          E = ft
            .circle(f, { ...Ct, fillOpacity: 0.75, opacity: 0, radius: h / 50 })
            .addTo(C);
        A &&
          (E.bindPopup(
            `To select a different area, you can zoom out and ${m.toLowerCase()} anywhere on the map.`,
          ),
          E.openPopup());
        const q = X.getBounds();
        to.set(q);
        const nt = X.getBounds().pad(w());
        C.flyToBounds(nt, { animate: !0, duration: 0.75 }),
          P && C.removeLayer(P),
          O && C.removeLayer(O),
          (P = X),
          (O = E);
      },
      J = async () => {
        xt &&
          (await new Promise((A) => {
            st.base.once("add", () => A()).addTo(C);
          }),
          C.removeLayer(st.labels),
          (xt = !1));
      },
      he = async () => {
        xt ||
          (await new Promise((A) => {
            st.labels.once("add", () => A()).addTo(C);
          }),
          C.removeLayer(st.base),
          (xt = !0));
      },
      wt = () => {
        if (!l) throw new Error("No areaBounds");
        J(),
          y_(C),
          C.fitBounds(l).setMaxBounds(l.pad(0.12)).setMinZoom(12),
          P.setStyle({ color: "#37003c", fill: !1, stroke: !0, opacity: 0.4 }),
          O.closePopup().unbindPopup(),
          C.removeLayer(O);
      },
      ee = async () => {
        if (!v) throw new Error("No currentQuestion");
        if (!z) throw new Error("chosenPointMarker is falsy");
        const A = z.getLatLng();
        await Mo();
        const { distance: X, latLng: E } = await N_(C, A, v.target.points);
        let q = 0;
        if (X < 1) {
          const Bt = Math.max(X, 0.015) - 0.015;
          q = Math.floor((1 - Bt) * 100);
        }
        const nt = {
          distance: { amount: X * 1e3, unit: "metres" },
          score: q,
          status: "complete",
        };
        Wt.update((Bt) => {
          if (!Bt) throw new Error("round is falsy");
          return {
            ...Bt,
            questions: Bt.questions.map((Ce) =>
              Ce === v ? { ...Ce, ...nt } : Ce,
            ),
          };
        }),
          (B = ft.featureGroup().addTo(C));
        const { targetLayer: Yt } = Ua({
          layer: B,
          question: { ...v, ...nt },
          shouldDrawCircle: !0,
        });
        X > 0 &&
          E &&
          ft
            .polyline([A, E], { color: "black", dashArray: "10 10", weight: 1 })
            .addTo(B)
            .bringToFront(),
          Yt.bringToFront(),
          he(),
          await $u(100),
          B && C.fitBounds(B.getBounds().pad(0.2));
      },
      Lt = (A) => {
        const X = { ...A.latlng, lng: Ue(A.latlng.lng) };
        if (!s) {
          const E = () => je.set(D_(X));
          !a && _ && !M
            ? ((M = !0),
              Dt({
                name: "change-prefined-area-seed_attempted",
                title: "Change predefined area-seed: attempted",
              }),
              confirm(`The link you opened contains a pre-defined area and set of streets. A friend may have given you the URL so you could compete. 

Change the area anyway?`)
                ? (Dt({
                    name: "change-prefined-area-seed_confirmed",
                    title: "Change predefined area-seed: confirmed",
                  }),
                  E())
                : Dt({
                    name: "change-prefined-area-seed_cancelled",
                    title: "Change predefined area-seed: cancelled",
                  }))
            : E();
          return;
        }
        p || fn.set(X);
      },
      Ht = () => {
        ft.Icon.Default.prototype.options.imagePath = "/images/leaflet/";
        const A = Ti(),
          X = {
            boxZoom: !1,
            doubleClickZoom: !1,
            layers: [st.labels],
            minZoom: ja,
            zoomControl: !1,
            zoomSnap: 0.25,
          },
          E = ft.control.zoom({
            position: "topright",
            zoomInText: "&#43;" + (A > 800 ? "&emsp;Zoom in" : ""),
            zoomOutText: "&minus;" + (A > 800 ? "&emsp;Zoom out" : ""),
          });
        (C = ft
          .map(F, X)
          .on("click", Lt)
          .on("zoomend", () => {
            eo.set(0);
          })
          .on("zoomstart", () => {
            eo.update((q) => q + 1);
          })
          .fitBounds(ft.latLng(f).toBounds(h).pad(w()))
          .addControl(E)),
          Fa(C),
          C.attributionControl.setPrefix(""),
          window.ResizeObserver !== void 0 &&
            new ResizeObserver(
              Qr(
                () => {
                  C && C.invalidateSize();
                },
                200,
                { leading: !0 },
              ),
            ).observe(F);
      },
      j = (A = !0, X = !1) => {
        X ? he() : J(),
          B && (C.removeLayer(B), (B = null)),
          A &&
            l &&
            C.fitBounds(l).once("zoomend", () => {
              C.panBy([1, 1]);
            });
      },
      fe = Qr(() => {
        if (!a) throw new Error("No round");
        fn.set(null),
          j(!1, !0),
          (B = ft.featureGroup().addTo(C)),
          a.questions.forEach((A) => {
            const { targetLayer: X } = Ua({
                color: "#ff2882",
                layer: B,
                question: A,
              }),
              E = document.createElement("span");
            E.classList.add("summary-street-tooltip"),
              E.classList.add("single-line-text-overflow"),
              (E.innerText = `${A.target.name}`),
              A.target.alternativeName &&
                (E.innerText += ` (${A.target.alternativeName})`),
              X.bindTooltip(E, {
                direction: "top",
                permanent: !0,
                offset: ft.point(0, Ti() >= 800 ? -15 : -10),
                opacity: 0.7,
              }).openTooltip();
          }),
          C.fitBounds(B.getBounds().pad(0.1));
      }, 50);
    Ld(() => {
      Ht(),
        je.subscribe((A) => {
          if (!A) return;
          const X = C.getCenter(),
            E = 4;
          if (
            !(le(X.lat, E) !== le(A.lat, E) || le(X.lng, E) !== le(A.lng, E))
          ) {
            C.zoomOut(1, { animate: !1 }),
              setTimeout(() => {
                tt(P ? {} : I);
              }, 250);
            return;
          }
          tt(P ? {} : I);
        }),
        qe.subscribe((A) => {
          A && tt(P ? {} : I);
        }),
        fn.subscribe((A) => {
          if ((z && (C.removeLayer(z), (z = null)), !A)) return;
          z = ft.marker(A).addTo(C);
          const X = C.getZoom(),
            E = 17;
          if (X < 18) {
            let q = Math.max(Math.min(X + 3, Wa), E);
            setTimeout(() => {
              if (!z) {
                console.warn("No chosenPointMarker, skipping map.flyTo");
                return;
              }
              C.flyTo(z.getLatLng(), q, { animate: !0, duration: 0.5 });
            }, 250);
          }
        }),
        jn.subscribe((A) => {
          if (A) {
            ee();
            return;
          }
          s && j();
        }),
        Se.subscribe((A) => {
          if (!A) {
            C.setMaxBounds(null).setMinZoom(ja),
              j(!1, !0),
              Fa(C),
              tt(I),
              P.setStyle(Ct);
            return;
          }
          wt();
        }),
        un.subscribe((A) => {
          A === "summary" ? fe() : s && j(!0, !0);
        }),
        Up.subscribe((A) => {
          A && j();
        });
    });
    const W = () => {
      window.innerWidth <= 1100 && S.set(!1);
    };
    function ct(A) {
      Ii[A ? "unshift" : "push"](() => {
        (F = A), r(0, F);
      });
    }
    return (
      (e.$$set = (A) => {
        "areSettingsShown" in A && r(2, (S = A.areSettingsShown));
      }),
      [F, W, S, ct]
    );
  }
  let H_ = class extends Ve {
    constructor(n) {
      super(), Ge(this, n, F_, Z_, Ee, { areSettingsShown: 2 }, null, [-1, -1]);
    }
  };
  const U_ = ({ lat: e, lon: n }) => ({ lat: e, lng: n }),
    j_ = [
      { name: "alley" },
      { name: "buses and taxis" },
      { name: "drive thru" },
      { name: "escalator" },
      { name: "treppe tiefgarage" },
      { name: "tunnel entrance street" },
      { name: "zugang steig" },
      { highways: ["service"], name: /^[0-9]+$/ },
      { highways: ["service"], name: /not in use/ },
    ],
    W_ = (e, n) => {
      if (e.tags.area == "yes") return !0;
      const r = n.flat(2),
        s = n.length - 1;
      return r[0].lat === r[s].lat && r[0].lng === r[s].lng;
    },
    Zr = (e, n) => !!(e && e !== n),
    q_ = (e, n) => {
      if (Zr(e.tags["name:ga"], n))
        return { languageCode: "ga", name: e.tags["name:ga"] };
      if (Zr(e.tags.old_name, n)) return { name: e.tags.old_name };
      if (Zr(e.tags.loc_name, n)) return { name: e.tags.loc_name };
    },
    G_ = (e) => {
      const n = { name: e.tags.name },
        r = q_(e, e.tags.name);
      return (
        r &&
          ((n.alternativeName = r.name),
          (n.alternativeNameLanguageCode = r.languageCode)),
        n
      );
    },
    gn = { [Ot.Tourist]: ["motorway", "primary", "secondary", "trunk"] };
  gn[Ot.Resident] = [...gn[Ot.Tourist], "cycleway", "tertiary"];
  gn[Ot.TaxiDriver] = [
    ...gn[Ot.Resident],
    "living_street",
    "pedestrian",
    "residential",
    "service",
    "steps",
    "unclassified",
  ];
  const V_ = (e, n) => {
      const r = [
          e,
          ...n.filter((f) => f.id !== e.id && f.tags.name === e.tags.name),
        ],
        s = r.map(({ geometry: f }) => f.map(U_));
      let a;
      const h = r
        .map(({ tags: f }) => {
          const p = f.width?.match(/^(\d+(\.\d+)?)( ?m)?$/);
          if (p) return parseFloat(p[1]);
        })
        .filter((f) => typeof f == "number");
      return (
        h.length && (a = h.reduce((f, p) => f + p, 0) / h.length),
        { ...G_(e), isEnclosedArea: W_(e, s), points: s, width: a }
      );
    },
    $_ = async ({ areaBounds: e, centerLatLng: n, radius: r }) => {
      const a = [
          le(e.getNorthWest().lat, 4),
          le(Ue(e.getNorthWest().lng), 4),
          le(e.getSouthEast().lat, 4),
          le(Ue(e.getSouthEast().lng), 4),
        ].join(","),
        l = `${r},${n.lat},${Ue(n.lng)}`,
        f = `^(${Object.values(gn)
          .map((S) => S)
          .flat()
          .join("||")})$`,
        p = [
          `api/interpreter?data=[out:json][bbox:${a}];`,
          "(",
          `way(around:${l})[highway~"${f}"][name];`,
          `way(around:${l})[historic~"^(castle|fort|monument|ruins|ship|tower)$"][name][wikidata];`,
          `way(around:${l})[tourism~"^(aquarium|museum|zoo)$"][name][wikidata];`,
          ");",
          "out%20tags%20geom;",
        ].join(""),
        _ = `overpass-response2__${p})`,
        v = pt(() => localStorage.getItem(_));
      if (
        (Object.entries(pt(() => localStorage) || {})
          .map(([S]) => S)
          .filter((S) => S !== _ && S.startsWith("overpass-response"))
          .forEach((S) => pt(() => localStorage.removeItem(S))),
        v)
      )
        try {
          return JSON.parse(v);
        } catch {}
      const m = await fetch(`https://www.overpass-api.de/${p}`);
      let w;
      try {
        w = await m.json();
      } catch {
        throw new Error("Cannot parse Overpass API response");
      }
      return pt(() => localStorage.setItem(_, JSON.stringify(w))), w;
    },
    Y_ = async ({
      areaBounds: e,
      centerLatLng: n,
      difficulty: r,
      radius: s,
      getRandomNumber: a,
      numberOfQuestions: l,
    }) => {
      const { elements: h } = await $_({
          areaBounds: e,
          centerLatLng: n,
          radius: s,
        }),
        f = [],
        p = {};
      for (const _ of h) {
        const v = _.tags.name?.toLowerCase();
        j_.some((m) =>
          _.tags.highway && m.highways && !m.highways.includes(_.tags.highway)
            ? !1
            : m.name instanceof RegExp
              ? m.name.test(v)
              : m.name === v,
        ) ||
          (_.tags.highway && !gn[r].includes(_.tags.highway)) ||
          (r !== Ot.TaxiDriver && _.tags.access === "private") ||
          (p[v] = _);
      }
      for (let _ = 0; _ < l; _++) {
        const v = Du(Object.keys(p), a);
        if (!v) break;
        f.push(p[v]), delete p[v];
      }
      return f.map((_) => V_(_, h));
    },
    K_ = (e) => {
      for (var n = 0, r = 1779033703 ^ e.length; n < e.length; n++)
        (r = Math.imul(r ^ e.charCodeAt(n), 3432918353)),
          (r = (r << 13) | (r >>> 19));
      return function () {
        return (
          (r = Math.imul(r ^ (r >>> 16), 2246822507)),
          (r = Math.imul(r ^ (r >>> 13), 3266489909)),
          (r ^= r >>> 16) >>> 0
        );
      };
    },
    X_ = (e, n, r, s) =>
      function () {
        (e >>>= 0), (n >>>= 0), (r >>>= 0), (s >>>= 0);
        var a = (e + n) | 0;
        return (
          (e = n ^ (n >>> 9)),
          (n = (r + (r << 3)) | 0),
          (r = (r << 21) | (r >>> 11)),
          (s = (s + 1) | 0),
          (a = (a + s) | 0),
          (r = (r + a) | 0),
          (a >>> 0) / 4294967296
        );
      },
    J_ = (e) => {
      const n = K_(e);
      return X_(n(), n(), n(), n());
    };
  let Fr;
  const Q_ = async ({
    areaCenter: e,
    areaBounds: n,
    difficulty: r,
    numberOfQuestions: s,
    radius: a,
  }) => {
    Li.set(!0), Fr || (Fr = J_(Ou(Co)));
    const l = await Y_({
      areaBounds: n,
      centerLatLng: e,
      difficulty: r,
      radius: a,
      getRandomNumber: Fr,
      numberOfQuestions: s,
    });
    if (l.length < s) {
      await $u(200);
      let h = "";
      r !== Ot.Tourist &&
        (h = " or increase the difficulty so more streets are included"),
        l.length < 5
          ? alert(
              `There aren't enough streets or points of interest in this area (minimum 5 required). Please select another area${h}`,
            )
          : alert(
              `There are only ${l.length} streets or points of interest in this area. Please reduce the "Questions per round" setting (currently set to ${s})${h}`,
            ),
        Se.set(!1),
        Li.set(!1);
      return;
    }
    Wt.set({
      areaBounds: n,
      questions: l.map((h, f) => ({
        target: h,
        index: f,
        status: f === 0 ? "ongoing" : "pending",
      })),
      status: "ongoing",
    }),
      Li.set(!1);
  };
  class tm extends HTMLElement {
    static observedAttributes = ["alt", "src"];
    _img = document.createElement("img");
    constructor() {
      super(), this._forwardEvents();
    }
    get alt() {
      return this.getAttribute("alt");
    }
    set alt(n) {
      this.setAttribute("alt", n);
    }
    attributeChangedCallback(n, r, s) {
      ["alt", "src"].includes(n) && this._img.setAttribute(n, s);
    }
    get complete() {
      return this._img.complete;
    }
    connectedCallback() {
      this.src && (this._img.src = this.src), this.appendChild(this._img);
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(n) {
      this.setAttribute("src", n),
        this.style.setProperty(
          "--sharp-img-css-background-image",
          this.src ? `url("${this.src}")` : "none",
        );
    }
    _forwardEvents() {
      ["load", "error"].forEach((r) => {
        this._img.addEventListener(r, (s) => {
          s.stopImmediatePropagation();
          const a = new s.constructor(s.type, s);
          this.dispatchEvent(a);
        });
      });
    }
  }
  function em() {
    customElements.define("sharp-img", tm);
  }
  function nm(e) {
    let n, r, s, a, l, h, f, p, _, v, m;
    function w(P) {
      e[2](P);
    }
    let S = {};
    return (
      e[1] !== void 0 && (S.areSettingsShown = e[1]),
      (n = new __({ props: S })),
      Ii.push(() => Md(n, "areSettingsShown", w)),
      (a = new H_({ props: { areSettingsShown: e[1] } })),
      (p = new Jp({})),
      (v = new Yp({})),
      {
        c() {
          ln(n.$$.fragment),
            (s = U()),
            ln(a.$$.fragment),
            (l = U()),
            (h = k("p")),
            (h.innerHTML =
              '<a href="#context-panel">Back to context panel</a>'),
            (f = U()),
            ln(p.$$.fragment),
            (_ = U()),
            ln(v.$$.fragment),
            T(h, "class", "hide-accessibly");
        },
        m(P, O) {
          Ze(n, P, O),
            D(P, s, O),
            Ze(a, P, O),
            D(P, l, O),
            D(P, h, O),
            D(P, f, O),
            Ze(p, P, O),
            D(P, _, O),
            Ze(v, P, O),
            (m = !0);
        },
        p(P, O) {
          const I = {};
          !r &&
            O & 2 &&
            ((r = !0), (I.areSettingsShown = P[1]), kd(() => (r = !1))),
            n.$set(I);
          const z = {};
          O & 2 && (z.areSettingsShown = P[1]), a.$set(z);
        },
        i(P) {
          m ||
            (Qt(n.$$.fragment, P),
            Qt(a.$$.fragment, P),
            Qt(p.$$.fragment, P),
            Qt(v.$$.fragment, P),
            (m = !0));
        },
        o(P) {
          ue(n.$$.fragment, P),
            ue(a.$$.fragment, P),
            ue(p.$$.fragment, P),
            ue(v.$$.fragment, P),
            (m = !1);
        },
        d(P) {
          P && (N(s), N(l), N(h), N(f), N(_)),
            Fe(n, P),
            Fe(a, P),
            Fe(p, P),
            Fe(v, P);
        },
      }
    );
  }
  function im(e) {
    let n, r;
    return (
      (n = new ju({ props: { error: e[0] } })),
      {
        c() {
          ln(n.$$.fragment);
        },
        m(s, a) {
          Ze(n, s, a), (r = !0);
        },
        p(s, a) {
          const l = {};
          a & 1 && (l.error = s[0]), n.$set(l);
        },
        i(s) {
          r || (Qt(n.$$.fragment, s), (r = !0));
        },
        o(s) {
          ue(n.$$.fragment, s), (r = !1);
        },
        d(s) {
          Fe(n, s);
        },
      }
    );
  }
  function rm(e) {
    let n, r, s, a;
    const l = [im, nm],
      h = [];
    function f(p, _) {
      return p[0] ? 0 : 1;
    }
    return (
      (r = f(e)),
      (s = h[r] = l[r](e)),
      {
        c() {
          (n = k("main")), s.c(), T(n, "class", "svelte-15wrgud");
        },
        m(p, _) {
          D(p, n, _), h[r].m(n, null), (a = !0);
        },
        p(p, [_]) {
          let v = r;
          (r = f(p)),
            r === v
              ? h[r].p(p, _)
              : (Iu(),
                ue(h[v], 1, 1, () => {
                  h[v] = null;
                }),
                zu(),
                (s = h[r]),
                s ? s.p(p, _) : ((s = h[r] = l[r](p)), s.c()),
                Qt(s, 1),
                s.m(n, null));
        },
        i(p) {
          a || (Qt(s), (a = !0));
        },
        o(p) {
          ue(s), (a = !1);
        },
        d(p) {
          p && N(n), h[r].d();
        },
      }
    );
  }
  function om(e, n, r) {
    let s, a, l, h, f, p, _, v, m, w;
    it(e, xi, (M) => r(4, (s = M))),
      it(e, Wt, (M) => r(5, (a = M))),
      it(e, Hu, (M) => r(6, (l = M))),
      it(e, Fu, (M) => r(7, (h = M))),
      it(e, qe, (M) => r(8, (f = M))),
      it(e, Yn, (M) => r(9, (p = M))),
      it(e, je, (M) => r(10, (_ = M))),
      it(e, Kn, (M) => r(11, (v = M))),
      it(e, to, (M) => r(12, (m = M))),
      it(e, Zu, (M) => r(13, (w = M)));
    let { unhandledError: S = null } = n;
    em();
    let P = bt(!1),
      O;
    const I = Qr(
      () => {
        history.replaceState(null, "", w);
      },
      250,
      { trailing: !0 },
    );
    je.subscribe((M) => {
      if (M) {
        if (!M.lng)
          throw (
            (console.error(typeof M, M),
            new Error("areaCenter:setItem, lng doesn't exist"))
          );
        I(), Dt({ name: "area-center-moved", title: "Area center moved" });
      }
    }),
      qe.subscribe((M) => {
        M && I();
      }),
      Yn.subscribe(() => I()),
      Kn.subscribe((M) => {
        M && I();
      }),
      Se.subscribe(async (M) => {
        if (M) {
          if (!m) throw new Error("no areaBounds");
          Q_({
            areaBounds: m,
            areaCenter: _,
            difficulty: p,
            numberOfQuestions: v,
            radius: f,
          }),
            pt(() => {
              localStorage.setItem("centerLatLng", JSON.stringify(_)),
                localStorage.setItem("difficulty", p),
                localStorage.setItem("radius", f.toString());
            });
        }
      }),
      Wi.subscribe((M) => {
        M &&
          M.status === "complete" &&
          !h &&
          a &&
          a.status !== "complete" &&
          Wt.update((C) => {
            if (!C) throw new Error("round is falsy");
            return { ...C, status: "complete" };
          });
      }),
      Wt.subscribe((M) => {
        if (
          M &&
          (M.seed && M.seed !== O && (I(), (O = M.seed)),
          M.status === "complete")
        ) {
          if (!a) throw new Error("round is falsy");
          if (!l) throw new Error("totalScore is falsy");
          const C = no(l, a);
          C > (s ?? 0) &&
            (xi.set(C),
            Wt.update((F) => {
              if (!F) throw new Error("round is falsy");
              return { ...F, didSetNewDeviceBestScore: !0 };
            }));
        }
      }),
      xi.subscribe((M) => {
        M && pt(() => localStorage.setItem("deviceBestScore", M.toString()));
      });
    function z(M) {
      (P = M), r(1, P);
    }
    return (
      (e.$$set = (M) => {
        "unhandledError" in M && r(0, (S = M.unhandledError));
      }),
      [S, P, z]
    );
  }
  class sm extends Ve {
    constructor(n) {
      super(), Ge(this, n, om, rm, Ee, { unhandledError: 0 });
    }
  }
  yd();
  let Ei;
  const zo = (e) => {
    if (Ei) {
      Ei.$set({ unhandledError: (e && (e.error || e.reason)) || e });
      return;
    }
    Ei = new ju({ props: { error: e }, target: document.body });
  };
  window.addEventListener("error", zo);
  const qa = window.onunhandledrejection;
  window.onunhandledrejection = (e) => {
    zo(e), qa && qa.call(window, e);
  };
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
  });
  try {
    Ei = new sm({ target: document.body });
  } catch (e) {
    zo(e);
  }
});
export default am();
