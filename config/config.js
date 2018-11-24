module.exports = {
  port: process.env.PORT || 3000,
  session: {
    key: 'blog',
    maxAge: 86400000// 默认的过期时间
  },
  mongodb: 'mongodb://localhost:27017/blog'
}
