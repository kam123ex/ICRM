const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");

// Firebase functions
const firebase = require("firebase");
const firebaseApp = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const serviceAccount = require("./icrmwithapp-firebase-adminsdk-dg1mi-709cd91d09.json");
// const firebaseConfig = require("./firebaseConfig.js");
const methodOverride = require("method-override");
const cors = require("cors");

const TwoHours = 1000 * 60 * 60 * 2;
const SESS__NAME = "sid",
  SESS_SECRET = "admin",
  SESS_LIFETIME = TwoHours;

app.set("trust proxy", 1); // trust first proxy

const firebaseConfig = {
  apiKey: "AIzaSyB_1VMzJtMkZEde232VmRfBMaGpInoI9AQ",
  authDomain: "icrmwithapp.firebaseapp.com",
  databaseURL: "https://icrmwithapp.firebaseio.com",
  projectId: "icrmwithapp",
  storageBucket: "icrmwithapp.appspot.com",
  messagingSenderId: "171999039359",
  appId: "1:171999039359:web:61cecf068d46524f4fd44a",
  measurementId: "G-BM78VBEL13",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentUser = firebase.auth().currentUser;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("admin"));
app.use(cors());
app.use(
  session({
    name: SESS__NAME,
    resave: true,
    saveUninitialized: true,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
    },
  })
);
// Set views to frontend
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("views"));
app.use(methodOverride("_method"));
// app.use(express.static("public"));

// Import Routes
// const signIn = require("./routes/signIn");
const index = require("./routes/index");
// const signIn = require("./routes/signIn");
// const routerCookie = require("./routes/loginAPI");
const adminController = require("./routes/adminController");
const userController = require("./routes/userController");
const signIn = require("./routes/signIn");
const signUp = require("./routes/signUp");

// Get Routes
// app.get("/", (req, res, next) => {
//   res.render("index");
// });

app.get("/", (req, res, next) => {
  res.render("index");
});

app.use("/signIn", signIn);
app.use("/signUp", signUp);
app.use("/admin", adminController);
app.use("/user", userController);

// Server Listener ================================
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App is ready at : http://localhost:${port}`);
  }
});

// dialogflow messenger bot
// EAACh7rTzZBPQBAIgx0yn6LcegKnho3CkNe9CflLCzQb4d75mIQwPdd0eJgGFpIUZBDG544NpxaYZAcjgx0AF5aKyWIeZAZCKZCcxr3k557hdCL11xN8RyPLZAnk0o5HMYFNGQouodz4mFyE7CW8t8LLkNn4Qxty8EQ7BpQrvLgyH2osCd8pOdRo

// …or create a new repository on the command line
// echo "# ICRM" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git remote add origin git@github.com:kam123ex/ICRM.git
// git push -u origin master

// …or push an existing repository from the command line
// git remote add origin git@github.com:kam123ex/ICRM.git
// git push -u origin master
// …or import code from another repository
// You can initialize this repository with code from a Subversion, Mercurial, or TFS project.

// Install the Heroku CLI
// Download and install the Heroku CLI.

// If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

// $ heroku login
// Create a new Git repository
// Initialize a git re　pository in a new or existing directory

// $ cd my-project/
// $ git init
// $ heroku git:remote -a final-icrm
// Deploy your application
// Commit your code to the repository and deploy it to Heroku using Git.

// $ git add .
// $ git commit -am "make it better"
// $ git push heroku master
// Existing Git repository
// For existing repositories, simply add the heroku remote

// $ heroku git:remote -a final-icrm
