const express = require("express");
const router = express.Router();
const Chart = require("chart.js");
const nodemailer = require("nodemailer");
const firebase = require("firebase");
const database = firebase.database();
// const storageRef = storage.ref();
// const imageRef = storageRef.child("product_image");
const adminInfoRef = database.ref("Admin");
const productRef = database.ref("ProductEng");
const orderRef = database.ref("Orders");
const userRef = database.ref("Users");

let day = new Date().getDay();
let year = new Date().getFullYear();
let month = new Date().getMonth();
let currentUser;
let icon =
  "https://firebasestorage.googleapis.com/v0/b/icrmwithapp.appspot.com/o/default_user_icon.jpg?alt=media&token=9d9eb19f-6172-46d6-8484-827ce2d0744b";
let orderSchemas = [];
let orderSchema;
let chartProduct = [];
var q1 = 0,
  q2 = 0,
  q3 = 0,
  q4 = 0,
  q5 = 0,
  q6 = 0,
  q7 = 0,
  q8 = 0,
  q9 = 0,
  q10 = 0;
var chartQuantity = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
let fled = false;
let productNames = [];
router.get("/chatbot", (req, res) => {
  userRef.once("value", (snapShort) => {
    var userKey = snapShort.key; // User ID
    res.render("admin/chatbot", { snapShort: snapShort });
  });
});

router.get("/home", (req, res) => {
  orderRef
    .once("value", (snapShort) => {})
    .then((userData) => {
      res.render("admin/home", { userData: userData });
    });
});

// router.get("/dashboardTest", (req, res) => {
//   res.render("admin/dashboardTest");
// });

router.get("/dashboard", (req, res, next) => {
  orderRef
    .once("value", (snapShort) => {})
    .then((orderData) => {
      res.render("admin/dashboard", { orderData: orderData });
    });
});

router.get("/analysis", (req, res) => {
  userRef.once("value", (userShort) => {
    var userKey = userShort.key; // User ID
    res.render("admin/analysis", { userKey: userKey });
  });
});

router.get("/popularAnalysis", (req, res) => {
  res.render("admin/popularAnalysis");
});

router.get("/users", (req, res) => {
  userRef.once("value", (snapShort) => {
    res.render("admin/users", {
      snapShort: snapShort,
    });
  });
});

// User Profile============
router.get("/user/:id", (req, res) => {
  let user_id = req.params.id;
  userRef
    .child(user_id)
    .once("value", (snap2) => {
      orderRef.child(user_id).once("value", (userShort) => {
        res.render("admin/user", {
          snapShort: snap2,
          orderShort: userShort,
        });
      });
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.render("admin/users");
    });
});

router.post("/user/:id", (req, res) => {
  let user_id = req.params.id;
  userRef
    .child(user_id)
    .once("value", (snap) => {
      userSchema = new UsersSchema(
        snap.val().createDate,
        req.body.email,
        snap.val().imagePath,
        req.body.lead,
        req.body.name,
        req.body.password,
        req.body.phone,
        snap.val().uid
      );
      database.ref(`Users/${snap.val().uid}`).set(userSchema);
      res.redirect("/admin/users");
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      res.redirect(`/admin/user/${user_id}`);
    });
});

// Create User===========
router.get("/newUser", (req, res) => {
  res.render("admin/newUser");
});

