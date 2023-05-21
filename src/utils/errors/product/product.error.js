const CustomError = require("../Custom.errors");
const EnumErrors = require("../Enum.errors");

require("colors")

const productError = (productInfo) => {
    CustomError.createError({
            name: "Error al agregar el producto",
            cause: `Alguno de los datos son inválidos.
            *Título: Se esperaba un string, se recibió: ${productInfo.title}
            *Description: Se esperaba un string, se recibió: ${productInfo.description}
            *Price: Se esperaba un number, se recibió: ${productInfo.price}
            *Thumbnail: Se esperaba un string, se recibió: ${productInfo.thumbnail}
            *Code: Se esperaba un string, se recibió: ${productInfo.code}
            *Stock: Se esperaba un number, se recibió: ${productInfo.stock}
            *Category: Se esperaba un string, se recibió: ${productInfo.category}`.red,
            message: "Error por datos no válidos",
            code: EnumErrors.INVALID_TYPES_ERROR,
        });
    }

module.exports = productError