const express = require('express')
const app = express()
const server = require('http').createServer(app)
const {v4: uuidv4}= require("uuid")
const io = require('socket.io')(server)
const { PeerServer } = require('peer')
const cors = require('cors')

const peerServer = PeerServer({
    port: 3000
})

app.set('view engine', 'ejs')
app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3001)
console.log('listening on 3001')