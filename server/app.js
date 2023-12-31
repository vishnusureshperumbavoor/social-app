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
  socket.emit("user_id", socket.id);

  // group messaging
  socket.on("join_room", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("joined_room", data);
    console.log(
      `User ${data.username} with ID ${socket.id} has joined room: ${data.room}`
    );
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  // video call
  socket.on("call_to_server", (data) => {
    socket.to(data.userToCall).emit("call_to_receiver_client", {
      user_id: socket.id,
      signal: data.signalData,
      from: data.from,
      name: data.name,
      to: data.userToCall,
    });
  });

  socket.on("answer_call", (data) => {
    socket.to(data.to).emit("call_accepted", data);
  });

  socket.on("end_by_receiver", ({ caller,receiver }) => {
    socket.to(caller).emit("end_on_caller_client");
    socket.to(receiver).emit("end_on_caller_client");
  });

  socket.on("decline_call_by_caller",(receiver)=>{
    socket.to(receiver).emit("decline_call_by_caller");
  })

  socket.on("decline_call_by_receiver",(caller)=>{
    socket.to(caller).emit("decline_call_by_receiver");
  })

  // disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
