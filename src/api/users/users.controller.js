const Route = require('../../router/router')
const passport = require('passport');
const User = require('../../repositories/user');
const uploader = require('../../utils/multer.utils');
const path = require('path');
const fs = require('fs');

class UsersRouter extends Route {
  init(){
this.post('/', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'users/failRegister'}), async (req, res) => {
  try {
    res.redirect('/login')
  } catch (error) {
    if (newUser.code === 11000) return res.status(400).json({ error: 'El usuario ya existe' })
    res.status(500).json({ error: 'Internal server error' })
  }
})

this.put('/premium/:uid', ['USER', 'PREMIUM'], async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (user) {
      const uploadPath = path.join(__dirname, '..', '..', 'documents', user.email);
      const accountFolderPath = path.join(uploadPath, 'account');
      const addressFolderPath = path.join(uploadPath, 'address');
      const documentFolderPath = path.join(uploadPath, 'document');

      if (user.role === 'PREMIUM') {
        return res.send('Ya eres premium');
      }

      if( !fs.existsSync(uploadPath) && !fs.existsSync(accountFolderPath) && !fs.existsSync(addressFolderPath) && !fs.existsSync(documentFolderPath)) return res.send('No cargaste los documentos necesarios');

      const accountFiles = fs.readdirSync(accountFolderPath);
      const addressFiles = fs.readdirSync(addressFolderPath);
      const documentFiles = fs.readdirSync(documentFolderPath);

      if (
        accountFiles.length > 0 &&
        addressFiles.length > 0 &&
        documentFiles.length > 0
      ) {
        await User.updateOne({ _id: uid }, { role: 'PREMIUM' });
        return res.send('Rol cambiado a PREMIUM');
      } else {
        return res.send('No completó la carga de archivos para ser premium');
      }
    } else {
      return res.send('No se puede actualizar porque no se encuentra el usuario');
    }
  } catch (error) {
    return res.send(`Something went wrong: ${error}`);
  }
});

this.put('/change-role/:uid', ['ADMIN'], async (req, res) => {
  try {
    const {uid} = req.params
    const user = await User.findById(uid)
    if(user) {
      const update = {
        role: user.role === 'ADMIN' ? 'PREMIUM' : 'ADMIN'
      };
      await User.updateOne({_id: uid}, update)
      return res.send(`Rol cambiado a ${user.role == 'ADMIN' ? 'PREMIUM' : 'ADMIN'}`)
    } else {
      res.send('No se puede actualizar porque no se encuentra el usuario')
    }
  } catch (error) {
    res.send(`Something went wrong: ${error}`)
  }
})

this.post('/:uid/documents', ["USER", "ADMIN", "PREMIUM"], uploader.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se pudieron cargar los archivos' });
    }

    const currentUser = req.user;

        if (currentUser.role === "PREMIUM") {
          return res.sendSuccess("Ya eres Premium")
        }
        res.send(`Tus archivos se cargaron correctamente`)
  } catch (error) {
    return res.status(500).send(`Something went wrong: ${error}`);
  }
});


this.get('/failRegister', ['PUBLIC'], async(req,res) => {
  res.send({error:"Failed Register"})
})


this.get('/', ['ADMIN'], async(req,res) => {
  const users = await User.find()
  const filteredUsers = users.filter(user => user.email != req.user.email);
  res.send(filteredUsers)
})

this.delete('/:id', ['ADMIN'], async(req,res) => {
  try {
    const id = req.params.id
        const user = await User.deleteOne(id)
        res.send(user)

    return 'Usuario eliminado'
    
} catch (error) {
    req.logger.error('Sin resultado')
}
})


this.delete('/', ['ADMIN'], async(req,res) => {
  try {
      const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 8); // Restar 48 horas

      const filter = {
        last_connection: {
          $lt: currentDate
        }
      };
        const users = await User.deleteMany(filter)
        res.send(users)

    return 'Usuarios eliminados con última conexión superior a dos días'
    
} catch (error) {
    req.logger.error('Sin resultado')
}
})
  }
}

module.exports = UsersRouter