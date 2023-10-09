"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { CopyToClipboard } from "react-copy-to-clipboard";
import io from "socket.io-client";
import Peer from "simple-peer";
import { TextField, IconButton, Button } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import "./page.css";
import { Card } from "@mui/material";
import { createTheme, ThemeProvider, Grid } from "@mui/material";
require("dotenv").config;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function videocall() {
  const [userId, setUserId] = useState("");
  const [stream, setStream] = useState(); // Example initial value is null
  const [receivingCall, setReceivingCall] = useState(false); // Example initial value is false
  const [caller, setCaller] = useState(""); // Example initial value is an empty string
  const [callerSignal, setCallerSignal] = useState(null); // Example initial value is null
  const [callAccepted, setCallAccepted] = useState(false); // Example initial value is false
  const [idToCall, setIdToCall] = useState(""); // Example initial value is an empty string
  const [callEnded, setCallEnded] = useState(false); // Example initial value is false
  const [name, setName] = useState("daddy");

  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_URL);
    socket.on("user_id", (response) => {
      setUserId(response);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((response) => {
        setStream(response);
        if(myVideoRef.current){
          myVideoRef.current.srcObject = response;
        }
      });

    socket.on("call_user", (data) => {
      setUserId(data.user_id);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setReceivingCall(true);
    });
  }, []);

  const callUser = (id) => {
    const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_URL);
    try {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.emit("call_user", {
          userToCall: id,
          signalData: data,
          from: userId,
          name: name,
        });
      });

      peer.on("stream", (stream) => {
        if(partnerVideoRef.current){
          partnerVideoRef.current.srcObject = stream;
        }
      });

      socket.on("call_accepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      
      connectionRef.current = peer;
    } catch (error) {
      alert(error);
      console.error("Error in callUser:", error);
    }
  };

  const answerCall = () => {
    setReceivingCall(false)
    try {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("connect", () => {
        console.log("Connected to peer answering call");
      });

      peer.on("signal", (data) => {
        socket.current.emit("answer_call", { signal: data, to: caller });
      });

      peer.on("stream", (remoteStream) => {
        partnerVideoRef.current.srcObject = remoteStream;
      });

      peer.signal(callerSignal);
      connectionRef.current = peer;
      setCallAccepted(true);

    } catch (error) {
      console.error("Error in answering the call:", error);
    }
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Navbar />
        <h1 style={{ textAlign: "center", color: "#fff" }}>VIDEO CALL</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} className="center-grid-item">
            <div className="video-container">
              <Card
                sx={{
                  minWidth: 275,
                  backgroundColor: "#212121",
                  padding: "4px",
                }}
              >
                <div className="video">
                  <video
                    playsInline
                    muted
                    ref={myVideoRef}
                    autoPlay
                    style={{ width: "100%" }}
                  />
                </div>
              </Card>
              <Card
                sx={{
                  minWidth: 275,
                  backgroundColor: "#212121",
                  padding: "4px",
                }}
              >
                <div className="video">
                  {callAccepted && !callEnded ? (
                    <video
                      playsInline
                      ref={partnerVideoRef}
                      autoPlay
                      style={{ width: "300px" }}
                    />
                  ) : null}
                </div>
              </Card>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className="center-grid-item">
            <div className="myId">
              userid : {userId}
              <TextField
                id="filled-basic"
                label="username"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "1rem", color: "white" }}
              />
              <CopyToClipboard text={userId} style={{ marginBottom: "1rem" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AssignmentIcon fontSize="large" />}
                >
                  Copy ID
                </Button>
              </CopyToClipboard>
              <TextField
                id="filled-basic"
                label="User ID to call"
                variant="filled"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveCall}
                  >
                    End Call
                  </Button>
                ) : (
                  <IconButton
                    color="primary"
                    aria-label="call"
                    onClick={() => callUser(idToCall)}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          {receivingCall ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default videocall;
