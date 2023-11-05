// аутентификацию пользователя через ajax форму
// регистрацию пользователя

if (process.env.TRACE) {
    require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();
const mongoose = require('./modules/mongo/connection');

const Router = require('koa-router');
const router = new Router();

const path = require('path');
const fs = require('mz/fs');

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
const config = require('config');

const users = require('./modules/mongo/users');
const passport = require('koa-passport');
const uniqid = require('uniqid');
const sendMail = require('./libs/sendMail');

const handlers = ['02-static', '03-logger', '04-templates', '06-session', '07-bodyParser', '05-errors', '08-passportInitialize', '09-passportSession', '10-flash'];
handlers.forEach(handler => {
    const h = require('./handlers/' + handler);
    h.init(app);
});

router.get('/api/views', async function(ctx, next) {
    /**FOR TEST KOA */
    let count = ctx.session.count || 0;
    ctx.session.count = ++count;

    ctx.body = ctx.render(path.join(__dirname, './templates/index.pug'), {
        user: 'John',
        count
    });
});

/** GitHub authenticate
 *  without authenticate */

router.get('/login/github', passport.authenticate('github'));

router.get('/oauth/github', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

// login
router.get('/login/facebook', passport.authenticate('facebook', {
    display: 'popup',
    scope: ['email']
}));
// connect with existing profile
router.get('/connect/facebook', passport.authorize('facebook', {
    display: 'popup',
    scope: ['email']
}));

// http://stage.javascript.ru/auth/callback/facebook?error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied#_=_
router.get('/oauth/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true // req.flash
}));

router.get('/', async(ctx) => {
    /**от куда isAuthenticated ? */
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.render('welcome')
    } else {
        ctx.body = ctx.render('login');
    }
})

router.post('/login', async(ctx, next, info) => {
    await passport.authenticate('local', async function(err, user, info) {
        if (err) throw err;
        if (user === false) {
            ctx.status = 401;
            ctx.body = { error: info };
        } else {
            ctx.body = 'OK';
            await ctx.login(user);
        }
    })(ctx, next);
})

router.post('/logout', async(ctx) => {
    /**от куда logout ? */
    ctx.logout();
    ctx.session = null; // destroy session (!!!)    
    ctx.redirect('/');
})

/**API USERS */
router.get('/api/users/verify/:token', async(ctx) => {
    let user = await users.findOne({ 'token': ctx.params.token });
    if (!user) {
        ctx.body = "Not found user";
        return
    }
    user.verify = true;
    await user.save();
    ctx.body = 'OK';
})

router.get('/api/users', async(ctx) => {
    ctx.body = await users.find({})
});

router.get('/api/users/:id', async(ctx) => {
    let user = await users.find({ _id: ctx.params.id });
    if (user.length < 1) {
        ctx.throw(404, `Not find: ${ctx.params.id}`)
    }

    ctx.body = user;
})

router
    .param('users', async(ctx, next) => {
        let data = ctx.request.body;
        if (!(
                (Object.keys(data).length == 3) &&
                (data.hasOwnProperty('displayName')) &&
                (data.hasOwnProperty('email')) &&
                (data.hasOwnProperty('password'))
            )) {
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
        await next()
    })
    .post('/api/users', async(ctx) => {
        let data = ctx.request.body;
        let token = uniqid();
        try {
            let newUser = new users({
                displayName: data.displayName,
                email: data.email,
                password: data.password,
                token: token
            })
            await newUser.save()
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
                console.log(err)
            }
            return
        }

        /**Letter for varify */
        let letter = await sendMail({
            template: 'verify',
            subject: 'Подтвердите email',
            to: data.email,
            name: data.displayName,
            verify: 'http://localhost:3000/api/users/verify/' + token
        });

        ctx.body = "OK";
    })
    .patch('/api/users/:id', async(ctx) => {
        /**TODO update password */
        let user = await users.find({ _id: ctx.params.id });
        let data = ctx.request.body;

        if (user.length < 1) {
            ctx.throw(404, `Not find: ${ctx.params.id}`)
        }

        /**Вынести бы обработчик ошибок монги в hanflers 05-error.js, 
         * но как определить, что эта ошибка из монги ? */
        try {
            await users.update({ _id: ctx.params.id }, {
                displayName: data.displayName,
                email: data.email
            })
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
                console.log(err)
            }
            return
        }

        ctx.body = "OK"
    })

router.delete('/api/users/:id', async(ctx) => {
    let user = await users.find({ _id: ctx.params.id });

    if (user.length < 1) {
        ctx.throw(404, `Not find: ${ctx.params.id}`)
    }

    users.remove({ _id: ctx.params.id });
    ctx.body = "OK"
})

app.use(router.routes());

module.exports = app;

//ctx.body = await fs.readFileSync(path.join(__dirname, 'public/index.html'));