package edu.cit.alibata.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.QuestionEntity;
import edu.cit.alibata.Entity.ScoreEntity;
import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Repository.QuestionRepository;
import edu.cit.alibata.Repository.ScoreRepository;
import edu.cit.alibata.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private UserRepository userRepo;

    // Create
    /*public ScoreEntity postScoreEntity(ScoreEntity score) {
        return scoreRepo.save(score);
    }*/

    // Create and Add Score to Question
    public ScoreEntity setScoreForQuestion(int questionId, int scoreValue) {
        QuestionEntity question = questionRepo.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + questionId));
        if (question.getScore() != null) {
            throw new IllegalStateException("Score already exists for this question");
        }
        ScoreEntity score = new ScoreEntity();
        score.setScore(scoreValue);
        score.setQuestion(question);
        question.setScore(score);
        return scoreRepo.save(score);
    }

    // Read All Scores
    public List<ScoreEntity> getAllScoreEntity() {
        return scoreRepo.findAll();
    }

    // Read Single Score
    public ScoreEntity getScoreEntity(int scoreId) {
        return scoreRepo.findById(scoreId).get();
    }

    // Update
    public ScoreEntity putScoreEntity(int scoreId, ScoreEntity newScore) {
        try {
        ScoreEntity score = scoreRepo.findById(scoreId).get();
        score.setScore(newScore.getScore());
        if (score.getQuestion() != null) {
            score.getQuestion().setScore(newScore);
        }
        return scoreRepo.save(score);
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Score " + scoreId + " not found!");
        }
    }

    // Update Score for Question
    public ScoreEntity updateScoreForQuestion(int questionId, int newScoreValue) {
        QuestionEntity question = questionRepo.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + questionId));
        ScoreEntity score = question.getScore();
        if (score == null) {
            throw new EntityNotFoundException("No score found for the question with ID: " + questionId);
        }
        score.setScore(newScoreValue);
        return scoreRepo.save(score);
    }

    // Delete
    public String deleteScoreEntity(int scoreId) {
        if (scoreRepo.existsById(scoreId)) {
            scoreRepo.deleteById(scoreId);
            return "Score " + scoreId + " deleted successfully!";
        } else {
            return "Score " + scoreId + " not found!";
        }
    }

    // Give Score to User
    public void awardScoreToUser(int questionId, int userId) {
        QuestionEntity question = questionRepo.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + questionId));
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        ScoreEntity score = question.getScore();
        if (score == null) {
            throw new EntityNotFoundException("No score found for the question with ID: " + questionId);
        }
        ScoreEntity userScore = new ScoreEntity();
        userScore.setScore(score.getScore());
        userScore.setQuestion(question);
        userScore.setUser(user);
        scoreRepo.save(userScore);
    }

    // Total Score for User
    public int getTotalScoreForUser(int userId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return user.getScores().stream()
            .mapToInt(ScoreEntity::getScore)
            .sum();
    }
}

