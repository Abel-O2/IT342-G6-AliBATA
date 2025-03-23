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

import edu.cit.alibata.Entity.ChoiceEntity;
import edu.cit.alibata.Service.ChoiceService;

@RestController
@RequestMapping("api/alibata/choice")
public class ChoiceController {

    @Autowired
    private ChoiceService choiceService;

    // Create
    @PostMapping("/postChoiceEntity")
    public ChoiceEntity postChoiceEntity(@RequestBody ChoiceEntity choice) {
        return choiceService.postChoiceEntity(choice);
    }

    // Read All Choices
    @GetMapping("/getAllChoiceEntity")
    public List<ChoiceEntity> getAllChoiceEntity() {
        return choiceService.getAllChoiceEntity();
    }

    // Read Single Choice
    @GetMapping("/getChoiceEntity")
    public ChoiceEntity getChoiceEntity(@RequestParam int id) {
        return choiceService.getChoiceEntity(id);
    }

    // Update
    @PutMapping("/putChoiceEntity")
    public ChoiceEntity putChoiceEntity(@RequestParam int id, @RequestBody ChoiceEntity newChoice) {
        return choiceService.putChoiceEntity(id, newChoice);
    }

    // Delete
    @DeleteMapping("/deleteChoiceEntity/{id}")
    public String deleteChoiceEntity(@PathVariable int id) {
        return choiceService.deleteChoiceEntity(id);
    }
}

