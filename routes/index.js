const router = require('koa-router')()
const user = require('./user.js')
const post = require('./posts')

module.exports = (app) => {
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
  router.get('/posts/new', post.create)
  router.post('/posts/new', post.create)
  router.get('/posts/:id', post.show)
  router.get('/posts/:id/edit', post.edit)
  router.post('/posts/:id/edit', post.edit)
  // router.get('/posts/new', post.show)
  router.get('/posts/:id/delete', post.destroy)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
