package com.travelbuddy.backend.dto;

public class MyMatchResponse {

    private Long matchId;

    private Long userId;

    private String name;

    private String email;

    private String status;

    public MyMatchResponse() {}

    public MyMatchResponse(
            Long matchId,
            Long userId,
            String name,
            String email,
            String status
    ) {
        this.matchId = matchId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.status = status;
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(
            Long matchId
    ) {
        this.matchId = matchId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(
            Long userId
    ) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(
            String name
    ) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(
            String status
    ) {
        this.status = status;
    }
}