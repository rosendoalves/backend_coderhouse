const Route = require('../router/router')
const { publicAccess, privateAccess } = require('../middlewares')
const ProductDao = require('../dao/mongoClassManagers/product/Product.dao')
const ProductManager = new ProductDao()
const CartDao = require('../dao/mongoClassManagers/cart/Cart.dao')
const CartManager = new CartDao()
const transport = require('../utils/email.utils')
// const User = require('../repositories/user')
const { emailUser } = require('../config/email.config')
const { isValidPasswordMethod, createHash } = require('../utils/cryptPassword')
const User = require('../repositories/user/User.repository')

class ViewsTemplateRouter extends Route {
  init() {

this.get('/', ['PUBLIC'], privateAccess, (req, res) => {
  const { user } = req.session
  res.render('profile.handlebars', { user })
})

this.get('/login', ['PUBLIC'], publicAccess, (req, res) => {
  res.render('login.handlebars')
})

this.get('/signup', ['PUBLIC'], publicAccess, (req, res) => {
  res.render('signup.handlebars')
})

this.get('/admin', ['ADMIN'], privateAccess, async(req, res) => {
  res.render('admin.handlebars')
})

this.get('/products', ['PUBLIC'],  async(req, res) => {
  const products = await ProductManager.find()
  const payload = products.payload
  const { user } = req.session
  const {admin} = req.session.role === 'ADMIN' ? true : false
  res.render('products.handlebars', {products, payload, user, admin})
})

this.get('/carts/:cid', ['PUBLIC'], async(req, res) => {
  const {cid} = req.params
      const cart = await CartManager.findOne(cid)  
      const {products} = cart
      res.render('cart.handlebars', {cart, products})
})

this.get('/loggerTest/:clase', ['PUBLIC'], async(req, res) => {
  try {
    const loggerType = req.params.clase;
    switch (loggerType) {
        case 'fatal':
            req.logger.fatal("logger fatal")
            break;
        case 'error':
            req.logger.error("logger error")
            break;

        case 'warning':
            req.logger.warning("logger warning")
            break;

        case 'info':
            req.logger.info("logger info")
            break;

        case 'http':
            req.logger.http("logger http")
            break;

        case 'debug':
            req.logger.debug("logger debug")
            break;
        default:
            break;
    }
    res.status(200).json({message: 'success'});
}
catch (error) {
    res.send(`something went wrong ${error}`)
}
})

this.post('/reset-password', ['PUBLIC'], async(req,res) => {
  try {
    const { to } = req.body
    const expirationTime = new Date().getTime() + 3600000; 
    let linkMold = req.protocol + '://' + req.get('host');
    const url = linkMold + `/recovery/${expirationTime}`;
    const recoveryUrl = url.split('/recovery/')[0] + '/recovery/' + url.split('/recovery/')[1];
    const email = {email: req.body.to}
    // req.session.destroy
    req.session.expirationTime = expirationTime;
    req.session.email = email
    const mailOptions = {
      from: emailUser,
      to,
      subject: "Password recovery",
      html: `
        <div>
          <h1>  
            Continúa al siguiente enlace para restablecer tu contraseña:
          </h1>
          <a>${recoveryUrl}</a>
        </div>
      `,
      attachments: [],
    }

    await transport.sendMail(mailOptions)
    res.redirect('/login')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

this.get('/recovery', ['PUBLIC'], publicAccess, (req, res) => {
      res.render('recovery.handlebars')
    
})
this.get('/recovery/:id', ['PUBLIC'], publicAccess, (req, res) => {
  try {
    const id = req.params.id
    const currentTimestamp = new Date().getTime();
    if (req.session.expirationTime && (currentTimestamp < req.session.expirationTime)) {
      res.status(200).redirect(`/reset-password/${id}`)
    } else {
      res.redirect(`/login`)
    }
  } catch (error) {
    res.send(`something went wrong ${error}`)
    
  }
})

this.get('/reset-password/:id', ['PUBLIC'], (req, res) => {
  try {
    const id = req.params.id
    if(id) {
      res.status(200).render('forgetPassword');
    } else {
      render('login');
    }
}
catch (error) {
    res.sendServerError(`something went wrong ${error}`)
}
})

this.post('/password-update', ['PUBLIC'], async (req, res) => {
  try {
    const pw1 = req.body.newPassword1;
    const pw2 = req.body.newPassword2;
    const email = req.session.email;
    const user = await User.findOne(email);
    if (pw1 === pw2) {
      if (isValidPasswordMethod(pw1, user)) {
        res.json({ status: 'error', message: 'Contraseña ya utilizada, elija una distinta' });
      } else {
        await User.updateOne(user._id, { password: createHash(pw1) });
        res.json({ status: 'success', message: 'Contraseña actualizada, vuelva a loguearse' });
      }
    } else {
      res.json({ status: 'error', message: 'Contraseñas no coinciden.' });
    }
  } catch (error) {
    res.json({ status: 'error', message: `something went wrong ${error}` });
  }
});

  }
}

module.exports = ViewsTemplateRouter