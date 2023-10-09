"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { CopyToClipboard } from "react-copy-to-clipboard";
import io from "socket.io-client";
import Peer from "simple-peer";
import { TextField, IconButton, Button, Typography } from "@mui/material";
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
  const [receiver, setReceiver] = useState(""); // Example initial value is an empty string
  const [callerSignal, setCallerSignal] = useState(null); // Example initial value is null
  const [callAccepted, setCallAccepted] = useState(false); // Example initial value is false
  const [idToCall, setIdToCall] = useState(""); // Example initial value is an empty string
  const [callEnded, setCallEnded] = useState(false); // Example initial value is false
  const [name, setName] = useState("daddy");

  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const socket = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    socket.current = io.connect(process.env.NEXT_PUBLIC_SERVER_URL);
    socket.current.on("user_id", (response) => {
      setUserId(response);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((response) => {
        setStream(response);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = response;
        }
      });

    socket.current.on("call_to_receiver_client", (data) => {
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setReceivingCall(true);
    });

    socket.current.on("end_on_caller_client", () => {
      if (socket.current) {
        socket.current.destroy();
      }
      setCallAccepted(false);
      setCallEnded(true);
    });
  }, []);

  const callUser = (id) => {
    setReceiver(id);
    setIdToCall("");
    try {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.current.emit("call_to_server", {
          userToCall: id,
          signalData: data,
          from: userId,
          name: name,
        });
      });

      peer.on("stream", (stream) => {
        if (partnerVideoRef.current) {
          partnerVideoRef.current.srcObject = stream;
        }
      });

      socket.current.on("call_accepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      peerRef.current = peer;
    } catch (error) {
      alert(error);
      console.error("Error in callUser:", error);
    }
  };

  const answerCall = () => {
    setReceivingCall(false);
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
      setCallAccepted(true);

      peerRef.current = peer;
    } catch (error) {
      console.error("Error in answering the call:", error);
    }
  };

  const declineCall = () => {
    setReceivingCall(false);
  };

  const leaveCall = () => {
    const peer = peerRef.current;
    if (peer) {
      peer.destroy();
    }
    if (socket.current) {
      socket.current.emit("end_by_receiver", { caller, receiver });
    }
    if (socket.current) {
      socket.current.destroy();
    }
    setCallAccepted(false);
    setCallEnded(true);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Navbar />
        <h1 className="heading">VIDEO CALL</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <div
              className={`video-container ${
                callAccepted && !callEnded ? "call-accepted" : ""
              }`}
            >
              <div className="video">
                <Typography
                  sx={{
                    backgroundColor: "#9400d3",
                    color: "white",
                    borderRadius: "10px 10px 0 0",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {name}
                </Typography>
                <video
                  playsInline
                  muted
                  ref={myVideoRef}
                  autoPlay
                  style={{ width: "300px", borderRadius: "0 0 10px 10px" }}
                />
              </div>

              {callAccepted && !callEnded ? (
                <div className="video">
                  <video
                    playsInline
                    ref={partnerVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "0 0 10px 10px" }}
                  />
                </div>
              ) : null}
            </div>
            {receivingCall ? (
              <div className="caller">
                <h1>{name} is calling...</h1>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    marginRight: "20px",
                  }}
                  onClick={answerCall}
                >
                  Answer
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={declineCall}
                >
                  Decline
                </Button>
              </div>
            ) : null}
            {callAccepted && !callEnded ? (
              <div className="end-call">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={leaveCall}
                >
                  End Call
                </Button>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="myId">
              <Typography style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                User Id : {userId}
              </Typography>
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
                {callAccepted && !callEnded ? null : (
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
      </ThemeProvider>
    </>
  );
}

export default videocall;
