


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Initializing app
const app = express();



// Router instance
const router = express.Router(); 


// Routes

app.get("/", (req, res) => res.send("Express on Vercel"));


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));






// Starting server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
