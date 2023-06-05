const Route = require('../router/router')

class CookiesRouter extends Route {
  init(){

this.get('/view', (req, res) => {
  res.render('index.handlebars')
})

this.get('/', (req, res) => {
  const cookies = req.cookies

  res.json(cookies)
})

this.post('/', (req, res) => {
  const user = req.body

  res.cookie('NuestraCookie', JSON.stringify(user)).json({ message: 'Cookie creada' })
})
  }
}

module.exports = CookiesRouter