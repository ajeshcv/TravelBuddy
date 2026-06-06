package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.ChatMessage;
import com.travelbuddy.backend.service.ChatService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(
            ChatMessage message
    ) {

        return chatService
                .saveMessage(message);
    }
}