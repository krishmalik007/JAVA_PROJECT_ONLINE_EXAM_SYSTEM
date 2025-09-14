package com.example.userservice.exam.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Text is mandatory")
    private String text;

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;

    // Add the 'answer' field here to allow for scoring
    @NotBlank(message = "Answer is mandatory")
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }
}