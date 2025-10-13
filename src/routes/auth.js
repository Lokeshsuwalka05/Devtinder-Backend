const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const saltRounds = 10;
authRouter.post("/signup", async (req, res) => {
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
    const token = user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //same as token expiry
    });
    res.status(200).json({ message: "User Added successfully" });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: "Email ID already exists" });
    }
    res.status(400).send("Error" + ":" + e.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordMatch = await user.isPasswordMatch(password);
    if (isPasswordMatch) {
      //create a jwt token
      const token = user.getJWT();
      //put this inside the cookie and send back to the client
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //same as token expiry
      });
      res.status(200).json({ message: "Login successful", loggedInUser: user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!!!");
});
module.exports = authRouter;
