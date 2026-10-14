import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardSummary } from '../../redux/slices/dashboardSlice';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Clock,
  Activity,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Calendar,
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardSummary());
  };

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { projects = {}, tasks = {}, recentActivities = [] } = summary || {};
  const tasksByStatus = tasks.byStatus || { 'To Do': 0, 'In Progress': 0, 'In Review': 0, 'Done': 0 };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status metrics and progress overview across your workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
            icon={RefreshCw}
          >
            Refresh
          </Button>

          {(user?.role === 'admin' || user?.role === 'project_manager') && (
            <Link to="/projects">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                New Project
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>Failed to load live metrics: {error}</span>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{projects.total || 0}</span>
            <span className="text-xs text-emerald-600 font-semibold">
              {projects.active || 0} active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Completed: {projects.completed || 0}</span>
            <span>Avg: {projects.averageCompletion || 0}%</span>
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{tasks.total || 0}</span>
            <span className="text-xs text-blue-600 font-semibold">
              {tasksByStatus['Done'] || 0} completed
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>In Progress: {tasksByStatus['In Progress'] || 0}</span>
            <span>To Do: {tasksByStatus['To Do'] || 0}</span>
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div
              className={`p-2 rounded-xl ${
                tasks.overdue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                tasks.overdue > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {tasks.overdue || 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Needs Attention</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            {tasks.overdue > 0 ? (
              <span className="text-rose-600 font-semibold">Action required on deadlines</span>
            ) : (
              <span className="text-emerald-600 font-semibold">All tasks on schedule</span>
            )}
          </div>
        </div>

        {/* My Assigned Tasks Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Pending Tasks
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{tasks.myPending || 0}</span>
            <span className="text-xs text-slate-500 font-medium">Assigned to you</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Link to="/tasks" className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
              View my tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Progress & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Breakdown Visual */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Tasks Status Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-1">Real-time status breakdown</p>

            <div className="mt-6 space-y-4">
              {[
                { label: 'To Do', count: tasksByStatus['To Do'] || 0, color: 'bg-slate-400' },
                { label: 'In Progress', count: tasksByStatus['In Progress'] || 0, color: 'bg-blue-500' },
                { label: 'In Review', count: tasksByStatus['In Review'] || 0, color: 'bg-purple-500' },
                { label: 'Done', count: tasksByStatus['Done'] || 0, color: 'bg-emerald-500' },
              ].map((statusItem) => {
                const total = tasks.total || 1;
                const percentage = Math.round((statusItem.count / total) * 100);
                return (
                  <div key={statusItem.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{statusItem.label}</span>
                      <span>
                        {statusItem.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${statusItem.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Completion Rate</span>
            <span className="font-bold text-slate-900">{projects.averageCompletion || 0}%</span>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                Upcoming Task Deadlines
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tasks nearing completion target</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {tasks.upcoming && tasks.upcoming.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {tasks.upcoming.map((task) => (
                <div key={task._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/tasks/${task._id}`}
                      className="text-sm font-semibold text-slate-900 hover:text-brand-600 truncate block"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{task.project?.name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        Assigned to {task.assignedTo?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.priority} size="xs">
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status} size="xs">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No pending tasks scheduled with upcoming deadlines.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-brand-600" />
          Recent Team Activity Trail
        </h3>

        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act._id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                  {act.performedBy?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium">{act.details}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(act.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No activity records registered yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
