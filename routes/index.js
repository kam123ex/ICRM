const express = require("express");
const router = express.Router();
const firebase = require("firebase");
let authorized = true;
router.get("/", (req, res) => {
  res.render("index", { name: "kammm" });
});

// router.use("/", checkAuth);

// Sign In
// router.get("/sigIn", (req, res) => {
//   checkAuth();
//   res.render("sigIn");
// });

function checkAuth(req, res, next) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      var email = user.email;
      console.log("User is signIn" + email);
    } else {
      next();
      console.log("No user is signed in.");
    }
  });
}

router.get("/sigIn", (req, res) => {
  checkAuth();
  var data = req.body;
  userEmail = data.email;
  userPassword = data.password;
  console.log(userEmail);
  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .then((u) => {
      currentUser = firebase.auth().currentUser;

      var cookies = req.cookies;
      res.setCookie(currentUser.uid, `Welcome ${currentUser.uid}`);

      console.log("User: " + currentUser.uid + " is login");
      res.send(200, cookies);
      console.log(userEmail);
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      if (error) {
        res.render("signIn");
        errorMessage;
      }
    });
});

module.exports = router;
