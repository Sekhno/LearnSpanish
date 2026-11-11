package com.example.learnspanish.dto;

import java.util.List;

public record ShoppingQuizResultDto(int score, int total, List<ShoppingAnswerResultDto> results) {
}
