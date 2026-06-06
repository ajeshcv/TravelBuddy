package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.AuthResponse;
import com.travelbuddy.backend.dto.LoginRequest;
import com.travelbuddy.backend.dto.RegisterRequest;
import com.travelbuddy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
public String registerUser(
        @RequestBody RegisterRequest request
) {
    return userService.registerUser(request);
}

    @PostMapping("/login")
public AuthResponse loginUser(
        @RequestBody LoginRequest request
) {

    return userService.loginUser(
            request.getEmail(),
            request.getPassword()
    );
}
}