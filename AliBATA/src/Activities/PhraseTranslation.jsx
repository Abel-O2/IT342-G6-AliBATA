import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import SidebarLayout from "../SidebarLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PhraseTranslation() {
  const [phrase, setPhrase] = useState(""); // State for the phrase to be posted
  const [correctTranslation, setCorrectTranslation] = useState(""); // State for the correct translation
  const [inputChoice, setInputChoice] = useState(""); // State for the manually added choice
  const [choices, setChoices] = useState([]); // State for the list of choices
  const [questions, setQuestions] = useState([]); // State for the list of questions
  const [message, setMessage] = useState(""); // State for success or error messages
  const [isPhraseSubmitted, setIsPhraseSubmitted] = useState(false); // Track if the phrase is submitted
  const [questionId, setQuestionId] = useState(null); // State for the current questionId
  const { activityId } = useParams(); // Get activityId from the route
  const navigate = useNavigate();

  // Fetch questions for the activity
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/alibata/questions/activities/${activityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setQuestions(response.data); 
      } catch (err) {
        console.error("Failed to fetch questions:", err.response?.data || err.message);
        setMessage("Failed to fetch questions. Please try again.");
      }
    };

    fetchQuestions();
  }, [activityId]);

  const submitPhrase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You are not logged in. Please log in again.");
      navigate("/login");
      return;
    }

    if (!phrase) {
      setMessage("Please enter a phrase to post.");
      return;
    }

    try {
      // Create a FormData object to send as multipart/form-data
      const formData = new FormData();
      formData.append("questionDescription", phrase); // Add the phrase as questionDescription
      formData.append("questionText", null); // Explicitly set to null
      formData.append("image", null); // Add null for the image (or attach a file if needed)

      // Post the phrase to the backend
      const response = await axios.post(
        `http://localhost:8080/api/alibata/questions/activities/${activityId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token
            "Content-Type": "multipart/form-data", // Set the correct Content-Type
          },
        }
      );

      console.log("Backend response:", response.data); // Log the backend response

      setMessage("Phrase successfully submitted!");
      setIsPhraseSubmitted(true);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]); // Add the new question to the list

      // Set the questionId from the backend response
      if (response.data.questionId) {
        setQuestionId(response.data.questionId); // Use response.data.questionId
      } else {
        console.error("No questionId found in the response.");
        setMessage("Failed to retrieve question ID. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit phrase:", err.response?.data || err.message);
      setMessage("Failed to submit phrase. Please try again.");
    }
  };

  const generateChoicesFromPhrase = () => {
    if (!correctTranslation) {
      setMessage("Please enter the correct translation.");
      return;
    }

    // Split the correct translation into words and shuffle them
    const words = correctTranslation.split(" ");
    const shuffledWords = words.sort(() => Math.random() - 0.5);

    setChoices(shuffledWords); // Set the shuffled words as choices
    setMessage("Choices generated from the correct translation.");
  };

  const addManualChoice = () => {
    if (!inputChoice) {
      setMessage("Choice cannot be empty.");
      return;
    }

    setChoices([...choices, inputChoice]); // Add the manually entered choice to the list
    setInputChoice(""); // Clear the input field
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
          `http://localhost:8080/api/alibata/choices/questions/${questionId}`,
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
        `http://localhost:8080/api/alibata/scores/questions/${questionId}`,
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
      setCorrectTranslation("");
      setChoices([]);
      setPhrase("");
      setIsPhraseSubmitted(false);
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
          Phrase Translation Activity
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          {/* Phrase Input */}
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
          <Button
            variant="contained"
            onClick={submitPhrase}
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#059669" },
            }}
          >
            Submit Phrase
          </Button>

          {/* Correct Translation Input */}
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
            onClick={generateChoicesFromPhrase}
            disabled={!isPhraseSubmitted} // Disable if the phrase is not submitted
            sx={{
              bgcolor: isPhraseSubmitted ? "#10B981" : "#9CA3AF", // Change color if disabled
              ":hover": isPhraseSubmitted ? { bgcolor: "#059669" } : {},
            }}
          >
            Generate Choices
          </Button>

          {/* Manual Choice Input */}
          <TextField
            label="Add Manual Choice"
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
            onClick={addManualChoice}
            disabled={!isPhraseSubmitted} // Disable if the phrase is not submitted
            sx={{
              bgcolor: isPhraseSubmitted ? "#10B981" : "#9CA3AF", // Change color if disabled
              ":hover": isPhraseSubmitted ? { bgcolor: "#059669" } : {},
            }}
          >
            Add Manual Choice
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
                      primary={`Phrase: ${question.questionDescription || "N/A"}`}
                      /*secondary={`Correct Answer: ${question.correctTranslation || "N/A"}`}*/
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

export default PhraseTranslation;
