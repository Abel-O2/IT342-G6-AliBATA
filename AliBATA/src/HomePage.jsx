import { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import SidebarLayout from "./SidebarLayout";
import diamondImage from "./assets/diamond.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    const decoded = jwtDecode(token);
    setUserId(decoded.userId);

    const fetchActivities = async () => {
      try {
        const response = await axios.get("https://alibata.duckdns.org/api/alibata/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid activities response from the server.");
        }
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err.message || err.response?.data);
        setError("Failed to fetch activities. Please try again.");
      }
    };

    const fetchStories = async () => {
      try {
        const response = await axios.get("https://alibata.duckdns.org/api/alibata/stories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid stories response from the server.");
        }
        setStories(response.data);
      } catch (err) {
        console.error("Failed to fetch stories:", err.message || err.response?.data);
        setError("Failed to fetch stories. Please try again.");
      }
    };

    fetchActivities();
    fetchStories();
  }, []);

  const handleWatchVideo = async (storyId) => {
    const story = stories.find((s) => s.storyId === storyId);
    if (!story) {
      setMessage("Story not found. Please try again.");
      return;
    }
  
    try {
      
      window.open(story.youtubeVideoId, "_blank");
  
      
      await axios.put(
        `https://alibata.duckdns.org/api/alibata/stories/${story.storyId}`,
        {
          title: story.title,
          storyText: story.storyText,
          youtubeVideoId: story.youtubeVideoId,
          completed: true, 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setStories((prevStories) =>
        prevStories.map((s) =>
          s.storyId === storyId ? { ...s, completed: true } : s
        )
      );
  
      setMessage("✅ Story marked as completed!");
    } catch (err) {
      console.error("❌ Failed to mark story as completed:", err.response?.data || err.message);
      setMessage("❌ Failed to mark story as completed. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "90vh", minHeight: "60vh", bgcolor: "#A6D6D6", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 3 }}>
          Progress Dashboard
        </Typography>
        <hr />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {message && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}

        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: "#F4F8D3",
            textAlign: "center",
            color: "black",
            width: "97.5%",
          }}
        >
          <Typography variant="h6">Activities</Typography>
          <List
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              bgcolor: "#F4F8D3",
            }}
          >
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ListItem key={activity.activityId} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText
                    primary={`Activity Name: ${activity.activityName}`}
                    secondary={`Activity: ${activity.gameType}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography color="black">No activities available.</Typography>
            )}
          </List>
        </Paper>

        <Paper
          sx={{
            p: 2,
            mt: 3,
            textAlign: "center",
            bgcolor: "#F4F8D3",
            color: "black",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
          }}
        >
          <Typography variant="h5">Subscription: Basic Tier</Typography>
        </Paper>

        <Paper sx={{ p: 3, mt: 4, bgcolor: "#F4F8D3", color: "black", width: "97.5%" }}>
          <Typography variant="h6" fontWeight="bold">
            Stories Available ({stories.length})
          </Typography>
          <List
            sx={{
              maxHeight: 150,
              overflowY: "auto",
              bgcolor: "#F4F8D3",
            }}
          >
              {stories.map((story, index) => (
            <ListItem
              key={story.storyId || index} 
              sx={{
                borderBottom: "1px solid #ddd",
                mb: 2,
                color:"black",
                width: "100%",
                bgcolor: story.completed ? "#d1e7dd" : "#f8d7da",
              }}
            >
              <ListItemText primary={story.title} secondary={story.storyText} />
              {story.youtubeVideoId && (
                <Button
                  variant="text"
                  onClick={() => {
                    window.open(story.youtubeVideoId, "_blank");
                    handleWatchVideo(story.storyId);
                  }}
                  sx={{ ml: 2 }}
                >
                  Watch Video
                </Button>
              )}
            </ListItem>
          ))}
          </List>
        </Paper>
      </Box>
    </SidebarLayout>
  );
};

export default HomePage;
