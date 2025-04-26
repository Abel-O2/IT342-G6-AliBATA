package edu.cit.alibata.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.alibata.Entity.StoryEntity;

@Repository
public interface StoryRepository extends JpaRepository<StoryEntity, Integer>{

}
