const Route = require('../../router/router')
const passport = require('passport');
const User = require('../../repositories/user')
// const UserDao = require('../../dao/User.dao')
// const User = new UserDao()
// const {createHash} = require('../../utils/cryptPassword')

class UsersRouter extends Route {
  init(){
this.post('/', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'users/failRegister'}), async (req, res) => {
  try {
    res.redirect('/login')
  } catch (error) {
    // console.log(error)
    if (newUser.code === 11000) return res.status(400).json({ error: 'El usuario ya existe' })
    res.status(500).json({ error: 'Internal server error' })
  }
})

this.put('/premium/:uid', ['ADMIN'], async (req, res) => {
  try {
    const {uid} = req.params
    const user = await User.findById(uid)
    if(user) {
      const update = {
        role: user.role === 'ADMIN' ? 'PREMIUM' : 'ADMIN'
      };
      const userUpdate = await User.updateOne({_id: uid}, update)
      return res.send(`Rol cambiado a ${user.role == 'ADMIN' ? 'PREMIUM' : 'ADMIN'}`)
    } else {
      res.send('No se puede actualizar porque no se encuentra el usuario')
    }
  } catch (error) {
    res.send(`Something went wrong: ${error}`)
  }
})

this.get('/failRegister', ['PUBLIC'], async(req,res) => {
  res.send({error:"Failed Register"})
})
  }
}

module.exports = UsersRouter