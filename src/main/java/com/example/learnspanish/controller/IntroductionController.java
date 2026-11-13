package com.example.learnspanish.controller;

import com.example.learnspanish.dto.*;
import com.example.learnspanish.model.IntroductionPhrase;
import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import com.example.learnspanish.service.IntroductionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/introduction")
public class IntroductionController {

    private final IntroductionService introductionService;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public IntroductionController(IntroductionService introductionService,
                                  TestResultRepository testResultRepository,
                                  UserRepository userRepository) {
        this.introductionService = introductionService;
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/phrases")
    public List<IntroductionPhrase> getPhrases() {
        return introductionService.getPhrases();
    }

    @GetMapping("/quiz")
    public List<IntroductionQuizQuestionDto> generateQuiz() {
        List<IntroductionPhrase> all = introductionService.getPhrases();
        List<IntroductionPhrase> shuffled = new ArrayList<>(all);
        Collections.shuffle(shuffled);
        List<IntroductionPhrase> selected = shuffled.subList(0, Math.min(10, shuffled.size()));

        Random rng = new Random();
        return selected.stream().map(phrase -> {
            String lang = rng.nextBoolean() ? "spanish" : "catalan";
            String correct = lang.equals("spanish") ? phrase.spanish() : phrase.catalan();

            List<String> wrongPool = all.stream()
                    .filter(p -> p.id() != phrase.id())
                    .map(p -> lang.equals("spanish") ? p.spanish() : p.catalan())
                    .collect(Collectors.toCollection(ArrayList::new));
            Collections.shuffle(wrongPool);

            List<String> options = new ArrayList<>(wrongPool.subList(0, 2));
            options.add(correct);
            Collections.shuffle(options);

            return new IntroductionQuizQuestionDto(phrase.id(), phrase.english(), phrase.ukrainian(), lang, options);
        }).toList();
    }

    @PostMapping("/quiz/submit")
    public IntroductionQuizResultDto submitQuiz(@RequestBody List<IntroductionAnswerDto> answers,
                                                Authentication authentication) {
        Map<Integer, IntroductionPhrase> phraseMap = introductionService.getPhrases().stream()
                .collect(Collectors.toMap(IntroductionPhrase::id, p -> p));

        List<IntroductionAnswerResultDto> results = answers.stream().map(answer -> {
            IntroductionPhrase phrase = phraseMap.get(answer.id());
            String correct = answer.targetLanguage().equals("spanish") ? phrase.spanish() : phrase.catalan();
            boolean isCorrect = correct.equals(answer.selectedAnswer());
            return new IntroductionAnswerResultDto(phrase.id(), phrase.english(),
                    answer.targetLanguage(), answer.selectedAnswer(), correct, isCorrect);
        }).toList();

        int score = (int) results.stream().filter(IntroductionAnswerResultDto::correct).count();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestResult testResult = new TestResult();
        testResult.setUser(user);
        testResult.setTopicId("introduction");
        testResult.setScore(score);
        testResult.setTotalQuestions(answers.size());
        testResult.setCompletedAt(LocalDateTime.now());
        testResultRepository.save(testResult);

        return new IntroductionQuizResultDto(score, answers.size(), results);
    }
}
