import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import SidebarLayout from "../SidebarLayout";
import { useNavigate } from "react-router-dom";

const Story = () => {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [storyId, setStoryId] = useState(null); // Add storyId state
  const navigate = useNavigate();

  // Decode token, check role, and fetch stories
  useEffect(() => {
    const fetchUserAndStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Decode the token to get user details
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId); // Extract userId from the token

        // Fetch user details using the token
        const userResponse = await axios.get(`https://alibata.duckdns.org/api/alibata/users/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userDetails = userResponse.data;
        console.log("Fetched user details:", userDetails);

        // Redirect non-admin users
        if (userDetails.role !== "ADMIN") {
          navigate("/home");
          return;
        }

        // Fetch stories
        const storiesResponse = await axios.get("https://alibata.duckdns.org/api/alibata/stories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", storiesResponse.data);
        setStories(storiesResponse.data);

        if (storiesResponse.data.length > 0) {
          setStoryId(storiesResponse.data[0].storyId); 
        }
      } catch (err) {
        console.error("Failed to fetch user or stories:", err.response?.data || err.message);
        setMessage("Failed to fetch user or stories. Please try again.");
      }
    };

    fetchUserAndStories();
  }, [navigate]);

  // Handle story creation
  const handleCreateStory = async () => {
    if (!title || !storyText || !youtubeVideoId) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://alibata.duckdns.org/api/alibata/stories",
        { title, storyText, youtubeVideoId, completed: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStories((prevStories) => [...prevStories, response.data]);
      setMessage("Story created successfully!");
      setTitle("");
      setStoryText("");
      setYoutubeVideoId("");

      // Update storyId with the newly created story
      setStoryId(response.data.id);
    } catch (err) {
      console.error("Failed to create story:", err.response?.data || err.message);
      setMessage("Failed to create story. Please try again.");
    }
  };

  // Handle watching a video
  const handleWatchVideo = async (id) => {
    if (!userId) {
      setMessage("User ID not found. Please try again.");
      return;
    }

    // Find the story details by the provided id
    const story = stories.find((s) => s.storyId === id);
    if (!story) {
      setMessage("Story not found. Please try again.");
      return;
    }

    try {
      console.log("User ID:", userId);
      console.log("Story ID:", id);
      console.log("Story Details:", story);

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
          },
        }
      );

      setStories((prevStories) =>
        prevStories.map((s) =>
          s.storyId === id ? { ...s, completed: true } : s
        )
      );
      setMessage("Story has been marked as completed!");
    } catch (err) {
      console.error("Failed to mark story as completed:", err.response?.data || err.message);
      setMessage("Failed to mark story as completed. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
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
        <Typography variant="h4" mb={3} color="black" fontWeight="bold">
          Stories
        </Typography>

        {/* Create Story */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: "#F4F8D3", input: { color: "white" } }}>
          <Typography variant="h6" mb={2}>
            Create a New Story
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 , input: { color: "black" }}}
          />
          <TextField
            label="Story Text"
            variant="outlined"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2, input: { color: "black" } }}
          />
          <TextField
            label="YouTube Video ID"
            variant="outlined"
            value={youtubeVideoId}
            onChange={(e) => setYoutubeVideoId(e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: "black" } }}
          />
          <Button
            variant="contained"
            onClick={handleCreateStory}
            color="black"
            sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#20DFA6" } }}
          >
            Save Story
          </Button>
        </Paper>

        {/* List Stories */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: "#F4F8D3", color: "black", width: "97.5%" }}>
        <Typography variant="h6" mb={2} color="black" fontWeight="bold">
          All Stories
        </Typography>
        <List 
           sx={{
            maxHeight: 190,
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

        {message && (
          <Typography color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        </Paper>
      </Box>

    </SidebarLayout>
  );
};

export default Story;
