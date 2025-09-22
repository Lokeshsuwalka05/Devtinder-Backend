const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { User } = require("../models/user.js");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invlid token");
    }
    const decodedUserInfo = jwt.verify(token, JWT_SECRET);
    const { _id } = decodedUserInfo;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } else {
    res.status(401).send("Check your credentials and try again");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
