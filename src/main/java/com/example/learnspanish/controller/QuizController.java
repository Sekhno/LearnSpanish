package com.example.learnspanish.controller;

import com.example.learnspanish.dto.*;
import com.example.learnspanish.model.NumberEntry;
import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import com.example.learnspanish.service.NumbersService;
import com.example.learnspanish.service.QuizService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;
    private final NumbersService numbersService;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public QuizController(QuizService quizService, NumbersService numbersService,
                          TestResultRepository testResultRepository, UserRepository userRepository) {
        this.quizService = quizService;
        this.numbersService = numbersService;
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/numbers")
    public List<QuizQuestionDto> generateQuiz() {
        return quizService.generateQuiz(10);
    }

    @PostMapping("/numbers/submit")
    public QuizResultDto submitQuiz(@RequestBody List<AnswerDto> answers, Authentication authentication) {
        List<AnswerResultDto> results = answers.stream().map(answer -> {
            String correctAnswer = numbersService.getByValue(answer.value())
                    .map(NumberEntry::spanish)
                    .orElse("");
            boolean correct = correctAnswer.equals(answer.selectedAnswer());
            return new AnswerResultDto(answer.value(), answer.selectedAnswer(), correctAnswer, correct);
        }).toList();

        int score = (int) results.stream().filter(AnswerResultDto::correct).count();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestResult testResult = new TestResult();
        testResult.setUser(user);
        testResult.setTopicId("numbers");
        testResult.setScore(score);
        testResult.setTotalQuestions(answers.size());
        testResult.setCompletedAt(LocalDateTime.now());
        testResultRepository.save(testResult);

        return new QuizResultDto(score, answers.size(), results);
    }
}
