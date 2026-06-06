package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.ChatListResponse;
import com.travelbuddy.backend.dto.ChatMessage;
import com.travelbuddy.backend.dto.MessageResponse;
import com.travelbuddy.backend.service.ChatService;
import com.travelbuddy.backend.service.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService service;

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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

    @PostMapping
    public MessageResponse sendMessage(
            @RequestBody ChatMessage chatMessage,
            Principal principal
    ) {
        // Save the message
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);

        // Send to WebSocket topic for real-time delivery
        messagingTemplate.convertAndSend(
                "/topic/messages/" + chatMessage.getReceiverId(),
                savedMessage
        );

        // Return the saved message
        return new MessageResponse(
                savedMessage.getSenderName(),
                savedMessage.getContent(),
                java.time.LocalDateTime.now()
        );
    }
}