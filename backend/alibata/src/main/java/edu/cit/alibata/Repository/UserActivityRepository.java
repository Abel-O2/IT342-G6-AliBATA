package edu.cit.alibata.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.UserActivity;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Integer>{
    Optional<UserActivity> findByUserIdAndActivityId(int userId, int activityId);
    List<UserActivity> findByUserId(int userId);
}
