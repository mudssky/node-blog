const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const CategoryModel = require('../models/category')
module.exports = {
  async index (ctx, next) {
    const cname = ctx.query.c
    let cid
    if (cname) {
      const cateogry = await CategoryModel.findOne({ name: cname })
      cid = cateogry._id
    }
    const query = cid ? { category: cid } : {}
    const posts = await PostModel.find(query)
    await ctx.render('index', {
      title: '分类文章',
      posts
    }
    )
  },
  async easyPage (ctx, next) {
    const pageSize = 15
    const currentPage = parseInt(ctx.query.page) || 1
    const allPostsCount = await PostModel.count()
    const pageCount = Math.ceil(allPostsCount / pageSize)
    const posts = await PostModel.find({}).skip((currentPage - 1) * pageSize).limit(pageSize)
    await ctx.render('index', {
      title: '分页',
      posts,
      currentPage,
      pageCount
    })
  },
  async create (ctx, next) {
    if (ctx.method === 'GET') {
      const categories = await CategoryModel.find({})
      await ctx.render('create', {
        title: '新建文章',
        categories
      })
      return
    }
    const post = Object.assign(ctx.request.body, {
      author: ctx.session.user._id
    })
    await console.log(post)
    const res = await PostModel.create(post)
    ctx.flash = { success: '发表文章成功' }
    ctx.redirect(`/posts/${res._id}`)
  },
  async show (ctx, next) {
    // ctx.params 获取动态路由传值
    const post = await PostModel.findById(ctx.params.id)
      .populate({ path: 'author', select: 'username' })
    // console.log(post)
    // 查找评论
    const comments = await CommentModel.find({ postId: ctx.params.id })
      .populate({ path: 'from', select: 'username' })
    await ctx.render('post', {
      title: post.title,
      post,
      comments
      //   comments
    })
    // await ctx.render('post',{
    //     title:'文章详情',
    //     post:'## 黄河远上白云间，一片孤城万仞山**gsdfas**'
    // })
  },
  async edit (ctx, next) {
    if (ctx.method === 'GET') {
      const post = await PostModel.findById(ctx.params.id)
        .populate({ path: 'category', select: 'title' })
      const categories = await CategoryModel.find({})
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author.toString() !== ctx.session.user._id.toString()) {
        throw new Error('没有权限')
      }
      await ctx.render('edit', {
        title: '更新文章',
        post,
        categories
      })
      return
    }
    const { title, content, category } = ctx.request.body
    await PostModel.findByIdAndUpdate(ctx.params.id, {
      title,
      content,
      category
    })
    ctx.flash = { success: '更新文章成功' }
    ctx.redirect(`/posts/${ctx.params.id}`)
  },
  async destroy (ctx, next) {
    const post = await PostModel.findById(ctx.params.id)
    if (!post) {
      throw new Error('文章不存在')
    }
    console.log(post.author, ctx.session.user._id)
    if (post.author.toString() !== ctx.session.user._id.toString()) {
      throw new Error('没有权限')
    }
    await PostModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '删除文章成功' }
    ctx.redirect('/')
  }

}
