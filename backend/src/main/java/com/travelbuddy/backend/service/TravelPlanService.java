package com.travelbuddy.backend.service;

import com.travelbuddy.backend.dto.MatchResponse;
import com.travelbuddy.backend.dto.TravelPlanRequest;
import com.travelbuddy.backend.model.TravelPlan;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.repository.TravelPlanRepository;
import com.travelbuddy.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TravelPlanService {

    @Autowired
    private TravelPlanRepository repository;

    @Autowired
    private UserRepository userRepository;

    public TravelPlan createPlan(TravelPlan plan) {
        return repository.save(plan);
    }

    public List<TravelPlan> getAllPlans() {
        return repository.findAll();
    }

    public List<TravelPlan> getMyPlans(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        return repository.findByUser(user);
    }

    public TravelPlan createPlan(
            TravelPlanRequest request,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        TravelPlan plan =
                new TravelPlan();

        plan.setDestination(
                request.getDestination()
        );

        plan.setStartDate(
                request.getStartDate()
        );

        plan.setEndDate(
                request.getEndDate()
        );

        plan.setBudget(
                request.getBudget()
        );

        plan.setTravelStyle(
                request.getTravelStyle()
        );

        plan.setUser(user);

        return repository.save(plan);
    }

    public List<MatchResponse> findMatches(
            String email
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        List<TravelPlan> allPlans =
                repository.findAll();

        List<MatchResponse> matches =
                new ArrayList<>();

        for (TravelPlan myPlan : allPlans) {

            if (myPlan.getUser() == null) {
                continue;
            }

            if (!myPlan.getUser()
                    .getId()
                    .equals(currentUser.getId())) {
                continue;
            }

            for (TravelPlan otherPlan : allPlans) {

                if (otherPlan.getUser() == null) {
                    continue;
                }

                if (otherPlan.getUser()
                        .getId()
                        .equals(currentUser.getId())) {
                    continue;
                }

                int score = 0;

                // Destination Match (40%)
                if (myPlan.getDestination() != null
                        && otherPlan.getDestination() != null
                        && myPlan.getDestination()
                                .equalsIgnoreCase(
                                        otherPlan.getDestination()
                                )) {

                    score += 40;
                }

                // Date Overlap (25%)
                boolean overlap =
                        !myPlan.getEndDate()
                                .isBefore(
                                        otherPlan.getStartDate()
                                )
                        &&
                        !otherPlan.getEndDate()
                                .isBefore(
                                        myPlan.getStartDate()
                                );

                if (overlap) {
                    score += 25;
                }

                // Travel Style Match (20%)
                if (myPlan.getTravelStyle() != null
                        && otherPlan.getTravelStyle() != null
                        && myPlan.getTravelStyle()
                                .equalsIgnoreCase(
                                        otherPlan.getTravelStyle()
                                )) {

                    score += 20;
                }

                // Budget Similarity (15%)
                if (myPlan.getBudget() != null
                        && otherPlan.getBudget() != null) {

                    double difference =
                            Math.abs(
                                    myPlan.getBudget()
                                            - otherPlan.getBudget()
                            );

                    if (difference <= 20000) {
                        score += 15;
                    }
                }

                if (score >= 60) {

                    matches.add(
                            new MatchResponse(
                                    otherPlan.getUser()
                                            .getId(),
                                    otherPlan.getUser()
                                            .getName(),
                                    otherPlan.getDestination(),
                                    score
                            )
                    );
                }
            }
        }

        // Sort matches by highest score first
        matches.sort(
                (a, b) ->
                        Integer.compare(
                                b.getMatchPercentage(),
                                a.getMatchPercentage()
                        )
        );

        return matches;
    }
}