package com.example.learnspanish.controller;

import com.example.learnspanish.dto.*;
import com.example.learnspanish.model.PronounEntry;
import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.TestResultRepository;
import com.example.learnspanish.repository.UserRepository;
import com.example.learnspanish.service.PronounsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pronouns")
public class PronounsController {

    private final PronounsService pronounsService;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public PronounsController(PronounsService pronounsService,
                              TestResultRepository testResultRepository,
                              UserRepository userRepository) {
        this.pronounsService = pronounsService;
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<PronounEntry> getPronouns() {
        return pronounsService.getPronouns();
    }

    @GetMapping("/quiz")
    public List<PronounsQuizQuestionDto> generateQuiz() {
        List<PronounEntry> all = pronounsService.getPronouns();
        List<PronounEntry> shuffled = new ArrayList<>(all);
        Collections.shuffle(shuffled);
        List<PronounEntry> selected = shuffled.subList(0, Math.min(10, shuffled.size()));

        Random rng = new Random();
        return selected.stream().map(pronoun -> {
            String lang = rng.nextBoolean() ? "spanish" : "catalan";
            String correct = lang.equals("spanish") ? pronoun.spanish() : pronoun.catalan();

            List<String> wrongPool = all.stream()
                    .filter(p -> p.id() != pronoun.id())
                    .map(p -> lang.equals("spanish") ? p.spanish() : p.catalan())
                    .distinct()
                    .filter(s -> !s.equals(correct))
                    .collect(Collectors.toCollection(ArrayList::new));
            Collections.shuffle(wrongPool);

            List<String> options = new ArrayList<>(wrongPool.subList(0, Math.min(2, wrongPool.size())));
            options.add(correct);
            Collections.shuffle(options);

            return new PronounsQuizQuestionDto(pronoun.id(), pronoun.english(), pronoun.ukrainian(), lang, options);
        }).toList();
    }

    @PostMapping("/quiz/submit")
    public PronounsQuizResultDto submitQuiz(@RequestBody List<PronounsAnswerDto> answers,
                                            Authentication authentication) {
        Map<Integer, PronounEntry> pronounMap = pronounsService.getPronouns().stream()
                .collect(Collectors.toMap(PronounEntry::id, p -> p));

        List<PronounsAnswerResultDto> results = answers.stream().map(answer -> {
            PronounEntry pronoun = pronounMap.get(answer.id());
            String correct = answer.targetLanguage().equals("spanish") ? pronoun.spanish() : pronoun.catalan();
            boolean isCorrect = correct.equals(answer.selectedAnswer());
            return new PronounsAnswerResultDto(pronoun.id(), pronoun.english(),
                    answer.targetLanguage(), answer.selectedAnswer(), correct, isCorrect);
        }).toList();

        int score = (int) results.stream().filter(PronounsAnswerResultDto::correct).count();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestResult testResult = new TestResult();
        testResult.setUser(user);
        testResult.setTopicId("pronouns");
        testResult.setScore(score);
        testResult.setTotalQuestions(answers.size());
        testResult.setCompletedAt(LocalDateTime.now());
        testResultRepository.save(testResult);

        return new PronounsQuizResultDto(score, answers.size(), results);
    }
}
