let Koa = require('koa');
let Serve = require('koa-static');

const app = new Koa();
const port = 3003;

app.use((c) => {
  c.body = 123
})
app.use(Serve(__dirname + './client'))

app.listen(port, () => {
  console.log(`${port} is listen`);
});
