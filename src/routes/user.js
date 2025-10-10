const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName age about skills photoUrl gender";
const { User } = require("../models/user");
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.status(200).json({ message: "data fetched successfully", users: data });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connecetionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const allConnections = connecetionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({ connections: allConnections });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  // in feed,we will not show the listed catogory
  //0)ignored user
  //1)interested user
  //2)and those who already sent a connection request to user
  //3)and selfCard
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 5 ? 5 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const feedUser = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUsersFromFeed),
          },
        },
        {
          _id: {
            $ne: loggedInUserId,
          },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({ message: "data send successfully", feedOfUser: feedUser });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
module.exports = { userRouter };
