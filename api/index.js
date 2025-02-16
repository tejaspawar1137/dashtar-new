// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const http = require("http");
// const socketIo = require("socket.io");

// dotenv.config();

// // Initializing app
// const app = express();
// const server = http.createServer(app); // HTTP server for running Socket.IO
// const io = socketIo(server); // Correct instantiation of socket.io

// // Router instance
// const router = express.Router(); 

// // Importing routes
// const userRoutes = require("./routes/user.routes");
// const rideRequestRoutes = require('./routes/rideRequest.routes');
// const templeteRoutes=require('./routes/templetes.routes')

// // Middlewares
// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cookieParser());

// // Routes
// router.use('/users', userRoutes);
// router.use('/rideRequest', rideRequestRoutes);
// router.use('/templetes', templeteRoutes);

// // Initialize router here
// app.use('/api', router);

// // Database connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((err) => {
//     console.log("DB Connection Error:", err);
//   });

// // Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Example event listeners
//   socket.on("locationUpdate", (data) => {
//     console.log("Location update received:", data);
//     // Emit this update to other clients if needed
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

// // Starting server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}!`);
// });


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

// Initializing app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*" // Update as needed for security
  }
});



// Export io for use in other files
module.exports = { io };

// Router instance
const router = express.Router(); 

// Importing routes
const userRoutes = require("../routes/user.routes");
const rideRequestRoutes = require('../routes/rideRequest.routes');
const templeteRoutes = require('../routes/templetes.routes');
const driverRequestRoutes = require("../routes/driver.routes")
// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes

app.get("/", (req, res) => res.send("Express on Vercel"));
router.use('/admin', userRoutes);
router.use('/rideRequest', rideRequestRoutes);
router.use("/driverRequest",driverRequestRoutes);
router.use('/templetes', templeteRoutes);

// Initialize router here
app.use('/api', router);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));



const driverSockets = {}; // Store driver connections { driverId: socket.id }
const riderSockets = {};  // Store rider connections { riderId: socket.id }

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Joining rooms based on role
  socket.on("joinRoom", ({ userId, role }) => {
    const room = role === "driver" ? `driver_${userId}` : `rider_${userId}`;
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // Receiving and broadcasting location updates
  socket.on("locationUpdate", ({ userId, role, location }) => {
    const room = role === "driver" ? `rider_${userId}` : `driver_${userId}`;
    io.to(room).emit("locationUpdate", { userId, location });
    
    console.log(`Location update from ${role}:`, location);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Starting server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
