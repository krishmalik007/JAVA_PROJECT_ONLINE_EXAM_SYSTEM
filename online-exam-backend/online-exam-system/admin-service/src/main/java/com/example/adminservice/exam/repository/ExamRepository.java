package com.example.adminservice.exam.repository;

import com.example.adminservice.exam.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
}