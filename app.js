const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator")
const flash = require('connect-flash');
const session = require('express-session')

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

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(flash())
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next()
})

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))


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

// Route Files
const articles = require('./routes/articles')
app.use('/articles', articles)

// Start Server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});