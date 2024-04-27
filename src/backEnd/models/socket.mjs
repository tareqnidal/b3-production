import { Server } from 'socket.io'

const Socket = {}

export default Socket

Socket.io = null

Socket.init = (httpServer) => {
  if (Socket.io) {
    return
  }
  Socket.io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } })
  Socket.io.on('connection', (socket) => {
  })
}

Socket.getSocket = () => {
  return Socket.io
}

Socket.notify = (event, data) => {
  Socket.io.emit(event, data)
}
