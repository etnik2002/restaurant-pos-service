const router = require("express").Router();
<<<<<<< HEAD
const { createRestaurant, login, getRestaurantById,registerPrinter, getAllRestaurants, getRestaurantProducts, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin,getAllWaiters, getTodaysOrders, help } = require("../controllers/restaurant-controller");
=======
const { createRestaurant, login, getRestaurantById,registerPrinter, getAllRestaurants, getRestaurantProducts, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin,getAllWaiters, getTodaysOrders, deletePrinter } = require("../controllers/restaurant-controller");
>>>>>>> 1aab9e07adeb5f46214839c6fb63f38001f9c807


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/printer/connect/:restaurant_id', registerPrinter);

router.post('/printer/delete/:restaurant_id/:printer_id', deletePrinter);

router.post('/create', createRestaurant);

router.post('/help', help);

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