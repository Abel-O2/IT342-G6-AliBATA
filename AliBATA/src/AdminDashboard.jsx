import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get("http://localhost:8080/api/alibata/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setUsers(response.data); // Update the users state with the fetched data
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You do not have permission to view this data.");
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
        console.error("Failed to fetch users:", err.response?.data || err.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle activity creation
  const handleCreateActivity = (activityType) => {
    navigate(`/create-activity/${activityType}`); // Navigate to the activity creation page
  };

  return (
    <SidebarLayout>
      <Box sx={{ flexGrow: 1, bgcolor: "#2B2B2B", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          Admin Dashboard
        </Typography>

        {/* List of Users */}
        <Box>
          <Typography variant="h6" color="white" mb={2}>
            List of Users
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Paper sx={{ bgcolor: "#1F1F1F", p: 2, color: "white" }}>
            <List>
              {users.map((user, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText
                    primary={`Name: ${user.name}`}
                    secondary={`Role: ${user.role}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Create Activity Section */}
        <Box mt={4}>
          <Typography variant="h6" color="white" mb={2}>
            Create Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#059669" } }}
                onClick={() => handleCreateActivity("OnePicFourWords")}
              >
                1 Pic 4 Words
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: "#3B82F6", ":hover": { bgcolor: "#2563EB" } }}
                onClick={() => handleCreateActivity("WordTranslation")}
              >
                Word Translation
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: "#F59E0B", ":hover": { bgcolor: "#D97706" } }}
                onClick={() => handleCreateActivity("PhraseTranslation")}
              >
                Phrase Translation
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SidebarLayout>
  );
};

export default AdminDashboard;