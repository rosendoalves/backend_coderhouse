const { Router } = require('express')
const passport = require('passport');
const User = require('../dao/models/User.model')
const { isValidPasswordMethod } = require('../utils/cryptPassword')

const router = Router()

router.post('/', passport.authenticate('login', {failureRedirect:'auth/faillogin'}), async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    // if (!user) return res.status(400).json({ error: 'Usuario no encontrado' })

    // if (user.password !== password) return res.status(400).json({ error: 'El usuario y la contraseña no coinciden' })
    // if(!isValidPasswordMethod(password, user)) return res.status(403).send({status:"error", error:"La contraseña no es correcta"})
    delete user.password
    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
    // res.status(201).json({ message: 'Sesión iniciada' })
    res.redirect('/products')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/faillogin', async(req,res) => {
  res.send({error:"Failed Login"})
})

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }
);

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) return res.json({ error })

    res.redirect('/login')
  })
})

module.exports = router