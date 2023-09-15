const router = require("express").Router();
const { createCategory, getCategoryById, getCategoryProducts, editCategoryByID } = require("../controllers/category-controller");
const {categoryUpload} = require('../helpers/multer/multer')

router.post('/create/:restaurant_id', categoryUpload.single('image'), createCategory);

router.post('/edit/:id', categoryUpload.single('image'), editCategoryByID);

router.get('/:id', getCategoryById);

router.get('/products/:restaurant_id/:id', getCategoryProducts);


module.exports = router;