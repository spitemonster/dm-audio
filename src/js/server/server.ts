import express from 'express'

const app = express()

app.get('/', async (req, res) => {
    res.send('hello')
})

app.listen(9000, () => {
    console.log('server running')
})
