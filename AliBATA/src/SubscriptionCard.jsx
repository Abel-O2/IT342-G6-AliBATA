import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import { useEffect, useState } from "react";

const Subscriptions = () => {
  const [currentPlan, setCurrentPlan] = useState("Basic");
  const [username, setUsername] = useState("Static pani");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "98vw",
        height: "94vh",
        bgcolor: "#121212",
        overflow: "hidden",
      }}
    >

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

export default Subscriptions;
