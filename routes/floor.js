const router = require("express").Router();
const { createFloor, deleteFloor } = require("../controllers/floor-controller");


router.post('/create', createFloor);

router.post('/:id',deleteFloor);

router.get('/tables/:restaurant_id/:floor_id');

module.exports = router;