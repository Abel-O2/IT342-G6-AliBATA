import { Box, Typography, Paper, Grid } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component

const ContactUs = () => {
  return (
    <SidebarLayout>
      <Box sx={{ flex: 1, padding: 3 }}>
        {/* Contact Us Header */}
        <Paper sx={{ bgcolor: "#222", p: 3, mb: 4, color: "white", textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">Contact Us</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Tel: 1234-159
          </Typography>
        </Paper>

        {/* Contact Information */}
        <Grid container spacing={4} justifyContent="center">
          {/* App/Software Gmail */}
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

          {/* Developer's Gmail */}
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
    </SidebarLayout>
  );
};

export default ContactUs;
