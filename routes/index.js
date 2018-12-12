const router = require('koa-router')()
const user = require('./user.js')
const post = require('./posts')
const comment = require('./comments')
module.exports = (app) => {
  async function isLoginUser (ctx, next) {
    if (!ctx.session.user) {
      ctx.flash = { warning: '未登录, 请先登录' }
      return ctx.redirect('/signin')
    }
    await next()
  }
  async function isAdmin (ctx, next) {
    /*
    console.log(ctx.session)
    if (!ctx.session.user) {
      ctx.flash = { warning: '未登录, 请先登录' }
      return ctx.redirect('/signin')
    } */
    if (!ctx.session.user.isAdmin) {
      ctx.flash = { warning: '没有权限' }
      return ctx.redirect('back')
    }
    await next()
  }

  router.get('/', require('./home').index)
  // router.get('/about', require('./about').index)
  router.get('/about', async (ctx) => {
    await ctx.render('about', {
      content: 'about'
    })
  })
  // 注册
  router.get('/signup', user.signup)
  router.post('/signup', user.signup)
  // 登录
  router.get('/signin', user.signin)
  router.post('/signin', user.signin)
  router.get('/signout', user.signout)
  // 文章
  router.get('/posts/new', isLoginUser, isAdmin, post.create)
  router.post('/posts/new', isLoginUser, isAdmin, post.create)
  router.get('/posts/:id', post.show)
  router.get('/posts/:id/edit', post.edit)
  router.post('/posts/:id/edit', post.edit)
  // router.get('/posts/new', post.show)
  router.get('/posts/:id/delete', post.destroy)

  // 评论
  router.post('/comments/new', isLoginUser, comment.create)
  router.get('/comments/:id/delete', isLoginUser, comment.destroy)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
