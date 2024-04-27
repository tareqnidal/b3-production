import * as dotenv from 'dotenv'

dotenv.config()

const validator = {}

export default validator

validator.validateWebhook = (req, res, next) => {
  const gitlabToken = req.headers['x-gitlab-token']
  const expectedToken = process.env.TOKEN
  if (gitlabToken === expectedToken) {
    next()
  } else {
    res.status(403).send('Invalid token')
  }
}
