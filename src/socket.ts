const { split, flow, replace, size, last } = require('lodash/fp');
const SocketIO = require('socket.io');

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
    const { headers: { referer } } = req

    const roomId = flow(
      split('/'),
      last,
      replace(/\?.+/, '')
    )(referer);

    socket.join(roomId);
    // socket.to(roomId).emit('join', {
    //   user: 'system',
    //   chat: `${ req.session.uuid }님이 입장하셨습니다.`
    // })

    socket.on('disconnect', () => {
      console.log('Disconnected to Chat');
      // socket.leave(roomId);
    });
  });
}
