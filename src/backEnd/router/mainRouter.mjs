import express from 'express'
import Socket from '../models/socket.mjs'
import fetchRouter from './fetchRouter.mjs'
import validator from '../middlewares/validator.mjs'
const router = express.Router()

export default router

router.get('/', (req, res) => {
  res.sendFile('/index.html', { root: 'src/frontEnd/html' })
})
router.get('/home', (req, res) => {
  res.sendFile('/index.html', { root: 'src/frontEnd/html' })
})

router.post('/webhook', validator.validateWebhook, async (req, res) => {
  res.status(200).send('OK')
  Socket.notify('message', req.body)
  console.log(req.body.object_kind)
})
router.use('/get', fetchRouter)
