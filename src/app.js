const express = require("express");
const app = express();

// const { adminAuth, userAuth } = require("./middlewares/auth");

app.get("/admin/getAllData", (req, res, next) => {
  throw new Error("afojdshhius");
});
app.get("/admin/getAllData", (req, res, next) => {
  console.log("hello mai aa raha hu");
  res.send("data read successfully");
});

//this was the error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send("something went wrong");
});

app.listen(3000, () => {
  console.log("service is running on port 3000...");
});
