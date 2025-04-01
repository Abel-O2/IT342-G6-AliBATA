package edu.cit.alibata.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.alibata.Entity.StoryEntity;
import edu.cit.alibata.Service.StoryService;

@RestController
@RequestMapping("api/alibata/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    // Create a new StoryEntity
    @PostMapping("")
    public StoryEntity postStoryEntity(@RequestBody StoryEntity story) {
        return storyService.postStoryEntity(story);
    }

    // Retrieve all StoryEntities
    @GetMapping("")
    public List<StoryEntity> getAllStoryEntity() {
        return storyService.getAllStoryEntity();
    }

    // Retrieve a single StoryEntity by id
    @GetMapping("/{id}")
    public StoryEntity getStoryEntity(@PathVariable int id) {
        return storyService.getStoryEntity(id);
    }

    // Update an existing StoryEntity
    @PutMapping("")
    public StoryEntity putStoryEntity(@RequestParam int id, @RequestBody StoryEntity newStory) {
        return storyService.putStoryEntity(id, newStory);
    }

    // Delete a StoryEntity by id
    @DeleteMapping("/{id}")
    public String deleteStoryEntity(@PathVariable int id) {
        return storyService.deleteStoryEntity(id);
    }
}

