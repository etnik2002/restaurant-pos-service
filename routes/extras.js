const router = require("express").Router();
const { createExtras, deleteExtra, getRestaurantExtras } = require("../controllers/extras-controller");


router.post('/create', createExtras);

router.post('/:id', deleteExtra);

router.get('/:restaurant_id', getRestaurantExtras);

module.exports = router;