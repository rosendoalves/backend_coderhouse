const EnumErrors = require("./Enum.errors");

require("colors")



const generateErrorInfo = (code, info) => {

  if(code === EnumErrors.INVALID_TYPES_ERROR){
    const response = `Algunos de los datos son inválidos o inexistentes.
    Lista de datos requeridos:
        *first_name: debe ser un string, se recibió ${info.first_name}.
        *last_name: debe ser un string, se recibió ${info.last_name}.
        *email: debe ser un string, se recibió ${info.email}.
        *age: debe ser un number, se recibió ${info.age}
    `
    return response.red;
}

if(code === EnumErrors.DATABASE_ERROR){
    const response = `Algunos de los datos son inválidos o inexistentes.
    Lista de datos requeridos:
        *User: debe ser un string, se recibió ${info.dbUser}.
        *Password: debe ser un string, se recibió ${info.dbPassword}.
        *Host: debe ser un string, se recibió ${info.dbHost}.
        *Name: debe ser un string, se recibió ${info.dbName}.
    `
    return response.red;
}

if(code === EnumErrors.ROUTING_ERROR){
    const response = `Algunos de los datos son inválidos o inexistentes.
    La ruta buscada no existe.
    `
    return response.red;
}
}

module.exports = generateErrorInfo
