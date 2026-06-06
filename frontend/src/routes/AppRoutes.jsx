import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import TravelPlans from '../pages/TravelPlans';
import MyPlans from '../pages/MyPlans';
import FindMatches from '../pages/FindMatches';
import MyMatches from '../pages/MyMatches';
import Chat from '../pages/Chat';
import Chats from '../pages/Chats';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/travel-plans"
          element={
            <ProtectedRoute>
              <TravelPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-plans"
          element={
            <ProtectedRoute>
              <MyPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-matches"
          element={
            <ProtectedRoute>
              <FindMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-matches"
          element={
            <ProtectedRoute>
              <MyMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-text mb-4">404</h1>
                <p className="text-text-secondary mb-6">Page not found</p>
                <a
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  Go to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;