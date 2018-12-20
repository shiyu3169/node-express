const express = require("express");
const path = require("path");

// Init app
const app = express();

// Load View Engine
app.set("Views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Home Route
app.get("/", (req, res) => {
    let articles = [
        {
            id: 1,
            title: "Article One",
            author: "Brad Traversy",
            body: "This is article one"
        },
        {
            id: 2,
            title: "Article two",
            author: "Shiyu Wang",
            body: "This is article one"
        },
        {
            id: 3,
            title: "Article Three",
            author: "Brad Traversy",
            body: "This is article one"
        }
    ];

    res.render("index", {
        title: "Hello",
        articles: articles
    });
});

// Add Route
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

// Start Server
app.listen(3000, function() {
    console.log("Server started on port 3000");
});
