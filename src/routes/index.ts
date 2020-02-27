import * as express from 'express'

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    status: 200
  })
});

module.exports = router;
