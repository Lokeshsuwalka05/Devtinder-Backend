const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://lokeshsuwalka2002:SAHN5ahmPytV3Beh@cluster0.vfclovq.mongodb.net/Devtinder"
  );
};

module.exports = { connectDB };
