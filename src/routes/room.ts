export {};

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

module.exports = (router) => {
  /* 채팅방 목록 */
  router.get('/room', async (req, res, next) => {
    try {
      const rooms = await Room.find({});

      res.json({
        statusText: 'OK',
        list: rooms
      });

      next();
    } catch (e) {
      return next(e);
    }
  });

  /* 채팅방 상세 */
  router.get('/room/:roomId', async (req, res, next) => {
    try {
      const roomId = req.params.roomId;
      const room = await Room.findById({ _id: roomId });

      const chatList = await Chat.find({ room: room._id }).sort('updatedAt');

      if (!room) {
        res.status(500).json({
          statusText: 'ERROR',
          error: true,
          errorMessage: '존재하지 않는 방입니다.'
        })
      }

      res.json({
        statusText: 'OK',
        detail: {
          me: req.session.uuid,
          chatList,
          title: room.title,
          room
        }
      })
    } catch (e) {
      return next(e);
    }
  })

  /* 채팅하기 */
  router.post('/room/:roomId/chat', async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.roomId,
        user: req.session.uuid,
        chat: req.body.chat
      });

      await chat.save();

      const io = req.app.get('io');

      io.of('/chat').to(req.params.id).emit('chat', chat);

      res.json({
        statusText: 'OK'
      });
    } catch (e) {
      return next(e);
    }
  })

  return router;
};
