import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [], redirectTo = '/login' }) => {
  const { user, loading, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    // Redirect to appropriate dashboard based on user role
    let dashboardPath = '/';
    if (user.role === 'admin') {
      dashboardPath = '/admin/dashboard';
    } else if (user.role === 'doctor') {
      dashboardPath = '/doctor/dashboard';
    } else if (user.role === 'patient') {
      dashboardPath = '/patient/dashboard';
    }
    
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute; 