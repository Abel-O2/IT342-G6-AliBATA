import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TermsNConditions from "./TermsNConditions"; 
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate(); 
  //const nameRef = useRef();
  //const emailRef = useRef();
  //const passwordRef = useRef();
  //const confirmpasswordRef = useRef();
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

  const API = axios.create({
    baseURL: 'http://localhost:8080/api/alibata/users',
    timeout: 100000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
  });

  /*
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };*/

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
    /*
    try {
      const response = await API.post('/createUser', userData);
      console.log("User registered:", response);
      navigate("/login");
    } catch(err){
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Signup failed. Please try again.");
      }
      console.error("Signup failed:", err);
    }*/
    navigate("/login");
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /*
  const handleSignUp = (e) => {
    e.preventDefault();
    
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setError(""); 
    console.log("User Registered:", user);
    navigate("/"); 
  };
  */ 

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
              value={user.firstName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />
            <TextField
              label="Middle Name"
              name="middleName"
              variant="filled"
              fullWidth
              value={user.middleName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              variant="filled"
              fullWidth
              value={user.lastName}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="filled"
              fullWidth
              value={user.email}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="filled"
              fullWidth
              value={user.password}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="filled"
              fullWidth
              value={user.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 2, bgcolor: "#424242", input: { color: "white" } }}
            />

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ bgcolor: "green", color: "white", mb: 2, ":hover": { bgcolor: "darkgreen" } }}
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
        <Box sx={{ width: "50%", padding: 4, bgcolor: "#1A1A1A", overflowY: "auto", maxHeight: "580px" }}>
          <TermsNConditions />
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;
