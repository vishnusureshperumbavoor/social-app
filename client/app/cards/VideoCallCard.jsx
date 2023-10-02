"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

function VideoCallCard() {
  return (
    <div>
      <Card sx={{ minWidth: 275, backgroundColor: "#212121" }}>
        <CardContent>
          <ThemeProvider theme={theme}>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                height: "100px",
                justifyContent: "center",
                paddingTop: "40px",
                color: "white",
              }}
            >
              Video Call
            </Typography>
          </ThemeProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default VideoCallCard;
