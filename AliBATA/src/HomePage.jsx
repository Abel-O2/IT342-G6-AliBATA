import { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component
import diamondImage from "./assets/diamond.png";
import axios from "axios";

const HomePage = () => {
  const [activities, setActivities] = useState([]); // State to store activities
  const [stories, setStories] = useState([]); // State to store stories
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/alibata/activities", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Activities response:", response.data);
        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid activities response from the server.");
        }
        setActivities(response.data); // Store activities in state
      } catch (err) {
        console.error("Failed to fetch activities:", err.message || err.response?.data);
        setError("Failed to fetch activities. Please try again.");
      }
    };

    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/alibata/stories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Stories response:", response.data);
        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid stories response from the server.");
        }
        // Filter completed stories
        const completedStories = response.data.filter((story) => story.completed);
        setStories(completedStories); // Store completed stories in state
      } catch (err) {
        console.error("Failed to fetch stories:", err.message || err.response?.data);
        setError("Failed to fetch stories. Please try again.");
      }
    };

    fetchActivities();
    fetchStories();
  }, []);

  return (
    <SidebarLayout>
      <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 3 }}>
        Progress Dashboard
      </Typography>
      <hr />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Paper
        sx={{
          p: 3,
          mt: 3,
          bgcolor: "#333",
          textAlign: "center",
          color: "white",
          width: "97.5%",
        }}
      >
        <Typography variant="h6">Activities</Typography>
        <List>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ListItem key={activity.activityId} sx={{ borderBottom: "1px solid #444" }}>
                <ListItemText
                  primary={`Activity Name: ${activity.activityName}`}
                  secondary={`Activity: ${activity.gameType}`}
                  //secondary={`Completed: ${activity.isCompleted ? "Yes" : "No"}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="white">No activities available.</Typography>
          )}
        </List>
      </Paper>

      <Paper
        sx={{
          p: 2,
          mt: 3,
          textAlign: "center",
          bgcolor: "#444",
          color: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
        }}
      >
        <Typography variant="h5">Subscription: Basic Tier</Typography>
      </Paper>

      <Paper sx={{ p: 3, mt: 4, bgcolor: "#222", color: "white", width: "97.5%" }}>
        <Typography variant="h6" fontWeight="bold">
          Stories Available ({stories.length})
        </Typography>
        <List>
          {stories.length > 0 ? (
            stories.map((story) => (
              <ListItem key={story.storyId} sx={{ borderBottom: "1px solid #444" }}>
                <ListItemText
                  primary={`📖 ${story.title}`}
                  secondary={story.storyText}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="white">No completed stories available.</Typography>
          )}
        </List>
      </Paper>
    </SidebarLayout>
  );
};

export default HomePage;
