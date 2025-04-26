import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../SidebarLayout";
import axios from "axios";

function OnePicFourWords() {
  const [image, setImage] = useState(null);
  const [choices, setChoices] = useState([]);
  const [inputChoice, setInputChoice] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const addChoice = () => {
    if (inputChoice && !choices.includes(inputChoice)) {
      setChoices([...choices, inputChoice]);
      setInputChoice("");
    } else {
      setMessage("Choice is either empty or already added.");
    }
  };

  const removeChoice = (choice) => {
    setChoices(choices.filter((c) => c !== choice));
  };

  const handleSubmit = async () => {
    if (!image || !correctAnswer || !gameType || choices.length < 2) {
      setMessage("Please complete all fields and add at least 2 choices.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    let imageUrl;
    try {
      const res = await axios.post("/api/upload", formData); // Replace with your backend endpoint
      imageUrl = res.data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      setMessage("Failed to upload image. Please try again.");
      return;
    }

    const questionPayload = {
      image: imageUrl,
      correctAnswer,
      choices,
      gameType,
      questionText,
    };

    try {
      await axios.post("/api/games/1/questions", questionPayload); // Replace `1` with dynamic game ID
      setMessage("Question saved successfully!");
      setImage(null);
      setChoices([]);
      setCorrectAnswer("");
      setGameType("");
      setQuestionText("");
    } catch (err) {
      console.error("Error saving question:", err);
      setMessage("Failed to save question. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        {/* Back Link */}
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
          Create New Game Question
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}>
          {/* Image Upload */}
          <Typography color="white">Select Image:</Typography>
          <Button variant="contained" component="label" sx={{ bgcolor: "#3B82F6", ":hover": { bgcolor: "#2563EB" } }}>
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {image && <Typography color="white">Selected File: {image.name}</Typography>}

          {/* Correct Answer */}
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

          {/* Add Choices */}
          <TextField
            label="Add Choice"
            variant="outlined"
            value={inputChoice}
            onChange={(e) => setInputChoice(e.target.value)}
            fullWidth
            sx={{
              bgcolor: "#424242",
              input: { color: "white" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            variant="contained"
            onClick={addChoice}
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Add Choice
          </Button>

          {/* Choices List */}
          <Paper sx={{ bgcolor: "#1F1F1F", p: 2, color: "white" }}>
            <Typography variant="h6" color="white" mb={2}>
              Choices
            </Typography>
            <List>
              {choices.map((choice, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText primary={choice} />
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => removeChoice(choice)}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#3B82F6",
              ":hover": { bgcolor: "#2563EB" },
            }}
          >
            Save Question
          </Button>

          {/* Message */}
          {message && (
            <Typography color="white" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </SidebarLayout>
  );
}

export default OnePicFourWords;
