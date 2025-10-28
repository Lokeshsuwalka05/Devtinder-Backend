const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { User } = require("../models/user.js");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send({ message: "Please Login First" });
    }
    const decodedUserInfo = jwt.verify(token, JWT_SECRET);
    const { _id } = decodedUserInfo;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
};

module.exports = {
  userAuth,
};
