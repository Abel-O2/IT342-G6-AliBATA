package edu.cit.alibata.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.ActivityEntity;
import edu.cit.alibata.Entity.UserActivity;
import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Repository.ActivityRepository;
import edu.cit.alibata.Repository.UserActivityRepository;
import edu.cit.alibata.Repository.UserRepository;
import edu.cit.alibata.model.UserActivityProjection;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ActivityService {
    
    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserActivityRepository userActivityRepo;

    // Create and assign to users
    public ActivityEntity postActivityEntity(ActivityEntity activity) {
        ActivityEntity postActivity = activityRepo.save(activity);
        
        List<UserEntity> allUsers = userRepo.findAll();
        for (UserEntity user : allUsers) {
            UserActivity userActivity = new UserActivity(user, postActivity);
            userActivityRepo.save(userActivity);
        }

        return postActivity;
    }

    // Read All Activities
    public List<ActivityEntity> getAllActivityEntity() {
        return activityRepo.findAll();
    }

    // Read Single Activity
    public ActivityEntity getActivityEntity(int activityId) {
        return activityRepo.findById(activityId).get();
    }

    // Read all activities for user
    @SuppressWarnings("unused")
    public List<UserActivityProjection> getAllActivitiesForUser(int userId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return userActivityRepo.findByUser_UserId(userId);
    }

    // Update
    public ActivityEntity putActivityEntity(int activityId, ActivityEntity newActivity) {
        try {
            ActivityEntity activity = activityRepo.findById(activityId).get();
            activity.setActivityName(newActivity.getActivityName());
            activity.setCompleted(newActivity.isCompleted());
            activity.setGameType(newActivity.getGameType());
            if (newActivity.getQuestions() != null) {
                activity.setQuestions(newActivity.getQuestions());
            }
            if (newActivity.getUsers() != null) {
                activity.setUsers(newActivity.getUsers());
            }
            return activityRepo.save(activity);
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Activity " + activityId + " not found!");
        }
    }

    // Delete
    public String deleteActivityEntity(int activityId) {
        if (activityRepo.existsById(activityId)) {
            activityRepo.deleteById(activityId);
            return "Activity " + activityId + " deleted successfully!";
        } else {
            return "Activity " + activityId + " not found!";
        }
    }

    // Mark Activity as Completed
    public void markActivityAsCompleted(int userId, int activityId) {
        UserActivity userActivity = userActivityRepo.findByUser_UserIdAndActivity_ActivityId(userId, activityId)
            .orElseThrow(() -> new EntityNotFoundException("Activity not assigned to user"));
        userActivity.setCompleted(true);
        userActivityRepo.save(userActivity);
    }
}

