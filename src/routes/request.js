const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { validateObjectIdParam } = require("../utils/validation");
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      //validate all the data
      //validating the status
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      //check if the user id is valid or not
      const validation = validateObjectIdParam(toUserId);
      if (!validation.isValid) {
        return res.status(400).json(validation);
      }
      //handle the case where user sending a connection request to yourself
      //for this I defined a pre save

      //check if the toUserId is present in database or not
      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(400).send({ error: "user does not exist" });
      }
      //create a instance(document) of ConnectionRequest Model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      //check if the connectionRequest already exist in database
      const existingConnectionRequest = await ConnectionRequest.find({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest.length > 0) {
        return res
          .status(400)
          .json({ error: "Connection request already exist" });
      }

      await connectionRequest.save();
      res.send("conncection request succesfully");
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    //loggedInUser=>toUserId
    //status must be interested whoever is sending the connecetion request to you
    //if the status is interested then there will be the case 1)we can accept it and 2) we can reject it
    try {
      const allowedStatus = ["accepted", "rejected"];
      const { status, requestID } = req.params;
      const loggedInUser = req.user;
      const loggedInUserId = loggedInUser._id;
      //for data validation
      //for status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid Status" });
      }
      //for object id param
      const validation = validateObjectIdParam(requestID);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ error: "Connection request not found or already processed" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      // Send success response
      res.status(200).json({
        message: `Connection request ${status} successfully`,
        connectionRequest: data,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);
module.exports = requestRouter;
