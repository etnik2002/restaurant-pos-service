const router = require("express").Router();
const { createRestaurant,clearCompletedOrders, login, getRestaurantById, getAllRestaurants, getRestaurantProducts, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin } = require("../controllers/restaurant-controller");


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/create', createRestaurant);

router.post('/complete-setup/:id', completeSetup);

router.post('/login', login);

router.post('/login/:id', scannerLogin);

router.get('/all', getAllRestaurants)

router.post('/clear-completed-orders/:restaurant_id', clearCompletedOrders);

router.get('/:id', getRestaurantById);

router.get('/products/:restaurant_id', getRestaurantProducts);

router.get('/categories/:restaurant_id', getRestaurantCategories);

router.get('/most-ordered/:restaurant_id', mostOrderedDish);

router.get('/orders/:restaurant_id', getRestaurantOrders);




module.exports = router;