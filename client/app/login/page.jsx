"use client"
import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { GoogleLogin } from "react-google-login";
import { FacebookProvider, LoginButton } from "react-facebook";

function login() {
  return (
    <div>
      <Navbar />
      <div>
        <Form className="login-form">
          <h1 className="text-center">
            <span className="font-weight-bold">Login Form</span>
          </h1>
          <img />
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" placeholder="Email" />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" placeholder="Password" />
          </FormGroup>
          <Button className="btn-lg btn-block">Log in</Button>
          <div className="text-center pt-3">Or</div>
          <FacebookLoginButton className="mt-3 mb-3" />
          <GoogleLoginButton buttonText="Login" className="mt-3 mb-3" />
          <GoogleLogin
            // clientId="633129028687-bgjj935aa6dv1rocm52ku7gd8ec40afa.apps.googleusercontent.com"
            clientId="633129028687-bgjj935aa6dv1rocm52ku7gd8ec40afa.apps.googleusercontent.com"
            buttonText="Login with Google"
            cookiePolicy={"single_host_origin"}
          />

          <div className="text-center">
            <a href="/sign-up">Sign up</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default login;
