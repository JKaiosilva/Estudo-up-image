const cors = require('cors')
const express = require('express')
const app = express()
const initRoutes = require('./routes')
const mongoose = require('mongoose')

var corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true}))
initRoutes(app)

const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

let port = 8080
app.listen(port, ()=> {
    console.log('escutando na porta ' + port)
})