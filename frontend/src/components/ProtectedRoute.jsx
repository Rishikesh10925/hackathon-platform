import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkUserStatus() {
      try {
        // AWS Amplify v6 syntax to get user details
        await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        // Ensure formatting matches (e.g. mapping "Admin" to "admin")
        const userRole = attributes['custom:role']?.toLowerCase();
        
        setRole(userRole);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Session check failed', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkUserStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-semibold text-slate-500">
        Verifying Identity constraints...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole.toLowerCase()) {
    // Redirect admin trying to access judge screens or vice versa
    return <Navigate to={role === 'admin' ? '/admin' : '/judge'} replace />;
  }

  return children;
};
