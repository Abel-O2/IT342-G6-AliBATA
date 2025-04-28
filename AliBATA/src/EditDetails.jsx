import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

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
        // Decode the token to get userId
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        // Fetch user details using the userId
        const userResponse = await axios.get(
          `https://alibata.duckdns.org/api/alibata/users/${decodedToken.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userDetails = userResponse.data;
        console.log("Fetched user details:", userDetails);

        // Populate the form with user details
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

  const handleSave = () => {
    onSave(formData);
    onClose();
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
