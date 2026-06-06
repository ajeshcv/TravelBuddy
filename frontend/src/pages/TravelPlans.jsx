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
  X,
  Check,
  Plane,
  Clock,
  Users,
} from 'lucide-react';
import { Card, Button, Input, Modal, Avatar, Skeleton, SkeletonCard } from '../components/ui';
import Layout from '../components/layout/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const travelStyles = ['Adventure', 'Relaxation', 'Cultural', 'Beach', 'Mountain', 'City', 'Nature', 'Food'];

const TravelPlanCard = ({ plan, onEdit, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(plan)}
              className="p-2 rounded-lg bg-white/90 hover:bg-white shadow-md transition-colors"
            >
              <Edit2 className="w-4 h-4 text-text" />
            </button>
            <button
              onClick={() => onDelete(plan)}
              className="p-2 rounded-lg bg-white/90 hover:bg-danger hover:text-white shadow-md transition-colors"
            >
              <Trash2 className="w-4 h-4 text-text" />
            </button>
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
              <span>Looking for a buddy</span>
            </div>
            <button className="text-sm text-primary font-medium hover:underline">
              Find Matches →
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function TravelPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelStyle: '',
    description: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlan) {
        // Update existing plan
        await api.put(`/api/travel-plans/${selectedPlan.id}`, formData);
        toast.success('Travel plan updated successfully!');
      } else {
        // Create new plan
        await api.post('/api/travel-plans', formData);
        toast.success('Travel plan created successfully!');
      }
      setIsModalOpen(false);
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelStyle: '',
        description: '',
      });
      setSelectedPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save travel plan');
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      destination: plan.destination,
      startDate: plan.startDate?.split('T')[0] || '',
      endDate: plan.endDate?.split('T')[0] || '',
      budget: plan.budget || '',
      travelStyle: plan.travelStyle || '',
      description: plan.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
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

  const filteredPlans = plans.filter(
    (plan) =>
      plan.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.travelStyle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">My Travel Plans</h1>
            <p className="text-text-secondary mt-1">
              Plan your adventures and find travel buddies
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create Plan
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search destinations or travel styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
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
            <h2 className="text-xl font-bold text-text mb-2">No travel plans yet</h2>
            <p className="text-text-secondary mb-6">
              Create your first travel plan and start finding travel buddies
            </p>
            <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
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
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
          setFormData({
            destination: '',
            startDate: '',
            endDate: '',
            budget: '',
            travelStyle: '',
            description: '',
          });
        }}
        title={selectedPlan ? 'Edit Travel Plan' : 'Create Travel Plan'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Destination"
            name="destination"
            placeholder="Where do you want to go?"
            value={formData.destination}
            onChange={handleInputChange}
            leftIcon={<MapPin className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget ($)"
              name="budget"
              type="number"
              placeholder="Enter your budget"
              value={formData.budget}
              onChange={handleInputChange}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Travel Style</label>
              <select
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select style</option>
                {travelStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your travel plans..."
              rows={4}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </form>
      </Modal>

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