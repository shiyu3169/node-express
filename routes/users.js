const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Bring in User Model
const User = require("../models/user");

// Register Form
router.get("/register", function(req, res) {
  res.render("register");
});

// Register Process
router.post("/register", function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const verifyPassword = req.body.verifyPassword;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Name is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Oassword is required").notEmpty();
  req
    .checkBody("verifyPassword", "Passwords do not match")
    .equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    const newUser = new User({
      name,
      email,
      username,
      password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You are now registered and can log in");
            res.redirect("/users/login");
          }
        });
      });
    });
  }
});

router.get("/login", function(req, res) {
  res.render("login");
});

module.exports = router;
