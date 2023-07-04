const Route = require('../../router/router')
const ProductDao = require('../../dao/mongoClassManagers/product/Product.dao')
// const Product = require('../../repositories/product')
const Product = new ProductDao()
// const ProductManager =  require('../../class/ProductManager')
const productError = require('../../utils/errors/product/product.error')
const transport = require('../../utils/email.utils')
const { emailUser } = require('../../config/email.config')

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
                req.logger.fatal("Productos no encontrados")
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
        
        this.post('/', ['ADMIN', 'PREMIUM'], async(req, res) => {
            try {
                const form = req.body
                form.owner = req.user.email
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
        
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], async(req, res) => {
            try {
                const id = req.params.pid
                const product = await Product.findOne(id) 
                console.log("🚀 ~ file: products.controller.js:78 ~ ProductsRouter ~ this.delete ~ product:", product)
                if(product.owner == req.user.email) {
                    const product = await Product.deleteOne(id)
                    res.send(product)
                } else if(req.user.role == 'ADMIN') {
                    const product = await Product.deleteOne(id)
                    res.send(product)
                } else {
                    res.send('Not authorized')
                }

                if (req.user.role == 'PREMIUM' && product.owner == req.user.email) {
                    console.log('envio correo')
                    const mailOptions = {
                        from: emailUser,
                        to: req.user.email ? req.user.email : emailUser,
                        subject: "Producto Eliminado", 
                        html: `
                          <div>
                            Se informa que se borró el producto: ${product.title}
                          </div>
                        `,
                        attachments: [],
                      }
                    await transport.sendMail(mailOptions)
                }
                const products = await Product.find()
                global.io.emit("newProducts", products);
                return 'Producto eliminado'
                
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