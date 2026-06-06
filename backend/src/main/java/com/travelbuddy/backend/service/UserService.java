package com.travelbuddy.backend.service;

import com.travelbuddy.backend.dto.AuthResponse;
import com.travelbuddy.backend.dto.RegisterRequest;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.repository.UserRepository;
import com.travelbuddy.backend.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String registerUser(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String encryptedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(encryptedPassword);

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public AuthResponse loginUser(String email, String password) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return new AuthResponse(
                    "User Not Found",
                    null
            );
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        if (!passwordMatches) {
            return new AuthResponse(
                    "Invalid Password",
                    null
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                "Login Successful",
                token
        );
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }


    public User getCurrentUser(String email) {

    return userRepository
            .findByEmail(email)
            .orElse(null);
}
}