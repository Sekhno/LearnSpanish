package com.example.learnspanish.dto;

import java.util.List;

public record PronounsQuizQuestionDto(int id, String english, String ukrainian, String targetLanguage, List<String> options) {
}
