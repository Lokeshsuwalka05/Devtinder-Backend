const express = require("express");
const app = express();
const { connectDB } = require("./config/Database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validateSignupData");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
    console.log(emailId);
    //check for mailId
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    //check for password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      res.send("login successfully..");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
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
//update a user by Email
app.patch("/userByEmail", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  console.log(emailId, data);
  try {
    const user = await User.findOneAndUpdate({ emailId: emailId }, data);
    console.log(user);
    res.send("Update successfully");
  } catch (e) {
    res.status(400).send("Something went wrong");
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
