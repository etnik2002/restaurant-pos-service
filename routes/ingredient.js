const router = require("express").Router();
const { createIngredient, deleteIngredient, getIngredients } = require("../controllers/ingredient-controller");
const apicache = require("apicache");
const cache = apicache.middleware;

router.post('/create/:restaurant_id', createIngredient);

router.get('/:restaurant_id',cache('10 minutes'), getIngredients)

router.post('/delete/:id', deleteIngredient);

module.exports = router;