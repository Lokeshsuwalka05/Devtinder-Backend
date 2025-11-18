const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const { Razorpay_instance } = require("../utils/razorpay");
const { Payment } = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/user");
paymentRouter.post("/create/order", userAuth, async (req, res) => {
  try {
    const { type } = req.body;
    const { firstName, lastName, emailId, _id } = req.user;
    let amount = 70000;
    if (type === "Silver") {
      amount = 50000;
    }
    var options = {
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      notes: {
        firstName,
        lastName,
        emailId,
        type,
      },
      receipt: "order_rcptid_11",
    };
    Razorpay_instance.orders.create(options, async (err, order) => {
      try {
        const { amount, currency, entity, id, notes, status } = order;

        const Payment_info = new Payment({
          userID: _id,
          firstName,
          lastName,
          emailId,
          amount,
          currency,
          entity,
          Order_id: id,
          notes,
          status,
        });
        await Payment_info.save();
        res.json({
          message: "Order created successfully",
          info: Payment_info,
          key: process.env.Razorpay_key_id,
        });
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhook_secret
    );
    if (!isValidWebhook) {
      return res.status(400).send({ message: "Webhook signature is invalid" });
    }
    //update the payment status in your db
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({
      Order_id: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();
    //mark the user as premium
    const user = await User.findOne({ emailId: paymentDetails.notes.emailId });
    user.isPremium = true;
    user.membershipType = paymentDetails.notes.type;
    await user.save();
    //return success response to razorpay
    return res.status(200).json({ message: "Web hook received successfully" });
    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }
  } catch (err) {
    console.log(err);
  }
});
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  if (user.isPremium === true) {
    return res.status(200).json({ isPremium: true });
  }
  return res.status(200).json({ isPremium: false });
});
module.exports = { paymentRouter };
