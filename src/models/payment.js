const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      ref: "User",
    },
    lastName: {
      type: String,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      ref: "User",
    },
    currency: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    Order_id: {
      type: String,
      required: true,
    },
    notes: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = { Payment };
