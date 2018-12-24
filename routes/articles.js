const express = require('express');
const router = express.Router();

// Bing in Article Model
const Article = require("../models/article");

// Add Route
router.get("/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

// Add Submit Post Route
router.post("/add", function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            errors: errors,
            title: 'Add Article'
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Added')
                res.redirect("/");
            }
        })
    }
})

// Get Single Article
router.get("/edit/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("edit_article", {
            article: article,
            title: "Edit Article"
        })
    })
})

// Update Submit Post Route
router.post("/edit/:id", function (req, res) {
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
            req.flash('success', 'Article Updated')
            res.redirect("/");
        }
    })
})

router.delete("/:id", function (req, res) {
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

// Get Single Article
router.get("/:id", function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render("article", {
            article: article
        })
    })
})

module.exports = router;