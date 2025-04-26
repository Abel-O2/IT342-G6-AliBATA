package edu.cit.alibata.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.UserStory;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Integer> {
    Optional<UserStory> findByUser_UserIdAndStory_StoryId(int userId, int storyId);
    List<UserStory> findByUser_UserId(int userId);
}
