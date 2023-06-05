const Route = require('../router/router')

class SessionRouter extends Route {
  init() {
    function privateRoute(req, res, next) {
      if (!req.session.user) return res.json({ error: 'No puedes ver esto!!!' })
      
      next()
    }
    this.get('/current', privateRoute, (req, res) => {
      const { user } = req.session
      res.render('profile.handlebars', {user})
    })

  }
}
    
module.exports = SessionRouter