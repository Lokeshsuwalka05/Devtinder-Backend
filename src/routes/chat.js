const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { ConnectionStates } = require("mongoose");
const chatRouter = express.Router();
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { targetUserId } = req.params;
    const chatMessages = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });
    return res.status(200).json({
      message: "Chats send Successfully",
      data: chatMessages.messages,
    });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});
module.exports = { chatRouter };
