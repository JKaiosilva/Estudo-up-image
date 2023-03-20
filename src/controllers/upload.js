const upload = require('../middleware/upload')
const dbConfig = require('../config/db')



const MongoClient = require('mongodb').MongoClient
const GidFSBucket = require('mongodb').GridFSBucket

const url = dbConfig.url

const baseUrl = 'http:/localhost:8080/files/'

const mongoClient = new MongoClient(url)

const uploadFiles = async (req, res) => {
    try {
        await upload(req, res)
        console.log(req.file)
        if(req.file == undefined){
            return res.send({
                message: 'muitos arquivos selecionados'
            })
        }
        return res.send({
            message: 'arquivo upado'
        })
    } catch (error) {
        console.log(error)
        return res.send({
            message: error
        })
    }
}

const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect()
        const database = mongoClient.db(dbConfig.database)
        const images = database.collection(dbConfig.imgBucket + '.files')
        const cursor = images.find({})
        if((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "imagem não encontrada"
            })
        }
        let fileInfos = []
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename
            })
        })
        return res.status(200).send(fileInfos)
    }catch(error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const download = async (req, res) => {
    try {
        await mongoClient.connect()
        const database = mongoClient.db(dbConfig.database)
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket
        })

        let downloadStram = bucket.openDownloadStreamByName(req.params.name)
        downloadStream.on('data', function (data) {
            return res.status(200).write(data)
        })

        downloadStream.on('data', function (data) {
            return res.status(200).write(data)
        })
        downloadStream.on('error', function (err) {
            return res.status(404).send({message: 'não foi possivel baixar esta imagem'})
        })
        downloadStream.on('end', () => {
            return res.end()
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    uploadFiles,
    getListFiles,
    download
}