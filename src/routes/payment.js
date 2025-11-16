const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const { Razorpay_instance } = require("../utils/razorpay");
const { Payment } = require("../models/payment");
paymentRouter.post("/create/order", userAuth, async (req, res) => {
  try {
    const { type } = req.body;
    const { firstName, lastName, emailId, _id } = req.user;
    let amount = 70000;
    if (type === "Silver") {
      amount = 50000;
    }
    console.log(amount);
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
        console.log(order);
        const { amount, currency, entity, id, notes, status } = order;
        console.log(entity);
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
module.exports = { paymentRouter };
