import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "./SidebarLayout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://alibata.duckdns.org/api/alibata/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActivities(response.data);
      } catch (err) {
        console.error("Error fetching activities:", err.response?.data || err.message);
        setError("Failed to fetch activities. Please try again later.");
      }
    };

    fetchActivities();
  }, []);

  const createActivity = async (activityName, gameType, redirectPath) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://alibata.duckdns.org/api/alibata/activities",
        {
          activityName,
          gameType,
          completed: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Activity created:", response.data);
      navigate(`${redirectPath}/${response.data.activityId}`);
    } catch (err) {
      console.error("Error creating activity:", err.response?.data || err.message);
      alert("Failed to create activity. Please try again.");
    }
  };

  /*
  const handleEdit = (activityId) => {
    navigate(`/edit-activity/${activityId}`);
  };*/

  const handleDelete = async (activityId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://alibata.duckdns.org/api/alibata/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities((prev) => prev.filter((activity) => activity.activityId !== activityId));
      alert("Activity deleted successfully.");
    } catch (err) {
      console.error("Error deleting activity:", err.response?.data || err.message);
      alert("Failed to delete activity. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "90vh", minHeight: "60vh", bgcolor: "#1E1E1E", p: 4 }}>
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
          Activities
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {/*
        <Paper sx={{ bgcolor: "#2B2B2B", p: 2, color: "white" }}>
          <Box  
          sx={{
                maxHeight: "300px", // Set a fixed height for the list
                overflowY: "auto", // Enable vertical scrolling
              }}>
          <List>
            {activities.map((activity) => (
              <ListItem key={activity.activityId} sx={{ borderBottom: "1px solid #444" }}>
                <ListItemText
                  primary={activity.activityName}
                  secondary={`Game Type: ${activity.gameType}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="primary" onClick={() => handleEdit(activity.activityId)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDelete(activity.activityId)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          </Box>
        </Paper>*/}
        <Box mt={4}>
          <Typography variant="h6" color="white" mb={2}>
            Create a New Activity
          </Typography>
          <Grid container spacing={3} sx={{ display: "flex" }}>
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
      </Box>
    </SidebarLayout>
  );
};

export default Activities;