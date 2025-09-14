package com.example.adminservice.exam.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotNull(message = "Duration is mandatory")
    private Integer durationMinutes;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;

    private boolean isPublished = false; // New field

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }
}