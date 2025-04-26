package edu.cit.alibata.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.ScoreEntity;

@Repository
public interface ScoreRepository extends JpaRepository<ScoreEntity, Integer> {
    
}
