package edu.cit.alibata.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ChoiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "choice_id")
    private int choiceId;

    private String choiceText;
    private boolean isCorrect;

    public ChoiceEntity() {
        super();
    }

    public ChoiceEntity(int choiceId, String choiceText, boolean isCorrect) {
        this.choiceId = choiceId;
        this.choiceText = choiceText;
        this.isCorrect = isCorrect;
    }

    public int getChoiceId() {
        return choiceId;
    }

    public String getChoiceText() {
        return choiceText;
    }

    public void setChoiceText(String choiceText) {
        this.choiceText = choiceText;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
   
}
