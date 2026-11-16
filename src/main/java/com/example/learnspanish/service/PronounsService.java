package com.example.learnspanish.service;

import com.example.learnspanish.model.PronounEntry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class PronounsService {

    private final List<PronounEntry> pronouns;

    public PronounsService(ObjectMapper objectMapper) throws IOException {
        pronouns = objectMapper.readValue(
            new ClassPathResource("data/pronouns.json").getInputStream(),
            new TypeReference<>() {}
        );
    }

    public List<PronounEntry> getPronouns() {
        return pronouns;
    }
}
