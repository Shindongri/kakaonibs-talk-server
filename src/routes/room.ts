export {}

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const Room = require('../schemas/room')
const Chat = require('../schemas/chat')

module.exports = router => {
  /* 채팅방 목록 */
  router.get('/room', async (req, res, next) => {
    try {
      const rooms = await Room.find({})

      res.json({
        statusText: 'OK',
        list: rooms,
      })

      next()
    } catch (e) {
      return next(e)
    }
  })

  /* 채팅방 상세 */
  router.get('/room/:roomId', async (req, res, next) => {
    try {
      const roomId = req.params.roomId
      const room = await Room.findById({ _id: roomId })

      if (room) {
        const chatList = await Chat.find({ room: room._id }).sort('updatedAt')

        res.json({
          statusText: 'OK',
          detail: {
            title: room.title,
            me: req.session.uuid,
            chatList,
            room,
          },
        })
      } else {
        res.json({
          statusText: 'OK',
          detail: req.session.uuid,
        })
      }

      next()
    } catch (e) {
      return next(e)
    }
  })

  /* 채팅방 생성 */
  router.post('/room', async (req, res, next) => {
    try {
      const room = new Room({
        owner: req.session.uuid,
        title: req.body.title,
      })

      const newRoom = await room.save()

      const io = req.app.get('io')
      io.of('/room').emit('newRoom', newRoom)

      res.json({
        statusText: 'OK',
        detail: newRoom,
      })
    } catch (e) {
      return next(e)
    }
  })

  /* 채팅방 삭제 */
  router.delete('/room/:roomId', async (req, res, next) => {
    try {
      await Room.deleteOne({ _id: req.params.roomId })
    } catch (e) {
      return next(e)
    }
  })

  /* 채팅방 초대 */
  router.post('/room/:roomId/invite', async (req, res, next) => {
    try {
      const roomId = req.params.roomId
      // const to = req.body.tarsocketId

      const room = await Room.findById({ _id: roomId })
      const io = req.app.get('io')

      io.of('/room').emit('invite', roomId)

      res.json({
        statusText: 'OK',
        detail: room,
      })
    } catch (e) {
      return next(e)
    }
  })

  /* 채팅하기 */
  router.post('/room/:roomId/chat', async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.roomId,
        user: req.session.uuid,
        chat: req.body.chat,
      })

      await chat.save()

      const io = req.app.get('io')

      io.of('/chat')
        .to(req.params.roomId)
        .emit('chat', chat)

      res.json({
        statusText: 'OK',
      })
    } catch (e) {
      return next(e)
    }
  })

  fs.readdir('uploads', error => {
    if (error) {
      console.error('Upload Folder Not Found.')
      fs.mkdirSync('uploads')
    }
  })

  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/')
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  })

  /* 이미지 전송 */
  router.post('/room/:roomId/image', upload.single('image'), async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.roomId,
        user: req.session.uuid,
        image: req.file.filename,
      })

      await chat.save()

      const io = req.app.get('io')

      io.of('/chat')
        .to(req.params.roomId)
        .emit('chat', chat)

      res.json({
        statusText: 'OK',
      })
    } catch (e) {
      return next(e)
    }
  })

  return router
}
