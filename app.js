const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

// body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Get Single Article
app.get("/article/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("article", {
            article: article
        })
    })
})

// Add Route
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

// Add Submit Post Route
app.post("/articles/add", function (req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/");
        }
    })
})

// Get Single Article
app.get("/article/edit/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("edit_article", {
            article: article,
            title: "Edit Article"
        })
    })
})

// Update Submit Post Route
app.post("/articles/edit/:id", function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/");
        }
    })
})

app.delete("/article/:id", function (req, res) {
    let query = {
        _id: req.params.id
    };
    Article.deleteOne(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    })
})

// Start Server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});