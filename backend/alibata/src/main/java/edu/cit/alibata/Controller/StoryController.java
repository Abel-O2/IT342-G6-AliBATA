package edu.cit.alibata.Controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.alibata.Entity.StoryEntity;
import edu.cit.alibata.Service.StoryService;
import edu.cit.alibata.dto.StoryDetailsDto;
import edu.cit.alibata.model.ErrorResponse;
import edu.cit.alibata.model.UserStoryProjection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/alibata/stories")
@Tag(name = "Story")
public class StoryController {

    @Autowired
    private StoryService storyService;

    // Create a new StoryEntity
    @PostMapping("")
    @Operation(
        summary = "Create a new story",
        description = "Creates a new story and assigns it to all users",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Story data to create (without ID)",
            content = @Content(schema = @Schema(implementation = StoryEntity.class))
        ),
        responses = {
            @ApiResponse(responseCode = "201", description = "Story created successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<StoryEntity> postStoryEntity(@RequestBody StoryEntity story) {
        StoryEntity postStory = storyService.postStoryEntity(story);
        return ResponseEntity.status(201).body(postStory);
    }

    // Retrieve all StoryEntities
    @GetMapping("")
    @Operation(
        summary = "Get all stories",
        description = "Retrieves a list of all stories",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<List<StoryEntity>> getAllStoryEntity() {
        List<StoryEntity> stories = storyService.getAllStoryEntity();
        return ResponseEntity.ok().body(stories);
    }

    // Read all stories for user
    @GetMapping("/users/{userId}")
    @Operation(
        summary = "Get all stories for a user",
        description = "Retrieves all stories assigned to a specific user",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "User not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    @PreAuthorize("#userId == principal.userId or hasAuthority('admin:read')")
    public ResponseEntity<List<UserStoryProjection>> getAllStoriesForUser(@PathVariable int userId) {
        List<UserStoryProjection> userStories = storyService.getAllStoriesForUser(userId);
        return ResponseEntity.ok().body(userStories);
    }

    // Read a single StoryEntity by id with YouTube video details
    @GetMapping("/{id}")
    @Operation(
        summary = "Get a story by ID",
        description = "Retrieves a specific story by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Story not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<StoryDetailsDto> getStoryDetails(@PathVariable int id) throws GeneralSecurityException, IOException {
        StoryDetailsDto story = storyService.getStoryDetails(id);
        return ResponseEntity.ok().body(story);
    }

    // Update
    @PutMapping("/{id}")
    @Operation(
        summary = "Update a story",
        description = "Updates an existing story by its ID",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Story data to update (with ID)",
            content = @Content(schema = @Schema(implementation = StoryEntity.class))
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Story updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "404", description = "Story not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    @PreAuthorize("hasAuthority('admin:update')")
    public ResponseEntity<StoryEntity> putStoryEntity(@PathVariable int id, @RequestBody StoryEntity newStory) {
        StoryEntity putStory = storyService.putStoryEntity(id, newStory);
        return ResponseEntity.ok().body(putStory);
    }

    // Delete a StoryEntity by id
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete a story",
        description = "Deletes a story by its ID along with all associated user stories",
        responses = {
            @ApiResponse(responseCode = "200", description = "Story deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Story not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<String> deleteStoryEntity(@PathVariable int id) {
        String result = storyService.deleteStoryEntity(id);
        return ResponseEntity.ok().body(result);
    }

    // Mark Story as Completed
    @PutMapping("/{id}/completed/{userId}")
    @Operation(
        summary = "Mark a story as completed",
        description = "Marks a story as completed for a specific user",
        responses = {
            @ApiResponse(responseCode = "200", description = "Story marked as completed"),
            @ApiResponse(responseCode = "404", description = "Story or user not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    @PreAuthorize("#userId == principal.userId or hasAuthority('admin:update')")
    public ResponseEntity<Void> markStoryAsCompleted(@PathVariable int id, @PathVariable int userId) {
        storyService.markStoryAsCompleted(userId, id);
        return ResponseEntity.ok().build();
    }
}

