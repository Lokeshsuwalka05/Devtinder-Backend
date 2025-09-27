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
module.exports = requestRouter;
