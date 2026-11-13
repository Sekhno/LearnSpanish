package com.example.learnspanish.dto;

import java.util.List;

public record IntroductionQuizResultDto(int score, int total, List<IntroductionAnswerResultDto> results) {
}
