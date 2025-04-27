import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "../SidebarLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function WordTranslation() {
  const [word, setWord] = useState(""); // State for the word to be posted
  const [correctAnswer, setCorrectAnswer] = useState(""); // State for the correct answer
  const [message, setMessage] = useState(""); // State for success or error messages
  const [wordsList, setWordsList] = useState([]); // State for the list of words
  const navigate = useNavigate();

  // Fetch the list of words from the backend
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/alibata/questions"); 
      } catch (err) {
        console.error("Failed to fetch words:", err.response?.data || err.message);
      }
    };

    fetchWords();
  }, []);

  const handleSubmit = async () => {
    if (!word || !correctAnswer) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      // Post the new word to the backend
      const response = await axios.post("http://localhost:8080/api/alibata/questions", {
        word,
        correctAnswer,
      });
      setMessage("Activity successfully created!");
      setWordsList((prevList) => [...prevList, response.data]); // Add the new word to the list
      setWord(""); // Clear the fields
      setCorrectAnswer("");
    } catch (err) {
      console.error("Failed to create activity:", err.response?.data || err.message);
      setMessage("Failed to create activity. Please try again.");
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
          Word Translation Activity
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <TextField
            label="Word to Post"
            variant="outlined"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            fullWidth
            sx={{
              bgcolor: "#424242",
              input: { color: "white" },
              label: { color: "#BDBDBD" },
            }}
          />
          <TextField
            label="Correct Answer"
            variant="outlined"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
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

        {/* List of Words */}
        <Box mt={4}>
          <Typography variant="h6" color="white" mb={2}>
            List of Created Words
          </Typography>
          <Paper sx={{ bgcolor: "#1F1F1F", p: 2, color: "white" }}>
            <List>
              {wordsList.map((item, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText
                    primary={`Word: ${item.word}`}
                    secondary={`Correct Answer: ${item.correctAnswer}`}
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

export default WordTranslation;
