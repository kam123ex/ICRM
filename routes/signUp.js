const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const db = firebase.database();
const cookieParser = require("cookie-parser");
let currentUser;

router.get("/", (req, res) => {
  res.render("signUp");
});

router.post("/", (req, res, next) => {
  // name, email, phone, gender, password
  var data = req.body;
  var path =
    "https://firebasestorage.googleapis.com/v0/b/icrmwithapp.appspot.com/o/default_user_icon.jpg?alt=media&token=9d9eb19f-6172-46d6-8484-827ce2d0744b";
  userName = data.name;
  userEmail = data.email;
  userPhone = data.phone;
  userPassword = data.password;
  confirmUserPassword = data.confirmPassword;
  if (userPassword != null && userPassword == confirmUserPassword) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then((u) => {
        firebase.auth().onAuthStateChanged(function (user) {
          currentUser = firebase.auth().currentUser;
          console.log(currentUser.uid);
          db.ref(`Admin/${user.uid}`).set({
            userId: user.uid,
            name: userName,
            email: userEmail,
            phone: userPhone,
            imagePath: path,
            password: userPassword,
          });
          console.log(200, "User Mary is sign up success.");
          console.log(
            "User: " + userName + " UserId:" + user.uid + " is created"
          );
        });
        res.render("signIn");
      })
      .catch(function (error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  } else {
    console.log("Password not confirm.");
    res.render("signUp");
  }
});

exports.signIn = (req, res, next) => {
  var data = req.body;
  userEmail = data.email;
  userPassword = data.password;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .then((u) => {
      currentUser = firebase.auth().currentUser;

      var cookies = req.cookies;
      res.cookie(currentUser.uid, `Welcome ${currentUser.uid}`);

      console.log("User: " + currentUser.uid + " is login");
      res.send(200, cookies);
      res.render("/home");
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.redirect("/signIn");
    });
};

// exports.isAuthenticated = (req, res, next) => {
//   var user = firebase.auth().currentUser;
//   if (user !== null) {
//     req.user = user;
//     next();
//   } else {
//     res.redirect("/login");
//   }
// };

// var documents = require("../controllers/documents");

// const routes = (router, authenticate) => {
//   // Get all documents
//   router.get("/documents/", authenticate.isAuthenticated, documents.getAll);
// };
module.exports = router;
