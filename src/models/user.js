const mongoose = require("mongoose");
var validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
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
      validate: [
        {
          validator: async (value) => {
            const user = await User.findOne({ emailId: value });
            if (user) {
              return false;
            } else {
              return true;
            }
          },
          message: "Email already exist",
        },
        {
          validator: function (value) {
            return validator.isEmail(value);
          },
          message: "Invalid email format",
        },
      ],
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
// creating user model by using userSchema
const User = mongoose.model("User", userSchema);
module.exports = { User };
