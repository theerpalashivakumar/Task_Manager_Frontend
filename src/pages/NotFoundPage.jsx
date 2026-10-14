import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <span className="text-6xl font-black text-brand-600">404</span>
      <h2 className="text-2xl font-bold text-slate-900 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="primary" size="md" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
