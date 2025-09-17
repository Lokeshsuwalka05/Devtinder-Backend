const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: String, //shorthand for type:string
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
});
// creating user model by using userSchema
const User = mongoose.model("User", userSchema);
module.exports = { User };
