const { Router } = require('express')
const { privateAccess, publicAccess } = require('../middlewares')
const ProductDao = require('../dao/Product.dao')
const ProductManager = new ProductDao()
const CartDao = require('../dao/Cart.dao')
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


module.exports = router