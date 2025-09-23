const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: "profile accessed", user: user });
  } catch (e) {
    res.status(400).send("Eroor: " + e.message);
  }
});
module.exports = profileRouter;
