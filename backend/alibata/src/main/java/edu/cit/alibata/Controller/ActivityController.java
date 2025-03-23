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

@RestController
@RequestMapping("api/alibata/activity")
public class ActivityController {

    @Autowired
    ActivityService activityServ;

    // Create
    @PostMapping("/postActivityEntity")
    public ActivityEntity postActivityEntity(@RequestBody ActivityEntity activity) {
        return activityServ.postActivityEntity(activity);
    }

    // Read All Activities
    @GetMapping("/getAllActivityEntity")
    public List<ActivityEntity> getAllActivityEntity() {
        return activityServ.getAllActivityEntity();
    }

    // Read Single Activity
    @GetMapping("/getActivityEntity")
    public ActivityEntity getActivityEntity(@RequestParam int id) {
        return activityServ.getActivityEntity(id);
    }

    // Update
    @PutMapping("/putActivityEntity")
    public ActivityEntity putActivityEntity(@RequestParam int id, @RequestBody ActivityEntity newActivity) {
        return activityServ.putActivityEntity(id, newActivity);
    }

    // Delete
    @DeleteMapping("/deleteActivityEntity/{id}")
    public String deleteActivityEntity(@PathVariable int id) {
        return activityServ.deleteActivityEntity(id);
    }
}
