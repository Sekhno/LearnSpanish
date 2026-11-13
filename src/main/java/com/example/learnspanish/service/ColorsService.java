package com.example.learnspanish.service;

import com.example.learnspanish.model.ColorEntry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ColorsService {

    private final List<ColorEntry> colors;

    public ColorsService(ObjectMapper objectMapper) throws IOException {
        colors = objectMapper.readValue(
            new ClassPathResource("data/colors.json").getInputStream(),
            new TypeReference<>() {}
        );
    }

    public List<ColorEntry> getColors() {
        return colors;
    }
}
