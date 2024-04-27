import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const token = process.env.ACCESS_TOKEN
const grouptId = process.env.G_ID
const router = express.Router()
router.get('/projects', async (req, res) => {
  let data = await fetch(`https://gitlab.lnu.se/api/v4/groups/${grouptId}/projects/?private_token=${token}`)
  data = await data.json()
  res.json(data)
})
router.get('/projects/:projecId', async (req, res) => {
  const projectId = req.params.projecId
  let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}/?private_token=${token}`)
  data = await data.json()
  res.json(data)
})
router.get('/issues/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  let data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}/issues/?private_token=${token}`)
  data = await data.json()
  res.json(data)
})

export default router
