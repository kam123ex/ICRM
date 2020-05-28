const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const firebase = require("firebase");
const database = firebase.database();
const productRef = database.ref("ProductEng");
const orderRef = database.ref("Orders");
const userRef = database.ref("Users");
const preferenceRef = database.ref("Preference");

let currentUser;
let userId;
let postCheck = false;
function UsersSchema(
  createDate,
  email,
  imagePath,
  lead,
  name,
  password,
  phone,
  uid
) {
  this.createDate = createDate;
  this.email = email;
  this.imagePath = imagePath;
  this.lead = lead;
  this.name = name;
  this.password = password;
  this.phone = phone;
  this.uid = uid;
}
router.get("/:id/home", (req, res) => {
  let order;
  userId = req.params.id;
  let lead;
  let name;
  let email;
  let imagePath;
  postCheck = false;
  userRef.child(userId).once("value", (userSnap) => {
    lead = userSnap.val().lead;
    name = userSnap.val().name;
    imagePath = userSnap.val().imagePath;
  });

  orderRef
    .child(userId)
    .once("value", (orderShort) => {})
    .then((orderShort) => {
      res.render(`user/home`, {
        orderShort: orderShort,
        userId: userId,
        name: name,
        email: email,
        imagePath: imagePath,
        lead: lead,
      });
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.render(`/user/home`, { userSnap: userSnap });
    });
});

router.get("/:id/dashboard", (req, res, next) => {
  userId = req.params.id;
  let lead;
  let name;
  let email;
  let imagePath;
  userRef.child(userId).once("value", (userSnap) => {
    lead = userSnap.val().lead;
    name = userSnap.val().name;
    imagePath = userSnap.val().imagePath;
  });

  orderRef
    .child(userId)
    .once("value", (snapShort) => {})
    .then((orderData) => {
      res.render("user/dashboard", {
        orderData: orderData,
        userId: userId,
        name: name,
        email: email,
        imagePath: imagePath,
        lead: lead,
      });
    });
});

// Chat bot
router.get("/:id/chatbot", (req, res) => {
  userId = req.params.id;
  console.log(userId);
  userRef.child(userId).on("value", (userSnap) => {
    console.log(userSnap.val());
    res.render("user/chatbot", { userId: userId, userSnap: userSnap });
  });
});

// User analysis
router.get("/:id/analysis", (req, res) => {
  userId = req.params.id;
  console.log(userId);
  userRef.child(userId).on("value", (userSnap) => {
    console.log(userSnap.val());
    res.render("user/analysis", { userId: userId, userSnap: userSnap });
  });
});

// User Preference
router.get("/:id/preference", (req, res) => {
  userId = req.params.id;
  userRef.child(userId).on("value", (userSnap) => {
    res.render("user/preference", {
      userId: userId,
      userSnap: userSnap,
      postCheck: postCheck,
    });
  });
});

router.post("/:id/preference", (req, res) => {
  userId = req.params.id;
  let preferenceSchema = req.body.flavor;
  let email;
  let name;
  let recommendProduct = [];
  userRef
    .child(userId)
    .once("value", (userSnap) => {
      email = userSnap.val().email;
      name = userSnap.val().name;
    })
    .then((userData) => {
      console.log(email);
      for (let i = 0; i < preferenceSchema.length; i++) {
        if (preferenceSchema[i] == "Blueberry") {
          recommendProduct.push("Blueberry Tart");
        } else if (preferenceSchema[i] == "Lemon") {
          recommendProduct.push("Lemon Tart");
        } else if (preferenceSchema[i] == "PassionFruit") {
          recommendProduct.push("Passion Fruit Tart");
        } else if (preferenceSchema[i] == "Strawberry") {
          recommendProduct.push("Strawberry Tart");
        } else if (preferenceSchema[i] == "Vina") {
          recommendProduct.push("Vina Chiffon Cake");
        } else if (preferenceSchema[i] == "Cheese") {
          recommendProduct.push("Mild Cheese Cake");
        } else if (preferenceSchema[i] == "Chocolate") {
          recommendProduct.push("Triple Chocolate Tart");
        } else if (preferenceSchema[i] == "Matcha") {
          recommendProduct.push("Matcha Roll");
          recommendProduct.push("Matcha Mousse");
        } else if (preferenceSchema[i] == "BrownSugar") {
          recommendProduct.push("Brown Sugar Mochi Roll");
        }
      }
      console.log(recommendProduct);

      preferenceRef.child(userId).set(preferenceSchema);

      var mailTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "chanadmit@gmail.com",
          pass: "admit!@#123",
        },
      });

      var mailOptions = {
        from: "chanadmit@gmail.com",
        to: email,
        subject: "Recommend your preference product",
        html:
          `<h1>Hello ${name}</h1> ` +
          "<h2><ul>" +
          `for (var i = 0; i < ${recommendProduct}.length; i++) {<li>${recommendProduct}[i]</li>}` +
          "</ul></h2>",
      };

      mailTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          postCheck = true;
          res.redirect(`/user/${userId}/preference`);
          console.log("Email sent: " + info.response);
        }
      });
    });

  // ethereal.email
  // jackie.schowalter@ethereal.email
  // Password	G2vnr9p2DjAr7yQEPQ
  // mazie62@ethereal.email
  // Password	T7hNUyrjzphbf3EEJJ

  // res.redirect(`/user/${userId}/profile`);
});

