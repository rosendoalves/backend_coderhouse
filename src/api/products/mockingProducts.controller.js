const Route = require('../../router/router')
const generateProducts = require('../../utils/mocks/productMock');

class MockingProductsRouter extends Route {
    init(){

this.get('/',['PUBLIC'],  async (req, res) => {
    try {
        const {quantity} = req.params
        const products = generateProducts(quantity);
        res.send({ message: products })
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})
    }
}

module.exports = MockingProductsRouter