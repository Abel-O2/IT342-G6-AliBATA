import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Login = () => {
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Navigation Hook

  const handleLogin = (e) => {
    e.preventDefault();

    /*if (!schoolId || !password) {
      alert("Please enter your School ID and Password.");
      return;
    }*/

    console.log("Logging in...", { schoolId, password });

    navigate("/home");
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        minWidth: "50vh",
        bgcolor: "#1E1E1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 3,
          bgcolor: "#2E2E2E",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#D1FAE5",
            padding: 3,
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "50px" }}>👋🏾</Typography>
        </Box>

        <Typography variant="h5" color="white" sx={{ mt: 2, fontWeight: "bold" }}>
          Log In
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            label="School ID"
            variant="filled"
            fullWidth
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            sx={{
              bgcolor: "#424242",
              borderRadius: 1,
              input: { color: "white" },
              label: { color: "#BDBDBD" },
              mb: 2,
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              bgcolor: "#424242",
              borderRadius: 1,
              input: { color: "white" },
              label: { color: "#BDBDBD" },
              mb: 2,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Log In
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="#BDBDBD"
          sx={{ mt: 2, cursor: "pointer", ":hover": { color: "white" } }}
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign up
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
