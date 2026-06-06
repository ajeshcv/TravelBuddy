import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Search,
  Phone,
  Video,
  Plus,
} from 'lucide-react';
import { Card, Avatar, Skeleton, Button } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ChatItem = ({ chat, onClick }) => {
  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diff = Math.floor((now - messageDate) / (1000 * 60 * 60));

    if (diff === 0) {
      const mins = Math.floor((now - messageDate) / (1000 * 60));
      return `${mins}m`;
    }
    if (diff < 24) return `${diff}h`;
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="flex items-center gap-3 transition-all duration-200 hover:shadow-md" padding={false}>
        <div className="relative flex-shrink-0 p-3">
          <Avatar
            src={chat.profileImage}
            name={chat.name}
            size="lg"
            online={chat.online}
          />
        </div>

        <div className="flex-1 min-w-0 py-3 pr-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text truncate">{chat.name}</h3>
            <span className="text-xs text-text-muted flex-shrink-0">
              {formatTime(chat.lastMessageAt)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary truncate flex-1">
              {chat.lastMessage || 'No messages yet'}
            </p>
            {chat.unreadCount > 0 && (
              <span className="ml-2 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast('Voice call');
            }}
            className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast('Video call');
            }}
            className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      // Try to get chat list from backend
      const response = await api.get('/api/messages/chat-list');
      setChats(response.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Messages</h1>
            <p className="text-text-secondary mt-1">
              Stay connected with your travel buddies
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Chats List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <Card className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">No conversations yet</h2>
            <p className="text-text-secondary mb-6">
              Start chatting with your travel matches
            </p>
            <Button onClick={() => navigate('/find-matches')}>
              Find Travel Buddies
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id || chat.userId}
                chat={chat}
                onClick={() => navigate(`/chat/${chat.userId || chat.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}