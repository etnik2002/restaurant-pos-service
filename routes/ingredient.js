const router = require("express").Router();
const { createIngredient, deleteIngredient, getIngredients } = require("../controllers/ingredient-controller");


router.post('/create/:restaurant_id', createIngredient);

router.get('/:restaurant_id', getIngredients)

router.post('/delete/:id', deleteIngredient);

module.exports = router;