const {Router} = require('express')
// const ProductDao = require('../../dao/mongoClassManagers/product/Product.dao')
const Product = require('../../repositories')
// const ProductManager =  require('../../class/ProductManager')
const productError = require('../../utils/errors/product/product.error')
const router = Router()

// const manager = new ProductManager()

router.get('/', async(req, res) => {
    try {
        const {limit, page, sort, field, query} = req.query
        const products = await Product.find(limit, page, sort, field, query)
        // res.render('products.handlebars', {products})
        res.send(products)
        
    } catch (error) {
        req.logger.fatal("Poductos no encontrados")
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const {pid} = req.params
        if (pid) { 
            const product = await Product.findOne(pid)  
            res.send(product)
        } else {
            res.send('Not found')
        }
    } catch (error) {
        req.logger.error('Sin resultado')
    }
})

router.post('/', async(req, res) => {
    try {
        const form = req.body
        const {title, description, price, code, stock, category} = req.body
        if(!title || !description || !price || !code || !stock || !category){
            productError(form);
        }
        const product = await Product.create(form) 
        const products = await Product.find()
    
        global.io.emit("newProducts", products);
        res.send(product)
        
    } catch (error) {
        req.logger.error('Sin resultado')
    }
})

router.put('/:pid', async(req, res) => {
    try {
        
        const id = req.params.pid
        const form = req.body
        const product = await Product.updateOne(id, form) 
        const products = await Product.find()
        global.io.emit("newProducts", products); 
        res.send(product)
    } catch (error) {
        req.logger.error('Sin resultado')
    }
})

router.delete('/:pid', async(req, res) => {
    try {
        const id = req.params.pid
        const product = await Product.deleteOne(id)  
        const products = await Product.find()
        global.io.emit("newProducts", products);
        res.send(product)
        
    } catch (error) {
        req.logger.error('Sin resultado')
    }
})

router.delete('/', async(req, res) => {
    try {
        const product = await Product.deleteMany()  
        const products = await Product.find()
        global.io.emit("newProducts", products);
        res.send(product)
        
    } catch (error) {
        req.logger.error('Sin resultado')
    }
})

module.exports = router