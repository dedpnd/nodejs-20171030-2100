// no templates in ctx example
const pug = require('pug');
const path = require('path');

exports.init = app => app.use(async(ctx, next) => {

    /* default helpers */
    ctx.locals = {
        /* at the time of ctx middleware, user is unknown, so we make it a getter */
        get user() {
            return ctx.req.user; // passport sets ctx
        },

        get flash() {
            return ctx.getFlashMessages();
        }
    };

    ctx.render = function(templatePath, locals) {
        locals = locals || {};
        // use inheritance for all getters to work
        const localsFull = Object.create(ctx.locals);

        for (const key in locals) {
            localsFull[key] = locals[key];
        }

        const templatePathResolved = path.join(__dirname, '../templates/', templatePath + '.pug');

        return pug.renderFile(templatePathResolved, localsFull);
    };

    await next();

});