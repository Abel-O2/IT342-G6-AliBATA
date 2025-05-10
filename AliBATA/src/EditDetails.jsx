import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const EditUserModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/alibata/users/${decodedToken.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userDetails = userResponse.data;
        console.log("Fetched user details:", userDetails);

        setFormData({
          firstName: userDetails.firstName || "",
          middleName: userDetails.middleName || "",
          lastName: userDetails.lastName || "",
        });
      } catch (err) {
        console.error("Failed to fetch user details:", err.response?.data || err.message);
        setError("Failed to fetch user details. Please try again later.");
      }
    };

    if (open) {
      fetchUserDetails();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
  
      console.log("Saving user with data:", formData);
  
      // Fetch the existing user details to get the current password, email, and role
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/alibata/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const userDetails = userResponse.data;
      const currentPassword = userDetails.password;
      const currentEmail = userDetails.email;
      const currentRole = userDetails.role;
  
      // Include the current password, email, and role in the request body
      const updatedData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        password: currentPassword,
        email: currentEmail,
        role: currentRole,
      };
  
      // Send a PUT request to update the user details
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/alibata/users/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      onSave(updatedData); // Pass the updatedData to the onSave prop
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err.response?.data || err.message);
      setError("Failed to update user. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Your Details</DialogTitle>
      <DialogContent>
        {error && (
          <Box mb={2}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Firstname"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Middlename"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Lastname"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;