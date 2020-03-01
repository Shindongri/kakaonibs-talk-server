const { split, flow, replace, size, last } = require('lodash/fp');
const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });

  app.set('io', io);
  const room = io.of('/room');
  const chat = io.of('/chat');

  /* Apply Session Middleware */
  io.use((socket, next) => {
    const req = socket.request;
    const res = socket.request.res || {};

    sessionMiddleware(req, res, next);
  });

  /* Room Namespace */
  room.on('connection', (socket) => {
    console.log('Connected to Room');

    socket.on('disconnect', () => {
      console.log('Disconnected to Room');
    });
  });

  /* Chat Namespace */
  chat.on('connection', (socket) => {
    console.log('Connected to Chat');

    const req = socket.request;
    const { headers: { referer } } = req;

    const roomId = flow(
      split('/'),
      last,
      replace(/\?.+/, '')
    )(referer);

    socket.join(roomId);

    socket.on('leave', (roomId) => {
      const currentRoom = socket.adapter.rooms[socket.id];
      const cnt = currentRoom ? currentRoom.length: 0;

      /* 빈 방일 경우 방 제거 */
      if (cnt === 0) {
        axios.delete(`${ process.env.API_HOST }/room/${ roomId }`)
          .catch((e) => {
            console.error(e);
          });
      }
    })

    socket.on('disconnect', (data) => {
      console.log('Disconnected to Chat');

      socket.leave(roomId);
    });
  });
}
