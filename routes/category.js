const router = require("express").Router();
const { createCategory, getCategoryById, getCategoryProducts } = require("../controllers/category-controller");

router.post('/create/:restaurant_id', createCategory);

router.get('/:id', getCategoryById);

router.get('/products/:restaurant_id/:id', getCategoryProducts);

module.exports = router;