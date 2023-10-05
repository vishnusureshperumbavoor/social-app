"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import Chat from "./Chat";
import "./chat.css";

const socket = io.connect("http://localhost:5000/");

function groupchat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room != "") {
      const data = {
        username: username,
        room: room,
      };
      socket.emit("join_room", data);
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.on("joined_room", (data) => {
      console.log(`${data.username} has joined room ${data.room}`);
    });
    const displayName = localStorage.getItem("displayName");
    if (displayName) {
      setUsername(displayName);
    }
  });

  return (
    <>
      <Navbar />
      <div className="App">
        {!showChat ? (
          <div className="joinChatContainer">
            <h1>Chat with humans</h1>
            {username ? (
              <></>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="enter username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </>
            )}
            {/* <input
              type="text"
              placeholder="enter username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            /> */}
            <input
              type="text"
              placeholder="enter room id"
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join a room</button>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </div>
    </>
  );
}

export default groupchat;
