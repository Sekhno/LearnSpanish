package com.example.learnspanish.controller;

import com.example.learnspanish.model.NumberEntry;
import com.example.learnspanish.service.NumbersService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/numbers")
public class NumbersController {

    private final NumbersService numbersService;

    public NumbersController(NumbersService numbersService) {
        this.numbersService = numbersService;
    }

    @GetMapping
    public List<NumberEntry> getNumbers() {
        return numbersService.getAll();
    }
}
