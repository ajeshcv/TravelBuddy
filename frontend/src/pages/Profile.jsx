import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Globe,
  Heart,
  Edit3,
  Camera,
  Save,
  X,
  MessageCircle,
} from 'lucide-react';
import { Card, Button, Input, Avatar, Skeleton } from '../components/ui';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const interestOptions = [
  'Adventure', 'Beach', 'Cultural', 'Food', 'History', 'Hiking',
  'Nightlife', 'Photography', 'Relaxation', 'Shopping', 'Wildlife',
];

const travelStyleOptions = [
  'Budget', 'Luxury', 'Backpacking', 'Family', 'Solo', 'Couples',
];

const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Arabic',
];

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isViewingOwnProfile = !userId || userId === currentUser?.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    country: '',
    city: '',
    interests: [],
    travelStyle: '',
    languages: [],
    dateOfBirth: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      if (userId && userId !== currentUser?.id) {
        // Viewing another user's profile
        const response = await api.get(`/api/users/${userId}`);
        setProfileUser(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          country: response.data.country || '',
          city: response.data.city || '',
          interests: response.data.interests || [],
          travelStyle: response.data.travelStyle || '',
          languages: response.data.languages || [],
          dateOfBirth: response.data.dateOfBirth || '',
        });
      } else {
        // Viewing own profile
        setProfileUser(currentUser);
        setFormData({
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          bio: currentUser?.bio || '',
          country: currentUser?.country || '',
          city: currentUser?.city || '',
          interests: currentUser?.interests || [],
          travelStyle: currentUser?.travelStyle || '',
          languages: currentUser?.languages || [],
          dateOfBirth: currentUser?.dateOfBirth || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleLanguage = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.put('/api/users/profile', formData);
      updateUser({ ...currentUser, ...formData });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'travelbuddy');

      // Upload to Cloudinary (or your backend endpoint)
      const response = await api.post('/api/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.data.url;
      await api.put('/api/users/profile', { profileImage: imageUrl });
      updateUser({ ...currentUser, profileImage: imageUrl });
      setProfileUser({ ...profileUser, profileImage: imageUrl });
      toast.success('Profile image updated!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const getProfileCompletion = () => {
    let completed = 0;
    let total = 8;

    if (formData.name) completed++;
    if (formData.email) completed++;
    if (formData.bio) completed++;
    if (formData.country) completed++;
    if (formData.interests.length > 0) completed++;
    if (formData.travelStyle) completed++;
    if (formData.languages.length > 0) completed++;
    if (profileUser?.profileImage) completed++;

    return Math.round((completed / total) * 100);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Header */}
        <div className="relative -mt-20 px-6">
          <div className="flex items-end gap-6">
            <div className="relative">
              <Avatar
                src={profileUser?.profileImage}
                name={profileUser?.name}
                size="2xl"
                className="w-32 h-32 border-4 border-surface shadow-xl"
              />
              {isViewingOwnProfile && (
                <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text">{profileUser?.name}</h1>
                {isViewingOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 rounded-lg border border-border hover:bg-border-light transition-colors"
                  >
                    {isEditing ? <X className="w-5 h-5 text-text-secondary" /> : <Edit3 className="w-5 h-5 text-text-secondary" />}
                  </button>
                ) : (
                  <Button
                    onClick={() => navigate(`/chat/${userId}`)}
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                  >
                    Message
                  </Button>
                )}
              </div>
              <p className="text-text-secondary">{profileUser?.email}</p>
            </div>

            {/* Profile Completion */}
            {isViewingOwnProfile && (
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-text-muted mb-1">Profile Completion</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-border-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${getProfileCompletion()}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary">{getProfileCompletion()}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share your travel story, interests, and what you're looking for in a travel buddy..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              ) : (
                <p className="text-text-secondary">
                  {formData.bio || 'No bio yet.'}
                </p>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Interests</h2>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-white'
                          : 'bg-border-light text-text-secondary hover:bg-border'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : formData.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <span key={interest} className="badge badge-primary">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">No interests added yet.</p>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Travel Preferences</h2>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-text">Travel Style</label>
                      <select
                        name="travelStyle"
                        value={formData.travelStyle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="">Select style</option>
                        {travelStyleOptions.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-text">Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              formData.languages.includes(lang)
                                ? 'bg-accent text-white'
                                : 'bg-border-light text-text-secondary hover:bg-border'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {formData.travelStyle && (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-text-muted" />
                        <span className="text-text-secondary">Travel Style: </span>
                        <span className="badge badge-primary">{formData.travelStyle}</span>
                      </div>
                    )}
                    {formData.languages.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Globe className="w-4 h-4 text-text-muted" />
                        <span className="text-text-secondary">Languages: </span>
                        {formData.languages.map((lang) => (
                          <span key={lang} className="badge badge-accent">{lang}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Basic Info</h2>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      leftIcon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Your country"
                      leftIcon={<MapPin className="w-4 h-4" />}
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center">
                        <User className="w-5 h-5 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Name</p>
                        <p className="font-medium text-text">{formData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center">
                        <Mail className="w-5 h-5 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Email</p>
                        <p className="font-medium text-text">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Location</p>
                        <p className="font-medium text-text">
                          {formData.country ? `${formData.city || ''}, ${formData.country}`.trim() : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    fullWidth
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    fullWidth
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>

            {/* Stats */}
            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Trips Planned</span>
                  <span className="font-bold text-text">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Travel Buddies</span>
                  <span className="font-bold text-text">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Countries Visited</span>
                  <span className="font-bold text-text">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}