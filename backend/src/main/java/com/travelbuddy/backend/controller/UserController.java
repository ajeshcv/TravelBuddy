package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/me")
public User getCurrentUser(
        Principal principal
) {

    return userService.getCurrentUser(
            principal.getName()
    );
}

}