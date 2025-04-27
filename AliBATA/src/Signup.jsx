import { Box, TextField, Button, Typography, Paper, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TermsNConditions from "./TermsNConditions";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscriptionStatus: false,
  });

  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox

  const API = axios.create({
    baseURL: "http://localhost:8080/api/alibata/auth",
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    const userData = {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };

    try {
      const response = await API.post("/register", userData);
      console.log("User registered:", response);
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Signup failed. Please try again.");
      }
      console.error("Signup failed:", err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update the checkbox state
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
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
          width: "80%",
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "50%", padding: 4, bgcolor: "#2E2E2E" }}>
          <Typography variant="h5" color="white" sx={{ fontWeight: "bold" }}>
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 3 }}>
            <TextField
              label="First Name"
              name="firstName"
              variant="filled"
              fullWidth
              required
              value={user.firstName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />
            <TextField
              label="Middle Name"
              name="middleName"
              variant="filled"
              fullWidth
              required
              value={user.middleName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              variant="filled"
              fullWidth
              required
              value={user.lastName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="filled"
              fullWidth
              required
              value={user.email}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="filled"
              fullWidth
              required
              value={user.password}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="filled"
              fullWidth
              required
              value={user.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#16c95b", input: { color: "white" } }}
            />

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Checkbox for Terms & Conditions */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  sx={{ color: "white", "&.Mui-checked": { color: "#10B981" } }}
                />
              }
              label="I agree to the Terms & Conditions"
              sx={{ color: "white", mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isChecked} // Disable button if checkbox is not checked
              sx={{ bgcolor: isChecked ? "green" : "gray", color: "white", mb: 2, ":hover": { bgcolor: isChecked ? "darkgreen" : "gray" } }}
            >
              Sign Up
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ color: "white", borderColor: "white", ":hover": { bgcolor: "#424242" } }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "50%", padding: 4, bgcolor: "#1A1A1A", overflowY: "auto", maxHeight: "900px" }}>
          <TermsNConditions />
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;
