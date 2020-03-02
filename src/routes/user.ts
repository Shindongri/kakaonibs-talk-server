export {}

const User = require('../schemas/user')
const { v4 } = require('uuid')

module.exports = router => {
  /* 유저 목록 */
  router.get('/user', async (req, res, next) => {
    try {
      const users = await User.find({})

      res.json({
        statusText: 'OK',
        list: users,
      })

      next()
    } catch (e) {
      return next(e)
    }
  })

  /* 로그인 */
  router.post('/user/signin', (req, res, next) => {
    try {
      const userName = req.body.userName
      const uuid = v4()

      req.session.userName = userName
      req.session.uuid = uuid
      req.session.isLogged = true
      req.session.save(() => {
        res.json({
          statusText: 'OK',
          user: {
            userName,
            uuid,
            isLogged: true,
          },
        })
      })
    } catch (e) {
      return next(e)
    }
  })

  /* 로그아웃 */
  router.post('/user/signout', (req, res, next) => {
    try {
      delete req.session.userName
      delete req.session.uuid
      delete req.session.isLogged
      req.session.save(() => {
        res.json({
          statusText: 'OK',
        })
      })
    } catch (e) {
      return next(e)
    }
  })

  return router
}
