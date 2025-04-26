package edu.cit.alibata.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.StoryEntity;
import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Repository.StoryRepository;
import edu.cit.alibata.Repository.UserRepository;
import edu.cit.alibata.config.YouTubeService;
import edu.cit.alibata.dto.StoryDetailsDto;
import edu.cit.alibata.dto.YouTubeVideoDto;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepo;

    @Autowired
    private YouTubeService youTubeService;

    @Autowired
    private UserRepository userRepo;

    // Create and assign new StoryEntity to users
    public StoryEntity postStoryEntity(StoryEntity story) {
        StoryEntity savedStory = storyRepo.save(story);
        
        List<UserEntity> allUsers = userRepo.findAll();
        for (UserEntity user : allUsers) {
            user.getStories().add(savedStory);
            userRepo.save(user);
        }

        return savedStory;
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
    public List<StoryEntity> getAllStoriesForUser(int userId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return user.getStories();
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
    @SuppressWarnings("unused")
    public String deleteStoryEntity(int storyId) {
        if (storyRepo.findById(storyId) != null) {
            storyRepo.deleteById(storyId);
            return "Story " + storyId + " deleted successfully!";
        } else {
            return "Story " + storyId + " not found!";
        }
    }

    // Mark a story as completed for a specific user
    public void markStoryAsCompleted(int userId, int storyId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        StoryEntity story = storyRepo.findById(storyId)
            .orElseThrow(() -> new EntityNotFoundException("Story not found with ID: " + storyId));
        if (!user.getStories().contains(story)) {
            throw new IllegalStateException("Story is not assigned to the user");
        }
        story.setCompleted(true);
        storyRepo.save(story);
    }
}

