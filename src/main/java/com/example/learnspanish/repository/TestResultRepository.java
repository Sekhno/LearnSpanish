package com.example.learnspanish.repository;

import com.example.learnspanish.model.TestResult;
import com.example.learnspanish.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findTop20ByUserAndTopicIdOrderByCompletedAtDesc(User user, String topicId);
    List<TestResult> findTop20ByUserOrderByCompletedAtDesc(User user);
}
