module.exports = async (ctx, next) => {
  if (ctx.status !== 404) return await next();

  // render 404 page
}
