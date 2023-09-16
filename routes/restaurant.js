const router = require("express").Router();
const { createRestaurant, login, getRestaurantById, getAllRestaurants, getRestaurantProducts,getRestaurantExtras, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin } = require("../controllers/restaurant-controller");


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/create', createRestaurant);

router.post('/complete-setup/:id', completeSetup);

router.post('/login', login);

router.post('/login/:id', scannerLogin);

router.get('/all', getAllRestaurants)

router.get('/:id', getRestaurantById);

router.get('/products/:restaurant_id', getRestaurantProducts);

router.get('/categories/:restaurant_id', getRestaurantCategories);

router.get('/most-ordered/:restaurant_id', mostOrderedDish);

router.get('/orders/:restaurant_id', getRestaurantOrders);

router.get('/extras/:restaurant_id', getRestaurantExtras);

module.exports = router;