package com.example.learnspanish.controller;

import com.example.learnspanish.dto.TestResultDto;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-results")
public class TestResultController {

    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public TestResultController(TestResultRepository testResultRepository, UserRepository userRepository) {
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<TestResultDto> getResults(
            @RequestParam(required = false) String topicId,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return (topicId != null
                ? testResultRepository.findTop20ByUserAndTopicIdOrderByCompletedAtDesc(user, topicId)
                : testResultRepository.findTop20ByUserOrderByCompletedAtDesc(user))
                .stream()
                .map(r -> new TestResultDto(r.getId(), r.getTopicId(), r.getScore(), r.getTotalQuestions(), r.getCompletedAt()))
                .toList();
    }
}
