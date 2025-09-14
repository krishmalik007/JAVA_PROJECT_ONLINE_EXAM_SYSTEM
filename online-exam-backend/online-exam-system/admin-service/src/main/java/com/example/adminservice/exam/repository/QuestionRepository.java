package com.example.adminservice.exam.repository;

import com.example.adminservice.exam.model.Exam;
import com.example.adminservice.exam.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // This method is crucial for finding questions by a specific exam
    List<Question> findByExam(Exam exam);
}