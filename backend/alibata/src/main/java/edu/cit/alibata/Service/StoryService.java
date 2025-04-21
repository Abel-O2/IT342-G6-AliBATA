package edu.cit.alibata.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.StoryEntity;
import edu.cit.alibata.Repository.StoryRepository;
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

    // Create a new StoryEntity
    public StoryEntity postStoryEntity(StoryEntity story) {
        return storyRepo.save(story);
    }

    // Retrieve all StoryEntities
    public List<StoryEntity> getAllStoryEntity() {
        return storyRepo.findAll();
    }

    // Retrieve a single StoryEntity by id
    public StoryEntity getStoryEntity(int storyId) {
        return storyRepo.findById(storyId).get();
    }

    // Retrieve a single StoryEntity by id with YouTube video details
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
}

