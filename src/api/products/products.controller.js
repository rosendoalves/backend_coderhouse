const {Router} = require('express')
const ProductDao = require('../../dao/Product.dao')
const Product = new ProductDao()
// const ProductManager =  require('../../class/ProductManager')
const productError = require('../../utils/errors/product/product.error')
const router = Router()

// const manager = new ProductManager()

router.get('/', async(req, res) => {
    const {limit, page, sort, field, query} = req.query
    const products = await Product.find(limit, page, sort, field, query)
    // res.render('products.handlebars', {products})
    res.send(products)
})

router.get('/:pid', async (req, res) => {
    const {pid} = req.params
    if (pid) { 
        const product = await Product.findOne(pid)  
        res.send(product)
    } else {
        res.send('Not found')
    }
})

router.post('/', async(req, res) => {
    const form = req.body
    const {title, description, price, thumbnail, code, stock, category} = req.body
    if(!title || !description || !price || !thumbnail || !code || !stock || !category){
        productError(form);
    }
    const product = await Product.create(form) 
    const products = await Product.find()

    global.io.emit("newProducts", products);
    res.send(product)
})

router.put('/:pid', async(req, res) => {
    const id = req.params.pid
    const form = req.body
    const product = await Product.updateOne(id, form) 
    const products = await Product.find()
    global.io.emit("newProducts", products); 
    res.send(product)
})

router.delete('/:pid', async(req, res) => {
    const id = req.params.pid
    const product = await Product.deleteOne(id)  
    const products = await Product.find()
    global.io.emit("newProducts", products);
    res.send(product)
})

router.delete('/', async(req, res) => {
    const product = await Product.deleteMany()  
    const products = await Product.find()
    global.io.emit("newProducts", products);
    res.send(product)
})

module.exports = router