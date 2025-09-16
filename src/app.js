const express = require("express");
const app = express();

app.use(
  "/user/:id/:resID",
  (req, res, next) => {
    console.log("1st sir");
    // res.send("1st response");
    next();
  },
  (req, res, next) => {
    console.log("2nd sir");
    console.log(req.params);

    // res.send("2nd response");
    next();
  },
  (req, res, next) => {
    console.log("3rd sir");
    next();
  },
  (req, res, next) => {
    res.send("4th response");
    console.log(req.query);
    next();
  }
);

app.listen(3000, () => {
  console.log("service is running on port 3000...");
});
