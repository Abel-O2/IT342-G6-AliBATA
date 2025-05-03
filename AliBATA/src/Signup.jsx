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
    baseURL: "https://alibata.duckdns.org/api/alibata/auth",
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
        height: "91.7vh",
        bgcolor: "#2DC7D2",
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
        <Box sx={{ width: "50%", padding: 4, bgcolor: "#A6D6D6" }}>
          <Typography variant="h5" color="black" sx={{ fontWeight: "bold" }}>
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
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
            />
            <TextField
              label="Middle Name"
              name="middleName"
              variant="filled"
              fullWidth
              required
              value={user.middleName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              variant="filled"
              fullWidth
              required
              value={user.lastName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
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
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
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
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
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
              sx={{ mb: 2, bgcolor: "#c8e3e3", input: { color: "black" } }}
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
                  sx={{ color: "black", "&.Mui-checked": { color: "#F4F8D3" } }}
                />
              }
              label="I agree to the Terms & Conditions"
              sx={{ color: "black", mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isChecked} // Disable button if checkbox is not checked
              sx={{ bgcolor: isChecked ? "#10B981" : "gray", color: "black", mb: 2, ":hover": { bgcolor: isChecked ? "#20DFA6" : "gray" } }}
            >
              Sign Up
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ color: "black", borderColor: "black", ":hover": { bgcolor: "#20DFA6" } }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "50%", padding: 4, bgcolor: "#A6D6D6", overflowY: "auto", maxHeight: "900px" }}>
          <TermsNConditions />
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;
