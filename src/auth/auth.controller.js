const Route = require('../router/router')
const passport = require('passport');
// const User = require('../dao/mongoClassManagers/user/User.dao')
const User = require('../repositories/user')
// const { isValidPasswordMethod } = require('../utils/cryptPassword')

class AuthRouter extends Route {
  init(){
this.post('/', ['PUBLIC'], passport.authenticate('login', {failureRedirect:'auth/faillogin'}), async (req, res) => {
  const { email } = req.body
  
  const user = await User.findOne({ email })
  try {

    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' })

    // if (user.password !== password) return res.status(400).json({ error: 'El usuario y la contraseña no coinciden' })
    // if(!isValidPasswordMethod(password, user)) return res.status(403).send({status:"error", error:"La contraseña no es correcta"})
    req.session.destroy
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role
    }
    const currentDate = new Date();
    await User.updateOne({ _id: req.user._id }, {last_connection: currentDate});
    // res.status(201).json({ message: 'Sesión iniciada' })
    res.redirect('/products')
  } catch (error) {
    // console.log(error)
    req.logger.error("Usuario no autenticado")
    res.status(500).json({ error: 'Internal server error' })
  }
})

this.get('/faillogin', ['PUBLIC'], async(req,res) => {
  res.send({error:"Failed Login"})
})

this.get(
  '/github',
  ['PUBLIC'],
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

this.get(
  '/githubcallback',
  ['PUBLIC'],
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }
);

this.post('/logout', ['PUBLIC'], async(req, res) => {
  const currentDate = new Date();
  await User.updateOne({ _id: req.user._id }, {last_connection: currentDate});
  req.session.destroy(error => {
    if (error) return res.json({ error })
    res.redirect('/login')
  })
})
  }
}

module.exports = AuthRouter