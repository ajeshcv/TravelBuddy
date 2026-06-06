import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Plane,
  Clock,
  Users,
  Eye,
} from 'lucide-react';
import { Card, Button, Input, Modal, Avatar, Skeleton, SkeletonCard } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TravelPlanCard = ({ plan, onEdit, onDelete, onView }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = new Date(plan.endDate) > new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full flex flex-col" padding={false}>
        {/* Header Image */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/30" />
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isUpcoming ? 'bg-success/90 text-white' : 'bg-text-muted/90 text-white'
            }`}>
              {isUpcoming ? 'Upcoming' : 'Past'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-text mb-1">{plan.destination}</h3>
          <p className="text-sm text-text-muted mb-4 line-clamp-2">
            {plan.description || 'An amazing travel adventure awaits!'}
          </p>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <DollarSign className="w-4 h-4" />
              <span>${plan.budget?.toLocaleString() || 'Flexible'}</span>
            </div>
            {plan.travelStyle && (
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">{plan.travelStyle}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Users className="w-4 h-4" />
              <span>{plan.matchCount || 0} matches</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(plan)}
                className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(plan)}
                className="p-2 rounded-lg hover:bg-border-light transition-colors text-text-secondary"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(plan)}
                className="p-2 rounded-lg hover:bg-danger/10 transition-colors text-danger"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/travel-plans/my-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load travel plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    navigate('/travel-plans', { state: { editPlan: plan } });
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleView = (plan) => {
    toast(`Viewing plan: ${plan.destination}`);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/travel-plans/${selectedPlan.id}`);
      toast.success('Travel plan deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete travel plan');
    }
  };

  const filteredPlans = plans
    .filter((plan) => {
      const matchesSearch =
        plan.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.travelStyle?.toLowerCase().includes(searchQuery.toLowerCase());

      const isUpcoming = new Date(plan.endDate) > new Date();
      if (filter === 'upcoming') return matchesSearch && isUpcoming;
      if (filter === 'past') return matchesSearch && !isUpcoming;
      return matchesSearch;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">My Travel Plans</h1>
            <p className="text-text-secondary mt-1">
              Manage your travel adventures
            </p>
          </div>
          <Button onClick={() => navigate('/travel-plans')} leftIcon={<Plus className="w-4 h-4" />}>
            Create Plan
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            {['all', 'upcoming', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-border-light'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="text-center py-16">
            <Plane className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-text mb-2">
              No {filter !== 'all' ? filter : ''} travel plans
            </h2>
            <p className="text-text-secondary mb-6">
              {filter === 'all'
                ? 'Create your first travel plan and start finding travel buddies'
                : `You don't have any ${filter} travel plans`}
            </p>
            <Button onClick={() => navigate('/travel-plans')} leftIcon={<Plus className="w-4 h-4" />}>
              Create Your First Plan
            </Button>
          </Card>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlans.map((plan) => (
              <TravelPlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Travel Plan"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Plan
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-danger" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">Are you sure?</h3>
          <p className="text-text-secondary">
            This action cannot be undone. This will permanently delete your travel plan to{' '}
            <strong>{selectedPlan?.destination}</strong>.
          </p>
        </div>
      </Modal>
    </Layout>
  );
}