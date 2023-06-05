const Product = require("../models/Product.model")

class ProductDao {
  async find(limit, page, sort, field, query) {
    const options = {
      sort: { price: sort ? Number(sort) : 1},
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
    };

    try {
        const users = await Product.paginate(field ? { [field]: query } : {}, options)
        const {docs, ...rest} = users
      return { status: 'success', payload: docs, ...rest }
    } catch (error) {
      return { status: 'error', payload: error }
    }    
  }

  async findOne(id) {
    try {
      const user = await Product.findOne({_id: id})
      return user
    } catch (error) {
      return error
    }
    
  }

  async create(newProduct) {
    try {
      const response = await Product.create(newProduct)
      return response
    } catch (error) {
      return error
    }
  }

  async updateOne(id, newProduct) {
    try {
      const product = Product.findOne(id)
      const response = await Product.updateOne(product, newProduct)
      return response
    } catch (error) {
      return error
    }
  }

  async deleteMany() {
    try {
      await Product.deleteMany()
      return 'Productos eliminados'
    } catch (error) {
      return error
    }
  }

  async deleteOne(id) {
    try {
      const product = Product.findOne(id)
      await Product.deleteOne(product)
      return 'Producto eliminado'
    } catch (error) {
      return error
    }
  }
}

module.exports = ProductDao