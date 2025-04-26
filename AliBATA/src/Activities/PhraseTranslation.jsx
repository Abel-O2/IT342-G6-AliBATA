import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "../SidebarLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PhraseTranslation() {
  const [phrase, setPhrase] = useState(""); // State for the phrase to be posted
  const [correctTranslation, setCorrectTranslation] = useState(""); // State for the correct translation
  const [message, setMessage] = useState(""); // State for success or error messages
  const [phrasesList, setPhrasesList] = useState([]); // State for the list of phrases
  const navigate = useNavigate();
  // Fetch the list of phrases from the backend
  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/alibata/phrases"); // Replace with your backend endpoint
        setPhrasesList(response.data); // Update the phrases list state
      } catch (err) {
        console.error("Failed to fetch phrases:", err.response?.data || err.message);
      }
    };

    fetchPhrases();
  }, []);

  const handleSubmit = async () => {
    if (!phrase || !correctTranslation) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      // Post the new phrase to the backend
      const response = await axios.post("http://localhost:8080/api/alibata/phrases", {
        phrase,
        correctTranslation,
      });
      setMessage("Phrase successfully created!");
      setPhrasesList((prevList) => [...prevList, response.data]); // Add the new phrase to the list
      setPhrase(""); // Clear the fields
      setCorrectTranslation("");
    } catch (err) {
      console.error("Failed to create phrase:", err.response?.data || err.message);
      setMessage("Failed to create phrase. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <Typography
          onClick={() => navigate("/admin")}
          sx={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
            mb: 2,
          }}
        >
          Back
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          Phrase Translation Activity
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <TextField
            label="Phrase to Post"
            variant="outlined"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            fullWidth
            sx={{
              bgcolor: "#424242",
              input: { color: "white" },
              label: { color: "#BDBDBD" },
            }}
          />
          <TextField
            label="Correct Translation"
            variant="outlined"
            value={correctTranslation}
            onChange={(e) => setCorrectTranslation(e.target.value)}
            fullWidth
            sx={{
              bgcolor: "#424242",
              input: { color: "white" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Submit
          </Button>
          {message && (
            <Typography color="white" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>

        {/* List of Phrases */}
        <Box mt={4}>
          <Typography variant="h6" color="white" mb={2}>
            List of Created Phrases
          </Typography>
          <Paper sx={{ bgcolor: "#1F1F1F", p: 2, color: "white" }}>
            <List>
              {phrasesList.map((item, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText
                    primary={`Phrase: ${item.phrase}`}
                    secondary={`Correct Translation: ${item.correctTranslation}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </SidebarLayout>
  );
}

export default PhraseTranslation;
