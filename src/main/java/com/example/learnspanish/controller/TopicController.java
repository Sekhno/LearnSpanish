package com.example.learnspanish.controller;

import com.example.learnspanish.model.Topic;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @GetMapping
    public List<Topic> getTopics() {
        return List.of(
            new Topic("numbers", "Numbers", "Learn numbers in Spanish with Catalan comparison", "pin")
        );
    }
}
