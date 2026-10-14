import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openExplanationModal } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import Badge from '../common/Badge';
import {
  Menu,
  Sparkles,
  Unlock,
  LogOut,
  FolderKanban,
  CheckCircle,
} from 'lucide-react';

const Navbar = ({ onMobileMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isExplanationUnlocked } = useSelector((state) => state.ui);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleViewProjectClick = () => {
    if (isExplanationUnlocked) {
      navigate('/project-explanation');
    } else {
      dispatch(openExplanationModal());
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Workspace Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Workspace
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Prominent "View Project" Button */}
        <button
          id="btn-view-project"
          onClick={handleViewProjectClick}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isExplanationUnlocked
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-95 hover:shadow-brand-500/25 active:scale-95'
          }`}
          title="System Architecture & Portfolio Documentation"
        >
          {isExplanationUnlocked ? (
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isExplanationUnlocked ? 'Architecture Docs' : 'View Project'}</span>
        </button>

        {/* User Info & Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
              <Badge variant={user.role} size="xs" className="mt-0.5 justify-end self-end">
                {user.role?.replace('_', ' ')}
              </Badge>
            </div>

            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm ring-2 ring-brand-100 shadow-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
