# 参考资料

1. https://zhuanlan.zhihu.com/p/43746227
2. https://segmentfault.com/a/1190000014479800

## 首字节性能

1. 后端问题

## performance 关键词的含义说明

- navigationStart 前一个网页卸载的时间  fetchStart
- unloadEventStart 前一个网页的unload事件开始 0
- unloadEventEnd 前一个网页的unload事件结束 0

- redirectStart 重定向开始时间
- redirectEnd 重定向结束时间

### 服务端优化事项

- fetchStart 开始请求网页
- domainLookupStart dns查询开始 fetchStart
- domainLookupEnd dns查询结束 fetchStart
- connectStart 向服务器建立握手开始 fetchStart
- connectEnd 向服务器建立握手结束 fetchStart
- secureConnectionStart 安全握手开始 0  非https的没有
- requestStart 向服务器发送请求开始
- responseStart 服务器返回数据开始
- responseEnd 服务器返回数据结束

### 客户端优化事项

- domLoading 解析dom开始  document.readyState 为loading
- domInteractive 解析dom结束 document.readyState 为 interactive
- domContentLoadedEventStart ContentLoaded开始
- domContentLoadedEventEnd ContentLoaded结束
- domComplete 文档解析完成
- loadEventStart load事件发送前
- loadEventEnd load事件发送后

## 资源监控

- performance.getEntries()
