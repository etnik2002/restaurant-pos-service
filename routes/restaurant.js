const router = require("express").Router();
const { createRestaurant, login,finishSetup, getRestaurantById,registerPrinter,changeCurrency, getAllRestaurants, getRestaurantProducts, getRestaurantCategories, getRestaurantFloor, getRestaurantOrders, mostOrderedDish, completeSetup, scannerLogin,getAllWaiters, getTodaysOrders, deletePrinter, help, updateReceipt, searchLocalIp, closeShift, openShift, refreshToken } = require("../controllers/restaurant-controller");


router.get('/floors/:restaurant_id', getRestaurantFloor);

router.post('/printer/connect/:restaurant_id', registerPrinter);

router.post('/printer/delete/:restaurant_id/:printer_id', deletePrinter);

router.post('/setup/:id', finishSetup)


router.post('/create', createRestaurant);

router.post('/receipt/update/:id', updateReceipt);

router.post('/ip/:id', searchLocalIp)

router.post('/help', help);

router.post('/refresh-token/:id', refreshToken);

router.post('/close-shift/:restaurant_id', closeShift);

router.post('/open-shift/:restaurant_id', openShift);

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