const PostModel = require('../models/post')
module.exports = {
  async index (ctx, next) {
    // console.log(ctx);
    // console.log(ctx.session);
    const pageSize = 15
    const currentPage = parseInt(ctx.query.page) || 1
    const allPostsCount = await PostModel.count()
    const pageCount = Math.ceil(allPostsCount / pageSize)
    const posts = await PostModel.find({}).skip((currentPage - 1) * pageSize).limit(pageSize)
    console.log(posts)
    await ctx.render('index', {
      title: 'abc-blog',
      desc: 'a simple blog',
      posts,
      currentPage,
      pageCount
      // session:ctx.session
    })
  }
}
