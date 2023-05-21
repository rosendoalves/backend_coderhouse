const { Router } = require('express')
const passport = require('passport');
// const UserDao = require('../../dao/User.dao')
// const User = new UserDao()
// const {createHash} = require('../../utils/cryptPassword')

const router = Router()

router.post('/', passport.authenticate('register', {failureRedirect:'users/failRegister'}), async (req, res) => {
  try {
    // const { first_name, last_name, age, email, password } = req.body

    // let role = false
   
  // if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
  //   role = true
  // } 

    // const newUserInfo = {
    //   first_name,
    //   last_name,
    //   age,
    //   email,
    //   password: createHash(password),
    //   role: role ? 'admin' : 'user'
    // }

    // const newUser = await User.create(newUserInfo)
    // if (newUser.code === 11000) return res.status(400).json({ error: 'El usuario ya existe' })
    // res.status(201).json({ message: newUser })
    res.redirect('/login')
  } catch (error) {
    // console.log(error)
    if (newUser.code === 11000) return res.status(400).json({ error: 'El usuario ya existe' })
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/failRegister', async(req,res) => {
  res.send({error:"Failed Register"})
})

module.exports = router