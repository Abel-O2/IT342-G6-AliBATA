package edu.cit.alibata.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.alibata.Entity.ActivityEntity;
import edu.cit.alibata.Service.ActivityService;
import edu.cit.alibata.model.ErrorResponse;
import edu.cit.alibata.model.UserActivityProjection;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/alibata/activities")
@Tag(name = "Activity")
public class ActivityController {

    @Autowired
    ActivityService activityServ;

    // Create and assign to users
    @PostMapping("")
    @Operation(
        summary = "Create a new activity",
        description = "Creates a new activity and assigns it to all users",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Activity data to create (without ID)",
            content = @Content(schema = @Schema(implementation = ActivityEntity.class))
        ),
        responses = {
            @ApiResponse(responseCode = "201", description = "Activity created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<ActivityEntity> postActivityEntity(@RequestBody ActivityEntity activity) {
        ActivityEntity postActivity = activityServ.postActivityEntity(activity);
        return ResponseEntity.status(201).body(postActivity);
    }

    // Read All Activities
    @GetMapping("")
    @Operation(
        summary = "Get all activities",
        description = "Retrieves a list of all activities",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<List<ActivityEntity>> getAllActivityEntity() {
        List<ActivityEntity> activities = activityServ.getAllActivityEntity();
        return ResponseEntity.ok().body(activities);
    }

    // Read Single Activity
    @GetMapping("/{id}")
    @Operation(
        summary = "Get an activity by ID",
        description = "Retrieves a specific activity by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Activity not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<ActivityEntity> getActivityEntity(@PathVariable int id) {
        ActivityEntity activity = activityServ.getActivityEntity(id);
        return ResponseEntity.ok().body(activity);
    }

    // Read all activities for user
    @GetMapping("/users/{userId}")
    @Operation(
        summary = "Get all activities for a user",
        description = "Retrieves all activities assigned to a specific user by their ID",
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
    public ResponseEntity<List<UserActivityProjection>> getAllActivitiesForUser(@PathVariable int userId) {
        List<UserActivityProjection> userActivities = activityServ.getAllActivitiesForUser(userId);
        return ResponseEntity.ok().body(userActivities);
    }

    // Update
    @PutMapping("/{id}")
    @Operation(
        summary = "Update an activity",
        description = "Updates an existing activity by its ID",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Updated activity data",
            content = @Content(schema = @Schema(implementation = ActivityEntity.class))
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Activity updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "404", description = "Activity not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<ActivityEntity> putActivityEntity(@PathVariable int id, @RequestBody ActivityEntity newActivity) {
        ActivityEntity putActivity = activityServ.putActivityEntity(id, newActivity);
        return ResponseEntity.ok().body(putActivity);
    }

    // Delete
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete an activity",
        description = "Deletes an activity by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Activity deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Activity not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<String> deleteActivityEntity(@PathVariable int id) {
        String result = activityServ.deleteActivityEntity(id);
        return ResponseEntity.ok().body(result);
    }

    // Mark Activity as Completed
    @PutMapping("/{id}/completed/{userId}")
    @Operation(
        summary = "Mark an activity as completed",
        description = "Marks an activity as completed for a specific user",
        responses = {
            @ApiResponse(responseCode = "200", description = "Activity marked as completed"),
            @ApiResponse(responseCode = "404", description = "Activity or user not found",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
        }
    )
    public ResponseEntity<Void> markActivityAsCompleted(@PathVariable int id, @PathVariable int userId) {
        activityServ.markActivityAsCompleted(userId, id);
        return ResponseEntity.ok().build();
    }
}
