import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  Users,
  MessageCircle,
  Heart,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/travel-plans', icon: MapPin, label: 'Travel Plans' },
  { path: '/my-plans', icon: Compass, label: 'My Plans' },
  { path: '/find-matches', icon: Users, label: 'Find Buddies' },
  { path: '/my-matches', icon: Heart, label: 'My Matches' },
  { path: '/chats', icon: MessageCircle, label: 'Chats' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-text">TravelBuddy</h1>
            <p className="text-xs text-text-muted">Find your travel match</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-border-light hover:text-text'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-border-light transition-colors cursor-pointer"
        >
          <Avatar
            src={user?.profileImage}
            name={user?.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </NavLink>

        <div className="flex items-center gap-2 px-2">
          <button
            onClick={toggleDarkMode}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-border-light hover:text-text transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-border text-danger hover:bg-danger/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}