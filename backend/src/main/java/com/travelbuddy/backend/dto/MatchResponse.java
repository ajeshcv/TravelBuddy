package com.travelbuddy.backend.dto;

public class MatchResponse {

    private Long userId;

    private String travelerName;

    private String destination;

    private int matchPercentage;

    public MatchResponse() {}

    public MatchResponse(
            Long userId,
            String travelerName,
            String destination,
            int matchPercentage
    ) {
        this.userId = userId;
        this.travelerName = travelerName;
        this.destination = destination;
        this.matchPercentage = matchPercentage;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(
            Long userId
    ) {
        this.userId = userId;
    }

    public String getTravelerName() {
        return travelerName;
    }

    public void setTravelerName(
            String travelerName
    ) {
        this.travelerName = travelerName;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(
            String destination
    ) {
        this.destination = destination;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(
            int matchPercentage
    ) {
        this.matchPercentage = matchPercentage;
    }
}