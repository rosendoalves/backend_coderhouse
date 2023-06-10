const Route = require('../../router/router')
const passport = require('passport');
const User = require('../../repositories/user');
const uploader = require('../../utils/multer.utils');
const path = require('path');
const fs = require('fs');
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

    // const { uid } = req.params;
    // const user = await User.findById(uid);

    // if (user) {
    //   const update = {
    //     documents: user.documents.length > 0 ? [...user.documents] : [],
    //   };

    //   // Procesar cada archivo adjunto
    //   req.files.forEach((file) => {
    //     const newDocument = {
    //       name: file.originalname,
    //       reference: file.path,
    //     };
    //     update.documents.push(newDocument);
    //   });

    //   const userUpdate = await User.updateOne({ _id: uid }, update);
    //   return res.send(userUpdate);
    // } else {
    //   return res.status(404).send('No se puede actualizar porque no se encuentra el usuario');
    // }
  } catch (error) {
    return res.status(500).send(`Something went wrong: ${error}`);
  }
});


this.get('/failRegister', ['PUBLIC'], async(req,res) => {
  res.send({error:"Failed Register"})
})
  }
}

module.exports = UsersRouter