const express = require("express");
const path = require("path");
const db = require("./database");

// const logger = require('./middleware/Logger')

const app = express();
const cors = require("cors");
const PORT = process.env.port || 4000;

//ADD CORS CODE: 
const corsOrigin = 'http://localhost:3000';
app.use(cors({
  origin:[corsOrigin],
  methods:['GET','POST'],
  credentials: true 
})); 


//Init Middleware
// app.use(logger)

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rouing for houses api
app.use("/api/houses", require("./routes/api/houses"));

// Rouing for locations api
app.use("/api/locations", require("./routes/api/locations"));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
