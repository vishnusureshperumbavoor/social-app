import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CustomCard from "../cards/CustomCard";

function MainContent() {
  const cards = [
    { title: "Video Call", url: "videocall" },
    { title: "Audio Call", url: "audiocall" },
    { title: "Direct Message", url: "direct_message" },
    { title: "Group Chat", url: "groupchat" },
  ];

  return (
    <div>
      <Box sx={{ width: "100%", padding: "60px" }}>
        <Grid container rowSpacing={8} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <CustomCard title={card.title} url={card.url} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default MainContent;
