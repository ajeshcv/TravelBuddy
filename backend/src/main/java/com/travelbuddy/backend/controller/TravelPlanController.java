package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.MatchResponse;
import com.travelbuddy.backend.dto.TravelPlanRequest;
import com.travelbuddy.backend.model.TravelPlan;
import com.travelbuddy.backend.service.TravelPlanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/travel-plans")
public class TravelPlanController {

    @Autowired
    private TravelPlanService service;

    @PostMapping
    public TravelPlan createPlan(
            @RequestBody TravelPlanRequest request,
            Principal principal
    ) {

        return service.createPlan(
                request,
                principal.getName()
        );
    }

    @GetMapping
    public List<TravelPlan> getAllPlans() {
        return service.getAllPlans();
    }

    @GetMapping("/matches")
    public List<MatchResponse> getMatches(
            Principal principal
    ) {

        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }

        return service.findMatches(
                principal.getName()
        );
    }

    @GetMapping("/my-plans")
public List<TravelPlan>
getMyPlans(
        Principal principal
) {

    return service
            .getMyPlans(
                    principal.getName()
            );
}
}