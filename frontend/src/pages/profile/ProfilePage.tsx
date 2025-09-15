import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="card">
        <div className="card-body text-center">
          <p className="text-gray-600">Profile management features will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

