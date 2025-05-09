import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component
import { useState } from "react";
import axios from 'axios';

const Payment = () => {
  const [currentPlan, setCurrentPlan] = useState("Basic");

    const handleUpgrade = async () => {
     const options = {
      method: "POST",
      url: "https://api.paymongo.com/v1/links",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: "Basic c2tfdGVzdF96TnJRa2kzMnNaRWgxRVRQQWRFRWY3czE6",
      },
      data: {
        data: {
          attributes: {
            amount: 29999.99,
            description: "Subscription",
          },
        },
      },
    };

    try {
      const response = await axios.request(options);
      const paymentLink = response?.data?.data?.attributes?.checkout_url;

      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        alert("Payment link not found. Please try again.");
      }
    } catch (error) {
      console.error("Error making payment request:", error);
      alert("Failed to create the payment link. Please try again.");
    }
  };



  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "90vh", minHeight: "60vh", bgcolor: "#A6D6D6", p: 4 }}>
      <Box sx={{ flex: 1, padding: 3 }}>
        <Paper sx={{ bgcolor: "#F4F8D3", p: 3, mb: 4, color: "black", textAlign: "center" }}>
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
                bgcolor: "#F4F8D3",
                textAlign: "center",
                color: "white",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="black">Basic Tier</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "black" }}>
                Access to basic features
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "18px", fontWeight: "bold", color:"black" }}>Free</Typography>
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
                bgcolor: "#F4F8D3",
                textAlign: "center",
                color: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="black">Premium Tier</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "black" }}>
                Full access with exclusive benefits
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "18px", fontWeight: "bold", color:"black" }}>₱299.99 / month</Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  color: "black",
                  bgcolor: "#10B981",
                  ":hover": { bgcolor: "#20DFA6" },
                }}
                onClick={handleUpgrade}
              >
                Upgrade Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </SidebarLayout>
  );
};

export default Payment;