const socket = io()

const products = document.getElementById('products')

socket.emit('connection', 'Cliente Conectado')

socket.on('productsList', data => {
    if(data.length > 0) {
      data.forEach(product => products.innerHTML += `Product: ${product.title} Price: $ ${product.price}<br>`)
    }
  });

  socket.on('newProducts', data => {
    products.innerHTML = ''
    if(data.length > 0) {
      data.forEach(product => products.innerHTML += `Product: ${product.title} Price: $ ${product.price}<br>`)
    }
  });

  // Messages

const messageFromServer = document.getElementById('messageFromServer')
const chatBox = document.getElementById('chatBox')
const messages = document.getElementById('messages')

const startChat = async () => {
  const result = await Swal.fire({
    title: "Identificate",
    input: "email",
    text: "Ingresa el correo para identificarte en el chat",
    if (email) {
      Swal.fire(`Entered email: ${email}`)
    }
  })

  const user = result.value
  socket.emit('newUser', user)

  socket.on('newUserConnected', user => {
    Swal.fire({
      text: `${user} acaba de conectarse`,
      toast: true,
      position: 'top-right'
    })
  })
  socket.on('allChats', data => {
    if (data.length > 0 && user) {
      data.forEach(message => messages.innerHTML += `El usuario ${message.user} dice: ${message.message}<br>`)
    }
  })

  chatBox.addEventListener('keyup', async e => {
    if (e.key === 'Enter' && chatBox.value != '') {
      const userMessage = {
        user,
        message: chatBox.value
      }
      chatBox.value = ''
      await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userMessage)
      })
      // .then(data => console.log(data))
      .catch(error => console.error(error))
    }
  })

  socket.on('messageForChat', data => {
    messages.innerHTML = ''
    if (data.length > 0 && user) {
      data.forEach(message => messages.innerHTML += `El usuario ${message.user} dice: ${message.message}<br>`)
    }
  })
}
startChat()
