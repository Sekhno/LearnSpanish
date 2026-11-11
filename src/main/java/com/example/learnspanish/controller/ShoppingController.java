package com.example.learnspanish.controller;

import com.example.learnspanish.dto.*;
import com.example.learnspanish.model.ShoppingItem;
import com.example.learnspanish.model.ShoppingPhrase;
import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import com.example.learnspanish.service.ShoppingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shopping")
public class ShoppingController {

    private final ShoppingService shoppingService;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public ShoppingController(ShoppingService shoppingService,
                              TestResultRepository testResultRepository,
                              UserRepository userRepository) {
        this.shoppingService = shoppingService;
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/phrases")
    public List<ShoppingPhrase> getPhrases() {
        return shoppingService.getPhrases();
    }

    @GetMapping("/items")
    public List<ShoppingItem> getItems() {
        return shoppingService.getItems();
    }

    @GetMapping("/quiz")
    public List<ShoppingQuizQuestionDto> generateQuiz() {
        List<ShoppingItem> all = shoppingService.getItems();
        List<ShoppingItem> shuffled = new ArrayList<>(all);
        Collections.shuffle(shuffled);
        List<ShoppingItem> selected = shuffled.subList(0, Math.min(10, shuffled.size()));

        Random rng = new Random();
        return selected.stream().map(item -> {
            String lang = rng.nextBoolean() ? "spanish" : "catalan";
            String correct = lang.equals("spanish") ? item.spanish() : item.catalan();

            List<String> wrongPool = all.stream()
                    .filter(i -> i.id() != item.id())
                    .map(i -> lang.equals("spanish") ? i.spanish() : i.catalan())
                    .collect(Collectors.toCollection(ArrayList::new));
            Collections.shuffle(wrongPool);

            List<String> options = new ArrayList<>(wrongPool.subList(0, 2));
            options.add(correct);
            Collections.shuffle(options);

            return new ShoppingQuizQuestionDto(item.id(), item.english(), lang, options);
        }).toList();
    }

    @PostMapping("/quiz/submit")
    public ShoppingQuizResultDto submitQuiz(@RequestBody List<ShoppingAnswerDto> answers,
                                            Authentication authentication) {
        Map<Integer, ShoppingItem> itemMap = shoppingService.getItems().stream()
                .collect(Collectors.toMap(ShoppingItem::id, i -> i));

        List<ShoppingAnswerResultDto> results = answers.stream().map(answer -> {
            ShoppingItem item = itemMap.get(answer.id());
            String correct = answer.targetLanguage().equals("spanish") ? item.spanish() : item.catalan();
            boolean isCorrect = correct.equals(answer.selectedAnswer());
            return new ShoppingAnswerResultDto(item.id(), item.english(), answer.targetLanguage(),
                    answer.selectedAnswer(), correct, isCorrect);
        }).toList();

        int score = (int) results.stream().filter(ShoppingAnswerResultDto::correct).count();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestResult testResult = new TestResult();
        testResult.setUser(user);
        testResult.setTopicId("shopping");
        testResult.setScore(score);
        testResult.setTotalQuestions(answers.size());
        testResult.setCompletedAt(LocalDateTime.now());
        testResultRepository.save(testResult);

        return new ShoppingQuizResultDto(score, answers.size(), results);
    }
}
