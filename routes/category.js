const CategoryModel = require('../models/category')

module.exports = {
  // 显示分类列表
  async list (ctx, next) {
    const categories = await CategoryModel.find({})
    await ctx.render('category', {
      title: '分类管理',
      categories
    })
  },
  //   async content (ctx, next) {
  //     await ctx.render('category', {
  //       title: '分类管理'
  //     })
  //   }
  //   新建分类
  async create (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create_category', {
        title: '新建分类'
      })
      return
    }
    await CategoryModel.create(ctx.request.body)
    ctx.redirect('/category')
  },
  // 删除分类
  async destroy (ctx, next) {
    await CategoryModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '删除分类成功' }
    ctx.redirect('/category')
  }
}
