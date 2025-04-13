import { Grid, Toolbar, Box, Typography, Button, Paper, List, ListItem, ListItemText, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import EditUserModal from "./EditDetails"; 

const drawerWidth = 240;

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(!localStorage.getItem("username"));
  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [username, setUsername] = useState(localStorage.getItem("username") || ""); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        const user = decoded?.user || {};
        if (!localStorage.getItem("username")) {
          const firstName = user.firstName || "Enter your name";
          setUsername(firstName);
          localStorage.setItem("username", firstName);
        } else {
          
          setUsername(localStorage.getItem("username"));
        }

        setUserData({
          firstName: user.firstName || "",
          middleName: user.middleName || "",
          lastName: user.lastName || "",
        });
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
        width: "98vw",
        height: "94vh",
        bgcolor: "#121212",
        marginLeft: "-44vh",
        overflow: "hidden",
        overflowX: "Auto",
      }}
    >
      <Box
        sx={{
          width: "15vw",
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
              { text: "🏠 Home", action: () => navigate("/home") },
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
      <Grid item sx={{ flex: 1, ml: `${drawerWidth}px`, p: 2 }}>
        {children}
      </Grid>
      <Modal open={isNamePopupOpen} onClose={() => setIsNamePopupOpen(false)}>
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
      </Modal>

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
