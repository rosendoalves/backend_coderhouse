const { persistence } = require('../config/index');
const mongoConnect = require('../config/mongoConfig/config.mongo');

switch (persistence) {
    case "memory":
        console.log('File System is available')
        module.exports = require("./fsClassManagers/product/ProductManager")
    break;
    
    case "mongo":
        mongoConnect();
        module.exports = require("./mongoClassManagers/product/Product.dao")
    break;
}