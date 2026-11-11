package com.example.learnspanish.service;

import com.example.learnspanish.model.ShoppingItem;
import com.example.learnspanish.model.ShoppingPhrase;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ShoppingService {

    private final List<ShoppingPhrase> phrases;
    private final List<ShoppingItem> items;

    public ShoppingService(ObjectMapper objectMapper) throws IOException {
        phrases = objectMapper.readValue(
            new ClassPathResource("data/shopping-phrases.json").getInputStream(),
            new TypeReference<>() {}
        );
        items = objectMapper.readValue(
            new ClassPathResource("data/shopping-items.json").getInputStream(),
            new TypeReference<>() {}
        );
    }

    public List<ShoppingPhrase> getPhrases() {
        return phrases;
    }

    public List<ShoppingItem> getItems() {
        return items;
    }
}
