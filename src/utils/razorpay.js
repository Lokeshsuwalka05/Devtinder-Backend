const Razorpay = require("razorpay");
var Razorpay_instance = new Razorpay({
  key_id: process.env.Razorpay_key_id,
  key_secret: process.env.Razorpay_key_secret,
});
module.exports = { Razorpay_instance };
