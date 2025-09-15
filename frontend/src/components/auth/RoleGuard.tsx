import React from 'react';
import { useUser } from '@/store/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = (
    <div className="text-center py-12">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
        <p className="mt-2 text-sm text-yellow-700">
          You don't have permission to access this feature. This feature is only available for restaurant owners and administrators.
        </p>
      </div>
    </div>
  )
}) => {
  const user = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;

