const Route = require('../../router/router')
const ProductDao = require('../../dao/mongoClassManagers/product/Product.dao')
// const Product = require('../../repositories/product')
const Product = new ProductDao()
// const ProductManager =  require('../../class/ProductManager')
const productError = require('../../utils/errors/product/product.error')

class ProductsRouter extends Route {
    init() {
        
        // const manager = new ProductManager()
        
        this.get('/', ['PUBLIC'], async(req, res) => {
            try {
                const {limit, page, sort, field, query} = req.query
                const products = await Product.find(limit, page, sort, field, query)
                // res.render('products.handlebars', {products})
                res.send(products)
                
            } catch (error) {
                req.logger.fatal("Poductos no encontrados")
            }
        })
        
        this.get('/:pid', ['PUBLIC'], async (req, res) => {
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
        
        this.post('/', ['ADMIN'], async(req, res) => {
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
        
        this.put('/:pid', ['ADMIN'],  async(req, res) => {
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
        
        this.delete('/:pid', ['ADMIN'], async(req, res) => {
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
        
        this.delete('/', ['ADMIN'], async(req, res) => {
            try {
                const product = await Product.deleteMany()  
                const products = await Product.find()
                global.io.emit("newProducts", products);
                res.send(product)
                
            } catch (error) {
                req.logger.error('Sin resultado')
            }
        })
    }
}


module.exports = ProductsRouter