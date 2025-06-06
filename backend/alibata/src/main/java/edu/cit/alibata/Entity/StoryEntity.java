package edu.cit.alibata.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class StoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="story_id")
    private int storyId;

    private String title;
    @Column(name = "story_text", columnDefinition = "TEXT")
    private String storyText;

    private String youTubeVideoId;
    private boolean isCompleted; 

    @ManyToMany(mappedBy = "stories")
    //@JsonManagedReference
    @JsonIgnore
    private List<UserEntity> users;

    public StoryEntity() {
        super();
    }

    public StoryEntity(String title, String storyText, String youtubeVideoId, boolean isCompleted) {
        this.title = title;
        this.storyText = storyText;
        this.youTubeVideoId = youtubeVideoId;
        this.isCompleted = isCompleted;
    }

    public int getStoryId() {
        return storyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStoryText() {
        return storyText;
    }

    public void setStoryText(String storyText) {
        this.storyText = storyText;
    }

    public String getYoutubeVideoId() {
        return youTubeVideoId;
    }

    public void setYoutubeVideoId(String youtubeVideoId) {
        this.youTubeVideoId = youtubeVideoId;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public List<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(List<UserEntity> users) {
        this.users = users;
    }

}
