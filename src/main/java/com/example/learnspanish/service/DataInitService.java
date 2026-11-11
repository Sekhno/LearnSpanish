package com.example.learnspanish.service;

import com.example.learnspanish.model.User;
import com.example.learnspanish.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("administrator")) {
            User admin = new User();
            admin.setUsername("administrator");
            admin.setPassword(passwordEncoder.encode("administrator"));
            userRepository.save(admin);
            System.out.println("Created default user: administrator");
        }
    }
}
