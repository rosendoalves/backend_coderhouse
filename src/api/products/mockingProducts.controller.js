const {Router} = require('express');
const generateProducts = require('../../utils/mocks/productMock');

const router = Router()

router.get('/', async (req, res) => {
    try {
        const {quantity} = req.params
        const products = generateProducts(quantity);
        res.send({ message: products })
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})

module.exports = router