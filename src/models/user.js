const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
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
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            return validator.isStrongPassword(value);
          },
          message: "Please Use a strong password",
        },
      ],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      lowercase: true,
    },
    about: {
      type: String,
      default: "I will learn javascript for Sure",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (arr.length <= 10) {
            return true;
          }
          return false;
        },
        message: "Skills can not be more than 10",
      },
    },
    photoUrl: {
      type: String,
      default: function () {
        if (this.gender === "male") {
          return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcn0QNLLEGdAoT913xPyxqc7_Grb4Hdp-M4rVyJVbN2T_uN7-xFcFxpyY&s";
        } else if (this.gender === "female") {
          return "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-female-icon.png";
        }
      },
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Invalid Photo Url",
      },
    },
  },
  {
    timestamps: true,
  }
);
//instance methods
userSchema.methods.getJWT = function () {
  const user = this;
  const id = this.id;
  const token = jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: "1d" });
  return token;
};
userSchema.methods.isPasswordMatch = async function (passwordEnterByUser) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(
    passwordEnterByUser,
    user.password
  );
  return isPasswordMatch;
};
// creating user model by using userSchema
const User = mongoose.model("User", userSchema);
module.exports = { User };
