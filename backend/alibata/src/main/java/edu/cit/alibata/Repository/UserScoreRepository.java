package edu.cit.alibata.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.UserScore;
import edu.cit.alibata.model.UserScoreProjection;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, Integer> {
    Optional<UserScore> findByUser_UserIdAndQuestion_QuestionId(int userId, int questionId);
    List<UserScoreProjection> findByUser_UserId(int userId);
}
