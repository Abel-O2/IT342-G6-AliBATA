import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Static pani"); // Placeholder until login system is added
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
          <Typography variant="h5" fontWeight="bold">Contact Us</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
           Tel: 1234-159 <strong></strong>
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
              <Typography variant="h6" fontWeight="bold">App/Software Gmail</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "#bbb" }}>
                AliBATA@gmail.com
              </Typography>
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
              <Typography variant="h6" fontWeight="bold">Dev's Gmail</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px" }}>
                sample.com
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Payment;
