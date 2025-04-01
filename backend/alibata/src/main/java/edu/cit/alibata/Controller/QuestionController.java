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

import edu.cit.alibata.Entity.QuestionEntity;
import edu.cit.alibata.Service.QuestionService;

@RestController
@RequestMapping("api/alibata/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // Create
    @PostMapping("")
    public QuestionEntity postQuestionEntity(@RequestBody QuestionEntity question) {
        return questionService.postQuestionEntity(question);
    }

    // Read All Questions
    @GetMapping("")
    public List<QuestionEntity> getAllQuestionEntity() {
        return questionService.getAllQuestionEntity();
    }

    // Read Single Question
    @GetMapping("/{id}")
    public QuestionEntity getQuestionEntity(@PathVariable int id) {
        return questionService.getQuestionEntity(id);
    }

    // Update
    @PutMapping("")
    public QuestionEntity putQuestionEntity(@RequestParam int id, @RequestBody QuestionEntity newQuestion) {
        return questionService.putQuestionEntity(id, newQuestion);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteQuestionEntity(@PathVariable int id) {
        return questionService.deleteQuestionEntity(id);
    }
}
