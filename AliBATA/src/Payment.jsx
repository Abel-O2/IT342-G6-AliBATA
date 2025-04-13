import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component
import { useState } from "react";

const Payment = () => {
  const [currentPlan, setCurrentPlan] = useState("Basic");

  return (
    <SidebarLayout>
      <Box sx={{ flex: 1, padding: 3 }}>
        {/* Subscriptions Header */}
        <Paper sx={{ bgcolor: "#222", p: 3, mb: 4, color: "white", textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">Subscriptions</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Current Tier: <strong>{currentPlan}</strong>
          </Typography>
        </Paper>

        {/* Subscription Plans */}
        <Grid container spacing={4} justifyContent="center">
          {/* Basic Tier */}
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

          {/* Premium Tier */}
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
                onClick={() => setCurrentPlan("Premium")}
              >
                Upgrade Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SidebarLayout>
  );
};

export default Payment;
