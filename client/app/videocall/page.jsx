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

const socket = io.connect("http://localhost:5000/");

function videocall() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(); // Example initial value is null
  const [receivingCall, setReceivingCall] = useState(false); // Example initial value is false
  const [caller, setCaller] = useState(""); // Example initial value is an empty string
  const [callerSignal, setCallerSignal] = useState(null); // Example initial value is null
  const [callAccepted, setCallAccepted] = useState(false); // Example initial value is false
  const [idToCall, setIdToCall] = useState(""); // Example initial value is an empty string
  const [callEnded, setCallEnded] = useState(false); // Example initial value is false
  const [name, setName] = useState("");

  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((streamVideo) => {
        setStream(streamVideo);
        console.log(streamVideo);
        // myVideoRef.current.srcObject = streamVideo;
      });

    socket.on("user_id", (user_id) => {
      console.log("received user id");
      console.log(user_id);
      setMe(user_id);
    });

    socket.on("call_user", (data) => {
      console.log(data);
      setMe(data.user_id);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCaller(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call_user", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
    });

    socket.on("call_accepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      inititator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <Navbar />
      <h1 style={{ textAlign: "center", color: "#fff" }}>VIDEO CALL</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {/* {stream && ( */}
              <video
                playsInline
                muted
                ref={myVideoRef}
                autoPlay
                style={{ width: "300px" }}
              />
            {/* )} */}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideoRef}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : null}
          </div>
        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
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
            label="id to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
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
            {idToCall}
          </div>
        </div>
      </div>
      {!receivingCall && !callAccepted ? (
        <div className="caller">
          <h1>{name} is calling...</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default videocall;
