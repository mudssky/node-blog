// routes/home.js
module.exports = {
  async index (ctx, next) {
    // console.log(ctx);
    // console.log(ctx.session);
    await ctx.render('index', {
      title: 'abc-blog',
      desc: 'a simple blog'
      // session:ctx.session
    })
  }
}
