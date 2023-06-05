const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')
const session = require("express-session");

const { userDb, passDb, msPass } = require("./db.config");

const mongoConnect = async () => {
    try {
        await session({
            // store: new fileStorage({ path: __dirname + '/sessions', ttl: 100, retries: 0 }),
            store: MongoStore.create({
            mongoUrl:`mongodb+srv://${userDb}:${passDb}@cluster0.zygdc.mongodb.net/session?retryWrites=true&w=majority`,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            }),
            secret: msPass,
            resave: false,
            saveUninitialized: false
            })
        await mongoose.set('strictQuery', false)
        await mongoose.connect(`mongodb+srv://${userDb}:${passDb}@cluster0.zygdc.mongodb.net/ecommerce?retryWrites=true&w=majority`, error => {
            if(error) { 
                console.log(`Error: ${error}`)
            } else {
                console.log('Database is connected')
            }
        })
    } catch (error) {
        console.log(error)
        
    }
       
}

module.exports = mongoConnect;