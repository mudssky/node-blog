const CategoryModel = require('../models/category')

module.exports = {
  async list (ctx, next) {
    const categories = await CategoryModel.find({})
    await ctx.render('category', {
      title: '分类管理',
      categories
    })
  },
  async content (ctx, next) {
    await ctx.render('category', {
      title: '分类管理'
    })
  }
}
