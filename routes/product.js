const router = require("express").Router();
const { createProduct, getProductById, deleteProduct, editProduct } = require("../controllers/product-controller");
const { productUpload } = require('../helpers/multer/multer');

router.post('/create/:restaurant_id', productUpload.single('image'), createProduct);

router.post('/edit/:id', productUpload.single('image'), editProduct);

router.get('/:id', getProductById);

router.post('/delete/:id', deleteProduct);

module.exports = router;