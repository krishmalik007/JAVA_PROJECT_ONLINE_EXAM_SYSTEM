package com.example.adminservice.exam;

import com.example.adminservice.exam.model.Exam;
import com.example.adminservice.exam.model.Question;
import com.example.adminservice.exam.repository.ExamRepository;
import com.example.adminservice.exam.repository.QuestionRepository;
import com.example.adminservice.user.model.Result;
import com.example.adminservice.user.model.User;
import com.example.adminservice.user.repository.ResultRepository;
import com.example.adminservice.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResultRepository resultRepository;

    @PostMapping("/exams")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        Exam savedExam = examRepository.save(exam);
        return new ResponseEntity<>(savedExam, HttpStatus.CREATED);
    }

    @GetMapping("/exams")
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam updatedExam) {
        return examRepository.findById(id)
                .map(exam -> {
                    exam.setTitle(updatedExam.getTitle());
                    exam.setDescription(updatedExam.getDescription());
                    exam.setDurationMinutes(updatedExam.getDurationMinutes());
                    return new ResponseEntity<>(examRepository.save(exam), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/exams/{id}/status")
    public ResponseEntity<Exam> updateExamStatus(@PathVariable Long id, @RequestParam boolean isPublished) {
        return examRepository.findById(id)
                .map(exam -> {
                    exam.setPublished(isPublished);
                    return new ResponseEntity<>(examRepository.save(exam), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        if (!examRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        examRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/exams/{examId}/questions")
    public List<Question> getQuestionsForExam(@PathVariable Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
        return questionRepository.findByExam(exam);
    }

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        if (question.getExam() == null || question.getExam().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exam ID is required to create a question.");
        }
        Exam exam = examRepository.findById(question.getExam().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
        question.setExam(exam);
        Question savedQuestion = questionRepository.save(question);
        return new ResponseEntity<>(savedQuestion, HttpStatus.CREATED);
    }

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setText(updatedQuestion.getText());
                    question.setOptions(updatedQuestion.getOptions());
                    question.setAnswer(updatedQuestion.getAnswer());
                    return new ResponseEntity<>(questionRepository.save(question), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        questionRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // New API to get all results
    @GetMapping("/results/all")
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }
}