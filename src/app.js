const express = require("express");
const app = express();
const { connectDB } = require("./config/Database");
const { User } = require("./models/user");
app.post("/signup", async (req, res) => {
  //made instance of the User Model
  const user = new User({
    firstName: "Sanjay",
    lastName: "Suwalka",
    emailId: "lokesh@gmail.com",
    password: "123",
    age: 23,
    gender: "male",
  });
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (e) {
    res
      .status(400)
      .send("Error while saving the data to the database" + " " + e.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("service is running on port 3000...");
    });
  })
  .catch((e) => console.log(e));
