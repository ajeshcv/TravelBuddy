package com.travelbuddy.backend.dto;

public class MatchRequestDTO {

    private Long receiverId;

    public MatchRequestDTO() {}

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(
            Long receiverId
    ) {
        this.receiverId = receiverId;
    }
}