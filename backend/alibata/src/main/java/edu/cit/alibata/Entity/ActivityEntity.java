package edu.cit.alibata.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ActivityEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private int activityId;

    private String activityName;
    private boolean isCompleted;

    @Enumerated(EnumType.STRING)
    private GameType gameType;

    public enum GameType {
        // input game type unya
    }

    public ActivityEntity(){
        super();
    }

    public ActivityEntity(int activityId, String activityName, boolean isCompleted, GameType gameType) {
        this.activityId = activityId;
        this.activityName = activityName;
        this.isCompleted = isCompleted;
        this.gameType = gameType;
    }

    public int getActivityId() {
        return activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public GameType getGameType() {
        return gameType;
    }

    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }

}
