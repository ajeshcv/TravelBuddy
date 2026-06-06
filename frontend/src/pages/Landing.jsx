import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Heart,
  MessageCircle,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Plane,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui';

const features = [
  {
    icon: MapPin,
    title: 'Plan Your Journey',
    description: 'Create detailed travel plans with destinations, dates, budgets, and travel styles.',
  },
  {
    icon: Users,
    title: 'Find Your Match',
    description: 'Our intelligent matching system connects you with compatible travel companions.',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Chat',
    description: 'Real-time messaging to coordinate plans and get to know your travel buddy.',
  },
  {
    icon: Shield,
    title: 'Travel Safely',
    description: 'Verified profiles and secure communication for peace of mind.',
  },
];

const benefits = [
  {
    icon: Globe,
    title: 'Explore Together',
    description: 'Share costs, experiences, and memories with like-minded travelers.',
  },
  {
    icon: Heart,
    title: 'Meaningful Connections',
    description: 'Build friendships that last beyond your travel adventures.',
  },
  {
    icon: Zap,
    title: 'Spontaneous Adventures',
    description: 'Find last-minute travel companions for impromptu trips.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-text">TravelBuddy</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800')] bg-cover bg-center opacity-5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Plane className="w-6 h-6 text-primary" />
              <span className="text-primary font-medium">Your Adventure Awaits</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Travel Companion
              </span>
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Connect with like-minded travelers, plan amazing trips together,
              and create unforgettable memories. Your next adventure starts here.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-8 py-4"
              >
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              <div>
                <div className="text-3xl font-bold text-text">10K+</div>
                <div className="text-sm text-text-muted">Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-text">50+</div>
                <div className="text-sm text-text-muted">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-text">5K+</div>
                <div className="text-sm text-text-muted">Trips Planned</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-text-muted flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-text-muted rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">How It Works</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Finding your perfect travel companion has never been easier.
              Our platform makes it simple to connect, plan, and explore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">Why TravelBuddy?</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Traveling with a companion enhances every aspect of your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect travel companions.
            Your next unforgettable journey is just a click away.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-text">TravelBuddy</span>
            </div>
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} TravelBuddy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-text-muted hover:text-text transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}