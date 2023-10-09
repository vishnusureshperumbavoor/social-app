"use client"
import React, { useEffect, useState, useRef } from "react";
import "./page.css";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

function videocall2() {
    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();

    useEffect(() => {
      socket.current = io.connect("/");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        });

      socket.current.on("yourID", (id) => {
        setYourID(id);
      });
      socket.current.on("allUsers", (users) => {
        setUsers(users);
      });

      socket.current.on("hey", (data) => {});
    }, []);

    function callPeer(id) {}

    function acceptCall() {}

    let UserVideo;
    if (stream) {
      UserVideo = <Video playsInline muted ref={userVideo} autoPlay />;
    }

    let PartnerVideo;
    if (callAccepted) {
      PartnerVideo = <Video playsInline ref={partnerVideo} autoPlay />;
    }

    let incomingCall;
    if (receivingCall) {
      incomingCall = (
        <div>
          <h1>{caller} is calling you</h1>
          <button onClick={acceptCall}>Accept</button>
        </div>
      );
    }
  return (
    <div>
      <Container>
        <Row>
          {UserVideo}
          {PartnerVideo}
        </Row>
        <Row>
          {Object.keys(users).map((key) => {
            if (key === yourID) {
              return null;
            }
            return <button onClick={() => callPeer(key)}>Call {key}</button>;
          })}
        </Row>
        <Row>{incomingCall}</Row>
      </Container>
    </div>
  );
}

export default videocall2;