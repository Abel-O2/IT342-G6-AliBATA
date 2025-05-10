package edu.cit.alibata.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.StoryEntity;
import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Entity.UserStory;
import edu.cit.alibata.Repository.StoryRepository;
import edu.cit.alibata.Repository.UserRepository;
import edu.cit.alibata.Repository.UserStoryRepository;
import edu.cit.alibata.config.YouTubeService;
import edu.cit.alibata.dto.StoryDetailsDto;
import edu.cit.alibata.dto.YouTubeVideoDto;
import edu.cit.alibata.model.UserStoryProjection;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepo;

    @Autowired
    private YouTubeService youTubeService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserStoryRepository userStoryRepo;

    // Create and assign new StoryEntity to users
    public StoryEntity postStoryEntity(StoryEntity story) {
        StoryEntity postStory = storyRepo.save(story);
        
        List<UserEntity> allUsers = userRepo.findAll();
        for (UserEntity user : allUsers) {
            UserStory userStory = new UserStory(user, postStory);
            userStoryRepo.save(userStory);        
        }

        return postStory;
    }

    // Read all StoryEntities
    public List<StoryEntity> getAllStoryEntity() {
        return storyRepo.findAll();
    }

    // Read a single StoryEntity by id
    /*public StoryEntity getStoryEntity(int storyId) {
        return storyRepo.findById(storyId).get();
    }*/

    // Read all stories for user
    @SuppressWarnings("unused")
    public List<UserStoryProjection> getAllStoriesForUser(int userId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return userStoryRepo.findByUser_UserId(userId);
    }

    // Read a single StoryEntity by id with YouTube video details
    public StoryDetailsDto getStoryDetails(int storyId) throws GeneralSecurityException, IOException {
        StoryEntity story = storyRepo.findById(storyId).get();
        if (story == null) {
            throw new EntityNotFoundException("Story " + storyId + " not found!");
        }
        YouTubeVideoDto youtubeVideoDetails = null;
        if (story.getYoutubeVideoId() != null && !story.getYoutubeVideoId().trim().isEmpty()) {
            youtubeVideoDetails = youTubeService.getVideo(story.getYoutubeVideoId());
            if (youtubeVideoDetails == null) {
                throw new EntityNotFoundException("YouTube video "+ story.getYoutubeVideoId() +"not found!" );
            }
        }
        return new StoryDetailsDto(story, youtubeVideoDetails);
    }

    // Update an existing StoryEntity
    public StoryEntity putStoryEntity(int storyId, StoryEntity newStory) {
        try {
        StoryEntity story = storyRepo.findById(storyId).get();
        story.setTitle(newStory.getTitle());
        story.setStoryText(newStory.getStoryText());
        story.setYoutubeVideoId(newStory.getYoutubeVideoId());
        story.setCompleted(newStory.isCompleted());
        return storyRepo.save(story);
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Story " + storyId + " not found!");
        }
    }

    // Delete a StoryEntity by id
    public String deleteStoryEntity(int storyId) {
        if (storyRepo.existsById(storyId)) {
            List<UserStory> userStories = userStoryRepo.findByStory_StoryId(storyId);
            userStoryRepo.deleteAll(userStories);
    
            storyRepo.deleteById(storyId);
            return "Story " + storyId + " and its associations deleted successfully!";
        } else {
            throw new EntityNotFoundException("Story " + storyId + " not found!");
        }
    }

    // Mark a story as completed for a specific user
    public void markStoryAsCompleted(int userId, int storyId) {
        UserStory userStory = userStoryRepo.findByUser_UserIdAndStory_StoryId(userId, storyId)
            .orElseThrow(() -> new EntityNotFoundException("Story is not assigned to the user"));
        userStory.setCompleted(true);
        userStoryRepo.save(userStory);
    }
}

