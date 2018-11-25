const UserModel = require('../models/user')
const bcrypt = require('bcryptjs')
module.exports = {
  async signup (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signup', {
        title: '用户注册'
        // session: ctx.session
      })
      return
    }
    // 生成salt
    const salt = await bcrypt.genSalt(10)
    let { username, email, password } = ctx.request.body
    // TODO 合法性校验
    // 对密码进行加密
    password = await bcrypt.hash(password, salt)
    const user = {
      username,
      email,
      password
    }
    // 储存到数据库
    const result = await UserModel.create(user)
    ctx.body = result
  },
  async signin (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signin', {
        title: '用户登录'
      })
      return
    }
    const { username, password } = ctx.request.body
    const user = await UserModel.findOne({ username })
    if (username && await bcrypt.compare(password, user.password)) {
      ctx.session.user = {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        email: user.email
      }
      // console.log(ctx)
      // console.log(ctx.session)
      ctx.flash = { success: '登陆成功' }
      ctx.redirect('/')
    } else {
      ctx.body = '用户名或密码错误'
    }
  },
  async signout (ctx, next) {
    ctx.session.user = null
    ctx.flash = { warning: '退出登录' }
    ctx.redirect('/')
    // ctx.body=ctx.session
  }
}
