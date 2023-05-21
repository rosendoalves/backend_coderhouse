const CustomError = require("../Custom.errors");
const EnumErrors = require("../Enum.errors");
const generateErrorInfo = require("../info.errors");

const userError = (userInfo) => {
    CustomError.createError({
        name: "Error al crear el usuario",
        cause: generateErrorInfo(EnumErrors.INVALID_TYPES_ERROR, userInfo),
        message: "Error por datos no válidos",
        code: EnumErrors.INVALID_TYPES_ERROR,
    });
}

module.exports = userError;