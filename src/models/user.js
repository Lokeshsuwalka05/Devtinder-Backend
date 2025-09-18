const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 30,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: async (value) => {
          const user = await User.findOne({ emailId: value });
          if (user) {
            return false;
          } else {
            return true;
          }
        },
        message: "Email already exists",
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    about: {
      type: String,
      default: "I will learn javascript for Sure",
    },
  },
  {
    timestamps: true,
  }
);
// creating user model by using userSchema
const User = mongoose.model("User", userSchema);
module.exports = { User };
