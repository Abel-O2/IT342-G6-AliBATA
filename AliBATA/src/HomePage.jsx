import { Box, Typography, Button, Paper, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Static pani"); // Placeholder until login system is added

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/"); 
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
          <hr/>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Edit Details
          </Button>

          <List sx={{ mt: 4 }}>
            {[
              { text: "🏠 Home", action: () => navigate("/home") },
              { text: "⚙️ Settings", action: () => console.log("Go to Settings") },
              { text: "💳 Subscriptions", action: () => navigate("/payment") },
              { text: "📞 Contact Us", action: () => console.log("Go to Contact Us") },
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

      <Box sx={{ flex: 1, padding: 3,}}>
        <Typography variant="h4" fontWeight="bold" color="white">
          Progress Dashboard
        </Typography>
        <hr/>
        <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" color="white">{username}</Typography>
          <img src="/diamond.png" alt="Diamond" width="50" />
          <Typography variant="h5" color="white">240</Typography>
        </Box>

        <Paper
          sx={{
            p: 3,
            mt: 3,
            bgcolor: "#333",
            textAlign: "center",
            color: "white",
            width: "97.5%",
          }}
        >
          <Typography variant="h6">Activities Completed</Typography>
          <Typography variant="h3" fontWeight="bold">25</Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            mt: 3,
            textAlign: "center",
            bgcolor: "#444",
            color: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
          }}
        >
          <Typography variant="h5">Rank Silver</Typography>
        </Paper>

        <Paper sx={{ p: 3, mt: 4, bgcolor: "#222", color: "white", width: "97.5%" }}>
          <Typography variant="h6" fontWeight="bold">Stories Your Child Finished Reading</Typography>
          <List>
            {[
              "📖 Ang Kataposang Sugilanon ni Borges",
              "📖 Ang Kalibotan Gawas sa Kalibotan",
              "📖 Ang Batang Unggoy",
              "📖 Lumba sa Balyena",
              "📖 Ang Mapahitas-on nga Mariposa",
            ].map((story, index) => (
              <ListItem key={index}>
                <ListItemText primary={story} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
