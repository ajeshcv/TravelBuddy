package com.travelbuddy.backend.service;

import com.travelbuddy.backend.dto.ChatMessage;
import com.travelbuddy.backend.model.Message;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.repository.MessageRepository;
import com.travelbuddy.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessage saveMessage(
            ChatMessage chatMessage
    ) {

        User sender =
                userRepository
                        .findById(
                                chatMessage.getSenderId()
                        )
                        .orElseThrow();

        User receiver =
                userRepository
                        .findById(
                                chatMessage.getReceiverId()
                        )
                        .orElseThrow();

        Message message =
                new Message();

        message.setSender(sender);

        message.setReceiver(receiver);

        message.setContent(
                chatMessage.getContent()
        );

        message.setSentAt(
                LocalDateTime.now()
        );

        messageRepository.save(message);

        // Add sender name for websocket response
        chatMessage.setSenderName(
                sender.getName()
        );

        return chatMessage;
    }
}