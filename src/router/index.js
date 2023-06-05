const productsController = require('../api/products/products.controller')
const cartsController = require('../api/carts/carts.controller')
// const homeController = require('../api/home/home.controller')
const realtimeProductsController = require('../api/realtimeProducts/realtime.products.controller')
const messagesController = require('../api/messages/messages.controller')
const usersController = require('../api/users/users.controller')
const authController = require('../auth/auth.controller')
const cookiesController = require('../cookies/cookies.controller')
const sessionController = require('../session/session.controller')
const viewsTemplateController = require('../viewsTemplate/viewsTemplate.controller')
const mockingProductsController = require('../api/products/mockingProducts.controller')

const router = (app) => {
  // app.use('/', homeController)
  app.use('/', viewsTemplateController)
  app.use('/api/products', productsController)
  app.use('/api/carts', cartsController)
  app.use('/realtimeProducts', realtimeProductsController)
  app.use('/messages', messagesController)
  app.use('/auth', authController)
  app.use('/users', usersController)
  app.use('/cookies', cookiesController)
  app.use('/session', sessionController)
  app.use('/mockingProducts', mockingProductsController)
}

module.exports = router