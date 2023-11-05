const Koa = require('koa');
const app = module.exports = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

handlers.forEach(handler => require('./handlers/' + handler).init(app));

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/users'
});

const User = require('./libs/user');

router
  .param('userById', async (id, ctx, next) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.throw(404);
    }

    ctx.userById = await User.findById(id);

    if (!ctx.userById) {
      ctx.throw(404, 'user with this id not found');
    }

    await next();
  })
  .post('/', async function(ctx) {
    let user = await User.create(pick(ctx.request.body, User.publicFields));

    // userSchema.options.toObject.transform hides __v
    ctx.body = user.toObject();
  })
  // {asd: asdasd, asdasd: asdasd, email: }
  // {email: ''}
  .patch('/:userById', async function(ctx) {
    Object.assign(ctx.userById, pick(ctx.request.body, User.publicFields));
    await ctx.userById.save();

    ctx.body = ctx.userById.toObject();
  })
  .get('/:userById', async function(ctx) {
    ctx.body = ctx.userById.toObject();
  })
  .del('/:userById', async function(ctx) {
    await ctx.userById.remove();
    ctx.body = 'ok';
  })
  .get('/', async function(ctx) {
    let users = await User.find({}); // .lean(), but better do it on output

    ctx.body = users.map(user => user.toObject());
  });


app.use(router.routes());
