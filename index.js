const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [ team ] = b.split('-')
    return { team }
  })
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/ueeo', (req, res) => res.render('index_ueeo', { title }))
app.get('/npltdp', (req, res) => res.render('index_npltdp', { title }))
app.get('/qvgdc', (req, res) => res.render('index_qvgdc', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    data.users.add(user.id)
    io.emit('active', [...data.users].length)
    io.emit('join', user)
    console.log(`${user.team} joined!`)
  })

  socket.on('buzz', (user) => {
    data.buzzes.add(`${user.team}-${user.buzzerText}`)
    io.emit('buzzes', [...data.buzzes])
    io.emit('pause', null)
    console.log(`${user.team} buzzed in!`)
  })

  socket.on('clear', () => {
    data.buzzes = new Set()
    io.emit('buzzes', [...data.buzzes])
    io.emit('buzzable', null)
    console.log(`Clear buzzes`)
  })
})

server.listen(8090, () => console.log('Listening on 8090'))
