import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "../SidebarLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function WordTranslation() {
  const [word, setWord] = useState(""); // State for the word to be posted
  const [correctTranslation, setCorrectTranslation] = useState(""); // State for the correct answer
  const [inputChoice, setInputChoice] = useState(""); // State for the current choice input
  const [choices, setChoices] = useState([]); // State for the list of choices
  const [questions, setQuestions] = useState([]); // State for the list of questions
  const [message, setMessage] = useState(""); // State for success or error messages
  const [isWordSubmitted, setIsWordSubmitted] = useState(false); // Track if the word is submitted
  const { activityId } = useParams(); // Get activityId from the route
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState(null);

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

  const submitWord = async () => {
    if (!word) {
      setMessage("Please enter a word to post.");
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
      formData.append("questionText", word); // Add the word as questionText
      formData.append("questionDescription", ""); // Add an empty description (or set a value if needed)
      formData.append("image", null); // Add null for the image (or attach a file if needed)

      // Post the word to the backend
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

      console.log("Backend response:", response.data); // Log the backend response

      setMessage("Word successfully submitted!");
      setIsWordSubmitted(true);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]); // Add the new question to the list

      // Set the questionId from the backend response
      if (response.data.questionId) {
        setQuestionId(response.data.questionId); // Use response.data.questionId
      } else {
        console.error("No questionId found in the response.");
        setMessage("Failed to retrieve question ID. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit word:", err.response?.data || err.message);
      setMessage("Failed to submit word. Please try again.");
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
    if (!correctTranslation || choices.length < 3) {
      setMessage("Please fill in all fields and ensure at least 3 choices are generated.");
      return;
    }

    try {
      if (!questionId) {
        setMessage("No question ID found. Please submit a phrase first.");
        return;
      }

      let score = 0;

      for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        const isGeneratedChoice = correctTranslation.split(" ").includes(choice);

        // Add the choice to the backend
        await axios.post(
          `https://alibata.duckdns.org/api/alibata/choices/questions/${questionId}`,
          {
            choiceText: choice,
            choiceOrder: isGeneratedChoice ? i + 1 : null, // Add choiceOrder for generated choices, null for manual choices
            correct: isGeneratedChoice, // true for generated choices, false for manual choices
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
            },
          }
        );

        // Increment score if the choice is correct
        if (isGeneratedChoice) {
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
      setCorrectTranslation("");
      setChoices([]);
      setWord("");
      setIsWordSubmitted(false);
      setQuestionId(null);
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
          Word Translation Activity
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          {/* Word Input */}
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
          <Button
            variant="contained"
            onClick={submitWord}
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Submit Word
          </Button>

          {/* Correct Answer Input */}
          <TextField
            label="Correct Answer"
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
            disabled={!isWordSubmitted} // Disable if the word is not submitted
            sx={{
              bgcolor: isWordSubmitted ? "#10B981" : "#9CA3AF", // Change color if disabled
              ":hover": isWordSubmitted ? { bgcolor: "#059669" } : {},
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
                    <ListItemText
                      primary={`Word: ${question.questionText || "N/A"}`}
                      /* secondary={
                        question.choices && question.choices.length > 0
                          ? `Choices: ${question.choices.map((choice) => choice.choiceText).join(", ")}`
                          : "No choices available"
                      }*/
                    />
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

export default WordTranslation;
