package com.travelbuddy.backend.service;

import com.travelbuddy.backend.dto.MatchRequestDTO;
import com.travelbuddy.backend.dto.MyMatchResponse;
import com.travelbuddy.backend.model.MatchRequest;
import com.travelbuddy.backend.model.MatchStatus;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.repository.MatchRequestRepository;
import com.travelbuddy.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRequestRepository matchRepository;

    public String sendRequest(
            MatchRequestDTO dto,
            String email
    ) {

        User sender =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        User receiver =
                userRepository
                        .findById(
                                dto.getReceiverId()
                        )
                        .orElseThrow();

        // Prevent duplicate requests
        var existingRequest =
                matchRepository
                        .findBySenderAndReceiver(
                                sender,
                                receiver
                        );

        if (existingRequest.isPresent()) {

            return "Request Already Sent";
        }

        // Check if receiver already sent request
        var reverseMatch =
                matchRepository
                        .findBySenderAndReceiver(
                                receiver,
                                sender
                        );

        if (reverseMatch.isPresent()) {

            MatchRequest existing =
                    reverseMatch.get();

            existing.setStatus(
                    MatchStatus.MATCHED
            );

            matchRepository.save(existing);

            return "🎉 Match Found!";
        }

        MatchRequest request =
                new MatchRequest();

        request.setSender(sender);

        request.setReceiver(receiver);

        request.setStatus(
                MatchStatus.PENDING
        );

        request.setCreatedAt(
                LocalDateTime.now()
        );

        matchRepository.save(request);

        return "Request Sent";
    }

    public List<MyMatchResponse> getMyMatches(
            String email
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        List<MyMatchResponse> results =
                new ArrayList<>();

        List<MatchRequest> sentMatches =
                matchRepository.findBySender(
                        currentUser
                );

        for (MatchRequest match : sentMatches) {

            if (match.getStatus()
                    == MatchStatus.MATCHED) {

                User otherUser =
                        match.getReceiver();

                results.add(
                        new MyMatchResponse(
                                match.getId(),
                                otherUser.getId(),
                                otherUser.getName(),
                                otherUser.getEmail(),
                                match.getStatus()
                                        .name()
                        )
                );
            }
        }

        List<MatchRequest> receivedMatches =
                matchRepository.findByReceiver(
                        currentUser
                );

        for (MatchRequest match : receivedMatches) {

            if (match.getStatus()
                    == MatchStatus.MATCHED) {

                User otherUser =
                        match.getSender();

                results.add(
                        new MyMatchResponse(
                                match.getId(),
                                otherUser.getId(),
                                otherUser.getName(),
                                otherUser.getEmail(),
                                match.getStatus()
                                        .name()
                        )
                );
            }
        }

        return results;
    }
}