package com.travelbuddy.backend.dto;

import java.time.LocalDateTime;

public class MessageResponse {

    private String senderName;

    private String message;

    private LocalDateTime sentAt;

    public MessageResponse() {}

    public MessageResponse(
            String senderName,
            String message,
            LocalDateTime sentAt
    ) {
        this.senderName = senderName;
        this.message = message;
        this.sentAt = sentAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(
            String senderName
    ) {
        this.senderName = senderName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(
            String message
    ) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(
            LocalDateTime sentAt
    ) {
        this.sentAt = sentAt;
    }
}