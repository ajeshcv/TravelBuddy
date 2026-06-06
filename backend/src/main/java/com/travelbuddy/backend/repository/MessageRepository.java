package com.travelbuddy.backend.repository;

import com.travelbuddy.backend.model.Message;
import com.travelbuddy.backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiver(
            User sender,
            User receiver
    );

    List<Message> findByReceiverAndSender(
            User receiver,
            User sender
    );

    List<Message> findBySenderOrReceiver(
            User sender,
            User receiver
    );

    long countBySenderAndReceiverAndReadStatus(
            User sender,
            User receiver,
            boolean readStatus
    );
}