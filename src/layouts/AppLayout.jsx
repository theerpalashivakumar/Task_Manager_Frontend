import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { lockExplanation } from '../redux/slices/uiSlice';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ViewProjectModal from '../components/layout/ViewProjectModal';
import ToastContainer from '../components/common/ToastContainer';

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // If the user was on the architecture docs and navigates away, lock them
    if (prevPathRef.current === '/project-explanation' && location.pathname !== '/project-explanation') {
      dispatch(lockExplanation());
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, dispatch]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Toast Notifications */}
      <ViewProjectModal />
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
