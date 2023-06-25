const UserDTO = require('../../dto/User.dto');
const UserGetDTO = require('../../dto/UserGet.dto');

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
        try {
            const response = await this.dao.find();
            if(response.length > 0) {
            const users = response.map(item => new UserGetDTO(item))
            return users;
            }    
            return response
        } catch (error) {
            console.log(error)
        }
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

    deleteMany = async(filter) => {
        try {
            const response = await this.dao.deleteMany(filter)
            return response
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserRepository;