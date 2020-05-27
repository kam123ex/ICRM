const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Get firebase could store
admin.initializeApp();

app.get("/home", (req, res) => {
  res.send("Hello");
});

app.get("/secondHome", (req, res) => {
  res.send("Hello secondHome");
});
exports.app = functions.https.onRequest(app);

// path = index/getScreams
exports.getScreams = functions.https.onRequest((req, res) => {
  // Get the 'screams' could database
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

exports.createScreams = functions.https.onRequest((req, res) => {
  // Post the 'screams' could database
  const newScreams = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScreams)
    .then((doc) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

// admin.initializeApp(functions.config().firebase);

// interface Product{
//     productName:string,
//     productPrice:string
// }

// app.post('/saveProduct', async(req, res) =>{

//     const product: Product = {
//       productName: "Bag"
//       productPrice: "1000"
//     };
// })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
