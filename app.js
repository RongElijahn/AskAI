const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes"); 
const path = require("path");
const cors = require("cors");

app.use(cors());

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Use the routes defined in routes.js
app.use("/api", routes);

// Start the server
const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

