const Cart = require("../models/Cart.model")

class CartDao {
  async find() {
    try {
      const carts = await Cart.find()
      return carts
    } catch (error) {
      return error
    }
    
  }

  async findOne(id) {
    try {
      const cart = await Cart.findOne({_id: id}).populate('products.product')
      return cart
    } catch (error) {
      return error
    }
    
  }

  async create(newCart) {
    try {
      const response = await Cart.create(newCart)
      return response
    } catch (error) {
      return error
    }
  }

  async updateOne(cartId, productId, form) {
    const {quantity} = form
    try {
      await Cart.updateOne({ _id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': Number(quantity) } })
      return 'Producto actualizado en el carrito'
    } catch (error) {
      return 'error'
    }
  }
  
  async updateOnes(cartId, form) {
    try {
      await Cart.updateOne({ _id: cartId }, { $set: { 'products': form } })
      return 'Productos actualizados en el carrito'
    } catch (error) {
      return 'error'
    }
  }

  async deleteMany() {
    try {
      await Cart.deleteMany()
      return 'Carritos eliminados'
    } catch (error) {
      return error
    }
  }

  async deleteOne(cartId) {
    try {
      await Cart.updateOne({ _id: cartId }, { $set: { 'products': []} })
      return 'Productos eliminados del carrito'
    } catch (error) {
      return error
    }
  }

  async deleteOnes(cartId, productId) {
    try {
      await Cart.updateOne({ _id: cartId }, { $pull: { products: { product: productId } } })
      return 'Producto eliminado del carrito'
    } catch (error) {
      return error
    }
  }
}

module.exports = CartDao