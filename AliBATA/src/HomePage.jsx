import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "./SidebarLayout"; // Import the SidebarLayout component
import diamondImage from "./assets/diamond.png";

const HomePage = () => {
  return (
    <SidebarLayout>
      <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 3 }}>
        Progress Dashboard
      </Typography>
      <hr />
      <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" color="white">Points: </Typography>
        <img src={diamondImage} alt="Diamond" width="50" />
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
    </SidebarLayout>
  );
};

export default HomePage;