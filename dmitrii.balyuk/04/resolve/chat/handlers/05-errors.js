exports.init = app => app.use(async(ctx, next) => {
    try {
        if (/publish/.test(ctx.url) && ctx.request.body.message.length <= 0) {
            ctx.status = 400;
            ctx.body = "No message"
        } else {
            await next();
        }
    } catch (e) {
        if (e.status) {
            // could use template methods to render error page
            ctx.body = e.message;
            ctx.status = e.status;
        } else if (e.status == 413) {
            ctx.body = "Your message is too big for my little chat";
        } else {
            ctx.body = 'Error 500';
            ctx.status = 500;
            console.error(e.message, e.stack);
        }

    }
});