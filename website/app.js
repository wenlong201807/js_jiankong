let Koa = require('koa');
let Serve = require('koa-static');
const API = require('./middleware/api.js')
// const SouceMap = require('./middleware/sourceMap.js') // 引入

const app = new Koa();
const port = 3003;

// app.use((c) => {
//   c.body = 123
// })
// 修改此文件需要重启，可以监听子文件，但是这个文件本身的变化，无法监听到
app.use(API)
// app.use(SouceMap) // 使用
app.use(Serve(__dirname + '/client'))

app.listen(port, () => {
  console.log(`${port} is listen66`);
});
