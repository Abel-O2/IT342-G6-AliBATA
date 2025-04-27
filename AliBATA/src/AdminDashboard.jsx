import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Decode the token to get user details
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

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

        // Fetch the list of users (only for admins)
        const usersResponse = await axios.get("https://alibata.duckdns.org/api/alibata/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Failed to fetch users or user details:", err.response?.data || err.message);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUserAndUsers();
  }, [navigate]);

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
                    secondary={`Role: ${user.role}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Create Activity Button */}
        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#059669" } }}
            onClick={() => navigate("/activity")}
          >
            Create an Activity
          </Button>
        </Box>

        {/* Create Story Button */}
        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#059669" } }}
            onClick={() => navigate("/story")}
          >
            Create a Story
          </Button>
        </Box>
      </Box>
    </SidebarLayout>
  );
};

export default AdminDashboard;