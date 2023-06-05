const Route = require('../../router/router')

class RealTimeProductsRouter extends Route {
  init() {
  
  
this.get('/', ['PUBLIC'], (req, res) => {
  res.render('realTimeProducts.handlebars', {})
})

  }
}

module.exports = RealTimeProductsRouter