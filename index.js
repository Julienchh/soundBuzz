const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const os = require('os');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Array(),
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
    data.buzzes.push(`${user.team}-${user.buzzerText}`)
    io.emit('buzzes', [...data.buzzes])
    //io.emit('pause', null)
    console.log(`${user.team} buzzed in!`)
  })

  socket.on('buzz_npltdp', (user) => {
    data.buzzes.push(`${user.team}-${user.buzzerText}`)
    io.emit('buzzes', [...data.buzzes])
    io.emit('pause', null)
    console.log(`${user.team} buzzed in!`)
  })

  socket.on('clear', () => {
    data.buzzes = new Array()
    io.emit('buzzes', [...data.buzzes])
    io.emit('buzzable', null)
    console.log(`Clear buzzes`)
  })

  socket.on('buzzes', (buzzes) => {
    const buzzed = buzzes[buzzes.length - 1];
    if (!buzzed) return;
    const buzzerButton = document.querySelector('.js-buzzer');
    if (buzzerButton) {
      buzzerButton.classList.add('buzzed');
      buzzerButton.disabled = true;
    }
  });
  
  socket.on('buzzable', () => {
    const buzzerButton = document.querySelector('.js-buzzer');
    if (buzzerButton) {
      buzzerButton.classList.remove('buzzed');
      buzzerButton.disabled = false;
    }
  });
  
})

// Get local IPv4 address
const getLocalIPv4 = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && name==="Wi-Fi") {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const PORT = 8090;

server.listen(PORT, () => {
  const localIP = getLocalIPv4();
  console.log(`UEEO :  http://${localIP}:${PORT}/ueeo`);
  console.log(`NPLTDP :  http://${localIP}:${PORT}/npltdp`);
  console.log(`QVGDC :  http://${localIP}:${PORT}/qvgdc`);
  console.log(`HOST : http://localhost:${PORT}/host`);
});
