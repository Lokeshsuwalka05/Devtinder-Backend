const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateData } = require("../utils/validation");
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
module.exports = profileRouter;
