package com.travelbuddy.backend.repository;

import com.travelbuddy.backend.model.MatchRequest;
import com.travelbuddy.backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRequestRepository
        extends JpaRepository<MatchRequest, Long> {

    Optional<MatchRequest> findBySenderAndReceiver(
            User sender,
            User receiver
    );

    List<MatchRequest> findBySender(
            User sender
    );

    List<MatchRequest> findByReceiver(
            User receiver
    );
}