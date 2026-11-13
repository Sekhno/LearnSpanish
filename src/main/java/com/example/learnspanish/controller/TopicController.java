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
            new Topic("numbers",      "Numbers",      "Learn numbers in Spanish with Catalan comparison", "pin"),
            new Topic("shopping",     "Shopping",     "Phrases and vocabulary for shopping in Spain",     "shopping_cart"),
            new Topic("colors",       "Colors",       "Learn colors in Spanish and Catalan",              "palette"),
            new Topic("introduction", "Introduction", "Phrases for meeting and introducing yourself",     "waving_hand")
        );
    }
}
