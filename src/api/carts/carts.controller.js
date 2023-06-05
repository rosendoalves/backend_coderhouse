const Route = require('../../router/router')
const CartDao = require('../../dao/mongoClassManagers/cart/Cart.dao')
const Cart = new CartDao()
// const CartManager =  require('../../class/CartManager')
class CartsRouter extends Route {
init() {


// const manager = new CartManager()

this.get('/', ['PUBLIC'], async(req, res) => {
    const {limit} = req.query
    const carts = await Cart.find()
    if(carts) {
        if (!limit) {res.send(carts)}
    else{
        const cartsFiltered = carts.slice(0, limit)
        res.send(cartsFiltered)
    }
    }
})

this.get('/:cid', ['PUBLIC'], async (req, res) => {
    const {cid} = req.params
    if (cid) { 
        const cart = await Cart.findOne(cid)  
        res.send(cart)
    } else {
        res.send('Not found')
    }
})

this.post('/', ['PUBLIC'], async(req, res) => {
    const form = req.body
    const cart = await Cart.create(form)  
    res.send(cart)
})

this.put('/:cid/products/:pid', ['PUBLIC'], async(req, res) => {
    const {cid, pid} = req.params
    const form = req.body
    const cart = await Cart.updateOne(cid, pid, form)  
    res.send(cart)
})

this.put('/:cid', ['PUBLIC'], async(req, res) => {
    const {cid} = req.params
    const form = req.body
    const cart = await Cart.updateOnes(cid, form)  
    res.send(cart)
})

this.delete('/:cid', ['PUBLIC'],  async(req, res) => {
    const id = req.params.cid
    const cart = await Cart.deleteOne(id)  
    res.send(cart)
})

this.delete('/:cid/products/:pid', ['PUBLIC'], async(req, res) => {
    const {cid, pid} = req.params
    const cart = await Cart.deleteOnes(cid, pid)  
    res.send(cart)
})

this.delete('/', ['PUBLIC'], async(req, res) => {
    // const id = req.params.pid
    const cart = await Cart.deleteMany()  
    res.send(cart)
})

}
}

module.exports = CartsRouter