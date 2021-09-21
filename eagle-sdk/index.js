import perf from './perf.js';
import resources from './resources.js';
import errorCatch from './errorCatch.js';
import xhrHook from './xhr.js';
import behavior from './behavior.js';

// console.log('测试可有热更新效果 h1 wacth...更新毫秒数')
// perf.init((perfData) => {
//   // console.log('perf', perfData);
// });

// resources.init((list) => {
//   // console.log('resources', list);
//   // console.log('resources', list.length === 1 ? list[0] : list);
// });

// errorCatch.init((err) => {
//   console.log('errorCatch', err);
// });

// xhrHook.init((xhrInfo) => {
//   console.log(xhrInfo);
// });

behavior.init(() => {
  console.log('behavior init');
});

// 上传服务端, 性能损耗小，体积小
// new Image('url')