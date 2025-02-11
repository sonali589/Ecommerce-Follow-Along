const express = require("express");
const mongoose = require("mongoose");


const app = express();
const PORT = 3000;


// MongoDB Connection URL
const MONGO_URI = "mongodb://localhost:27017/mydatabase";


// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


// Basic Route
app.get("/", (req, res) => {
  res.send("Hello Bhavdeep, MongoDB is connected!");
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
