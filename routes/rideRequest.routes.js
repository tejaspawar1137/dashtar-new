const express = require('express');
const requestController = require('../controllers/rideRequest.Controller');



const router = express.Router();

router.post('/createRequest', requestController.createRequest);
router.put('/updateRequest', requestController.updateRequest);
router.get('/getRideRequest', requestController.getRequest);
router.get('/get', requestController.getUpdates);
router.get("/getAllRides",requestController.getAllRides);

module.exports = router;