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

  
  const handleEdit = (activityId, gameType) => {
    let path = "";

    switch (gameType) {
      case "GAME1":
        path = "/create-activity/OnePicFourWords";
        break;
      case "GAME2":
        path = "/create-activity/PhraseTranslation";
        break;
      case "GAME3":
        path = "/create-activity/WordTranslation";
        break;
      default:
        alert("Unknown game type");
        return;
    }

    navigate(`${path}/${activityId}`);
  };

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
      <Box sx={{ maxHeight: "90vh", minHeight: "60vh", bgcolor: "#A6D6D6", p: 4 }}>
        <Typography
          onClick={() => navigate("/admin")}
          sx={{
            color: "black",
            cursor: "pointer",
            textDecoration: "underline",
            mb: 2,
          }}
        >
          Back
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="black" mb={3}>
          Activities
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {/*Activity List*/}
        <Paper sx={{ bgcolor: "#F4F8D3", p: 2, color: "black" }}>
          <Box  
          sx={{
                maxHeight: "300px", 
                overflowY: "auto", 
              }}>
          <List>
            {activities.map((activity) => (
              <ListItem key={activity.activityId} sx={{ borderBottom: "1px solid #444" }}>
                <ListItemText
                  primary={`${activity.activityName} (ID: ${activity.activityId})`}
                  secondary={`Game Type: ${activity.gameType}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="primary" onClick={() => handleEdit(activity.activityId, activity.gameType)}>
                    <EditIcon />
                  </IconButton>
                  {/*<IconButton edge="end" color="error" onClick={() => handleDelete(activity.activityId)}>
                    <DeleteIcon />
                  </IconButton>*/}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          </Box>
        </Paper>

        <Box mt={4}>
          <Typography variant="h6" color="black" mb={2}>
            Create a New Activity
          </Typography>
          <Grid container spacing={3} sx={{ display: "flex" }}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#059669" }, color: "black" }}
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
                sx={{ bgcolor: "#3B82F6", ":hover": { bgcolor: "#2563EB"  }, color: "black" }}
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
                sx={{ bgcolor: "#F59E0B", ":hover": { bgcolor: "#D97706" }, color: "black"  }}
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