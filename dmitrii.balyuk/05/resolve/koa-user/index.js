/*
REST-сервис для юзеров на Koa.JS + Mongoose

User имеет уникальный email, а также даты создания и модификации и имя displayName.
{done}

GET /users/:id - получить юзера по id, например: /users/57ffe7300b863737ddfe9a39
{done}

GET /users - получить массив юзеров
{done}

POST /users - создать пользователя
  Метод POST позволяет указать только email и displayName (нельзя при создании юзера указать его _id)
{done}

PATCH /users/:id - модифицировать пользователя
  Метод PATCH позволяет поменять только email и displayName (нельзя при создании юзера указать его _id)
{done}
  
DELETE /users/:id - удалить пользователя
{done}

Если юзера с данным :id нет:
   метод возвращает 404
{done}

Если ошибка валидации (напр. не указан email) или уникальности:
  метод возвращает 400 и объект с ошибками вида { errors: { field: error } }
  пример:
    {
      errors: {
        email: 'Такой email уже есть'
      }
    }
{done}

Желательно, с тестами.
{ ¯\_(ツ)_/¯ }
*/

if (process.env.TRACE) {
    require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();

const path = require('path');
const fs = require('mz/fs');

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
const config = require('config');

const users = require('./modules/mongo/users');

const handlers = ['02-static', '03-logger', '04-templates', '06-session', '07-bodyParser', '05-errors'];
handlers.forEach(handler => {
    const h = require('./handlers/' + handler);
    h.init(app);
});

app.use(async(ctx, next) => {
    if (/(POST|PATCH)/.test(ctx.method)) {
        let data = ctx.request.body;
        if (!((Object.keys(data).length == 2) && (data.hasOwnProperty('displayName')) && (data.hasOwnProperty('email')))) {
            ctx.status = 400;
            ctx.body = {
                "status": "bad request",
                "example": {
                    "displayName": "<name>",
                    "email": "<example@example.com>"
                }
            }
            return
        }
    }
    await next()
})

router.get('/views', async function(ctx, next) {
    /**FOR TEST KOA */
    let count = ctx.session.count || 0;
    ctx.session.count = ++count;

    ctx.body = ctx.render(path.join(__dirname, './templates/index.pug'), {
        user: 'John',
        count
    });
});

router.get('/users', async(ctx) => {
    ctx.body = await users.getAllUsers();
});

router.get('/users/:id', async(ctx) => {
    let user = await users.getUser(ctx.params.id);
    if (user.length < 1) {
        ctx.throw(404, `Not find: ${ctx.params.id}`)
    }

    ctx.body = user;
})

router.post('/users', async(ctx) => {
    let data = ctx.request.body;

    try {
        await users.addUser(data.displayName, data.email);
    } catch (err) {
        ctx.status = 400
        if (err.hasOwnProperty('errors')) {
            let field = Object.keys(err.errors)[0],
                discription = err.errors[field].properties
            ctx.body = {
                errors: {
                    [field]: discription
                }
            }
        } else {
            ctx.body = err
        }
        return
    }

    ctx.body = "OK";
})

router.patch('/users/:id', async(ctx) => {
    let user = await users.getUser(ctx.params.id);
    let data = ctx.request.body;

    if (user.length < 1) {
        ctx.throw(404, `Not find: ${ctx.params.id}`)
    }

    /**Вынести бы обработчик ошибок монги в hanflers 05-error.js, 
     * но как определить, что эта ошибка из монги ? */
    try {
        await users.updateUser(ctx.params.id, data.displayName, data.email)
    } catch (err) {
        ctx.status = 400
        if (err.hasOwnProperty('errors')) {
            let field = Object.keys(err.errors)[0],
                discription = err.errors[field].properties
            ctx.body = {
                errors: {
                    [field]: discription
                }
            }
        } else {
            ctx.body = err
        }
        return
    }

    ctx.body = "OK"
})

router.delete('/users/:id', async(ctx) => {
    let user = await users.getUser(ctx.params.id);

    if (user.length < 1) {
        ctx.throw(404, `Not find: ${ctx.params.id}`)
    }

    users.removeUser(ctx.params.id)
    ctx.body = "OK"
})

app.use(router.routes());

module.exports = app;

//ctx.body = await fs.readFileSync(path.join(__dirname, 'public/index.html'));