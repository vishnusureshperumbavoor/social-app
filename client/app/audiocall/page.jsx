"use client"
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

export default function Home() {
  const [yourID, setYourID] = useState("");
  const [peers, setPeers] = useState({});
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [name, setName] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("yourID", (id) => {
      setYourID(id);
    });

    socket.on("allUsers", (users) => {
      setPeers(users);
    });

    socket.on("call-made", (data) => {
      setReceivingCall(true);
      setCaller(data.socket);
      setCallerSignal(data.offer);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("call-accepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer-call", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div className="App">
      <video playsInline muted ref={userVideo} autoPlay />
      {callAccepted && !callEnded ? (
        <video playsInline ref={partnerVideo} autoPlay />
      ) : null}
      <div>
        <h1>Your ID: {yourID}</h1>
        <div className="users">
          {Object.keys(peers).map((key) => {
            if (key === yourID) {
              return null;
            }
            return (
              <button key={key} onClick={() => callUser(key)}>
                Call {key}
              </button>
            );
          })}
        </div>
      </div>
      {receivingCall && !callAccepted ? (
        <div className="caller">
          <h1>{name} is calling...</h1>
          <button onClick={answerCall}>Answer</button>
        </div>
      ) : null}
      {callAccepted && !callEnded ? (
        <div className="call-footer">
          <button onClick={leaveCall}>End Call</button>
        </div>
      ) : null}
    </div>
  );
}
