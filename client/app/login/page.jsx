"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import {
  BufferLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import Navbar from "../components/Navbar";
import { Card } from "@mui/material";
import { auth, provider } from "../auth/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("+918714267479");

  const handleSignUp = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("photoURL", user.photoURL);
        redirect("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const handleOTP = async () => {
    console.log("clicked on it");
    try {
      const appVerifier = window.recaptchaVerifier;
      await signInWithPhoneNumber(auth, phone, appVerifier).then(
        (confirmation) => {
          window.confirmationResult = confirmation;
        }
      );
    } catch (error) {
        alert(error)
      console.log(error);
    }
  };

  useEffect(() => {
    const displayName = localStorage.getItem("displayName");
    const photoURL = localStorage.getItem("photoURL");

    if (displayName && photoURL) {
      redirect("/");
    }
  }, []);

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
                Log In Form
              </span>
            </h1>

            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="email"
                placeholder="Email"
                style={{ height: "30px" }}
                name="email"
              />
            </FormGroup>
            <FormGroup style={{ margin: "10px" }}>
              <Input
                type="password"
                placeholder="Password"
                style={{ height: "30px" }}
                name="password"
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
                <span style={{ fontSize: "14px" }}>Log In with Google</span>
              </GoogleLoginButton>
              <BufferLoginButton
                className="mt-3 mb-3"
                style={{ width: "200px", height: "40px" }}
                onClick={handleOTP}
              >
                <span style={{ fontSize: "14px" }}>Log In with OTP</span>
              </BufferLoginButton>
              <div id="recaptcha"></div>
            </div>
            <div className="text-center">
              <a href="/" style={{ color: "white" }}>
                <Link href="/signup">go to signup page</Link>
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default login;
