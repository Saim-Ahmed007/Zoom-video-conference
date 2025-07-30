import express from 'express'
import {createServer} from 'node:http'
import mongoose from 'mongoose'
import cors from 'cors'
import { connectToSocket } from './controllers/socketManager.js'
import userRoutes from './routes/user.routes.js'

const app = express()
const server = createServer(app)
const io = connectToSocket(server)

app.set('port', (process.env.PORT || 3000))

app.get("/", (req,res)=> res.send('server is running'))

app.use(cors())
app.use(express.json({limit: '40kb'}))
app.use(express.urlencoded({limit: '40kb', extended: true}))

app.use("/api/v1/users", userRoutes)

const start = async() => {
    const connectionDB = await mongoose.connect("mongodb+srv://saimahmedseucse:849aQLJuOWDuTriQ@cluster0.unqpzgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log(`Mongo Connected DB Host : ${connectionDB.connection.host}`)
    server.listen(app.get('port'), () => {
        console.log('Server is listening from 3000')
    })
}

start();