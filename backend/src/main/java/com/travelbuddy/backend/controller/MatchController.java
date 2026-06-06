package com.travelbuddy.backend.controller;

import com.travelbuddy.backend.dto.MatchRequestDTO;

import com.travelbuddy.backend.service.MatchService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import com.travelbuddy.backend.dto.MyMatchResponse;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService service;

    @PostMapping("/request")
    public String sendRequest(

            @RequestBody
            MatchRequestDTO dto,

            Principal principal
    ) {

        return service.sendRequest(
                dto,
                principal.getName()
        );
    }


    @GetMapping
public List<MyMatchResponse>
getMyMatches(
        Principal principal
) {

    return service.getMyMatches(
            principal.getName()
    );
}
}