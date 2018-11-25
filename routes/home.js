const PostModel = require('../models/post')
module.exports = {
  async index (ctx, next) {
    // console.log(ctx);
    // console.log(ctx.session);
    const posts = await PostModel.find({})
    console.log(posts)
    await ctx.render('index', {
      title: 'abc-blog',
      desc: 'a simple blog',
      posts
      // session:ctx.session
    })
  }
}
