const passport = require('passport')
const local = require('passport-local')
const User = require('../dao/mongoClassManagers/models/User.model')
const GitHubStrategy = require('passport-github2');
const { createHash, isValidPasswordMethod } = require('../utils/cryptPassword')
const { clientID_github, clientSecret_github } = require('./githubAuth.config');
const userError = require('../utils/errors/user/user.error');

const LocalStrategy = local.Strategy
const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
          { passReqToCallback: true, usernameField: 'email' },
          async (req, username, password, done) => {
            const { first_name, last_name, age, email } = req.body
            let role = false
            try {
              const user = await User.findOne({ email: username });

              if (!first_name || !last_name || !email || !age) {
                userError({ first_name, last_name, age, email });
              }
    
              if (user) {
                console.log('El usuario ya existe');
                return done(null, false);
              }

              if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                role = true
              } 
    
              const newUserInfo = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: role ? 'admin' : 'user'
              };
    
              const newUser = await User.create(newUserInfo);
              return done(null, newUser);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
      passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
      });
    

      passport.use(
        'login',
        new LocalStrategy(
          { usernameField: 'email' },
          async (username, password, done) => {
            try {
              const user = await User.findOne({ email: username });
    
              if (!user) {
                console.log('Usuario no existe');
                return done(null, false);
              }
    
              if (!isValidPasswordMethod(password, user)) return done(null, false);
               delete user.password
                // req.session.user = {
                // first_name: user.first_name,
                // last_name: user.last_name,
                // email: user.email,
                // cart: user.cart,
                // role: user.role
                // }
              return done(null, user);
            } catch (error) {
              req.logger.error("Usuario no autenticado")
              // return done(error);
            }
          }
        )
      );
    
      passport.use(
        'github',
        new GitHubStrategy(
          {
            clientID: clientID_github,
            clientSecret: clientSecret_github,
            callbackURL: 'http://localhost:3001/auth/githubcallback',
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              console.log(profile);
              const user = await User.findOne({ email: profile._json.email });
              if (!user) {
                const newUserInfo = {
                  first_name: profile._json.name,
                  last_name: '',
                  age: 18,
                  email: profile._json.email,
                  password: '',
                };
    
                const newUser = await User.create(newUserInfo);
                req.logger.info("Nuevo usuario registrado")
                return done(null, newUser);
              }
              done(null, user);
            } catch (error) {
              done(error);
            }
          }
        )
      );
    
}

module.exports = initializePassport