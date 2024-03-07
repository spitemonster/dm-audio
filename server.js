import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { existsSync, createWriteStream } from 'node:fs'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
const app = express()
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/audio', express.static(path.join(__dirname, '../../uploads/audio')))
app.use(express.static(path.resolve('./dist/')))

const PORT = 3000
const PATH = './public/'

const fileDir = new URL('../../uploads/audio', import.meta.url)
const assetsDir = new URL('../../assets', import.meta.url)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/audio')
    },
    filename: function (req, file, cb) {
        const sp = file.originalname.split('.')
        const fn = sp[0]
        const ext = sp[1]

        cb(null, `${fn}-${Date.now()}.${ext}`)
    },
})

const upload = multer({ storage: storage })

// create uploads and uploads/audio folder if they don't already exist
try {
    if (!existsSync(fileDir)) {
        await fs.mkdir(fileDir, { recursive: true })
    }
} catch (err) {
    console.log(err)
}

try {
    if (!existsSync(assetsDir)) {
        await fs.mkdir(assetsDir, { recursive: true })
    }
} catch (err) {
    console.log(err)
}

function generateId() {
    return Math.random().toString(36).slice(2, 14)
}

async function createAsset(url, id, name) {
    const asset = {
        url,
        id,
        name,
    }

    try {
        await setAsset(asset)
    } catch (err) {
        throw err
    } finally {
        return asset
    }
}

function getAsset(id) {
    fs.readFile(`./assets/${id}.son`)
}

async function setAsset(asset) {
    const assetStr = JSON.stringify(asset)

    try {
        await fs.writeFile(`./assets/${asset.id}.json`, assetStr)
    } catch (err) {
        throw err
    } finally {
        return asset
    }
}

app.get('/', async (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'))
})

app.post('/asset', async (req, res) => {
    const asset = req.body

    try {
        await setAsset(asset)
    } catch (err) {
        res.send('There has been an error: ', err)
    } finally {
        res.send({
            msg: 'Asset successfully updated',
            asset,
        })
    }
})

app.post('/upload', upload.single('file'), async (req, res) => {
    createAsset(`audio/${req.file.filename}`, generateId(), req.body.name).then(
        (asset) => {
            res.json(asset)
        }
    )
})

app.listen(PORT, () => {})
