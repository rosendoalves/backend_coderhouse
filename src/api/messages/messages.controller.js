const { Router } = require('express')
const MessageDao = require('../../dao/mongoClassManagers/message/Message.dao')
const Message = new MessageDao()


const router = Router()


router.get('/chat', async(req, res) => {
  const messages = await Message.find()
  res.send(messages)
})

router.get('/', async(req, res) => {
  res.render('chat.handlebars', { style: 'styles.css' })
})

router.post('/', async(req, res) => {
  const form = req.body
  const message = await Message.create(form) 
  const messages = await Message.find()
  global.io.emit("messageForChat", messages);
  res.send(message)
})


router.delete('/', async(req, res) => {
  const message = await Message.deleteMany()  
    res.send(message)
})

module.exports = router