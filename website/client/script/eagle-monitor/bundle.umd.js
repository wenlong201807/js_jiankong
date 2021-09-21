(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming

/**
 * 面向切面编程
 * 在原型上扩展自定义需要的内容
 * 自身的请求不用拦截，否则形成循环上报
*/

// /html/body/div[2]/ul/li[2]

var getXpath = function getXpath(element) {
  if (!(element instanceof Element)) {
    return void 0;
  }

  if (element.nodeType !== 1) {
    return void 0;
  }

  var rootElement = document.body;
  if (element === rootElement) {
    return void 0;
  }

  // 这里可以做选择，按需确定哪些标签，哪些元素需要上报，埋点
  var childIndex = function childIndex(ele) {
    var parent = ele.parentNode;
    var children = [].slice.call(parent.childNodes).filter(function (_) {
      return _.tagName === ele.tagName;
    });
    var i = 0;
    for (var _i = 0, len = children.length; _i < len; _i++) {
      if (children[_i] === ele) {
        i = _i + 1;
        break;
      }
    }
    return i === 0 ? '' : '[' + i + ']';
  };

  var xpath = '';

  while (element !== document.body) {
    var tag = element.tagName.toLocaleLowerCase();
    var eleIndex = childIndex(element);
    xpath = '/' + tag + eleIndex + xpath;
    element = element.parentNode;
  }

  return xpath;
};

var behavior = {
  init: function init(cb) {
    cb();
    document.addEventListener('click', function (e) {
      var xpath = getXpath(e.target);
      console.log('xpath: ', xpath);
    }, false);
  }

  // document.querySelector("body > div.box-wrap > ul > li:nth-child(1)")

  // /html/body/div[2]/ul/li[1]

};

behavior.init(function () {
  console.log('behavior init');
});

// 上传服务端, 性能损耗小，体积小
// new Image('url')

})));
//# sourceMappingURL=bundle.umd.js.map
