import { Grid, Box, Typography, Button, List, ListItem, ListItemText, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import EditUserModal from "./EditDetails";

const drawerWidth = 240;

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Fetch user details from the backend
        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/alibata/users/${decoded.userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const user = response.data;
            console.log("Fetched user:", user);

            // Set the username and user data, including the role
            setUsername(user.firstName);
            setUserData({
              userId: user.userId,
              firstName: user.firstName,
              middleName: user.middleName || "",
              lastName: user.lastName || "",
              role: user.role, // Include the role property
            });

            // Save the username in localStorage
            localStorage.setItem("username", user.firstName);
          } catch (err) {
            console.error("Failed to fetch user:", err);
          }
        };

        fetchUser();
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSave = (updatedUserData) => {
    setUserData(updatedUserData);
    setUsername(updatedUserData.firstName);
    localStorage.setItem("username", updatedUserData.firstName);
  };

  const handleNameSubmit = () => {
    if (userData.firstName.trim()) {
      setIsNamePopupOpen(false);
      setUsername(userData.firstName);
      localStorage.setItem("username", userData.firstName);
    }
  };

  const handleNameChange = (e) => {
    setUserData({ ...userData, firstName: e.target.value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "193.7vh",
        minWidth: "100vh",
        height: "100vh",
        bgcolor: "#121212",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${drawerWidth}px`,
          bgcolor: "#1E1E1E",
          color: "white",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" mt={2}>
            {username}
          </Typography>
          <hr />
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
            onClick={() => setIsEditOpen(true)}
          >
            Edit Details
          </Button>

          <List sx={{ mt: 4 }}>
            {[
              {
                text: userData.role === "ADMIN" ? "🛠 Admin Dashboard" : "🏠 Home",
                action: userData.role === "ADMIN" ? () => navigate("/admin") : () => navigate("/home"),
              },
              { text: "💳 Subscriptions", action: () => navigate("/payment") },
              { text: "📞 Contact Us", action: () => navigate("/contact") },
              { text: "🚪 Log Out", action: handleLogout },
            ].map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={item.action}
                sx={{ "&:hover": { bgcolor: "#2A2A2A" } }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflowY: "auto", // Allow scrolling for content
          bgcolor: "#121212",
        }}
      >
        {children}
      </Box>
      {/*<Modal open={isNamePopupOpen} onClose={() => setIsNamePopupOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#2E2E2E",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" color="white" sx={{ mb: 2 }}>
            Welcome! Please enter a username:
          </Typography>
          <TextField
            label="Username"
            variant="filled"
            fullWidth
            value={userData.firstName}
            onChange={handleNameChange}
            sx={{
              mb: 2,
              bgcolor: "#424242",
              input: { color: "white" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
            onClick={handleNameSubmit}
          >
            Save
          </Button>
        </Box>
      </Modal>*/}

      <EditUserModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={userData}
        onSave={handleSave}
      />
    </Box>
  );
};

export default SidebarLayout;
