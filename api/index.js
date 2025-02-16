const express = require("express");
const app = express();
const dotenv = require("dotenv")
const PORT = process.env.PORT || 3000;
const userRoutes = require("../routes/user")
const rideRequestRoutes = require("../routes/rideRequest")
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();
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


app.use('/admin', userRoutes);
app.use('/rideRequest', rideRequestRoutes);
// router.use("/driverRequest",driverRequestRoutes);
// router.use('/templetes', templeteRoutes);

// Initialize router here
app.use('/api', router);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
