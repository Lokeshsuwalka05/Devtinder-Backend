const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
const ConnectionRequest = mongoose.model(
  " ConnectionRequest",
  connectionRequestSchema
);
module.exports = { ConnectionRequest };
