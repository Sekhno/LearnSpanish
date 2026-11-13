package com.example.learnspanish.dto;

import java.util.List;

public record ColorsQuizResultDto(int score, int total, List<ColorsAnswerResultDto> results) {
}
