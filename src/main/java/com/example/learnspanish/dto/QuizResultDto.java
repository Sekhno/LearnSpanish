package com.example.learnspanish.dto;

import java.util.List;

public record QuizResultDto(int score, int total, List<AnswerResultDto> results) {}
