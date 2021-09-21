let endlessLoop = sleep => {
  let curTime = Date.now();
  while (true) {
    if (Date.now() - curTime >= sleep) {
      break;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // endlessLoop(1000);
}, false);

window.addEventListener('load', () => {
  // endlessLoop(500);
}, false);

setTimeout(() => {
  let src = './images/benqijiemu.jpg';
  let imgEle = document.createElement('img');
  imgEle.src = src;
  imgEle.className = 'img avatar';
  document.body.appendChild(imgEle);
}, 5000);

// a - b -3

// Promise.reject('promise rej');
// 页面访问 http://localhost:3003/ 即可进入调试
$.ajax({
  url: 'http://localhost:3003/api/list',
  method: 'post',
  data: JSON.stringify({
    a: 'a',
    b: 'b',
  })
}).then((res) => {
  // console.log('res-ajax上报内容展示:', res)
  // debugger
}).catch((err) => {
  // debugger
});

fetch('http://localhost:3003/api/list').then((res) => {
  // debugger
  // console.log('res-fetch上报内容展示:', res)
});

// 错误上报举例
// a = b + v;  // Uncaught ReferenceError: b is not defined
