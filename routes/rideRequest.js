const express = require('express');
const requestController = require('../controllers/RideRequest');



const router = express.Router();
router.get("/", (req, res) => {
    res.send({message: "ride requests"})
})
router.post('/createRequest', requestController.createRequest);
router.put('/updateRequest', requestController.updateRequest);
router.get('/getRideRequest', requestController.getRequest);
router.get('/get', requestController.getUpdates);
router.get("/getAllRides",requestController.getAllRides);

module.exports = router;