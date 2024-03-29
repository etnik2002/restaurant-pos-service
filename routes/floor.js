const router = require("express").Router();
const { createFloor, deleteFloor, getFloorTables, getAllFloors } = require("../controllers/floor-controller");
const apicache = require("apicache");
const cache = apicache.middleware;

router.post('/create/:restaurant_id', createFloor);

router.post('/:id',deleteFloor);

router.get('/all', getAllFloors)

router.get('/tables/:restaurant_id/:floor_id', getFloorTables);

module.exports = router;
