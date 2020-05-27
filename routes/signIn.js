const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const cookieParser = require("cookie-parser");
const database = firebase.database();
const userDatabase = database.ref("Users");

let currentUser = firebase.auth().currentUser;

router.get("/", isAuthenticated, (req, res) => {
  var cookies = req.cookies;
  console.log(200, cookies);
  res.render("signIn");
});

router.post("/", (req, res) => {
  var data = req.body;
  userEmail = data.email;
  userPassword = data.password;
  if (userEmail != null && userPassword != null) {
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then((u) => {
        currentUser = firebase.auth().currentUser;

        res.cookie(currentUser.uid, `Welcome ${currentUser.uid}`);
        var cookies = req.cookies;
        console.log("User: " + currentUser.uid + " is login");
        console.log(200, cookies);

        if (userEmail != "admin@gmail.com") {
          res.redirect(`user/${currentUser.uid}/home`);
        } else {
          res.redirect("/admin/home");
        }
      })
      .catch(function (error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        res.render("/signIn", { message: "errorMessage" });
      });
  }
});

function isAuthenticated(req, res, next) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (user.email != "admin@gmail.com") {
        res.redirect(`user/${user.uid}/home`);
      } else {
        res.redirect("/admin/home");
      }
    } else {
      next();
    }
  });
}

module.exports = router;
