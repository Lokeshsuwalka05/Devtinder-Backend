const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Akshay", lastName: "Saini" });
});
app.post("/user/:id/:resid", (req, res) => {
  //add the data to database
  console.log("dynamic params", req.params);
  console.log("query params", req.query);
  res.send("data is added successfully");
});
app.delete("/user", (req, res) => {
  //delete the data from database
  res.send("deletion successfully");
});

app.listen(3000, () => {
  console.log("service is running on port 3000...");
});
