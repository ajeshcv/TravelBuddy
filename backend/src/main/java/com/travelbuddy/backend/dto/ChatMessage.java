package com.travelbuddy.backend.dto;

public class ChatMessage {

    private Long senderId;

    private Long receiverId;

    private String senderName;

    private String content;

    public ChatMessage() {}

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(
            Long senderId
    ) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(
            Long receiverId
    ) {
        this.receiverId = receiverId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(
            String senderName
    ) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(
            String content
    ) {
        this.content = content;
    }
}