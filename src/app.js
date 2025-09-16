const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);
app.get("/admin/getAllData", (req, res) => {
  res.send("data Read successfully");
});
app.post("/admin/createData", (req, res) => {
  res.send("User Added");
});

app.get("/user", userAuth, (req, res) => {
  res.send("data Read successfully");
});

app.listen(3000, () => {
  console.log("service is running on port 3000...");
});
