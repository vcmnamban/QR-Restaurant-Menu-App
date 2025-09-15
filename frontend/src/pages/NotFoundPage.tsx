import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/dashboard" className="btn-primary inline-flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>
          
          <p className="text-sm text-gray-500">
            Or{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              return to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

