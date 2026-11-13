package com.example.learnspanish.dto;

import java.util.List;

public record ColorsQuizQuestionDto(int id, String english, String ukrainian, String hex, String targetLanguage, List<String> options) {
}
