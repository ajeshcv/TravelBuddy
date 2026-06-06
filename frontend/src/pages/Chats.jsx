import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Chats() {

    const [chats, setChats] =
        useState([]);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {

        try {

            const response =
                await api.get(
                    "/api/messages/chat-list"
                );

            setChats(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div>

            <h1>Chats</h1>

            {chats.length === 0 ? (

                <p>No chats found</p>

            ) : (

                chats.map(chat => (

                    <div
                        key={chat.userId}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "8px"
                        }}
                    >

                        <h3>
                            {chat.name}
                        </h3>

                        <p>
                            {chat.lastMessage}
                        </p>

                        <p>
                            Unread:
                            {chat.unreadCount}
                        </p>

                        <Link
                            to={`/chat/${chat.userId}`}
                        >
                            Open Chat
                        </Link>

                    </div>

                ))
            )}

        </div>
    );
}

export default Chats;