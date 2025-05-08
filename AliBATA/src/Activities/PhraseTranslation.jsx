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
  const [editingQuestionId, setEditingQuestionId] = useState(null); // Track the question being edited
  const [editedPhrase, setEditedPhrase] = useState(""); // Track the edited phrase
  const [editingChoicesQuestionId, setEditingChoicesQuestionId] = useState(null); // Track the question being edited
  const [editingChoices, setEditingChoices] = useState([]); // Track the choices being edited
  const { activityId } = useParams(); // Get activityId from the route
  const navigate = useNavigate();

  // Fetch questions for the activity
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/questions/activities/${activityId}`, {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/alibata/questions/activities/${activityId}`,
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
          `${import.meta.env.VITE_API_BASE_URL}/api/alibata/choices/questions/${questionId}`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/alibata/scores/questions/${questionId}`,
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

  const editQuestion = async (id, updatedData) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/questions/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Phrase updated successfully!");
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.questionId === id ? { ...q, ...updatedData } : q))
      );
      setEditingQuestionId(null); // Exit editing mode
    } catch (err) {
      console.error("Failed to update phrase:", err.response?.data || err.message);
      setMessage("Failed to update phrase. Please try again.");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Phrase deleted successfully!");
      setQuestions(questions.filter((q) => q.questionId !== id)); // Remove from local state
    } catch (err) {
      console.error("Failed to delete phrase:", err.response?.data || err.message);
      setMessage("Failed to delete phrase. Please try again.");
    }
  };

  const deleteChoice = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/choices/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Choice deleted successfully!");
      setChoices(choices.filter((c) => c.id !== id)); // Remove from local state
    } catch (err) {
      console.error("Failed to delete choice:", err.response?.data || err.message);
      setMessage("Failed to delete choice. Please try again.");
    }
  };

  const startEditing = (id, currentPhrase) => {
    setEditingQuestionId(id);
    setEditedPhrase(currentPhrase);
  };

  const saveEditedPhrase = async (id) => {
    await editQuestion(id, { questionDescription: editedPhrase });
  };

  const startEditingChoices = async (question) => {
    setEditingChoicesQuestionId(question.questionId);
    setEditedPhrase(question.questionDescription);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/choices/questions/${question.questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEditingChoices(response.data);
    } catch (err) {
      console.error("Failed to fetch choices:", err.response?.data || err.message);
      setMessage("Failed to fetch choices. Please try again.");
    }
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...editingChoices];
    newChoices[index].choiceText = value;
    setEditingChoices(newChoices);
  };

  const saveEditedChoices = async (questionId) => {
    try {
      for (const choice of editingChoices) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/alibata/choices/${choice.choiceId}`,
          { choiceText: choice.choiceText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      setMessage("Choices updated successfully!");
      setEditingChoicesQuestionId(null);

      // Refetch questions to update the list
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alibata/questions/activities/${activityId}`, {
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
    } catch (err) {
      console.error("Failed to update choices:", err.response?.data || err.message);
      setMessage("Failed to update choices. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ maxHeight: "85vh", minHeight: "60vh", bgcolor: "#A6D6D6", p: 4, overflowY: "auto" }}>
        <Typography
          onClick={() => navigate("/activity")}
          sx={{
            color: "black",
            cursor: "pointer",
            textDecoration: "underline",
            mb: 2,
          }}
        >
          Back
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="black" mb={3}>
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
              bgcolor: "#c8e3e3",
              input: { color: "black" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            variant="contained"
            onClick={submitPhrase}
            sx={{
              color: "black",
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#20DFA6" },
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
              bgcolor: "#c8e3e3",
              input: { color: "black" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            variant="contained"
            onClick={generateChoicesFromPhrase}
            disabled={!isPhraseSubmitted} // Disable if the phrase is not submitted
            sx={{
              bgcolor: isPhraseSubmitted ? "#10B981" : "#9CA3AF",
              ":hover": isPhraseSubmitted ? { bgcolor: "#20DFA6" } : {},
            }}
          >
            Generate Choices
          </Button>

          <TextField
            label="Add Manual Choice"
            variant="outlined"
            value={inputChoice}
            onChange={(e) => setInputChoice(e.target.value)}
            fullWidth
            sx={{
              bgcolor: "#c8e3e3",
              input: { color: "black" },
              label: { color: "#BDBDBD" },
            }}
          />
          <Button
            variant="contained"
            onClick={addManualChoice}
            disabled={!isPhraseSubmitted} // Disable if the phrase is not submitted
            sx={{
              color: "black",
              bgcolor: isPhraseSubmitted ? "#10B981" : "#9CA3AF", // Change color if disabled
              ":hover": isPhraseSubmitted ? { bgcolor: "#20DFA6" } : {},
            }}
          >
            Add Manual Choice
          </Button>

          {/* Choices List */}
          <Paper sx={{ bgcolor: "#F4F8D3", p: 2, color: "black" }}>
            <Typography variant="h6" color="black" mb={2}>
              Choices
            </Typography>
            <List>
              {choices.map((choice, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                  <ListItemText primary={choice.choiceText || choice} />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteChoice(choice.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#10B981",
              ":hover": { bgcolor: "#20DFA6" },
            }}
          >
            Save Choices
          </Button>
        </Box>

        {message && (
          <Typography color="black" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}

        <Box mt={4}>
          <Typography variant="h6" color="black" mb={2}>
            List of Questions
          </Typography>
          <Paper sx={{ bgcolor: "#F4F8D3", p: 2, color: "black" }}>
            <List>
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {editingQuestionId === question.questionId ? (
                        <TextField
                          variant="outlined"
                          value={editedPhrase}
                          onChange={(e) => setEditedPhrase(e.target.value)}
                          fullWidth
                          sx={{
                            bgcolor: "#424242",
                            input: { color: "white" },
                            label: { color: "#BDBDBD" },
                          }}
                        />
                      ) : (
                        <Typography color="black" variant="body1">
                          <strong>Phrase:</strong> {question.questionDescription || "N/A"}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {editingQuestionId === question.questionId ? (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => saveEditedPhrase(question.questionId)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => setEditingQuestionId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                startEditing(question.questionId, question.questionDescription)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => startEditingChoices(question)}
                            >
                              Edit Choices
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteQuestion(question.questionId)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Typography color="black">No questions available.</Typography>
              )}
            </List>
          </Paper>
        </Box>

        {editingChoicesQuestionId && (
          <Box mt={4}>
            <Typography variant="h6" color="black" mb={2}>
              Edit Choices for Question
            </Typography>
            <Paper sx={{ bgcolor: "#F4F8D3", p: 2, color: "black" }}>
              <List>
                {editingChoices.map((choice, index) => (
                  <ListItem key={index} sx={{ borderBottom: "1px solid #444" }}>
                    <TextField
                      label={`Choice ${index + 1}`}
                      variant="outlined"
                      value={choice.choiceText}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      fullWidth
                      sx={{
                        bgcolor: "#c8e3e3",
                        input: { color: "black" },
                        label: { color: "#BDBDBD" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box mt={2} sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveEditedChoices(editingChoicesQuestionId)}
                >
                  Save Choices
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setEditingChoicesQuestionId(null)}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
}

export default PhraseTranslation;