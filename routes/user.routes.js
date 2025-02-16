const express = require('express');
const router = express.Router();
const { validateSignUp, validateLogin, validateUpdateDetails } = require("../middlewares/validationRequest.middlewares");
const {signUp, login, getDriverDetails, updateDetails, getDashboardDetails, getDrivers, getRiders} =  require('../controllers/users.controller')

console.log("Hereee");
router.get("/users", (req, res) => {
    res.status(200).json({message:"users"})
})
router.post('/register', signUp);
router.post('/signin', validateLogin, login);
router.get('/getDriver', getDriverDetails);
router.get("/dashboard", getDashboardDetails)
router.get("/getDrivers", getDrivers);
router.get("/getRiders", getRiders)
router.put('/update', validateUpdateDetails, updateDetails);

module.exports = router;