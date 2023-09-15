const router = require("express").Router();
const { createProduct, getProductById } = require("../controllers/product-controller");
const { productUpload } = require('../helpers/multer/multer');

router.post('/create/:restaurant_id', productUpload.single('image'), createProduct);

router.get('/:id', getProductById);

module.exports = router;