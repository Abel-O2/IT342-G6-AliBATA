import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Sample"); // Placeholder until login system is added
  const [currentPlan, setCurrentPlan] = useState("Basic");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
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
          <hr />
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
              //{ text: "⚙️ Settings", action: () => console.log("Go to Settings") },
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
      <Box sx={{ flex: 1, padding: 3 }}>
        <Paper sx={{ bgcolor: "#222", p: 3, mb: 4, color: "white", textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">Subscriptions</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Current Tier: <strong>{currentPlan}</strong>
          </Typography>
        </Paper>
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Paper
              sx={{
                width: "280px",
                p: 4,
                bgcolor: "#1E1E1E",
                textAlign: "center",
                color: "white",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">Basic Tier</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "#bbb" }}>
                Access to basic features
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "18px", fontWeight: "bold" }}>Free</Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "#333",
                  ":hover": { bgcolor: "#444" },
                }}
                disabled
              >
                Current Plan
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              sx={{
                width: "280px",
                p: 4,
                bgcolor: "#10B981",
                textAlign: "center",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">Premium Tier</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px" }}>
                Full access with exclusive benefits
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "18px", fontWeight: "bold" }}>₱599.99 / month</Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "white",
                  color: "#10B981",
                  ":hover": { bgcolor: "#f1f1f1" },
                }}
              >
                Upgrade Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Payment;
