import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (token) => {
    try {
      const usersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
      setError("Failed to fetch users. Please try again later.");
    }
  }, []);

  useEffect(() => {
    const fetchUserAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/users/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userDetails = userResponse.data;
        console.log("Fetched user details:", userDetails);

        if (userDetails.role !== "ADMIN") {
          navigate("/home");
          return;
        }

        fetchUsers(token);
      } catch (err) {
        console.error("Failed to fetch users or user details:", err.response?.data || err.message);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUserAndUsers();
  }, [navigate, fetchUsers]);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.userId !== userId)); // Update the state to remove the deleted user
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ flexGrow: 1, bgcolor: "#A6D6D6", p: 4, overflowY: "auto", maxHeight: "90vh", minHeight: "60vh" }}>
        <Typography variant="h5" fontWeight="bold" color="black" mb={3}>
          Admin Dashboard
        </Typography>

        <Box>
          <Typography variant="h6" color="black" mb={2}>
            List of Users
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Paper sx={{ bgcolor: "#F4F8D3", p: 2, color: "black" }}>
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <List>
                {users.map((user, index) => (
                  <ListItem key={index} sx={{ borderBottom: "1px solid #444", }}>
                    <ListItemText
                      primary={`${index + 1}. ${user.firstName}`}
                      secondary={`Role: ${user.role}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => handleDelete(user.userId)}>
                        <DeleteIcon />
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
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#20DFA6" } }}
            onClick={() => navigate("/activity")}
          >
            Create an Activity
          </Button>
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#10B981", ":hover": { bgcolor: "#20DFA6" } }}
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