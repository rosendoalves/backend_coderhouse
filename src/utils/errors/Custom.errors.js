class CustomErrors {
  static createError({ name = 'Error', cause, message, code = 1 }) {
    const error = new Error(message)
    error.cause = cause
    error.name = name
    error.code = code
    console.log('hola hola', error.cause)
    console.log('hola hola', typeof error.cause)
    throw error
  }
}

module.exports = CustomErrors
