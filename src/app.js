const express =  require('express')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars');
const {Server} = require('socket.io')
const router = require('./router/index.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const http = require('http')
const { db, port } = require('../src/config')
const { userDb, passDb, msPass } = db
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const errorHandler = require('./middlewares/errors/handler.errors')

const messages = []
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine(
    {
        defaultLayout: 'main',
        // ...implement newly added insecure prototype access
        handlebars: allowInsecurePrototypeAccess(Handlebars)
        }
))
app.set('views', __dirname +'/views')
app.set('view engine', 'handlebars')

app.use(cookieParser('LoQueQuieras'))
initializePassport()
app.use(passport.initialize())
app.use(session({
  // store: new fileStorage({ path: __dirname + '/sessions', ttl: 100, retries: 0 }),
  store: MongoStore.create({
    mongoUrl:`mongodb+srv://${userDb}:${passDb}@cluster0.zygdc.mongodb.net/session?retryWrites=true&w=majority`,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  }),
  secret: msPass,
  resave: false,
  saveUninitialized: false
}))

router(app)
app.use(errorHandler)

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb+srv://${userDb}:${passDb}@cluster0.zygdc.mongodb.net/ecommerce?retryWrites=true&w=majority`, error => {
    if(error) { 
        console.log(`Error: ${error}`)
    } else {
        console.log('Database is connected')
    }
})



const httpServer = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const io = new Server(httpServer)
global.io = require('socket.io')(httpServer)

global.io.on('connection', socket => {
    console.log('Cliente Conectado')

        const optionsProducts = {
            host: 'localhost',
            port: port,
            path: '/api/products',
        };
      
        http.get(optionsProducts, res => {
            let products = '';
            res.on('data', chunk => {
                products += chunk;
            });
        
        res.on('end', () => {
            products = JSON.parse(products);
            socket.emit("productsList", products.payload );
        });
    })

// Messages
       
socket.on('newUser', user => {
    socket.broadcast.emit('newUserConnected', user)
   
    const optionsMessages = {
        host: 'localhost',
        port: port,
        path: '/messages/chat',
    };

    http.get(optionsMessages, res => {
        let messages = '';
        res.on('data', chunk => {
            messages += chunk;
        });

    res.on('end', () => {
        messages = JSON.parse(messages);
        socket.emit("allChats", messages );
    });
    })

  })

})


