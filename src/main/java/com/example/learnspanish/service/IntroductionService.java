package com.example.learnspanish.service;

import com.example.learnspanish.model.IntroductionPhrase;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class IntroductionService {

    private final List<IntroductionPhrase> phrases;

    public IntroductionService(ObjectMapper objectMapper) throws IOException {
        phrases = objectMapper.readValue(
            new ClassPathResource("data/introduction-phrases.json").getInputStream(),
            new TypeReference<>() {}
        );
    }

    public List<IntroductionPhrase> getPhrases() {
        return phrases;
    }
}
