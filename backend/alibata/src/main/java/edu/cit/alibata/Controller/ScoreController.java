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

import edu.cit.alibata.Entity.ScoreEntity;
import edu.cit.alibata.Service.ScoreService;

@RestController
@RequestMapping("api/alibata/score")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    // Create
    @PostMapping("/postScoreEntity")
    public ScoreEntity postScoreEntity(@RequestBody ScoreEntity score) {
        return scoreService.postScoreEntity(score);
    }

    // Read All Scores
    @GetMapping("/getAllScoreEntity")
    public List<ScoreEntity> getAllScoreEntity() {
        return scoreService.getAllScoreEntity();
    }

    // Read Single Score
    @GetMapping("/getScoreEntity")
    public ScoreEntity getScoreEntity(@RequestParam int id) {
        return scoreService.getScoreEntity(id);
    }

    // Update
    @PutMapping("/putScoreEntity")
    public ScoreEntity putScoreEntity(@RequestParam int id, @RequestBody ScoreEntity newScore) {
        return scoreService.putScoreEntity(id, newScore);
    }

    // Delete
    @DeleteMapping("/deleteScoreEntity/{id}")
    public String deleteScoreEntity(@PathVariable int id) {
        return scoreService.deleteScoreEntity(id);
    }
}
