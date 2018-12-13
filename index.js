const Koa = require('koa')
const router = require('./routes')
const render = require('koa-art-template')
const serve = require('koa-static')
const path = require('path')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const marked = require('marked')
const flash = require('./middlewares/flash')
const error = require('./middlewares/error_handler')
const app = new Koa()
// 错误处理中间件，套在最外层，相当于捕获所有后续代码的异常
app.use(error())
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
// 静态资源服务中间件放在路由后面会导致，先执行路由中的代码。原来的404判断在所有判断之后，会把静态资源也当做html渲染
app.use(serve(
  path.join(__dirname, 'public')
))
router(app)
// 监听程序跑出的error事件
app.on('error', (err, ctx) =>
  console.error('server error', err)
)

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
