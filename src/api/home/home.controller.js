const Route = require('../../router/router')
const ProductDao = require('../../dao/mongoClassManagers/product/Product.dao')
const ProductManager = new ProductDao()
const CartDao = require('../../dao/mongoClassManagers/cart/Cart.dao')
const CartManager = new CartDao()

class HomeRouter extends Route {
  init() {
  
  
this.get('/', ['PUBLIC'], async(req, res) => {
  res.render('home.handlebars', {})
})

this.get('/products', ['PUBLIC'], async(req, res) => {
  const products = await ProductManager.find()
  const payload = products.payload
  res.render('products.handlebars', {products, payload})
})

this.get('/carts/:cid', ['PUBLIC'], async(req, res) => {
  const {cid} = req.params
      const cart = await CartManager.findOne(cid)  
      const {products} = cart
      res.render('cart.handlebars', {cart, products})
})
  }}

module.exports = HomeRouter