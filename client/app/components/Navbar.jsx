"use client";
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { redirect } from "next/navigation";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const storedPhotoURL = localStorage.getItem("photoURL");
    const displayName = localStorage.getItem("displayName");
    if (storedPhotoURL) {
      setPhotoURL(storedPhotoURL);
    }
    if (displayName) {
      setUser(displayName);
    }
  }, []);

  const handleChange = (event) => {
    // setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    redirect('/login')
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("displayName");
        localStorage.removeItem("photoURL");
        window.location.reload()
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#212121" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{ fontFamily: "Times New Roman" }}
            >
              The Social App
            </Typography>
            {auth && (
              <div>
                {photoURL ? (
                  <>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <Avatar src={photoURL} alt="User Profile" />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem>{user}</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                    >
                      <MenuItem onClick={handleClose}>Login</MenuItem>
                    </Menu>
                  </>
                )}
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Navbar;
