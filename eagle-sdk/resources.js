import {onload} from './util.js';

// 过滤无效数据
function filterTime(a, b) {
  return (a > 0 && b > 0 && (a - b) >= 0) ? (a - b) : undefined;
}

let resolvePerformanceTiming = (timing) => {
  let o = {
    initiatorType: timing.initiatorType,
    name: timing.name,
    duration: parseInt(timing.duration),

    // 连接过程
    redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
    dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
    connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
    network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时

    // 接受过程
    send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
    receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
    request: filterTime(timing.responseEnd, timing.requestStart), // 总时间

    // 核心指标
    ttfb: filterTime(timing.responseStart, timing.requestStart), // 首字节时间
  };

  return o;
};

// 帮助循环获得每一个资源的性能数据
let resolveEntries = (entries) => entries.map(item => resolvePerformanceTiming(item));

// 存在资源监控策略问题
// 是否所有的资源都需要监控，比如 首屏的轮播图，
let resources = {
  init: (cb) => {
    let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
    if (!performance || !performance.getEntries) {
      return void 0;
    }

    // 观察性能资源，来一个，就执行一次，效率高，但是兼容性不是很好
    // 因此，如果没有此方法，统一在onload 事件之后收集性能数据
    if (window.PerformanceObserver) {
      let observer = new window.PerformanceObserver((list) => {
        try {
          let entries = list.getEntries();
          // 将数据传递出去即可
          cb(resolveEntries(entries));
        } catch (e) {
          console.error(e);
        }
      });
      observer.observe({
        entryTypes: ['resource']
      })
    } else {
      onload(() => {
        let entries = performance.getEntriesByType('resource');
        // 将数据传递出去即可
        cb(resolveEntries(entries));
      });
    }
  },
};

export default resources;
