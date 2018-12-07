const express = require("express");
const path = require("path");

// Init app
const app = express();

// Load View Engine
app.set("Views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Home Route
app.get("/", (req, res) => {
    res.render("index");
});

// Start Server
app.listen(3000, function() {
    console.log("Server started on port 3000");
});
