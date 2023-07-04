const Route = require('../../router/router')
const CartDao = require('../../dao/mongoClassManagers/cart/Cart.dao')
const Cart = new CartDao()
// const CartManager =  require('../../class/CartManager')
const ProductDao = require('../../dao/mongoClassManagers/product/Product.dao')
// const Product = require('../../repositories/product')
const Product = new ProductDao()
const { ObjectId } = require('mongodb');
const User = require('../../repositories/user')
const {v4: uuidv4} = require('uuid')
const ticketsModel = require('../../dao/mongoClassManagers/models/Ticket.model');
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


this.post('/:cid/purchase', ['PUBLIC'], async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await Cart.findOne(cid);
      const currentUser = await User.findOne(req.session.user.email);
  
      if (!cart) {
        return res.status(404).send('Cart not found');
      }
  
      if (!currentUser) {
        return res.status(401).send('User not found');
      }
  
      const productsCart = cart.products;
      const products = await Product.find();
      let productsAvailable = [];
      let productsUnavailable = [];
      
      if (productsCart.length === 0) {
        return res.status(400).send('No hay productos en el carrito');
      }
  
      if (products.length === 0) {
        return res.status(400).send('No hay productos cargados');
      }
  
      for (const item of productsCart) {
        const product = products.payload.find((p) => p._id.equals(ObjectId(item.product._id)));
        if (product && item.quantity <= product.stock) {
          productsAvailable.push(item);
          const newProduct = await Product.findOne(product._id)
          newProduct.stock = product.stock - item.quantity;
          await Product.updateOne({_id: product._id}, newProduct);
          await Cart.deleteOnes(cid, product._id)
        } else {
            productsUnavailable.push(item);
        }
    }
    
    const newTicketInfo = {
        code: uuidv4(),
        purchase_datatime: new Date().toLocaleString(),
        products: productsAvailable.map(item => item.product),
        amount: productsAvailable.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0),
        purchaser: currentUser.email
    };
    console.log(productsUnavailable)
    const newTicket = await ticketsModel.create(newTicketInfo);
    const response = {
        message: 'Compra realizada exitosamente',
        ticket: newTicket,
        productsUnavailable: productsUnavailable
      };
      return res.send(response);
} catch (error) {
    console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  });
  

this.post('/', ['PUBLIC', 'PREMIUM'], async(req, res) => {
    const form = req.body
    const currentUserEmail = req.user.email;
    const existingCart = await Cart.findOneByOwner(currentUserEmail);

    if (existingCart) {
      return res.send('Ya tienes un carrito creado');
    }
    const products = await Product.find()
    let foundProduct = false
    if(req.user.role == 'PREMIUM') {
      form.products.map(item => {
        if(products.payload.some(i => i._id.toString() === item.product && i.owner === req.user.email)) return foundProduct = true
      })
    }
    if(foundProduct) {
      return res.send('No puedes agregar tus propios productos')
    }
    const cart = await Cart.create({
      ...form,
      owner: currentUserEmail,
    });
    res.send(cart)
})

this.put('/:cid/products/:pid', ['PUBLIC', 'PREMIUM'], async(req, res) => {
    const {cid, pid} = req.params
    const form = req.body
    const products = await Product.find()
    let foundProduct = false
    if(req.user.role == 'PREMIUM') {
      form.products.map(item => {
        if(products.payload.some(i => i._id.toString() === item.product && i.owner === req.user.email)) return foundProduct = true
      })
    }
    if(foundProduct) {
      // return res.send('No puedes agregar tus propios productos')
      return res.status(400).send({error: 'No puedes agregar tus propios productos'});
    }
    const cart = await Cart.updateOne(cid, pid, form)  
    res.send(cart)
})

this.put('/:cid', ['PUBLIC'], async (req, res) => {
  const { cid } = req.params;
  const form = req.body;
  
  try {

    const products = await Product.find()
    let foundProduct = false
    if(req.user.role == 'PREMIUM') {
      form.map(item => {
        if(products.payload.some(i => i._id.toString() === item.product && i.owner === req.user.email)) return foundProduct = true
      })
    }
    if(foundProduct) {
      // return res.status(400).send('No puedes agregar tus propios productos');
      return res.status(400).send({error: 'No puedes agregar tus propios productos'});
    }
    const existingCart = await Cart.findOne({ _id: cid });
    
    if (!existingCart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const currentProducts = existingCart.products.map(item => ({
      product: ObjectId(item.product._id).toString(),
      quantity: item.quantity
    }));
    console.log(currentProducts)
    console.log(form)

    // Actualizar los productos en el carrito con los detalles proporcionados en 'form'
    form.forEach(updatedProduct => {
      const productIndex = currentProducts.findIndex(item => item.product === updatedProduct.product);
      
      if (productIndex !== -1) {
        // Si el producto existe en el carrito, actualizar su cantidad
        currentProducts[productIndex].quantity += updatedProduct.quantity;
      } else {
        // Si el producto no existe en el carrito, agregarlo al arreglo de productos
        currentProducts.push({
          product: updatedProduct.product,
          quantity: updatedProduct.quantity
        });
      }
    });
    
    // Guardar los cambios en el carrito
    existingCart.products = currentProducts;
    await existingCart.save();
    
    res.send(existingCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el carrito');
  }
});


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