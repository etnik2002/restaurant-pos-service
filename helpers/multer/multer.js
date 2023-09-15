const multer = require('multer');

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/product');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const productUpload = multer({ storage: productStorage });

module.exports = { productUpload };
