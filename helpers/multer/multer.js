const multer = require('multer');

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/product');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/category');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const productUpload = multer({ storage: productStorage });
const categoryUpload = multer({ storage: categoryStorage });

module.exports = { productUpload,categoryUpload };
