const express = require("express");
const router = express.Router();
var isLogin = false;

router.get("/", (req, res) => {
  // ...
  var name = "guest";
  isLogin = false;
  if (req.signedCookies.firstName && req.signedCookies.lastName) {
    name = req.signedCookies.firstName + " " + req.signedCookies.lastName;
    isLogin = true;
  }

  res.render("index", { title: "Express", member: name, logstatus: isLogin });
});

router.post("/post", (req, res) => {
  if (req.body.firstName == "" || req.body.lastName == "") {
    return res.redirect("Login.html");
  } else {
    res.cookie("firstName", req.body.firstName, {
      path: "/cookie",
      signed: true,
      maxAge: 600000,
    }); //set cookie
    res.cookie("lastName", req.body.lastName, {
      path: "/cookie",
      signed: true,
      maxAge: 600000,
    }); //set cookie
    return res.redirect("/cookie");
  }
});

router.get("/logout", (req, res) => {
  // ...
  res.clearCookie("firstName", { path: "/cookie" });
  res.clearCookie("lastName", { path: "/cookie" });
  return res.redirect("/cookie");
});

module.exports = router;
