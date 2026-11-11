package com.example.learnspanish.service;

import com.example.learnspanish.dto.QuizQuestionDto;
import com.example.learnspanish.model.NumberEntry;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class QuizService {

    private final NumbersService numbersService;

    public QuizService(NumbersService numbersService) {
        this.numbersService = numbersService;
    }

    public List<QuizQuestionDto> generateQuiz(int questionCount) {
        List<NumberEntry> all = numbersService.getAll();
        List<NumberEntry> copy = new ArrayList<>(all);
        Collections.shuffle(copy);
        List<NumberEntry> selected = copy.subList(0, Math.min(questionCount, copy.size()));

        return selected.stream()
                .map(entry -> buildQuestion(entry, all))
                .toList();
    }

    private QuizQuestionDto buildQuestion(NumberEntry correct, List<NumberEntry> all) {
        List<String> allSpanish = all.stream()
                .filter(n -> n.value() != correct.value())
                .map(NumberEntry::spanish)
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));

        Collections.shuffle(allSpanish);
        List<String> options = new ArrayList<>(allSpanish.subList(0, 2));
        options.add(correct.spanish());
        Collections.shuffle(options);

        return new QuizQuestionDto(correct.value(), options);
    }
}
