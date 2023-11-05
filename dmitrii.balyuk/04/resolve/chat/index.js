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

const handlers = ['02-static', '03-logger', '04-templates', '06-session', '07-bodyParser', '05-errors'];
handlers.forEach(handler => {
    const h = require('./handlers/' + handler);
    h.init(app);
});

let clients = [];

router.get('/views', async function(ctx, next) {
    /**FOR TEST KOA */
    let count = ctx.session.count || 0;
    ctx.session.count = ++count;

    ctx.body = ctx.render(path.join(__dirname, './templates/index.pug'), {
        user: 'John',
        count
    });
});

router.get('/', async function(ctx) {
    ctx.body = await fs.readFileSync(path.join(__dirname, 'public/index.html'));
});

router.get('/subscribe', async(ctx, next) => {
    let p1 = waitPost();
    let clietsObj = { "ctx": ctx, "promise": p1 }

    clients.push(clietsObj);

    ctx.res.on('close', () => {
        console.log("Client close");
        clients.indexOf(clietsObj, 1)
        p1(true).then((timer) => { clearInterval(timer) });
    })

    await p1()
})

router.post('/publish', async(ctx, next) => {
    let message = ctx.request.body.message;

    clients.forEach(function(a) {
        a.promise(true).then((timer) => { clearInterval(timer) })
        a.ctx.set('Cache-Control', "no-cache, no-store, private");
        a.ctx.body = message;
    });

    clients.length = 0;
    ctx.body = 'OK'
    await next
})

function waitPost() {
    let _promise = null
    let _resolve = null

    return function(condition) {
        _resolve = condition
        if (condition) return _promise
        let p1 = new Promise(async(res, rej) => {
            let timer = setInterval(() => {
                //console.log("Timer:on")
                if (_resolve) res(timer)
            }, 1000);
        });
        _promise = p1
        return _promise
    }
}

app.use(router.routes());

module.exports = app;