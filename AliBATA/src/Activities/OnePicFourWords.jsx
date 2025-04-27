import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../SidebarLayout";
import axios from "axios";

function OnePicFourWords() {
  const [image, setImage] = useState(null); // State for the uploaded image
  const [choices, setChoices] = useState([]); // State for the list of choices
  const [inputChoice, setInputChoice] = useState(""); // State for the current choice input
  const [correctAnswer, setCorrectAnswer] = useState(""); // State for the correct answer
  const [questions, setQuestions] = useState([]); // State for the list of questions
  const [message, setMessage] = useState(""); // State for success or error messages
  const [isImageSubmitted, setIsImageSubmitted] = useState(false); // Track if the image is submitted
  const [questionId, setQuestionId] = useState(null); // State for the current questionId
  const { activityId } = useParams(); // Get activityId from the route
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch questions for the activity
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`https://alibata.duckdns.org/api/alibata/questions/activities/${activityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
          },
        });
        setQuestions(response.data); // Store the questions in state
      } catch (err) {
        console.error("Failed to fetch questions:", err.response?.data || err.message);
        setMessage("Failed to fetch questions. Please try again.");
      }
    };

    fetchQuestions();
  }, [activityId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setMessage("File size exceeds the 10MB limit. Please upload a smaller file.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitImage = async () => {
    if (!image) {
      setMessage("Please upload an image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You are not logged in. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      // Create a FormData object to send as multipart/form-data
      const formData = new FormData();
      formData.append("questionDescription", "null"); // Set questionDescription to null
      formData.append("questionText", "null"); // Set questionText to null
      formData.append("image", image); // Add the image file

      // Post the image to the backend
      const response = await axios.post(
        `https://alibata.duckdns.org/api/alibata/questions/activities/${activityId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token
            "Content-Type": "multipart/form-data", // Set the correct Content-Type
          },
        }
      );

      setMessage("Image successfully submitted!");
      setIsImageSubmitted(true);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]); // Add the new question to the list
      setQuestionId(response.data.questionId); // Set the questionId from the backend response
    } catch (err) {
      console.error("Failed to submit image:", err.response?.data || err.message);
      setMessage(`Failed to submit image: ${err.response?.data?.message || err.message}`);
    }
  };

  const addChoice = () => {
    if (!inputChoice) {
      setMessage("Choice cannot be empty.");
      return;
    }

    setChoices([...choices, inputChoice]); // Add the choice to the local state
    setInputChoice("");
    setMessage("Choice added successfully.");
  };

  const removeChoice = (choice) => {
    setChoices(choices.filter((c) => c !== choice));
    setMessage("Choice removed successfully.");
  };

  const handleSubmit = async () => {
    if (!correctAnswer || choices.length < 3) {
      setMessage("Please fill in all fields and add at least 3 choices.");
      return;
    }

    if (!choices.includes(correctAnswer)) {
      setMessage("The correct answer must be one of the choices.");
      return;
    }

    try {
      if (!questionId) {
        setMessage("No question ID found. Please submit an image first.");
        return;
      }

      let score = 0;

      for (const choice of choices) {
        const isCorrect = choice === correctAnswer;

        // Add the choice to the backend
        await axios.post(
          `https://alibata.duckdns.org/api/alibata/choices/questions/${questionId}`,
          {
            choiceText: choice,
            correct: isCorrect, // true for the correct answer, false for others
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
            },
          }
        );

        // Increment score if the choice is correct
        if (isCorrect) {
          score++;
        }
      }

      // Set the score for the question
      await axios.post(
        `https://alibata.duckdns.org/api/alibata/scores/questions/${questionId}`,
        null,
        {
          params: { scoreValue: score },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
          },
        }
      );

      setMessage("Choices and score successfully added to the question!");

      // Reset the form fields
      setCorrectAnswer("");
      setChoices([]);
      setImage(null);
      setImagePreview(null);
      setIsImageSubmitted(false);
      setQuestionId(null); // Reset questionId for the next entry
    } catch (err) {
      console.error("Failed to add choices or score:", err.response?.data || err.message);
      setMessage("Failed to add choices or score. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Typography
        onClick={() => navigate("/activity")}
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
        1 Picture 4 Words Activity
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
        {/* Image Upload */}
        <Typography color="white">Upload Image:</Typography>
        <Button variant="contained" component="label" sx={{ bgcolor: "#3B82F6", ":hover": { bgcolor: "#2563EB" } }}>
          Upload Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        {image && <Typography color="white">Selected File: {image.name}</Typography>}
        {imagePreview && (
          <Box mt={2}>
            <Typography color="white">Image Preview:</Typography>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginTop: "10px" }}
            />
          </Box>
        )}
        <Button
          variant="contained"
          onClick={submitImage}
          sx={{
            bgcolor: "#10B981",
            ":hover": { bgcolor: "#059669" },
          }}
        >
          Submit Image
        </Button>

        {/* Correct Answer Input */}
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

        {/* Add Choice Input */}
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
          disabled={!isImageSubmitted} // Disable if the image is not submitted
          sx={{
            bgcolor: isImageSubmitted ? "#10B981" : "#9CA3AF", // Change color if disabled
            ":hover": isImageSubmitted ? { bgcolor: "#059669" } : {},
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
      </Box>

      {/* Submit Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#3B82F6",
            ":hover": { bgcolor: "#2563EB" },
          }}
        >
          Save Choices
        </Button>
      </Box>

      {/* Message */}
      {message && (
        <Typography color="white" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}

      {/* List of Questions */}
      <Box mt={4}>
        <Typography variant="h6" color="white" mb={2}>
          List of Questions
        </Typography>
        <Paper sx={{ bgcolor: "#1F1F1F", p: 2, color: "white" }}>
          <List>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Display the question image */}
                    {question.questionImage && (
                      <img
                        src={imagePreview}
                        alt={`Question ${index + 1}`}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                          marginBottom: "10px",
                        }}
                      />
                    )}
                    {/* Display the correct answer */}
                    {/*<Typography color="white" variant="body1">
                      <strong>Correct Answer:</strong> {question.setCorrectAnswer}
                    </Typography>*/}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography color="white">No questions available.</Typography>
            )}
          </List>
        </Paper>
      </Box>
    </SidebarLayout>
  );
}

export default OnePicFourWords;
