const SessionRouter = require('../session/session.controller')
const ViewsTemplateRouter = require('../viewsTemplate/viewsTemplate.controller')
const ProductsRouter = require('../api/products/products.controller')
const CartsRouter = require('../api/carts/carts.controller')
// const HomeRouter = require('../api/home/home.controller')
const RealTimeProductsRouter = require('../api/realtimeProducts/realtime.products.controller')
const MessagesRouter = require('../api/messages/messages.controller')
const UsersRouter = require('../api/users/users.controller')
const AuthRouter = require('../auth/auth.controller')
const CookiesRouter = require('../cookies/cookies.controller')
const MockingProductsRouter = require('../api/products/mockingProducts.controller')

const sessionRouter = new SessionRouter();
const viewsTemplateRouter = new ViewsTemplateRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
// const homeRouter = new HomeRouter();
const realTimeProductsRouter = new RealTimeProductsRouter();
const messagesRouter = new MessagesRouter();
const usersRouter = new UsersRouter();
const authRouter = new AuthRouter();
const cookiesRouter = new CookiesRouter();
const mockingProductsRouter = new MockingProductsRouter();

const router = (app) => {
  // app.use('/', homeRouter.getRouter())
  app.use('/', viewsTemplateRouter.getRouter())
  app.use('/api/products', productsRouter.getRouter())
  app.use('/api/carts', cartsRouter.getRouter())
  app.use('/realtimeProducts', realTimeProductsRouter.getRouter())
  app.use('/messages', messagesRouter.getRouter())
  app.use('/auth', authRouter.getRouter())
  app.use('/users', usersRouter.getRouter())
  app.use('/cookies', cookiesRouter.getRouter())
  app.use('/session', sessionRouter.getRouter())
  app.use('/mockingProducts', mockingProductsRouter.getRouter())
}

module.exports = router