package edu.cit.alibata.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ScoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="score_id")
    private int scoreId;

    private int score;

    public ScoreEntity(){
        super();
    }

    public ScoreEntity(int score, int scoreId) {
        this.score = score;
        this.scoreId = scoreId;
    }

    public int getScoreId() {
        return scoreId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    
}