router.post("/newUser", (req, res) => {
  let userSchema;

  let userEmail = req.body.email;
  let userPassword = req.body.password;
  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPassword)
    .then((user) => {
      currentUser = firebase.auth().currentUser;
      console.log(currentUser.uid);

      let createDate = day + "/" + month + "/" + year;
      userSchema = new UsersSchema(
        createDate,
        req.body.email,
        icon,
        req.body.lead,
        req.body.name,
        req.body.password,
        req.body.phone,
        currentUser.uid
      );
      database.ref(`Users/${currentUser.uid}`).set(userSchema);
      console.log(200, "User Mary is sign up success.");
      console.log("User: " + req.body.name + " is created");
      res.redirect(`/admin/user/${currentUser.uid}`);
    })
    .catch(function (error) {
      // Handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  // user_id = data.val().id;
  // user_name = req.body.name;
  // user_email = req.body.email;
  // user_phone = req.body.phone;
  // user_password = req.body.password;
  // user_imagePath = data.val().imagePath;
  // user_createDate = data.val().createDate;
  // user_lead = req.body.lead;
  // let user = [
  //   user_id,
  //   user_name,
  //   user_email,
  //   user_phone,
  //   user_password,
  //   user_imagePath,
  //   user_createDate,
  //   user_lead,
  // ];
});

// Send Email
router.get("/email", (req, res) => {
  res.render("admin/email");
});

router.post("/email", (req, res) => {
  // jackie.schowalter@ethereal.email
  // Password	G2vnr9p2DjAr7yQEPQ
  // mazie62@ethereal.email
  // Password	T7hNUyrjzphbf3EEJJ
  // chanmart12345678@gmail.com
  // Password 12345678
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "jackie.schowalter@ethereal.email", // generated ethereal user
      pass: "G2vnr9p2DjAr7yQEPQ", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: "jackie.schowalter@ethereal.email", // sender address
    to: "mazie62@ethereal.email", // list of receivers
    subject: "Node Request", // Subject line
    text: "Hello world", // plain text body
    // html body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error Occurs== " + err);
    } else {
      console.log("Email send!");
    }
  });
  res.render("admin/email");
});

// Create Product===========
// router.get("/newProduct", (req, res) => {
//   res.render("admin/newProduct");
// });

// router.post("/newProduct", (req, res) => {
//   let product_name = req.body.product_name;
//   let product_path = req.body.product_path;
//   let product_price = req.body.product_price;
//   const spaceRef = storageRef.child(`product_image/${product_path}`);

//   // Create the file metadata
//   var metadata = {
//     contentType: "image/jpeg",
//   };

//   // Upload file and metadata to the object 'images/mountains.jpg'
//   var uploadTask = storageRef.child("images/" + file.name).put(file, metadata);

//   // Listen for state changes, errors, and completion of the upload.
//   uploadTask.on(
//     firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//     function (snapshot) {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log("Upload is paused");
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log("Upload is running");
//           break;
//       }
//     },
//     function (error) {
//       // A full list of error codes is available at
//       // https://firebase.google.com/docs/storage/web/handle-errors
//       switch (error.code) {
//         case "storage/unauthorized":
//           // User doesn't have permission to access the object
//           break;

//         case "storage/canceled":
//           // User canceled the upload
//           break;

//         case "storage/unknown":
//           // Unknown error occurred, inspect error.serverResponse
//           break;
//       }
//     },
//     function () {
//       // Upload completed successfully, now we can get the download URL
//       uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
//         console.log("File available at", downloadURL);
//       });
//     }
//   );
// });

router.get("/logout", (req, res, next) => {
  currentUser = firebase.auth().currentUser;
  if (currentUser != null) {
    console.log(currentUser.uid);
    firebase
      .auth()
      .signOut()
      .then((u) => {
        var cookies = req.cookies;
        console.log(cookies + ": is logout");
        res.clearCookie(currentUser.uid);
        console.log("User logout");
        res.redirect("/signIn");
      })
      .catch(function (error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  } else {
    console.log("No User login");
    res.redirect("/signIn");
  }
});

function OrderSchema(
  address,
  date,
  orderId,
  phone,
  product,
  productName,
  quantity,
  time,
  total,
  uid,
  userName
) {
  this.address;
  this.date;
  this.orderId;
  this.phone;
  this.product;
  this.productName;
  this.quantity;
  this.time;
  this.total;
  this.uid;
  this.userName;
}

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

module.exports = router;
