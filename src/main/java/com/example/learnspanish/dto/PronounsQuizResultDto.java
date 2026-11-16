package com.example.learnspanish.dto;

import java.util.List;

public record PronounsQuizResultDto(int score, int total, List<PronounsAnswerResultDto> results) {
}
