const { Router } = require('express')
const { publicAccess, privateAccess } = require('../middlewares')
const ProductDao = require('../dao/mongoClassManagers/product/Product.dao')
const ProductManager = new ProductDao()
const CartDao = require('../dao/mongoClassManagers/cart/Cart.dao')
const CartManager = new CartDao()

const router = Router()

router.get('/', privateAccess, (req, res) => {
  const { user } = req.session
  res.render('profile.handlebars', { user })
})

router.get('/login', publicAccess, (req, res) => {
  res.render('login.handlebars')
})

router.get('/signup', publicAccess, (req, res) => {
  res.render('signup.handlebars')
})

router.get('/products', async(req, res) => {
  const products = await ProductManager.find()
  const payload = products.payload
  const { user } = req.session
  const {admin} = req.session.role === 'admin' ? true : false
  res.render('products.handlebars', {products, payload, user, admin})
})

router.get('/carts/:cid', async(req, res) => {
  const {cid} = req.params
      const cart = await CartManager.findOne(cid)  
      const {products} = cart
      res.render('cart.handlebars', {cart, products})
})

router.get('/loggerTest/:clase', async(req, res) => {
  try {
    const loggerType = req.params.clase;
    switch (loggerType) {
        case 'fatal':
            req.logger.fatal("logger fatal")
            break;
        case 'error':
            req.logger.error("logger error")
            break;

        case 'warning':
            req.logger.warning("logger warning")
            break;

        case 'info':
            req.logger.info("logger info")
            break;

        case 'http':
            req.logger.http("logger http")
            break;

        case 'debug':
            req.logger.debug("logger debug")
            break;
        default:
            break;
    }
    res.status(200).json({message: 'success'});
}
catch (error) {
    res.send(`something went wrong ${error}`)
}
})


module.exports = router