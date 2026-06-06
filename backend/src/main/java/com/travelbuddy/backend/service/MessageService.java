package com.travelbuddy.backend.service;

import com.travelbuddy.backend.dto.ChatListResponse;
import com.travelbuddy.backend.dto.MessageResponse;
import com.travelbuddy.backend.model.MatchRequest;
import com.travelbuddy.backend.model.MatchStatus;
import com.travelbuddy.backend.model.Message;
import com.travelbuddy.backend.model.User;
import com.travelbuddy.backend.repository.MatchRequestRepository;
import com.travelbuddy.backend.repository.MessageRepository;
import com.travelbuddy.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRequestRepository matchRepository;

    public List<MessageResponse> getConversation(
            String email,
            Long otherUserId
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        User otherUser =
                userRepository
                        .findById(otherUserId)
                        .orElseThrow();

        markConversationAsRead(
                currentUser,
                otherUser
        );

        List<Message> sentMessages =
                messageRepository
                        .findBySenderAndReceiver(
                                currentUser,
                                otherUser
                        );

        List<Message> receivedMessages =
                messageRepository
                        .findByReceiverAndSender(
                                currentUser,
                                otherUser
                        );

        List<Message> allMessages =
                new ArrayList<>();

        allMessages.addAll(sentMessages);
        allMessages.addAll(receivedMessages);

        allMessages.sort(
                Comparator.comparing(
                        Message::getSentAt
                )
        );

        List<MessageResponse> response =
                new ArrayList<>();

        for (Message msg : allMessages) {

            response.add(
                    new MessageResponse(
                            msg.getSender().getName(),
                            msg.getContent(),
                            msg.getSentAt()
                    )
            );
        }

        return response;
    }

    public void markConversationAsRead(
            User currentUser,
            User otherUser
    ) {

        List<Message> messages =
                messageRepository
                        .findByReceiverAndSender(
                                currentUser,
                                otherUser
                        );

        for (Message message : messages) {

            if (!message.isReadStatus()) {
                message.setReadStatus(true);
            }
        }

        messageRepository.saveAll(messages);
    }

    public List<ChatListResponse> getChatList(
            String email
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        List<ChatListResponse> chats =
                new ArrayList<>();

        List<MatchRequest> matches =
                new ArrayList<>();

        matches.addAll(
                matchRepository.findBySender(
                        currentUser
                )
        );

        matches.addAll(
                matchRepository.findByReceiver(
                        currentUser
                )
        );

        for (MatchRequest match : matches) {

            if (match.getStatus()
                    != MatchStatus.MATCHED) {

                continue;
            }

            User otherUser;

            if (match.getSender()
                    .getId()
                    .equals(
                            currentUser.getId()
                    )) {

                otherUser =
                        match.getReceiver();

            } else {

                otherUser =
                        match.getSender();
            }

            List<Message> conversation =
                    new ArrayList<>();

            conversation.addAll(
                    messageRepository
                            .findBySenderAndReceiver(
                                    currentUser,
                                    otherUser
                            )
            );

            conversation.addAll(
                    messageRepository
                            .findByReceiverAndSender(
                                    currentUser,
                                    otherUser
                            )
            );

            conversation.sort(
                    (a, b) ->
                            b.getSentAt()
                                    .compareTo(
                                            a.getSentAt()
                                    )
            );

            String lastMessage = "";

            if (!conversation.isEmpty()) {

                lastMessage =
                        conversation
                                .get(0)
                                .getContent();
            }

            long unreadCount =
                    messageRepository
                            .countBySenderAndReceiverAndReadStatus(
                                    otherUser,
                                    currentUser,
                                    false
                            );

            chats.add(
                    new ChatListResponse(
                            otherUser.getId(),
                            otherUser.getName(),
                            lastMessage,
                            unreadCount
                    )
            );
        }

        return chats;
    }
}