!(function (e) {
  var t,
    n,
    c,
    o,
    i,
    l =
      '<svg><symbol id="icon-ai-up-img" viewBox="0 0 1024 1024"><path d="M973.609745 750.236863 853.432379 750.236863 853.432379 630.039569c0-26.709513-20.033381-46.743891-46.743891-46.743891s-46.743891 20.034377-46.743891 46.743891l0 126.87542L626.391052 756.914989c-26.709513 0-46.743891 20.033381-46.743891 46.743891s20.033381 46.743891 46.743891 46.743891l126.87542 0 0 126.855492c0 26.709513 20.033381 46.743891 46.743891 46.743891 26.709513 0 46.743891-20.034377 46.743891-46.743891L846.754254 850.40277 973.609745 850.40277c26.711506 0 46.743891-20.032384 46.743891-46.743891C1027.031761 776.949366 1000.322248 750.236863 973.609745 750.236863L973.609745 750.236863 973.609745 750.236863zM505.222231 871.609954 505.222231 871.609954 87.137882 871.609954c-15.500585 0-27.135989-11.634407-27.135989-27.175846l0-759.112174c0-15.511546 11.635403-27.145953 27.135989-27.145953l740.858431 0c15.47966 0 27.11606 11.635403 27.11606 27.145953l0 410.313131 0 0 0 0c0 15.500585 11.656329 27.136985 27.176843 27.136985 15.499589 0 27.135989-11.6364 27.135989-27.136985l0 0 0 0L909.425205 58.176977c0-31.031064-27.135989-58.178014-58.177017-58.178014L60.000897-0.001036C28.979797-0.001036 1.82388 27.145913 1.82388 58.176977l0 813.432977c0 31.001171 27.155918 58.157088 58.177017 58.157088l445.221334 0 0 0c15.499589 0 27.135989-11.656329 27.135989-27.155918C532.356226 883.224433 520.720823 871.609954 505.222231 871.609954L505.222231 871.609954 505.222231 871.609954zM499.513639 736.881608c20.033381-40.065765 66.777271-66.777271 113.521162-66.777271l53.42102 0 0-60.098149c0-53.422016 33.389632-100.165907 80.132526-120.198291l0 0 0 0-66.776275-200.319857-233.718457 300.485763-66.777271-106.843036L132.261565 736.881608 499.513639 736.881608 499.513639 736.881608 499.513639 736.881608zM379.316344 309.51046c0-40.054804-33.388636-73.444436-73.453404-73.444436s-73.454401 33.389632-73.454401 73.444436c0 40.066761 33.388636 73.454401 73.454401 73.454401S379.316344 349.577221 379.316344 309.51046L379.316344 309.51046 379.316344 309.51046z" fill="#ffffff" ></path></symbol></svg>',
    d = (d = document.getElementsByTagName("script"))[
      d.length - 1
    ].getAttribute("data-injectcss"),
    s = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (d && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function a() {
    i || ((i = !0), c());
  }
  function r() {
    try {
      o.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(r, 50);
    }
    a();
  }
  (t = function () {
    var e,
      t = document.createElement("div");
    (t.innerHTML = l),
      (l = null),
      (t = t.getElementsByTagName("svg")[0]) &&
        (t.setAttribute("aria-hidden", "true"),
        (t.style.position = "absolute"),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = "hidden"),
        (t = t),
        (e = document.body).firstChild ? s(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((c = t),
        (o = e.document),
        (i = !1),
        r(),
        (o.onreadystatechange = function () {
          "complete" == o.readyState && ((o.onreadystatechange = null), a());
        }));
})(window);
