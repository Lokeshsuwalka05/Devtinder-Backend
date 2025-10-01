const express = require("express");
const app = express();
const { connectDB } = require("./config/Database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/user");
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("service is running on port 3000...");
    });
  })
  .catch((e) => console.log(e));
