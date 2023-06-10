const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const user = req?.user?.email;
    if (!user) {
      return cb(new Error('No se está solicitando por un usuario logueado'));
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error('Tipo de archivo no permitido'));
    }


    const possibleDest = {
        profile: "profile",
        product: "product",
        document: "document",
        address: "address",
        account: "account"
    }

    const folder = possibleDest[file.fieldname];

    if(!folder) {
        return cb(new Error('el nombre del archivo es incorrecto, debe ser "profile", "product", "document", "address" o "account"'));
    }

    const uploadPath = path.join(__dirname, '..', 'documents', user, folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploader = multer({ storage });

module.exports = uploader;
