const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const userRoute = require("../routes/User")
// Middleware (optional)
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});


app.use("/api/users", userRoute)
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
