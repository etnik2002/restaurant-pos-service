const router = require("express").Router();
const { createProduct, getProductById } = require("../controllers/product-controller");


router.post('/create/:restaurant_id/:cateogry', createProduct);

router.get('/:id', getProductById);

module.exports = router;