const UserDTO = require('../../dto/User.dto')

class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    create = async (newUser) => {
        try {
            const newUserInfo = new UserDTO(newUser)
            const response = await this.dao.create(newUserInfo);
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

    find = async() => {
        // try {
            const response = await this.dao.find();
            return response;
        // } catch (error) {
            // throw error
        // }
    }

    findById = async(id) => {
        try {
            const response = await this.dao.findById(id);
            return response;            
        } catch (error) {
            console.log(error)
        }
    }
    findOne = async(email) => {
        try {
            const response = await this.dao.findOne(email);
            return response;            
        } catch (error) {
            console.log(error)
        }
    }

    updateOne = async(id, newUser) => {
        try {
            const response = await this.dao.updateOne(id, newUser)
            return response
        } catch (error) {
            console.log(error);
        }
    }

    deleteOne = async(id) => {
        try {
            const response = await this.dao.deleteOne(id)
            return response
        } catch (error) {
            console.log(error);
        }
    }

    deleteMany = async() => {
        try {
            const response = await this.dao.deleteMany()
            return response
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserRepository;