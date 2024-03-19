import express from 'express'
import type { Request, Response } from 'express'
import * as path from 'path'

import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV

const app = express()
const publicPath = path.resolve(__dirname, '../../dist')
app.use(express.static(publicPath))

app.get('/', async (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
