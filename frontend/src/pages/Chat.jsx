import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
} from 'lucide-react';
import { Avatar, Button } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from '@stomp/stompjs';

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (date) => {
  if (!date) return '';
  const today = new Date();
  const messageDate = new Date(date);
  const diff = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (currentUser) {
      fetchChatData();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/users/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setLoading(false);
    }
  };

  const fetchChatData = async () => {
    try {
      // Fetch other user info
      try {
        const userResponse = await api.get(`/api/users/${userId}`);
        setOtherUser(userResponse.data);
      } catch (e) {
        setOtherUser({
          id: userId,
          name: 'User',
          online: false,
        });
      }

      // Fetch messages from backend REST API
      try {
        const messagesResponse = await api.get(`/api/messages/${userId}`);
        // Transform MessageResponse to our local format
        const transformedMessages = (messagesResponse.data || []).map(msg => ({
          sender: msg.senderName,
          content: msg.message,
          sentAt: msg.sentAt,
        }));
        setMessages(transformedMessages);
      } catch (e) {
        console.error('Error fetching messages:', e);
        setMessages([]);
      }

      // Initialize WebSocket for real-time updates
      initWebSocket();
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initWebSocket = () => {
    const token = localStorage.getItem('token');
    const sock = new SockJS('http://localhost:8080/chat');
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      connectionHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    client.onConnect = () => {
      setIsConnected(true);
      
      // Subscribe to messages for this specific user
      client.subscribe(`/topic/messages/${currentUser?.id}`, (message) => {
        try {
          const newMsg = JSON.parse(message.body);
          // Only add if it's part of this conversation
          if (newMsg.senderId === currentUser?.id || newMsg.receiverId === parseInt(userId)) {
            setMessages((prev) => {
              const exists = prev.some(m => 
                m.content === newMsg.content && 
                m.sender === newMsg.senderName
              );
              if (exists) return prev;
              return [...prev, {
                sender: newMsg.senderName,
                content: newMsg.content,
                sentAt: new Date().toISOString(),
              }];
            });
          }
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.activate();
    setStompClient(client);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messagePayload = {
      senderId: currentUser.id,
      receiverId: parseInt(userId),
      content: newMessage.trim(),
    };

    try {
      // Send via REST API (which also broadcasts via WebSocket)
      const response = await api.post('/api/messages', messagePayload);
      
      // Add to local state
      setMessages((prev) => [
        ...prev,
        {
          sender: response.data.senderName || currentUser.name,
          content: response.data.message,
          sentAt: response.data.sentAt || new Date().toISOString(),
        },
      ]);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading chat...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-surface border border-border rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chats')}
              className="p-2 rounded-lg hover:bg-border-light transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <Avatar
              src={otherUser?.profileImage}
              name={otherUser?.name}
              size="lg"
              online={otherUser?.online}
            />
            <div>
              <h2 className="font-bold text-text">{otherUser?.name}</h2>
              <p className="text-sm text-text-muted">
                {otherUser?.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-border-light flex items-center justify-center mb-4">
                <Send className="w-10 h-10 text-text-muted opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">No messages yet</h3>
              <p className="text-text-secondary max-w-sm">
                Start a conversation with {otherUser?.name}. Say hi and break the ice!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMe = message.sender === currentUser?.name;
              const showDate =
                index === 0 ||
                formatDate(message.sentAt) !== formatDate(messages[index - 1]?.sentAt);

              return (
                <div key={index}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="px-3 py-1 rounded-full bg-border-light text-xs text-text-muted">
                        {formatDate(message.sentAt)}
                      </span>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                        isMe
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-border-light text-text rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          isMe ? 'text-white/70' : 'text-text-muted'
                        }`}
                      >
                        <span className="text-xs">{formatTime(message.sentAt)}</span>
                        {isMe && (
                          <span>
                            <CheckCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 p-4 border-t border-border bg-surface"
        >
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-border-light border-0 rounded-full text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary flex-shrink-0"
          >
            <Smile className="w-5 h-5" />
          </button>

          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Layout>
  );
}