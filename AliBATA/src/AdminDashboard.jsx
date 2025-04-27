import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      // Check if the user is an admin or has userId === 1
      if (decoded.userId !== 1 && decoded.role !== "ADMIN") {
        navigate("/home"); // Redirect to home if the user is not an admin
        return;
      }

      // Fetch users from the backend
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/alibata/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("API Response:", response.data);
          setUsers(response.data);
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
    } catch (err) {
      console.error("Failed to decode token:", err);
      navigate("/login"); // Redirect to login if token decoding fails
    }
  }, [navigate]);

  const handleCreateActivity = (activityType) => {
    navigate(`/create-activity/${activityType}`);
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
                    primary={`User #${index + 1}: ${user.firstName}`}
                    secondary={`Role: ${user.userId === 1 ? "ADMIN" : "USER"}`}
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