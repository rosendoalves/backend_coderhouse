const User = require("../models/User.model")

class UserDao {

  async find() {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      return error
    }
    
  }

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
      const response = await User.updateOne({ _id: id }, newUser)
      return response
    } catch (error) {
      return error
    }
  
  }
  async deleteOne(id) {
    try {
      const user = User.findOne(id)
      const response = await User.deleteOne({ _id: id }, user)
      return response
    } catch (error) {
      return error
    }
 
  }
  async deleteMany(filter) {
    try {
      const response = await User.deleteMany(filter)
      return response
    } catch (error) {
      return error
    }
  }
}

module.exports = UserDao