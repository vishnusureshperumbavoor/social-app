const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
app.use(cors());
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("joined_room",data)
    console.log(`User ${data.username} with ID ${socket.id} has joined room: ${data.room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
