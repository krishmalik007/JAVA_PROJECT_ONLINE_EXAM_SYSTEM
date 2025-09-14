package com.example.userservice.user;

import com.example.userservice.exam.model.Exam;
import com.example.userservice.exam.model.Question;
import com.example.userservice.user.model.Result;
import com.example.userservice.user.model.User;
import com.example.userservice.exam.repository.ExamRepository;
import com.example.userservice.exam.repository.QuestionRepository;
import com.example.userservice.user.repository.ResultRepository;
import com.example.userservice.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping("/exams")
    public List<Exam> getAvailableExams() {
        return examRepository.findAll();
    }

    @GetMapping("/exams/{examId}/questions")
    public List<Question> getQuestionsForExam(@PathVariable Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
        return questionRepository.findByExam(exam);
    }

    @PostMapping("/submit-exam")
    public ResponseEntity<Result> submitExam(@RequestBody Map<String, Object> submission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Long examId = Long.valueOf(submission.get("examId").toString());
        Map<String, String> answers = (Map<String, String>) submission.get("answers");

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        List<Question> questions = questionRepository.findByExam(exam);
        int score = 0;
        int totalQuestions = questions.size();

        for (Question q : questions) {
            String submittedAnswer = answers.get(q.getId().toString());
            String storedAnswer = q.getAnswer();
            if (submittedAnswer != null && submittedAnswer.equalsIgnoreCase(storedAnswer)) {
                score++;
            }
        }

        Result result = new Result();
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setExam(exam);
        result.setUser(user);
        result.setSubmissionDate(LocalDateTime.now());
        resultRepository.save(result);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/results")
    public List<Result> getUserResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return resultRepository.findByUser(user);
    }
}