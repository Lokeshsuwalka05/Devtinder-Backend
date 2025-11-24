const express = require("express");
const app = express();
require("dotenv").config();
require("./utils/cronJob");
const { createServer } = require("node:http");
const { connectDB } = require("./config/Database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/user");
const { paymentRouter } = require("./routes/payment");
const cors = require("cors");
const { intializeSocket } = require("./utils/socket");
const { chatRouter } = require("./routes/chat");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
const server = createServer(app);
intializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established....");
    server.listen(3000, () => {
      console.log("service is running on port 3000...");
    });
  })
  .catch((e) => console.log(e));
