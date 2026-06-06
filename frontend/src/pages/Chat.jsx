import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function Chat() {

    const { userId } = useParams();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {

        loadUser();
        loadMessages();

        const client = connectWebSocket();

        return () => {
            if (client) {
                client.deactivate();
            }
        };

    }, []);

    const loadUser = async () => {
        try {
            const response =
                await api.get("/api/users/me");

            setCurrentUser(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const loadMessages = async () => {
        try {

            const response =
                await api.get(
                    `/api/messages/${userId}`
                );

            setMessages(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const connectWebSocket = () => {

        const client = new Client({

            webSocketFactory: () =>
                new SockJS(
                    "http://localhost:8080/chat"
                ),

            reconnectDelay: 5000,

            onConnect: () => {

                console.log(
                    "WebSocket Connected"
                );

                client.subscribe(
                    "/topic/messages",
                    (payload) => {

                        const received =
                            JSON.parse(
                                payload.body
                            );

                        console.log(
                            "Received:",
                            received
                        );

                        setMessages(
                            prev => [
                                ...prev,
                                {
                                    senderName: received.senderName,
                                    message:
                                        received.content,
                                    sentAt:
                                        new Date()
                                            .toLocaleString()
                                }
                            ]
                        );
                    }
                );
            },

            onStompError: (frame) => {

                console.log(
                    "STOMP Error",
                    frame
                );
            }
        });

        client.activate();

        setStompClient(client);

        return client;
    };

    const sendMessage = () => {

        console.log(
            "Send clicked"
        );

        if (!message.trim()) {
            console.log(
                "Empty message"
            );
            return;
        }

        if (!currentUser) {
            console.log(
                "User not loaded"
            );
            return;
        }

        if (!stompClient) {
            console.log(
                "WebSocket not connected"
            );
            return;
        }

        stompClient.publish({

            destination:
                "/app/send",

            body:
                JSON.stringify({

                    senderId:
                        currentUser.id,

                    receiverId:
                        Number(userId),

                    content:
                        message
                })
        });

        console.log(
            "Message sent"
        );

        setMessage("");
    };

    return (
        <div>

            <h1>Chat</h1>

            {messages.map(
                (msg, index) => (

                    <div
                        key={index}
                        style={{
                            border:
                                "1px solid #ddd",
                            padding:
                                "10px",
                            marginBottom:
                                "10px"
                        }}
                    >
                        <strong>
                            {msg.senderName}
                        </strong>

                        <p>
                            {msg.message}
                        </p>

                        <small>
                            {msg.sentAt}
                        </small>

                    </div>
                )
            )}

            <input
                value={message}
                onChange={(e) =>
                    setMessage(
                        e.target.value
                    )
                }
                placeholder="Type message..."
            />

            <button
                onClick={sendMessage}
            >
                Send
            </button>

        </div>
    );
}

export default Chat;