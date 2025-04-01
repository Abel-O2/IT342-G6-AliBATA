package edu.cit.alibata.Entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    private String name;
    private String email;
    private String gender;
    private String password;
    private boolean isAdmin = false;
    private boolean subscriptionStatus = false;

    @OneToMany(mappedBy = "user")
    private List<ScoreEntity> scores;

    @ManyToMany
    @JoinTable(
        name = "user_stories",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "story_id")
    )
    private List<StoryEntity> stories;

    @ManyToMany
    @JoinTable(
        name = "user_activities",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private List<ActivityEntity> activities;

    public UserEntity(){
        super();
    }

    public UserEntity(String name, String email, String password, String gender) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
    }

    public UserEntity(String name, String email, String password, String gender, boolean isAdmin, boolean subscriptionStatus) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.isAdmin = isAdmin;
        this.subscriptionStatus = subscriptionStatus;
    }

    public int getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public boolean getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public void setSubscriptionStatus(boolean subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public List<ScoreEntity> getScores() {
        return scores;
    }
    
    public void setScores(List<ScoreEntity> scores) {
        this.scores = scores;
    }
    
    public List<StoryEntity> getStories() {
        return stories;
    }
    
    public void setStories(List<StoryEntity> stories) {
        this.stories = stories;
    }
    
    public List<ActivityEntity> getActivities() {
        return activities;
    }
    
    public void setActivities(List<ActivityEntity> activities) {
        this.activities = activities;
    }
    
}
