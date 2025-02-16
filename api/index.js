const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors")
// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }))

// Create HTTP Server for WebSockets
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // Update as needed for security
});

// Export `io` for use in other files
module.exports = { io };

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Import Controllers
const requestController = require("../controllers/RideRequest");
const templateController = require("../controllers/Template");
const {
  signUp, login, getDriverDetails, updateDetails, getDashboardDetails, getDrivers, getRiders
} = require("../controllers/User");
const { createDriver } = require("../controllers/Driver");

// Set up API routes
const router = express.Router();

// 🌍 Base route
app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

// 🧑 Users Routes
router.get("/admin/dummy", (req, res) => res.send("server worked!"));
router.post("/admin/register", signUp);
router.post("/admin/signin", login);
router.get("/admin/getDriver", getDriverDetails);
router.get("/admin/dashboard", getDashboardDetails);
router.get("/admin/getDrivers", getDrivers);
router.get("/admin/getRiders", getRiders);
router.put("/admin/update", updateDetails);

// 🚗 Ride Requests Routes
router.post("/rideRequest/createRequest", requestController.createRequest);
router.put("/rideRequest/updateRequest", requestController.updateRequest);
router.get("/rideRequest/getRideRequest", requestController.getRequest);
router.get("/rideRequest/get", requestController.getUpdates);
router.get("/rideRequest/getAllRides", requestController.getAllRides);

// 🖼️ Template Route
router.post("/templates/createTemplate", templateController.sendMediaMessage);

// 🚕 Driver Routes
router.post("/driverRequest/create", createDriver);
router.get("/driverRequest/get", getDrivers);

// Use the router
app.use("/api", router);

// ✅ Export `app` for Vercel (Do NOT use `app.listen()` in Vercel)
module.exports = app;

// 🚀 For local development, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 5055;
  server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}
