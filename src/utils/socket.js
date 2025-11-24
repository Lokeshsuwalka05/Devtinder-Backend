const { Server } = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const getSecretRoomId = (userId, targetUserId) => {
  const hash = crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("#@"))
    .digest("hex");
  return hash;
};
const intializeSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined room ", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessages",
      async ({ firstName, text, userId, targetUserId, lastName }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text: text });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text, lastName });
        } catch (e) {
          console.log(e);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = { intializeSocket };
