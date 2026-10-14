import React from 'react';

const Badge = ({ variant = 'default', children, size = 'sm', className = '' }) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    // Project Statuses
    Planning: 'bg-amber-50 text-amber-700 border-amber-200/90 font-medium',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 font-medium',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200/90 font-medium',
    Completed: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 font-medium',

    // Task Statuses
    'To Do': 'bg-slate-100 text-slate-700 border-slate-200/90 font-medium',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200/90 font-medium',
    'In Review': 'bg-purple-50 text-purple-700 border-purple-200/90 font-medium',
    Done: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 font-medium',

    // Task Priorities
    Low: 'bg-slate-50 text-slate-600 border-slate-200 font-medium',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200/90 font-medium',
    High: 'bg-amber-50 text-amber-700 border-amber-200/90 font-semibold',
    Critical: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',

    // Roles
    admin: 'bg-purple-50 text-purple-700 border-purple-200 font-bold',
    project_manager: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
    team_member: 'bg-teal-50 text-teal-700 border-teal-200 font-bold',

    // Generic
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    default: 'bg-slate-50 text-slate-600 border-slate-200 font-medium',
  };

  const styleClass = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${sizeStyles[size]} ${styleClass} ${className}`}
    >
      {variant === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
      {variant === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      {variant === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {children || variant}
    </span>
  );
};

export default Badge;
