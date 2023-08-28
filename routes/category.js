const router = require("express").Router();
const { createCategory, getCategoryById } = require("../controllers/category-controller");


router.post('/create', createCategory);

router.get('/:id', getCategoryById);

router.get('/products/:restaurant_id/:id');

module.exports = router;