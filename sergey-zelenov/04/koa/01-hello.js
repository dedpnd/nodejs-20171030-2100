// The simplest example of Koa

const Koa = require('koa'); // const {Server} = require('http');

const app = new Koa(); // const app = new Server();

/**
 * Основные объекты:
 * ctx.req / ctx.res
 * ctx.request / ctx.response
 * ctx (контекст)
 *
 * Основные методы:
 * ctx.set/get
 * ctx.body=
 */
app.use(async function(ctx) {

  /* sleep(1000); */
  await new Promise(res => setTimeout(res, 1000));

  // ctx.response.body = "hello"
  ctx.body = "hello"; // {result: "hello"}

  await next();

});

app.listen(3000);
