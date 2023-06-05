class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    create = async (newProduct) => {
        try {
            const response = await this.dao.create(newProduct);
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

    findOne = async(id) => {
        try {
            const response = await this.dao.findOne(id);
            return response;            
        } catch (error) {
            console.log(error)
        }
    }

    updateOne = async(id, newProduct) => {
        try {
            const response = await this.dao.updateOne(id, newProduct)
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

module.exports = ProductRepository;