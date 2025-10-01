const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "about", "skills"]);
    res.status(200).json({ message: "data fetched successfully", users: data });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
module.exports = { userRouter };
