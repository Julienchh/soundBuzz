const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzers = document.querySelectorAll('.js-buzzer')
const buzzers_npltdp = document.querySelectorAll('.js-buzzer-npltdp')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')

let user = {}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}
  if (user.team) {
    form.querySelector('[name=team]').value = user.team
  }
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.team = form.querySelector('[name=team]').value
  if (!user.id) {
    user.id = Math.floor(Math.random() * new Date())
  }
  socket.emit('join', user)
  saveUserInfo()
  joinedInfo.innerText = `Équipe : ${user.team}`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')
})

buzzers.forEach(buzzer => {
  buzzer.addEventListener('click', (e) => {
    const buzzerText = buzzer.textContent; // Capture the text inside the buzzer button
    socket.emit('buzz', { ...user, buzzerText }); // Emit the text content along with the user information
    buzzers.forEach(b => {
      b.classList.add('buzzer-disabled');
    });
  })
})

buzzers_npltdp.forEach(buzzer => {
  buzzer.addEventListener('click', (e) => {
    const buzzerText = buzzer.textContent; // Capture the text inside the buzzer button
    socket.emit('buzz_npltdp', { ...user, buzzerText }); // Emit the text content along with the user information
    buzzers_npltdp.forEach(b => {
      b.classList.add('buzzer-disabled');
    });
  })
})

socket.on('buzzable', () => {
  buzzers.forEach(buzzer => {
    buzzer.classList.remove('buzzer-disabled');
  })
  buzzers_npltdp.forEach(buzzer => {
    buzzer.classList.remove('buzzer-disabled');
  })
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

getUserInfo()