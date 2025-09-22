const express = require("express");
const app = express();
const { connectDB } = require("./config/Database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validateSignupData");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { userAuth } = require("./middlewares/auth");
app.use(cookieParser());
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    //validate the sign up data
    validateSignupData(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //create a instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added successfully");
  } catch (e) {
    res.status(400).send("Error" + ":" + e.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordMatch = user.isPasswordMatch(password);
    if (isPasswordMatch) {
      //create a jwt token
      const token = user.getJWT();
      //put this inside the cookie and send back to the client
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //same as token expiry
      });
      res.status(200).json({ message: "Login successful" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send({ message: "profile accessed", user: user });
  } catch (e) {
    res.status(400).send("Eroor: " + e.message);
  }
});
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  res.send("conncection request succesfully");
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(400).send("something went wrong");
  }
});
//Feed API to get all the user
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});
//Delete a user by id
app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});
//update a user by id
app.patch("/user/:userId", async (req, res) => {
  const Id = req.params.userId;
  const data = req.body;
  console.log(Id, data);
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ];
    const isAllowedUpdate = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdate) {
      throw new Error("Invalid Update Fields");
    }
    if (data.skills?.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    const user = await User.findByIdAndUpdate(Id, data, {
      runValidators: true,
    });
    if (!user) {
      res.status(401).send("User not found");
    } else {
      res.send("Update successfully");
    }
  } catch (e) {
    res.status(400).send("Something went wrong:" + " " + e.message);
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
