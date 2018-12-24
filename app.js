const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test", {
    useNewUrlParser: true
});

let db = mongoose.connection;

// Check connection
db.once("open", function () {
    console.log("connect to mongodb")
})

// Check for db errors
db.on('error', function (err) {
    console.log(err)
});

// Init app
const app = express();

// Bring in Models
const Article = require("./models/article");

// Load View Engine
app.set("Views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Home Route
app.get("/", (req, res) => {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                title: "Hello",
                articles: articles
            });
        }
    });
});

// Add Route
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

// Start Server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});