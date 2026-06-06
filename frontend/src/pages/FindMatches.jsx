import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Heart,
  X,
  Eye,
  Sparkles,
  Compass,
} from 'lucide-react';
import { Card, Button, Input, Avatar, Skeleton } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MatchCard = ({ match, onInterested, onSkip, onViewProfile }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full" padding={false}>
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar
              src={match.profileImage}
              name={match.name}
              size="2xl"
              className="w-24 h-24 border-4 border-surface shadow-xl"
            />
          </div>
          {/* Match Score Badge */}
          {match.matchScore !== undefined && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/90 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-sm font-bold text-white">{match.matchScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text">{match.name}</h3>
            {match.email && <p className="text-sm text-text-muted">{match.email}</p>}
          </div>

          {/* Travel Plan Info */}
          {match.travelPlan && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{match.travelPlan.destination}</span>
              </div>
              {match.travelPlan.travelStyle && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Compass className="w-4 h-4" />
                  <span>{match.travelPlan.travelStyle}</span>
                </div>
              )}
              {match.travelPlan.budget && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <DollarSign className="w-4 h-4" />
                  <span>${match.travelPlan.budget.toLocaleString()}</span>
                </div>
              )}
              {match.travelPlan.startDate && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>{formatDate(match.travelPlan.startDate)}</span>
                </div>
              )}
            </div>
          )}

          {/* Shared Interests */}
          {match.sharedInterests && match.sharedInterests.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-text-muted mb-2">Shared interests</p>
              <div className="flex flex-wrap gap-1.5">
                {match.sharedInterests.slice(0, 3).map((interest, idx) => (
                  <span key={idx} className="badge badge-primary text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(match)}
              leftIcon={<Eye className="w-4 h-4" />}
              className="flex-1"
            >
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSkip(match)}
              className="text-danger border-danger/30 hover:bg-danger/10"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onInterested(match)}
              className="flex-1"
              leftIcon={<Heart className="w-4 h-4" />}
            >
              Interested
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function FindMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    travelStyle: '',
    budgetRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/api/travel-plans/matches');
      setMatches(response.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async (match) => {
    try {
      await api.post('/api/matches/request', {
        targetUserId: match.id,
        message: "I'd love to travel together!",
      });
      toast.success(`Interest sent to ${match.name}!`);
      setMatches((prev) => prev.filter((m) => m.id !== match.id));
    } catch (error) {
      console.error('Error sending interest:', error);
      toast.error(error.response?.data?.message || 'Failed to send interest');
    }
  };

  const handleSkip = (match) => {
    setMatches((prev) => prev.filter((m) => m.id !== match.id));
  };

  const handleViewProfile = (match) => {
    toast(`${match.name}'s profile`);
  };

  const filteredMatches = matches.filter(
    (match) =>
      match.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.travelPlan?.destination?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Find Travel Buddies</h1>
            <p className="text-text-secondary mt-1">
              Discover people who match your travel style
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Destination"
                    placeholder="e.g., Paris"
                    value={filters.destination}
                    onChange={(e) => setFilters((prev) => ({ ...prev, destination: e.target.value }))}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text">Travel Style</label>
                    <select
                      value={filters.travelStyle}
                      onChange={(e) => setFilters((prev) => ({ ...prev, travelStyle: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">All styles</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="City">City</option>
                      <option value="Nature">Nature</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text">Budget Range</label>
                    <select
                      value={filters.budgetRange}
                      onChange={(e) => setFilters((prev) => ({ ...prev, budgetRange: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Any budget</option>
                      <option value="0-1000">$0 - $1,000</option>
                      <option value="1000-3000">$1,000 - $3,000</option>
                      <option value="3000-5000">$3,000 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {!loading && filteredMatches.length > 0 && (
          <p className="text-sm text-text-muted">
            Showing {filteredMatches.length} potential travel buddies
          </p>
        )}

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <Card className="text-center py-16">
            <Users className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">No matches found</h2>
            <p className="text-text-secondary mb-6">
              Try adjusting your filters or create a travel plan to get better matches
            </p>
            <Button variant="outline" onClick={() => navigate('/travel-plans')}>
              Create a Travel Plan
            </Button>
          </Card>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onInterested={handleInterested}
                  onSkip={handleSkip}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}