package com.travelbuddy.backend.dto;

public class ChatListResponse {

    private Long userId;

    private String name;

    private String lastMessage;

    private long unreadCount;

    public ChatListResponse() {}

    public ChatListResponse(
            Long userId,
            String name,
            String lastMessage,
            long unreadCount
    ) {
        this.userId = userId;
        this.name = name;
        this.lastMessage = lastMessage;
        this.unreadCount = unreadCount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(
            String lastMessage
    ) {
        this.lastMessage = lastMessage;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(
            long unreadCount
    ) {
        this.unreadCount = unreadCount;
    }
}