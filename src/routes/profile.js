const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: "profile accessed", user: user });
  } catch (e) {
    res.status(400).send("Eroor: " + e.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUpdateData(req.body);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: "updated successfully", updatedUser: loggedInUser });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    if (old_password === new_password) {
      throw new Error("New password same as old");
    }
    const loggedInUser = req.user;
    const isMatch = await bcrypt.compare(old_password, loggedInUser.password);
    if (!isMatch) {
      throw new Error("Invalid Old Password");
    }
    const passwordHash = await bcrypt.hash(new_password, saltRounds);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.clearCookie("token");
    res.status(200).json({ message: "password updated successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = profileRouter;
