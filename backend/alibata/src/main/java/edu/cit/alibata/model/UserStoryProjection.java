package edu.cit.alibata.model;

public interface UserStoryProjection {
    int getStory_StoryId();
    String getStory_Title();
    boolean isCompleted();
}
