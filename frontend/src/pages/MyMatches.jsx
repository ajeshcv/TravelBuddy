import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Card, Button, Avatar, Skeleton } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MatchItem = ({ match, onChat, onViewProfile }) => {
  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const matchDate = new Date(date);
    const diff = Math.floor((now - matchDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <Card className="flex items-center gap-4" padding={false}>
        <div className="relative flex-shrink-0">
          <Avatar
            src={match.profileImage}
            name={match.name}
            size="xl"
            className="m-4"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-success border-2 border-surface rounded-full" />
        </div>

        <div className="flex-1 min-w-0 py-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-text truncate">{match.name}</h3>
            {match.matchScore !== undefined && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10">
                <Sparkles className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">{match.matchScore}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            {match.travelPlan?.destination && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{match.travelPlan.destination}</span>
              </div>
            )}
            {match.matchedAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(match.matchedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(match)}
            leftIcon={<Eye className="w-4 h-4" />}
            className="hidden sm:flex"
          >
            Profile
          </Button>
          <Button
            onClick={() => onChat(match)}
            leftIcon={<MessageCircle className="w-4 h-4" />}
          >
            Message
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/api/matches');
      setMatches(response.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (match) => {
    // Use userId from MyMatchResponse DTO, not id
    navigate(`/chat/${match.userId}`);
  };

  const handleViewProfile = (match) => {
    // Navigate to profile page with userId
    navigate(`/profile/${match.userId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text">My Matches</h1>
          <p className="text-text-secondary mt-1">
            People you've connected with
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{loading ? '-' : matches.length}</p>
              <p className="text-sm text-text-muted">Total Matches</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{loading ? '-' : 0}</p>
              <p className="text-sm text-text-muted">Active Conversations</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{loading ? '-' : 0}</p>
              <p className="text-sm text-text-muted">Pending Requests</p>
            </div>
          </Card>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <Card className="text-center py-16">
            <Heart className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">No matches yet</h2>
            <p className="text-text-secondary mb-6">
              Start exploring and connect with potential travel buddies
            </p>
            <Button onClick={() => navigate('/find-matches')}>
              Find Travel Buddies
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchItem
                key={match.id}
                match={match}
                onChat={handleChat}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}