package com.example.learnspanish.dto;

import java.util.List;

public record IntroductionQuizQuestionDto(int id, String english, String ukrainian, String targetLanguage, List<String> options) {
}
