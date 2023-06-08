const User = require("../models/User.model")

class ProductDao {

  async findOne(email) {
    try {
      const user = await User.findOne(email)
      return user
    } catch (error) {
      return error
    }
    
  }

  async findById(id) {
    try {
      const user = await User.findById({_id: id})
      return user
    } catch (error) {
      return error
    }
    
  }

  async create(newUser) {
    try {
      const response = await User.create(newUser)
      return response
    } catch (error) {
      return error
    }
  }

  async updateOne(id, newUser) {
    try {
      // const user = User.findOne(id)
      const response = await User.updateOne({_id: id}, {$set: { newUser }})
      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = ProductDao