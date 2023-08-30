const router = require("express").Router();
const { createRestaurant, login, getRestaurantById, getAllRestaurants, getRestaurantProducts,getRestaurantExtras, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders } = require("../controllers/restaurant-controller");


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/create', createRestaurant);

router.post('/login', login);

router.get('/all', getAllRestaurants)

router.get('/:id', getRestaurantById);

router.get('/products/:restaurant_id', getRestaurantProducts);

router.get('/categories/:restaurant_id', getRestaurantCategories);


router.get('/orders/:restaurant_id', getRestaurantOrders);

router.get('/extras/:restaurant_id', getRestaurantExtras);

module.exports = router;