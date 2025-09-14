package com.example.userservice.exam.repository;

import com.example.userservice.exam.model.Exam;
import com.example.userservice.exam.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExam(Exam exam);
}