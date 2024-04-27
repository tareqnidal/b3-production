// Import required modules
import express from 'express'
import dotenv from 'dotenv'
import loggar from 'morgan'
import Socket from './models/socket.mjs'
import http from 'http'
import mainRouter from './router/mainRouter.mjs'
import cors from 'cors'

dotenv.config()

const app = express()

const httpServer = http.createServer(app)
Socket.init(httpServer)

app.use('/socket.io-client', express.static('node_modules/socket.io-client/dist'))

app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(loggar('dev'))

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/css', express.static('src/frontEnd/css'))
app.use('/javascript', express.static('src/frontEnd/javascript'))
app.use('/html', express.static('src/frontEnd/html'))
app.use('/images', express.static('src/frontEnd/images'))
app.use('/', mainRouter)

const port = process.env.PORT || 3000

export default () => {
  httpServer.listen(port, () => {
    console.log(`Server started on port ${port}\nYou can run it by copy the following link => http://localhost:${port}`)
  })
}
