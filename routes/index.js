const router = require('koa-router')()
const user = require('./user.js')

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
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
