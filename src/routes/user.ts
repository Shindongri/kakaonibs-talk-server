module.exports = router => {
  /* 유 목록 */
  router.get('/user', (req, res) => {
    res.json([])
  });

  router.post('/user/signin', (req, res, next) => {
    try {
      const userName = req.body.userName;
      const uuid = req.body.uuid;

      req.session.userName = userName;
      req.session.uuid = uuid;
      req.session.isLogged = true;
      req.session.save(() => {
        res.json({
          statusText: 'OK',
          user: {
            userName,
            uuid,
            isLogged: true
          }
        })
      });
    } catch (e) {
      return next(e);
    }
  });

  router.post('/user/signout', (req, res, next) => {
    try {
      delete req.session.userName;
      delete req.session.uuid;
      delete req.session.isLogged;
      req.session.save(() => {
        res.json({
          statusText: 'OK'
        })
      });
    } catch (e) {
      return next(e);
    }
  })

  return router;
};
