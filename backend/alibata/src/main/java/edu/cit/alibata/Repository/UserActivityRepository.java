package edu.cit.alibata.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.UserActivity;
import edu.cit.alibata.model.UserActivityProjection;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Integer>{
    Optional<UserActivity> findByUser_UserIdAndActivity_ActivityId(int userId, int activityId);
    List<UserActivityProjection> findByUser_UserId(int userId);
    List<UserActivity> findByActivity_ActivityId(int activityId);
}
