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

import edu.cit.alibata.Entity.ActivityEntity;
import edu.cit.alibata.Service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/alibata/activities")
@Tag(name = "Activity")
public class ActivityController {

    @Autowired
    ActivityService activityServ;

    /*@Operation(
        description = "Get endpoint for activity",
        responses = {
            @ApiResponse(
                description = "Success",
                responseCode = "200"
            ),
            @ApiResponse(
                description = "Unauthorized",
                responseCode = "403"
            )
        }
    )*/

    // Create
    @PostMapping("")
    public ActivityEntity postActivityEntity(@RequestBody ActivityEntity activity) {
        return activityServ.postActivityEntity(activity);
    }

    // Read All Activities
    @GetMapping("")
    public List<ActivityEntity> getAllActivityEntity() {
        return activityServ.getAllActivityEntity();
    }

    // Read Single Activity
    @GetMapping("/{id}")
    public ActivityEntity getActivityEntity(@PathVariable int id) {
        return activityServ.getActivityEntity(id);
    }

    // Update
    @PutMapping("")
    public ActivityEntity putActivityEntity(@RequestParam int id, @RequestBody ActivityEntity newActivity) {
        return activityServ.putActivityEntity(id, newActivity);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteActivityEntity(@PathVariable int id) {
        return activityServ.deleteActivityEntity(id);
    }
}
