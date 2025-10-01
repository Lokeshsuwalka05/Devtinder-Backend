const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: "{VALUE} is not supported",
    },
  },
});

//connectionRequestSchema pre save function
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (
    connectionRequest.fromUserId.toString() ===
    connectionRequest.toUserId.toString()
  ) {
    const err = new Error("Cannot Send Connection request to yourself");
    return next(err);
  }
  next();
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
const ConnectionRequest = mongoose.model(
  " ConnectionRequest",
  connectionRequestSchema
);
module.exports = { ConnectionRequest };
