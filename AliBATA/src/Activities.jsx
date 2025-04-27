import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "./SidebarLayout";

const Activities = () => {
  const navigate = useNavigate();

  const createActivity = async (activityName, gameType, redirectPath) => {
    const token = localStorage.getItem("token");
    try {
      // Create the activity with the required fields
      const response = await axios.post(
        "https://alibata.duckdns.org/api/alibata/activities",
        {
          activityName, // Name of the activity
          gameType, // Type of the game
          completed: false, // Default to false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Activity created:", response.data);

      // Redirect to the specific activity creation page with activityId
      navigate(`${redirectPath}/${response.data.activityId}`);
    } catch (err) {
      console.error("Error creating activity:", err.response?.data || err.message);
      alert("Failed to create activity. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "90vh",minHeight: "60vh", bgcolor: "#1E1E1E", p: 4 }}>
         <Typography
                  onClick={() => navigate("/admin")}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    textDecoration: "underline",
                    mb: 2,
                  }}
                >
                  Back
                </Typography>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          Choose an Activity Type
        </Typography>
        <Grid container spacing={3} sx={{ display: "flex"}}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#059669" } }}
              onClick={() =>
                createActivity("One Pic Four Words", "GAME1", "/create-activity/OnePicFourWords")
              }
            >
              One Pic Four Words
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#3B82F6", ":hover": { bgcolor: "#2563EB" } }}
              onClick={() =>
                createActivity("Phrase Translation", "GAME2", "/create-activity/PhraseTranslation")
              }
            >
              Phrase Translation
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#F59E0B", ":hover": { bgcolor: "#D97706" } }}
              onClick={() =>
                createActivity("Word Translation", "GAME3", "/create-activity/WordTranslation")
              }
            >
              Word Translation
            </Button>
          </Grid>
        </Grid>
      </Box>
    </SidebarLayout>
  );
};

export default Activities;