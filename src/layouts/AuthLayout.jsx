import React from 'react';
import { Outlet } from 'react-router-dom';
import ToastContainer from '../components/common/ToastContainer';
import { FolderKanban } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Floating Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto w-full z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">TeamPulse</span>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10 animate-fade-in my-8">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
