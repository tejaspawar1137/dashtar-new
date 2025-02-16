const express = require("express");
const app = express();
const dotenv = require("dotenv")
const PORT = process.env.PORT || 5055;
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();
const requestController = require('../controllers/RideRequest');
const templeteController = require('../controllers/Template')
const {signUp, login, getDriverDetails, updateDetails, getDashboardDetails, getDrivers, getRiders} =  require('../controllers/User');
const { createDriver } = require("../controllers/Driver");
const router = express.Router()

const server = http.createServer(app);

app.use(express.json());
const io = socketIo(server, {
  cors: {
    origin: "*" // Update as needed for security
  }
});



// Export io for use in other files
module.exports = { io };
// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

// users routes 
app.get("/api/users", (req, res) => {
  res.send("Hello from Vercel!"); 
});
app.post('/api/admin/register', signUp);
app.post('/api/admin/signin', login);
app.get('/api/admin/getDriver', getDriverDetails);
app.get("/api/admin/dashboard", getDashboardDetails)
app.get("/api/admin/getDrivers", getDrivers);
app.get("/api/admin/getRiders", getRiders)
app.put('/api/admin/update', updateDetails);


// ride requests  routes

app.post('/api/rideRequest/createRequest', requestController.createRequest);
app.put('/api/rideRequest/updateRequest', requestController.updateRequest);
app.get('/api/rideRequest/getRideRequest', requestController.getRequest);
app.get('/api/rideRequest/get', requestController.getUpdates);
app.get("/api/rideRequest/getAllRides",requestController.getAllRides);



// template route 

router.post('/api/templetes/createTemplete', templeteController.sendMediaMessage);


// driver route 

app.post('/api/driverRequest/create', createDriver);
app.get("/api/driverRequest/get", getDrivers)


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
