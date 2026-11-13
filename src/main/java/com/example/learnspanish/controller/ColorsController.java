package com.example.learnspanish.controller;

import com.example.learnspanish.dto.*;
import com.example.learnspanish.model.ColorEntry;
import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import com.example.learnspanish.service.ColorsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/colors")
public class ColorsController {

    private final ColorsService colorsService;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public ColorsController(ColorsService colorsService,
                            TestResultRepository testResultRepository,
                            UserRepository userRepository) {
        this.colorsService = colorsService;
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ColorEntry> getColors() {
        return colorsService.getColors();
    }

    @GetMapping("/quiz")
    public List<ColorsQuizQuestionDto> generateQuiz() {
        List<ColorEntry> all = colorsService.getColors();
        List<ColorEntry> shuffled = new ArrayList<>(all);
        Collections.shuffle(shuffled);
        List<ColorEntry> selected = shuffled.subList(0, Math.min(10, shuffled.size()));

        Random rng = new Random();
        return selected.stream().map(color -> {
            String lang = rng.nextBoolean() ? "spanish" : "catalan";
            String correct = lang.equals("spanish") ? color.spanish() : color.catalan();

            List<String> wrongPool = all.stream()
                    .filter(c -> c.id() != color.id())
                    .map(c -> lang.equals("spanish") ? c.spanish() : c.catalan())
                    .collect(Collectors.toCollection(ArrayList::new));
            Collections.shuffle(wrongPool);

            List<String> options = new ArrayList<>(wrongPool.subList(0, 2));
            options.add(correct);
            Collections.shuffle(options);

            return new ColorsQuizQuestionDto(color.id(), color.english(), color.ukrainian(), color.hex(), lang, options);
        }).toList();
    }

    @PostMapping("/quiz/submit")
    public ColorsQuizResultDto submitQuiz(@RequestBody List<ColorsAnswerDto> answers,
                                          Authentication authentication) {
        Map<Integer, ColorEntry> colorMap = colorsService.getColors().stream()
                .collect(Collectors.toMap(ColorEntry::id, c -> c));

        List<ColorsAnswerResultDto> results = answers.stream().map(answer -> {
            ColorEntry color = colorMap.get(answer.id());
            String correct = answer.targetLanguage().equals("spanish") ? color.spanish() : color.catalan();
            boolean isCorrect = correct.equals(answer.selectedAnswer());
            return new ColorsAnswerResultDto(color.id(), color.english(), color.hex(),
                    answer.targetLanguage(), answer.selectedAnswer(), correct, isCorrect);
        }).toList();

        int score = (int) results.stream().filter(ColorsAnswerResultDto::correct).count();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestResult testResult = new TestResult();
        testResult.setUser(user);
        testResult.setTopicId("colors");
        testResult.setScore(score);
        testResult.setTotalQuestions(answers.size());
        testResult.setCompletedAt(LocalDateTime.now());
        testResultRepository.save(testResult);

        return new ColorsQuizResultDto(score, answers.size(), results);
    }
}
