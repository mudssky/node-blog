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
const marked = require('marked')
const flash = require('./middlewares/flash')

app.use(flash())

// 在模板引擎中要用到marked，绑定到ctx.state上
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false,
  // If true, sanitize the HTML passed into markdownString with the sanitizer function.开启这个选项帮我们对html进行转义，防止xss攻击
  sanitize: true
})
app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.marked = marked
  ctx.state.log = console.log
  await next()
})

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
// 配置全局变量__HOST__作为脚本引入的固定地址
app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host
  await next()
})

router(app)
app.use(serve(
  path.join(__dirname, 'public')
))
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
