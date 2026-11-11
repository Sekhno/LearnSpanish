package com.example.learnspanish.dto;

import java.time.LocalDateTime;

public record TestResultDto(Long id, String topicId, int score, int totalQuestions, LocalDateTime completedAt) {}
