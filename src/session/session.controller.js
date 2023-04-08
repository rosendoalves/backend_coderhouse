const { Router } = require('express')

const router = Router()

// router.get('/', (req, res) => {
//   if (!req.session.counter) {
//     req.session.counter = 1
//     return res.json({ message: 'Bienvenido' })
//   }

//   req.session.counter++
//   res.json({ message: `Has visitado el sitio por ${req.session.counter} veces` })
// })

// router.get('/login', (req, res) => {
//   const { user, password } = req.query

//   if (user === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//     req.session.user = user
//     req.session.admin = true

//     return res.json({ message: 'Sesión iniciada' })
//   } 

//   res.json({ error: 'No se pudo iniciar sesión' })
// })


// router.get('/logout', (req, res) => {
  //   req.session.destroy(error => {
    //     if (error) return res.json({ error })
    
    //     res.json({ message: 'Sesión finalizada' })
    //   })
    // })
    
    function privateRoute(req, res, next) {
      if (!req.session.user) return res.json({ error: 'No puedes ver esto!!!' })
      
      next()
    }
    router.get('/current', privateRoute, (req, res) => {
      const { user } = req.session
      res.render('profile.handlebars', {user})
    })
    
module.exports = router