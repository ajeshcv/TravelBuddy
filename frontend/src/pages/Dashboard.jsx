import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  MessageCircle,
  Heart,
  Plus,
  ArrowRight,
  Plane,
  UserPlus,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Avatar, Skeleton, Button } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <Card className="relative overflow-hidden" padding={false}>
    <div className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          {loading ? (
            <Skeleton width={60} height={32} />
          ) : (
            <p className="text-3xl font-bold text-text">{value}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
  </Card>
);

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-md transition-all duration-200"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-text">{label}</p>
      <p className="text-sm text-text-muted">Click to explore</p>
    </div>
    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    trips: 0,
    matches: 0,
    chats: 0,
    pendingRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's travel plans
      const plansResponse = await api.get('/api/travel-plans/my-plans');
      const trips = plansResponse.data.length || 0;

      // Fetch matches
      try {
        const matchesResponse = await api.get('/api/matches');
        const matches = matchesResponse.data.length || 0;
        setStats(prev => ({ ...prev, matches }));
      } catch (e) {
        // Matches endpoint might return empty
        setStats(prev => ({ ...prev, matches: 0 }));
      }

      // Fetch pending match requests
      try {
        const requestsResponse = await api.get('/api/match-requests/received');
        const pendingRequests = requestsResponse.data.length || 0;
        setStats(prev => ({ ...prev, pendingRequests }));
      } catch (e) {
        setStats(prev => ({ ...prev, pendingRequests: 0 }));
      }

      setStats(prev => ({ ...prev, trips }));

      // Set empty activity for now - will be populated when backend supports it
      setRecentActivity([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-text">
              Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-text-secondary mt-1">
              Ready to plan your next adventure?
            </p>
          </div>
          <Button
            onClick={() => navigate('/travel-plans')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Travel Plan
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={MapPin}
            label="Total Trips"
            value={stats.trips}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            loading={loading}
          />
          <StatCard
            icon={Heart}
            label="Total Matches"
            value={stats.matches}
            color="bg-gradient-to-br from-pink-500 to-rose-500"
            loading={loading}
          />
          <StatCard
            icon={MessageCircle}
            label="Active Chats"
            value={stats.chats}
            color="bg-gradient-to-br from-green-500 to-emerald-500"
            loading={loading}
          />
          <StatCard
            icon={UserPlus}
            label="Pending Requests"
            value={stats.pendingRequests}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  icon={Plus}
                  label="Create Travel Plan"
                  to="/travel-plans"
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <QuickAction
                  icon={Users}
                  label="Find Travel Buddies"
                  to="/find-matches"
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <QuickAction
                  icon={Heart}
                  label="My Matches"
                  to="/my-matches"
                  color="bg-gradient-to-br from-pink-500 to-rose-500"
                />
                <QuickAction
                  icon={MessageCircle}
                  label="View Chats"
                  to="/chats"
                  color="bg-gradient-to-br from-green-500 to-emerald-500"
                />
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton variant="circular" width={40} height={40} />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" height={14} width="70%" />
                        <Skeleton variant="text" height={12} width="40%" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Start by creating a travel plan!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-border-light transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                        <Send className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text">{activity.message}</p>
                        <p className="text-xs text-text-muted">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Trips */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text">Upcoming Trips</h2>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              {loading ? (
                <Skeleton height={80} />
              ) : stats.trips === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
                  <p className="text-text-secondary">No upcoming trips</p>
                  <button
                    onClick={() => navigate('/travel-plans')}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    Create your first plan
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-border-light">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text">Your Trip</p>
                      <p className="text-xs text-text-muted">Check your plans</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Recommended Buddies */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text">Find Buddies</h2>
                <button className="text-sm text-primary hover:underline" onClick={() => navigate('/find-matches')}>View all</button>
              </div>
              <div className="text-center py-4">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-text-secondary text-sm">Find travelers who match your style</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/find-matches')}
                  className="mt-3"
                >
                  Start Exploring
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}