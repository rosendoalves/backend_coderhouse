const { Router } = require('express')
const ProductDao = require('../../dao/Product.dao')
const ProductManager = new ProductDao()
const CartDao = require('../../dao/Cart.dao')
const CartManager = new CartDao()

const router = Router()

router.get('/', async(req, res) => {
  res.render('home.handlebars', {})
})

router.get('/products', async(req, res) => {
  const products = await ProductManager.find()
  const payload = products.payload
  res.render('products.handlebars', {products, payload})
})

router.get('/carts/:cid', async(req, res) => {
  const {cid} = req.params
      const cart = await CartManager.findOne(cid)  
      const {products} = cart
      res.render('cart.handlebars', {cart, products})
})

module.exports = router