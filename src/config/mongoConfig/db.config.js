const dotenv = require('dotenv')

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`,
})

module.exports = {
    userDb: process.env.USER_DB || 'admin',
    passDb: process.env.PASS_DB || 'admin',
    msPass: process.env.MONGO_STORE_PASS || 'admin'
}
