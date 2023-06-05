const Route = require('../../router/router')
const MessageDao = require('../../dao/mongoClassManagers/message/Message.dao')
const Message = new MessageDao()


class MessagesRouter extends Route {
  init(){

this.get('/chat', ['PUBLIC'], async(req, res) => {
  const messages = await Message.find()
  res.send(messages)
})

this.get('/', ['PUBLIC'], async(req, res) => {
  res.render('chat.handlebars', { style: 'styles.css' })
})

this.post('/', ['PUBLIC'], async(req, res) => {
  const form = req.body
  const message = await Message.create(form) 
  const messages = await Message.find()
  global.io.emit("messageForChat", messages);
  res.send(message)
})


this.delete('/', ['PUBLIC'], async(req, res) => {
  const message = await Message.deleteMany()  
    res.send(message)
})
}
}

module.exports = MessagesRouter