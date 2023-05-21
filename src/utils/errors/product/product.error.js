const CustomError = require("../Custom.errors");
const EnumErrors = require("../Enum.errors");
const generateProductErrorInfo = require("../info.products.errors");

require("colors")

const productError = (productInfo) => {
    CustomError.createError({
            name: "Error al agregar el producto",
            cause: generateProductErrorInfo(productInfo),
            message: "Error por datos no válidos",
            code: EnumErrors.INVALID_TYPES_ERROR,
        });
    }

module.exports = productError