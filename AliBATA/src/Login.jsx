import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./App.css";
import {jwtDecode} from "jwt-decode";
import alibataLogo from "./assets/alibata.jpg";

export default function Login() {
  const [error, setError] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API = axios.create({
    baseURL: 'https://alibata.duckdns.org/api/alibata/auth',
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!schoolId || !password) {
      setError("Please enter your School ID and Password.");
      return;
    }

    try {
      const res = await API.post('/login', { email: schoolId, password });
      console.log("Login successful:", res.data);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Decode the token to get user details
      const decodedToken = jwtDecode(res.data.token);
      console.log("Decoded token:", decodedToken);

      // Fetch user details using the token
      const userResponse = await API.get(`https://alibata.duckdns.org/api/alibata/users/${decodedToken.userId}`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });

      const userDetails = userResponse.data; // Assuming the API returns user details
      console.log("Fetched user details:", userDetails);

      // Redirect based on user role
      if (userDetails.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Invalid School ID or Password.");

      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <Box
      sx={{
        height: "96.8vh",
        minWidth: "50vh",
        bgcolor: "#2DC7D2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 3,
          bgcolor: "#A6D6D6",
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
          <img src={alibataLogo} alt="AliBATA Logo" style={{ height: "50px" }} />
        </Box>

        <Typography variant="h5" color="black" sx={{ mt: 2, fontWeight: "bold" }}>
          Log In
        </Typography>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            sx={{
              bgcolor: "#c8e3e3",
              borderRadius: 1,
              input: { color: "black" },
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
              bgcolor: "#c8e3e3",
              borderRadius: 1,
              input: { color: "black" },
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
              color: "black",
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#20DFA6" },
            }}
          >
            Log In
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="#BDBDBD"
          sx={{ mt: 2, cursor: "pointer", color: "black", ":hover": { color: "black", fontWeight: "bold" } }}
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign up
        </Typography>
      </Paper>
    </Box>
  );
}
