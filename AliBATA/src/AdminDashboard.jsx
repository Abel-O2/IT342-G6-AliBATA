import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/alibata/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
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
      </Box>
    </SidebarLayout>
  );
};

export default AdminDashboard;