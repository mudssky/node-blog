const Koa = require('koa')
const router = require('./routes')
const render = require('koa-art-template')
const serve = require('koa-static')
const path = require('path')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')
const app = new Koa()
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
app.keys = ['somethings']

app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))
app.use(bodyParser())
mongoose.connect(CONFIG.mongodb)

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

// 配置ctx.state以便在模板引擎中能够使用
app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  await next()
})

router(app)
app.use(serve(
  path.join(__dirname, 'public')
))
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