// User Profile
router.get("/:id/profile", (req, res) => {
  userId = req.params.id;
  console.log(userId);
  userRef.child(userId).on("value", (userSnap) => {
    res.render("user/profile", { userId: userId, userSnap: userSnap });
  });
});

// User Edit Profile
router.get("/:id/edit", (req, res) => {
  userId = req.params.id;
  console.log(userId);
  userRef.child(userId).on("value", (userSnap) => {
    res.render("user/edit", { userId: userId, userSnap: userSnap });
  });
});

router.post("/:id/edit", (req, res) => {
  userId = req.params.id;
  console.log(userId);
  userRef
    .child(userId)
    .once("value", (snap) => {
      userSchema = new UsersSchema(
        snap.val().createDate,
        req.body.email,
        snap.val().imagePath,
        snap.val().lead,
        req.body.name,
        req.body.password,
        req.body.phone,
        snap.val().uid
      );
      console.log(userSchema);

      database.ref(`Users/${userId}`).set(userSchema);
      res.redirect(`/user/${userId}/profile`);
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.redirect(`/user/${userId}/profile`);
    });
});

// User Feedback
router.get("/:id/feedback", (req, res) => {
  userId = req.params.id;
  let lead;
  let name;
  let email;
  let imagePath;
  userRef
    .child(userId)
    .once("value", (userSnap) => {
      lead = userSnap.val().lead;
      name = userSnap.val().name;
      email = userSnap.val().email;
      imagePath = userSnap.val().imagePath;
    })
    .then((u) => {
      res.render(`user/feedback`, {
        userId: userId,
        name: name,
        email: email,
        imagePath: imagePath,
        lead: lead,
        postCheck: postCheck,
      });
    });
});

router.post("/:id/feedback", (req, res) => {
  userId = req.params.id;
  name = req.body.name;
  email = req.body.email;
  message = req.body.message;
  const feedbackSchema = [];
  feedbackSchema.push({ name: name });
  feedbackSchema.push({ email: email });
  feedbackSchema.push({ message: message });
  console.log(feedbackSchema);
  database.ref(`Feedback/${userId}/`).push({
    name: name,
    email: email,
    message: message,
  });
  postCheck = true;
  res.redirect(`/user/${userId}/feedback`);
});

router.get("/:id/logout", (req, res, next) => {
  currentUser = firebase.auth().currentUser;
  console.log(currentUser.uid);
  if (currentUser != null) {
    firebase
      .auth()
      .signOut()
      .then((u) => {
        var cookies = req.cookies;
        console.log(cookies.key + ": is logout");
        res.clearCookie(currentUser.uid);
        console.log("User logout");
        res.redirect("/");
      })
      .catch(function (error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("error: " + errorCode);
        console.log("errorMessage: " + errorMessage);
        res.redirect("/");
      });
  } else {
    console.log("No User login");
    res.redirect("/");
  }
});

// function check() {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       console.log(user.uid);
//     } else {
//       res.redirect("/");
//     }
//   });
// }

module.exports = router;
