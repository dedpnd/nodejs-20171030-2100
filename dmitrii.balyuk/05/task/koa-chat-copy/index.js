'use strict';

if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const {EventEmitter} = require('events');

const config = require('config');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

// ---------------------------------------

const Router = require('koa-router');

const router = new Router();

// const clients = [];
const ee = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  try {
    const message = await new Promise((resolve, reject) => {
      // clients.push(resolve);
      ee.once('message', resolve);

      // ctx.req, ctx.res
      ctx.res.on('close', () => {
        ee.removeListener('message', resolve);

        // resolve(); | reject(new Error('...'))
        reject(new Error('closed'));
      });
    });

    ctx.body = message;
  } catch(err) {
    if (err.message === 'closed') return;

    throw err;
  }
});

router.post('/publish', async (ctx, next) => {
  // clients.forEach(resolve => {
    // resolve(ctx.request.body.message);
  // });
  // clients = [];

  if (!ctx.request.body.message) {
    ctx.throw(400, 'message is required');
    return;
  }

  ee.emit('message', ctx.request.body.message);

  ctx.body = 'Ok';
});

app.use(router.routes());

app.listen(3000);
