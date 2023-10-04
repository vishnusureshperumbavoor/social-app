"use client";
import React, { useState } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import {
  BufferLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import Navbar from "../components/Navbar";
import { Card } from "@mui/material";
import { auth, provider } from "../auth/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        alert(user.displayName);
        console.log("User's display name:", user.displayName);
        console.log(credential);
        console.log(token);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Card
          className="signup-form"
          sx={{
            width: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#212121",
          }}
        >
          <Form
            className="signup-form"
            style={{ margin: "10px", textAlign: "center" }}
          >
            <h1 className="text-center">
              <span className="font-weight-bold" style={{ color: "white" }}>
                Sign Up Form
              </span>
            </h1>
            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="text"
                placeholder="Name"
                style={{ height: "30px" }}
              />
            </FormGroup>
            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="email"
                placeholder="Email"
                style={{ height: "30px" }}
              />
            </FormGroup>
            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="password"
                placeholder="Password"
                style={{ height: "30px" }}
              />
            </FormGroup>
            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="password"
                placeholder="Re-Password"
                style={{ height: "30px" }}
              />
            </FormGroup>
            <Button
              className="btn-lg btn-block"
              style={{ margin: "10px", width: "200px", height: "40px" }}
            >
              Please Sign Up here:-
            </Button>
            <div
              className="text-center pt-3"
              style={{ textAlign: "center", color: "white" }}
            >
              Or
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GoogleLoginButton
                className="mt-3 mb-3"
                style={{ width: "200px", height: "40px" }}
                onClick={handleSignUp}
              >
                <span style={{ fontSize: "14px" }}>Sign up with Google</span>
              </GoogleLoginButton>
              <BufferLoginButton
                className="mt-3 mb-3"
                style={{ width: "200px", height: "40px" }}
              >
                <span style={{ fontSize: "14px" }}>Sign up with OTP</span>
              </BufferLoginButton>
            </div>
            <div className="text-center">
              <a href="/" style={{ color: "white" }}>
                back to login page
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default signup;
