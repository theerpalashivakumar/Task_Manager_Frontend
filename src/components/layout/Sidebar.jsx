import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openExplanationModal } from '../../redux/slices/uiSlice';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  ShieldCheck,
  X,
  Sparkles,
  Globe,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isExplanationUnlocked } = useSelector((state) => state.ui);

  const apiDocsUrl =
    (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '') +
    '/api/docs';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    ...(user?.role === 'admin' || user?.role === 'project_manager'
      ? [{ label: 'Team Directory', path: '/users', icon: Users }]
      : []),
    {
      label: 'Architecture & Docs',
      path: '/project-explanation',
      icon: ShieldCheck,
      badge: isExplanationUnlocked ? 'Unlocked' : 'Protected',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 shrink-0 bg-slate-950 text-white flex flex-col z-40 border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white leading-tight block">
                TeamPulse
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Workspace OS</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 min-h-0 px-3.5 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  onClose();
                  if (item.path === '/project-explanation' && !isExplanationUnlocked) {
                    e.preventDefault();
                    dispatch(openExplanationModal());
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isExplanationUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* <a
            href={apiDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-all mt-3 border-t border-slate-800/60 pt-3"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Swagger API Docs</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OpenAPI
            </span>
          </a> */}
        </nav>

        {/* Footer Info - Always pinned to bottom of sidebar */}
        <div className="p-4 border-t border-slate-800/80 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
            <p className="text-slate-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Role Authorization
            </p>
            <p className="text-slate-400 mt-1 capitalize text-[11px]">
              Active: <span className="text-white font-semibold">{user?.role?.replace('_', ' ')}</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
