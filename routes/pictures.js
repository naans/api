const router = require('express').Router()
    , mongoose = require('mongoose')
    , {promisify} = require('../utils')
    , config   = require('config')
    , type   = require('file-type')
    , fs     = require('fs')
    , write  = promisify(fs.writeFile)
    , unlink = promisify(fs.unlink)

const pathOf = id => `${config.get('root')}/${config.get('pictures_path')}/${id}`
const urlOf = id => `${config.get('domain')}/pictures/${id}`

const add = (req, res) => {
    if (! req.body.content)
        return res.status(400).json({_error: 'No picture content found!'})
    const buffer   = Buffer.from(req.body.content, 'base64')
        , dataType = type(buffer)
    if (! dataType) {
        res.status(400)
        return res.json({_error: 'Unknown file type'})
    }
    if (['jpg', 'png', 'bmp', 'flif', 'tif'].indexOf(dataType.ext) == -1) {
        res.status(400)
        return res.json({_error: 'The file type is not supported'})
    }

    const id = mongoose.Types.ObjectId().toString('hex')
        , path = pathOf(id)

    write(path, buffer)
    .then(() => res.json(urlOf(id)))
    .catch(err => {
        console.error(err)
        res.status(500)
        res.json({ error: 'Error while saving the picture' })
    })
}

const get = (req, res) =>
    res.sendFile(pathOf(req.params.id))

const remove = (req, res) => 
    unlink(pathOf(req.params.id))
    .then(() => res.json({}))

router
    .post('/pictures', add)
    .get('/pictures/:id', get)
    .delete('/pictures/:id', remove)

module.exports = router
