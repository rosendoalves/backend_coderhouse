require("colors")

const generateProductErrorInfo = (productInfo) => {

    const response =`Alguno de los datos son inválidos:
    *Título: Se esperaba un string, se recibió: ${productInfo.title}.
    *Description: Se esperaba un string, se recibió: ${productInfo.description}.
    *Price: Se esperaba un number, se recibió: ${productInfo.price}.
    *Thumbnail: Se esperaba un string, se recibió: ${productInfo.thumbnail}.
    *Code: Se esperaba un string, se recibió: ${productInfo.code}.
    *Stock: Se esperaba un number, se recibió: ${productInfo.stock}.
    *Status: Se esperaba un boolean, se recibió: ${productInfo.status}.
    *Category: Se esperaba un string, se recibió: ${productInfo.category}.`
    return response.red;
}

module.exports = generateProductErrorInfo
