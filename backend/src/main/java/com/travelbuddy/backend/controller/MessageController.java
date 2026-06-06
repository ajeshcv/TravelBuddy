package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.ChatListResponse;
import com.travelbuddy.backend.dto.MessageResponse;
import com.travelbuddy.backend.service.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService service;

    @GetMapping("/{userId}")
    public List<MessageResponse> getConversation(
            @PathVariable Long userId,
            Principal principal
    ) {

        return service.getConversation(
                principal.getName(),
                userId
        );
    }

    @GetMapping("/chat-list")
    public List<ChatListResponse> getChatList(
            Principal principal
    ) {

        return service.getChatList(
                principal.getName()
        );
    }
}