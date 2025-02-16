


const express = require("express");
const bcrypt = require('bcryptjs');

const dotenv = require("dotenv");

dotenv.config();

// Initializing app
const app = express();




// Routes

app.get("/", (req, res) => res.send("Express on Vercel"));






// Starting server
const PORT =  3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
