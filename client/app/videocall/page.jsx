"use client"
import React,{ useEffect, useRef }from "react";
import Navbar from "../components/Navbar";

import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

function videocall() {
    const videoRef = useRef();
  const socketRef = useRef();
  const peerRef = useRef();
  useEffect(() => {
    // Initialize socket.io connection
    socketRef.current = io.connect("http://localhost:5000/"); // You may need to configure the server URL

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        // Create a new WebRTC peer connection
        peerRef.current = new SimplePeer({
          initiator: window.location.hash === '#initiator',
          trickle: false,
          stream: stream,
        });

        // Handle peer events
        peerRef.current.on('signal', (data) => {
          // Send your peer signal data to the other peer through the server
          socketRef.current.emit('signal', data);
        });

        // Handle incoming peer signals
        socketRef.current.on('signal', (data) => {
          // Pass the incoming signal data to your peer connection
          peerRef.current.signal(data);
        });
      })
      .catch((error) => console.error('Error accessing camera and microphone:', error));

    return () => {
      // Cleanup
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <>
      <Navbar />
      <video ref={videoRef} autoPlay />
    </>
  );
}

export default videocall;