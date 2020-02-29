const express = require('express');
const router = express.Router();

const user = require('./user')(router);
const room = require('./room')(router);

router.use('/user', user);
router.use('/room', room);

module.exports = router
