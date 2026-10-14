import React from 'react';

const Badge = ({ variant = 'default', children, size = 'sm', className = '' }) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    // Project Statuses
    Planning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200',
    Completed: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',

    // Task Statuses
    'To Do': 'bg-slate-100 text-slate-700 border-slate-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200/80',
    'In Review': 'bg-purple-50 text-purple-700 border-purple-200/80',
    Done: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',

    // Task Priorities
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200/80',
    High: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Critical: 'bg-rose-50 text-rose-700 border-rose-200/80 animate-pulse',

    // Roles
    admin: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
    project_manager: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
    team_member: 'bg-teal-50 text-teal-700 border-teal-200 font-semibold',

    // Generic
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    default: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const styleClass = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles[size]} ${styleClass} ${className}`}
    >
      {children || variant}
    </span>
  );
};

export default Badge;
