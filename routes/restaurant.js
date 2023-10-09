const router = require("express").Router();
const { createRestaurant, login, getRestaurantById,registerPrinter, getAllRestaurants, getRestaurantProducts, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin,getAllWaiters, getTodaysOrders, getRestaurantPrinters } = require("../controllers/restaurant-controller");


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/printer/connect/:restaurant_id', registerPrinter);

router.get('/printers/:id', getRestaurantPrinters)

router.post('/create', createRestaurant);

router.post('/complete-setup/:id', completeSetup);

router.post('/login', login);

router.post('/login/:id', scannerLogin);

router.get('/all', getAllRestaurants)


router.get('/:id', getRestaurantById);

router.get('/orders/today/:restaurant_id', getTodaysOrders)

router.get('/products/:restaurant_id', getRestaurantProducts);

router.get('/categories/:restaurant_id', getRestaurantCategories);

router.get('/most-ordered/:restaurant_id', mostOrderedDish);

router.get('/orders/:restaurant_id', getRestaurantOrders);

router.get('/waiters/:restaurant_id', getAllWaiters);




module.exports = router;