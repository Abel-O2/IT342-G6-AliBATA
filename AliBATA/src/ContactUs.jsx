import { Box, Typography, Paper, Grid } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component

const ContactUs = () => {
  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "90vh", minHeight: "60vh", bgcolor: "#A6D6D6", p: 4 }}>
      <Box sx={{ flex: 1, padding: 3 }}>
        <Paper sx={{ bgcolor: "#F4F8D3", p: 3, mb: 4, color: "black", textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">Contact Us</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Tel: 1234-159
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
                color: "black",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
                height: "110px",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="black">App/Software Gmail</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "black" }}>
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
                bgcolor: "#F4F8D3",
                textAlign: "center",
                color: "black",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(255,255,255,0.5)",
                height: "110px",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="black">Dev's Gmail</Typography>
              <Typography sx={{ mt: 2, fontSize: "14px", color: "black" }}>
                vernon.lastimado@cit.edu<br/>
                samuel.abrenica@cit.edu<br/>
                hanzhervey.baliguat@cit.edu
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </SidebarLayout>
  );
};

export default ContactUs;
