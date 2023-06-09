const express =  require('express')
const cors = require('cors')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars');
// const {Server} = require('socket.io')
const router = require('./router/index.js')
const cookieParser = require('cookie-parser')
// const FileStore = require('session-file-store')
const http = require('http')
const { port } = require('../src/config')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const session = require("express-session");
const errorHandler = require('./middlewares/errors/handler.errors')
const loggerMiddleware = require('./middlewares/logger.middlewares.js')

// const messages = []
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const app = express()

app.use(express.json())
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'AppCoder By Rosendo Alves',
            description: 'Documentation of Backend de CoderHouse'
        }
    },
    apis: [`${__dirname}\\docs\\**\\*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
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
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false,
  }));
initializePassport()
app.use(passport.initialize())
app.use(passport.session());

app.use(errorHandler)
app.use(loggerMiddleware)
app.use(cors())

router(app)



const httpServer = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// const io = new Server(httpServer)
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


